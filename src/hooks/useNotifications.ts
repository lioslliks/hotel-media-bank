import { useState, useEffect, useCallback, useRef } from 'react';
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
  related_id?: string;
  date?: string;
}

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // ✅ useRef para evitar dependencias inestables en el efecto
  const notificationsRef = useRef<Notification[]>([]);
  notificationsRef.current = notifications;

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

      const notificationsClean = (data || []).map((n: any) => ({
        ...n,
        date: undefined
      }));

      setNotifications(notificationsClean);
      setUnreadCount(notificationsClean.filter((n: Notification) => !n.is_read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
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
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  useEffect(() => {
    // ✅ Cargar notificaciones al montar y cuando userId cambia
    loadNotifications();

    // ✅ Salir si no hay userId válido
    if (!userId) {
      return;
    }

    // ✅ Configurar canal de tiempo real SIN depender del estado notifications
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
            const newNotification = {
              ...(payload.new as any),
              date: undefined
            };
            setNotifications(prev => [newNotification as Notification, ...prev]);
            
            if (!(payload.new as any).is_read) {
              setUnreadCount(prev => prev + 1);
            }
          }
          else if (payload.eventType === 'UPDATE') {
            const newNotification = {
              ...(payload.new as any),
              date: undefined
            } as Notification;

            setNotifications(prev =>
              prev.map(n => (n.id === newNotification.id ? { ...n, ...newNotification } : n))
            );

            // ✅ USAR payload.old y payload.new DIRECTAMENTE (sin depender del estado)
            const oldIsRead = (payload.old as any).is_read;
            const newIsRead = (payload.new as any).is_read;
            
            if (oldIsRead !== newIsRead) {
              if (newIsRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
              } else {
                setUnreadCount(prev => prev + 1);
              }
            }
          }
          else if (payload.eventType === 'DELETE') {
            const deletedNotification = payload.old as Notification;
            setNotifications(prev => prev.filter(n => n.id !== deletedNotification.id));
            
            // ✅ USAR payload.old DIRECTAMENTE para verificar is_read
            if (!(payload.old as any).is_read) {
              setUnreadCount(prev => Math.max(0, prev - 1));
            }
          }
        }
      )
      .subscribe();

    // ✅ Limpieza del canal al desmontar o cambiar userId
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, loadNotifications]); // ✅ SOLO estas dos dependencias estables

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    reload: loadNotifications
  };
}