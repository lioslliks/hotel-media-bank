// src/app/hotel-gallery/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { useNotifications } from '../../../hooks/useNotifications';

interface MediaItem {
  id: string;
  url: string;
  type: string;
  tags?: string[];
  category?: string;
  quality_score?: number;
  created_at: string;
}

interface Hotel {
  id: string;
  name: string;
  stars?: number;
  hotel_type?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  profile_image?: string;
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

export default function HotelGalleryPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.id as string;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [showErrorReport, setShowErrorReport] = useState<string | null>(null);
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

  // Selección múltiple
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const toggleSelectImage = (id: string) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Nuevo: Corrección de categorías problemáticas
  const getCorrectedCategory = (item: MediaItem) => {
    // Regla de negocio crítica: Si tiene tag "restaurant", debe ser categoría "restaurante"
    if (item.tags?.includes("restaurant")) {
      return "restaurante";
    }
    
    // Regla de negocio: Si tiene tag "suite", debe ser categoría "habitaciones"
    if (item.tags?.includes("suite")) {
      return "habitaciones";
    }
    
    return item.category;
  };

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session) {
          router.push("/login");
          return;
        }

        const userId = sessionData.session.user.id;
        setUserId(userId);

        const { data: orgData } = await supabase
          .from("organizations")
          .select("id, role")
          .eq("created_by", userId)
          .maybeSingle();

        if (!orgData || orgData.role !== "agency") {
          router.push("/dashboard");
          return;
        }

        const { data: accessData } = await supabase
          .from("agency_hotel_access")
          .select("status")
          .eq("agency_id", orgData.id)
          .eq("hotel_id", hotelId)
          .maybeSingle();

        if (!accessData || accessData.status !== "approved") {
          alert("No tienes acceso a este hotel");
          router.push("/dashboard");
          return;
        }

        const { data: hotelData } = await supabase
          .from("organizations")
          .select("*")
          .eq("id", hotelId)
          .maybeSingle();

        if (!hotelData) {
          router.push("/dashboard");
          return;
        }

        setHotel(hotelData as Hotel);

        const { data: mediaData } = await supabase
          .from("media")
          .select("id, url, type, tags, category, quality_score, created_at")
          .eq("hotel_id", hotelId)
          .order("created_at", { ascending: false });

        const sortedMedia = [...(mediaData || [])].sort((a, b) => {
          const qa = a.quality_score ?? 0;
          const qb = b.quality_score ?? 0;
          return qb - qa;
        });

        setMedia(sortedMedia);
        setLoading(false);
      } catch (err) {
        console.error("Error loading gallery:", err);
        setLoading(false);
      }
    };

    if (hotelId) loadGallery();
  }, [hotelId, router]);

  const filteredMedia =
    selectedCategory === "all"
      ? media
      : media.filter((m) => getCorrectedCategory(m) === selectedCategory);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const goBack = () => {
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-sm text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-base">Cargando galería...</p>
        </div>
      </div>
    );
  }

  if (!hotel) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* SIDEBAR IZQUIERDO - AZUL GRADIENTE */}
      <aside className="w-72 bg-gradient-to-b from-blue-800 to-blue-900 text-white p-6 fixed left-0 top-0 h-screen flex flex-col">
        {/* Header con logo */}
        <div className="flex items-center mb-8 pb-3 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight">Hotel Media Bank</h1>
        </div>

        {/* User profile mini */}
        {hotel && (
          <div className="bg-blue-100 rounded-xl p-4 mb-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={hotel.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(hotel.name)}&background=3b82f6&color=white`}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 truncate mb-0.5">
                  {hotel.name}
                </h3>
                <p className="text-xs text-gray-600 capitalize">
                  Hotel
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation menu */}
        <nav className="flex-1 flex flex-col gap-2 mb-8">
          <div 
            onClick={goBack}
            className="px-4 py-3.5 rounded-lg cursor-pointer font-medium text-sm transition-all text-white/80 hover:bg-white/10 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Volver al Dashboard</span>
          </div>
        </nav>

        {/* Logout button */}
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
      <main className="ml-72 p-6">
        {/* TOP BAR - MEJORADA */}
        <div className="fixed top-0 left-72 right-0 h-16 bg-white shadow-sm flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 uppercase font-semibold">
              Galería del Hotel
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

        {/* Main content with top padding */}
        <div className="pt-24">
          <div className="max-w-7xl mx-auto px-4">

            {/* Filtro */}
            <div className="mb-8 flex flex-wrap gap-2">
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
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    selectedCategory === cat.key
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Botón de descarga por categoría */}
            {selectedCategory !== "all" && (
              <a
                href={`/api/download-category?hotel=${hotelId}&category=${selectedCategory}`}
                className="inline-block mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Descargar categoría
              </a>
            )}

            {/* Botón de descarga de galería completa */}
            {selectedCategory === "all" && (
              <a
                href={`/api/download-gallery?hotel=${hotelId}`}
                className="inline-block mb-6 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
              >
                Descargar galería completa
              </a>
            )}

            {/* Botón de descarga selección */}
            {selectedImages.length > 0 && (
              <a
                href={`/api/download-selection?ids=${selectedImages.join(",")}`}
                className="inline-block mb-6 ml-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
              >
                Descargar selección ({selectedImages.length})
              </a>
            )}

            {/* Grid */}
            {filteredMedia.length === 0 ? (
              // Mensaje de "sin contenido" mejorado para estética B2B
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  {selectedCategory === "all"
                    ? "Sin contenido multimedia"
                    : `No hay contenido en "${selectedCategory.replace("_", " ")}"`}
                </h3>
                <p className="text-gray-500 text-base">
                  {selectedCategory === "all"
                    ? "Este hotel aún no ha subido fotos o videos."
                    : "No hay contenido en esta categoría."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMedia.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${
                      selectedImages.includes(item.id) 
                        ? 'ring-2 ring-blue-500 ring-offset-2 scale-[1.01] shadow-md' 
                        : 'hover:scale-[1.01]'
                    }`}
                    onClick={() => setExpandedImage(item.url)}
                  >
                    <div className="relative group">

                      {/* Checkbox con animación mejorada */}
                      <label
                        htmlFor={`select-${item.id}`}
                        className="absolute top-3 right-3 z-20 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          id={`select-${item.id}`}
                          type="checkbox"
                          checked={selectedImages.includes(item.id)}
                          onChange={() => toggleSelectImage(item.id)}
                          className="hidden"
                        />
                        
                        {/* Círculo exterior con animación */}
                        <div 
                          className={`relative w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                            selectedImages.includes(item.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 bg-white hover:border-blue-400'
                          } flex items-center justify-center`}
                        >
                          {/* Punto central con animación de escala */}
                          <div 
                            className={`w-3 h-3 rounded-full transition-all duration-300 transform ${
                              selectedImages.includes(item.id)
                                ? 'bg-blue-500 scale-100 opacity-100'
                                : 'bg-gray-300 scale-0 opacity-0'
                            }`}
                          />
                        </div>
                      </label>

                      <img
                        src={item.url}
                        alt={item.category || "Hotel media"}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* Nuevo: Alerta de clasificación incorrecta */}
                      {item.category !== getCorrectedCategory(item) && (
                        <div className="absolute top-3 left-3 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium z-10">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Corregir categoría
                          </span>
                        </div>
                      )}
                    </div>

                    {/* INFO + ICONO DE DESCARGA */}
                    <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-start">
                      <div className="flex-1">
                        {/* Usamos la categoría corregida */}
                        {getCorrectedCategory(item) && (
                          <p className="text-xs font-semibold text-blue-600 mb-2 capitalize">
                            {getCorrectedCategory(item).replace("_", " ")}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.tags?.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {item.tags && item.tags.length > 3 && (
                            <span className="text-gray-400 text-xs">
                              +{item.tags.length - 3}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500">
                          {item.type === "video" ? "Video" : "Foto"} —{" "}
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <a
                        href={`/api/download?url=${encodeURIComponent(item.url)}&id=${item.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="ml-3 text-gray-400 hover:text-blue-600 transition"
                        title="Descargar"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <img
              src={expandedImage}
              alt="Expanded view"
              className="w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
      
      {/* Nuevo: Componente de corrección de errores */}
      {showErrorReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Corregir clasificación</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría actual
                </label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-2">
                  {media.find(m => m.id === showErrorReport)?.category?.replace("_", " ") || "N/A"}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría correcta
                </label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={media.find(m => m.id === showErrorReport)?.category}
                >
                  <option value="habitaciones">Habitaciones</option>
                  <option value="restaurante">Restaurante</option>
                  <option value="exterior">Exterior</option>
                  <option value="interior">Interior</option>
                  <option value="salas_comunes">Salas comunes</option>
                  <option value="piscina">Piscina</option>
                  <option value="spa">Spa</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowErrorReport(null)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Aquí iría la lógica para reportar el error
                    console.log("Reportando error de clasificación");
                    setShowErrorReport(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Confirmar corrección
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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