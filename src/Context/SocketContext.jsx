// Fixed SocketContext.jsx - Key improvements for real-time messaging

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null);

  // Memoized emit function to prevent unnecessary re-renders
  const emitEvent = useCallback((event, data) => {
    if (socket && isConnected) {
      console.log(`Emitting ${event}:`, data);
      socket.emit(event, data);
      return true;
    } else {
      console.warn(`Cannot emit ${event}: Socket not connected`);
      return false;
    }
  }, [socket, isConnected]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No token found, skipping socket connection');
      return;
    }

    let reconnectTimer;
    
    const initializeSocket = () => {
      console.log('Initializing socket connection...');
      
      // Initialize socket connection with better configuration
      const newSocket = io('http://localhost:3000', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
        timeout: 20000,
        forceNew: false, // Reuse existing connections
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        maxReconnectionAttempts: 5
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('Connected to server with ID:', newSocket.id);
        setIsConnected(true);
        setConnectionAttempts(0);
        
        // Join notification room
        newSocket.emit('joinNotificationRoom');
        
        // Get current user info and join user room
        try {
          const userString = localStorage.getItem('user');
          if (userString) {
            const user = JSON.parse(userString);
            newSocket.emit('join', { userId: user._id || user.id });
          }
        } catch (error) {
          console.error('Failed to join user room:', error);
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Disconnected from server. Reason:', reason);
        setIsConnected(false);
        
        // Attempt to reconnect if it's not a client-side disconnect
        if (reason !== 'io client disconnect') {
          setConnectionAttempts(prev => prev + 1);
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
        setConnectionAttempts(prev => prev + 1);
        
        // Implement exponential backoff for reconnection
        const delay = Math.min(1000 * Math.pow(2, connectionAttempts), 30000);
        reconnectTimer = setTimeout(() => {
          if (connectionAttempts < 5) {
            console.log(`Attempting to reconnect in ${delay}ms...`);
            newSocket.connect();
          }
        }, delay);
      });

      newSocket.on('reconnect', (attemptNumber) => {
        console.log('Reconnected after', attemptNumber, 'attempts');
        setIsConnected(true);
        setConnectionAttempts(0);
      });

      newSocket.on('reconnect_failed', () => {
        console.error('Failed to reconnect after maximum attempts');
        setIsConnected(false);
      });

      // Real-time notifications
      newSocket.on('newNotification', (data) => {
        console.log('New notification received:', data);
        // Dispatch custom event for notification handling
        window.dispatchEvent(new CustomEvent('newNotification', { detail: data }));
      });

      newSocket.on('userUnfollowed', (data) => {
        console.log('User unfollowed you:', data);
        window.dispatchEvent(new CustomEvent('userUnfollowed', { detail: data }));
      });

      // User status updates with improved handling
      newSocket.on('userStatusUpdate', (data) => {
        console.log('User status update:', data);
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          if (data.status === 'active' || data.status === 'online') {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      });

      // Bulk online users update
      newSocket.on('onlineUsers', (userIds) => {
        console.log('Online users update:', userIds);
        setOnlineUsers(new Set(userIds));
      });

      // Enhanced message handling
      newSocket.on('newMessage', (messageData) => {
        console.log('New message received:', messageData);
        
        // Prevent duplicate messages
        const messageTimestamp = new Date(messageData.createdAt).getTime();
        if (lastMessageTimestamp && messageTimestamp <= lastMessageTimestamp) {
          console.log('Duplicate message detected, ignoring');
          return;
        }
        setLastMessageTimestamp(messageTimestamp);
        
        // Dispatch custom event with message data
        window.dispatchEvent(new CustomEvent('newMessage', { detail: messageData }));
      });

      newSocket.on('messageNotification', (data) => {
        console.log('New message notification:', data);
        window.dispatchEvent(new CustomEvent('newMessageNotification', { detail: data }));
      });

      newSocket.on('messagesDelivered', (data) => {
        console.log('Messages delivered:', data);
        window.dispatchEvent(new CustomEvent('messagesDelivered', { detail: data }));
      });

      newSocket.on('messagesRead', (data) => {
        console.log('Messages read:', data);
        window.dispatchEvent(new CustomEvent('messagesRead', { detail: data }));
      });

      // Typing indicators with automatic cleanup
      newSocket.on('userTyping', (data) => {
        console.log('User typing:', data);
        window.dispatchEvent(new CustomEvent('userTyping', { detail: data }));
      });

      newSocket.on('userStoppedTyping', (data) => {
        console.log('User stopped typing:', data);
        window.dispatchEvent(new CustomEvent('userStoppedTyping', { detail: data }));
      });

      // Message sent acknowledgment
      newSocket.on('messageSent', (data) => {
        console.log('Message sent acknowledgment:', data);
        window.dispatchEvent(new CustomEvent('messageSent', { detail: data }));
      });

      // Message failed to send
      newSocket.on('messageFailed', (data) => {
        console.error('Message failed to send:', data);
        window.dispatchEvent(new CustomEvent('messageFailed', { detail: data }));
      });

      // Conversation events
      newSocket.on('conversationCreated', (data) => {
        console.log('Conversation created:', data);
        window.dispatchEvent(new CustomEvent('conversationCreated', { detail: data }));
      });

      newSocket.on('conversationUpdated', (data) => {
        console.log('Conversation updated:', data);
        window.dispatchEvent(new CustomEvent('conversationUpdated', { detail: data }));
      });


      // Heartbeat to maintain connection
      const heartbeatInterval = setInterval(() => {
        if (newSocket.connected) {
          newSocket.emit('heartbeat');
        }
      }, 30000); // Every 30 seconds

      setSocket(newSocket);

      // Cleanup function
      return () => {
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
        }
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
        }
        
        // Remove all event listeners
        newSocket.off('connect');
        newSocket.off('disconnect');
        newSocket.off('connect_error');
        newSocket.off('reconnect');
        newSocket.off('reconnect_failed');
        newSocket.off('newNotification');
        newSocket.off('userUnfollowed');
        newSocket.off('userStatusUpdate');
        newSocket.off('onlineUsers');
        newSocket.off('newMessage');
        newSocket.off('messageNotification');
        newSocket.off('messagesDelivered');
        newSocket.off('messagesRead');
        newSocket.off('userTyping');
        newSocket.off('userStoppedTyping');
        newSocket.off('messageSent');
        newSocket.off('messageFailed');
        newSocket.off('conversationCreated');
        newSocket.off('conversationUpdated');
        
        newSocket.close();
      };
    };

    const cleanup = initializeSocket();

    return cleanup;
  }, []); // Empty dependency array - only run once

  // Function to manually reconnect
  const reconnect = useCallback(() => {
    if (socket && !isConnected) {
      console.log('Manual reconnection attempt...');
      socket.connect();
    }
  }, [socket, isConnected]);

  // Function to check connection status
  const checkConnection = useCallback(() => {
    return socket && socket.connected;
  }, [socket]);

  // Enhanced event listeners with proper cleanup
  const onEvent = useCallback((event, callback) => {
    if (socket) {
      socket.on(event, callback);
      return () => socket.off(event, callback);
    }
    return () => {};
  }, [socket]);

  const offEvent = useCallback((event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  }, [socket]);

  const value = {
    socket,
    isConnected,
    onlineUsers,
    connectionAttempts,
    emitEvent,
    onEvent,
    offEvent,
    reconnect,
    checkConnection
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};