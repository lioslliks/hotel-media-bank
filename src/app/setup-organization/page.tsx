// src/app/setup-organization/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

// 🌍 Datos estructurados: País → Provincia → Ciudades
const LOCATIONS: Record<string, Record<string, string[]>> = {
  "España": {
    "Madrid": ["Madrid", "Alcalá de Henares", "Getafe", "Móstoles", "Fuenlabrada"],
    "Barcelona": ["Barcelona", "Sitges", "Tarragona", "Lloret de Mar", "Girona"],
    "Valencia": ["Valencia", "Benidorm", "Alicante", "Torrevieja", "Elche"],
    "Sevilla": ["Sevilla", "Cádiz", "Jerez de la Frontera", "Huelva"],
    "Málaga": ["Málaga", "Marbella", "Fuengirola", "Estepona", "Nerja"]
  },
  "México": {
    "Ciudad de México": ["CDMX", "Coyoacán", "Polanco", "Santa Fe"],
    "Jalisco": ["Guadalajara", "Puerto Vallarta", "Tlaquepaque", "Zapopan"],
    "Nuevo León": ["Monterrey", "San Pedro Garza García", "Apodaca"]
  },
  "Argentina": {
    "Buenos Aires": ["Buenos Aires", "La Plata", "Tigre", "Mar del Plata"],
    "Córdoba": ["Córdoba", "Villa Carlos Paz", "Alta Gracia", "Río Cuarto"]
  },
  "Colombia": {
    "Bogotá": ["Bogotá", "Chía", "Zipaquirá"],
    "Antioquia": ["Medellín", "Envigado", "Rionegro"]
  }
};

