import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../Context/SocketContext'; 
import { 
  Send, Search, MoreVertical, Phone, Video, Info, MessageCircle,
  Paperclip, Smile, ArrowLeft, User, Circle, 
  Check, CheckCheck, Image, File, Code, Link2,
  Plus, Settings, Archive, Star, Trash2
} from 'lucide-react';
import { 
  getConversations, 
  getConversationMessages, 
  createDirectConversation,
  markMessagesAsRead as markAsReadAPI,
  getUnreadMessageCount
} from '../Services/AuthServices';

const MessagingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { socket, isConnected, onlineUsers, emitEvent } = useSocket();
  
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConversationInfo, setShowConversationInfo] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const selectedConversationRef = useRef(null);
const currentUserIdRef = useRef(null);

useEffect(() => {
  selectedConversationRef.current = selectedConversation;
}, [selectedConversation]);

useEffect(() => {
  currentUserIdRef.current = currentUserId;
}, [currentUserId]);

// Get current user ID from localStorage
useEffect(() => {
  try {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setCurrentUserId(user._id || user.id); 
    }
  } catch (error) {
    console.error('Failed to get current user:', error);
  }
}, []);

// Initialize conversations and handle navigation from profile
useEffect(() => {
  if (location.state?.selectedUser) {
    const userFromProfile = location.state.selectedUser;
    console.log('User from profile:', userFromProfile);
    
    // Create conversation via API
    createDirectConversation(userFromProfile.id)
      .then(async (response) => {
        if (response.success) {
          const conv = response.conversation;
          
          // FIXED: Check for existing messages before setting default text
          let lastMessageText = 'Start a conversation...';
          let hasRealMessage = false;
          
          // First, try to get from the conversation object itself
          if (conv.lastMessage) {
            if (typeof conv.lastMessage === 'string') {
              lastMessageText = conv.lastMessage;
              hasRealMessage = true;
            } else if (conv.lastMessage.content) {
              lastMessageText = conv.lastMessage.content;
              hasRealMessage = true;
            }
          }
          
          // If no lastMessage in conversation object, try to get from messages array
          if (!hasRealMessage && conv.messages && conv.messages.length > 0) {
            const latestMessage = conv.messages[conv.messages.length - 1];
            if (latestMessage && latestMessage.content) {
              lastMessageText = latestMessage.content;
              hasRealMessage = true;
            }
          }
          
          // If still no message, try to fetch the latest message from API
          if (!hasRealMessage) {
            try {
              const messagesResponse = await getConversationMessages(conv._id, 1, 1);
              if (messagesResponse.success && messagesResponse.messages.length > 0) {
                const latestMessage = messagesResponse.messages[0];
                if (latestMessage && latestMessage.content) {
                  lastMessageText = latestMessage.content;
                  hasRealMessage = true;
                }
              }
            } catch (msgError) {
              console.log('Could not fetch latest message for conversation:', conv._id);
            }
          }
          
          // ADDED: Check localStorage for cached messages as final fallback
          if (!hasRealMessage) {
            try {
              const savedMessages = localStorage.getItem('userMessages');
              if (savedMessages) {
                const parsedMessages = JSON.parse(savedMessages);
                const conversationMessages = parsedMessages[conv._id];
                if (conversationMessages && conversationMessages.length > 0) {
                  const lastCachedMessage = conversationMessages[conversationMessages.length - 1];
                  if (lastCachedMessage && lastCachedMessage.content) {
                    lastMessageText = lastCachedMessage.content;
                    hasRealMessage = true;
                  }
                }
              }
            } catch (cacheError) {
              console.log('Could not load cached messages for conversation:', conv._id);
            }
          }
          
          // Create conversation object with proper mapping
          const newConversation = {
            id: conv._id,
            _id: conv._id,
            name: userFromProfile.name || conv.displayName,
            avatar: userFromProfile.avatar || conv.displayAvatar || userFromProfile.name?.charAt(0) || 'U',
            lastMessage: lastMessageText, // FIXED: Use the actual last message
            timestamp: hasRealMessage ? (conv.lastActivity ? new Date(conv.lastActivity).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : 'Recently') : 'Now',
            unreadCount: 0,
            isOnline: userFromProfile.isOnline || conv.isOnline || false,
            lastSeen: userFromProfile.lastSeen || conv.lastSeen || 'Recently',
            project: userFromProfile.project || 'Direct Message',
            role: userFromProfile.role || 'Developer',
            isGroup: false,
            participants: conv.participants || [],
            profileData: userFromProfile,
            hasMessages: hasRealMessage // Track if conversation has real messages
          };

          // Check if conversation already exists and update or add
          setConversations(prev => {
            const existingIndex = prev.findIndex(c => c.id === conv._id);
            if (existingIndex !== -1) {
              const updated = [...prev];
              updated[existingIndex] = {
                ...updated[existingIndex],
                ...newConversation
              };
              return updated;
            } else {
              return [newConversation, ...prev];
            }
          });

          // Select the conversation
          setSelectedConversation(conv._id);
          
          console.log('Conversation created/updated:', newConversation);
        } else {
          console.error('Failed to create conversation:', response.message);
        }
      })
      .catch(async (error) => {
        console.error('Failed to create conversation:', error);
        
       let lastMessageText = 'Start a conversation...';
let hasRealMessage = false;

// Check for the new lastMessageText field first (if using Option 2)
if (conv.lastMessageText) {
    lastMessageText = conv.lastMessageText;
    hasRealMessage = true;
}
// Check for direct lastMessage content (if using Option 1)
else if (conv.lastMessage) {
    if (typeof conv.lastMessage === 'string') {
        // Check if it looks like a MongoDB ObjectId (24 hex characters)
        if (conv.lastMessage.length === 24 && /^[a-f0-9]{24}$/i.test(conv.lastMessage)) {
            console.log('Warning: lastMessage appears to be an ObjectId:', conv.lastMessage);
            // This is an ID, not actual message content - don't use it
        } else {
            // This is actual message content
            lastMessageText = conv.lastMessage;
            hasRealMessage = true;
        }
    } else if (conv.lastMessage.content) {
        // This is a populated message object
        if (conv.lastMessage.type === 'file') {
            lastMessageText = `📎 ${conv.lastMessage.fileName || 'File'}`;
        } else {
            lastMessageText = conv.lastMessage.content;
        }
        hasRealMessage = true;
    }
}

// Rest of your existing logic for fallbacks...
if (!hasRealMessage && conv.messages && conv.messages.length > 0) {
    const latestMessage = conv.messages[conv.messages.length - 1];
    if (latestMessage && latestMessage.content) {
        if (latestMessage.type === 'file') {
            lastMessageText = `📎 ${latestMessage.fileName || 'File'}`;
        } else {
            lastMessageText = latestMessage.content;
        }
        hasRealMessage = true;
    }
}
       
        // Fallback: Create local conversation if API fails
        const fallbackConversation = {
          id: `temp_${userFromProfile.id}_${Date.now()}`,
          _id: `temp_${userFromProfile.id}_${Date.now()}`,
          name: userFromProfile.name,
          avatar: userFromProfile.avatar,
          lastMessage: fallbackLastMessage, // FIXED: Use actual last message if found
          timestamp: hasRealMessage ? 'Recently' : 'Now',
          unreadCount: 0,
          isOnline: userFromProfile.isOnline,
          lastSeen: userFromProfile.lastSeen,
          project: userFromProfile.project,
          role: userFromProfile.role,
          isGroup: false,
          participants: [userFromProfile.id],
          profileData: userFromProfile,
          isTemporary: true,
          hasMessages: hasRealMessage
        };
        
        setConversations(prev => [fallbackConversation, ...prev]);
        setSelectedConversation(fallbackConversation.id);
      });
    
    // Clear the navigation state to prevent re-triggering
    window.history.replaceState({}, document.title);
  } else {
    loadExistingConversations();
  }
}, [location.state, onlineUsers]);

