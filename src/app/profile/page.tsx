// src/app/profile/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { COUNTRIES, useLocations } from "../../hooks/useLocations";
import { useNotifications } from "../../hooks/useNotifications";

interface Organization {
  id: string;
  name: string;
  role: "hotel" | "agency" | string;
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

const STAR_CATEGORIES = [
  { value: 1, label: "1* Económico" },
  { value: 2, label: "2* Estándar" },
  { value: 3, label: "3* Confort" },
  { value: 4, label: "4* Superior" },
  { value: 5, label: "5* Lujo" },
];

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read?: boolean;
}

interface NotificationsDropdownProps {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const BellIcon = (props: { className?: string }) => (
  <svg
    className={props.className ?? "w-6 h-6"}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 01-6 0m6 0H9"
    />
  </svg>
);

const XIcon = (props: { className?: string }) => (
  <svg
    className={props.className ?? "w-4 h-4"}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Spinner = (props: { className?: string }) => (
  <div
    className={
      props.className ??
      "w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
    }
    aria-hidden="true"
  />
);

const NotificationsDropdown = ({
  notifications,
  unreadCount,
  loading,
  markAsRead,
  markAllAsRead,
  deleteNotification,
}: NotificationsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".notifications-dropdown")) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="notifications-dropdown relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="relative p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition"
        type="button"
        aria-label="Notificaciones"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-[420px] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-fade-in-down">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                type="button"
              >
                Marcar todo como leído
              </button>
            )}
          </div>

          {loading && (
            <div className="p-6 text-center text-gray-500 text-sm">
              <div className="flex justify-center mb-2">
                <Spinner />
              </div>
              Cargando notificaciones...
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              <div className="text-4xl mb-2 opacity-30">—</div>
              No hay notificaciones
            </div>
          )}

          {!loading && notifications.length > 0 && (
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-4 transition cursor-pointer ${
                    !n.read ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    if (!n.read) markAsRead(n.id);
                  }}
                >
                  <div className="pt-1">
                    {!n.read && <span className="block w-2 h-2 bg-blue-600 rounded-full" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{n.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{n.date}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                    className="text-gray-400 hover:text-red-600 transition"
                    title="Eliminar"
                    type="button"
                  >
                    <XIcon />
                  </button>
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

  const {
    selectedCountry,
    selectedProvince,
    availableProvinces,
    availableCities,
    handleCountryChange,
    handleProvinceChange,
    getCurrentCountry,
    getCurrentProvince,
    getCurrentCity,
  } = useLocations();

  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(userId);

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [selectedHotelType, setSelectedHotelType] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data?.session) {
          window.location.href = "/login";
          return;
        }

        const uid = data.session.user.id;
        setUserId(uid);

        const { data: orgData } = await supabase
          .from("organizations")
          .select("*")
          .eq("created_by", uid)
          .maybeSingle();

        if (!orgData) {
          window.location.href = "/setup-organization";
          return;
        }

        setOrg(orgData as Organization);
        setFormData(orgData as Organization);

        if (orgData.country) handleCountryChange(orgData.country);
        if (orgData.province) handleProvinceChange(orgData.province);
        if (orgData.hotel_type) setSelectedHotelType(orgData.hotel_type);

        setLoading(false);
      } catch (err) {
        console.error("Error loading profile:", err);
        window.location.href = "/login";
      }
    };

    void loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const profileImage = useMemo(() => {
    if (!org) return "";
    if (profileImagePreview) return profileImagePreview;
    if (org.profile_image) return org.profile_image;

    const bg = org.role === "hotel" ? "3b82f6" : "10b981";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(org.name)}&background=${bg}&color=ffffff`;
  }, [org, profileImagePreview]);

  const getStarCategoryLabel = (stars: number | null) => {
    if (!stars) return "No especificado";
    const category = STAR_CATEGORIES.find((c) => c.value === stars);
    return category ? category.label : `${stars}*`;
  };

  const getHotelTypeLabel = (hotelType: string | null) => {
    if (!hotelType) return "No especificado";
    return HOTEL_TYPES.find((t) => t.value === hotelType)?.label ?? hotelType;
  };

  const uploadProfileImage = async () => {
    if (!profileImageFile || !org) return null;

    try {
      const fileExt = profileImageFile.name.split(".").pop() || "jpg";
      const fileName = `${org.id}_profile_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, profileImageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("profile-images").getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("organizations")
        .update({ profile_image: data.publicUrl })
        .eq("id", org.id);

      if (updateError) throw updateError;

      setOrg((prev) => (prev ? ({ ...prev, profile_image: data.publicUrl } as Organization) : prev));
      setProfileImagePreview(null);
      setProfileImageFile(null);

      return data.publicUrl;
    } catch (err) {
      console.error("Error uploading profile image:", err);
      setError("Error al subir la imagen de perfil");
      return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleHotelTypeChange = (value: string) => {
    setSelectedHotelType((prev) => (prev === value ? null : value));
  };

  const handleSave = async () => {
    if (!org) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let newProfileImage = org.profile_image;
      if (profileImageFile) {
        newProfileImage = (await uploadProfileImage()) || org.profile_image;
      }

      const updateData: any = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        country: formData.country,
        province: formData.province,
        city: formData.city,
        website: formData.website,
        profile_image: newProfileImage,
      };

      if (org.role === "hotel") {
        updateData.stars = formData.stars ? parseInt(formData.stars as any, 10) : null;
        updateData.hotel_type = selectedHotelType;
      }

      const { error } = await supabase.from("organizations").update(updateData).eq("id", org.id);
      if (error) throw error;

      setOrg((prev) => (prev ? ({ ...prev, ...updateData } as Organization) : prev));
      setFormData((prev) => ({ ...prev, ...updateData }));
      setIsEditing(false);

      setSuccess("Perfil actualizado correctamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      let errorMessage = "Error desconocido";
      if (err instanceof Error) errorMessage = err.message;
      else if (typeof err === "object" && err !== null) {
        const anyErr = err as any;
        errorMessage =
          anyErr.message ||
          anyErr.error_description ||
          anyErr.details ||
          JSON.stringify(anyErr);
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      console.error("Error saving profile:", err);
      setError(`Error al guardar los cambios: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!org) return;

    setFormData(org);
    setIsEditing(false);
    setProfileImageFile(null);
    setProfileImagePreview(null);

    if (org.country) handleCountryChange(org.country);
    if (org.province) handleProvinceChange(org.province);

    if (org.hotel_type) setSelectedHotelType(org.hotel_type);
    else setSelectedHotelType(null);

    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="p-8 bg-white rounded-2xl shadow-sm text-center border border-gray-200">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 text-base">Cargando perfil…</p>
        </div>
      </div>
    );
  }

  if (!org) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* SIDEBAR */}
<aside className="w-72 bg-gradient-to-b from-blue-800 to-blue-900 text-white p-6 fixed left-0 top-0 h-screen flex flex-col">
  <div className="flex items-center mb-8 pb-4 border-b border-white/10">
    <h1 className="text-xl font-bold tracking-tight">Hotel Media Bank</h1>
  </div>

  <nav className="flex-1 flex flex-col gap-2">
    <button
      onClick={() => (window.location.href = "/dashboard")}
      className="px-4 py-3 rounded-xl text-left cursor-pointer font-medium text-sm transition text-white/90 hover:bg-white/10"
      type="button"
    >
      ← Volver al Dashboard
    </button>

    {/* Ítem activo: Mi perfil */}
    <div className="mt-3 border-t border-white/10 pt-4">
      <div className="relative w-full px-4 py-3 rounded-xl text-left font-medium text-sm bg-white/15 text-white">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r"></span>
        Mi perfil
      </div>
    </div>
  </nav>
</aside>


      {/* MAIN CONTENT */}
      <main className="ml-72">
        {/* TOP BAR */}
        <div className="fixed top-0 left-72 right-0 h-16 bg-white/95 backdrop-blur border-b border-gray-200 flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 uppercase font-semibold tracking-wide">
              Mi perfil
            </span>
          </div>

          <div className="flex items-center gap-4">
            <NotificationsDropdown
              notifications={notifications as unknown as NotificationItem[]}
              unreadCount={unreadCount}
              loading={notificationsLoading}
              markAsRead={markAsRead}
              markAllAsRead={markAllAsRead}
              deleteNotification={deleteNotification}
            />
          </div>
        </div>

        {/* Content */}
        <div className="pt-24 p-6">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Mi Perfil</h2>
              <p className="text-gray-600 text-sm">Gestiona la información de tu organización</p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm">
                {success}
              </div>
            )}

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
                        <img src={profileImage} alt={org.name} className="w-full h-full object-cover" />
                      </div>

                      {isEditing && (
                        <label
                          className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition shadow"
                          title="Cambiar foto"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7h4l2-2h6l2 2h4v14H3V7z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11a3 3 0 100 6 3 3 0 000-6z" />
                          </svg>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setProfileImageFile(file);
                              setProfileImagePreview(URL.createObjectURL(file));
                            }}
                          />
                        </label>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h1 className="text-2xl font-bold text-gray-900 truncate">{org.name}</h1>
                      <p className="text-gray-600 mt-1 text-sm">
                        {org.role === "hotel" ? "Hotel" : "Agencia de viajes"}
                      </p>
                    </div>
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 transition text-sm font-semibold"
                      type="button"
                    >
                      Editar perfil
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
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
                        value={(formData.name as string) || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                        placeholder="Nombre de tu organización"
                      />
                    ) : (
                      <p className="text-lg text-gray-900 font-medium">{org.name}</p>
                    )}
                  </div>

                  {/* Dirección */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={(formData.address as string) || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                        placeholder="Dirección completa"
                      />
                    ) : (
                      <p className="text-gray-900">{org.address || "No especificado"}</p>
                    )}
                  </div>

                  {/* Ubicación */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">País</label>
                      {isEditing ? (
                        <select
                          name="country"
                          value={selectedCountry}
                          onChange={(e) => {
                            const country = handleCountryChange(e.target.value);
                            setFormData((prev) => ({ ...prev, country, province: "", city: "" }));
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                        >
                          <option value="">Seleccionar país...</option>
                          {COUNTRIES.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-gray-900">{getCurrentCountry()}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Provincia / Distrito
                      </label>
                      {isEditing ? (
                        <select
                          name="province"
                          value={selectedProvince}
                          onChange={(e) => {
                            const province = handleProvinceChange(e.target.value);
                            setFormData((prev) => ({ ...prev, province, city: "" }));
                          }}
                          disabled={!selectedCountry}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                            !selectedCountry ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                          }`}
                        >
                          <option value="">Seleccionar provincia...</option>
                          {availableProvinces.map((p) => (
                            <option key={p.value} value={p.value}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-gray-900">{getCurrentProvince()}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ciudad</label>
                      {isEditing ? (
                        <select
                          name="city"
                          value={(formData.city as string) || ""}
                          onChange={handleInputChange}
                          disabled={!selectedProvince}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                            !selectedProvince ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                          }`}
                        >
                          <option value="">Seleccionar ciudad...</option>
                          {availableCities.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
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
                        value={(formData.phone as string) || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                        placeholder="+34 123 456 789"
                      />
                    ) : (
                      <p className="text-gray-900">{org.phone || "No especificado"}</p>
                    )}
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sitio web</label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="website"
                        value={(formData.website as string) || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                        placeholder="https://tuweb.com"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {org.website ? (
                          <a
                            href={org.website.startsWith("http") ? org.website : `https://${org.website}`}
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

                  {/* Hotel-only */}
                  {org.role === "hotel" && (
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Información del Hotel</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Categoría hotelera
                          </label>

                          {isEditing ? (
                            <select
                              name="stars"
                              value={(formData.stars as any) || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                            >
                              <option value="">Seleccionar categoría...</option>
                              {STAR_CATEGORIES.map((c) => (
                                <option key={c.value} value={c.value}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <p className="text-gray-900">{getStarCategoryLabel(org.stars)}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tipo de establecimiento
                        </label>

                        {isEditing ? (
                          <div className="flex flex-wrap gap-2">
                            {HOTEL_TYPES.map((type) => (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() => handleHotelTypeChange(type.value)}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
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
                          <p className="text-gray-900">{getHotelTypeLabel(org.hotel_type)}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {isEditing && (
                    <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-6 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center ${
                          saving
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                        }`}
                        type="button"
                      >
                        {saving ? (
                          <>
                            <Spinner className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Guardando...
                          </>
                        ) : (
                          "Guardar cambios"
                        )}
                      </button>

                      <button
                        onClick={handleCancel}
                        className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl font-semibold text-sm hover:bg-gray-200 transition"
                        type="button"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </main>

      {/* Animaciones */}
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
