import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Replace with your backend URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Add this new function for searching users
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
    const response = await fetch(`${API_BASE_URL}/notifications?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUnreadNotificationCount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

// Add these to your AuthServices.js file
export const followUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/follow/${userId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

export const unfollowUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/follow/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

export const checkFollowStatus = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/follow-status/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Message API functions
export const getConversations = async (page = 1, limit = 20) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/conversations?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getConversationMessages = async (conversationId, page = 1, limit = 50) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/conversations/${conversationId}/messages?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createDirectConversation = async (recipientId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/conversations/direct`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipientId })
    });
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const markMessagesAsRead = async (conversationId, messageIds = []) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/conversations/${conversationId}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messageIds })
    });
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const searchMessages = async (query, conversationId = null, page = 1, limit = 20) => {
  try {
    const url = new URL(`${API_BASE_URL}/messages/search`);
    url.searchParams.append('query', query);
    url.searchParams.append('page', page);
    url.searchParams.append('limit', limit);
    if (conversationId) url.searchParams.append('conversationId', conversationId);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUnreadMessageCount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/unread-count`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};