// Periodically check unread counts
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const response = await getUnreadMessageCount();
      if (response.success) {
        setConversations(prev => 
          prev.map(conv => {
            const unreadData = response.conversationCounts.find(c => c._id === conv.id);
            return unreadData ? { ...conv, unreadCount: unreadData.unreadCount } : conv;
          })
        );
      }
    } catch (error) {
      console.error('Failed to get unread counts:', error);
    }
  }, 30000); // Check every 30 seconds

  return () => clearInterval(interval);
}, []);

// Socket event listeners - FIXED VERSION
useEffect(() => {
  if (!socket) return;

  console.log('Socket connected:', socket.connected);
  console.log('Socket ID:', socket.id);

  const handleNewMessage = (messageData) => {
  console.log('📨 New message received:', {
    messageData,
    currentSelectedConversation: selectedConversation,
    socketId: socket.id
  });
  
  if (!messageData.conversationId || !messageData.content) {
    console.error('❌ Invalid message data received:', messageData);
    return;
  }
  
  // Add message to messages state
  setMessages(prev => ({
    ...prev,
    [messageData.conversationId]: [
      ...(prev[messageData.conversationId] || []),
      {
        id: messageData._id || messageData.id || `temp_${Date.now()}`,
        senderId: messageData.senderId,
        content: messageData.content,
        timestamp: new Date(messageData.createdAt || Date.now()).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        status: messageData.status || 'delivered',
        type: messageData.type || 'text'
      }
    ]
  }));

  // Update conversation's last message - FIXED VERSION
  setConversations(prev => {
    let conversationExists = false;
    
    const updatedConversations = prev.map(conv => {
      if (conv.id === messageData.conversationId || conv._id === messageData.conversationId) {
        conversationExists = true;
        
        // FIXED: Check if this conversation is currently selected
        const isCurrentConversation = selectedConversation === messageData.conversationId;
        
        return {
          ...conv,
          lastMessage: messageData.content, // ALWAYS update last message
          timestamp: 'Now',
          lastActivity: new Date(),
          // Only increment unread count if this is not the currently selected conversation
          unreadCount: isCurrentConversation ? 0 : (conv.unreadCount || 0) + 1,
          hasMessages: true // Mark that this conversation has real messages
        };
      }
      return conv;
    });
    
    // If conversation doesn't exist, create it (for new conversations)
    if (!conversationExists) {
      // This will trigger loadConversationFromMessage
      loadConversationFromMessage(messageData);
      return updatedConversations;
    }
    
    // Sort conversations by last activity (most recent first)
    return updatedConversations.sort((a, b) => 
      new Date(b.lastActivity || 0) - new Date(a.lastActivity || 0)
    );
  });

  // Show browser notification if the conversation is not active or window is not focused
  if (selectedConversation !== messageData.conversationId || document.hidden) {
    showMessageNotification(messageData);
  }
};

  const handleMessagesDelivered = (data) => {
    console.log('✅ Messages delivered:', data);
    setMessages(prev => ({
      ...prev,
      [data.conversationId]: (prev[data.conversationId] || []).map(msg => 
        msg.senderId === 'me' && msg.status === 'sent'
          ? { ...msg, status: 'delivered' }
          : msg
      )
    }));
  };

  const handleMessagesRead = (data) => {
    console.log('👁️ Messages read:', data);
    setMessages(prev => ({
      ...prev,
      [data.conversationId]: (prev[data.conversationId] || []).map(msg => 
        data.messageIds.includes(msg.id) || (msg.senderId === 'me' && msg.status !== 'read')
          ? { ...msg, status: 'read' }
          : msg
      )
    }));
  };

  const handleUserTyping = (data) => {
    console.log('⌨️ User typing:', data);
    if (data.conversationId === selectedConversation && data.userId !== currentUserId) {
      setTypingUsers(prev => ({
        ...prev,
        [data.conversationId]: {
          ...(prev[data.conversationId] || {}),
          [data.userId]: data.userName
        }
      }));

      setTimeout(() => {
        setTypingUsers(prev => {
          const updated = { ...prev };
          if (updated[data.conversationId] && updated[data.conversationId][data.userId]) {
            delete updated[data.conversationId][data.userId];
            if (Object.keys(updated[data.conversationId]).length === 0) {
              delete updated[data.conversationId];
            }
          }
          return updated;
        });
      }, 3000);
    }
  };

  const handleUserStoppedTyping = (data) => {
    console.log('⏹️ User stopped typing:', data);
    setTypingUsers(prev => {
      const updated = { ...prev };
      if (updated[data.conversationId] && updated[data.conversationId][data.userId]) {
        delete updated[data.conversationId][data.userId];
        if (Object.keys(updated[data.conversationId]).length === 0) {
          delete updated[data.conversationId];
        }
      }
      return updated;
    });
  };

  const handleMessageSent = (data) => {
    console.log('📤 Message sent confirmation:', data);
    setMessages(prev => ({
      ...prev,
      [data.conversationId]: (prev[data.conversationId] || []).map(msg => {
        if (msg.senderId === 'me' && 
            (msg.status === 'sending' || msg.status === 'sent') && 
            msg.content === data.content &&
            Math.abs(new Date(msg.timestamp) - new Date(data.createdAt)) < 5000) {
          return {
            ...msg,
            id: data._id,
            status: 'sent',
            timestamp: new Date(data.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          };
        }
        return msg;
      })
    }));
  };

  // FIXED: Add real-time unread count update handler
  const handleUnreadCountUpdate = (data) => {
    console.log('🔢 Unread count update:', data);
    setConversations(prev => 
      prev.map(conv => {
        const unreadData = data.conversationCounts?.find(c => c._id === conv.id);
        return unreadData ? { ...conv, unreadCount: unreadData.unreadCount } : conv;
      })
    );
  };

  const handleConversationJoined = (data) => {
    console.log('🏠 Joined conversation:', data);
  };

  const handleError = (error) => {
    console.error('❌ Socket error:', error);
  };

  const handleConnect = () => {
    console.log('🔌 Socket connected:', socket.id);
    if (selectedConversation) {
      emitEvent('joinConversation', { conversationId: selectedConversation });
    }
  };

  const handleDisconnect = (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  };

  // Add event listeners
  socket.on('newMessage', handleNewMessage);
  socket.on('messagesDelivered', handleMessagesDelivered);
  socket.on('messagesRead', handleMessagesRead);
  socket.on('userTyping', handleUserTyping);
  socket.on('userStoppedTyping', handleUserStoppedTyping);
  socket.on('messageSent', handleMessageSent);
  socket.on('unreadCountUpdate', handleUnreadCountUpdate); // NEW: Real-time unread count updates
  socket.on('conversationJoined', handleConversationJoined);
  socket.on('error', handleError);
  socket.on('connect', handleConnect);
  socket.on('disconnect', handleDisconnect);

  return () => {
    socket.off('newMessage', handleNewMessage);
    socket.off('messagesDelivered', handleMessagesDelivered);
    socket.off('messagesRead', handleMessagesRead);
    socket.off('userTyping', handleUserTyping);
    socket.off('userStoppedTyping', handleUserStoppedTyping);
    socket.off('messageSent', handleMessageSent);
    socket.off('unreadCountUpdate', handleUnreadCountUpdate);
    socket.off('conversationJoined', handleConversationJoined);
    socket.off('error', handleError);
    socket.off('connect', handleConnect);
    socket.off('disconnect', handleDisconnect);
  };
}, [socket, selectedConversation, currentUserId, emitEvent]);

// Update online status of users
useEffect(() => {
  setConversations(prev => 
    prev.map(conv => ({
      ...conv,
      isOnline: onlineUsers.has(conv.id)
    }))
  );
}, [onlineUsers]);

// Handle joining conversations and marking as read
useEffect(() => {
  if (selectedConversation && socket && currentUserId && socket.connected) {
    console.log('🏠 Joining conversation:', selectedConversation);
    
    // Join conversation with retry logic
    const joinConversation = () => {
      emitEvent('joinConversation', { 
        conversationId: selectedConversation,
        userId: currentUserId 
      });
    };

    joinConversation();

    // Retry joining if socket was just connected
    const retryTimeout = setTimeout(joinConversation, 1000);
    
    // Load messages from API
    loadConversationMessages(selectedConversation);
    
    // Mark messages as read via API
    markMessagesAsRead(selectedConversation)
      .catch(error => console.error('Failed to mark as read:', error));

    // Reset unread count
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );

    return () => {
      clearTimeout(retryTimeout);
      // Leave conversation when switching
      if (socket && socket.connected) {
        emitEvent('leaveConversation', { 
          conversationId: selectedConversation,
          userId: currentUserId 
        });
      }
    };
  }
}, [selectedConversation, socket, currentUserId, emitEvent, socket?.connected]);
// Request notification permission on component mount
useEffect(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      console.log('Notification permission:', permission);
    });
  }
}, []);

