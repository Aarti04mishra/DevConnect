import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers, logoutUser,respondToCollaborationRequest } from '../Services/AuthServices';
import { Search, Bell, User, Menu, Code, MessageCircle, Users, Settings, LogOut, X } from 'lucide-react';
import { useSocket } from '../Context/SocketContext';
import { useNotifications } from '../hooks/useNotifications';
import ProjectInvitationNotification from '../Components/ProjectInvitationNotification';
import CollaborationNotification from './CollaborationNotification';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState(null); // Add user state

  const navigate = useNavigate();
  
  // Socket integration
  const { isConnected, socket } = useSocket();
  const { 
    notifications,
    unreadCount,
    isLoading: isLoadingNotifications,
    fetchNotifications,
    markAsRead,
    updateNotificationStatus 
  } = useNotifications();

  // Get user data from localStorage on component mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      // If there's an error parsing user data, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  // Socket listener for real-time notifications
  useEffect(() => {
    if (socket) {
      const handleNewNotification = (notification) => {
        console.log('New notification received:', notification);
        // Refresh notifications to include the new one
        fetchNotifications();
      };

      socket.on('newNotification', handleNewNotification);
      socket.on('collaborationRequest', handleNewNotification);

      return () => {
        socket.off('newNotification', handleNewNotification);
        socket.off('collaborationRequest', handleNewNotification);
      };
    }
  }, [socket, fetchNotifications]);

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNotificationOpen && !event.target.closest('.notification-panel') && !event.target.closest('.notification-button')) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.trim().length < 2) {
        setSearchResults([]);
        setIsSearchOpen(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await searchUsers(query);
        if (response.success) {
          setSearchResults(response.data);
          setIsSearchOpen(true);
        }
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleSearchFocus = () => {
    if (searchQuery.length > 1 && searchResults.length > 0) {
      setIsSearchOpen(true);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => setIsSearchOpen(false), 200);
  };

  const handleUserClick = (userId) => {
    console.log(userId);
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/profile/${userId}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setIsProfileOpen(false); // Close the dropdown
      
      await logoutUser();
      
      // Clear user data from state and localStorage
      setUser(null);
      
      // Navigate to login page
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, still redirect to login
      // since token is cleared locally
      setUser(null);
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };
 
  //profile handler
  const handleProfileClick = () => {
    setIsProfileOpen(false); // Close the dropdown
    navigate('/profile'); // Navigate to profile page
  };
  
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Updated notification handlers using the hook
  const handleNotificationClick = async () => {
    setIsNotificationOpen(!isNotificationOpen);
    
    if (!isNotificationOpen) {
      // Always refresh notifications when opening
      await fetchNotifications();
    }
  };

  // Enhanced function to check notification types
  const getNotificationType = (notification) => {
    console.log('Checking notification:', notification);
    
    // Direct type matching
    if (notification.type === 'collaboration_request') {
      return 'collaboration';
    }
    
    if (notification.type === 'follow') {
      return 'follow';
    }

    // Check for project invitation types
    if (
      notification.type === 'project_invitation' ||
      notification.type === 'project_invite' ||
      notification.type === 'project_collaboration' ||
      notification.type === 'collaborationRequest'
    ) {
      return 'project_invitation';
    }

    // Message-based detection
    if (notification.message) {
      const message = notification.message.toLowerCase();
      if (
        message.includes('collaboration request') ||
        message.includes('wants to collaborate') ||
        message.includes('sent you a collaboration')
      ) {
        return 'collaboration';
      }
      
      if (
        message.includes('collaborate') ||
        message.includes('project invitation') ||
        message.includes('invited you')
      ) {
        return 'project_invitation';
      }
    }

    // Check for project-related data
    if (notification.projectTitle || notification.relatedData?.projectTitle || notification.projectId) {
      return 'project_invitation';
    }

    return 'default';
  };

  const handleNotificationItemClick = async (notification) => {
    const notificationType = getNotificationType(notification);
    
    // Don't navigate for collaboration or project invitations as they have their own buttons
    if (notificationType === 'collaboration' || notificationType === 'project_invitation') {
      return;
    }

    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    
    // Navigate based on notification type
    if (notification.type === 'follow') {
      navigate(`/profile/${notification.sender._id}`);
    }
    
    setIsNotificationOpen(false);
  };

  const formatNotificationTime = (dateString) => {
    const now = new Date();
    const notificationTime = new Date(dateString);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleCollaborationResponse = async (notification, action) => {
    try {
      console.log(`Processing collaboration ${action} for notification:`, notification._id);
      
      // This will trigger the actual API call in the CollaborationNotification component
      // The component handles the API call, we just need to refresh notifications afterward
      await fetchNotifications();
      
      // Optional: Show a success message
      const message = action === 'accept' 
        ? '✅ Collaboration request accepted! User added as collaborator.'
        : '❌ Collaboration request declined.';
      
      console.log(message);
      
      // If you have a toast system, you could show a toast here:
      // showToast(message, action === 'accept' ? 'success' : 'info');
      
    } catch (error) {
      console.error('Error processing collaboration response:', error);
    }
  };

  const handleNotificationResponse = async (notificationId, action) => {
    try {
      console.log(`Handling notification response: ${action} for ${notificationId}`);
      
      // Mark notification as read
      await markAsRead(notificationId);
      
      // Update the notification status using your hook if available
      if (updateNotificationStatus) {
        await updateNotificationStatus(notificationId, action);
      }
      
      // Show success message based on action
      if (action === 'accepted') {
        console.log('✅ Collaboration request accepted! The user has been added as a collaborator.');
        // You could show a toast notification here instead of console.log
      } else if (action === 'rejected') {
        console.log('❌ Collaboration request declined. The user has been notified.');
      }
      
      // Refresh notifications to show updated status
      await fetchNotifications();
      
    } catch (error) {
      console.error('Error handling notification response:', error);
      // You might want to show an error toast here
    }
  };

  // Helper function to get user's first name
  const getDisplayName = () => {
    if (!user) return 'User';
    
    // If fullname exists, use the first word (first name)
    if (user.fullname) {
      return user.fullname.split(' ')[0];
    }
    
    // Fallback to email username
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'User';
  };

  // Helper function to get user's initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    
    if (user.fullname) {
      const names = user.fullname.split(' ');
      if (names.length >= 2) {
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">DevConnect.</h1>
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Connection Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-500 hidden md:block">
                  {isConnected ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Search Box */}
              <div className="relative hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search developers..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="bg-gray-50 text-gray-900 placeholder-gray-500 pl-10 pr-10 py-2 w-48 md:w-64 lg:w-80 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                />
                
                {/* Clear search button */}
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
                
                {isSearchOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    {isSearching && (
                      <div className="p-4 text-center">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        <p className="text-sm text-gray-500 mt-2">Searching...</p>
                      </div>
                    )}
                    
                    {!isSearching && searchResults.length > 0 && (
                      <div className="p-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">
                          Developers ({searchResults.length})
                        </h3>
                        {searchResults.map(user => (
                          <button
                            key={user._id}
                            onClick={() => handleUserClick(user._id)}
                            className="w-full flex items-center px-3 py-2 hover:bg-gray-50 rounded-md transition-colors duration-200 text-left"
                          >
                            <div className="h-8 w-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                              {user.profile?.avatar ? (
                                <img 
                                  src={user.profile.avatar} 
                                  alt={user.fullname}
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              ) : (
                                user.fullname.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{user.fullname}</p>
                              <p className="text-xs text-gray-500">
                                {user.skillLevel} • {user.university}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                      <div className="p-4 text-center">
                        <p className="text-sm text-gray-500">No developers found for "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Search Button */}
              <button className="sm:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={handleNotificationClick}
                  className="notification-button p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <div className="h-8 w-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    {user?.profile?.avatar ? (
                      <img 
                        src={user.profile.avatar} 
                        alt={user.fullname || 'User'}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {getUserInitials()}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-900 hidden lg:block text-sm font-medium">
                    {getDisplayName()}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.fullname || 'User'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {user?.email || 'user@devconnect.com'}
                        </p>
                      </div>
                      <button 
                        onClick={handleProfileClick}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 w-full text-left"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </button>
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </a>
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <button 
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoggingOut ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                              Signing out...
                            </>
                          ) : (
                            <>
                              <LogOut className="h-4 w-4 mr-2" />
                              Sign out
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Sliding Panel - Removed backdrop and fixed z-index */}
      {isNotificationOpen && (
        <div className={`notification-panel fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${
          isNotificationOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Panel Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Panel Content - Fixed layout to prevent footer overlap */}
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              {isLoadingNotifications ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-500">Loading notifications...</p>
                  </div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                    <p className="text-gray-500">We'll notify you when something happens</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => {
                    const notificationType = getNotificationType(notification);
                    console.log('Rendering notification:', notification._id, 'Type:', notificationType);
                    
                    return (
                      <div key={notification._id} className="relative">
                        {/* Collaboration requests */}
                        {notificationType === 'collaboration' ? (
                          <div className="p-4">
                            <CollaborationNotification 
                              notification={notification}
                              onAccept={(notif) => {
                                console.log('Collaboration request accepted for:', notif._id);
                                handleCollaborationResponse(notif, 'accept');
                              }}
                              onReject={(notif) => {
                                console.log('Collaboration request rejected for:', notif._id);
                                handleCollaborationResponse(notif, 'reject');
                              }}
                              onMarkAsRead={(notifId) => {
                                markAsRead(notifId);
                              }}
                              onRefreshNotifications={fetchNotifications}
                            />
                          </div>
                        ) : notificationType === 'project_invitation' ? (
                          <div className="p-4">
                            <ProjectInvitationNotification 
                              notification={notification}
                              onResponse={handleNotificationResponse}
                            />
                          </div>
                        ) : (
                          // Regular notification item
                          <div
                            onClick={() => handleNotificationItemClick(notification)}
                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                              !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                                  {notification.sender?.fullname?.charAt(0) || 'U'}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 font-medium mb-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatNotificationTime(notification.createdAt)}
                                </p>
                              </div>
                              {!notification.isRead && (
                                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Panel Footer - Now properly positioned at bottom without overlap */}
            {notifications.length > 0 && (
              <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
                <button className="w-full text-center py-2 px-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                  Mark All as Read
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;