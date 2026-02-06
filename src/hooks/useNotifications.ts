// src/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Notification {
  id: string;
  user_id: string;
  organization_id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  is_read: boolean;
  created_at: string;
  date: string; // ✅ AÑADIDO: Propiedad requerida por NotificationsDropdown
}

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // ✅ Mapear para añadir la propiedad `date` basada en `created_at`
      const notificationsWithDate = (data || []).map((n: any) => ({
        ...n,
        date: n.created_at // Convertir created_at → date
      }));

      setNotifications(notificationsWithDate);
      setUnreadCount(notificationsWithDate.filter((n: Notification) => !n.is_read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [userId]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      // Actualizar contador si la notificación eliminada estaba sin leer
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Realtime event:', payload.eventType, payload);

          if (payload.eventType === 'INSERT') {
            // Nueva notificación
            const newNotification = {
              ...(payload.new as any),
              date: (payload.new as any).created_at // ✅ Añadir date
            };
            setNotifications(prev => [newNotification as Notification, ...prev]);
            if (!(payload.new as any).is_read) {
              setUnreadCount(prev => prev + 1);
            }
          } else if (payload.eventType === 'UPDATE') {
            // Notificación actualizada (marcada como leída/no leída)
            const oldNotification = notifications.find(n => n.id === payload.old.id);
            const newNotification = {
              ...(payload.new as any),
              date: (payload.new as any).created_at // ✅ Añadir date
            } as Notification;

            setNotifications(prev =>
              prev.map(n => (n.id === newNotification.id ? { ...n, ...newNotification } : n))
            );

            // Actualizar contador si cambió el estado de lectura
            if (oldNotification && oldNotification.is_read !== newNotification.is_read) {
              if (newNotification.is_read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
              } else {
                setUnreadCount(prev => prev + 1);
              }
            }
          } else if (payload.eventType === 'DELETE') {
            // Notificación eliminada
            const deletedNotification = payload.old as Notification;
            setNotifications(prev => prev.filter(n => n.id !== deletedNotification.id));
            
            // Actualizar contador si la notificación eliminada estaba sin leer
            if (!deletedNotification.is_read) {
              setUnreadCount(prev => Math.max(0, prev - 1));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, loadNotifications, notifications]);

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