// src/app/agency-requests/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";

interface Hotel {
  id: string;
  name: string;
}

interface AccessRequest {
  id: string;
  hotel_name: string;
  status: string;
}

export default function AgencyRequests() {
  const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([]);
  const [associations, setAssociations] = useState<AccessRequest[]>([]);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
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
          .select("id")
          .eq("created_by", userId)
          .eq("role", "agency")
          .maybeSingle();

        if (!orgResponse.data) {
          alert("Solo las agencias pueden acceder a esta página");
          window.location.href = "/dashboard";
          return;
        }

        // Cargar INVITACIONES RECIBIDAS (de hoteles)
        const pendingResponse = await supabase
          .from("agency_hotel_access")
          .select("id, status, hotel_id")
          .eq("agency_id", orgResponse.data.id)
          .eq("status", "pending");

        if (pendingResponse.data) {
          const hotelIds = pendingResponse.data.map(r => r.hotel_id);
          const hotelNamesResponse = await supabase
            .from("organizations")
            .select("id, name")
            .in("id", hotelIds);

          const hotelNameMap: Record<string, string> = {};
          (hotelNamesResponse.data || []).forEach(hotel => {
            hotelNameMap[hotel.id] = hotel.name;
          });

          const formattedPending: AccessRequest[] = pendingResponse.data.map(r => ({
            id: r.id,
            hotel_name: hotelNameMap[r.hotel_id] || "Hotel desconocido",
            status: r.status
          }));

          setPendingRequests(formattedPending);
        }

        // Cargar asociaciones (aceptadas)
        const associationsResponse = await supabase
          .from("agency_hotel_access")
          .select("id, status, hotel_id")
          .eq("agency_id", orgResponse.data.id)
          .eq("status", "approved");

        if (associationsResponse.data) {
          const hotelIds = associationsResponse.data.map(r => r.hotel_id);
          const hotelNamesResponse = await supabase
            .from("organizations")
            .select("id, name")
            .in("id", hotelIds);

          const hotelNameMap: Record<string, string> = {};
          (hotelNamesResponse.data || []).forEach(hotel => {
            hotelNameMap[hotel.id] = hotel.name;
          });

          const formattedAssociations: AccessRequest[] = associationsResponse.data.map(r => ({
            id: r.id,
            hotel_name: hotelNameMap[r.hotel_id] || "Hotel desconocido",
            status: r.status
          }));

          setAssociations(formattedAssociations);
        }

        // Cargar todos los hoteles
        const allHotelsResponse = await supabase
          .from("organizations")
          .select("id, name")
          .eq("role", "hotel");

        setAllHotels(allHotelsResponse.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading ", err);
        setError("Error al cargar las invitaciones");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar hoteles mientras se escribe
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredHotels([]);
      setShowDropdown(false);
      return;
    }

    const filtered = allHotels.filter(hotel =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHotels(filtered);
    setShowDropdown(filtered.length > 0);
  }, [searchTerm, allHotels]);

  const handleSendRequest = async () => {
    if (!selectedHotel) {
      setError("Por favor, selecciona un hotel");
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

      if (!orgResponse.data) throw new Error("Agencia no encontrada");

      // ✅ Verificar si ya existe una solicitud activa
      const { data: existing } = await supabase
        .from("agency_hotel_access")
        .select("id, status")
        .eq("agency_id", orgResponse.data.id)
        .eq("hotel_id", selectedHotel.id)
        .not("status", "eq", "rejected");

      if (existing && existing.length > 0) {
        setError("Ya has enviado una solicitud a este hotel");
        return;
      }

      const { error } = await supabase
        .from("agency_hotel_access")
        .insert({
          agency_id: orgResponse.data.id,
          hotel_id: selectedHotel.id,
          status: "pending"
        });

      if (error) throw error;

      // NO recargar invitaciones pendientes
      setSelectedHotel(null);
      setSearchTerm("");
    } catch (err) {
      setError("Error al enviar solicitud: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRespond = async (requestId: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("agency_hotel_access")
        .update({ status })
        .eq("id", requestId);

      if (error) throw error;

      // Mover a asociaciones si se aprueba
      if (status === "approved") {
        const updatedRequest = pendingRequests.find(req => req.id === requestId);
        if (updatedRequest) {
          setAssociations(prev => [...prev, { ...updatedRequest, status: "approved" }]);
        }
      }

      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (err) {
      alert("Error: " + (err as Error).message);
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

      setAssociations(prev => prev.filter(assoc => assoc.id !== associationId));
    } catch (err) {
      alert("Error al eliminar asociación: " + (err as Error).message);
    }
  };

  const handleSelectHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setSearchTerm(hotel.name);
    setShowDropdown(false);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '✅ Aprobado';
      case 'rejected': return '❌ Rechazado';
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

      {/* Buscador para solicitar acceso */}
      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h3>Solicitar acceso a hotel</h3>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedHotel(null);
            }}
            placeholder="Escribe el nombre del hotel..."
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
              {filteredHotels.length === 0 ? (
                <div style={{ padding: "8px", color: "#666" }}>
                  No se encontraron hoteles
                </div>
              ) : (
                filteredHotels.map(hotel => (
                  <div
                    key={hotel.id}
                    onClick={() => handleSelectHotel(hotel)}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                  >
                    {hotel.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {selectedHotel && (
          <div style={{ marginTop: "8px", padding: "8px", backgroundColor: "#e0f2fe", borderRadius: "4px" }}>
            <strong>Seleccionado:</strong> {selectedHotel.name}
          </div>
        )}

        <button
          onClick={handleSendRequest}
          disabled={!selectedHotel || submitting}
          style={{ 
            marginTop: "12px",
            padding: "8px 16px", 
            backgroundColor: selectedHotel ? "#10b981" : "#ccc", 
            color: "white", 
            border: "none", 
            borderRadius: "4px", 
            cursor: selectedHotel ? "pointer" : "not-allowed"
          }}
        >
          {submitting ? "Enviando..." : "Solicitar acceso"}
        </button>
      </div>

      {/* Invitaciones pendientes */}
      <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3>Invitaciones pendientes</h3>
        {pendingRequests.length === 0 ? (
          <p>No tienes invitaciones pendientes de hoteles.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {pendingRequests.map(request => (
              <li 
                key={request.id} 
                style={{ 
                  padding: "12px", 
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <strong>{request.hotel_name}</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>{getStatusText(request.status)}</span>
                  {request.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleRespond(request.id, "approved")}
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
                        onClick={() => handleRespond(request.id, "rejected")}
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