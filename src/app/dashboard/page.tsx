// src/app/dashboard/page.tsx
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
  profile_image: string | null;
}

export default function Dashboard() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [media, setMedia] = useState<{ url: string; type: string }[]>([]);
  const [approvedHotels, setApprovedHotels] = useState<{ id: string; name: string }[]>([]);
  const [expandedHotelId, setExpandedHotelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // ✅ ELIMINADO: const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const loadOrg = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        window.location.href = "/login";
        return;
      }

      const userId = sessionData.session.user.id;

      const { data: orgData } = await supabase
        .from("organizations")
        .select("*")
        .eq("created_by", userId)
        .maybeSingle();

      if (!orgData) {
        window.location.href = "/setup-organization";
        return;
      }

      setOrg(orgData as Organization);

      // Cargar una foto destacada (primera imagen del hotel)
      if (orgData.role === "hotel") {
        const { data: mediaData } = await supabase
          .from("media")
          .select("url, type")
          .eq("hotel_id", orgData.id)
          .order("created_at", { ascending: false })
          .limit(1);
        setMedia(mediaData || []);
      }

      // Cargar hoteles aprobados para agencias
      if (orgData.role === "agency") {
        const { data: accessData } = await supabase
          .from("agency_hotel_access")
          .select("hotel_id")
          .eq("agency_id", orgData.id)
          .eq("status", "approved");

        if (accessData && Array.isArray(accessData)) {
          const hotelIds = accessData.map((a: { hotel_id: string }) => a.hotel_id);
          const { data: hotelsData } = await supabase
            .from("organizations")
            .select("id, name")
            .in("id", hotelIds);
          setApprovedHotels(hotelsData || []);
        }
      }

      setLoading(false);
    };

    loadOrg();
  }, []);

  const toggleHotelGallery = (hotelId: string) => {
    if (expandedHotelId === hotelId) {
      setExpandedHotelId(null);
      setMedia([]);
    } else {
      setExpandedHotelId(hotelId);
      supabase
        .from("media")
        .select("url, type")
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false })
        // ✅ REMOVIDO: .limit(1) → ahora carga todas las fotos
        .then(({ data }) => setMedia(data || []));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc"
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  if (!org) return null;

  // Foto de perfil: usar profile_image si existe, sino avatar por defecto
  const profileImage = org.profile_image 
    ? org.profile_image 
    : org.role === "hotel"
      ? "https://ui-avatars.com/api/?name=" + encodeURIComponent(org.name) + "&background=3b82f6&color=white"
      : "https://ui-avatars.com/api/?name=" + encodeURIComponent(org.name) + "&background=10b981&color=white";

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      padding: "2rem 1rem"
    }}>
      {/* Header con iconos */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
        padding: "0 1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Foto del hotel/agencia */}
          <div style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid white",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
          }}>
            {org.role === "hotel" && media.length > 0 && media[0].type === "video" ? (
              <div style={{
                width: "100%",
                height: "100%",
                background: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem"
              }}>
                🎥
              </div>
            ) : (
              <img
                src={profileImage}
                alt={org.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>

          {/* Nombre */}
          <h1 style={{ 
            fontSize: "1.75rem", 
            fontWeight: "700",
            color: "#1e293b",
            margin: 0
          }}>
            {org.name}
          </h1>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {/* Icono de invitación */}
          <button
            onClick={() => {
              if (org.role === "hotel") {
                window.location.href = "/hotel-requests";
              } else {
                window.location.href = "/agency-requests";
              }
            }}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.2rem"
            }}
            title="Gestionar invitaciones"
          >
            📩
          </button>

          {/* ✅ CAMBIADO: Botón directo a perfil (sin menú desplegable) */}
          <button
            onClick={() => window.location.href = "/profile"}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.2rem"
            }}
            title="Mi perfil"
          >
            👤
          </button>
                    {/* ✅  Botón cerrar sesión */}
          <button
            onClick={handleLogout}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.2rem"
            }}
            title="Cerrar sesión"
          >
            🚪
          </button>
        </div>
        
      </div>

      {/* Galería (solo si es hotel) */}
      {org.role === "hotel" && (
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          overflow: "hidden"
        }}>
          <div style={{ padding: "2rem" }}>
            <h3 style={{ 
              fontSize: "1.25rem", 
              fontWeight: "600", 
              color: "#1e293b",
              marginBottom: "1.5rem"
            }}>
              🖼️ Galería
            </h3>

            {media.length === 0 ? (
              <div style={{ 
                textAlign: "center", 
                padding: "2rem",
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                border: "1px dashed #cbd5e1"
              }}>
                <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
                  No hay imágenes ni videos aún.
                </p>
              </div>
            ) : (
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
                gap: "1.25rem"
              }}>
                {media.map((item, index) => (
                  <div key={index} style={{ 
                    borderRadius: "12px", 
                    overflow: "hidden",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
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
                        alt={`Media ${index}`}
                        style={{ 
                          width: "100%", 
                          height: "150px", 
                          objectFit: "cover",
                          display: "block"
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <a 
                href="/Hotel-media" 
                style={{ 
                  color: "#3b82f6", 
                  fontWeight: "600",
                  textDecoration: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  transition: "background-color 0.2s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#eff6ff"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                ➕ Subir o gestionar fotos y videos
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Para agencias: solo mostrar acceso a hoteles */}
      {org.role === "agency" && (
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          overflow: "hidden"
        }}>
          <div style={{ padding: "2rem" }}>
            <h3 style={{ 
              fontSize: "1.25rem", 
              fontWeight: "600", 
              color: "#1e293b",
              marginBottom: "1.5rem"
            }}>
              🏨 Galería de hoteles
            </h3>

            {approvedHotels.length === 0 ? (
              <div style={{ 
                textAlign: "center", 
                padding: "2rem",
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                border: "1px dashed #cbd5e1"
              }}>
                <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                  No tienes acceso a ninguna galería aún.
                </p>
                <a 
                  href="/agency-requests" 
                  style={{ 
                    color: "#3b82f6", 
                    fontWeight: "600",
                    textDecoration: "none"
                  }}
                >
                  Solicita acceso
                </a>
              </div>
            ) : (
              <div style={{ 
                backgroundColor: "#f8fafc", 
                borderRadius: "12px", 
                padding: "1rem",
                marginBottom: "1.5rem"
              }}>
                {approvedHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    onClick={() => toggleHotelGallery(hotel.id)}
                    style={{
                      padding: "0.75rem 1rem",
                      borderBottom: "1px solid #e2e8f0",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "background-color 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <span>{hotel.name}</span>
                    <span>{expandedHotelId === hotel.id ? "▼" : "►"}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ✅ AÑADIDO: Mostrar galería del hotel expandido */}
            {expandedHotelId && (
              <div style={{ 
                marginTop: "1.5rem", 
                paddingTop: "1.5rem", 
                borderTop: "2px solid #e2e8f0"
              }}>
                {media.length === 0 ? (
                  <div style={{ 
                    textAlign: "center",
                    padding: "2rem",
                    backgroundColor: "#f8fafc",
                    borderRadius: "12px"
                  }}>
                    <p style={{ color: "#64748b" }}>
                      No hay medios para este hotel aún.
                    </p>
                  </div>
                ) : (
                  <>
                    <h4 style={{ 
                      fontSize: "1.125rem", 
                      fontWeight: "600", 
                      color: "#1e293b",
                      marginBottom: "1rem"
                    }}>
                      Galería de {approvedHotels.find(h => h.id === expandedHotelId)?.name}
                    </h4>
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
                      gap: "1.25rem"
                    }}>
                      {media.map((item, index) => (
                        <div key={index} style={{ 
                          borderRadius: "12px", 
                          overflow: "hidden",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                        }}>
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
                              alt={`Media ${index}`}
                              style={{ 
                                width: "100%", 
                                height: "150px", 
                                objectFit: "cover",
                                display: "block"
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}