"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function HotelMedia() {
  const [images, setImages] = useState<{ url: string; type: string; id: string }[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Verificar que es un hotel y cargar imágenes
  useEffect(() => {
    const loadUserData = async () => {
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

        // Cargar imágenes/videos
        const mediaResponse = await supabase
          .from("media")
          .select("id, url, type")
          .eq("hotel_id", orgResponse.data.id)
          .order("created_at", { ascending: false });

        setImages(mediaResponse.data || []);
      } catch (err) {
        console.error("Error loading media:", err);
        setError("Error al cargar la galería");
      }
    };

    loadUserData();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Subida fallida");
      }

      // Guardar en base de datos
      const sessionResponse = await supabase.auth.getSession();
      const userId = sessionResponse.data.session?.user.id;
      const orgResponse = await supabase
        .from("organizations")
        .select("id")
        .eq("created_by", userId)
        .maybeSingle();

      if (!orgResponse.data) throw new Error("Hotel no encontrado");

      const { error } = await supabase.from("media").insert({
        hotel_id: orgResponse.data.id,
        url: data.url,
        type: data.type, // 'image' o 'video'
      });

      if (error) throw error;

      // Recargar galería
      const mediaResponse = await supabase
        .from("media")
        .select("id, url, type")
        .eq("hotel_id", orgResponse.data.id)
        .order("created_at", { ascending: false });

      setImages(mediaResponse.data || []);
      setFile(null);
    } catch (err) {
      setError("Error: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta imagen/video?")) return;

    const { error } = await supabase.from("media").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar: " + error.message);
    } else {
      setImages(prev => prev.filter(img => img.id !== id));
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Galería de Medios</h1>

      {/* Subida */}
      <form onSubmit={handleUpload} style={{ marginBottom: "2rem" }}>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: "8px 16px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            marginTop: "8px",
          }}
        >
          {uploading ? "Subiendo..." : "Subir imagen o video"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      {/* Galería */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
        {images.length === 0 ? (
          <p>No hay imágenes ni videos aún. Sube uno para empezar.</p>
        ) : (
          images.map((item) => (
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
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "rgba(0,0,0,0.6)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
              <div style={{ marginTop: "4px", fontSize: "0.85rem", textAlign: "center" }}>
                {item.type === "video" ? "Video" : "Imagen"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}