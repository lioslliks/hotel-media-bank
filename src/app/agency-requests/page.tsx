// src/app/agency-requests/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { 
  sendInvitationReceivedNotification, 
  sendInvitationAcceptedNotification, 
  sendInvitationRejectedNotification,
  deleteNotification 
} from '../../lib/notifications';
import { useNotifications } from '../../hooks/useNotifications';

interface Hotel {
  id: string;
  name: string;
}

interface AccessRequest {
  id: string;
  hotel_name: string;
  status: string;
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

export default function AgencyRequests() {
  const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([]);
  const [associations, setAssociations] = useState<AccessRequest[]>([]);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hook de notificaciones
  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification: deleteNotificationFromHook
  } = useNotifications(userId);

  // Hook de notificaciones para recargar después de eliminar
  const { reload: reloadNotifications } = useNotifications(userId);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sessionResponse = await supabase.auth.getSession();
        if (!sessionResponse.data.session) {
          window.location.href = "/login";
          return;
        }

        const userId = sessionResponse.data.session.user.id;
        setUserId(userId);
        
        const orgResponse = await supabase
          .from("organizations")
          .select("id")
          .eq("created_by", userId)
          .eq("role", "agency")
          .maybeSingle();

        if (!orgResponse.data) {
          alert("Solo las agencias pueden acceder a esta página");
          window.location.href = "/dashboard";
          return;
        }

        // Cargar SOLO invitaciones recibidas (de hoteles hacia la agencia)
        const pendingResponse = await supabase
          .from("agency_hotel_access")
          .select("id, status, hotel_id")
          .eq("agency_id", orgResponse.data.id)
          .eq("status", "pending")
          .eq("created_by_role", "hotel"); // ← SOLO las que envían los hoteles

        if (pendingResponse.data) {
          const hotelIds = pendingResponse.data.map(r => r.hotel_id);
          const hotelNamesResponse = await supabase
            .from("organizations")
            .select("id, name")
            .in("id", hotelIds);

          const hotelNameMap: Record<string, string> = {};
          (hotelNamesResponse.data || []).forEach(hotel => {
            hotelNameMap[hotel.id] = hotel.name;
          });

          const formattedPending: AccessRequest[] = pendingResponse.data.map(r => ({
            id: r.id,
            hotel_name: hotelNameMap[r.hotel_id] || "Hotel desconocido",
            status: r.status
          }));

          setPendingRequests(formattedPending);
        }

        // Cargar asociaciones (aceptadas)
        const associationsResponse = await supabase
          .from("agency_hotel_access")
          .select("id, status, hotel_id")
          .eq("agency_id", orgResponse.data.id)
          .eq("status", "approved");

        if (associationsResponse.data) {
          const hotelIds = associationsResponse.data.map(r => r.hotel_id);
          const hotelNamesResponse = await supabase
            .from("organizations")
            .select("id, name")
            .in("id", hotelIds);

          const hotelNameMap: Record<string, string> = {};
          (hotelNamesResponse.data || []).forEach(hotel => {
            hotelNameMap[hotel.id] = hotel.name;
          });

          const formattedAssociations: AccessRequest[] = associationsResponse.data.map(r => ({
            id: r.id,
            hotel_name: hotelNameMap[r.hotel_id] || "Hotel desconocido",
            status: r.status
          }));

          setAssociations(formattedAssociations);
        }

        // Cargar todos los hoteles
        const allHotelsResponse = await supabase
          .from("organizations")
          .select("id, name")
          .eq("role", "hotel");

        setAllHotels(allHotelsResponse.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading ", err);
        setError("Error al cargar las invitaciones");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar hoteles mientras se escribe
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredHotels([]);
      return;
    }