// Save conversations to localStorage
useEffect(() => {
  if (conversations.length > 0) {
    localStorage.setItem('userConversations', JSON.stringify(conversations));
  }
}, [conversations]);

// Save messages to localStorage
useEffect(() => {
  if (Object.keys(messages).length > 0) {
    localStorage.setItem('userMessages', JSON.stringify(messages));
  }
}, [messages]);

// Cleanup typing timeout on unmount
useEffect(() => {
  return () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };
}, []);


const loadExistingConversations = async () => {
  try {
    const response = await getConversations(1, 20);
    if (response.success) {
      // Process conversations and load last messages
      const processedConversations = await Promise.all(
        response.conversations.map(async (conv) => {
          // Determine the display name based on conversation type
          let displayName = conv.displayName || conv.name;
          let displayAvatar = conv.displayAvatar;
          
          // For direct conversations, try to get the other participant's name
          if (conv.type === 'direct' && conv.participants && conv.participants.length === 2) {
            const otherParticipant = conv.participants.find(p => p._id !== currentUserId);
            if (otherParticipant) {
              displayName = otherParticipant.fullname || otherParticipant.name || displayName;
              displayAvatar = otherParticipant.fullname?.split(' ').map(n => n[0]).join('') || 
                             otherParticipant.name?.charAt(0) || displayAvatar;
            }
          }
          
          // FIXED: Better handling of last message - try multiple sources
          let lastMessageText = 'Start a conversation...'; // Default fallback
          let hasRealMessage = false; // Track if we found a real message
          
          // First, try to get from the conversation object itself
          if (conv.lastMessage) {
            if (typeof conv.lastMessage === 'string') {
              lastMessageText = conv.lastMessage;
              hasRealMessage = true;
            } else if (conv.lastMessage.content) {
              lastMessageText = conv.lastMessage.content;
              hasRealMessage = true;
            }
          } 
          
          // If no lastMessage in conversation object, try to get from messages array
          if (!hasRealMessage && conv.messages && conv.messages.length > 0) {
            const latestMessage = conv.messages[conv.messages.length - 1];
            if (latestMessage && latestMessage.content) {
              lastMessageText = latestMessage.content;
              hasRealMessage = true;
            }
          }
          
          // If still no message, try to fetch the latest message from API
          if (!hasRealMessage) {
            try {
              const messagesResponse = await getConversationMessages(conv._id, 1, 1);
              if (messagesResponse.success && messagesResponse.messages.length > 0) {
                const latestMessage = messagesResponse.messages[0];
                if (latestMessage && latestMessage.content) {
                  lastMessageText = latestMessage.content;
                  hasRealMessage = true;
                }
              }
            } catch (msgError) {
              console.log('Could not fetch latest message for conversation:', conv._id);
              // Keep the default fallback
            }
          }
          
          // ADDED: Check localStorage for cached messages as final fallback
          if (!hasRealMessage) {
            try {
              const savedMessages = localStorage.getItem('userMessages');
              if (savedMessages) {
                const parsedMessages = JSON.parse(savedMessages);
                const conversationMessages = parsedMessages[conv._id];
                if (conversationMessages && conversationMessages.length > 0) {
                  const lastCachedMessage = conversationMessages[conversationMessages.length - 1];
                  if (lastCachedMessage && lastCachedMessage.content) {
                    lastMessageText = lastCachedMessage.content;
                    hasRealMessage = true;
                  }
                }
              }
            } catch (cacheError) {
              console.log('Could not load cached messages for conversation:', conv._id);
            }
          }
          
          return {
            id: conv._id,
            _id: conv._id,
            name: displayName,
            avatar: displayAvatar || displayName?.charAt(0) || 'U',
            lastMessage: lastMessageText, // Use the processed last message
            timestamp: conv.lastActivity ? new Date(conv.lastActivity).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : (hasRealMessage ? 'Recently' : ''),
            unreadCount: conv.unreadCount || 0,
            isOnline: conv.isOnline || false,
            lastSeen: conv.lastSeen,
            project: conv.project || 'Direct Message',
            role: conv.role || 'Developer',
            isGroup: conv.type === 'group',
            participants: conv.participants?.map(p => p._id) || [],
            conversationData: conv,
            hasMessages: hasRealMessage // Track if conversation has real messages
          };
        })
      );
      
      // Sort conversations - prioritize those with real messages
      const sortedConversations = processedConversations.sort((a, b) => {
        // First priority: conversations with real messages
        if (a.hasMessages && !b.hasMessages) return -1;
        if (!a.hasMessages && b.hasMessages) return 1;
        
        // Second priority: most recent activity
        const aTime = a.conversationData?.lastActivity ? new Date(a.conversationData.lastActivity) : new Date(0);
        const bTime = b.conversationData?.lastActivity ? new Date(b.conversationData.lastActivity) : new Date(0);
        return bTime - aTime;
      });
      
      setConversations(sortedConversations);
    }
  } catch (error) {
    console.error('Failed to load conversations:', error);
    // ENHANCED: Better fallback to localStorage
    const savedConversations = localStorage.getItem('userConversations');
    const savedMessages = localStorage.getItem('userMessages');
    
    if (savedConversations) {
      try {
        const parsedConversations = JSON.parse(savedConversations);
        const parsedMessages = savedMessages ? JSON.parse(savedMessages) : {};
        
        const updatedConversations = parsedConversations.map(conv => {
          // Try to get last message from cached messages
          let lastMessage = conv.lastMessage || 'Start a conversation...';
          const cachedMessages = parsedMessages[conv.id];
          
          if (cachedMessages && cachedMessages.length > 0) {
            const lastCachedMessage = cachedMessages[cachedMessages.length - 1];
            if (lastCachedMessage && lastCachedMessage.content) {
              lastMessage = lastCachedMessage.content;
            }
          }
          
          return {
            ...conv,
            lastMessage: lastMessage,
            isOnline: onlineUsers.has(conv.id)
          };
        });
        
        setConversations(updatedConversations);
      } catch (parseError) {
        console.error('Failed to parse saved conversations:', parseError);
      }
    }
  }
};

