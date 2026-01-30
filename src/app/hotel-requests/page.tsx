// src/app/hotel-requests/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";

interface AccessRequest {
  id: string;
  agency_name: string;
  status: string;
}

interface Agency {
  id: string;
  name: string;
}

export default function HotelRequests() {
  const [pendingInvitations, setPendingInvitations] = useState<AccessRequest[]>([]);
  const [associations, setAssociations] = useState<AccessRequest[]>([]);
  const [allAgencies, setAllAgencies] = useState<Agency[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sessionResponse = await supabase.auth.getSession();
        if (!sessionResponse.data.session) {
          window.location.href = "/login";
          return;
        }

        const userId = sessionResponse.data.session.user.id;
        
        const orgResponse = await supabase
          .from("organizations")
          .select("id, role")
          .eq("created_by", userId)
          .maybeSingle();

        if (!orgResponse.data || orgResponse.data.role !== "hotel") {
          alert("Solo los hoteles pueden acceder a esta página");
          window.location.href = "/dashboard";
          return;
        }

        const hotelId = orgResponse.data.id;

        // Cargar invitaciones pendientes
        const pendingResponse = await supabase
          .from("agency_hotel_access")
          .select("id, status, agency_id")
          .eq("hotel_id", hotelId) // ← CORREGIDO: minúscula
          .eq("status", "pending");

        const pendingAgencyIds = pendingResponse.data?.map(inv => inv.agency_id) || [];
        const pendingAgenciesResponse = await supabase
          .from("organizations")
          .select("id, name")
          .in("id", pendingAgencyIds);

        const pendingAgencyNameMap: Record<string, string> = {};
        (pendingAgenciesResponse.data || []).forEach(agency => {
          pendingAgencyNameMap[agency.id] = agency.name;
        });

        const formattedPending = (pendingResponse.data || []).map(inv => ({
          id: inv.id,
          agency_name: pendingAgencyNameMap[inv.agency_id] || "Agencia desconocida",
          status: inv.status
        }));

        setPendingInvitations(formattedPending);

        // Cargar asociaciones (aceptadas)
        const associationsResponse = await supabase
          .from("agency_hotel_access")
          .select("id, status, agency_id")
          .eq("hotel_id", hotelId) // ← CORREGIDO: minúscula
          .eq("status", "approved");

        const associationAgencyIds = associationsResponse.data?.map(inv => inv.agency_id) || [];
        const associationAgenciesResponse = await supabase
          .from("organizations")
          .select("id, name")
          .in("id", associationAgencyIds);

        const associationAgencyNameMap: Record<string, string> = {};
        (associationAgenciesResponse.data || []).forEach(agency => {
          associationAgencyNameMap[agency.id] = agency.name;
        });

        const formattedAssociations: AccessRequest[] = (associationsResponse.data || []).map(inv => ({
          id: inv.id,
          agency_name: associationAgencyNameMap[inv.agency_id] || "Agencia desconocida",
          status: inv.status
        }));

        setAssociations(formattedAssociations);

        // Cargar todas las agencias
        const allAgenciesResponse = await supabase
          .from("organizations")
          .select("id, name")
          .eq("role", "agency");

        setAllAgencies(allAgenciesResponse.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading ", err);
        setError("Error al cargar los datos");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar agencias mientras se escribe
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAgencies([]);
      setShowDropdown(false);
      return;
    }

    const filtered = allAgencies.filter(agency =>
      agency.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAgencies(filtered);
    setShowDropdown(filtered.length > 0);
  }, [searchTerm, allAgencies]);

  const handleSendInvitation = async () => {
    if (!selectedAgency) {
      setError("Por favor, selecciona una agencia");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const sessionResponse = await supabase.auth.getSession();
      const userId = sessionResponse.data.session?.user.id;
      const orgResponse = await supabase
        .from("organizations")
        .select("id")
        .eq("created_by", userId)
        .maybeSingle();

      if (!orgResponse.data) throw new Error("Hotel no encontrado");

      // ✅ CORREGIDO: usar "hotel_id" en minúscula
      const { data: existing } = await supabase
        .from("agency_hotel_access")
        .select("id, status")
        .eq("hotel_id", orgResponse.data.id)
        .eq("agency_id", selectedAgency.id)
        .not("status", "eq", "rejected");

      if (existing && existing.length > 0) {
        setError("Ya has enviado una invitación a esta agencia");
        return;
      }

      const { error } = await supabase
        .from("agency_hotel_access")
        .insert({
          agency_id: selectedAgency.id,
          hotel_id: orgResponse.data.id,
          status: "pending"
        });

      if (error) throw error;

      // NO recargar invitaciones pendientes
      setSelectedAgency(null);
      setSearchTerm("");
    } catch (err) {
      setError("Error al enviar invitación: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRespond = async (invitationId: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("agency_hotel_access")
        .update({ status })
        .eq("id", invitationId);

      if (error) throw error;

      // Recargar las invitaciones pendientes
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;

      const orgResponse = await supabase
        .from("organizations")
        .select("id")
        .eq("created_by", userId)
        .maybeSingle();

      if (!orgResponse.data) return;

      const { data: pending } = await supabase
        .from("agency_hotel_access")
        .select("id, status, agency_id")
        .eq("hotel_id", orgResponse.data.id) // ← CORREGIDO: minúscula
        .eq("status", "pending");

      const agencyIds = pending?.map(p => p.agency_id) || [];
      const agencies = await supabase
        .from("organizations")
        .select("id, name")
        .in("id", agencyIds);

      const nameMap: Record<string, string> = {};
      agencies.data?.forEach(a => nameMap[a.id] = a.name);

      const formatted = pending?.map(p => ({
        id: p.id,
        agency_name: nameMap[p.agency_id] || "Agencia desconocida",
        status: p.status
      })) || [];

      setPendingInvitations(formatted);
    } catch (err) {
      alert("Error al responder: " + (err as Error).message);
    }
  };

  const handleRemoveAssociation = async (associationId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta asociación?")) return;

    try {
      const { error } = await supabase
        .from("agency_hotel_access")
        .delete()
        .eq("id", associationId);

      if (error) throw error;

      setAssociations(prev => prev.filter(a => a.id !== associationId));
    } catch (err) {
      alert("Error al eliminar asociación: " + (err as Error).message);
    }
  };

  const handleSelectAgency = (agency: Agency) => {
    setSelectedAgency(agency);
    setSearchTerm(agency.name);
    setShowDropdown(false);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '✅ Aceptada';
      case 'rejected': return '❌ Rechazada';
      case 'pending': return '⏳ Pendiente';
      default: return status;
    }
  };

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Cargando...</div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      {/* Flecha de retroceso */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => window.location.href = "/dashboard"}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#64748b",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          ← Volver al dashboard
        </button>
      </div>

      <h1>Mis asociaciones</h1>
      
      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      {/* Buscador con autocompletado */}
      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h3>Enviar invitación a agencia</h3>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedAgency(null);
            }}
            placeholder="Escribe el nombre de la agencia..."
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px"
            }}
            onFocus={() => searchTerm && setShowDropdown(true)}
          />
          
          {showDropdown && (
            <div 
              ref={dropdownRef}
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginTop: "2px",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 1000
              }}
            >
              {filteredAgencies.length === 0 ? (
                <div style={{ padding: "8px", color: "#666" }}>
                  No se encontraron agencias
                </div>
              ) : (
                filteredAgencies.map(agency => (
                  <div
                    key={agency.id}
                    onClick={() => handleSelectAgency(agency)}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                  >
                    {agency.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {selectedAgency && (
          <div style={{ marginTop: "8px", padding: "8px", backgroundColor: "#e0f2fe", borderRadius: "4px" }}>
            <strong>Seleccionado:</strong> {selectedAgency.name}
          </div>
        )}

        <button
          onClick={handleSendInvitation}
          disabled={!selectedAgency || submitting}
          style={{ 
            marginTop: "12px",
            padding: "8px 16px", 
            backgroundColor: selectedAgency ? "#3b82f6" : "#ccc", 
            color: "white", 
            border: "none", 
            borderRadius: "4px", 
            cursor: selectedAgency ? "pointer" : "not-allowed"
          }}
        >
          {submitting ? "Enviando..." : "Enviar invitación"}
        </button>
      </div>

      {/* Invitaciones pendientes */}
      <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3>Invitaciones pendientes</h3>
        {pendingInvitations.length === 0 ? (
          <p>No tienes invitaciones pendientes.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {pendingInvitations.map(inv => (
              <li 
                key={inv.id} 
                style={{ 
                  padding: "12px", 
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <strong>{inv.agency_name}</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>{getStatusText(inv.status)}</span>
                  {inv.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleRespond(inv.id, "approved")}
                        style={{ 
                          padding: "4px 8px", 
                          backgroundColor: "#10b981", 
                          color: "white", 
                          border: "none", 
                          borderRadius: "4px",
                          fontSize: "0.85rem"
                        }}
                      >
                        ✅ Aceptar
                      </button>
                      <button
                        onClick={() => handleRespond(inv.id, "rejected")}
                        style={{ 
                          padding: "4px 8px", 
                          backgroundColor: "#ef4444", 
                          color: "white", 
                          border: "none", 
                          borderRadius: "4px",
                          fontSize: "0.85rem"
                        }}
                      >
                        ❌ Rechazar
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}