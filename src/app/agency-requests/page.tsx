"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

interface Hotel {
  id: string;
  name: string;
}

interface AccessRequest {
  id: string;
  hotel_name: string;
  status: string;
  requested_by: string;
}

export default function AgencyRequests() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [requests, setRequests] = useState<AccessRequest[]>([]);
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
        
        // Verificar que es una agencia
        const orgResponse = await supabase
          .from("organizations")
          .select("id, role")
          .eq("created_by", userId)
          .maybeSingle();

        if (!orgResponse.data || orgResponse.data.role !== "agency") {
          alert("Solo las agencias pueden acceder a esta página");
          window.location.href = "/dashboard";
          return;
        }

        // Cargar hoteles disponibles
        const hotelsResponse = await supabase
          .from("organizations")
          .select("id, name")
          .eq("role", "hotel");

        setHotels(hotelsResponse.data || []);

        // Cargar solicitudes existentes
        const requestsResponse = await supabase
          .from("agency_hotel_access")
          .select(`
            id,
            status,
            requested_by,
            hotel_id
          `)
          .eq("agency_id", orgResponse.data.id);

        if (requestsResponse.data) {
          // Obtener nombres de hoteles en un paso separado para evitar problemas de relación
          const hotelIds = requestsResponse.data.map(r => r.hotel_id);
          const hotelNamesResponse = await supabase
            .from("organizations")
            .select("id, name")
            .in("id", hotelIds);

          const hotelNameMap: Record<string, string> = {};
          (hotelNamesResponse.data || []).forEach(hotel => {
            hotelNameMap[hotel.id] = hotel.name;
          });

          const formattedRequests = requestsResponse.data.map(r => ({
            id: r.id,
            hotel_name: hotelNameMap[r.hotel_id] || 'Hotel desconocido',
            status: r.status,
            requested_by: r.requested_by
          }));

          setRequests(formattedRequests);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading ", err);
        setError("Error al cargar los datos");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRequestAccess = async () => {
    if (!selectedHotel) {
      setError("Por favor, selecciona un hotel");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const sessionResponse = await supabase.auth.getSession();
      const userId = sessionResponse.data.session?.user.id;
      
      const agencyResponse = await supabase
        .from("organizations")
        .select("id")
        .eq("created_by", userId)
        .maybeSingle();

      if (!agencyResponse.data) throw new Error("Agencia no encontrada");

      const { error } = await supabase
        .from("agency_hotel_access")
        .insert({
          agency_id: agencyResponse.data.id,
          hotel_id: selectedHotel,
          status: "pending",
          requested_by: "agency"
        });

      if (error) throw error;

      // Recargar solicitudes
      const updatedRequestsResponse = await supabase
        .from("agency_hotel_access")
        .select(`
          id,
          status,
          requested_by,
          hotel_id
        `)
        .eq("agency_id", agencyResponse.data.id);

      if (updatedRequestsResponse.data) {
        const hotelIds = updatedRequestsResponse.data.map(r => r.hotel_id);
        const hotelNamesResponse = await supabase
          .from("organizations")
          .select("id, name")
          .in("id", hotelIds);

        const hotelNameMap: Record<string, string> = {};
        (hotelNamesResponse.data || []).forEach(hotel => {
          hotelNameMap[hotel.id] = hotel.name;
        });

        const formattedRequests = updatedRequestsResponse.data.map(r => ({
          id: r.id,
          hotel_name: hotelNameMap[r.hotel_id] || 'Hotel desconocido',
          status: r.status,
          requested_by: r.requested_by
        }));

        setRequests(formattedRequests);
      }
      
      setSelectedHotel("");
    } catch (err) {
      setError("Error al solicitar acceso: " + (err as Error).message);
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
      <h1>Solicitudes de Acceso a Hoteles</h1>
      
      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h3>Solicitar acceso a nuevo hotel</h3>
        <select
          value={selectedHotel}
          onChange={(e) => setSelectedHotel(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "8px", 
            margin: "8px 0",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        >
          <option value="">Selecciona un hotel</option>
          {hotels.map(hotel => (
            <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
          ))}
        </select>
        <button
          onClick={handleRequestAccess}
          disabled={!selectedHotel || submitting}
          style={{ 
            padding: "8px 16px", 
            backgroundColor: selectedHotel ? "#10b981" : "#ccc", 
            color: "white", 
            border: "none", 
            borderRadius: "4px", 
            cursor: selectedHotel ? "pointer" : "not-allowed",
            marginTop: "8px"
          }}
        >
          {submitting ? "Enviando..." : "Solicitar acceso"}
        </button>
      </div>

      <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h3>Mis solicitudes e invitaciones</h3>
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
                  <strong>{request.hotel_name}</strong>
                  {request.requested_by === 'hotel' && (
                    <span style={{ marginLeft: "8px", backgroundColor: "#e0f2fe", padding: "2px 6px", borderRadius: "4px", fontSize: "0.85rem" }}>
                      Invitación del hotel
                    </span>
                  )}
                </div>
                <span>{getStatusText(request.status)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}