// Helper function to load conversation messages
const loadConversationMessages = async (conversationId) => {
  if (!currentUserId) {
    console.log('Current user ID not available yet');
    return;
  }
  
  try {
    const response = await getConversationMessages(conversationId, 1, 50);
    if (response.success) {
      const formattedMessages = response.messages.map(msg => ({
        id: msg._id,
        senderId: msg.senderId._id === currentUserId ? 'me' : msg.senderId._id,
        content: msg.content,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        status: msg.status || 'delivered',
        type: msg.type || 'text',
        fileName: msg.fileName,
        fileSize: msg.fileSize,
        fileUrl: msg.fileUrl
      }));

      setMessages(prev => ({
        ...prev,
        [conversationId]: formattedMessages
      }));
    }
  } catch (error) {
    console.error('Failed to load messages:', error);
  }
};

// Helper function to load conversation from message
const loadConversationFromMessage = async (messageData) => {
  try {
    console.log('Loading conversation from message:', messageData);
    
    // First check if conversation already exists
    const existingConv = conversations.find(conv => 
      conv.id === messageData.conversationId || conv._id === messageData.conversationId
    );
    
    if (existingConv) {
      console.log('Conversation already exists, not creating duplicate');
      return;
    }

    const response = await getConversationById(messageData.conversationId);
    if (response.success) {
      const conv = response.conversation;
      
      let displayName = conv.displayName || conv.name;
      let displayAvatar = conv.displayAvatar;
      
      if (conv.type === 'direct' && conv.participants && conv.participants.length === 2) {
        const otherParticipant = conv.participants.find(p => p._id !== currentUserId);
        if (otherParticipant) {
          displayName = otherParticipant.fullname || otherParticipant.name || displayName;
          displayAvatar = otherParticipant.fullname?.split(' ').map(n => n[0]).join('') || 
                         otherParticipant.name?.charAt(0) || displayAvatar;
        }
      }
      
      const newConversation = {
        id: conv._id,
        _id: conv._id,
        name: displayName,
        avatar: displayAvatar || displayName?.charAt(0) || 'U',
        lastMessage: messageData.content,
        timestamp: 'Now',
        unreadCount: 1, // New conversation with 1 unread message
        isOnline: false,
        lastSeen: 'Recently',
        project: conv.project || 'Direct Message',
        role: conv.role || 'Developer',
        isGroup: conv.type === 'group',
        participants: conv.participants?.map(p => p._id) || [],
        conversationData: conv,
        lastActivity: new Date()
      };
      
      // Add to conversations at the top
      setConversations(prev => [newConversation, ...prev]);
      console.log('New conversation added:', newConversation);
    }
  } catch (error) {
    console.error('Failed to load conversation from message:', error);
  }
};

