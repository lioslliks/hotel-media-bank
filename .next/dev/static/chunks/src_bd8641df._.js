(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/supabaseClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://konsrtuynhzqssakgdlw.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvbnNydHV5bmh6cXNzYWtnZGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjAyNjQsImV4cCI6MjA4NTEzNjI2NH0.jQryirwSpavWFeVMTBim19mQEccAArqBtwi_4-r4KsY");
// ✅ Añade esta verificación
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseAnonKey);
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/notifications.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteNotification",
    ()=>deleteNotification,
    "markNotificationAsRead",
    ()=>markNotificationAsRead,
    "sendConnectionEstablishedNotification",
    ()=>sendConnectionEstablishedNotification,
    "sendInvitationAcceptedNotification",
    ()=>sendInvitationAcceptedNotification,
    "sendInvitationReceivedNotification",
    ()=>sendInvitationReceivedNotification,
    "sendInvitationRejectedNotification",
    ()=>sendInvitationRejectedNotification,
    "sendNotification",
    ()=>sendNotification,
    "sendPhotoUploadedNotification",
    ()=>sendPhotoUploadedNotification,
    "sendProfileUpdatedNotification",
    ()=>sendProfileUpdatedNotification
]);
// src/lib/notifications.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabaseClient.ts [app-client] (ecmascript)");
;
async function sendNotification({ type, userId, organizationId, title, message, relatedId, data = {} }) {
    try {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('notifications').insert({
            user_id: userId,
            organization_id: organizationId,
            type,
            title,
            message,
            related_id: relatedId,
            data
        });
        if (error) {
            console.error('Error sending notification:', error);
            throw error;
        }
        console.log('Notification sent successfully');
    } catch (error) {
        console.error('Failed to send notification:', error);
        throw error;
    }
}
async function sendInvitationReceivedNotification(recipientUserId, recipientOrgId, senderOrgName, invitationId// ← AÑADIR este parámetro opcional
) {
    await sendNotification({
        type: 'invitation_received',
        userId: recipientUserId,
        organizationId: recipientOrgId,
        title: 'Nueva invitación',
        message: `${senderOrgName} te ha enviado una invitación para conectarse.`,
        relatedId: invitationId,
        data: {
            senderOrgName
        }
    });
}
async function sendInvitationAcceptedNotification(senderUserId, senderOrgId, recipientOrgName) {
    await sendNotification({
        type: 'invitation_accepted',
        userId: senderUserId,
        organizationId: senderOrgId,
        title: 'Invitación aceptada',
        message: `${recipientOrgName} ha aceptado tu invitación.`,
        data: {
            recipientOrgName
        }
    });
}
async function sendInvitationRejectedNotification(senderUserId, senderOrgId, recipientOrgName) {
    await sendNotification({
        type: 'invitation_rejected',
        userId: senderUserId,
        organizationId: senderOrgId,
        title: 'Invitación rechazada',
        message: `${recipientOrgName} ha rechazado tu invitación.`,
        data: {
            recipientOrgName
        }
    });
}
async function sendPhotoUploadedNotification(recipientUserId, recipientOrgId, senderOrgName, photoTitle) {
    await sendNotification({
        type: 'photo_uploaded',
        userId: recipientUserId,
        organizationId: recipientOrgId,
        title: 'Nueva foto disponible',
        message: `${senderOrgName} ha subido una nueva foto: "${photoTitle}"`,
        data: {
            senderOrgName,
            photoTitle
        }
    });
}
async function sendConnectionEstablishedNotification(userId, orgId, connectedOrgName) {
    await sendNotification({
        type: 'connection_established',
        userId: userId,
        organizationId: orgId,
        title: 'Nueva conexión',
        message: `Ahora estás conectado con ${connectedOrgName}.`,
        data: {
            connectedOrgName
        }
    });
}
async function sendProfileUpdatedNotification(userId, orgId, fieldName) {
    await sendNotification({
        type: 'profile_updated',
        userId: userId,
        organizationId: orgId,
        title: 'Perfil actualizado',
        message: `Tu ${fieldName} ha sido actualizado correctamente.`,
        data: {
            fieldName
        }
    });
}
async function deleteNotification(notificationId) {
    try {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('notifications').delete().eq('id', notificationId);
        if (error) throw error;
        console.log('Notification deleted successfully');
        return {
            success: true,
            error: null
        }; // ← DEVOLVER resultado
    } catch (error) {
        console.error('Failed to delete notification:', error);
        return {
            success: false,
            error: error.message
        }; // ← DEVOLVER resultado
    }
}
async function markNotificationAsRead(notificationId) {
    try {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('notifications').update({
            is_read: true
        }).eq('id', notificationId);
        if (error) throw error;
        console.log('Notification marked as read');
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
        throw error;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useNotifications.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useNotifications",
    ()=>useNotifications
]);
// src/hooks/useNotifications.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabaseClient.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useNotifications(userId) {
    _s();
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [unreadCount, setUnreadCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const loadNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useNotifications.useCallback[loadNotifications]": async ()=>{
            if (!userId) {
                setNotifications([]);
                setUnreadCount(0);
                setLoading(false);
                return;
            }
            try {
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('notifications').select('*').eq('user_id', userId).order('created_at', {
                    ascending: false
                }).limit(20);
                if (error) throw error;
                // ✅ Mapear para añadir la propiedad `date` basada en `created_at`
                const notificationsWithDate = (data || []).map({
                    "useNotifications.useCallback[loadNotifications].notificationsWithDate": (n)=>({
                            ...n,
                            date: n.created_at // Convertir created_at → date
                        })
                }["useNotifications.useCallback[loadNotifications].notificationsWithDate"]);
                setNotifications(notificationsWithDate);
                setUnreadCount(notificationsWithDate.filter({
                    "useNotifications.useCallback[loadNotifications]": (n)=>!n.is_read
                }["useNotifications.useCallback[loadNotifications]"]).length);
            } catch (error) {
                console.error('Error loading notifications:', error);
            } finally{
                setLoading(false);
            }
        }
    }["useNotifications.useCallback[loadNotifications]"], [
        userId
    ]);
    const markAsRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useNotifications.useCallback[markAsRead]": async (notificationId)=>{
            try {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('notifications').update({
                    is_read: true
                }).eq('id', notificationId);
                if (error) throw error;
                setNotifications({
                    "useNotifications.useCallback[markAsRead]": (prev)=>prev.map({
                            "useNotifications.useCallback[markAsRead]": (n)=>n.id === notificationId ? {
                                    ...n,
                                    is_read: true
                                } : n
                        }["useNotifications.useCallback[markAsRead]"])
                }["useNotifications.useCallback[markAsRead]"]);
                setUnreadCount({
                    "useNotifications.useCallback[markAsRead]": (prev)=>Math.max(0, prev - 1)
                }["useNotifications.useCallback[markAsRead]"]);
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        }
    }["useNotifications.useCallback[markAsRead]"], []);
    const markAllAsRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useNotifications.useCallback[markAllAsRead]": async ()=>{
            if (!userId) return;
            try {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('notifications').update({
                    is_read: true
                }).eq('user_id', userId).eq('is_read', false);
                if (error) throw error;
                setNotifications({
                    "useNotifications.useCallback[markAllAsRead]": (prev)=>prev.map({
                            "useNotifications.useCallback[markAllAsRead]": (n)=>({
                                    ...n,
                                    is_read: true
                                })
                        }["useNotifications.useCallback[markAllAsRead]"])
                }["useNotifications.useCallback[markAllAsRead]"]);
                setUnreadCount(0);
            } catch (error) {
                console.error('Error marking all notifications as read:', error);
            }
        }
    }["useNotifications.useCallback[markAllAsRead]"], [
        userId
    ]);
    const deleteNotification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useNotifications.useCallback[deleteNotification]": async (notificationId)=>{
            try {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('notifications').delete().eq('id', notificationId);
                if (error) throw error;
                setNotifications({
                    "useNotifications.useCallback[deleteNotification]": (prev)=>prev.filter({
                            "useNotifications.useCallback[deleteNotification]": (n)=>n.id !== notificationId
                        }["useNotifications.useCallback[deleteNotification]"])
                }["useNotifications.useCallback[deleteNotification]"]);
                // Actualizar contador si la notificación eliminada estaba sin leer
                setUnreadCount({
                    "useNotifications.useCallback[deleteNotification]": (prev)=>Math.max(0, prev - 1)
                }["useNotifications.useCallback[deleteNotification]"]);
            } catch (error) {
                console.error('Error deleting notification:', error);
            }
        }
    }["useNotifications.useCallback[deleteNotification]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useNotifications.useEffect": ()=>{
            loadNotifications();
            if (!userId) return;
            const channel = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].channel(`notifications:${userId}`).on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}`
            }, {
                "useNotifications.useEffect.channel": (payload)=>{
                    console.log('Realtime event:', payload.eventType, payload);
                    if (payload.eventType === 'INSERT') {
                        // Nueva notificación
                        const newNotification = {
                            ...payload.new,
                            date: payload.new.created_at // ✅ Añadir date
                        };
                        setNotifications({
                            "useNotifications.useEffect.channel": (prev)=>[
                                    newNotification,
                                    ...prev
                                ]
                        }["useNotifications.useEffect.channel"]);
                        if (!payload.new.is_read) {
                            setUnreadCount({
                                "useNotifications.useEffect.channel": (prev)=>prev + 1
                            }["useNotifications.useEffect.channel"]);
                        }
                    } else if (payload.eventType === 'UPDATE') {
                        // Notificación actualizada (marcada como leída/no leída)
                        const oldNotification = notifications.find({
                            "useNotifications.useEffect.channel.oldNotification": (n)=>n.id === payload.old.id
                        }["useNotifications.useEffect.channel.oldNotification"]);
                        const newNotification = {
                            ...payload.new,
                            date: payload.new.created_at // ✅ Añadir date
                        };
                        setNotifications({
                            "useNotifications.useEffect.channel": (prev)=>prev.map({
                                    "useNotifications.useEffect.channel": (n)=>n.id === newNotification.id ? {
                                            ...n,
                                            ...newNotification
                                        } : n
                                }["useNotifications.useEffect.channel"])
                        }["useNotifications.useEffect.channel"]);
                        // Actualizar contador si cambió el estado de lectura
                        if (oldNotification && oldNotification.is_read !== newNotification.is_read) {
                            if (newNotification.is_read) {
                                setUnreadCount({
                                    "useNotifications.useEffect.channel": (prev)=>Math.max(0, prev - 1)
                                }["useNotifications.useEffect.channel"]);
                            } else {
                                setUnreadCount({
                                    "useNotifications.useEffect.channel": (prev)=>prev + 1
                                }["useNotifications.useEffect.channel"]);
                            }
                        }
                    } else if (payload.eventType === 'DELETE') {
                        // Notificación eliminada
                        const deletedNotification = payload.old;
                        setNotifications({
                            "useNotifications.useEffect.channel": (prev)=>prev.filter({
                                    "useNotifications.useEffect.channel": (n)=>n.id !== deletedNotification.id
                                }["useNotifications.useEffect.channel"])
                        }["useNotifications.useEffect.channel"]);
                        // Actualizar contador si la notificación eliminada estaba sin leer
                        if (!deletedNotification.is_read) {
                            setUnreadCount({
                                "useNotifications.useEffect.channel": (prev)=>Math.max(0, prev - 1)
                            }["useNotifications.useEffect.channel"]);
                        }
                    }
                }
            }["useNotifications.useEffect.channel"]).subscribe();
            return ({
                "useNotifications.useEffect": ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].removeChannel(channel);
                }
            })["useNotifications.useEffect"];
        }
    }["useNotifications.useEffect"], [
        userId,
        loadNotifications,
        notifications
    ]);
    return {
        notifications,
        unreadCount,
        loading: loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        reload: loadNotifications
    };
}
_s(useNotifications, "oKsTM4DLYTzY3KYUc+tEb0vHatw=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/hotel-requests/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HotelRequests
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabaseClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/notifications.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useNotifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useNotifications.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
// src/app/hotel-requests/page.tsx
"use client";
;
;
;
;
;
const NotificationsDropdown = ({ notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification })=>{
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationsDropdown.useEffect": ()=>{
            const handleClickOutside = {
                "NotificationsDropdown.useEffect.handleClickOutside": (event)=>{
                    const target = event.target;
                    if (!target.closest('.notifications-dropdown')) {
                        setIsOpen(false);
                    }
                }
            }["NotificationsDropdown.useEffect.handleClickOutside"];
            document.addEventListener('mousedown', handleClickOutside);
            return ({
                "NotificationsDropdown.useEffect": ()=>document.removeEventListener('mousedown', handleClickOutside)
            })["NotificationsDropdown.useEffect"];
        }
    }["NotificationsDropdown.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "notifications-dropdown relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsOpen(!isOpen),
                className: "relative p-2 text-gray-600 hover:text-blue-600 transition-all hover:-translate-y-0.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-6 h-6",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "1.8",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            d: "M14.857 17.657A2 2 0 0113 19H11a2 2 0 01-1.857-1.343M6 8a6 6 0 1112 0c0 3.5 1.5 5 2 5.5H4c.5-.5 2-2 2-5.5z"
                        }, void 0, false, {
                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center shadow",
                        children: unreadCount
                    }, void 0, false, {
                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/hotel-requests/page.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-fade-in-down",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold text-gray-900",
                                children: "Notificaciones"
                            }, void 0, false, {
                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                lineNumber: 98,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: markAllAsRead,
                                className: "text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline",
                                children: "Marcar todo como leído"
                            }, void 0, false, {
                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                lineNumber: 101,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                        lineNumber: 97,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 text-center text-gray-500 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-6 h-6 mx-auto mb-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                lineNumber: 113,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            "Cargando notificaciones..."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                        lineNumber: 112,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    !loading && notifications.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 text-center text-gray-500 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-5xl mb-3 opacity-30",
                                children: "🔔"
                            }, void 0, false, {
                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                lineNumber: 121,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            "No hay notificaciones"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                        lineNumber: 120,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    !loading && notifications.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-h-96 overflow-y-auto divide-y divide-gray-100",
                        children: notifications.map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex items-start gap-3 px-4 py-4 transition-all cursor-pointer ${!n.read ? "bg-blue-50" : "hover:bg-gray-50"}`,
                                onClick: ()=>!n.read && markAsRead(n.id),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-1",
                                        children: !n.read && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                                            lineNumber: 140,
                                            columnNumber: 23
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                                        lineNumber: 138,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-semibold text-gray-900",
                                                children: n.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                lineNumber: 146,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-600 mt-1",
                                                children: n.message
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                lineNumber: 149,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[11px] text-gray-400 mt-1",
                                                children: n.date
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                lineNumber: 150,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                                        lineNumber: 145,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: (e)=>{
                                                e.stopPropagation();
                                                deleteNotification(n.id);
                                            },
                                            className: "text-gray-400 hover:text-red-600 hover:scale-110 transition-transform",
                                            title: "Eliminar",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-4 h-4",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    d: "M6 18L18 6M6 6l12 12"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                    lineNumber: 171,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                lineNumber: 164,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                                            lineNumber: 155,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                                        lineNumber: 154,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, n.id, true, {
                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                lineNumber: 130,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                        lineNumber: 128,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/hotel-requests/page.tsx",
                lineNumber: 95,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/hotel-requests/page.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(NotificationsDropdown, "vl0Rt3/A8evyRPW1OQ1AhRk4UhU=");
