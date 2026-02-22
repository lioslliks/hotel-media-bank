"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNotifications } from "../../hooks/useNotifications";
import { useRouter } from "next/navigation";
import VisualImpactGallery from "./VisualImpactGallery";

/* =======================
   TYPES
======================= */

interface Organization {
  id: string;
  name: string;
  role: "hotel" | "agency";
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

interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  tags?: string[];
  category?: string;
  quality_score?: number;
  created_at: string;
  versions?: any;
  ai_title?: string;
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

/* =======================
   NOTIFICATIONS DROPDOWN
======================= */

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
      if (!target.closest(".notifications-dropdown")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="notifications-dropdown relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition"
        type="button"
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
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 01-6 0"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-fade-in-down">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-900">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-blue-600 hover:underline"
                type="button"
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
              No hay notificaciones
            </div>
          )}

          {!loading && notifications.length > 0 && (
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && markAsRead(n.id)}
                  className={`flex items-start gap-3 px-4 py-4 cursor-pointer ${
                    !n.read ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="pt-1">
                    {!n.read && (
                      <span className="block w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{n.date}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                    className="text-gray-400 hover:text-red-600 transition"
                    type="button"
                  >
                    ✕
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

export default function Dashboard() {
  const router = useRouter();
  const mainContentRef = useRef<HTMLDivElement>(null);

  const [org, setOrg] = useState<Organization | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [approvedHotels, setApprovedHotels] = useState<{ id: string; name: string }[]>([]);
  const [expandedHotelId, setExpandedHotelId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"gallery" | "requests" | "profile">("gallery");

  const [totalMedia, setTotalMedia] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [connectedAgencies, setConnectedAgencies] = useState(0);
  const [totalHotels, setTotalHotels] = useState(0);

  const [userId, setUserId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{ id: string; url: string } | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(userId);

  /* =======================
     HELPERS
  ======================= */
  
  const normalizeDashboardTags = (raw: any): string[] => { 
    if (!raw) return []; 
    if (typeof raw === 'string') { 
      try { 
        return normalizeDashboardTags(JSON.parse(raw)); 
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

  const parseMediaVersions = (mediaData: any[]) => {
    return mediaData.map(item => ({
      ...item,
      versions: item.versions && typeof item.versions === 'string' 
        ? JSON.parse(item.versions) 
        : item.versions
    }));
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

  // ✅ FUNCIÓN ACTUALIZADA CON ICONOS, SIN SCROLL Y 100% EN ESPAÑOL
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

  /* =======================
     LOAD INITIAL DATA
  ======================= */

  useEffect(() => {
    let isMounted = true;
    
    const loadOrgAndData = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData?.session) {
          router.push("/login");
          return;
        }

        const uid = sessionData.session.user.id;
        if (isMounted) setUserId(uid);

        const { data: orgData } = await supabase
          .from("organizations")
          .select("*")
          .eq("created_by", uid)
          .maybeSingle();

        if (!orgData) {
          router.push("/setup-organization");
          return;
        }

        if (isMounted) setOrg(orgData as Organization);

        if (orgData.role === "hotel") {
          const { data: mediaData } = await supabase
            .from("media")
            .select("id, url, type, tags, category, quality_score, created_at, versions, ai_title")
            .eq("hotel_id", orgData.id)
            .order("created_at", { ascending: false });

          const parsedMedia = parseMediaVersions(mediaData || []);

          if (isMounted) {
            setMedia(parsedMedia);
            setTotalMedia(parsedMedia.length || 0);
          }

          const { data: requestsData } = await supabase
            .from("agency_hotel_access")
            .select("id")
            .eq("hotel_id", orgData.id)
            .eq("status", "pending");

          if (isMounted) setPendingRequests(requestsData?.length || 0);

          const { data: connectedData } = await supabase
            .from("agency_hotel_access")
            .select("id")
            .eq("hotel_id", orgData.id)
            .eq("status", "approved");

          if (isMounted) setConnectedAgencies(connectedData?.length || 0);
        }

        if (orgData.role === "agency") {
          const { data: accessData } = await supabase
            .from("agency_hotel_access")
            .select("hotel_id, status")
            .eq("agency_id", orgData.id);

          if (accessData && Array.isArray(accessData) && isMounted) {
            const approved = accessData.filter((a) => a.status === "approved");
            const pending = accessData.filter((a) => a.status === "pending");

            setTotalHotels(approved.length);
            setPendingRequests(pending.length);

            const hotelIds = approved.map((a) => a.hotel_id);

            if (hotelIds.length > 0) {
              const { data: hotelsData } = await supabase
                .from("organizations")
                .select("id, name")
                .in("id", hotelIds);

              if (isMounted) setApprovedHotels(hotelsData || []);
            }
          }
        }

        if (isMounted) setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        if (isMounted) setLoading(false);
      }
    };

    loadOrgAndData();

    return () => {
      isMounted = false;
    };
  }, [router]);

  /* =======================
     FILTER & SORT
  ======================= */

  const filteredMedia =
    selectedCategory === "all"
      ? media
      : media.filter((m) => m.category === selectedCategory);

  const sortedByDateMedia = useMemo(() => {
    return [...filteredMedia].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });
  }, [filteredMedia]);

  /* =======================
     HELPERS
  ======================= */

  const toggleHotelGallery = (hotelId: string) => {
    if (expandedHotelId === hotelId) {
      setExpandedHotelId(null);
      setMedia([]);
    } else {
      setExpandedHotelId(hotelId);
      supabase
        .from("media")
        .select("id, url, type, tags, category, quality_score, created_at, versions, ai_title")
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data) {
            const parsedMedia = parseMediaVersions(data as MediaItem[]);
            setMedia(parsedMedia);
          }
        });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const resetDashboardView = () => {
    setActiveSection("gallery");
    setSelectedCategory("all");
    setExpandedHotelId(null);
    if (org?.role === "agency") {
      setMedia([]);
    }
    mainContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
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
  
  const profileImage = org.profile_image
    ? org.profile_image
    : org.role === "hotel"
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(org.name)}&background=3b82f6&color=ffffff`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(org.name)}&background=10b981&color=ffffff`;

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <aside className="w-72 bg-gradient-to-b from-blue-800 to-blue-900 text-white p-6 fixed left-0 top-0 h-screen flex flex-col">
        <div className="flex items-center mb-8 pb-4 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight">Hotel Media Bank</h1>
        </div>

        <div className="bg-blue-100 rounded-xl p-4 mb-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={profileImage}
                alt={org.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = org.role === "hotel"
                    ? `https://ui-avatars.com/api/?name=Hotel&background=3b82f6&color=ffffff`
                    : `https://ui-avatars.com/api/?name=Agencia&background=10b981&color=ffffff`;
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-blue-900 truncate mb-1">
                {org.name}
              </h3>
              <p className="text-xs text-gray-600 capitalize">
                {org.role === "hotel" ? "Hotel" : "Agencia de viajes"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <div
            onClick={resetDashboardView}
            className={`relative px-4 py-3.5 rounded-xl cursor-pointer font-medium text-sm transition-all ${
              activeSection === "gallery"
                ? "bg-white/15 text-white"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            {activeSection === "gallery" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r"></span>
            )}
            Dashboard
          </div>

          {org.role === "hotel" && (
            <div
              onClick={() => {
                setActiveSection("requests");
                router.push("/hotel-requests");
              }}
              className={`relative px-4 py-3.5 rounded-xl cursor-pointer font-medium text-sm transition-all ${
                activeSection === "requests"
                  ? "bg-white/15 text-white"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              {activeSection === "requests" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r"></span>
              )}
              Solicitudes
            </div>
          )}

          {org.role === "agency" && (
            <div
              onClick={() => {
                setActiveSection("requests");
                router.push("/agency-requests");
              }}
              className={`relative px-4 py-3.5 rounded-xl cursor-pointer font-medium text-sm transition-all ${
                activeSection === "requests"
                  ? "bg-white/15 text-white"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              {activeSection === "requests" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r"></span>
              )}
              Solicitar acceso
            </div>
          )}

          <div
            onClick={() => {
              setActiveSection("profile");
              router.push("/profile");
            }}
            className={`relative px-4 py-3.5 rounded-xl cursor-pointer font-medium text-sm transition-all ${
              activeSection === "profile"
                ? "bg-white/15 text-white"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            {activeSection === "profile" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r"></span>
            )}
            Mi perfil
          </div>
        </nav>

        <div className="mt-auto pt-5 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-blue-200 hover:text-white transition-colors text-sm font-medium"
            type="button"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main 
        ref={mainContentRef}
        className="flex-1 ml-72 bg-gray-50 p-8 overflow-y-auto"
      >
        <div className="fixed top-0 left-72 right-0 h-16 bg-white shadow-sm flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 uppercase font-semibold">
              {activeSection === "gallery"
                ? "Dashboard"
                : activeSection === "requests"
                ? "Solicitudes"
                : "Mi perfil"}
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

  {/* TÍTULO + DESCRIPCIÓN */}
  <div className="mb-8">
    <h2 className="text-3xl font-bold text-gray-900 mb-2">
      {org.role === "hotel" ? "Mi Galería" : "Hoteles Disponibles"}
    </h2>
    <p className="text-gray-600 text-base max-w-2xl">
      {org.role === "hotel"
        ? "Gestiona y comparte tu contenido multimedia con agencias autorizadas"
        : "Accede al contenido multimedia de tus hoteles asociados"}
    </p>
  </div>

  {/* 👇 AQUÍ VA VisualImpactGallery */}
  {org.role === "hotel" && media.length > 0 && (
  <div className="mb-12">
    <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg">
      <div className="p-8">
        <VisualImpactGallery media={media} />
      </div>
    </div>
  </div>
)}


  {/* 👇 DESPUÉS empieza la galería normal */}
  {org.role === "hotel" && (
    <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-8">
                <div className="mb-6 flex flex-wrap gap-3">
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
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {sortedByDateMedia.length === 0 ? (
                  <div className="text-center py-16 px-8">
                    <div className="text-6xl mb-4 opacity-30">📷</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedCategory === "all"
                        ? "Bienvenido a tu galería"
                        : `No hay contenido en "${selectedCategory.replace("_", " ")}"`}
                    </h3>
                    <p className="text-gray-600 text-base mb-8 max-w-lg mx-auto">
                      {selectedCategory === "all"
                        ? "Sube tus primeras fotos y videos para empezar a compartir tu contenido."
                        : "No hay contenido en esta categoría. Cambia el filtro o sube nuevo contenido."}
                    </p>

                    {selectedCategory === "all" && (
                      <button
                        onClick={() => router.push("/hotel-media")}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition shadow-md"
                      >
                        Subir mi primer contenido
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {sortedByDateMedia.map((item, index) => (
                        <div
                          key={item.id || index}
                          className="relative rounded-2xl overflow-hidden bg-white shadow-md cursor-pointer"
                          onClick={() => setSelectedImage(item)}
                        >
                          {item.type === "video" ? (
                            <div className="w-full h-64 bg-gray-900 flex items-center justify-center text-white text-3xl">
                              ▶
                            </div>
                          ) : (
                            <img
                              src={item.url}
                              alt={`Media ${index}`}
                              loading="lazy"
                              className="w-full h-64 object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/400x300?text=Imagen+no+disponible";
                              }}
                            />
                          )}

                          <div 
                            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white/95 to-white/80 p-4"
                            style={{
                              transition: 'all 1200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                              height: hoveredCard === item.id ? '160px' : '56px',
                              overflow: 'hidden',
                            }}
                            onMouseEnter={() => setHoveredCard(item.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                          >
                            <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                              {item.ai_title?.trim() ? item.ai_title : item.category?.replace("_", " ") || "Imagen del hotel"}
                            </h3>

                            {hoveredCard === item.id && (
                              <div 
                                className="mt-3 text-xs text-gray-700 space-y-1.5"
                                style={{
                                  transition: 'opacity 800ms ease-out, transform 800ms ease-out',
                                  transform: hoveredCard === item.id ? 'translateY(0)' : 'translateY(10px)',
                                  opacity: hoveredCard === item.id ? 1 : 0,
                                }}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-blue-600">🏷️</span>
                                  <span>{item.category?.replace("_", " ") || "N/A"}</span>
                                </div>

                                {item.tags && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {normalizeDashboardTags(item.tags).slice(0, 3).map((tag, i) => (
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
                      ))}
                    </div>

                    <div className="text-center mt-8">
                      <button
                        onClick={() => router.push("/hotel-media")}
                        className="px-6 py-2.5 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-100 transition"
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
                    <div className="text-6xl mb-4 opacity-30">🏨</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Sin acceso a hoteles
                    </h3>
                    <p className="text-gray-600 text-base mb-8 max-w-lg mx-auto">
                      Solicita acceso a hoteles para comenzar a explorar su contenido multimedia.
                    </p>

                    <button
                      onClick={() => router.push("/agency-requests")}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition shadow-md"
                    >
                      Solicitar acceso ahora
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {approvedHotels.map((hotel) => (
                      <div
                        key={hotel.id}
                        onClick={() => toggleHotelGallery(hotel.id)}
                        className={`bg-white rounded-xl border transition-all cursor-pointer ${
                          expandedHotelId === hotel.id
                            ? "border-blue-400 shadow-md"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-bold text-gray-900">
                              {hotel.name}
                            </h4>
                            <span className="text-sm font-bold">
                              {expandedHotelId === hotel.id ? "−" : "+"}
                            </span>
                          </div>

                          {expandedHotelId === hotel.id && media.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="grid grid-cols-3 gap-2 mb-4">
                                {media.slice(0, 6).map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="aspect-square rounded overflow-hidden border"
                                  >
                                    {item.type === "video" ? (
                                      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                                        ▶
                                      </div>
                                    ) : (
                                      <img
                                        src={item.url}
                                        alt={`Preview ${idx}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.src = "https://via.placeholder.com/150?text=No+disponible";
                                        }}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/hotel-gallery/${hotel.id}`);
                                }}
                                className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition"
                              >
                                Ver galería completa
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ✅ PANEL DE DESCARGA OPTIMIZADO - IMAGEN CENTRADA CON LA TABLA */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Encabezado que abarca TODO el ancho */}
            <div className="p-6 md:p-8 border-b border-gray-200">
              <div className="flex justify-between items-start">
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
            </div>
            
            {/* Contenido dividido en dos columnas */}
            <div className="flex flex-col md:flex-row overflow-hidden">
              {/* Contenedor de imagen - CENTRADO CON LA TABLA */}
              <div className="md:w-1/2 flex items-center justify-center bg-white-50 p-6 md:p-8">
                <div className="w-full max-w-[90%] max-h-[75vh] flex items-center justify-center">
                  <img 
                    src={selectedImage.url} 
                    alt={selectedImage.ai_title || "Imagen del hotel"}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
                    loading="lazy"
                  />
                </div>
              </div>
              
              {/* Panel de descargas - SIN SCROLL Y 100% EN ESPAÑOL */}
              <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto">
                {renderDownloadTable(selectedImage.versions)}
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

/* =========================
   BURBUJAS – MOVIMIENTO ORGÁNICO
   ========================= */

@keyframes bubbleFloatSlow {
  0%   { transform: translate(-50%, -50%) translate(0px, 0px); }
  25%  { transform: translate(-50%, -50%) translate(6px, -10px); }
  50%  { transform: translate(-50%, -50%) translate(-4px, -18px); }
  75%  { transform: translate(-50%, -50%) translate(5px, -10px); }
  100% { transform: translate(-50%, -50%) translate(0px, 0px); }
}

@keyframes bubbleFloatMedium {
  0%   { transform: translate(-50%, -50%) translate(0px, 0px); }
  25%  { transform: translate(-50%, -50%) translate(-8px, -14px); }
  50%  { transform: translate(-50%, -50%) translate(6px, -24px); }
  75%  { transform: translate(-50%, -50%) translate(-6px, -14px); }
  100% { transform: translate(-50%, -50%) translate(0px, 0px); }
}

@keyframes bubbleFloatLarge {
  0%   { transform: translate(-50%, -50%) translate(0px, 0px); }
  25%  { transform: translate(-50%, -50%) translate(10px, -18px); }
  50%  { transform: translate(-50%, -50%) translate(-8px, -30px); }
  75%  { transform: translate(-50%, -50%) translate(8px, -18px); }
  100% { transform: translate(-50%, -50%) translate(0px, 0px); }
}
`}</style>

    </div>
  );
}