// src/app/hotel-media/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNotifications } from "../../hooks/useNotifications";
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

export default function HotelMediaPage() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [media, setMedia] = useState<{ url: string; type: string; id: string }[]>([]);
  const [approvedHotels, setApprovedHotels] = useState<{ id: string; name: string }[]>([]);
  const [expandedHotelId, setExpandedHotelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("gallery");
  const [totalMedia, setTotalMedia] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [connectedAgencies, setConnectedAgencies] = useState(0);
  const [totalHotels, setTotalHotels] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<{ id: string; name?: string } | null>(null);

  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
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

        if (orgData.role === "hotel") {
          const { data: mediaData } = await supabase
            .from("media")
            .select("id, url, type")
            .eq("hotel_id", orgData.id)
            .order("created_at", { ascending: false });

          setMedia(mediaData || []);
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

      setMedia((prev) => prev.filter((p) => p.id !== photoToDelete.id));
      setTotalMedia((prev) => prev - 1);

      setShowDeleteModal(false);
      setPhotoToDelete(null);
    } catch (err) {
      console.error("Error al eliminar foto:", err);
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

      {/* SIDEBAR LIMPIO */}
      <aside className="w-72 bg-gradient-to-b from-blue-800 to-blue-900 text-white p-6 fixed left-0 top-0 h-screen flex flex-col">

        {/* Título */}
        <div className="flex items-center mb-8 pb-3 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight">Hotel Media Bank</h1>
        </div>

        {/* Volver */}
        <nav className="flex-1 flex flex-col gap-2">
          <div
            onClick={() => (window.location.href = "/dashboard")}
            className="px-4 py-3.5 rounded-lg cursor-pointer font-medium text-sm transition-all text-white/80 hover:bg-white/10 flex items-center gap-2"
          >
            <span className="text-lg">←</span>
            <span>Volver al Dashboard</span>
          </div>
        </nav>

        {/* Logout */}
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
      {/* MAIN CONTENT */}
      <main className="flex-1 ml-72 bg-gray-50 p-8 overflow-y-auto">

        {/* TOP BAR */}
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

        {/* CONTENT */}
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

          {/* GALERÍA DEL HOTEL */}
          {org.role === "hotel" && (
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8">
                <Gallery key={media.length} />
              </div>
            </div>
          )}

          {/* GALERÍAS PARA AGENCIAS */}
          {org.role === "agency" && (
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8">
                {/* Aquí va tu código de agencias */}
              </div>
            </div>
          )}
        </div>

        {/* MODAL DE ELIMINACIÓN */}
        <DeletePhotoModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setPhotoToDelete(null);
          }}
          onConfirm={handleDeletePhoto}
          photoName={photoToDelete?.name}
        />
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