// FIXED: Better notification function that doesn't cause re-renders
const showMessageNotification = (messageData) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    // Find conversation name from current conversations state
    const conversation = conversations.find(conv => 
      conv.id === messageData.conversationId || conv._id === messageData.conversationId
    );
    
    const senderName = conversation?.name || 'Someone';
    const truncatedMessage = messageData.content.length > 50 
      ? messageData.content.substring(0, 50) + '...'
      : messageData.content;
    
    const notification = new Notification(`New message from ${senderName}`, {
      body: truncatedMessage,
      icon: '/favicon.ico',
      tag: messageData.conversationId,
    });
    
    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);
    
    // Handle notification click
    notification.onclick = () => {
      window.focus();
      setSelectedConversation(messageData.conversationId);
      notification.close();
    };
  }
};

// FIXED: Proper API function for getting conversation by ID
const getConversationById = async (conversationId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/conversations/${conversationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get conversation:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to mark messages as read
const markMessagesAsRead = async (conversationId) => {
  try {
    const response = await markAsReadAPI(conversationId);
    if (response.success) {
      // Emit socket event to notify other users
      emitEvent('markMessagesAsRead', {
        conversationId: conversationId,
        messageIds: response.messageIds || []
      });
    }
    return response;
  } catch (error) {
    console.error('Failed to mark messages as read:', error);
    throw error;
  }
};

// Get current conversation and messages
const currentConversation = conversations.find(conv => conv.id === selectedConversation);
const currentMessages = messages[selectedConversation] || [];

// Scroll to bottom function
const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

// Scroll to bottom when messages change
useEffect(() => {
  scrollToBottom();
}, [currentMessages]);

// Handle typing indicator
const handleTyping = () => {
  if (!isTyping && selectedConversation && socket && currentUserId) {
    setIsTyping(true);
    
    // Get current user's name
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = currentUser.fullname || currentUser.name || 'You';
    
    emitEvent('typing', { 
      conversationId: selectedConversation,
      userName: userName
    });
  }

  // Clear existing timeout
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }

  // Set new timeout to stop typing
  typingTimeoutRef.current = setTimeout(() => {
    if (isTyping && selectedConversation && socket) {
      setIsTyping(false);
      emitEvent('stopTyping', { 
        conversationId: selectedConversation 
      });
    }
  }, 1000);
};

// Handle send message
const handleSendMessage = () => {
  if (newMessage.trim() && selectedConversation && socket && currentUserId) {
    const messageData = {
      conversationId: selectedConversation,
      content: newMessage.trim(),
      type: 'text'
    };

    // Create optimistic message with unique ID
    const optimisticMessage = {
      id: `temp_${Date.now()}_${Math.random()}`,
      senderId: 'me',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sending',
      type: 'text'
    };

    // Add optimistic message to local state IMMEDIATELY
    setMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), optimisticMessage]
    }));

    // Update conversation's last message IMMEDIATELY
    const messageContent = newMessage.trim();
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation 
          ? { 
              ...conv, 
              lastMessage: messageContent,
              timestamp: 'Now',
              lastActivity: new Date()
            }
          : conv
      )
    );

    // Clear input immediately
    setNewMessage('');

    // Then emit message via socket
    emitEvent('sendMessage', messageData);

    // Update message status after a short delay (optimistic update)
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedConversation]: (prev[selectedConversation] || []).map(msg => 
          msg.id === optimisticMessage.id
            ? { ...msg, status: 'sent' }
            : msg
        )
      }));
    }, 100);

    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      emitEvent('stopTyping', { conversationId: selectedConversation });
    }
  }
};

