// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
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

export default function Dashboard() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [media, setMedia] = useState<{
    id: string;
    url: string;
    type: string;
    tags?: string[];
    category?: string;
    quality_score?: number;
  }[]>([]);
  const [approvedHotels, setApprovedHotels] = useState<{ id: string; name: string }[]>([]);
  const [expandedHotelId, setExpandedHotelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("gallery");
  const [totalMedia, setTotalMedia] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [connectedAgencies, setConnectedAgencies] = useState(0);
  const [totalHotels, setTotalHotels] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Hook de notificaciones
  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications(userId);

  useEffect(() => {
    const loadOrg = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData?.session) {
          window.location.href = "/login";
          return;
        }

        const userId = sessionData.session.user.id;
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

        // Cargar todas las imágenes del hotel
        if (orgData.role === "hotel") {
          const { data: mediaData } = await supabase
            .from("media")
            .select("id, url, type, tags, category, quality_score")
            .eq("hotel_id", orgData.id)
            .order("created_at", { ascending: false });

          
          setMedia(mediaData || []);
          setTotalMedia(mediaData?.length || 0);

          // Contar solicitudes pendientes
          const { data: requestsData } = await supabase
            .from("agency_hotel_access")
            .select("id")
            .eq("hotel_id", orgData.id)
            .eq("status", "pending");
          
          setPendingRequests(requestsData?.length || 0);

          // Contar agencias conectadas
          const { data: connectedData } = await supabase
            .from("agency_hotel_access")
            .select("id")
            .eq("hotel_id", orgData.id)
            .eq("status", "approved");
          
          setConnectedAgencies(connectedData?.length || 0);
        }

        // Cargar hoteles aprobados para agencias
        if (orgData.role === "agency") {
          const { data: accessData } = await supabase
            .from("agency_hotel_access")
            .select("hotel_id, status")
            .eq("agency_id", orgData.id);

          if (accessData && Array.isArray(accessData)) {
            const approved = accessData.filter(a => a.status === "approved");
            const pending = accessData.filter(a => a.status === "pending");
            
            setTotalHotels(approved.length);
            setPendingRequests(pending.length);

            const hotelIds = approved.map((a: { hotel_id: string }) => a.hotel_id);
            const { data: hotelsData } = await supabase
              .from("organizations")
              .select("id, name")
              .in("id", hotelIds);
            setApprovedHotels(hotelsData || []);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setLoading(false);
      }
    };

    loadOrg();
  }, []);

  // Crear la lista filtrada por categoría
  const filteredMedia =
    selectedCategory === "all"
      ? media
      : media.filter((m) => m.category === selectedCategory);

  // ⭐ Ordenar por calidad (primero las mejores)
  const sortedMedia = [...filteredMedia].sort((a, b) => {
    const qa = a.quality_score ?? 0;
    const qb = b.quality_score ?? 0;
    return qb - qa; // mayor calidad primero
  });

  const toggleHotelGallery = (hotelId: string) => {
    if (expandedHotelId === hotelId) {
      setExpandedHotelId(null);
      setMedia([]);
    } else {
      setExpandedHotelId(hotelId);
      supabase
        .from("media")
        .select("id, url, type, tags, category, quality_score")
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false })
        .then(({ data }) => setMedia((data || []) as any));

    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="p-8 bg-white rounded-xl shadow-sm text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-base">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!org) return null;

  // Foto de perfil: usar profile_image si existe, sino avatar por defecto (SIN ESPACIOS)
  const profileImage = org.profile_image 
    ? org.profile_image 
    : org.role === "hotel"
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(org.name)}&background=3b82f6&color=white`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(org.name)}&background=10b981&color=white`;

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* SINGLE BLUE SIDEBAR */}
      <aside className="w-72 bg-gradient-to-b from-blue-800 to-blue-900 text-white p-6 fixed left-0 top-0 h-screen flex flex-col">
        {/* Header con logo */}
        <div className="flex items-center mb-8 pb-3 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight">Hotel Media Bank</h1>
        </div>

        {/* User profile */}
        <div className="bg-blue-100 rounded-xl p-4 mb-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={profileImage}
                alt={org.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 truncate mb-1">
                {org.name}
              </h3>
              <p className="text-xs text-gray-600 capitalize">
                {org.role === "hotel" ? "Hotel" : "Agencia de viajes"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation menu */}
        <nav className="flex-1 flex flex-col gap-2 mb-8">
          <div 
            onClick={() => {
              setActiveSection("gallery");
              window.location.href = "/dashboard";
            }}
            className={`px-4 py-3.5 rounded-lg cursor-pointer font-medium text-sm transition-all ${
              activeSection === "gallery" 
                ? "bg-white/15 text-white" 
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            Dashboard
          </div>

          {org.role === "hotel" && (
            <div 
              onClick={() => window.location.href = "/hotel-requests"}
              className={`px-4 py-3.5 rounded-lg cursor-pointer font-medium text-sm transition-all ${
                activeSection === "requests" 
                  ? "bg-white/15 text-white" 
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              Solicitudes
            </div>
          )}

          {org.role === "agency" && (
            <div 
              onClick={() => window.location.href = "/agency-requests"}
              className={`px-4 py-3.5 rounded-lg cursor-pointer font-medium text-sm transition-all ${
                activeSection === "requests" 
                  ? "bg-white/15 text-white" 
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              Solicitar Acceso
            </div>
          )}

          <div 
            onClick={() => window.location.href = "/profile"}
            className={`px-4 py-3.5 rounded-lg cursor-pointer font-medium text-sm transition-all ${
              activeSection === "profile" 
                ? "bg-white/15 text-white" 
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            Mi Perfil
          </div>
        </nav>

        {/* Logout button - Centrado y más abajo */}
        <div className="mt-auto pt-5 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-0.5 text-blue-200/90 hover:text-white transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-72 bg-gray-50 p-8 overflow-y-auto">
        {/* TOP BAR */}
        <div className="fixed top-0 left-72 right-0 h-16 bg-white shadow-sm flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 uppercase font-semibold">
              {activeSection === "gallery" ? "Dashboard" : activeSection}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications Dropdown - VERSIÓN COMPLETA SIN CHECK */}
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

        {/* Content with top padding for fixed header */}
        <div className="pt-24">
          {/* Header con título */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {org.role === "hotel" ? "Mi Galería" : "Hoteles Disponibles"}
            </h2>
            <p className="text-gray-600 text-base">
              {org.role === "hotel" 
                ? "Gestiona y comparte tu contenido multimedia con agencias autorizadas"
                : "Accede al contenido multimedia de tus hoteles asociados"}
            </p>
          </div>

          {/* Contenido según rol */}
          {org.role === "hotel" && (
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8">
                {/* Filtro por categoría */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {[
                    { key: "all", label: "Todas" },
                    { key: "exterior", label: "Exterior" },
                    { key: "habitaciones", label: "Habitaciones" },
                    { key: "interior", label: "Interior" },
                    { key: "salas_comunes", label: "Salas comunes" },
                    { key: "restaurante", label: "Restaurante" },
                    { key: "piscina", label: "Piscina" },
                    { key: "spa", label: "Spa" },
                    { key: "otros", label: "Otros" },
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        selectedCategory === cat.key
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {sortedMedia.length === 0 ? (
                  <div className="text-center py-16 px-8">
                    <div className="text-8xl mb-4 opacity-30"></div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {selectedCategory === "all" 
                        ? "Bienvenido a tu galería" 
                        : `No hay contenido en la categoría "${selectedCategory.replace("_", " ")}"`}
                    </h3>
                    <p className="text-gray-600 text-base mb-8 max-w-lg mx-auto">
                      {selectedCategory === "all"
                        ? "Sube tus primeras fotos y videos para empezar a compartir tu contenido con agencias de viajes."
                        : "No hay contenido multimedia en esta categoría. Sube contenido o cambia la categoría."}
                    </p>
                    {selectedCategory === "all" && (
                      <button
                        onClick={() => window.location.href = "/hotel-media"}
                        className="px-10 py-4 bg-blue-500 text-white rounded-lg font-semibold text-base shadow-md hover:bg-blue-600 hover:shadow-lg transition-all hover:-translate-y-0.5"
                      >
                        Subir mi primer contenido
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                      {sortedMedia.map((item, index) => (
                        <div 
                          key={item.id || index} 
                          className="rounded-xl overflow-hidden shadow-sm transition-all cursor-pointer bg-white hover:translate-y-[-4px] hover:shadow-lg"
                        >
                          {item.type === "video" ? (
                            <div className="w-full pt-[75%] bg-gradient-to-br from-black to-gray-800 flex items-center justify-center text-white text-4xl relative">
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                🎥
                              </div>
                            </div>
                          ) : (
                            <img
                              src={item.url}
                              alt={`Media ${index}`}
                              loading="lazy"
                              className="w-full h-48 object-cover block transition-transform hover:scale-105"
                            />
                          )}
                          <div className="p-4 bg-gray-50 border-t border-gray-200">
                            {item.category && (
                              <p className="text-xs font-semibold text-blue-600 mb-2 capitalize">
                                {item.category.replace("_", " ")}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-1 mb-2">
                              {item.tags?.map((tag: string) => (
                                <span
                                  key={tag}
                                  className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <p className="text-xs text-gray-500">
                              {item.type === "video" ? "Video" : "Foto"} — {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center mt-6">
                      <button
                        onClick={() => window.location.href = "/hotel-media"}
                        className="px-8 py-3.5 bg-blue-50 text-blue-600 rounded-lg font-semibold text-sm hover:bg-blue-100 transition-all hover:-translate-y-0.5"
                      >
                        Subir o gestionar más contenido
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {org.role === "agency" && (
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8">
                {approvedHotels.length === 0 ? (
                  <div className="text-center py-16 px-8">
                    <div className="text-8xl mb-4 opacity-30"></div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Sin acceso a hoteles
                    </h3>
                    <p className="text-gray-600 text-base mb-8 max-w-lg mx-auto">
                      Solicita acceso a hoteles para comenzar a explorar sus galerías de contenido.
                    </p>
                    <button
                      onClick={() => window.location.href = "/agency-requests"}
                      className="px-10 py-4 bg-blue-500 text-white rounded-lg font-semibold text-base shadow-md hover:bg-blue-600 hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      Solicitar acceso ahora
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Grid de tarjetas de hoteles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {approvedHotels.map((hotel) => (
                        <div
                          key={hotel.id}
                          className={`bg-white rounded-xl border ${
                            expandedHotelId === hotel.id 
                              ? "border-blue-400 shadow-md" 
                              : "border-gray-200 hover:border-blue-300"
                          } transition-all cursor-pointer`}
                          onClick={() => toggleHotelGallery(hotel.id)}
                        >
                          <div className="p-5">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className={`text-lg font-bold ${
                                  expandedHotelId === hotel.id ? "text-blue-600" : "text-gray-900"
                                }`}>
                                  {hotel.name}
                                </h4>
                              </div>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                expandedHotelId === hotel.id 
                                  ? "bg-blue-100 text-blue-600" 
                                  : "bg-gray-100 text-gray-600"
                              }`}>
                                {expandedHotelId === hotel.id ? "−" : "+"}
                              </div>
                            </div>

                            {/* Contenido expandido */}
                            {expandedHotelId === hotel.id && media.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="mb-3">
                                  <span className="text-sm font-semibold text-gray-700">
                                    Contenido reciente ({media.length} medios)
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                  {media.slice(0, 6).map((item, idx) => (
                                    <div 
                                      key={`preview-${idx}`}
                                      className="aspect-square rounded overflow-hidden border border-gray-200"
                                    >
                                      {item.type === "video" ? (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-lg">
                                          ▶
                                        </div>
                                      ) : (
                                        <img
                                          src={item.url}
                                          alt={`Preview ${idx}`}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=No+Image";
                                          }}
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <div className="flex gap-3">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = `/hotel-gallery/${hotel.id}`;
                                    }}
                                    className="flex-1 bg-blue-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                  >
                                    Ver galería completa
                                  </button>
                                </div>
                              </div>
                            )}

                            {expandedHotelId === hotel.id && media.length === 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-200 text-center py-4 bg-gray-50 rounded-lg">
                                <p className="text-gray-600 text-sm">
                                  Este hotel aún no ha subido contenido multimedia
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
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