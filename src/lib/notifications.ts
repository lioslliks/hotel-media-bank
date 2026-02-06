// src/lib/notifications.ts
import { supabase } from './supabaseClient';

interface NotificationData {
  type: 'invitation_received' | 'invitation_accepted' | 'invitation_rejected' | 'photo_uploaded' | 'message_received' | 'connection_established' | 'profile_updated';
  userId: string;
  organizationId: string;
  title: string;
  message: string;
  relatedId?: string;  // ← AÑADIR este campo
  data?: any;
}

/**
 * Enviar una notificación a un usuario
 */
export async function sendNotification({
  type,
  userId,
  organizationId,
  title,
  message,
  relatedId,  // ← AÑADIR este parámetro
  data = {}
}: NotificationData) {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        organization_id: organizationId,
        type,
        title,
        message,
        related_id: relatedId,  // ← GUARDAR related_id en la base de datos
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

/**
 * Enviar notificación de invitación recibida
 */
export async function sendInvitationReceivedNotification(
  recipientUserId: string,
  recipientOrgId: string,
  senderOrgName: string,
  invitationId?: string  // ← AÑADIR este parámetro opcional
) {
  await sendNotification({
    type: 'invitation_received',
    userId: recipientUserId,
    organizationId: recipientOrgId,
    title: 'Nueva invitación',
    message: `${senderOrgName} te ha enviado una invitación para conectarse.`,
    relatedId: invitationId,  // ← PASAR invitationId como related_id
    data: { senderOrgName }
  });
}

/**
 * Enviar notificación de invitación aceptada
 */
export async function sendInvitationAcceptedNotification(
  senderUserId: string,
  senderOrgId: string,
  recipientOrgName: string
) {
  await sendNotification({
    type: 'invitation_accepted',
    userId: senderUserId,
    organizationId: senderOrgId,
    title: 'Invitación aceptada',
    message: `${recipientOrgName} ha aceptado tu invitación.`,
    data: { recipientOrgName }
  });
}

/**
 * Enviar notificación de invitación rechazada
 */
export async function sendInvitationRejectedNotification(
  senderUserId: string,
  senderOrgId: string,
  recipientOrgName: string
) {
  await sendNotification({
    type: 'invitation_rejected',
    userId: senderUserId,
    organizationId: senderOrgId,
    title: 'Invitación rechazada',
    message: `${recipientOrgName} ha rechazado tu invitación.`,
    data: { recipientOrgName }
  });
}

/**
 * Enviar notificación de foto subida
 */
export async function sendPhotoUploadedNotification(
  recipientUserId: string,
  recipientOrgId: string,
  senderOrgName: string,
  photoTitle: string
) {
  await sendNotification({
    type: 'photo_uploaded',
    userId: recipientUserId,
    organizationId: recipientOrgId,
    title: 'Nueva foto disponible',
    message: `${senderOrgName} ha subido una nueva foto: "${photoTitle}"`,
    data: { senderOrgName, photoTitle }
  });
}

/**
 * Enviar notificación de conexión establecida
 */
export async function sendConnectionEstablishedNotification(
  userId: string,
  orgId: string,
  connectedOrgName: string
) {
  await sendNotification({
    type: 'connection_established',
    userId: userId,
    organizationId: orgId,
    title: 'Nueva conexión',
    message: `Ahora estás conectado con ${connectedOrgName}.`,
    data: { connectedOrgName }
  });
}

/**
 * Enviar notificación de perfil actualizado
 */
export async function sendProfileUpdatedNotification(
  userId: string,
  orgId: string,
  fieldName: string
) {
  await sendNotification({
    type: 'profile_updated',
    userId: userId,
    organizationId: orgId,
    title: 'Perfil actualizado',
    message: `Tu ${fieldName} ha sido actualizado correctamente.`,
    data: { fieldName }
  });
}

/**
 * Eliminar notificación por ID
 */
export async function deleteNotification(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
    console.log('Notification deleted successfully');
    
    return { success: true, error: null };  // ← DEVOLVER resultado
  } catch (error) {
    console.error('Failed to delete notification:', error);
    return { success: false, error: (error as Error).message };  // ← DEVOLVER resultado
  }
}

/**
 * Marcar notificación como leída
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
    console.log('Notification marked as read');
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
}