// Handle key press
const handleKeyPress = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
};

// Handle message change
const handleMessageChange = (e) => {
  setNewMessage(e.target.value);
  handleTyping();
};

// Get status icon
const getStatusIcon = (status) => {
  switch (status) {
    case 'sending':
      return <Circle className="w-3 h-3 text-gray-300 animate-pulse" />;
    case 'sent':
      return <Check className="w-3 h-3 text-gray-400" />;
    case 'delivered':
      return <CheckCheck className="w-3 h-3 text-gray-400" />;
    case 'read':
      return <CheckCheck className="w-3 h-3 text-blue-500" />;
    default:
      return null;
  }
};

// Filter conversations
const filteredConversations = conversations.filter(conv =>
  conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  conv.project.toLowerCase().includes(searchQuery.toLowerCase())
);

// Render message
const renderMessage = (message) => {
  const isMe = message.senderId === 'me';
  
  return (
    <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isMe 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-900'
      }`}>
        {message.type === 'file' ? (
          <div className="flex items-center space-x-2">
            <File className="w-4 h-4" />
            <div>
              <p className="text-sm font-medium">{message.fileName}</p>
              <p className="text-xs opacity-75">{message.fileSize}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm">{message.content}</p>
        )}
        
        <div className={`flex items-center justify-end mt-1 space-x-1 ${
          isMe ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span className="text-xs">{message.timestamp}</span>
          {isMe && getStatusIcon(message.status)}
        </div>
      </div>
    </div>
  );
};

