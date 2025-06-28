import React, { useState, useEffect } from 'react';
import { 
  User, Mail, GraduationCap, Star, Github, Linkedin, MapPin, Calendar, 
  Edit3, Save, X, Camera, Settings, BookOpen, Code, Trophy, Users,
  ExternalLink, Plus, Trash2, Eye, EyeOff
} from 'lucide-react';
import Navbar from '../Components/Navbar';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [userExists, setUserExists] = useState(false);

const [userData, setUserData] = useState({
  fullName: '',
  email: '',
  university: '',
  skillLevel: 'beginner',
  interests: [],
  socialProfiles:[],
  bio: '',
  joinDate: '',
  location: '',
  avatar: null,
  // Keep the existing projects and stats as fallback
  projects: [],
  stats: {
    projectsCompleted: 0,
    connectionsMode: 0,
    profileViews: 0
  }
});

const dummyProjects = [
  {
    id: 1,
    name: "E-commerce Platform",
    description: "A full-stack e-commerce platform with React frontend and Node.js backend. Features include user authentication, product catalog, shopping cart, and payment integration.",
    tech: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
    link: "https://github.com/username/ecommerce-platform",
    status: "completed",
    isActive: false,
    needsCollaboration: false,
    collaborators: ["John Doe", "Jane Smith"],
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "AI-Powered Chat Bot",
    description: "An intelligent chatbot using OpenAI's GPT API with natural language processing capabilities. Currently working on improving conversation flow and adding voice features.",
    tech: ["Python", "OpenAI API", "Flask", "React", "WebSocket"],
    link: "https://github.com/username/ai-chatbot",
    status: "in-progress",
    isActive: true,
    needsCollaboration: true,
    collaborationNeeds: ["Frontend Developer", "UI/UX Designer"],
    collaborators: ["Alex Johnson"],
    createdAt: "2024-02-10"
  },
  {
    id: 3,
    name: "Weather Dashboard",
    description: "A responsive weather application with real-time data visualization, forecasts, and location-based weather alerts. Looking for contributors to add more features.",
    tech: ["Vue.js", "D3.js", "OpenWeatherMap API", "CSS3"],
    link: "https://github.com/username/weather-dashboard",
    status: "in-progress",
    isActive: true,
    needsCollaboration: true,
    collaborationNeeds: ["Backend Developer", "Data Analyst"],
    collaborators: [],
    createdAt: "2024-03-05"
  },
  {
    id: 4,
    name: "Task Management App",
    description: "A collaborative task management application with real-time updates, team collaboration features, and productivity analytics.",
    tech: ["React", "Firebase", "Tailwind CSS", "Chart.js"],
    link: "https://github.com/username/task-manager",
    status: "completed",
    isActive: false,
    needsCollaboration: false,
    collaborators: ["Sarah Wilson", "Mike Chen", "Emma Davis"],
    createdAt: "2023-12-20"
  },
  {
    id: 5,
    name: "Blockchain Voting System",
    description: "A secure voting system built on blockchain technology ensuring transparency and immutability. Currently in development phase and needs blockchain experts.",
    tech: ["Solidity", "Web3.js", "React", "Ethereum", "MetaMask"],
    link: "https://github.com/username/blockchain-voting",
    status: "in-progress",
    isActive: true,
    needsCollaboration: true,
    collaborationNeeds: ["Blockchain Developer", "Security Expert", "Smart Contract Auditor"],
    collaborators: ["David Lee"],
    createdAt: "2024-01-28"
  }
];

