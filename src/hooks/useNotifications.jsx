// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../Context/SocketContext';
import { getNotifications, markNotificationAsRead, getUnreadNotificationCount } from '../Services/AuthServices';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { socket, onEvent, offEvent } = useSocket();

  // Fetch initial notifications and unread count
  const fetchNotifications = useCallback(async (page = 1, limit = 10) => {
    try {
      setIsLoading(true);
      const response = await getNotifications(page, limit);
      if (response.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch unread count only
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadNotificationCount();
      if (response.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? {...n, isRead: true} : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Handle real-time notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data) => {
      console.log('New notification received:', data);
      
      // Add new notification to the list
      setNotifications(prev => [data.notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Optional: Show toast notification here
      // toast.info(data.notification.message);
    };

    const handleNotificationUpdate = (data) => {
      console.log('Notification update:', data);
      setUnreadCount(data.unreadCount);
    };

    const handleUserUnfollowed = (data) => {
      console.log('User unfollowed you:', data);
      
      // Remove the follow notification from the list if it exists
      setNotifications(prev => 
        prev.filter(n => !(
          n.type === 'follow' && 
          n.sender && 
          n.sender._id === data.unfollowedBy._id
        ))
      );
      
      // Update unread count
      setUnreadCount(data.unreadCount);
      
      // Optional: Show toast notification
      // toast.info(data.message);
    };

    // Listen for real-time events
    onEvent('newNotification', handleNewNotification);
    onEvent('notificationUpdated', handleNotificationUpdate);
    onEvent('userUnfollowed', handleUserUnfollowed);

    // Cleanup
    return () => {
      offEvent('newNotification', handleNewNotification);
      offEvent('notificationUpdated', handleNotificationUpdate);
      offEvent('userUnfollowed', handleUserUnfollowed);
    };
  }, [socket, onEvent, offEvent]);

  // Initial fetch
  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for updates every 30 seconds as backup
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    refetch: fetchNotifications
  };
};