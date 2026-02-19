"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Gallery from "@/components/Gallery"; 

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

const DeletePhotoModal = ({
  isOpen,
  onClose,
  onConfirm,
  photoName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  photoName?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar eliminación</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {photoName
            ? `¿Estás seguro de que quieres eliminar "${photoName}"?`
            : "¿Estás seguro de que quieres eliminar esta foto?"}
          <br />
          <span className="text-red-600 font-semibold">Esta acción no se puede deshacer.</span>
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 shadow-sm hover:shadow-md"
          >
            Eliminar permanentemente
          </button>
        </div>
      </div>
    </div>
  );
};

interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  tags?: any;
  category?: string;
  quality_score?: number;
  ai_quality?: string;
  created_at: string;
  versions?: any;
  ai_title?: string;
}

export default function HotelMediaPage() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [approvedHotels, setApprovedHotels] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("gallery");
  const [totalMedia, setTotalMedia] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [connectedAgencies, setConnectedAgencies] = useState(0);
  const [totalHotels, setTotalHotels] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [hotelId, setHotelId] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<{ id: string; name?: string } | null>(null);
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter(n => !n.read).length;
  const notificationsLoading = false;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== id)
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
      <div>
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

  const refreshGallery = async () => {
    if (!org || org.role !== "hotel") return;
    
    const { data: mediaData } = await supabase
      .from("media")
      .select("id, url, type, versions, tags, quality_score, ai_quality, ai_title, category, created_at")
      .eq("hotel_id", org.id)
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

    setMedia(parsedMedia as MediaItem[]);
    setTotalMedia(mediaData?.length || 0);
  };

  useEffect(() => {
    const loadOrg = async () => {
      try {
        const { data, error: userError } = await supabase.auth.getUser();
        
        if (userError || !data?.user) {
          console.error('Error getting user:', userError);
          window.location.href = "/login";
          return;
        }

        const userId = data.user.id;
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

        if (orgData.role === "hotel") {
          setHotelId(orgData.id);
          
          const { data: mediaData } = await supabase
            .from("media")
            .select("id, url, type, versions, tags, quality_score, ai_quality, ai_title, category, created_at")
            .eq("hotel_id", orgData.id)
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

          setMedia(parsedMedia as MediaItem[]);
          setTotalMedia(mediaData?.length || 0);

          const { data: requestsData } = await supabase
            .from("agency_hotel_access")
            .select("id")
            .eq("hotel_id", orgData.id)
            .eq("status", "pending");

          setPendingRequests(requestsData?.length || 0);

          const { data: connectedData } = await supabase
            .from("agency_hotel_access")
            .select("id")
            .eq("hotel_id", orgData.id)
            .eq("status", "approved");

          setConnectedAgencies(connectedData?.length || 0);
        }

        if (orgData.role === "agency") {
          const { data: accessData } = await supabase
            .from("agency_hotel_access")
            .select("hotel_id, status")
            .eq("agency_id", orgData.id);

          if (accessData && Array.isArray(accessData)) {
            const approved = accessData.filter((a) => a.status === "approved");
            const pending = accessData.filter((a) => a.status === "pending");

            setTotalHotels(approved.length);
            setPendingRequests(pending.length);

            const hotelIds = approved.map((a) => a.hotel_id);

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

  useEffect(() => {
    if (!org || org.role !== "hotel") return;

    const channel = supabase
      .channel('media-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'media',
        filter: `hotel_id=eq.${org.id}`
      }, async () => {
        await refreshGallery();
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'media',
        filter: `hotel_id=eq.${org.id}`
      }, async () => {
        await refreshGallery();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [org]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleDeletePhoto = async () => {
    if (!photoToDelete) return;

    try {
      const photo = media.find((m) => m.id === photoToDelete.id);
      if (!photo) throw new Error("Foto no encontrada");

      const fileName = photo.url.split("/").pop();
      await supabase.storage.from("media").remove([fileName!]);
      await supabase.from("media").delete().eq("id", photoToDelete.id);

      setShowDeleteModal(false);
      setPhotoToDelete(null);
      await refreshGallery();
    } catch (err) {
      console.error("Error al eliminar foto:", err);
      alert("Error al eliminar la foto. Inténtalo de nuevo.");
    }
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

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <aside className="w-72 bg-gradient-to-b from-blue-800 to-blue-900 text-white p-6 fixed left-0 top-0 h-screen flex flex-col">
        <div className="flex items-center mb-8 pb-3 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight">Hotel Media Bank</h1>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <div
            onClick={() => (window.location.href = "/dashboard")}
            className="px-4 py-3.5 rounded-lg cursor-pointer font-medium text-sm transition-all text-white/80 hover:bg-white/10 flex items-center gap-2"
          >
            <span className="text-lg">←</span>
            <span>Volver al Dashboard</span>
          </div>
        </nav>

        <div className="mt-auto pt-5 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-0.5 text-blue-200/90 hover:text-white transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-72 bg-gray-50 p-8 overflow-y-auto">
        <div className="fixed top-0 left-72 right-0 h-16 bg-white shadow-sm flex items-center justify-between px-8 z-40">
          <span className="text-sm text-gray-500 uppercase font-semibold">
            {activeSection === "gallery" ? "Dashboard" : activeSection}
          </span>

          <NotificationsDropdown
            notifications={notifications}
            unreadCount={unreadCount}
            loading={notificationsLoading}
            markAsRead={markAsRead}
            markAllAsRead={markAllAsRead}
            deleteNotification={deleteNotification}
          />
        </div>

        <div className="pt-24">
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

          {org.role === "hotel" && (
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8">
                <Gallery 
                  media={media} 
                  hotelId={hotelId}
                  onMediaChange={refreshGallery}
                  onImageSelect={setSelectedImage}
                />
              </div>
            </div>
          )}

          {org.role === "agency" && (
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="text-center py-12 text-gray-500">
                  Funcionalidad de agencias en desarrollo
                </div>
              </div>
            </div>
          )}
        </div>

        <DeletePhotoModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setPhotoToDelete(null);
          }}
          onConfirm={handleDeletePhoto}
          photoName={photoToDelete?.name}
        />

        {/* ✅ PANEL DE DESCARGA OPTIMIZADO - IMAGEN PERFECTAMENTE CENTRADA CON LA TABLA */}
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
              
              {/* Contenido dividido en dos columnas - MISMO PADDING EN AMBAS */}
              <div className="flex flex-col md:flex-row overflow-hidden">
                {/* Contenedor de imagen - SIN max-h en el contenedor, SOLO en la imagen */}
                <div className="md:w-1/2 flex items-center justify-center bg-gray-50 p-6 md:p-8">
                  <div className="w-full max-w-[90%] flex items-center justify-center">
                    <img 
                      src={selectedImage.url} 
                      alt={selectedImage.ai_title || "Imagen del hotel"}
                      className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
                      loading="lazy"
                    />
                  </div>
                </div>
                
                {/* Panel de descargas - SIN mt-6, mismo padding que la imagen */}
                <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto">
                  {renderDownloadTable(selectedImage.versions)}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

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