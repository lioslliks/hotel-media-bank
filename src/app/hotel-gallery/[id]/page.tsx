"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { useNotifications } from '../../../hooks/useNotifications';

interface MediaItem {
  id: string;
  url: string;
  type: string;
  tags?: any;
  category?: string;
  quality_score?: number;
  created_at: string;
  ai_title?: string;
  versions?: any;
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-all hover:-translate-y-0.5"
      >
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

          {loading && (
            <div className="p-6 text-center text-gray-500 text-sm">
              <div className="w-6 h-6 mx-auto mb-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              Cargando notificaciones...
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="p-6 text-center text-gray-500 text-sm">
              <div className="text-5xl mb-3 opacity-30">🔔</div>
              No hay notificaciones
            </div>
          )}

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
                  <div className="pt-1">
                    {!n.read && (
                      <span className="block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{n.date}</p>
                  </div>

                  <div className="flex items-start">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n.id);
                      }}
                      className="text-gray-400 hover:text-red-600 hover:scale-110 transition-transform"
                      title="Eliminar"
                    >
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
  const hotelId = params?.id as string;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [showErrorReport, setShowErrorReport] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(userId);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const toggleSelectImage = (id: string) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const normalizeHotelGalleryTags = (raw: any): string[] => {
    if (!raw) return [];
    if (typeof raw === 'string') {
      try {
        return normalizeHotelGalleryTags(JSON.parse(raw));
      } catch {
        return [];
      }
    }
    if (Array.isArray(raw)) {
      return raw
        .map(t => {
          if (typeof t === 'string') {
            try {
              const parsed = JSON.parse(t);
              return parsed?.label ?? t;
            } catch {
              return t;
            }
          }
          if (typeof t === 'object') {
            return t.label ?? t.tag ?? null;
          }
          return null;
        })
        .filter(Boolean)
        .map(t => String(t).toLowerCase());
    }
    return [];
  };

  const getCorrectedCategory = (item: MediaItem) => {
    if (item.tags?.includes("restaurant")) {
      return "restaurante";
    }
    if (item.tags?.includes("suite")) {
      return "habitaciones";
    }
    return item.category;
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error al descargar la imagen:', error);
      alert('Error al descargar la imagen. Inténtalo de nuevo.');
    }
  };

  const renderDownloadTable = (versions: any) => {
    if (!versions) return null;
    
    const originalDimensions = versions.original?.dimensions;
    let originalWidth = 0;
    let originalHeight = 0;

    if (originalDimensions) {
      const [w, h] = originalDimensions.split('x').map(Number);
      originalWidth = w;
      originalHeight = h;
    }

    const validVersions = Object.entries(versions)
      .filter(([size, details]: [string, any]) => {
        if (size === 'original') return true;
        if (!details?.dimensions) return false;
        const [w, h] = details.dimensions.split('x').map(Number);
        return w <= originalWidth && h <= originalHeight;
      })
      .sort((a, b) => {
        const order = ['thumbnail', 'small', 'medium', 'large', 'original'];
        return order.indexOf(a[0]) - order.indexOf(b[0]);
      });

    return (
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Opciones de descarga</h4>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Descripción
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Dimensiones
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Relación
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {validVersions.map(([size, details]: [string, any]) => (
                  <tr key={size} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate">
                      {size === 'thumbnail' ? 'Miniatura' : 
                       size === 'small' ? 'Pequeño' : 
                       size === 'medium' ? 'Mediano' : 
                       size === 'large' ? 'Grande' : 'Original'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate">
                      {details.dimensions}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate">
                      {details.aspect_ratio}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {/* ✅ BOTÓN DE DESCARGA CON ICONO ELEGANTE */}
                        <button
                          onClick={() =>
                            handleDownload(details.url, `${size}-${Date.now()}.jpg`)
                          }
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors shadow-sm hover:shadow-md"
                          title="Descargar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        
                        {/* ✅ BOTÓN DE VER CON ICONO ELEGANTE */}
                        <a
                          href={details.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors shadow-sm hover:shadow"
                          title="Ver imagen"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
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
          .select("id, url, type, tags, category, quality_score, created_at, ai_title, versions")
          .eq("hotel_id", hotelId)
          .order("created_at", { ascending: false });

        const parsedMedia = mediaData?.map(item => {
          let versions = item.versions;
          if (versions && typeof versions === 'string') {
            try {
              versions = JSON.parse(versions);
            } catch {
              // keep as-is
            }
          }
          return {
            ...item,
            versions
          };
        }) || [];

        const sortedMedia = [...parsedMedia].sort((a, b) => {
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
      <aside className="w-72 bg-gradient-to-b from-blue-800 to-blue-900 text-white p-6 fixed left-0 top-0 h-screen flex flex-col">
        <div className="flex items-center mb-8 pb-3 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight">Hotel Media Bank</h1>
        </div>

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

      <main className="ml-72 p-6">
        <div className="fixed top-0 left-72 right-0 h-16 bg-white shadow-sm flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 uppercase font-semibold">
              Galería del Hotel
            </span>
          </div>
          
          <div className="flex items-center gap-4">
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

        <div className="pt-24">
          <div className="max-w-7xl mx-auto px-4">
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

            {selectedCategory !== "all" && (
              <a
                href={`/api/download-category?hotel=${hotelId}&category=${selectedCategory}`}
                className="inline-block mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Descargar categoría
              </a>
            )}

            {selectedCategory === "all" && (
              <a
                href={`/api/download-gallery?hotel=${hotelId}`}
                className="inline-block mb-6 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
              >
                Descargar galería completa
              </a>
            )}

            {selectedImages.length > 0 && (
              <a
                href={`/api/download-selection?ids=${selectedImages.join(",")}`}
                className="inline-block mb-6 ml-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
              >
                Descargar selección ({selectedImages.length})
              </a>
            )}

            {filteredMedia.length === 0 ? (
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
                {filteredMedia.map((item, index) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer ${
                      selectedImages.includes(item.id)
                        ? 'ring-2 ring-blue-500 ring-offset-2'
                        : ''
                    }`}
                    onClick={() => setSelectedImage(item)}
                  >
                    <div className="relative">

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

                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            selectedImages.includes(item.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
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
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/400x300?text=Imagen+no+disponible";
                        }}
                      />

                      <div 
                        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white/95 to-white/80 p-5"
                        style={{
                          transition: 'all 1200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                          height: hoveredCard === item.id ? '160px' : '56px',
                          overflow: 'hidden',
                        }}
                        onMouseEnter={() => setHoveredCard(item.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                          {item.ai_title?.trim() ? item.ai_title : "Imagen del hotel"}
                        </h3>

                        {hoveredCard === item.id && (
                          <div 
                            className="mt-4 text-xs text-gray-700 space-y-2"
                            style={{
                              transition: 'opacity 800ms ease-out, transform 800ms ease-out',
                              transform: hoveredCard === item.id ? 'translateY(0)' : 'translateY(10px)',
                              opacity: hoveredCard === item.id ? 1 : 0,
                            }}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-blue-600">🏷️</span>
                              <span>{getCorrectedCategory(item)?.replace("_", " ") || "N/A"}</span>
                            </div>

                            {item.tags && (
                              <div className="flex flex-wrap gap-1.5">
                                {normalizeHotelGalleryTags(item.tags).slice(0, 3).map((tag, i) => (
                                  <span 
                                    key={i} 
                                    className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[11px] font-medium"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-blue-600">📅</span>
                              <span>{item.created_at ? new Date(item.created_at).toLocaleDateString() : "Fecha no disponible"}</span>
                            </div>

                            {item.quality_score !== null && (
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium text-blue-600">⭐</span>
                                <span>{item.quality_score}/100</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ✅ PANEL DE DESCARGA OPTIMIZADO - SIN SCROLL Y 100% EN ESPAÑOL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col md:flex-row overflow-hidden shadow-2xl">
            {/* Contenedor de imagen CENTRADO y ADAPTATIVO */}
            <div className="md:w-1/2 flex items-center justify-center bg-gray-50 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="w-full max-w-[90%] max-h-[80vh] flex items-center justify-center">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.ai_title || "Imagen del hotel"}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Panel de descargas - SIN SCROLL Y 100% EN ESPAÑOL */}
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedImage.ai_title?.trim() || "Imagen del hotel"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedImage.category?.replace("_", " ") || "Sin categoría"}
                  </p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                  aria-label="Cerrar panel"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {renderDownloadTable(selectedImage.versions)}
            </div>
          </div>
        </div>
      )}
      
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