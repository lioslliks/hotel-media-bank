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
"[project]/src/app/agency-requests/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AgencyRequests
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabaseClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/notifications.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useNotifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useNotifications.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
// src/app/agency-requests/page.tsx
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
                            fileName: "[project]/src/app/agency-requests/page.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/app/agency-requests/page.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center shadow",
                        children: unreadCount
                    }, void 0, false, {
                        fileName: "[project]/src/app/agency-requests/page.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/agency-requests/page.tsx",
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
                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                lineNumber: 98,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: markAllAsRead,
                                className: "text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline",
                                children: "Marcar todo como leído"
                            }, void 0, false, {
                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                lineNumber: 101,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/agency-requests/page.tsx",
                        lineNumber: 97,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 text-center text-gray-500 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-6 h-6 mx-auto mb-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                lineNumber: 113,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            "Cargando notificaciones..."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/agency-requests/page.tsx",
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
                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                lineNumber: 121,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            "No hay notificaciones"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/agency-requests/page.tsx",
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
                                            fileName: "[project]/src/app/agency-requests/page.tsx",
                                            lineNumber: 140,
                                            columnNumber: 23
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/agency-requests/page.tsx",
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
                                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                                lineNumber: 146,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-600 mt-1",
                                                children: n.message
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                                lineNumber: 149,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[11px] text-gray-400 mt-1",
                                                children: n.date
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                                lineNumber: 150,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/agency-requests/page.tsx",
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
                                                    fileName: "[project]/src/app/agency-requests/page.tsx",
                                                    lineNumber: 171,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                                lineNumber: 164,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/agency-requests/page.tsx",
                                            lineNumber: 155,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/agency-requests/page.tsx",
                                        lineNumber: 154,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, n.id, true, {
                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                lineNumber: 130,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/app/agency-requests/page.tsx",
                        lineNumber: 128,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/agency-requests/page.tsx",
                lineNumber: 95,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/agency-requests/page.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(NotificationsDropdown, "vl0Rt3/A8evyRPW1OQ1AhRk4UhU=");
_c = NotificationsDropdown;
function AgencyRequests() {
    _s1();
    const [pendingRequests, setPendingRequests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [associations, setAssociations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [allHotels, setAllHotels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filteredHotels, setFilteredHotels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedHotel, setSelectedHotel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showDropdown, setShowDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Hook de notificaciones
    const { notifications, unreadCount, loading: notificationsLoading, markAsRead, markAllAsRead, deleteNotification: deleteNotificationFromHook } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useNotifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotifications"])(userId);
    // Hook de notificaciones para recargar después de eliminar
    const { reload: reloadNotifications } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useNotifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotifications"])(userId);
    // Cerrar dropdown al hacer clic fuera
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgencyRequests.useEffect": ()=>{
            const handleClickOutside = {
                "AgencyRequests.useEffect.handleClickOutside": (event)=>{
                    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                        setShowDropdown(false);
                    }
                }
            }["AgencyRequests.useEffect.handleClickOutside"];
            document.addEventListener("mousedown", handleClickOutside);
            return ({
                "AgencyRequests.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
            })["AgencyRequests.useEffect"];
        }
    }["AgencyRequests.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgencyRequests.useEffect": ()=>{
            const loadData = {
                "AgencyRequests.useEffect.loadData": async ()=>{
                    try {
                        const sessionResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                        if (!sessionResponse.data.session) {
                            window.location.href = "/login";
                            return;
                        }
                        const userId = sessionResponse.data.session.user.id;
                        setUserId(userId);
                        const orgResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id").eq("created_by", userId).eq("role", "agency").maybeSingle();
                        if (!orgResponse.data) {
                            alert("Solo las agencias pueden acceder a esta página");
                            window.location.href = "/dashboard";
                            return;
                        }
                        // Cargar SOLO invitaciones recibidas (de hoteles hacia la agencia)
                        const pendingResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("agency_hotel_access").select("id, status, hotel_id").eq("agency_id", orgResponse.data.id).eq("status", "pending").eq("created_by_role", "hotel"); // ← SOLO las que envían los hoteles
                        if (pendingResponse.data) {
                            const hotelIds = pendingResponse.data.map({
                                "AgencyRequests.useEffect.loadData.hotelIds": (r)=>r.hotel_id
                            }["AgencyRequests.useEffect.loadData.hotelIds"]);
                            const hotelNamesResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, name").in("id", hotelIds);
                            const hotelNameMap = {};
                            (hotelNamesResponse.data || []).forEach({
                                "AgencyRequests.useEffect.loadData": (hotel)=>{
                                    hotelNameMap[hotel.id] = hotel.name;
                                }
                            }["AgencyRequests.useEffect.loadData"]);
                            const formattedPending = pendingResponse.data.map({
                                "AgencyRequests.useEffect.loadData.formattedPending": (r)=>({
                                        id: r.id,
                                        hotel_name: hotelNameMap[r.hotel_id] || "Hotel desconocido",
                                        status: r.status
                                    })
                            }["AgencyRequests.useEffect.loadData.formattedPending"]);
                            setPendingRequests(formattedPending);
                        }
                        // Cargar asociaciones (aceptadas)
                        const associationsResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("agency_hotel_access").select("id, status, hotel_id").eq("agency_id", orgResponse.data.id).eq("status", "approved");
                        if (associationsResponse.data) {
                            const hotelIds = associationsResponse.data.map({
                                "AgencyRequests.useEffect.loadData.hotelIds": (r)=>r.hotel_id
                            }["AgencyRequests.useEffect.loadData.hotelIds"]);
                            const hotelNamesResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, name").in("id", hotelIds);
                            const hotelNameMap = {};
                            (hotelNamesResponse.data || []).forEach({
                                "AgencyRequests.useEffect.loadData": (hotel)=>{
                                    hotelNameMap[hotel.id] = hotel.name;
                                }
                            }["AgencyRequests.useEffect.loadData"]);
                            const formattedAssociations = associationsResponse.data.map({
                                "AgencyRequests.useEffect.loadData.formattedAssociations": (r)=>({
                                        id: r.id,
                                        hotel_name: hotelNameMap[r.hotel_id] || "Hotel desconocido",
                                        status: r.status
                                    })
                            }["AgencyRequests.useEffect.loadData.formattedAssociations"]);
                            setAssociations(formattedAssociations);
                        }
                        // Cargar todos los hoteles
                        const allHotelsResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, name").eq("role", "hotel");
                        setAllHotels(allHotelsResponse.data || []);
                        setLoading(false);
                    } catch (err) {
                        console.error("Error loading ", err);
                        setError("Error al cargar las invitaciones");
                        setLoading(false);
                    }
                }
            }["AgencyRequests.useEffect.loadData"];
            loadData();
        }
    }["AgencyRequests.useEffect"], []);
    // Filtrar hoteles mientras se escribe
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgencyRequests.useEffect": ()=>{
            if (searchTerm.trim() === "") {
                setFilteredHotels([]);
                return;
            }
            const filtered = allHotels.filter({
                "AgencyRequests.useEffect.filtered": (hotel)=>hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
            }["AgencyRequests.useEffect.filtered"]);
            setFilteredHotels(filtered);
        }
    }["AgencyRequests.useEffect"], [
        searchTerm,
        allHotels
    ]);
    const handleSendRequest = async ()=>{
        if (!selectedHotel) {
            setError("Por favor, selecciona un hotel");
            return;
        }
        setSubmitting(true);
        setError("");
        try {
            const sessionResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            const userId = sessionResponse.data.session?.user.id;
            const orgResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, name").eq("created_by", userId).maybeSingle();
            if (!orgResponse.data) throw new Error("Agencia no encontrada");
            // ✅ Verificar si ya existe una solicitud activa
            const { data: existing } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("agency_hotel_access").select("id, status").eq("agency_id", orgResponse.data.id).eq("hotel_id", selectedHotel.id).not("status", "eq", "rejected");
            if (existing && existing.length > 0) {
                setError("Ya has enviado una solicitud a este hotel");
                setSubmitting(false);
                return;
            }
            // Crear la solicitud
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("agency_hotel_access").insert({
                agency_id: orgResponse.data.id,
                hotel_id: selectedHotel.id,
                status: "pending",
                created_by_role: "agency" // ← Marcar como enviada por agencia
            });
            if (error) throw error;
            // ✅ ENVIAR NOTIFICACIÓN AL HOTEL
            // Obtener el user_id del hotel
            const { data: hotelData } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("created_by").eq("id", selectedHotel.id).single();
            if (hotelData) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendInvitationReceivedNotification"])(hotelData.created_by, selectedHotel.id, orgResponse.data.name // nombre de la agencia
                );
            }
            // Limpiar formulario
            setSelectedHotel(null);
            setSearchTerm("");
            setError("");
            // ✅ Mostrar mensaje de éxito
            alert("✅ Solicitud enviada correctamente");
        } catch (err) {
            setError("Error al enviar solicitud: " + err.message);
        } finally{
            setSubmitting(false);
        }
    };
    const handleRespond = async (requestId, status)=>{
        try {
            // Obtener información de la solicitud para saber qué hotel la envió
            const { data: requestData, error: requestDataError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("agency_hotel_access").select("hotel_id, agency_id").eq("id", requestId).single();
            if (requestDataError) {
                console.error("Error al obtener solicitud:", requestDataError);
                throw new Error("No se pudo obtener la información de la solicitud");
            }
            if (!requestData) {
                throw new Error("Solicitud no encontrada");
            }
            // ✅ Obtener la notificación relacionada ANTES de actualizar el estado
            const sessionResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            const currentUserId = sessionResponse.data.session?.user.id;
            // Buscar la notificación de invitación recibida para este hotel
            const { data: notificationData } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("notifications").select("id").eq("user_id", currentUserId).eq("type", "invitation_received").eq("organization_id", requestData.hotel_id).order("created_at", {
                ascending: false
            }).limit(1);
            // Actualizar el estado de la solicitud
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("agency_hotel_access").update({
                status
            }).eq("id", requestId);
            if (error) throw error;
            // ✅ ENVIAR NOTIFICACIÓN AL HOTEL (que envió la invitación)
            const orgResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, name").eq("created_by", currentUserId).maybeSingle();
            if (orgResponse.data) {
                // Obtener el user_id del hotel
                const { data: hotelData } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("created_by, name").eq("id", requestData.hotel_id).single();
                if (hotelData) {
                    if (status === "approved") {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendInvitationAcceptedNotification"])(hotelData.created_by, requestData.hotel_id, orgResponse.data.name // nombre de la agencia
                        );
                    } else if (status === "rejected") {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendInvitationRejectedNotification"])(hotelData.created_by, requestData.hotel_id, orgResponse.data.name // nombre de la agencia
                        );
                    }
                }
            }
            // ✅ ELIMINAR LA NOTIFICACIÓN después de aceptar/rechazar
            if (notificationData && notificationData.length > 0) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteNotification"])(notificationData[0].id);
                // ✅ FORZAR RECARGA DE NOTIFICACIONES
                if (reloadNotifications) {
                    await reloadNotifications();
                }
            }
            // Recargar datos...
            const { data: sessionData } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            const userIdReload = sessionData.session?.user.id;
            const orgResponseReload = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id").eq("created_by", userIdReload).maybeSingle();
            if (!orgResponseReload.data) return;
            // Recargar invitaciones pendientes (SOLO las de hoteles)
            const { data: pending } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("agency_hotel_access").select("id, status, hotel_id").eq("agency_id", orgResponseReload.data.id).eq("status", "pending").eq("created_by_role", "hotel");
            if (pending) {
                const hotelIds = pending.map((r)=>r.hotel_id);
                const hotelNamesResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, name").in("id", hotelIds);
                const hotelNameMap = {};
                (hotelNamesResponse.data || []).forEach((hotel)=>{
                    hotelNameMap[hotel.id] = hotel.name;
                });
                const formattedPending = pending.map((r)=>({
                        id: r.id,
                        hotel_name: hotelNameMap[r.hotel_id] || "Hotel desconocido",
                        status: r.status
                    }));
                setPendingRequests(formattedPending);
            }
            // Si se aprueba, actualizar asociaciones
            if (status === "approved") {
                const { data: associations } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("agency_hotel_access").select("id, status, hotel_id").eq("agency_id", orgResponseReload.data.id).eq("status", "approved");
                if (associations) {
                    const hotelIds = associations.map((r)=>r.hotel_id);
                    const hotelNamesResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, name").in("id", hotelIds);
                    const hotelNameMap = {};
                    (hotelNamesResponse.data || []).forEach((hotel)=>{
                        hotelNameMap[hotel.id] = hotel.name;
                    });
                    const formattedAssociations = associations.map((r)=>({
                            id: r.id,
                            hotel_name: hotelNameMap[r.hotel_id] || "Hotel desconocido",
                            status: r.status
                        }));
                    setAssociations(formattedAssociations);
                }
            }
            // ✅ Mostrar mensaje según la acción
            alert(status === "approved" ? "✅ Invitación aceptada. El hotel ha sido notificado." : "❌ Invitación rechazada. El hotel ha sido notificado.");
        } catch (err) {
            alert("Error: " + err.message);
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
    const handleSelectHotel = (hotel)=>{
        setSelectedHotel(hotel);
        setSearchTerm(hotel.name);
        setShowDropdown(false);
    };
    const getStatusText = (status)=>{
        switch(status){
            case 'approved':
                return '✅ Aprobado';
            case 'rejected':
                return '❌ Rechazado';
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
                        fileName: "[project]/src/app/agency-requests/page.tsx",
                        lineNumber: 614,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 text-base",
                        children: "Cargando..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/agency-requests/page.tsx",
                        lineNumber: 615,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/agency-requests/page.tsx",
                lineNumber: 613,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/agency-requests/page.tsx",
            lineNumber: 612,
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
                            fileName: "[project]/src/app/agency-requests/page.tsx",
                            lineNumber: 627,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/agency-requests/page.tsx",
                        lineNumber: 626,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "jsx-bc8c81cc93ef4b4a" + " " + "flex-1 flex flex-col gap-2 mb-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            onClick: ()=>window.location.href = "/dashboard",
                            className: "jsx-bc8c81cc93ef4b4a" + " " + "px-4 py-3.5 rounded-lg cursor-pointer font-medium text-sm transition-all text-white/80 hover:bg-white/10",
                            children: "← Volver al Dashboard"
                        }, void 0, false, {
                            fileName: "[project]/src/app/agency-requests/page.tsx",
                            lineNumber: 632,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/agency-requests/page.tsx",
                        lineNumber: 631,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/agency-requests/page.tsx",
                lineNumber: 624,
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
                                    children: "Solicitudes"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/agency-requests/page.tsx",
                                    lineNumber: 646,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                lineNumber: 645,
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
                                    fileName: "[project]/src/app/agency-requests/page.tsx",
                                    lineNumber: 653,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                lineNumber: 651,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/agency-requests/page.tsx",
                        lineNumber: 644,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-bc8c81cc93ef4b4a" + " " + "pt-24 max-w-3xl mx-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-bc8c81cc93ef4b4a" + " " + "mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "text-2xl font-bold text-gray-900 mb-1",
                                        children: "Gestión de Solicitudes"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/agency-requests/page.tsx",
                                        lineNumber: 668,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "text-gray-600 text-sm",
                                        children: "Administra tus solicitudes y asociaciones con hoteles"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/agency-requests/page.tsx",
                                        lineNumber: 671,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                lineNumber: 667,
                                columnNumber: 11
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-bc8c81cc93ef4b4a" + " " + "mb-6 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "text-red-700 text-sm",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/src/app/agency-requests/page.tsx",
                                    lineNumber: 679,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                lineNumber: 678,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-bc8c81cc93ef4b4a" + " " + "bg-white rounded-xl shadow-sm overflow-hidden mb-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "p-6 border-b border-gray-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "text-lg font-bold text-gray-900 mb-2",
                                            children: "Solicitar Acceso a Hotel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/agency-requests/page.tsx",
                                            lineNumber: 686,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: searchTerm,
                                                    onChange: (e)=>{
                                                        setSearchTerm(e.target.value);
                                                        setSelectedHotel(null);
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
                                                    placeholder: "Busca un hotel...",
                                                    disabled: submitting,
                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/agency-requests/page.tsx",
                                                    lineNumber: 692,
                                                    columnNumber: 17
                                                }, this),
                                                showDropdown && filteredHotels.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    ref: dropdownRef,
                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-2 max-h-60 overflow-y-auto shadow-lg z-50",
                                                    children: filteredHotels.map((hotel)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            onClick: ()=>handleSelectHotel(hotel),
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "px-4 py-2.5 cursor-pointer hover:bg-blue-50 text-gray-800 text-sm transition-colors",
                                                            children: hotel.name
                                                        }, hotel.id, false, {
                                                            fileName: "[project]/src/app/agency-requests/page.tsx",
                                                            lineNumber: 721,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/agency-requests/page.tsx",
                                                    lineNumber: 716,
                                                    columnNumber: 19
                                                }, this),
                                                showDropdown && filteredHotels.length === 0 && searchTerm.trim() !== "" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    ref: dropdownRef,
                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-2 max-h-60 overflow-y-auto shadow-lg z-50",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "px-4 py-2.5 text-gray-500 text-sm",
                                                        children: "No se encontraron hoteles"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/agency-requests/page.tsx",
                                                        lineNumber: 737,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/agency-requests/page.tsx",
                                                    lineNumber: 733,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/agency-requests/page.tsx",
                                            lineNumber: 691,
                                            columnNumber: 15
                                        }, this),
                                        selectedHotel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "mt-3 p-3 bg-blue-50 rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bc8c81cc93ef4b4a",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "text-xs font-semibold text-gray-700 mb-1",
                                                                children: "Hotel seleccionado:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                                                lineNumber: 748,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "text-sm font-bold text-blue-600",
                                                                children: selectedHotel.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                                                lineNumber: 751,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/agency-requests/page.tsx",
                                                        lineNumber: 747,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            setSelectedHotel(null);
                                                            setSearchTerm("");
                                                        },
                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "text-red-500 hover:text-red-600 text-xs font-medium",
                                                        children: "✕ Eliminar"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/agency-requests/page.tsx",
                                                        lineNumber: 755,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                                lineNumber: 746,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/agency-requests/page.tsx",
                                            lineNumber: 745,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleSendRequest,
                                            disabled: !selectedHotel || submitting,
                                            className: "jsx-bc8c81cc93ef4b4a" + " " + `mt-4 w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${selectedHotel && !submitting ? "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-sm" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`,
                                            children: submitting ? "Enviando..." : "📤 Solicitar Acceso"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/agency-requests/page.tsx",
                                            lineNumber: 768,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/agency-requests/page.tsx",
                                    lineNumber: 685,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                lineNumber: 684,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-bc8c81cc93ef4b4a" + " " + "bg-white rounded-xl shadow-sm overflow-hidden mb-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "p-6 border-b border-gray-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "text-lg font-bold text-gray-900 mb-2",
                                            children: "📨 Invitaciones Recibidas"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/agency-requests/page.tsx",
                                            lineNumber: 785,
                                            columnNumber: 15
                                        }, this),
                                        pendingRequests.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "text-center py-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "text-4xl mb-3 opacity-30",
                                                    children: "📭"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/agency-requests/page.tsx",
                                                    lineNumber: 792,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "text-gray-500 text-sm",
                                                    children: "No tienes invitaciones pendientes"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/agency-requests/page.tsx",
                                                    lineNumber: 793,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/agency-requests/page.tsx",
                                            lineNumber: 791,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "space-y-3",
                                            children: pendingRequests.map((request)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-all",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "font-bold text-gray-900 text-sm mb-1",
                                                                        children: request.hotel_name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/agency-requests/page.tsx",
                                                                        lineNumber: 806,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "text-xs text-gray-600",
                                                                        children: getStatusText(request.status)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/agency-requests/page.tsx",
                                                                        lineNumber: 809,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                                                lineNumber: 805,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "flex gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>handleRespond(request.id, "approved"),
                                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "px-3 py-1.5 bg-green-500 text-white rounded-lg font-semibold text-xs hover:bg-green-600 transition-colors",
                                                                        children: "✅ Aceptar"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/agency-requests/page.tsx",
                                                                        lineNumber: 814,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>handleRespond(request.id, "rejected"),
                                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "px-3 py-1.5 bg-red-500 text-white rounded-lg font-semibold text-xs hover:bg-red-600 transition-colors",
                                                                        children: "❌ Rechazar"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/agency-requests/page.tsx",
                                                                        lineNumber: 820,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                                                lineNumber: 813,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/agency-requests/page.tsx",
                                                        lineNumber: 804,
                                                        columnNumber: 23
                                                    }, this)
                                                }, request.id, false, {
                                                    fileName: "[project]/src/app/agency-requests/page.tsx",
                                                    lineNumber: 800,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/agency-requests/page.tsx",
                                            lineNumber: 798,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/agency-requests/page.tsx",
                                    lineNumber: 784,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                lineNumber: 783,
                                columnNumber: 11
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
                                            fileName: "[project]/src/app/agency-requests/page.tsx",
                                            lineNumber: 838,
                                            columnNumber: 15
                                        }, this),
                                        associations.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "text-center py-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "text-4xl mb-3 opacity-30",
                                                    children: "🔗"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/agency-requests/page.tsx",
                                                    lineNumber: 845,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "text-gray-500 text-sm",
                                                    children: "No tienes asociaciones activas"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/agency-requests/page.tsx",
                                                    lineNumber: 846,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/agency-requests/page.tsx",
                                            lineNumber: 844,
                                            columnNumber: 17
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
                                                                        children: assoc.hotel_name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/agency-requests/page.tsx",
                                                                        lineNumber: 859,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "text-xs text-gray-600",
                                                                        children: getStatusText(assoc.status)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/agency-requests/page.tsx",
                                                                        lineNumber: 862,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                                                lineNumber: 858,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleRemoveAssociation(assoc.id),
                                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-300 transition-colors",
                                                                children: "Eliminar"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                                                lineNumber: 866,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/agency-requests/page.tsx",
                                                        lineNumber: 857,
                                                        columnNumber: 23
                                                    }, this)
                                                }, assoc.id, false, {
                                                    fileName: "[project]/src/app/agency-requests/page.tsx",
                                                    lineNumber: 853,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/agency-requests/page.tsx",
                                            lineNumber: 851,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/agency-requests/page.tsx",
                                    lineNumber: 837,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/agency-requests/page.tsx",
                                lineNumber: 836,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/agency-requests/page.tsx",
                        lineNumber: 665,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/agency-requests/page.tsx",
                lineNumber: 642,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "bc8c81cc93ef4b4a",
                children: "@keyframes fade-in-down{0%{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in-down{animation:.2s ease-out fade-in-down}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/agency-requests/page.tsx",
        lineNumber: 622,
        columnNumber: 5
    }, this);
}
_s1(AgencyRequests, "opcuPiRPCGLuM13WP5ldL854NjE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useNotifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotifications"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useNotifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotifications"]
    ];
});
_c1 = AgencyRequests;
var _c, _c1;
__turbopack_context__.k.register(_c, "NotificationsDropdown");
__turbopack_context__.k.register(_c1, "AgencyRequests");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_aef6b9b6._.js.map