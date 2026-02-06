// src/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { COUNTRIES, useLocations } from '../../hooks/useLocations';
import { useNotifications } from '../../hooks/useNotifications';

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
  { value: "boutique", label: "Boutique" },
  { value: "luxury", label: "Lujo" },
  { value: "golf", label: "Golf" },
  { value: "sun_and_beach", label: "Sol y playa" },
  { value: "wellness", label: "Wellness/Spa" },
  { value: "urban", label: "Urbano" },
  { value: "budget", label: "Económico" },
  { value: "aparthotel", label: "Apartahotel" },
];

// Categorías hoteleras profesionales B2B
const STAR_CATEGORIES = [
  { value: 1, label: "1★ Económico" },
  { value: 2, label: "2★ Estándar" },
  { value: 3, label: "3★ Confort" },
  { value: 4, label: "4★ Superior" },
  { value: 5, label: "5★ Lujo" },
];

// Componente NotificationsDropdown - VERSIÓN COMPLETA SIN CHECK
interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read?: boolean;
}

interface NotificationsDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationsDropdown = ({ 
  notifications, 
  unreadCount, 
  loading, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
}: NotificationsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notifications-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="notifications-dropdown relative">
      {/* Botón campana con efecto hover */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-all hover:-translate-y-0.5"
      >
        {/* Bell Icon */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.657A2 2 0 0113 19H11a2 2 0 01-1.857-1.343M6 8a6 6 0 1112 0c0 3.5 1.5 5 2 5.5H4c.5-.5 2-2 2-5.5z"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center shadow">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-fade-in-down">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Notificaciones</h3>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Marcar todo como leído
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="p-6 text-center text-gray-500 text-sm">
              <div className="w-6 h-6 mx-auto mb-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              Cargando notificaciones...
            </div>
          )}

          {/* Empty */}
          {!loading && notifications.length === 0 && (
            <div className="p-6 text-center text-gray-500 text-sm">
              <div className="text-5xl mb-3 opacity-30">🔔</div>
              No hay notificaciones
            </div>
          )}

          {/* List - SIN ICONO DE CHECK */}
          {!loading && notifications.length > 0 && (
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-4 transition-all cursor-pointer ${
                    !n.read ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => !n.read && markAsRead(n.id)}
                >
                  {/* Indicador de no leído */}
                  <div className="pt-1">
                    {!n.read && (
                      <span className="block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{n.date}</p>
                  </div>

                  {/* SOLO BOTÓN DE ELIMINAR */}
                  <div className="flex items-start">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n.id);
                      }}
                      className="text-gray-400 hover:text-red-600 hover:scale-110 transition-transform"
                      title="Eliminar"
                    >
                      {/* X Icon */}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function Profile() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Organization>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  
  // Hook de notificaciones
  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(userId);
  
  // Hook personalizado para ubicaciones
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
  
  // Estados para foto de perfil
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  
  // Estados para tipos de hotel (ahora solo un valor único)
  const [selectedHotelType, setSelectedHotelType] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {  data } = await supabase.auth.getSession();
        if (!data?.session) {
          window.location.href = "/login";
          return;
        }

        const userId = data.session.user.id;
        setUserId(userId);

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
        
        // Inicializar ubicaciones con los datos del perfil
        if (orgData.country) {
          handleCountryChange(orgData.country);
        }
        if (orgData.province) {
          handleProvinceChange(orgData.province);
        }
        
        // ✅ CORRECCIÓN: Solo un valor único para hotel_type
        if (orgData.hotel_type) {
          setSelectedHotelType(orgData.hotel_type);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading profile:", err);
        window.location.href = "/login";
      }
    };

    loadProfile();
  }, []);

  // Función para subir imagen de perfil
  const uploadProfileImage = async () => {
    if (!profileImageFile || !org) return;
    
    try {
      const fileName = `${org.id}_profile_${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, profileImageFile);
      
      if (uploadError) throw uploadError;
      
      const {  data } = await supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);
      
      // Actualizar en la base de datos
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ profile_image: data.publicUrl })
        .eq('id', org.id);
      
      if (updateError) throw updateError;
      
      // Actualizar estado local
      setOrg(prev => prev ? { ...prev, profile_image: data.publicUrl } as Organization : null);
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

  const handleHotelTypeChange = (value: string) => {
    setSelectedHotelType(prev => prev === value ? null : value);
  };

  const handleSave = async () => {
    if (!org) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Subir imagen primero si hay
      let newProfileImage = org.profile_image;
      if (profileImageFile) {
        newProfileImage = await uploadProfileImage() || org.profile_image;
      }

      // Construir objeto de actualización
      const updateData: any = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        country: formData.country,
        province: formData.province,
        city: formData.city,
        website: formData.website,
        profile_image: newProfileImage
      };

      // ✅ CORRECCIÓN: Solo guardar un valor único para hotel_type
      if (org.role === "hotel") {
        updateData.stars = formData.stars ? parseInt(formData.stars as any) : null;
        updateData.hotel_type = selectedHotelType; // Solo un valor
      }

      const { error } = await supabase
        .from("organizations")
        .update(updateData)
        .eq("id", org.id);

      if (error) throw error;

      setOrg(prev => prev ? { ...prev, ...formData, profile_image: newProfileImage } as Organization : null);
      setIsEditing(false);
      setSuccess("Perfil actualizado correctamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      // ✅ MANEJO ROBUSTO DE ERRORES
      let errorMessage = "Error desconocido";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        errorMessage = err.message || 
                       err.error_description || 
                       err.details || 
                       JSON.stringify(err);
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      console.error("Error saving profile:", err);
      setError(`Error al guardar los cambios: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (org) {
      setFormData(org);
      setIsEditing(false);
      setProfileImageFile(null);
      setProfileImagePreview(null);
      
      // Restaurar ubicaciones originales
      if (org.country) {
        handleCountryChange(org.country);
      }
      if (org.province) {
        handleProvinceChange(org.province);
      }
      
      // ✅ CORRECCIÓN: Restaurar un solo valor
      if (org.hotel_type) {
        setSelectedHotelType(org.hotel_type);
      } else {
        setSelectedHotelType(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-sm text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-base">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!org) return null;

  // ✅ CORRECCIÓN: Eliminar espacios extra en URLs de avatar
  const profileImage = profileImagePreview 
    ? profileImagePreview
    : org.profile_image 
      ? org.profile_image 
      : org.role === "hotel" 
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(org.name)}&background=3b82f6&color=white`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(org.name)}&background=10b981&color=white`;

  // Obtener etiqueta de categoría profesional
  const getStarCategoryLabel = (stars: number | null) => {
    if (!stars) return "No especificado";
    const category = STAR_CATEGORIES.find(c => c.value === stars);
    return category ? category.label : `${stars}★`;
  };

  // ✅ CORRECCIÓN: Procesar un solo valor
  const getHotelTypeLabel = (hotelType: string | null) => {
    if (!hotelType) return "No especificado";
    return HOTEL_TYPES.find(t => t.value === hotelType)?.label || hotelType;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-gradient-to-b from-blue-800 to-blue-900 text-white p-6 fixed left-0 top-0 h-screen flex flex-col">
        {/* Header con logo */}
        <div className="flex items-center mb-8 pb-3 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight">Hotel Media Bank</h1>
        </div>

        {/* Navigation menu */}
        <nav className="flex-1 flex flex-col gap-2 mb-8">
          <div 
            onClick={() => window.location.href = "/dashboard"}
            className="px-4 py-3.5 rounded-lg cursor-pointer font-medium text-sm transition-all text-white/80 hover:bg-white/10"
          >
            ← Volver al Dashboard
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-72 p-6">
        {/* TOP BAR */}
        <div className="fixed top-0 left-72 right-0 h-16 bg-white shadow-sm flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 uppercase font-semibold">
              Mi Perfil
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications Dropdown */}
            <NotificationsDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              loading={notificationsLoading}
              markAsRead={markAsRead}
              markAllAsRead={markAllAsRead}
              deleteNotification={deleteNotification}
            />
          </div>
        </div>

        {/* Content with top padding */}
        <div className="pt-24 max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Mi Perfil
            </h2>
            <p className="text-gray-600 text-sm">
              Gestiona la información de tu organización
            </p>
          </div>

          {/* Error/Success messages */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg animate-fade-in">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={profileImage}
                        alt={org.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors shadow-md">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
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
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {org.name}
                    </h1>
                    <p className="text-gray-600 mt-1 flex items-center gap-2">
                      {org.role === "hotel" ? (
                        <>
                          <span>Hotel</span>
                        </>
                      ) : (
                        <>
                          <span className="text-green-500">💼</span>
                          <span>Agencia de viajes</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
                    title="Editar perfil"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de la organización
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                      placeholder="Nombre de tu organización"
                    />
                  ) : (
                    <p className="text-lg text-gray-900 font-medium">{org.name}</p>
                  )}
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dirección
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                      placeholder="Dirección completa"
                    />
                  ) : (
                    <p className="text-gray-900">{org.address}</p>
                  )}
                </div>

                {/* Ubicación - AHORA CON SELECTORES DESPLEGABLES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      País
                    </label>
                    {isEditing ? (
                      <select
                        name="country"
                        value={selectedCountry}
                        onChange={(e) => {
                          const country = handleCountryChange(e.target.value);
                          setFormData(prev => ({ ...prev, country, province: "", city: "" }));
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
                      >
                        <option value="">Seleccionar país...</option>
                        {COUNTRIES.map(country => (
                          <option key={country.value} value={country.value}>
                            {country.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-gray-900">{getCurrentCountry()}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Provincia/Distrito
                    </label>
                    {isEditing ? (
                      <select
                        name="province"
                        value={selectedProvince}
                        onChange={(e) => {
                          const province = handleProvinceChange(e.target.value);
                          setFormData(prev => ({ ...prev, province, city: "" }));
                        }}
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
                    ) : (
                      <p className="text-gray-900">{getCurrentProvince()}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ciudad
                    </label>
                    {isEditing ? (
                      <select
                        name="city"
                        value={formData.city || ""}
                        onChange={handleInputChange}
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
                    ) : (
                      <p className="text-gray-900">{getCurrentCity(org.city)}</p>
                    )}
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono de contacto
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                      placeholder="+34 123 456 789"
                    />
                  ) : (
                    <p className="text-gray-900">{org.phone}</p>
                  )}
                </div>

                {/* Sitio web */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sitio web
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={formData.website || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                      placeholder="https://tuweb.com  "
                    />
                  ) : (
                    <p className="text-gray-900">
                      {org.website ? (
                        <a 
                          href={org.website.startsWith('http') ? org.website : `https://${org.website}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 underline"
                        >
                          {org.website}
                        </a>
                      ) : (
                        <span className="text-gray-400">No especificado</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Específico para hoteles */}
                {org.role === "hotel" && (
                  <>
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Información del Hotel
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Categoría hotelera
                          </label>
                          {isEditing ? (
                            <select
                              name="stars"
                              value={formData.stars || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
                            >
                              <option value="">Seleccionar categoría...</option>
                              {STAR_CATEGORIES.map(category => (
                                <option key={category.value} value={category.value}>
                                  {category.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <p className="text-gray-900">
                              {getStarCategoryLabel(org.stars)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Tipos de establecimiento - SELECCIÓN ÚNICA */}
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tipo de establecimiento
                        </label>
                        {isEditing ? (
                          <div className="flex flex-wrap gap-2">
                            {HOTEL_TYPES.map(type => (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() => handleHotelTypeChange(type.value)}
                                className={`px-2.5 py-1 rounded border-2 text-xs font-medium transition-all ${
                                  selectedHotelType === type.value
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                                }`}
                              >
                                {type.label}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-900">
                            {getHotelTypeLabel(org.hotel_type)}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Botones de acción */}
                {isEditing && (
                  <div className="pt-6 border-t border-gray-200 flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center ${
                        saving
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md"
                      }`}
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Guardar cambios
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Estilos globales para animaciones */}
      <style jsx global>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}