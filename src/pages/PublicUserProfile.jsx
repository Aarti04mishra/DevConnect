import React, { useState, useEffect } from 'react';
import { useParams,useNavigate  } from 'react-router-dom';
import { getUserProfile } from '../Services/AuthServices'; 
import { 
  User, Mail, GraduationCap, Star, Github, Linkedin, MapPin, Calendar, 
  MessageCircle, UserPlus, Send, ExternalLink, Code, Trophy, Users,
  Heart, BookOpen, Zap, Award, Clock, Eye, ChevronRight, X
} from 'lucide-react';
import Navbar from '../Components/Navbar';
// import { followUser, unfollowUser, checkFollowStatus } from '../Services/AuthServices';
import { followUser, unfollowUser, checkFollowStatus, sendProjectCollaborationRequest } from '../Services/AuthServices';

const PublicUserProfile = () => {
 const { userId } = useParams(); 
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [activeTab, setActiveTab] = useState('overview');
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);
  const [collaborationMessage, setCollaborationMessage] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [followLoading, setFollowLoading] = useState(false);
const navigate = useNavigate();

useEffect(() => {
  const checkStatus = async () => {
    if (userId) {
      try {
        setIsLoading(true);
        const response = await checkFollowStatus(userId);
        if (response.success) {
          setIsFollowing(response.data.isFollowing);
        }
      } catch (error) {
        console.error('Error checking follow status:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  checkStatus();
}, [userId]);

const handleFollowToggle = async () => {
  try {
    setFollowLoading(true);
    
    if (isFollowing) {
      // Unfollow
      const response = await unfollowUser(userId);
      if (response.success) {
        setIsFollowing(false);
        // Optional: Show success message
        console.log('Unfollowed successfully');
      }
    } else {
      // Follow - This will trigger the notification
      const response = await followUser(userId);
      if (response.success) {
        setIsFollowing(true);
        // Optional: Show success message
        console.log('Followed successfully - notification sent!');
      }
    }
  } catch (error) {
    console.error('Follow/Unfollow error:', error);
   
  } finally {
    setFollowLoading(false);
  }
};
  
  useEffect(() => {
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile(userId);
      if (response.success) {
        setUserData(response.data);
        
        // Check follow status
        const followStatus = await checkFollowStatus(userId);
        if (followStatus.success) {
          setIsFollowing(followStatus.data.isFollowing);
        }
      } else {
        setError('Failed to load user profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  if (userId) {
    fetchUserData();
  }
}, [userId]);


   if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  
 

  const myProjects = [
    { id: 1, name: 'Weather Prediction App' },
    { id: 2, name: 'Social Media Analytics' },
    { id: 3, name: 'E-commerce Platform' }
  ];

  const handleFollow = async () => {
  try {
    setFollowLoading(true);
    
    if (isFollowing) {
      const response = await unfollowUser(userId);
      if (response.success) {
        setIsFollowing(false);
      }
    } else {
      const response = await followUser(userId);
      if (response.success) {
        setIsFollowing(true);
      }
    }
  } catch (error) {
    console.error('Follow/Unfollow error:', error);
    // You can add a toast notification here
  } finally {
    setFollowLoading(false);
  }
};

const handleSendCollaboration = async () => {
  if (collaborationMessage.trim() && selectedProject) {
    const selectedProjectData = userData.projects.find(p => p._id === selectedProject);
    
    try {
      // Show loading state
      const originalMessage = collaborationMessage;
      setCollaborationMessage('Sending...');
      
      // Send collaboration request using the API
      const response = await sendProjectCollaborationRequest(selectedProject, userData._id, originalMessage);
      
      if (response.success) {
        // Close modal and reset form
        setShowCollaborationModal(false);
        setCollaborationMessage('');
        setSelectedProject('');
        
        // Show success message
        alert(`Collaboration request sent to ${userData.fullname} successfully!`);
      } else {
        throw new Error(response.message || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error sending collaboration request:', error);
      alert('Failed to send collaboration request. Please try again.');
      // Reset the message if there was an error
      setCollaborationMessage('');
    }
  }
};

const handleMessageClick = () => {
  // Ensure userData is available
  if (!userData || !userId) {
    console.error('User data not available');
    return;
  }

  // Create a comprehensive user object for messaging
  const selectedUser = {
    id: userId,
    name: userData.fullname || userData.name || 'Unknown User',
    avatar: userData.fullname 
      ? userData.fullname.split(' ').map(n => n[0]).join('').toUpperCase()
      : userData.name?.charAt(0).toUpperCase() || 'U',
    isOnline: userData.isOnline || false,
    lastSeen: userData.lastSeen || 'Recently',
    project: 'Direct Message',
    role: userData.university || userData.role || 'Developer',
    // Additional profile data that might be useful
    email: userData.email,
    profilePicture: userData.profilePicture || userData.avatar,
    location: userData.location,
    skills: userData.skills || []
  };

  console.log('Navigating to messages with user:', selectedUser); // Debug log

  navigate('/messages', {
    state: {
      selectedUser: selectedUser
    }
  });
};

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userData.fullname.split(' ').map(n => n[0]).join('')}
              </div>
              {userData.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{userData.fullname}</h1>
                  <p className="text-gray-600 mt-1">{userData.university}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined {formatDate(userData.joinDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {userData.isOnline ? 'Online now' : `Last seen ${userData.lastSeen}`}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-0 flex space-x-3">
                  <button
                    onClick={() => setShowCollaborationModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Collaborate
                  </button>

                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading || isLoading}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } ${(followLoading || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {followLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        {isFollowing ? 'Unfollowing...' : 'Following...'}
                      </div>
                    ) : (
                      isFollowing ? 'Following' : 'Follow'
                    )}
                  </button>
                  <button
                    onClick={handleMessageClick}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{userData.stats.connectionsCount}</div>
              <div className="text-sm text-gray-600">Connections</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{userData.stats.reputation}</div>
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
              { id: 'overview', label: 'Overview', icon: User },
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
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{userData.bio}</p>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills & Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {userData.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Skill Level</h3>
                  <div className="flex items-center">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= (userData.skillLevel === 'beginner' ? 2 : userData.skillLevel === 'intermediate' ? 3 : 5)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 capitalize">{userData.skillLevel}</span>
                  </div>
                </div>
              </div>

              {/* Featured Projects */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold text-gray-900">Featured Projects</h2>
    <button
      onClick={() => setActiveTab('projects')}
      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
    >
      View All
      <ChevronRight className="w-4 h-4 ml-1" />
    </button>
  </div>
  
  <div className="space-y-4">
    {userData.projects && userData.projects.length > 0 ? (
      userData.projects.slice(0, 2).map((project) => (
        <div key={project._id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.projectStatus)}`}>
                {project.projectStatus}
              </span>
              {project.projectStatus === 'collaborative' && (
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                  Looking for collaborators
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-600 mb-3">{project.description}</p>
          
          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-3">
            {project.techStack && project.techStack.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
          
          {/* Collaboration Purpose - Enhanced Display */}
          {project.projectStatus === 'collaborative' && project.collaborationPurpose && project.collaborationPurpose.length > 0 && (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-2">
                <Users className="w-4 h-4 text-green-600 mr-2" />
                <p className="text-sm font-medium text-green-800">Seeking collaboration for:</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.collaborationPurpose.map((purpose, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-300">
                    {purpose}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Existing collaborators if any */}
          {project.collaborators && project.collaborators.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Current collaborators ({project.collaborators.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {project.collaborators.map((collaborator, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                    {collaborator.userId?.fullname || 'Unknown'}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-300"
                >
                  View Code
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-300"
                >
                  Live Demo
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
            </div>
            {project.projectStatus === 'collaborative' && (
              <button
                onClick={() => {
                  setSelectedProject(project._id);
                  setShowCollaborationModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-all duration-300 flex items-center"
              >
                <Send className="w-3 h-3 mr-1" />
                Collaborate
              </button>
            )}
          </div>
        </div>
      ))
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-500">No projects available</p>
      </div>
    )}
  </div>
</div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Social Links */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
                <div className="space-y-3">
                  {userData.socialProfiles.github && (
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
                  )}
                  {userData.socialProfiles.linkedin && (
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
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {/* Activity items would go here */}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">All Projects</h2>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                  All
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                  Looking for collaborators
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userData.projects && userData.projects.length > 0 ? (
                userData.projects.map((project) => (
                  <div key={project._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.projectStatus)}`}>
                          {project.projectStatus}
                        </span>
                        {project.projectStatus === 'collaborative' && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                            Seeking collaborators
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    
                    {/* Collaborators section */}
                    {project.collaborators && project.collaborators.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Collaborators:</p>
                        <div className="flex flex-wrap gap-2">
                          {project.collaborators.map((collaborator, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                              {collaborator.userId?.fullname || 'Unknown'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack && project.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    {project.projectStatus === 'collaborative' && project.collaborationPurpose && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Looking for:</p>
                        <div className="flex flex-wrap gap-2">
                          {project.collaborationPurpose.map((purpose, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                              {purpose}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-3">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-300"
                          >
                            View Code
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-300"
                          >
                            Live Demo
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                      {project.projectStatus === 'collaborative' && (
                        <button
                          onClick={() => {
                            setSelectedProject(project._id);
                            setShowCollaborationModal(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                        >
                          Collaborate
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No projects available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Activity Timeline</h2>
            <div className="space-y-6">
              <div className="text-center py-8">
                <p className="text-gray-500">End of activity timeline</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Collaboration Modal */}
      {showCollaborationModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg max-w-md w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Send Collaboration Request</h3>
        <button
          onClick={() => setShowCollaborationModal(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select project to collaborate on
          </label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a project...</option>
            {userData.projects && userData.projects
              .filter(project => project.projectStatus === 'collaborative')
              .map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))
            }
          </select>
          {userData.projects && userData.projects.filter(project => project.projectStatus === 'collaborative').length === 0 && (
            <p className="text-sm text-gray-500 mt-1">No projects available for collaboration</p>
          )}
        </div>
        
        {/* Show selected project details */}
        {selectedProject && (
          <div className="bg-gray-50 p-3 rounded-lg">
            {(() => {
              const project = userData.projects.find(p => p._id === selectedProject);
              return project ? (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{project.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                  {project.collaborationPurpose && project.collaborationPurpose.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Looking for:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.collaborationPurpose.map((purpose, index) => (
                          <span key={index} className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                            {purpose}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null;
            })()}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={collaborationMessage}
            onChange={(e) => setCollaborationMessage(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder={selectedProject ? 
              `Hi ${userData.fullname}! I'd love to collaborate with you on this project. I have experience in...` :
              `Hi ${userData.fullname}! I'd love to collaborate with you. Please select a project above.`
            }
          />
        </div>
      </div>
      
      <div className="flex space-x-3 mt-6">
        <button
          onClick={handleSendCollaboration}
          disabled={!collaborationMessage.trim() || !selectedProject}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
        >
          Send Request
        </button>
        <button
          onClick={() => {
            setShowCollaborationModal(false);
            setCollaborationMessage('');
            setSelectedProject('');
          }}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default PublicUserProfile;