// Render typing indicator
const renderTypingIndicator = () => {
  const typingInConversation = typingUsers[selectedConversation];
  if (!typingInConversation || Object.keys(typingInConversation).length === 0) {
    return null;
  }

  const typingUserNames = Object.values(typingInConversation);
  const typingText = typingUserNames.length === 1 
    ? `${typingUserNames[0]} is typing...`
    : `${typingUserNames.join(', ')} are typing...`;

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-100 px-4 py-2 rounded-lg">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">{typingText}</span>
        </div>
      </div>
    </div>
  );
};




  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Connection Status Indicator */}
      {!isConnected && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 text-sm z-50">
          Connection lost. Trying to reconnect...
        </div>
      )}

      {/* Sidebar - Conversations List */}
      <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-80 bg-white border-r border-gray-200`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              {isConnected && (
                <div className="ml-2 w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-600 text-sm">
                Start by visiting someone's profile and clicking the message button.
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedConversation === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative mr-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    {conversation.avatar}
                  </div>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* Conversation Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-1">{conversation.lastMessage}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 truncate">{conversation.project}</span>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] h-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  onClick={() => setSelectedConversation(null)}
                  className="lg:hidden mr-3 p-1 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="relative mr-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    {currentConversation?.avatar}
                  </div>
                  {currentConversation?.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{currentConversation?.name}</h2>
                  <p className="text-sm text-gray-600">
                    {currentConversation?.isOnline ? 'Online now' : currentConversation?.lastSeen || 'Offline'}
                    {currentConversation?.project && ` • ${currentConversation.project}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowConversationInfo(!showConversationInfo)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Start a conversation with {currentConversation?.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  Send your first message to begin collaborating!
                </p>
              </div>
            ) : (
              <>
                {currentMessages.map(renderMessage)}
                {renderTypingIndicator()}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-end space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              
              <div className="flex-1 min-w-0">
                <textarea
                  value={newMessage}
                  onChange={handleMessageChange}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${currentConversation?.name}...`}
                  rows="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                  disabled={!isConnected}
                />
              </div>
              
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-all duration-300"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // No conversation selected state
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to DevConnect Messages</h3>
            <p className="text-gray-600 max-w-sm">
              Select a conversation to start collaborating with fellow developers or visit someone's profile to begin a new conversation.
            </p>
          </div>
        </div>
      )}

      {/* Conversation Info Sidebar */}
      {showConversationInfo && currentConversation && (
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
              {currentConversation.avatar}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{currentConversation.name}</h3>
            <p className="text-sm text-gray-600">{currentConversation.role}</p>
            <p className="text-xs text-gray-500 mt-1">
              {currentConversation.isOnline ? 'Online now' : currentConversation.lastSeen || 'Offline'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Project</h4>
              <p className="text-sm text-gray-600">{currentConversation.project}</p>
            </div>

            <div className="flex space-x-2">
              <button 
                onClick={handleBackToProfile}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                View Profile
              </button>
              <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                <Star className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center">
                  <Archive className="w-4 h-4 mr-3" />
                  Archive Conversation
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center">
                  <Trash2 className="w-4 h-4 mr-3" />
                  Delete Conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingPage;