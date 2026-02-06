// src/app/setup-organization/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { COUNTRIES, useLocations } from '../../hooks/useLocations';

const HOTEL_TYPES = [
  { value: "adults_only", label: "Solo adultos" },
  { value: "family", label: "Familiar" },
  { value: "boutique", label: "Boutique" },
  { value: "luxury", label: "Lujo" },
  { value: "golf", label: "Golf" },
  { value: "sun_and_beach", label: "Sol y playa" },
  { value: "wellness", label: "Wellness/Spa" },
  { value: "urban", label: "Urbano" },
  { value: "budget", label: "Económico" },
  { value: "aparthotel", label: "Apartahotel" },
];

// Categorías hoteleras profesionales (sistema B2B estándar)
const STAR_CATEGORIES = [
  { value: 1, label: "1★ Económico" },
  { value: 2, label: "2★ Estándar" },
  { value: 3, label: "3★ Confort" },
  { value: 4, label: "4★ Superior" },
  { value: 5, label: "5★ Lujo" },
];

export default function SetupOrganization() {
  const [role, setRole] = useState<"hotel" | "agency">("hotel");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [website, setWebsite] = useState("");
  const [stars, setStars] = useState(3);
  const [hotelTypes, setHotelTypes] = useState<string[]>(["family"]);
  const [hotelTypeError, setHotelTypeError] = useState("");
  const [orgId, setOrgId] = useState<string | null>(null);
  
  // Estados para foto de perfil - AHORA OBLIGATORIA
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(true);

  // Hook de ubicaciones
  const { 
    selectedCountry,
    selectedProvince, 
    availableProvinces,
    availableCities, 
    handleCountryChange,
    handleProvinceChange,
    getCurrentCountry,
    getCurrentProvince,
    getCurrentCity
  } = useLocations();

  // Validación de teléfono
  const validatePhone = (phone: string): boolean => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return false;
    }
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/;
    return phoneRegex.test(phone);
  };

  // Manejar cambio de imagen de perfil
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setImageError("Por favor, selecciona una imagen válida (JPG, PNG, GIF)");
        setProfileImageFile(null);
        setProfileImagePreview(null);
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageError("La imagen es demasiado grande. Máximo 5MB");
        setProfileImageFile(null);
        setProfileImagePreview(null);
        return;
      }

      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
      setImageError("");
    }
  };

  // Subir imagen de perfil
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

  // Cargar imagen de perfil existente
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
        setOrgId(org.id);
        setName(org.name);
        setRole(org.role as "hotel" | "agency");
        setAddress(org.address);
        setPhone(org.phone);
        
        // Inicializar ubicaciones con los datos existentes
        if (org.country) {
          handleCountryChange(org.country);
        }
        if (org.province) {
          handleProvinceChange(org.province);
        }
        
        setWebsite(org.website || "");
        
        if (org.role === "hotel") {
          setStars(org.stars || 3);
          // Convertir string/array desde DB a array
          if (org.hotel_type) {
            try {
              const parsed = JSON.parse(org.hotel_type);
              if (Array.isArray(parsed)) {
                setHotelTypes(parsed);
              } else {
                setHotelTypes([org.hotel_type]);
              }
            } catch {
              setHotelTypes([org.hotel_type]);
            }
          }
        }
        
        // Cargar imagen de perfil si existe
        if (org.profile_image) {
          setProfileImageUrl(org.profile_image);
          setProfileImagePreview(org.profile_image);
        } else {
          loadProfileImage(org.id);
        }
      } else {
        // Nuevo usuario: usar rol guardado
        const savedRole = sessionStorage.getItem("userRole") || 
                          localStorage.getItem("userRole");
        if (savedRole && (savedRole === "hotel" || savedRole === "agency")) {
          setRole(savedRole as "hotel" | "agency");
        }
        // Inicializar con primer país
        handleCountryChange(COUNTRIES[0].value);
      }
      
      setLoading(false);
    };

    loadUserData();
  }, []);

  const toggleHotelType = (value: string) => {
    setHotelTypes(prev => 
      prev.includes(value) 
        ? prev.filter(type => type !== value) 
        : [...prev, value]
    );
    setHotelTypeError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar teléfono
    if (!validatePhone(phone)) {
      setPhoneError("Por favor, introduce un número de teléfono válido");
      return;
    }

    // Validar imagen de perfil - AHORA OBLIGATORIA
    if (!profileImageFile && !profileImageUrl) {
      setImageError("Por favor, sube una foto de perfil");
      return;
    }

    // Validar tipos de hotel (al menos uno)
    if (role === "hotel" && hotelTypes.length === 0) {
      setHotelTypeError("Selecciona al menos un tipo de establecimiento");
      return;
    }

    const sessionResponse = await supabase.auth.getSession();
    if (!sessionResponse.data.session) return;

    const userId = sessionResponse.data.session.user.id;

    // Construir objeto de actualización
    const updateData: any = {
      name,
      role,
      address,
      phone,
      country: selectedCountry,
      province: selectedProvince,
      city: getCurrentCity(""),
      website,
    };

    // Subir imagen de perfil (obligatoria)
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

    // Incluir URL de imagen (obligatoria)
    updateData.profile_image = imageUrl;

    // Solo incluir campos de hotel si es hotel
    if (role === "hotel") {
      updateData.stars = stars;
      updateData.hotel_type = JSON.stringify(hotelTypes);
    } else {
      updateData.stars = null;
      updateData.hotel_type = null;
    }

    let response;
    if (orgId) {
      response = await supabase
        .from("organizations")
        .update(updateData)
        .eq("id", orgId);
    } else {
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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-sm text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-base">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              Configurar tu organización
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Rol */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de organización
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "hotel" | "agency")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white cursor-pointer"
                >
                  <option value="hotel">🏨 Hotel</option>
                  <option value="agency">💼 Agencia de viajes</option>
                </select>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de la organización
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre del hotel o agencia"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dirección completa
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Dirección completa"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              {/* Ubicación */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    País
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white cursor-pointer"
                  >
                    <option value="">Seleccionar país...</option>
                    {COUNTRIES.map(country => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Provincia / Estado
                  </label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    disabled={!selectedCountry}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 ${
                      !selectedCountry ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    }`}
                  >
                    <option value="">Seleccionar provincia...</option>
                    {availableProvinces.map(province => (
                      <option key={province.value} value={province.value}>
                        {province.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ciudad / Localidad
                  </label>
                  <select
                    value={getCurrentCity("")}
                    onChange={(e) => {
                      // No necesitamos hacer nada aquí, el hook maneja el estado
                    }}
                    disabled={!selectedProvince}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 ${
                      !selectedProvince ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    }`}
                  >
                    <option value="">Seleccionar ciudad...</option>
                    {availableCities.map(city => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono de contacto
                </label>
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
                  placeholder="+34 612 345 678"
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 outline-none text-gray-900 ${
                    phoneError 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {phoneError && (
                  <p className="mt-1 text-sm text-red-600 font-medium">
                    {phoneError}
                  </p>
                )}
              </div>

              {/* Sitio web */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sitio web (opcional)
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://tuweb.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              {/* Foto de perfil - AHORA OBLIGATORIA */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Foto de perfil
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  required={!profileImageUrl}
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-50 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                    imageError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Formatos aceptados: JPG, PNG, GIF | Tamaño máximo: 5MB
                </p>
                {imageError && (
                  <p className="mt-1 text-sm text-red-600 font-medium">
                    {imageError}
                  </p>
                )}
                {profileImagePreview && (
                  <div className="mt-3 flex justify-center">
                    <div className="relative">
                      <img 
                        src={profileImagePreview} 
                        alt="Vista previa" 
                        className="w-24 h-24 object-cover rounded-lg border-2 border-blue-500 shadow-md"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-md">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Campos específicos para hotel */}
              {role === "hotel" && (
                <div className="border-t border-gray-200 pt-6 space-y-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Información del Hotel
                  </h3>
                  
                  {/* Selector de categoría profesional B2B - OPCIÓN RECOMENDADA */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Categoría hotelera
                    </label>
                    <select
                      value={stars}
                      onChange={(e) => setStars(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white cursor-pointer"
                    >
                      {STAR_CATEGORIES.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Clasificación según estándares internacionales de la industria hotelera
                    </p>
                  </div>

                  {/* Tipos de establecimiento - CHIPS SUPERBORDEADOS */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Tipos de establecimiento
                    </label>
                    {hotelTypeError && (
                      <p className="mt-1 text-sm text-red-600 font-medium mb-2">
                        {hotelTypeError}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {HOTEL_TYPES.map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => toggleHotelType(type.value)}
                          className={`px-2.5 py-1 rounded border-2 text-xs font-medium transition-all ${
                            hotelTypes.includes(type.value)
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Selecciona uno o varios tipos que describan tu establecimiento
                    </p>
                  </div>
                </div>
              )}

              {/* Botón de envío */}
              <button 
                type="submit" 
                className="w-full mt-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white shadow-md hover:shadow-lg"
              >
                Guardar organización
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}