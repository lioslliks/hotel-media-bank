// src/app/hotel-requests/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  sendInvitationReceivedNotification,
  sendInvitationAcceptedNotification,
  sendInvitationRejectedNotification,
  deleteNotification as deleteNotificationRow,
} from "../../lib/notifications";
import { useNotifications } from "../../hooks/useNotifications";

/* =======================
   TYPES
======================= */

interface AccessRequest {
  id: string;
  agency_name: string;
  status: "pending" | "approved" | "rejected" | string;
}

interface Agency {
  id: string;
  name: string;
}

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

/* =======================
   UI: ICONS
======================= */

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
      "w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
    }
    aria-hidden="true"
  />
);

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
        aria-label="Abrir notificaciones"
        type="button"
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
                <Spinner className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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

/* =======================
   PAGE
======================= */

export default function HotelRequests() {
  const [pendingInvitations, setPendingInvitations] = useState<AccessRequest[]>([]);
  const [associations, setAssociations] = useState<AccessRequest[]>([]);
  const [allAgencies, setAllAgencies] = useState<Agency[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification: deleteNotificationFromHook,
  } = useNotifications(userId);

  // Cerrar dropdown de agencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Aceptada";
      case "rejected":
        return "Rechazada";
      case "pending":
        return "Pendiente";
      default:
        return status;
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    setError("");

    try {
      const sessionResponse = await supabase.auth.getSession();
      if (!sessionResponse.data.session) {
        window.location.href = "/login";
        return;
      }

      const currentUserId = sessionResponse.data.session.user.id;
      setUserId(currentUserId);

      const orgResponse = await supabase
        .from("organizations")
        .select("id, role, name")
        .eq("created_by", currentUserId)
        .maybeSingle();

      if (!orgResponse.data || orgResponse.data.role !== "hotel") {
        alert("Solo los hoteles pueden acceder a esta página");
        window.location.href = "/dashboard";
        return;
      }

      const hotelId = orgResponse.data.id;

      // Invitaciones recibidas (agencia -> hotel)
      const pendingResponse = await supabase
        .from("agency_hotel_access")
        .select("id, status, agency_id")
        .eq("hotel_id", hotelId)
        .eq("status", "pending")
        .eq("created_by_role", "agency");

      const pendingAgencyIds = pendingResponse.data?.map((inv) => inv.agency_id) || [];

      const pendingAgenciesResponse =
        pendingAgencyIds.length > 0
          ? await supabase.from("organizations").select("id, name").in("id", pendingAgencyIds)
          : { data: [] as { id: string; name: string }[] };

      const pendingNameMap: Record<string, string> = {};
      (pendingAgenciesResponse.data || []).forEach((a) => (pendingNameMap[a.id] = a.name));

      setPendingInvitations(
        (pendingResponse.data || []).map((inv) => ({
          id: inv.id,
          agency_name: pendingNameMap[inv.agency_id] || "Agencia desconocida",
          status: inv.status,
        }))
      );

      // Asociaciones aprobadas
      const associationsResponse = await supabase
        .from("agency_hotel_access")
        .select("id, status, agency_id")
        .eq("hotel_id", hotelId)
        .eq("status", "approved");

      const associationAgencyIds = associationsResponse.data?.map((inv) => inv.agency_id) || [];

      const associationAgenciesResponse =
        associationAgencyIds.length > 0
          ? await supabase
              .from("organizations")
              .select("id, name")
              .in("id", associationAgencyIds)
          : { data: [] as { id: string; name: string }[] };

      const assocNameMap: Record<string, string> = {};
      (associationAgenciesResponse.data || []).forEach((a) => (assocNameMap[a.id] = a.name));

      setAssociations(
        (associationsResponse.data || []).map((inv) => ({
          id: inv.id,
          agency_name: assocNameMap[inv.agency_id] || "Agencia desconocida",
          status: inv.status,
        }))
      );

      // Todas las agencias
      const allAgenciesResponse = await supabase
        .from("organizations")
        .select("id, name")
        .eq("role", "agency");

      setAllAgencies((allAgenciesResponse.data || []).map((a) => ({ id: a.id, name: a.name })));
    } catch (err) {
      console.error("Error loading:", err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrar agencias
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredAgencies([]);
      return;
    }
    setFilteredAgencies(allAgencies.filter((a) => a.name.toLowerCase().includes(term)));
  }, [searchTerm, allAgencies]);

  const handleSelectAgency = (agency: Agency) => {
    setSelectedAgency(agency);
    setSearchTerm(agency.name);
    setShowDropdown(false);
    setError("");
  };

  const handleSendInvitation = async () => {
    if (!selectedAgency) {
      setError("Por favor, selecciona una agencia");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const sessionResponse = await supabase.auth.getSession();
      const currentUserId = sessionResponse.data.session?.user.id;
      if (!currentUserId) throw new Error("Sesión no disponible");

      const orgResponse = await supabase
        .from("organizations")
        .select("id, name, role")
        .eq("created_by", currentUserId)
        .maybeSingle();

      if (!orgResponse.data || orgResponse.data.role !== "hotel") {
        throw new Error("Hotel no encontrado");
      }

      // Evitar duplicados (excepto si fue rechazada)
      const { data: existing, error: existingError } = await supabase
        .from("agency_hotel_access")
        .select("id, status")
        .eq("hotel_id", orgResponse.data.id)
        .eq("agency_id", selectedAgency.id)
        .neq("status", "rejected");

      if (existingError) throw existingError;

      if (existing && existing.length > 0) {
        setError("Ya has enviado una invitación a esta agencia");
        return;
      }

      // Insertar invitación (hotel -> agencia)
      const { error: insertError } = await supabase.from("agency_hotel_access").insert({
        agency_id: selectedAgency.id,
        hotel_id: orgResponse.data.id,
        status: "pending",
        created_by_role: "hotel",
      });

      if (insertError) throw insertError;

      // Notificar a la agencia
      const { data: agencyData, error: agencyError } = await supabase
        .from("organizations")
        .select("created_by")
        .eq("id", selectedAgency.id)
        .single();

      if (agencyError) throw agencyError;

      if (agencyData?.created_by) {
        await sendInvitationReceivedNotification(
          agencyData.created_by, // user_id de la agencia
          selectedAgency.id, // organization_id de la agencia
          orgResponse.data.name // nombre del hotel
        );
      }

      setSelectedAgency(null);
      setSearchTerm("");
      setShowDropdown(false);

      alert("Invitación enviada correctamente");
    } catch (err) {
      setError("Error al enviar invitación: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRespond = async (invitationId: string, status: "approved" | "rejected") => {
    try {
      const { data: invitationData, error: invitationError } = await supabase
        .from("agency_hotel_access")
        .select("agency_id, hotel_id")
        .eq("id", invitationId)
        .single();

      if (invitationError || !invitationData) {
        console.error("Error al obtener invitación:", invitationError);
        throw new Error("No se pudo obtener la información de la invitación");
      }

      // Notificación relacionada (invitation_received) para este hotel y esa agencia
      const sessionResponse = await supabase.auth.getSession();
      const currentUserId = sessionResponse.data.session?.user.id;

      const { data: notificationData, error: notificationError } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", currentUserId)
        .eq("type", "invitation_received")
        .eq("organization_id", invitationData.agency_id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (notificationError) throw notificationError;

      // Actualizar estado
      const { error: updateError } = await supabase
        .from("agency_hotel_access")
        .update({ status })
        .eq("id", invitationId);

      if (updateError) throw updateError;

      // Notificar a la agencia
      const { data: agencyData, error: agencyError } = await supabase
        .from("organizations")
        .select("created_by, name")
        .eq("id", invitationData.agency_id)
        .single();

      // Nombre del hotel
      const { data: hotelData, error: hotelError } = await supabase
        .from("organizations")
        .select("name")
        .eq("id", invitationData.hotel_id)
        .single();

      if (agencyError || hotelError) throw new Error("Error al obtener datos de organización");

      if (agencyData?.created_by && hotelData?.name) {
        if (status === "approved") {
          await sendInvitationAcceptedNotification(
            agencyData.created_by,
            invitationData.agency_id,
            hotelData.name
          );
        } else {
          await sendInvitationRejectedNotification(
            agencyData.created_by,
            invitationData.agency_id,
            hotelData.name
          );
        }
      }

      // Eliminar notificación del hotel
      if (notificationData && notificationData.length > 0) {
        await deleteNotificationRow(notificationData[0].id);
      }

      // Recargar toda la data (incluye invitaciones + asociaciones)
      await loadAllData();

      alert(
        status === "approved"
          ? "Invitación aceptada. La agencia ha sido notificada."
          : "Invitación rechazada. La agencia ha sido notificada."
      );
    } catch (err) {
      alert("Error al responder: " + (err as Error).message);
    }
  };

  const handleRemoveAssociation = async (associationId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta asociación?")) return;

    try {
      const { error } = await supabase.from("agency_hotel_access").delete().eq("id", associationId);
      if (error) throw error;

      setAssociations((prev) => prev.filter((a) => a.id !== associationId));
    } catch (err) {
      alert("Error al eliminar asociación: " + (err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="p-8 bg-white rounded-2xl shadow-sm text-center border border-gray-200">
          <div className="flex justify-center mb-3">
            <Spinner />
          </div>
          <p className="text-gray-600 text-base">Cargando...</p>
        </div>
      </div>
    );
  }

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

          {/* ✅ Galería eliminada: solo “Solicitudes” */}
          <div className="mt-3 border-t border-white/10 pt-4">
            <div className="w-full px-4 py-3 rounded-xl text-left font-medium text-sm bg-white/15 text-white">
              Solicitudes
            </div>
          </div>
        </nav>

        <div className="text-xs text-white/60 pt-4 border-t border-white/10">Panel de hotel</div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-72">
        {/* TOP BAR */}
        <div className="fixed top-0 left-72 right-0 h-16 bg-white/95 backdrop-blur border-b border-gray-200 flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 uppercase font-semibold tracking-wide">
              Solicitudes
            </span>
          </div>

          <div className="flex items-center gap-3">
            <NotificationsDropdown
              notifications={notifications as unknown as NotificationItem[]}
              unreadCount={unreadCount}
              loading={notificationsLoading}
              markAsRead={markAsRead}
              markAllAsRead={markAllAsRead}
              deleteNotification={deleteNotificationFromHook}
            />
          </div>
        </div>

        {/* Content */}
        <div className="pt-24 p-6">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Gestión de Solicitudes</h2>
              <p className="text-gray-600 text-sm">
                Administra tus invitaciones y asociaciones con agencias de viajes
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Enviar invitación */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900">Enviar invitación</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Busca una agencia y envíale una invitación para acceder a tu contenido.
                </p>
              </div>

              <div className="p-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSelectedAgency(null);
                      setShowDropdown(true);
                    }}
                    onFocus={() => {
                      if (searchTerm.trim() !== "") setShowDropdown(true);
                    }}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    placeholder="Busca una agencia de viajes..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-500"
                    disabled={submitting}
                  />

                  {showDropdown && filteredAgencies.length > 0 && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl mt-2 max-h-64 overflow-y-auto shadow-lg z-30"
                    >
                      {filteredAgencies.map((agency) => (
                        <div
                          key={agency.id}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelectAgency(agency)}
                          className="px-4 py-3 cursor-pointer hover:bg-blue-50 text-gray-800 text-sm transition"
                        >
                          {agency.name}
                        </div>
                      ))}
                    </div>
                  )}

                  {showDropdown && filteredAgencies.length === 0 && searchTerm.trim() !== "" && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl mt-2 shadow-lg z-30"
                    >
                      <div className="px-4 py-3 text-gray-500 text-sm">No se encontraron agencias</div>
                    </div>
                  )}
                </div>

                {selectedAgency && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-700">Agencia seleccionada</p>
                        <p className="text-sm font-bold text-blue-700 truncate">
                          {selectedAgency.name}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedAgency(null);
                          setSearchTerm("");
                        }}
                        className="text-red-600 hover:text-red-700 text-xs font-semibold"
                        type="button"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSendInvitation}
                  disabled={!selectedAgency || submitting}
                  className={`mt-4 w-full px-4 py-3 rounded-xl font-semibold text-sm transition ${
                    selectedAgency && !submitting
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                  type="button"
                >
                  {submitting ? "Enviando..." : "Enviar invitación"}
                </button>
              </div>
            </div>

            {/* Solicitudes recibidas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900">Solicitudes recibidas</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Invitaciones que te envían las agencias (pendientes).
                </p>
              </div>

              <div className="p-6">
                {pendingInvitations.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-2 opacity-30">—</div>
                    <p className="text-gray-500 text-sm">No tienes solicitudes pendientes</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingInvitations.map((inv) => (
                      <div
                        key={inv.id}
                        className="border border-gray-200 rounded-xl p-4 bg-white hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm truncate">
                              {inv.agency_name}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              Estado: {getStatusText(inv.status)}
                            </p>
                          </div>

                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => handleRespond(inv.id, "approved")}
                              className="px-3 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-xs hover:bg-emerald-700 transition"
                              type="button"
                            >
                              Aceptar
                            </button>
                            <button
                              onClick={() => handleRespond(inv.id, "rejected")}
                              className="px-3 py-2 bg-red-600 text-white rounded-lg font-semibold text-xs hover:bg-red-700 transition"
                              type="button"
                            >
                              Rechazar
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900">Asociaciones activas</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Agencias que ya tienen acceso aprobado.
                </p>
              </div>

              <div className="p-6">
                {associations.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-2 opacity-30">—</div>
                    <p className="text-gray-500 text-sm">No tienes asociaciones activas</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {associations.map((assoc) => (
                      <div
                        key={assoc.id}
                        className="border border-gray-200 rounded-xl p-4 bg-white"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm truncate">
                              {assoc.agency_name}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              Estado: {getStatusText(assoc.status)}
                            </p>
                          </div>

                          <button
                            onClick={() => handleRemoveAssociation(assoc.id)}
                            className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg font-semibold text-xs hover:bg-gray-200 transition"
                            type="button"
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