useEffect(() => {
    setIsLoadingProfile(true);
    
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData(prevData => ({
          ...prevData,
          fullName: user.name || user.fullname || '',
          email: user.email || '',
          university: user.university || '',
          skillLevel: user.skillLevel || 'beginner',
          interests: user.interests || [],
          socialProfiles: user.socialProfiles || [],
          bio: user.bio || '',
          location: user.location || '',
          joinDate: user.createdAt || user.joinDate || new Date().toISOString(),
          // Use dummy projects if no user projects exist
          projects: user.projects && user.projects.length > 0 ? user.projects : dummyProjects,
          stats: user.stats || {
            projectsCompleted: dummyProjects.filter(p => p.status === 'completed').length,
            connectionsMode: 12, // Updated based on dummy data
            profileViews: 45
          }
        }));
        setUserExists(true);
      } else {
        setUserExists(false);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserExists(false);
    }
    
    setIsLoadingProfile(false);
}, []);


  const [editData, setEditData] = useState({ ...userData });
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    tech: '',
    link: ''
  });
  const [showAddProject, setShowAddProject] = useState(false);

  const techInterests = [
    'Web Development', 'Mobile Apps', 'AI/ML', 'Data Science',
    'DevOps', 'Cybersecurity', 'Game Development', 'Blockchain',
    'Cloud Computing', 'IoT', 'AR/VR', 'Robotics'
  ];

  const skillLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

   const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...userData });
  };

   const handleSave = () => {
    setUserData({ ...editData });
    setIsEditing(false);
    setShowPasswordFields(false);
    
    // Update localStorage with new data
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...editData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

   const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
    setShowPasswordFields(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

   const handleInterestToggle = (interest) => {
    setEditData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

    const handleAddProject = () => {
    if (newProject.name && newProject.description) {
      const project = {
        id: Date.now(),
        name: newProject.name,
        description: newProject.description,
        tech: newProject.tech.split(',').map(t => t.trim()).filter(t => t),
        link: newProject.link
      };
      
      setEditData(prev => ({
        ...prev,
        projects: [...prev.projects, project]
      }));
      
      setNewProject({ name: '', description: '', tech: '', link: '' });
      setShowAddProject(false);
    }
  };

    const handleDeleteProject = (projectId) => {
    setEditData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId)
    }));
  };

 const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Add this before your JSX return
