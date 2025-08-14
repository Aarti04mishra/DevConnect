import React, { useState } from 'react';
import { acceptCollaborationRequest, rejectCollaborationRequest } from '../Services/AuthServices';
import { Users, CheckCircle, XCircle } from 'lucide-react';

const ProjectInvitationNotification = ({ notification, onResponse }) => {
  console.log('🎯 ProjectInvitationNotification component is rendering!');
  console.log('Notification prop:', notification);
  console.log('onResponse prop:', onResponse);
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get the current status from notification - check multiple possible fields
  const getCurrentStatus = () => {
    return notification.status || 
           notification.responseStatus || 
           notification.collaborationStatus ||
           'pending';
  };

  const [status, setStatus] = useState(getCurrentStatus());

  // Extract project title from notification data or message
  const getProjectTitle = () => {
    // Check relatedData first (your actual structure)
    if (notification.relatedData?.projectTitle) {
      return notification.relatedData.projectTitle;
    }
    
    // Fallback to direct projectTitle
    if (notification.projectTitle) {
      return notification.projectTitle;
    }
    
    // Try to extract from message
    const message = notification.message || '';
    const match = message.match(/collaborate on ["']([^"']+)["']/);
    if (match) {
      return match[1];
    }
    
    return 'this project';
  };

  const getSenderName = () => {
    return notification.sender?.fullname || 
           notification.senderName || 
           'Someone';
  };

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      const response = await acceptCollaborationRequest(notification._id);
      if (response.success) {
        setStatus('accepted');
        
        // Update the notification object with multiple status fields for persistence
        notification.status = 'accepted';
        notification.responseStatus = 'accepted';
        notification.collaborationStatus = 'accepted';
        notification.isRead = true;
        
        // Call onResponse to update parent component
        if (onResponse) {
          onResponse(notification._id, 'accepted');
        }
      } else {
        console.error('Failed to accept invitation:', response.message);
        // Use toast instead of alert if available
        if (window.showToast) {
          window.showToast('Failed to accept invitation: ' + response.message, 'error');
        } else {
          alert('Failed to accept invitation: ' + response.message);
        }
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      // Only show error if it's not about "already processed" requests
      if (!error.message?.includes('not found') && !error.message?.includes('already')) {
        if (window.showToast) {
          window.showToast('Error accepting invitation: ' + (error.message || 'Unknown error'), 'error');
        } else {
          alert('Error accepting invitation: ' + (error.message || 'Unknown error'));
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      const response = await rejectCollaborationRequest(notification._id);
      if (response.success) {
        setStatus('rejected');
        
        // Update the notification object with multiple status fields for persistence
        notification.status = 'rejected';
        notification.responseStatus = 'rejected';
        notification.collaborationStatus = 'rejected';
        notification.isRead = true;
        
        // Call onResponse to update parent component
        if (onResponse) {
          onResponse(notification._id, 'rejected');
        }
      } else {
        console.error('Failed to reject invitation:', response.message);
        alert('Failed to reject invitation: ' + response.message);
      }
    } catch (error) {
      console.error('Error rejecting invitation:', error);
      // Only show error if it's not about "already processed" requests
      if (!error.message?.includes('not found') && !error.message?.includes('already')) {
        alert('Error rejecting invitation: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (dateString) => {
    const now = new Date();
    const notificationTime = new Date(dateString);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Debug logging
  console.log('ProjectInvitationNotification rendered with:', {
    notification,
    projectTitle: getProjectTitle(),
    senderName: getSenderName(),
    currentStatus: getCurrentStatus(),
    localStatus: status
  });

  // Show status view if request has been responded to
  if (status === 'accepted' || status === 'rejected') {
    return (
      <div className={`p-4 border-l-4 ${
        status === 'accepted' 
          ? 'bg-green-50 border-l-green-500' 
          : 'bg-red-50 border-l-red-500'
      }`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              status === 'accepted' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {status === 'accepted' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Collaboration Request {status === 'accepted' ? 'Accepted' : 'Declined'}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              {status === 'accepted' 
                ? `You accepted the collaboration request for "${getProjectTitle()}"` 
                : `You declined the collaboration request for "${getProjectTitle()}"`
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatTime(notification.createdAt)}
            </p>
            {status === 'accepted' && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ You're now a collaborator
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show pending invitation with action buttons
  return (
    <div className={`p-4 transition-colors duration-200 ${
      !notification.isRead ? 'bg-blue-50' : 'bg-white'
    }`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Project Collaboration Request
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-medium">{getSenderName()}</span> invited you to collaborate on{' '}
                <span className="font-medium text-indigo-600">"{getProjectTitle()}"</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatTime(notification.createdAt)}
              </p>
            </div>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
            )}
          </div>
          
          {/* ACTION BUTTONS - Only show if status is pending */}
          <div className="flex space-x-2 mt-3">
            <button
              onClick={handleAccept}
              disabled={isProcessing}
              className="flex items-center space-x-1 px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-md hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3 h-3" />
                  <span>Accept</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="flex items-center space-x-1 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-md hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  <span>Decline</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInvitationNotification;