"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

interface AccessRequest {
  id: string;
  agency_name: string;
  status: string;
  requested_by: string;
}

interface Agency {
  id: string;
  name: string;
}

export default function HotelRequests() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedAgency, setSelectedAgency] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // Verificar sesión
        const sessionResponse = await supabase.auth.getSession();
        if (!sessionResponse.data.session) {
          window.location.href = "/login";
          return;
        }

        const userId = sessionResponse.data.session.user.id;
        
        // Verificar que es un hotel
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

        // Cargar solicitudes pendientes y aprobadas
        const requestsResponse = await supabase
          .from("agency_hotel_access")
          .select(`
            id,
            status,
            requested_by,
            agency_id
          `)
          .eq("hotel_id", hotelId);

        if (requestsResponse.data) {
          const agencyIds = requestsResponse.data.map(r => r.agency_id);
          const agenciesResponse = await supabase
            .from("organizations")
            .select("id, name")
            .in("id", agencyIds);

          const agencyNameMap: Record<string, string> = {};
          (agenciesResponse.data || []).forEach(agency => {
            agencyNameMap[agency.id] = agency.name;
          });

          const formattedRequests = requestsResponse.data.map(r => ({
            id: r.id,
            agency_name: agencyNameMap[r.agency_id] || 'Agencia desconocida',
            status: r.status,
            requested_by: r.requested_by
          }));

          setRequests(formattedRequests);
        }

        // Cargar todas las agencias para invitaciones
        const allAgenciesResponse = await supabase
          .from("organizations")
          .select("id, name")
          .eq("role", "agency");

        setAgencies(allAgenciesResponse.data || []);

        setLoading(false);
      } catch (err) {
        console.error("Error loading ", err);
        setError("Error al cargar los datos");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    setSubmitting(true);
    setError("");

    try {
      const { error } = await supabase
        .from("agency_hotel_access")
        .update({ status: newStatus })
        .eq("id", requestId);

      if (error) throw error;

      // Recargar solicitudes
      const sessionResponse = await supabase.auth.getSession();
      const userId = sessionResponse.data.session?.user.id;
      const orgResponse = await supabase
        .from("organizations")
        .select("id")
        .eq("created_by", userId)
        .maybeSingle();

      if (orgResponse.data) {
        const requestsResponse = await supabase
          .from("agency_hotel_access")
          .select(`
            id,
            status,
            requested_by,
            agency_id
          `)
          .eq("hotel_id", orgResponse.data.id);

        if (requestsResponse.data) {
          const agencyIds = requestsResponse.data.map(r => r.agency_id);
          const agenciesResponse = await supabase
            .from("organizations")
            .select("id, name")
            .in("id", agencyIds);

          const agencyNameMap: Record<string, string> = {};
          (agenciesResponse.data || []).forEach(agency => {
            agencyNameMap[agency.id] = agency.name;
          });

          const formattedRequests = requestsResponse.data.map(r => ({
            id: r.id,
            agency_name: agencyNameMap[r.agency_id] || 'Agencia desconocida',
            status: r.status,
            requested_by: r.requested_by
          }));

          setRequests(formattedRequests);
        }
      }
    } catch (err) {
      setError("Error al actualizar: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

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

      const { error } = await supabase
        .from("agency_hotel_access")
        .insert({
          agency_id: selectedAgency,
          hotel_id: orgResponse.data.id,
          status: "pending",
          requested_by: "hotel"
        });

      if (error) throw error;

      // Recargar solicitudes
      const requestsResponse = await supabase
        .from("agency_hotel_access")
        .select(`
          id,
          status,
          requested_by,
          agency_id
        `)
        .eq("hotel_id", orgResponse.data.id);

      if (requestsResponse.data) {
        const agencyIds = requestsResponse.data.map(r => r.agency_id);
        const agenciesResponse = await supabase
          .from("organizations")
          .select("id, name")
          .in("id", agencyIds);

        const agencyNameMap: Record<string, string> = {};
        (agenciesResponse.data || []).forEach(agency => {
          agencyNameMap[agency.id] = agency.name;
        });

        const formattedRequests = requestsResponse.data.map(r => ({
          id: r.id,
          agency_name: agencyNameMap[r.agency_id] || 'Agencia desconocida',
          status: r.status,
          requested_by: r.requested_by
        }));

        setRequests(formattedRequests);
      }
      
      setSelectedAgency("");
    } catch (err) {
      setError("Error al enviar invitación: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
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
      <h1>Gestión de Solicitudes</h1>
      
      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      {/* Enviar invitación */}
      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h3>Enviar invitación a agencia</h3>
        <select
          value={selectedAgency}
          onChange={(e) => setSelectedAgency(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "8px", 
            margin: "8px 0",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        >
          <option value="">Selecciona una agencia</option>
          {agencies.map(agency => (
            <option key={agency.id} value={agency.id}>{agency.name}</option>
          ))}
        </select>
        <button
          onClick={handleSendInvitation}
          disabled={!selectedAgency || submitting}
          style={{ 
            padding: "8px 16px", 
            backgroundColor: selectedAgency ? "#3b82f6" : "#ccc", 
            color: "white", 
            border: "none", 
            borderRadius: "4px", 
            cursor: selectedAgency ? "pointer" : "not-allowed",
            marginTop: "8px"
          }}
        >
          {submitting ? "Enviando..." : "Enviar invitación"}
        </button>
      </div>

      {/* Lista de solicitudes */}
      <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h3>Solicitudes e invitaciones</h3>
        {requests.length === 0 ? (
          <p>No tienes solicitudes ni invitaciones pendientes.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {requests.map(request => (
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
                  <strong>{request.agency_name}</strong>
                  {request.requested_by === 'agency' && (
                    <span style={{ marginLeft: "8px", backgroundColor: "#fef3c7", padding: "2px 6px", borderRadius: "4px", fontSize: "0.85rem" }}>
                      Solicitud de agencia
                    </span>
                  )}
                  {request.requested_by === 'hotel' && (
                    <span style={{ marginLeft: "8px", backgroundColor: "#e0f2fe", padding: "2px 6px", borderRadius: "4px", fontSize: "0.85rem" }}>
                      Invitación enviada
                    </span>
                  )}
                </div>
                <div>
                  <span style={{ marginRight: "8px" }}>{getStatusText(request.status)}</span>
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(request.id, 'approved')}
                        disabled={submitting}
                        style={{ 
                          padding: "4px 8px", 
                          backgroundColor: "#10b981", 
                          color: "white", 
                          border: "none", 
                          borderRadius: "4px",
                          marginRight: "4px"
                        }}
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(request.id, 'rejected')}
                        disabled={submitting}
                        style={{ 
                          padding: "4px 8px", 
                          backgroundColor: "#ef4444", 
                          color: "white", 
                          border: "none", 
                          borderRadius: "4px"
                        }}
                      >
                        Rechazar
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