if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

 if (!userExists) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'planning':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'in-progress':
      return 'In Progress';
    case 'planning':
      return 'Planning';
    default:
      return 'Unknown';
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     
     <Navbar/>
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userData.fullName ? userData.fullName.split(' ').map(n => n[0]).join('') : 'U'}
              </div>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors duration-300">
                  <Camera className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{userData.fullName || 'Your Name'}</h1>
                  <p className="text-gray-600 mt-1">{userData.university || 'Your University'}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                       {userData.location || 'Add location'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined {formatDate(userData.joinDate)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-0">
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{userData.stats.projectsCompleted}</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{userData.stats.connectionsMode}</div>
              <div className="text-sm text-gray-600">Connections</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{userData.stats.profileViews}</div>
              <div className="text-sm text-gray-600">Profile Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'projects', label: 'Projects', icon: Code },
              { id: 'activity', label: 'Activity', icon: Trophy }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-300 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                
                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-gray-900 mt-1">{userData.fullName || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900 mt-1">{userData.email || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">University</label>
                        <p className="text-gray-900 mt-1">{userData.university || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Skill Level</label>
                        <p className="text-gray-900 mt-1 capitalize">{userData.skillLevel}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bio</label>
                      <p className="text-gray-900 mt-1">{userData.bio || 'No bio added yet'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={editData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                        <input
                          type="text"
                          name="university"
                          value={editData.university}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
                        <select
                          name="skillLevel"
                          value={editData.skillLevel}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {skillLevels.map(skill => (
                            <option key={skill.value} value={skill.value}>{skill.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={editData.bio}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Interests */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Technical Interests</h2>
                
                {!isEditing ? (
                  <div className="flex flex-wrap gap-2">
                    {userData.interests.length > 0 ? (
                      userData.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No interests selected yet</p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {techInterests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                          editData.interests.includes(interest)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Password Section (only in edit mode) */}
              {isEditing && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                    <button
                      onClick={() => setShowPasswordFields(!showPasswordFields)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {showPasswordFields ? 'Cancel' : 'Change Password'}
                    </button>
                  </div>
                  
                  {showPasswordFields && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Social Links */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
                
               {!isEditing ? (
                  <div className="space-y-3">
                    {userData.socialProfiles ? (
                      <a
                        href={userData.socialProfiles.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300"
                      >
                        <Github className="w-4 h-4 mr-3" />
                        GitHub
                        <ExternalLink className="w-3 h-3 ml-auto" />
                      </a>
                    ) : (
                      <p className="text-gray-500 text-sm">No GitHub profile added</p>
                    )}
                    {userData.socialProfiles.linkedin ? (
                      <a
                        href={userData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300"
                      >
                        <Linkedin className="w-4 h-4 mr-3" />
                        LinkedIn
                        <ExternalLink className="w-3 h-3 ml-auto" />
                      </a>
                    ) : (
                      <p className="text-gray-500 text-sm">No LinkedIn profile added</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                      <input
                        type="url"
                        name="github"
                        value={editData.github}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                      <input
                        type="url"
                        name="linkedin"
                        value={editData.linkedin}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-2 rounded-lg transition-all duration-300">
                    <Users className="w-4 h-4 mr-3" />
                    Find Connections
                  </button>
                  <button className="w-full text-left flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-2 rounded-lg transition-all duration-300">
                    <BookOpen className="w-4 h-4 mr-3" />
                    Browse Projects
                  </button>
                  <button className="w-full text-left flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-2 rounded-lg transition-all duration-300">
                    <Code className="w-4 h-4 mr-3" />
                    Start New Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">My Projects</h2>
              {isEditing && (
                <button
                  onClick={() => setShowAddProject(!showAddProject)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </button>
              )}
            </div>

            {/* Add Project Form */}
            {isEditing && showAddProject && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Project</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                    <input
                      type="text"
                      value={newProject.name}
                      onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter project name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Describe your project"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Technologies (comma-separated)</label>
                    <input
                      type="text"
                      value={newProject.tech}
                      onChange={(e) => setNewProject(prev => ({ ...prev, tech: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Link (optional)</label>
                    <input
                      type="url"
                      value={newProject.link}
                      onChange={(e) => setNewProject(prev => ({ ...prev, link: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAddProject}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                    >
                      Add Project
                    </button>
                    <button
                      onClick={() => setShowAddProject(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {(isEditing ? editData.projects : userData.projects).map((project) => (
    <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
            {project.isActive && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            )}
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {getStatusText(project.status)}
          </span>
        </div>
        {isEditing && (
          <button
            onClick={() => handleDeleteProject(project.id)}
            className="text-red-600 hover:text-red-700 transition-colors duration-300"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <p className="text-gray-600 mb-4">{project.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map((tech, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Collaboration Section */}
      {project.needsCollaboration && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center mb-2">
            <Users className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">Looking for collaborators</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {project.collaborationNeeds.map((need, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
              >
                {need}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Collaborators */}
      {project.collaborators && project.collaborators.length > 0 && (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700 mb-2 block">Collaborators:</span>
          <div className="flex flex-wrap gap-1">
            {project.collaborators.map((collaborator, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium"
              >
                {collaborator}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-300"
          >
            View Project
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        )}
        
        {project.needsCollaboration && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-300">
            Join Project
          </button>
        )}
      </div>
    </div>
  ))}
</div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">Completed E-commerce Platform project</p>
                  <p className="text-gray-500 text-sm">2 days ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">Connected with 3 new developers</p>
                  <p className="text-gray-500 text-sm">1 week ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Code className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">Started new Weather App project</p>
                  <p className="text-gray-500 text-sm">2 weeks ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">Updated skill level to Intermediate</p>
                  <p className="text-gray-500 text-sm">3 weeks ago</p>
                </div>
              </div>
              
              <div className="text-center py-8">
                <p className="text-gray-500">No more activity to show</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;