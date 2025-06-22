import React, { useState } from 'react';
import { Search, Bell, User, Menu, Code, MessageCircle, Users, Settings, LogOut, X } from 'lucide-react';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(3);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsSearchOpen(e.target.value.length > 0);
  };

  const handleSearchFocus = () => {
    if (searchQuery.length > 0) {
      setIsSearchOpen(true);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => setIsSearchOpen(false), 200);
  };

  const searchResults = {
    developers: [
      { id: 1, name: 'John Smith', role: 'Frontend Developer', avatar: 'JS' },
      { id: 2, name: 'Sarah Johnson', role: 'Full Stack Developer', avatar: 'SJ' },
      { id: 3, name: 'Mike Chen', role: 'Backend Developer', avatar: 'MC' }
    ],
    projects: [
      { id: 1, name: 'E-commerce Platform', type: 'React + Node.js' },
      { id: 2, name: 'Mobile Banking App', type: 'React Native' },
      { id: 3, name: 'AI Chat Bot', type: 'Python + TensorFlow' }
    ]
  };

  const filteredDevelopers = searchResults.developers.filter(dev => 
    dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dev.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProjects = searchResults.projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {/* Search Box */}
              <div className="relative hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search developers, projects..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="bg-gray-50 text-gray-900 placeholder-gray-500 pl-10 pr-4 py-2 w-48 md:w-64 lg:w-80 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                />
                
                {isSearchOpen && (searchQuery.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    {filteredDevelopers.length > 0 && (
                      <div className="p-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">Developers</h3>
                        {filteredDevelopers.slice(0, 3).map(dev => (
                          <a
                            key={dev.id}
                            href="#"
                            className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-md transition-colors duration-200"
                          >
                            <div className="h-8 w-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                              {dev.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{dev.name}</p>
                              <p className="text-xs text-gray-500">{dev.role}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                    
                    {filteredProjects.length > 0 && (
                      <div className="p-2 border-t border-gray-100">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">Projects</h3>
                        {filteredProjects.slice(0, 3).map(project => (
                          <a
                            key={project.id}
                            href="#"
                            className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-md transition-colors duration-200"
                          >
                            <div className="h-8 w-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{project.name}</p>
                              <p className="text-xs text-gray-500">{project.type}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                    
                    {filteredDevelopers.length === 0 && filteredProjects.length === 0 && (
                      <div className="p-4 text-center">
                        <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
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
                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 relative">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {notificationCount}
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