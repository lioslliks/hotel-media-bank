"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

interface ApprovedHotel {
  id: string;
  name: string;
}

interface MediaItem {
  id: string;
  url: string;
  type: string;
}

export default function AgencyGallery() {
  const [approvedHotels, setApprovedHotels] = useState<ApprovedHotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<ApprovedHotel | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [error, setError] = useState("");

  // Cargar hoteles aprobados al iniciar
  useEffect(() => {
    const loadApprovedHotels = async () => {
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

        // Obtener hoteles con acceso aprobado
        const accessResponse = await supabase
          .from("agency_hotel_access")
          .select("hotel_id")
          .eq("agency_id", orgResponse.data.id)
          .eq("status", "approved");

        if (accessResponse.data && accessResponse.data.length > 0) {
          const hotelIds = accessResponse.data.map(a => a.hotel_id);
          
          // Obtener nombres de hoteles
          const hotelsResponse = await supabase
            .from("organizations")
            .select("id, name")
            .in("id", hotelIds);

          setApprovedHotels(hotelsResponse.data || []);
          
          // Seleccionar el primer hotel automáticamente
          if (hotelsResponse.data && hotelsResponse.data.length > 0) {
            setSelectedHotel(hotelsResponse.data[0]);
            loadHotelMedia(hotelsResponse.data[0].id);
          }
        } else {
          setApprovedHotels([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading approved hotels:", err);
        setError("Error al cargar los hoteles");
        setLoading(false);
      }
    };

    loadApprovedHotels();
  }, []);

  const loadHotelMedia = async (hotelId: string) => {
    setLoadingMedia(true);
    setError("");

    try {
      const mediaResponse = await supabase
        .from("media")
        .select("id, url, type")
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      setMedia(mediaResponse.data || []);
    } catch (err) {
      console.error("Error loading media:", err);
      setError("Error al cargar la galería");
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleHotelSelect = (hotel: ApprovedHotel) => {
    setSelectedHotel(hotel);
    loadHotelMedia(hotel.id);
  };

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Cargando hoteles aprobados...</div>;
  }

  if (approvedHotels.length === 0) {
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <h1>Galería de Hoteles</h1>
        <p>No tienes acceso a ninguna galería de hotel aún.</p>
        <p>Ve a <a href="/agency-requests">Solicitudes de Acceso</a> para solicitar acceso a hoteles.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Galería de Hoteles</h1>
      
      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      {/* Selector de hotel */}
      <div style={{ marginBottom: "2rem" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
          Selecciona un hotel:
        </label>
        <select
          value={selectedHotel?.id || ""}
          onChange={(e) => {
            const hotel = approvedHotels.find(h => h.id === e.target.value);
            if (hotel) handleHotelSelect(hotel);
          }}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        >
          {approvedHotels.map(hotel => (
            <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
          ))}
        </select>
      </div>

      {/* Galería del hotel seleccionado */}
      {loadingMedia ? (
        <p>Cargando galería...</p>
      ) : media.length === 0 ? (
        <p>Este hotel no tiene imágenes ni videos aún.</p>
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
              <div style={{ marginTop: "4px", fontSize: "0.85rem", textAlign: "center" }}>
                {item.type === "video" ? "Video" : "Imagen"}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Información del hotel actual */}
      {selectedHotel && (
        <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
          <h3>Hotel actual: {selectedHotel.name}</h3>
          <p>Total de medios: {media.length}</p>
        </div>
      )}
    </div>
  );
}