_c = NotificationsDropdown;
function HotelRequests() {
    _s1();
    // Estados existentes
    const [pendingInvitations, setPendingInvitations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [associations, setAssociations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [allAgencies, setAllAgencies] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filteredAgencies, setFilteredAgencies] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedAgency, setSelectedAgency] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showDropdown, setShowDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('invitations');
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Hook de notificaciones
    const { notifications, unreadCount, loading: notificationsLoading, markAsRead, markAllAsRead, deleteNotification: deleteNotificationFromHook } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useNotifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotifications"])(userId);
    // Cerrar dropdown al hacer clic fuera
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HotelRequests.useEffect": ()=>{
            const handleClickOutside = {
                "HotelRequests.useEffect.handleClickOutside": (event)=>{
                    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                        setShowDropdown(false);
                    }
                }
            }["HotelRequests.useEffect.handleClickOutside"];
            document.addEventListener("mousedown", handleClickOutside);
            return ({
                "HotelRequests.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
            })["HotelRequests.useEffect"];
        }
    }["HotelRequests.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HotelRequests.useEffect": ()=>{
            const loadData = {
                "HotelRequests.useEffect.loadData": async ()=>{
                    try {
                        const sessionResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                        if (!sessionResponse.data.session) {
                            window.location.href = "/login";
                            return;
                        }
                        const userId = sessionResponse.data.session.user.id;
                        setUserId(userId);
                        const orgResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, role, name").eq("created_by", userId).maybeSingle();
                        if (!orgResponse.data || orgResponse.data.role !== "hotel") {
                            alert("Solo los hoteles pueden acceder a esta página");
                            window.location.href = "/dashboard";
                            return;
                        }
                        const hotelId = orgResponse.data.id;
                        // Cargar SOLO invitaciones recibidas (de agencias hacia el hotel)
                        const pendingResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("agency_hotel_access").select("id, status, agency_id").eq("hotel_id", hotelId).eq("status", "pending").eq("created_by_role", "agency"); // ← SOLO las que envían las agencias
                        const pendingAgencyIds = pendingResponse.data?.map({
                            "HotelRequests.useEffect.loadData": (inv)=>inv.agency_id
                        }["HotelRequests.useEffect.loadData"]) || [];
                        const pendingAgenciesResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, name").in("id", pendingAgencyIds);
                        const pendingAgencyNameMap = {};
                        (pendingAgenciesResponse.data || []).forEach({
                            "HotelRequests.useEffect.loadData": (agency)=>{
                                pendingAgencyNameMap[agency.id] = agency.name;
                            }
                        }["HotelRequests.useEffect.loadData"]);
                        const formattedPending = (pendingResponse.data || []).map({
                            "HotelRequests.useEffect.loadData.formattedPending": (inv)=>({
                                    id: inv.id,
                                    agency_name: pendingAgencyNameMap[inv.agency_id] || "Agencia desconocida",
                                    status: inv.status
                                })
                        }["HotelRequests.useEffect.loadData.formattedPending"]);
                        setPendingInvitations(formattedPending);
                        // Cargar asociaciones (aceptadas)
                        const associationsResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("agency_hotel_access").select("id, status, agency_id").eq("hotel_id", hotelId).eq("status", "approved");
                        const associationAgencyIds = associationsResponse.data?.map({
                            "HotelRequests.useEffect.loadData": (inv)=>inv.agency_id
                        }["HotelRequests.useEffect.loadData"]) || [];
                        const associationAgenciesResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, name").in("id", associationAgencyIds);
                        const associationAgencyNameMap = {};
                        (associationAgenciesResponse.data || []).forEach({
                            "HotelRequests.useEffect.loadData": (agency)=>{
                                associationAgencyNameMap[agency.id] = agency.name;
                            }
                        }["HotelRequests.useEffect.loadData"]);
                        const formattedAssociations = (associationsResponse.data || []).map({
                            "HotelRequests.useEffect.loadData.formattedAssociations": (inv)=>({
                                    id: inv.id,
                                    agency_name: associationAgencyNameMap[inv.agency_id] || "Agencia desconocida",
                                    status: inv.status
                                })
                        }["HotelRequests.useEffect.loadData.formattedAssociations"]);
                        setAssociations(formattedAssociations);
                        // Cargar todas las agencias
                        const allAgenciesResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, name").eq("role", "agency");
                        setAllAgencies(allAgenciesResponse.data || []);
                        setLoading(false);
                    } catch (err) {
                        console.error("Error loading ", err);
                        setError("Error al cargar los datos");
                        setLoading(false);
                    }
                }
            }["HotelRequests.useEffect.loadData"];
            loadData();
        }
    }["HotelRequests.useEffect"], []);
    // Filtrar agencias mientras se escribe
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HotelRequests.useEffect": ()=>{
            if (searchTerm.trim() === "") {
                setFilteredAgencies([]);
                return;
            }
            const filtered = allAgencies.filter({
                "HotelRequests.useEffect.filtered": (agency)=>agency.name.toLowerCase().includes(searchTerm.toLowerCase())
            }["HotelRequests.useEffect.filtered"]);
            setFilteredAgencies(filtered);
        }
    }["HotelRequests.useEffect"], [
        searchTerm,
        allAgencies
    ]);
    const handleSendInvitation = async ()=>{
        if (!selectedAgency) {
            setError("Por favor, selecciona una agencia");
            return;
        }
        setSubmitting(true);
        setError("");
        try {
            const sessionResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            const userId = sessionResponse.data.session?.user.id;
            const orgResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, name").eq("created_by", userId).maybeSingle();
            if (!orgResponse.data) throw new Error("Hotel no encontrado");
            // ✅ Corrección 1: Destructuración correcta + usar .neq() en lugar de .not()
            const { data: existing, error: existingError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("agency_hotel_access").select("id, status").eq("hotel_id", orgResponse.data.id).eq("agency_id", selectedAgency.id).neq("status", "rejected"); // ✅ .neq() en lugar de .not()
            if (existingError) throw existingError;
            if (existing && existing.length > 0) {
                setError("Ya has enviado una invitación a esta agencia");
                setSubmitting(false);
                return;
            }
            // Crear la invitación
            const { error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("agency_hotel_access").insert({
                agency_id: selectedAgency.id,
                hotel_id: orgResponse.data.id,
                status: "pending",
                created_by_role: "hotel" // ← Marcar como enviada por hotel
            });
            if (insertError) throw insertError;
            // ✅ ENVIAR NOTIFICACIÓN A LA AGENCIA
            // Obtener el user_id de la agencia
            const { data: agencyData, error: agencyError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"] // ✅ Corrección 2: destructuración correcta
            .from("organizations").select("created_by").eq("id", selectedAgency.id).single();
            if (agencyError) throw agencyError;
            if (agencyData) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendInvitationReceivedNotification"])(agencyData.created_by, selectedAgency.id, orgResponse.data.name // nombre del hotel
                );
            }
            // Limpiar formulario
            setSelectedAgency(null);
            setSearchTerm("");
            setError("");
            // ✅ Mostrar mensaje de éxito
            alert("✅ Invitación enviada correctamente");
        } catch (err) {
            setError("Error al enviar invitación: " + err.message);
        } finally{
            setSubmitting(false);
        }
    };
    const handleRespond = async (invitationId, status)=>{
        try {
            // ✅ Obtener datos de la invitación
            const { data: invitationData, error: invitationError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("agency_hotel_access").select("agency_id, hotel_id").eq("id", invitationId).single();
            if (invitationError || !invitationData) {
                console.error("Error al obtener invitación:", invitationError);
                throw new Error("No se pudo obtener la información de la invitación");
            }
            // ✅ Obtener la notificación relacionada ANTES de actualizar el estado
            const sessionResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            const currentUserId = sessionResponse.data.session?.user.id;
            // Buscar la notificación de invitación recibida para esta agencia
            const { data: notificationData, error: notificationError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("notifications").select("id").eq("user_id", currentUserId).eq("type", "invitation_received").eq("organization_id", invitationData.agency_id).order("created_at", {
                ascending: false
            }).limit(1);
            if (notificationError) throw notificationError;
            // Actualizar el estado de la invitación
            const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("agency_hotel_access").update({
                status
            }).eq("id", invitationId);
            if (updateError) throw updateError;
            // ✅ ENVIAR NOTIFICACIÓN A LA AGENCIA
            // Obtener información de la agencia
            const { data: agencyData, error: agencyError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"] // ✅ Corrección 3: destructuración correcta
            .from("organizations").select("created_by, name").eq("id", invitationData.agency_id).single();
            // Obtener nombre del hotel
            const { data: hotelData, error: hotelError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"] // ✅ Corrección 4: destructuración correcta
            .from("organizations").select("name").eq("id", invitationData.hotel_id).single();
            if (agencyError || hotelError) throw new Error("Error al obtener datos de organización");
            if (agencyData && hotelData) {
                if (status === "approved") {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendInvitationAcceptedNotification"])(agencyData.created_by, invitationData.agency_id, hotelData.name // nombre del hotel
                    );
                } else if (status === "rejected") {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendInvitationRejectedNotification"])(agencyData.created_by, invitationData.agency_id, hotelData.name // nombre del hotel
                    );
                }
            }
            // ✅ ELIMINAR LA NOTIFICACIÓN después de aceptar/rechazar
            if (notificationData && notificationData.length > 0) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteNotification"])(notificationData[0].id);
                // ✅ FORZAR RECARGA DE NOTIFICACIONES
                const { data: sessionData } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                const userId = sessionData.session?.user.id;
                if (userId) {
                    // Recargar notificaciones
                    const { data: notificationsData } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("notifications").select("*").eq("user_id", userId).order("created_at", {
                        ascending: false
                    });
                }
            }
            // Recargar datos...
            const { data: sessionData } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            const userId = sessionData.session?.user.id;
            const orgResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id").eq("created_by", userId).maybeSingle();
            if (!orgResponse.data) return;
            const { data: pending } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("agency_hotel_access").select("id, status, agency_id").eq("hotel_id", orgResponse.data.id).eq("status", "pending").eq("created_by_role", "agency"); // ← SOLO las que envían las agencias
            const agencyIds = pending?.map((p)=>p.agency_id) || [];
            const { data: agencies } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, name").in("id", agencyIds);
            const nameMap = {};
            agencies?.forEach((a)=>nameMap[a.id] = a.name);
            const formatted = pending?.map((p)=>({
                    id: p.id,
                    agency_name: nameMap[p.agency_id] || "Agencia desconocida",
                    status: p.status
                })) || [];
            setPendingInvitations(formatted);
            // Si se aprueba, actualizar asociaciones
            if (status === "approved") {
                const { data: associations } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("agency_hotel_access").select("id, status, agency_id").eq("hotel_id", orgResponse.data.id).eq("status", "approved");
                const assocAgencyIds = associations?.map((a)=>a.agency_id) || [];
                const { data: assocAgencies } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, name").in("id", assocAgencyIds);
                const assocNameMap = {};
                assocAgencies?.forEach((a)=>assocNameMap[a.id] = a.name);
                const formattedAssoc = associations?.map((a)=>({
                        id: a.id,
                        agency_name: assocNameMap[a.agency_id] || "Agencia desconocida",
                        status: a.status
                    })) || [];
                setAssociations(formattedAssoc);
            }
            // ✅ Mostrar mensaje según la acción
            alert(status === "approved" ? "✅ Invitación aceptada. La agencia ha sido notificada." : "❌ Invitación rechazada. La agencia ha sido notificada.");
        } catch (err) {
            alert("Error al responder: " + err.message);
        }
    };
    const handleRemoveAssociation = async (associationId)=>{
        if (!confirm("¿Estás seguro de eliminar esta asociación?")) return;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("agency_hotel_access").delete().eq("id", associationId);
            if (error) throw error;
            setAssociations((prev)=>prev.filter((assoc)=>assoc.id !== associationId));
        } catch (err) {
            alert("Error al eliminar asociación: " + err.message);
        }
    };
    const handleSelectAgency = (agency)=>{
        setSelectedAgency(agency);
        setSearchTerm(agency.name);
        setShowDropdown(false);
    };
    const getStatusText = (status)=>{
        switch(status){
            case 'approved':
                return '✅ Aceptada';
            case 'rejected':
                return '❌ Rechazada';
            case 'pending':
                return '⏳ Pendiente';
            default:
                return status;
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex justify-center items-center bg-gray-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-8 bg-white rounded-xl shadow-sm text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-8 h-8 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                        lineNumber: 611,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 text-base",
                        children: "Cargando..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                        lineNumber: 612,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/hotel-requests/page.tsx",
                lineNumber: 610,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/hotel-requests/page.tsx",
            lineNumber: 609,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-bc8c81cc93ef4b4a" + " " + "min-h-screen bg-gray-50 font-sans",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "jsx-bc8c81cc93ef4b4a" + " " + "w-72 bg-gradient-to-b from-blue-800 to-blue-900 text-white p-6 fixed left-0 top-0 h-screen flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-bc8c81cc93ef4b4a" + " " + "flex items-center mb-8 pb-3 border-b border-white/10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "jsx-bc8c81cc93ef4b4a" + " " + "text-xl font-bold tracking-tight",
                            children: "Hotel Media Bank"
                        }, void 0, false, {
                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                            lineNumber: 624,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                        lineNumber: 623,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "jsx-bc8c81cc93ef4b4a" + " " + "flex-1 flex flex-col gap-2 mb-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            onClick: ()=>window.location.href = "/dashboard",
                            className: "jsx-bc8c81cc93ef4b4a" + " " + "px-4 py-3.5 rounded-lg cursor-pointer font-medium text-sm transition-all text-white/80 hover:bg-white/10",
                            children: "← Volver al Dashboard"
                        }, void 0, false, {
                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                            lineNumber: 629,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                        lineNumber: 628,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/hotel-requests/page.tsx",
                lineNumber: 621,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "jsx-bc8c81cc93ef4b4a" + " " + "ml-72 p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-bc8c81cc93ef4b4a" + " " + "fixed top-0 left-72 right-0 h-16 bg-white shadow-sm flex items-center justify-between px-6 z-40",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-bc8c81cc93ef4b4a" + " " + "flex items-center gap-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "text-sm text-gray-500 uppercase font-semibold",
                                    children: activeTab === 'invitations' ? 'Solicitudes' : 'Galería de Imágenes'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/hotel-requests/page.tsx",
                                    lineNumber: 643,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                lineNumber: 642,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-bc8c81cc93ef4b4a" + " " + "flex items-center gap-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NotificationsDropdown, {
                                    notifications: notifications,
                                    unreadCount: unreadCount,
                                    loading: notificationsLoading,
                                    markAsRead: markAsRead,
                                    markAllAsRead: markAllAsRead,
                                    deleteNotification: deleteNotificationFromHook
                                }, void 0, false, {
                                    fileName: "[project]/src/app/hotel-requests/page.tsx",
                                    lineNumber: 650,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                lineNumber: 648,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                        lineNumber: 641,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-bc8c81cc93ef4b4a" + " " + "pt-24",
                        children: activeTab === 'invitations' ? // === CONTENIDO ORIGINAL DE SOLICITUDES ===
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-bc8c81cc93ef4b4a" + " " + "max-w-3xl mx-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "text-2xl font-bold text-gray-900 mb-1",
                                            children: "Gestión de Solicitudes"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                                            lineNumber: 670,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "text-gray-600 text-sm",
                                            children: "Administra tus invitaciones y asociaciones con agencias de viajes"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                                            lineNumber: 673,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/hotel-requests/page.tsx",
                                    lineNumber: 669,
                                    columnNumber: 15
                                }, this),
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "mb-6 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "text-red-700 text-sm",
                                        children: error
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                                        lineNumber: 681,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/hotel-requests/page.tsx",
                                    lineNumber: 680,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "bg-white rounded-xl shadow-sm overflow-hidden mb-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "p-6 border-b border-gray-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "text-lg font-bold text-gray-900 mb-2",
                                                children: "Enviar Invitación"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                lineNumber: 688,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: searchTerm,
                                                        onChange: (e)=>{
                                                            setSearchTerm(e.target.value);
                                                            setSelectedAgency(null);
                                                            setShowDropdown(true);
                                                        },
                                                        onFocus: ()=>{
                                                            if (searchTerm.trim() !== "") {
                                                                setShowDropdown(true);
                                                            }
                                                        },
                                                        onBlur: (e)=>{
                                                            setTimeout(()=>{
                                                                setShowDropdown(false);
                                                            }, 200);
                                                        },
                                                        placeholder: "Busca una agencia de viajes...",
                                                        disabled: submitting,
                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                        lineNumber: 694,
                                                        columnNumber: 21
                                                    }, this),
                                                    showDropdown && filteredAgencies.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        ref: dropdownRef,
                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-2 max-h-60 overflow-y-auto shadow-lg z-50",
                                                        children: filteredAgencies.map((agency)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                onClick: ()=>handleSelectAgency(agency),
                                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "px-4 py-2.5 cursor-pointer hover:bg-blue-50 text-gray-800 text-sm transition-colors",
                                                                children: agency.name
                                                            }, agency.id, false, {
                                                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                                lineNumber: 723,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                        lineNumber: 718,
                                                        columnNumber: 23
                                                    }, this),
                                                    showDropdown && filteredAgencies.length === 0 && searchTerm.trim() !== "" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        ref: dropdownRef,
                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-2 max-h-60 overflow-y-auto shadow-lg z-50",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "px-4 py-2.5 text-gray-500 text-sm",
                                                            children: "No se encontraron agencias"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                            lineNumber: 739,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                        lineNumber: 735,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                lineNumber: 693,
                                                columnNumber: 19
                                            }, this),
                                            selectedAgency && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "mt-3 p-3 bg-blue-50 rounded-lg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bc8c81cc93ef4b4a",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "text-xs font-semibold text-gray-700 mb-1",
                                                                    children: "Agencia seleccionada:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                                    lineNumber: 750,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "text-sm font-bold text-blue-600",
                                                                    children: selectedAgency.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                                    lineNumber: 753,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                            lineNumber: 749,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                setSelectedAgency(null);
                                                                setSearchTerm("");
                                                            },
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "text-red-500 hover:text-red-600 text-xs font-medium",
                                                            children: "✕ Eliminar"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                            lineNumber: 757,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                    lineNumber: 748,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                lineNumber: 747,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleSendInvitation,
                                                disabled: !selectedAgency || submitting,
                                                className: "jsx-bc8c81cc93ef4b4a" + " " + `mt-4 w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${selectedAgency && !submitting ? "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-sm" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`,
                                                children: submitting ? "Enviando..." : "📤 Enviar Invitación"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                lineNumber: 770,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                                        lineNumber: 687,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/hotel-requests/page.tsx",
                                    lineNumber: 686,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "bg-white rounded-xl shadow-sm overflow-hidden mb-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "p-6 border-b border-gray-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "text-lg font-bold text-gray-900 mb-2",
                                                children: "📨 Solicitudes Recibidas"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                lineNumber: 787,
                                                columnNumber: 19
                                            }, this),
                                            pendingInvitations.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "text-center py-8",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "text-4xl mb-3 opacity-30",
                                                        children: "📭"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                        lineNumber: 794,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "text-gray-500 text-sm",
                                                        children: "No tienes solicitudes pendientes"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                        lineNumber: 795,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                lineNumber: 793,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "space-y-3",
                                                children: pendingInvitations.map((inv)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-all",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "font-bold text-gray-900 text-sm mb-1",
                                                                            children: inv.agency_name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                                            lineNumber: 808,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "text-xs text-gray-600",
                                                                            children: getStatusText(inv.status)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                                            lineNumber: 811,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                                    lineNumber: 807,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleRespond(inv.id, "approved"),
                                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "px-3 py-1.5 bg-green-500 text-white rounded-lg font-semibold text-xs hover:bg-green-600 transition-colors",
                                                                            children: "✅ Aceptar"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                                            lineNumber: 816,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleRespond(inv.id, "rejected"),
                                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "px-3 py-1.5 bg-red-500 text-white rounded-lg font-semibold text-xs hover:bg-red-600 transition-colors",
                                                                            children: "❌ Rechazar"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                                            lineNumber: 822,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                                    lineNumber: 815,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                            lineNumber: 806,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, inv.id, false, {
                                                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                        lineNumber: 802,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                lineNumber: 800,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                                        lineNumber: 786,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/hotel-requests/page.tsx",
                                    lineNumber: 785,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "bg-white rounded-xl shadow-sm overflow-hidden",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "text-lg font-bold text-gray-900 mb-2",
                                                children: "Asociaciones Activas"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                lineNumber: 840,
                                                columnNumber: 19
                                            }, this),
                                            associations.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "text-center py-8",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "text-4xl mb-3 opacity-30",
                                                        children: "🔗"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                        lineNumber: 847,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "text-gray-500 text-sm",
                                                        children: "No tienes asociaciones activas"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                        lineNumber: 848,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                lineNumber: 846,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "space-y-3",
                                                children: associations.map((assoc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "border border-gray-200 rounded-lg p-4 bg-gray-50",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "font-bold text-gray-900 text-sm mb-1",
                                                                            children: assoc.agency_name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                                            lineNumber: 861,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "text-xs text-gray-600",
                                                                            children: getStatusText(assoc.status)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                                            lineNumber: 864,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                                    lineNumber: 860,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleRemoveAssociation(assoc.id),
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-300 transition-colors",
                                                                    children: "Eliminar"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                                    lineNumber: 868,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                            lineNumber: 859,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, assoc.id, false, {
                                                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                        lineNumber: 855,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/hotel-requests/page.tsx",
                                                lineNumber: 853,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                                        lineNumber: 839,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/hotel-requests/page.tsx",
                                    lineNumber: 838,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                            lineNumber: 667,
                            columnNumber: 13
                        }, this) : // === GALERÍA DE IMÁGENES ===
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-bc8c81cc93ef4b4a"
                        }, void 0, false, {
                            fileName: "[project]/src/app/hotel-requests/page.tsx",
                            lineNumber: 884,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/hotel-requests/page.tsx",
                        lineNumber: 662,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/hotel-requests/page.tsx",
                lineNumber: 639,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "bc8c81cc93ef4b4a",
                children: "@keyframes fade-in-down{0%{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in-down{animation:.2s ease-out fade-in-down}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/hotel-requests/page.tsx",
        lineNumber: 619,
        columnNumber: 5
    }, this);
}
_s1(HotelRequests, "4ijOIvZJv/8GqZSKHo+yvHumyPY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useNotifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotifications"]
    ];
});
_c1 = HotelRequests;
var _c, _c1;
__turbopack_context__.k.register(_c, "NotificationsDropdown");
__turbopack_context__.k.register(_c1, "HotelRequests");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_bd8641df._.js.map