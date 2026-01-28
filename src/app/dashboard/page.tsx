"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface Organization {
  id: string;
  name: string;
  role: string;
  address: string;
  phone: string;
  country: string;
  province: string;
  city: string;
  website: string | null;
  stars: number | null;
  hotel_type: string | null;
}

interface MediaItem {
  id: string;
  url: string;
  type: string;
}

const HOTEL_TYPE_LABELS: Record<string, string> = {
  adults_only: "Solo adultos",
  family: "Familiar",
  boutique: "Hotel boutique",
  luxury: "Lujo",
  golf: "Golf",
  sun_and_beach: "Sol y playa",
  wellness: "Wellness / Spa",
  urban: "Urbano",
  budget: "Económico",
  aparthotel: "Apartahotel",
};

export default function Dashboard() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [approvedHotels, setApprovedHotels] = useState<{ id: string; name: string }[]>([]);
  const [expandedHotelId, setExpandedHotelId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrg = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        window.location.href = "/login";
        return;
      }

      const { data: orgData } = await supabase
        .from("organizations")
        .select("*")
        .eq("created_by", sessionData.session.user.id)
        .maybeSingle();

      if (!orgData) {
        window.location.href = "/setup-organization";
        return;
      }

      setOrg(orgData as Organization);

      // Cargar galería si es hotel
      if (orgData.role === "hotel") {
        const mediaResponse = await supabase
          .from("media")
          .select("id, url, type")
          .eq("hotel_id", orgData.id)
          .order("created_at", { ascending: false });
        setMedia(mediaResponse.data || []);
      }

      // Cargar hoteles aprobados si es agencia
      if (orgData.role === "agency") {
        const accessResponse = await supabase
          .from("agency_hotel_access")
          .select("hotel_id")
          .eq("agency_id", orgData.id)
          .eq("status", "approved");

        if (accessResponse.data && accessResponse.data.length > 0) {
          const hotelIds = accessResponse.data.map(a => a.hotel_id);
          const hotelsResponse = await supabase
            .from("organizations")
            .select("id, name")
            .in("id", hotelIds);
          setApprovedHotels(hotelsResponse.data || []);
        }
      }

      setLoading(false);
    };

    loadOrg();
  }, []);

  const toggleHotelGallery = (hotelId: string) => {
    if (expandedHotelId === hotelId) {
      // Ya está expandido → colapsar
      setExpandedHotelId(null);
      setMedia([]);
    } else {
      // Expandir este hotel
      setExpandedHotelId(hotelId);
      setError("");

      supabase
        .from("media")
        .select("id, url, type")
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false })
        .then(({ data }) => setMedia(data || []));
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Cargando...</p>;
  if (!org) return null;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Bienvenido a Hotel Media Bank</h1>
      <h2>{org.name}</h2>
      <p><strong>Rol:</strong> {org.role === "hotel" ? "🏨 Hotel" : "💼 Agencia de viajes"}</p>
      <p><strong>Dirección:</strong> {org.address}</p>
      <p><strong>Ubicación:</strong> {org.city}, {org.province}, {org.country}</p>
      <p><strong>Teléfono:</strong> {org.phone}</p>
      
      {org.website && (
        <p><strong>Web:</strong> <a href={org.website} target="_blank" rel="noreferrer">{org.website}</a></p>
      )}
      
      {org.role === "hotel" && (
        <>
          <p><strong>Estrellas:</strong> {"⭐".repeat(org.stars || 0)}</p>
          <p><strong>Tipo:</strong> {HOTEL_TYPE_LABELS[org.hotel_type || ""] || org.hotel_type}</p>
        </>
      )}

      {/* --- Sección de Galería --- */}
      <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
        <h3>
          {org.role === "hotel" 
            ? "🖼️ Tu galería de medios"
            : "🏨 Galería de hoteles"}
        </h3>

        {/* Para hoteles */}
        {org.role === "hotel" && (
          <>
            {media.length === 0 ? (
              <p>No hay imágenes ni videos aún.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                {media.map((item) => (
                  <div key={item.id} style={{ position: "relative", borderRadius: "4px", overflow: "hidden" }}>
                    {item.type === "video" ? (
                      <div
                        style={{
                          width: "100%",
                          height: "150px",
                          background: "#000",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "1.2rem",
                        }}
                      >
                        🎥 Video
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={`Media ${item.id}`}
                        style={{ width: "100%", height: "150px", objectFit: "cover" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <p style={{ marginTop: "1rem", textAlign: "center" }}>
              <a 
                href="/hotel-media" 
                style={{ 
                  color: "#3b82f6", 
                  fontWeight: "bold",
                  textDecoration: "underline"
                }}
              >
                Subir o gestionar fotos y videos
              </a>
            </p>
          </>
        )}

        {/* Para agencias */}
        {org.role === "agency" && (
          <>
            {approvedHotels.length === 0 ? (
              <p>No tienes acceso a ninguna galería aún. <a href="/agency-requests">Solicita acceso</a>.</p>
            ) : (
              <>
                <ul style={{ listStyle: "none", padding: 0, marginBottom: "1rem" }}>
                  {approvedHotels.map((hotel) => (
                    <li
                      key={hotel.id}
                      onClick={() => toggleHotelGallery(hotel.id)}
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #eee",
                        cursor: "pointer",
                        fontWeight: expandedHotelId === hotel.id ? "bold" : "normal",
                        color: expandedHotelId === hotel.id ? "#10b981" : "inherit",
                      }}
                    >
                      {hotel.name}{" "}
                      <span>
                        {expandedHotelId === hotel.id ? "▼" : "►"}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* ✅ Enlace SIEMPRE visible cuando hay hoteles aprobados */}
                <p style={{ marginTop: "1rem", textAlign: "center" }}>
                  <a 
                    href="/agency-requests" 
                    style={{ 
                      color: "#3b82f6", 
                      fontWeight: "bold",
                      textDecoration: "underline"
                    }}
                  >
                    Solicitar acceso a más hoteles
                  </a>
                </p>

                {/* Galería expandida (solo si hay hotel seleccionado) */}
                {expandedHotelId && media.length > 0 && (
                  <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #ddd" }}>
                    <h4>Galería de {approvedHotels.find(h => h.id === expandedHotelId)?.name}</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                      {media.map((item) => (
                        <div key={item.id} style={{ position: "relative", borderRadius: "4px", overflow: "hidden" }}>
                          {item.type === "video" ? (
                            <div
                              style={{
                                width: "100%",
                                height: "150px",
                                background: "#000",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "1.2rem",
                              }}
                            >
                              🎥 Video
                            </div>
                          ) : (
                            <img
                              src={item.url}
                              alt={`Media ${item.id}`}
                              style={{ width: "100%", height: "150px", objectFit: "cover" }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {expandedHotelId && media.length === 0 && (
                  <p style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #ddd" }}>
                    No hay medios para este hotel aún.
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Enlaces adicionales */}
      <div style={{ marginTop: "2rem" }}>
        <a href="/setup-organization" style={{ marginRight: "1rem" }}>Editar organización</a>
        
        {org.role === "hotel" && (
          <a href="/hotel-requests" style={{ marginRight: "1rem" }}>Gestionar solicitudes</a>
        )}
        
        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
          style={{ padding: "6px 12px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px" }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}