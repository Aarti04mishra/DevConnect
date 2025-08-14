// AuthGuard.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // Check if both token and user exist
  if (!token || !user) {
    return false;
  }
  
  try {
    // Optional: Check if token is expired (if you store expiry info)
    // You can decode JWT token here if needed
    const userData = JSON.parse(user);
    return true;
  } catch (error) {
    // If user data is corrupted, consider user as not authenticated
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
};

// ProtectedRoute: Prevents unauthenticated users from accessing protected pages
export const ProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// PublicRoute: Prevents authenticated users from accessing login/register pages
export const PublicRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  
  if (authenticated) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

// Alternative: You can also create a custom hook for authentication
export const useAuth = () => {
  const authenticated = isAuthenticated();
  const user = authenticated ? JSON.parse(localStorage.getItem('user')) : null;
  
  return {
    isAuthenticated: authenticated,
    user: user
  };
};

export default { ProtectedRoute, PublicRoute, useAuth };