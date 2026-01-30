// src/app/hotel-media/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

interface MediaItem {
  id: string;
  url: string;
  type: string;
  tags?: string[];
  quality_score?: number;
}

const ConfirmModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel,
  title = "¿Estás seguro?",
  message = "Esta acción no se puede deshacer."
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div 
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "2rem",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ 
          fontSize: "1.25rem", 
          fontWeight: "600", 
          color: "#1e293b",
          marginBottom: "1rem"
        }}>
          {title}
        </h3>
        <p style={{ 
          color: "#64748b", 
          marginBottom: "1.5rem",
          fontSize: "0.95rem"
        }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "0.75rem",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              backgroundColor: "white",
              color: "#475569",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "0.75rem",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default function HotelMedia() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState<{ id: string; isOpen: boolean }>({ id: "", isOpen: false });

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

        const mediaResponse = await supabase
          .from("media")
          .select("id, url, type, tags, quality_score")
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

      // Bloquear subida si calidad es baja
      if (data.quality_score !== undefined && data.quality_score < 0.4) {
        setError("⚠️ La imagen tiene baja calidad (poco nítida o oscura). Por favor, sube una foto más clara.");
        setUploading(false);
        return;
      }

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
        type: data.type,
        tags: [],
        quality_score: data.quality_score || 0,
      });

      if (error) throw error;

      const mediaResponse = await supabase
        .from("media")
        .select("id, url, type, tags, quality_score")
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

  const handleDelete = (id: string) => {
    setShowDeleteModal({ id, isOpen: true });
  };

  const confirmDelete = async () => {
    const { error } = await supabase.from("media").delete().eq("id", showDeleteModal.id);
    if (error) {
      setError("Error al eliminar: " + error.message);
    } else {
      setImages(prev => prev.filter(img => img.id !== showDeleteModal.id));
    }
    setShowDeleteModal({ id: "", isOpen: false });
  };

  const cancelDelete = () => {
    setShowDeleteModal({ id: "", isOpen: false });
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Galería de Medios</h1>

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

      <ConfirmModal
        isOpen={showDeleteModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="¿Estás seguro?"
        message="El contenido se eliminará permanentemente."
      />
    </div>
  );
}