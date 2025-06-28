import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from '../Services/AuthServices';
import { Search, Bell, User, Menu, Code, MessageCircle, Users, Settings, LogOut, X } from 'lucide-react';
import { useSocket } from '../Context/SocketContext';
import { useNotifications } from '../hooks/useNotifications';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const navigate = useNavigate();
  
  // Socket integration
  const { isConnected } = useSocket();
  const {
    notifications,
    unreadCount,
    isLoading: isLoadingNotifications,
    fetchNotifications,
    markAsRead
  } = useNotifications();

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
    
    if (!isNotificationOpen && notifications.length === 0) {
      await fetchNotifications();
    }
  };

  const handleNotificationItemClick = async (notification) => {
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
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        <button
                          onClick={() => setIsNotificationOpen(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {isLoadingNotifications ? (
                        <div className="p-6 text-center">
                          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                          <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-6 text-center">
                          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            onClick={() => handleNotificationItemClick(notification)}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                              !notification.isRead ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                  {notification.sender?.fullname?.charAt(0) || 'U'}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 font-medium">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatNotificationTime(notification.createdAt)}
                                </p>
                              </div>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-200 text-center">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View All Notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <div className="h-8 w-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-900 hidden lg:block text-sm font-medium">John Dev</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">John Dev</p>
                        <p className="text-xs text-gray-600">john@devconnect.com</p>
                      </div>
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </a>
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </a>
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;