    const filtered = allHotels.filter(hotel =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHotels(filtered);
  }, [searchTerm, allHotels]);

  const handleSendRequest = async () => {
    if (!selectedHotel) {
      setError("Por favor, selecciona un hotel");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const sessionResponse = await supabase.auth.getSession();
      const userId = sessionResponse.data.session?.user.id;
      const orgResponse = await supabase
        .from("organizations")
        .select("id, name")
        .eq("created_by", userId)
        .maybeSingle();

      if (!orgResponse.data) throw new Error("Agencia no encontrada");

      // ✅ Verificar si ya existe una solicitud activa
      const { data: existing } = await supabase
        .from("agency_hotel_access")
        .select("id, status")
        .eq("agency_id", orgResponse.data.id)
        .eq("hotel_id", selectedHotel.id)
        .not("status", "eq", "rejected");

      if (existing && existing.length > 0) {
        setError("Ya has enviado una solicitud a este hotel");
        setSubmitting(false);
        return;
      }

      // Crear la solicitud
      const { error } = await supabase
        .from("agency_hotel_access")
        .insert({
          agency_id: orgResponse.data.id,
          hotel_id: selectedHotel.id,
          status: "pending",
          created_by_role: "agency" // ← Marcar como enviada por agencia
        });

      if (error) throw error;

      // ✅ ENVIAR NOTIFICACIÓN AL HOTEL
      // Obtener el user_id del hotel
      const { data: hotelData } = await supabase
        .from("organizations")
        .select("created_by")
        .eq("id", selectedHotel.id)
        .single();

      if (hotelData) {
        await sendInvitationReceivedNotification(
          hotelData.created_by,  // user_id del hotel
          selectedHotel.id,      // organization_id del hotel
          orgResponse.data.name  // nombre de la agencia
        );
      }

      // Limpiar formulario
      setSelectedHotel(null);
      setSearchTerm("");
      setError("");
      
      // ✅ Mostrar mensaje de éxito
      alert("✅ Solicitud enviada correctamente");
    } catch (err) {
      setError("Error al enviar solicitud: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRespond = async (requestId: string, status: "approved" | "rejected") => {
    try {
      // Obtener información de la solicitud para saber qué hotel la envió
      const { data: requestData, error: requestDataError } = await supabase
        .from("agency_hotel_access")
        .select("hotel_id, agency_id")
        .eq("id", requestId)
        .single();

      if (requestDataError) {
        console.error("Error al obtener solicitud:", requestDataError);
        throw new Error("No se pudo obtener la información de la solicitud");
      }

      if (!requestData) {
        throw new Error("Solicitud no encontrada");
      }

      // ✅ Obtener la notificación relacionada ANTES de actualizar el estado
      const sessionResponse = await supabase.auth.getSession();
      const currentUserId = sessionResponse.data.session?.user.id;

      // Buscar la notificación de invitación recibida para este hotel
      const { data: notificationData } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", currentUserId)
        .eq("type", "invitation_received")
        .eq("organization_id", requestData.hotel_id)
        .order("created_at", { ascending: false })
        .limit(1);

      // Actualizar el estado de la solicitud
      const { error } = await supabase
        .from("agency_hotel_access")
        .update({ status })
        .eq("id", requestId);

      if (error) throw error;

      // ✅ ENVIAR NOTIFICACIÓN AL HOTEL (que envió la invitación)
      const orgResponse = await supabase
        .from("organizations")
        .select("id, name")
        .eq("created_by", currentUserId)
        .maybeSingle();

      if (orgResponse.data) {
        // Obtener el user_id del hotel
        const { data: hotelData } = await supabase
          .from("organizations")
          .select("created_by, name")
          .eq("id", requestData.hotel_id)
          .single();

        if (hotelData) {
          if (status === "approved") {
            await sendInvitationAcceptedNotification(
              hotelData.created_by,  // user_id del hotel
              requestData.hotel_id,  // organization_id del hotel
              orgResponse.data.name  // nombre de la agencia
            );
          } else if (status === "rejected") {
            await sendInvitationRejectedNotification(
              hotelData.created_by,  // user_id del hotel
              requestData.hotel_id,  // organization_id del hotel
              orgResponse.data.name  // nombre de la agencia
            );
          }
        }
      }

      // ✅ ELIMINAR LA NOTIFICACIÓN después de aceptar/rechazar
      if (notificationData && notificationData.length > 0) {
        await deleteNotification(notificationData[0].id);
        
        // ✅ FORZAR RECARGA DE NOTIFICACIONES
        if (reloadNotifications) {
          await reloadNotifications();
        }
      }

      // Recargar datos...
      const { data: sessionData } = await supabase.auth.getSession();
      const userIdReload = sessionData.session?.user.id;

      const orgResponseReload = await supabase
        .from("organizations")
        .select("id")
        .eq("created_by", userIdReload)
        .maybeSingle();

      if (!orgResponseReload.data) return;

      // Recargar invitaciones pendientes (SOLO las de hoteles)
      const { data: pending } = await supabase
        .from("agency_hotel_access")
        .select("id, status, hotel_id")
        .eq("agency_id", orgResponseReload.data.id)
        .eq("status", "pending")
        .eq("created_by_role", "hotel");

      if (pending) {
        const hotelIds = pending.map(r => r.hotel_id);
        const hotelNamesResponse = await supabase
          .from("organizations")
          .select("id, name")
          .in("id", hotelIds);

        const hotelNameMap: Record<string, string> = {};
        (hotelNamesResponse.data || []).forEach(hotel => {
          hotelNameMap[hotel.id] = hotel.name;
        });

        const formattedPending: AccessRequest[] = pending.map(r => ({
          id: r.id,
          hotel_name: hotelNameMap[r.hotel_id] || "Hotel desconocido",
          status: r.status
        }));

        setPendingRequests(formattedPending);
      }

      // Si se aprueba, actualizar asociaciones
      if (status === "approved") {
        const { data: associations } = await supabase
          .from("agency_hotel_access")
          .select("id, status, hotel_id")
          .eq("agency_id", orgResponseReload.data.id)
          .eq("status", "approved");

        if (associations) {
          const hotelIds = associations.map(r => r.hotel_id);
          const hotelNamesResponse = await supabase
            .from("organizations")
            .select("id, name")
            .in("id", hotelIds);

          const hotelNameMap: Record<string, string> = {};
          (hotelNamesResponse.data || []).forEach(hotel => {
            hotelNameMap[hotel.id] = hotel.name;
          });

          const formattedAssociations: AccessRequest[] = associations.map(r => ({
            id: r.id,
            hotel_name: hotelNameMap[r.hotel_id] || "Hotel desconocido",
            status: r.status
          }));

          setAssociations(formattedAssociations);
        }
      }

      // ✅ Mostrar mensaje según la acción
      alert(status === "approved" 
        ? "✅ Invitación aceptada. El hotel ha sido notificado."
        : "❌ Invitación rechazada. El hotel ha sido notificado.");
    } catch (err) {
      alert("Error: " + (err as Error).message);
    }
  };

  const handleRemoveAssociation = async (associationId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta asociación?")) return;

    try {
      const { error } = await supabase
        .from("agency_hotel_access")
        .delete()
        .eq("id", associationId);

      if (error) throw error;

      setAssociations(prev => prev.filter(assoc => assoc.id !== associationId));
    } catch (err) {
      alert("Error al eliminar asociación: " + (err as Error).message);
    }
  };

  const handleSelectHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setSearchTerm(hotel.name);
    setShowDropdown(false);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '✅ Aprobado';
      case 'rejected': return '❌ Rechazado';
      case 'pending': return '⏳ Pendiente';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-sm text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-base">Cargando...</p>
        </div>
      </div>
    );
  }

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
              Solicitudes
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
              deleteNotification={deleteNotificationFromHook}
            />
          </div>
        </div>

        {/* Content with top padding */}
        <div className="pt-24 max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Gestión de Solicitudes
            </h2>
            <p className="text-gray-600 text-sm">
              Administra tus solicitudes y asociaciones con hoteles
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Solicitar acceso a hotel */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Solicitar Acceso a Hotel
              </h3>
            

              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedHotel(null);
                    setShowDropdown(true);
                  }}
                  onFocus={() => {
                    if (searchTerm.trim() !== "") {
                      setShowDropdown(true);
                    }
                  }}
                  onBlur={(e) => {
                    setTimeout(() => {
                      setShowDropdown(false);
                    }, 200);
                  }}
                  placeholder="Busca un hotel..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900"
                  disabled={submitting}
                />

                {showDropdown && filteredHotels.length > 0 && (
                  <div 
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-2 max-h-60 overflow-y-auto shadow-lg z-50"
                  >
                    {filteredHotels.map(hotel => (
                      <div
                        key={hotel.id}
                        onClick={() => handleSelectHotel(hotel)}
                        className="px-4 py-2.5 cursor-pointer hover:bg-blue-50 text-gray-800 text-sm transition-colors"
                      >
                        {hotel.name}
                      </div>
                    ))}
                  </div>
                )}

                {showDropdown && filteredHotels.length === 0 && searchTerm.trim() !== "" && (
                  <div 
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-2 max-h-60 overflow-y-auto shadow-lg z-50"
                  >
                    <div className="px-4 py-2.5 text-gray-500 text-sm">
                      No se encontraron hoteles
                    </div>
                  </div>
                )}
              </div>

              {selectedHotel && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">
                        Hotel seleccionado:
                      </p>
                      <p className="text-sm font-bold text-blue-600">
                        {selectedHotel.name}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedHotel(null);
                        setSearchTerm("");
                      }}
                      className="text-red-500 hover:text-red-600 text-xs font-medium"
                    >
                      ✕ Eliminar
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleSendRequest}
                disabled={!selectedHotel || submitting}
                className={`mt-4 w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  selectedHotel && !submitting
                    ? "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-sm"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {submitting ? "Enviando..." : "📤 Solicitar Acceso"}
              </button>
            </div>
          </div>

          {/* Invitaciones recibidas (SOLO las que me envían los hoteles) */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                📨 Invitaciones Recibidas
              </h3>
              

              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3 opacity-30">📭</div>
                  <p className="text-gray-500 text-sm">
                    No tienes invitaciones pendientes
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map(request => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-sm mb-1">
                            {request.hotel_name}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {getStatusText(request.status)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRespond(request.id, "approved")}
                            className="px-3 py-1.5 bg-green-500 text-white rounded-lg font-semibold text-xs hover:bg-green-600 transition-colors"
                          >
                            ✅ Aceptar
                          </button>
                          <button
                            onClick={() => handleRespond(request.id, "rejected")}
                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg font-semibold text-xs hover:bg-red-600 transition-colors"
                          >
                            ❌ Rechazar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Asociaciones activas */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Asociaciones Activas
              </h3>
              

              {associations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3 opacity-30">🔗</div>
                  <p className="text-gray-500 text-sm">
                    No tienes asociaciones activas
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {associations.map(assoc => (
                    <div
                      key={assoc.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-sm mb-1">
                            {assoc.hotel_name}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {getStatusText(assoc.status)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveAssociation(assoc.id)}
                          className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-300 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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