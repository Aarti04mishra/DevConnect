import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to automatically include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const signupUser = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    // Handle axios error
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.message || 'Signup failed');
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred');
    }
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    // Handle axios error
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.message || 'Login failed');
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred');
    }
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/logout');
  
    localStorage.removeItem('token');
    return response.data;
  } catch (error) {
    // Even if the API call fails, clear the token locally
    localStorage.removeItem('token');
    
    if (error.response) {
      throw new Error(error.response.data.message || 'Logout failed');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred during logout');
    }
  }
};

export const searchUsers = async (query) => {
  try {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Search failed');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Search failed');
    }
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/profile/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to get user profile');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Failed to get user profile');
    }
  }
};

export const getNotifications = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getUnreadNotificationCount = async () => {
  try {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Follow/Unfollow functions
export const followUser = async (userId) => {
  try {
    const response = await api.post(`/follow/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to follow user');
  }
};

export const unfollowUser = async (userId) => {
  try {
    const response = await api.delete(`/follow/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to unfollow user');
  }
};

export const checkFollowStatus = async (userId) => {
  try {
    const response = await api.get(`/follow-status/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to check follow status');
  }
};

// Message API functions
export const getConversations = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(`/messages/conversations?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getConversationMessages = async (conversationId, page = 1, limit = 50) => {
  try {
    const response = await api.get(`/messages/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const createDirectConversation = async (recipientId) => {
  try {
    const response = await api.post('/messages/conversations/direct', { recipientId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const markMessagesAsRead = async (conversationId, messageIds = []) => {
  try {
    const response = await api.patch(`/messages/conversations/${conversationId}/read`, { messageIds });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const searchMessages = async (query, conversationId = null, page = 1, limit = 20) => {
  try {
    const params = { query, page, limit };
    if (conversationId) params.conversationId = conversationId;
    
    const response = await api.get('/messages/search', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getUnreadMessageCount = async () => {
  try {
    const response = await api.get('/messages/unread-count');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects/create', projectData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to create project');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Failed to create project');
    }
  }
};

export const searchCollaborators = async (query) => {
  try {
    const response = await api.get(`/projects/search-users?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Search failed');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Search failed');
    }
  }
};

export const getUserProjects = async () => {
  try {
    const response = await api.get('/projects/my-projects');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to get projects');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Failed to get projects');
    }
  }
};

export const sendCollaborationRequest = async (projectId, collaboratorId) => {
  try {
    const response = await api.post(`/projects/${projectId}/add-collaborator`, { collaboratorId });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to send collaboration request');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Failed to send collaboration request');
    }
  }
};

export const acceptCollaborationRequest = async (notificationId) => {
  try {
    const response = await api.post(`/projects/collaboration/accept/${notificationId}`, {});
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to accept collaboration request');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Failed to accept collaboration request');
    }
  }
};

export const rejectCollaborationRequest = async (notificationId) => {
  try {
    const response = await api.post(`/projects/collaboration/reject/${notificationId}`, {});
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to reject collaboration request');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Failed to reject collaboration request');
    }
  }
};

export const removeCollaborator = async (projectId, collaboratorId) => {
  try {
    const response = await api.delete(`/projects/${projectId}/collaborator/${collaboratorId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to remove collaborator');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Failed to remove collaborator');
    }
  }
};

export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to delete project');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Failed to delete project');
    }
  }
};



// Get feed posts (projects from followed users + own projects)
export const getFeedPosts = async (page = 1, limit = 10) => {
  try {
    console.log('Making feed API call...'); // Debug log
    const response = await api.get(`/feed/posts?page=${page}&limit=${limit}`);
    console.log('Feed API response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Feed API error:', error); // Debug log
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to get feed posts');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Failed to get feed posts');
    }
  }
};

// Get suggested users to follow
export const getSuggestedUsers = async () => {
  try {
    const response = await api.get('/feed/suggested-users');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to get suggested users');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Failed to get suggested users');
    }
  }
};

// Get trending projects (publicly accessible)
export const getTrendingProjects = async (limit = 10) => {
  try {
    const response = await api.get(`/feed/trending?limit=${limit}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to get trending projects');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Failed to get trending projects');
    }
  }
};

// ============== POST INTERACTION FUNCTIONS ==============
// These functions are for future implementation when you add like/bookmark/comment functionality

export const likePost = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/like`, {});
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to like post');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Failed to like post');
    }
  }
};

export const bookmarkPost = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/bookmark`, {});
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to bookmark post');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Failed to bookmark post');
    }
  }
};

export const addComment = async (postId, comment) => {
  try {
    const response = await api.post(`/posts/${postId}/comment`, { comment });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to add comment');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Failed to add comment');
    }
  }
};

export const sharePost = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/share`, {});
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to share post');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Failed to share post');
    }
  }
}

// Get user's projects
export const getProjects = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get("/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const sendProjectCollaborationRequest = async (projectId, projectOwnerId, message) => {
  try {
    const response = await api.post('/collaboration/request', {
      projectId,
      projectOwnerId,
      message
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to send collaboration request');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Failed to send collaboration request');
    }
  }
};

export const getProjectCollaborationRequests = async () => {
  try {
    const response = await api.get('/collaboration/requests');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to get collaboration requests');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Failed to get collaboration requests');
    }
  }
};
export const respondToCollaborationRequest = async (requestId, action, message = '') => {
  try {
    console.log('Sending collaboration response:', { requestId, action, message });
    
    const response = await api.post(`/collaboration/respond/${requestId}`, {
      action, // 'accept' or 'reject'
      message
    });

    console.log('Collaboration response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error responding to collaboration request:', error);
    
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.message || 'Failed to respond to collaboration request');
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('Failed to respond to collaboration request');
    }
  }
};
