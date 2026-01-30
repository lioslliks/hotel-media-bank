// src/app/profile/page.tsx
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

const HOTEL_TYPES = [
  { value: "adults_only", label: "Solo adultos" },
  { value: "family", label: "Familiar" },
  { value: "boutique", label: "Hotel boutique" },
  { value: "luxury", label: "Lujo" },
  { value: "golf", label: "Golf" },
  { value: "sun_and_beach", label: "Sol y playa" },
  { value: "wellness", label: "Wellness / Spa" },
  { value: "urban", label: "Urbano" },
  { value: "budget", label: "Económico" },
  { value: "aparthotel", label: "Apartahotel" },
];

export default function Profile() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Organization>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // 👇 NUEVO: Estados para foto de perfil
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
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
        setFormData(orgData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading profile:", err);
        window.location.href = "/login";
      }
    };

    loadProfile();
  }, []);

  // 👇 NUEVA: Función para subir imagen de perfil
  const uploadProfileImage = async () => {
    if (!profileImageFile || !org) return;
    
    try {
      const fileName = `${org.id}_profile_${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, profileImageFile);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);
      
      // Actualizar en la base de datos
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ profile_image: data.publicUrl })
        .eq('id', org.id);
      
      if (updateError) throw updateError;
      
      // Actualizar estado local
      setOrg(prev => prev ? { ...prev, profile_image: data.publicUrl } : null);
      setProfileImagePreview(null);
      setProfileImageFile(null);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      setError('Error al subir la imagen de perfil');
      return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === "" ? null : value
    }));
  };

  const handleSave = async () => {
    if (!org) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // 👇 Subir imagen primero si hay
      let newProfileImage = org.profile_image;
      if (profileImageFile) {
        newProfileImage = await uploadProfileImage() || org.profile_image;
      }

      const { error } = await supabase
        .from("organizations")
        .update({
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          country: formData.country,
          province: formData.province,
          city: formData.city,
          website: formData.website,
          stars: formData.stars ? parseInt(formData.stars as any) : null,
          hotel_type: formData.hotel_type,
          profile_image: newProfileImage // 👈 Incluir la imagen
        })
        .eq("id", org.id);

      if (error) throw error;

      setOrg(prev => prev ? { ...prev, ...formData, profile_image: newProfileImage } as Organization : null);
      setIsEditing(false);
      setSuccess("Perfil actualizado correctamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Error al guardar los cambios: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (org) {
      setFormData(org);
      setIsEditing(false);
      // 👇 Limpiar selección de imagen al cancelar
      setProfileImageFile(null);
      setProfileImagePreview(null);
    }
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
        <div>Cargando perfil...</div>
      </div>
    );
  }

  if (!org) return null;

  // 👇 Foto de perfil con vista previa
  const profileImage = profileImagePreview 
    ? profileImagePreview
    : org.profile_image 
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
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "white",
        borderRadius: "20px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        position: "relative"
      }}>
        {/* Icono de engranaje dentro del marco */}
        {!isEditing && (
          <div style={{ 
            position: "absolute", 
            top: "1.5rem", 
            left: "1.5rem",
            zIndex: 10
          }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#64748b",
                color: "white",
                border: "none",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "1.2rem"
              }}
              title="Editar perfil"
            >
              ⚙️
            </button>
          </div>
        )}

        <div style={{ padding: "2.5rem 2.5rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
            <div style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid white",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
            }}>
              <img
                src={profileImage}
                alt={org.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            
            <div>
              <h1 style={{ 
                fontSize: "1.75rem", 
                fontWeight: "700",
                color: "#1e293b",
                margin: 0
              }}>
                {org.name}
              </h1>
              <p style={{ 
                color: "#64748b", 
                fontSize: "0.95rem",
                marginTop: "0.5rem"
              }}>
                {org.role === "hotel" ? "🏨 Hotel" : "💼 Agencia de viajes"}
              </p>
            </div>
          </div>

          {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
          {success && <p style={{ color: "green", marginBottom: "1rem" }}>{success}</p>}

          <div style={{ 
            display: "grid", 
            gap: "1.5rem",
            marginTop: "2rem"
          }}>
            {/* 👇 NUEVO: Campo para subir foto de perfil (solo en edición) */}
            {isEditing && (
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "0.5rem", 
                  fontWeight: "600",
                  color: "#374151"
                }}>
                  Foto de perfil
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfileImageFile(file);
                      setProfileImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  style={{
                    padding: "0.5rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    width: "100%"
                  }}
                />
                {(profileImagePreview || org?.profile_image) && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <img
                      src={profileImagePreview || org.profile_image!}
                      alt="Foto de perfil"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "2px solid #e2e8f0"
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Nombre */}
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "0.5rem", 
                fontWeight: "600", 
                color: "#374151" 
              }}>
                Nombre
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    fontSize: "1rem"
                  }}
                />
              ) : (
                <p style={{ fontSize: "1rem", color: "#475569" }}>{org.name}</p>
              )}
            </div>

            {/* Dirección */}
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "0.5rem", 
                fontWeight: "600", 
                color: "#374151" 
              }}>
                Dirección
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    fontSize: "1rem"
                  }}
                />
              ) : (
                <p style={{ fontSize: "1rem", color: "#475569" }}>{org.address}</p>
              )}
            </div>

            {/* Ubicación */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "0.5rem", 
                  fontWeight: "600", 
                  color: "#374151" 
                }}>
                  Ciudad
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "1rem"
                    }}
                  />
                ) : (
                  <p style={{ fontSize: "1rem", color: "#475569" }}>{org.city}</p>
                )}
              </div>
              
              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "0.5rem", 
                  fontWeight: "600", 
                  color: "#374151" 
                }}>
                  Provincia
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="province"
                    value={formData.province || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "1rem"
                    }}
                  />
                ) : (
                  <p style={{ fontSize: "1rem", color: "#475569" }}>{org.province}</p>
                )}
              </div>
              
              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "0.5rem", 
                  fontWeight: "600", 
                  color: "#374151" 
                }}>
                  País
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={formData.country || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "1rem"
                    }}
                  />
                ) : (
                  <p style={{ fontSize: "1rem", color: "#475569" }}>{org.country}</p>
                )}
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "0.5rem", 
                fontWeight: "600", 
                color: "#374151" 
              }}>
                Teléfono
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    fontSize: "1rem"
                  }}
                />
              ) : (
                <p style={{ fontSize: "1rem", color: "#475569" }}>{org.phone}</p>
              )}
            </div>

            {/* Web */}
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "0.5rem", 
                fontWeight: "600", 
                color: "#374151" 
              }}>
                Sitio web
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="website"
                  value={formData.website || ""}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    fontSize: "1rem"
                  }}
                />
              ) : (
                <p style={{ fontSize: "1rem", color: "#475569" }}>
                  {org.website ? (
                    <a href={org.website} target="_blank" rel="noreferrer" style={{ color: "#3b82f6" }}>
                      {org.website}
                    </a>
                  ) : "-"}
                </p>
              )}
            </div>

            {/* Específico para hoteles */}
            {org.role === "hotel" && (
              <>
                <div>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "0.5rem", 
                    fontWeight: "600", 
                    color: "#374151" 
                  }}>
                    Estrellas
                  </label>
                  {isEditing ? (
                    <select
                      name="stars"
                      value={formData.stars || ""}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        fontSize: "1rem"
                      }}
                    >
                      <option value="">Seleccionar...</option>
                      {[1,2,3,4,5].map(star => (
                        <option key={star} value={star}>{star} {"⭐".repeat(star)}</option>
                      ))}
                    </select>
                  ) : (
                    <p style={{ fontSize: "1rem", color: "#475569" }}>
                      {org.stars ? "⭐".repeat(org.stars) : "-"}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "0.5rem", 
                    fontWeight: "600", 
                    color: "#374151" 
                  }}>
                    Tipo de hotel
                  </label>
                  {isEditing ? (
                    <select
                      name="hotel_type"
                      value={formData.hotel_type || ""}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        fontSize: "1rem"
                      }}
                    >
                      <option value="">Seleccionar...</option>
                      {HOTEL_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  ) : (
                    <p style={{ fontSize: "1rem", color: "#475569" }}>
                      {HOTEL_TYPES.find(t => t.value === org.hotel_type)?.label || "-"}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Botones de acción */}
            {isEditing && (
              <div style={{ 
                display: "flex", 
                gap: "1rem", 
                paddingTop: "1rem",
                borderTop: "1px solid #e2e8f0"
              }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "600"
                  }}
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#64748b",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "600"
                  }}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}