export default function SetupOrganization() {
  const [role, setRole] = useState<"hotel" | "agency">("hotel");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [country, setCountry] = useState(Object.keys(LOCATIONS)[0]);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [stars, setStars] = useState(3);
  const [hotelType, setHotelType] = useState("family");
  const [orgId, setOrgId] = useState<string | null>(null); // 👈 NUEVO: guardar ID
  
  // 👇 NUEVO: Estados para foto de perfil
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // 👇 NUEVA: función de validación
  const validatePhone = (phone: string): boolean => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return false;
    }
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/;
    return phoneRegex.test(phone);
  };

  // 👇 NUEVA: Manejar cambio de imagen de perfil
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  // 👇 NUEVA: Subir imagen de perfil
  const uploadProfileImage = async (orgId: string) => {
    if (!profileImageFile) return null;
    
    const fileName = `${orgId}_profile_${Date.now()}`;
    const { error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, profileImageFile);
    
    if (error) throw error;
    
    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  };

  // 👇 NUEVA: Cargar imagen de perfil existente
  const loadProfileImage = async (orgId: string) => {
    try {
      const { data } = supabase.storage
        .from('profile-images')
        .getPublicUrl(`${orgId}_profile`);
      
      if (data?.publicUrl) {
        setProfileImageUrl(data.publicUrl);
        setProfileImagePreview(data.publicUrl);
      }
    } catch (error) {
      console.log("No se encontró imagen de perfil");
    }
  };

  // Actualizar provincias cuando cambia el país
  useEffect(() => {
    const provinces = Object.keys(LOCATIONS[country] || {});
    if (provinces.length > 0) {
      setProvince(prev => prev || provinces[0]);
      const cities = LOCATIONS[country][provinces[0]] || [];
      setCity(prev => prev || cities[0] || "");
    }
  }, [country]);

  // Actualizar ciudades cuando cambia la provincia
  useEffect(() => {
    const cities = LOCATIONS[country]?.[province] || [];
    if (cities.length > 0) {
      setCity(prev => prev || cities[0]);
    }
  }, [province]);

  // Cargar datos existentes al entrar
  useEffect(() => {
    const loadUserData = async () => {
      const sessionResponse = await supabase.auth.getSession();
      if (!sessionResponse.data.session) {
        window.location.href = "/login";
        return;
      }

      const userId = sessionResponse.data.session.user.id;

      const orgResponse = await supabase
        .from("organizations")
        .select("*")
        .eq("created_by", userId)
        .maybeSingle();

      if (orgResponse.data) {
        // Ya tiene organización → cargarla
        const org = orgResponse.data;
        setOrgId(org.id); // 👈 Guardar ID existente
        setName(org.name);
        setRole(org.role as "hotel" | "agency");
        setAddress(org.address);
        setPhone(org.phone);
        setCountry(org.country);
        setProvince(org.province);
        setCity(org.city);
        setWebsite(org.website || "");
        
        if (org.role === "hotel") {
          setStars(org.stars || 3);
          setHotelType(org.hotel_type || "family");
        }
        
        // 👇 Cargar imagen de perfil si existe
        if (org.profile_image) {
          setProfileImageUrl(org.profile_image);
          setProfileImagePreview(org.profile_image);
        } else {
          loadProfileImage(org.id);
        }
      } else {
        // Nuevo usuario: usar rol guardado de la página principal
        const savedRole = sessionStorage.getItem("userRole") || 
                          localStorage.getItem("userRole");
        if (savedRole && (savedRole === "hotel" || savedRole === "agency")) {
          setRole(savedRole as "hotel" | "agency");
        }
        setCountry(Object.keys(LOCATIONS)[0]);
      }
    };

    loadUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhone(phone)) {
      setPhoneError("Por favor, introduce un número de teléfono válido");
      return;
    }

    const sessionResponse = await supabase.auth.getSession();
    if (!sessionResponse.data.session) return;

    const userId = sessionResponse.data.session.user.id;

    // 👇 Construir objeto de actualización solo con campos necesarios
    const updateData: any = {
      name,
      role,
      address,
      phone,
      country,
      province,
      city,
      website,
    };

    // 👇 Subir imagen de perfil si hay una nueva
    let imageUrl = profileImageUrl;
    if (profileImageFile) {
      try {
        const currentOrgId = orgId || userId;
        imageUrl = await uploadProfileImage(currentOrgId);
      } catch (error) {
        alert("Error al subir la imagen de perfil");
        return;
      }
    }

    // 👇 Incluir URL de imagen si existe
    if (imageUrl) {
      updateData.profile_image = imageUrl;
    }

    // Solo incluir campos de hotel si es hotel
    if (role === "hotel") {
      updateData.stars = stars;
      updateData.hotel_type = hotelType;
    } else {
      // Si cambia a agencia, limpiar campos de hotel
      updateData.stars = null;
      updateData.hotel_type = null;
    }

    let response;
    if (orgId) {
      // 👉 ACTUALIZAR organización existente (no eliminar)
      response = await supabase
        .from("organizations")
        .update(updateData)
        .eq("id", orgId);
    } else {
      // 👉 CREAR nueva organización
      response = await supabase
        .from("organizations")
        .insert({
          ...updateData,
          created_by: userId,
        });
    }

    if (response.error) {
      alert("Error: " + response.error.message);
    } else {
      window.location.href = "/dashboard";
    }
  };

  const countries = Object.keys(LOCATIONS);
  const provincesList = LOCATIONS[country] ? Object.keys(LOCATIONS[country]) : [];
  const citiesList = LOCATIONS[country]?.[province] || [];

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Configurar tu organización</h1>
      <form onSubmit={handleSubmit}>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "hotel" | "agency")}
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        >
          <option value="hotel">🏨 Hotel</option>
          <option value="agency">💼 Agencia de viajes</option>
        </select>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del hotel o agencia"
          required
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />

        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Dirección completa"
          required
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />

        <label style={{ display: "block", marginTop: "1rem" }}>País:</label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        >
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label style={{ display: "block", marginTop: "1rem" }}>Provincia / Estado:</label>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          disabled={!provincesList.length}
        >
          {provincesList.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <label style={{ display: "block", marginTop: "1rem" }}>Ciudad / Localidad:</label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          disabled={!citiesList.length}
        >
          {citiesList.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* 👇 MODIFICADO: input de teléfono con validación */}
        <input
          type="tel"
          value={phone}
          onChange={(e) => {
            const value = e.target.value;
            setPhone(value);
            if (value && !validatePhone(value)) {
              setPhoneError("Número de teléfono no válido");
            } else {
              setPhoneError("");
            }
          }}
          placeholder="Número de contacto (ej: +34 612 345 678)"
          required
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        {/* 👇 NUEVO: mensaje de error */}
        {phoneError && <p style={{ color: "red", fontSize: "0.875rem", margin: "4px 0" }}>{phoneError}</p>}

        <input
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="Sitio web (opcional)"
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />

        {/* 👇 NUEVO: Campo para subir foto de perfil */}
        <div style={{ marginTop: "1rem" }}>
          <label>Foto de perfil (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
            style={{ marginTop: "0.5rem", width: "100%" }}
          />
          {profileImagePreview && (
            <img 
              src={profileImagePreview} 
              alt="Vista previa" 
              style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "0.5rem", borderRadius: "8px" }}
            />
          )}
        </div>

        {role === "hotel" && (
          <>
            <label style={{ display: "block", marginTop: "1rem" }}>Estrellas:</label>
            <select
              value={stars}
              onChange={(e) => setStars(Number(e.target.value))}
              style={{ width: "100%", padding: "8px", margin: "8px 0" }}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} ⭐</option>
              ))}
            </select>

            <label style={{ display: "block", marginTop: "1rem" }}>Tipo de hotel:</label>
            <select
              value={hotelType}
              onChange={(e) => setHotelType(e.target.value)}
              style={{ width: "100%", padding: "8px", margin: "8px 0" }}
            >
              <option value="adults_only">Solo adultos</option>
              <option value="family">Familiar</option>
              <option value="boutique">Hotel boutique</option>
              <option value="luxury">Lujo</option>
              <option value="golf">Golf</option>
              <option value="sun_and_beach">Sol y playa</option>
              <option value="wellness">Wellness / Spa</option>
              <option value="urban">Urbano</option>
              <option value="budget">Económico</option>
              <option value="aparthotel">Apartahotel</option>
            </select>
          </>
        )}

        <button type="submit" style={{ marginTop: "1rem", padding: "10px 20px", fontSize: "16px" }}>Guardar organización</button>
      </form>
    </div>
  );
}