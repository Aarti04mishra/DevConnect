import React, { useState } from 'react';
import { Users, Clock, CheckCircle, XCircle, User, Code, Calendar } from 'lucide-react';

const ProjectCollaborationNotification = ({ notification, onResponse }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(notification.status || notification.collaborationStatus || 'pending');

  const handleResponse = async (action) => {
    try {
      setIsProcessing(true);
      setCurrentStatus(action);
      
      // Call the parent's response handler
      await onResponse(notification._id, action);
      
    } catch (error) {
      console.error('Error responding to collaboration request:', error);
      // Revert status on error
      setCurrentStatus('pending');
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

  const getStatusDisplay = () => {
    switch (currentStatus) {
      case 'accepted':
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          text: 'Accepted',
          bgColor: 'bg-green-50 border-green-200',
          textColor: 'text-green-800'
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-4 h-4 text-red-600" />,
          text: 'Declined',
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-800'
        };
      default:
        return {
          icon: <Clock className="w-4 h-4 text-yellow-600" />,
          text: 'Pending',
          bgColor: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-800'
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className={`p-4 border-l-4 ${currentStatus === 'pending' ? 'border-blue-400 bg-blue-50' : statusDisplay.bgColor}`}>
      <div className="flex items-start space-x-3">
        {/* Sender Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {notification.sender?.fullname?.charAt(0) || 'U'}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Collaboration Request</span>
            </div>
            <div className="flex items-center space-x-1">
              {statusDisplay.icon}
              <span className={`text-xs font-medium ${statusDisplay.textColor}`}>
                {statusDisplay.text}
              </span>
            </div>
          </div>

          {/* Request Details */}
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              <span className="font-medium">{notification.sender?.fullname}</span> wants to collaborate on your project
            </p>
            
            {/* Project Info */}
            <div className="bg-white rounded-md p-3 border border-gray-200">
              <div className="flex items-center space-x-2 mb-1">
                <Code className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">
                  {notification.projectTitle || notification.relatedData?.projectTitle || 'Project'}
                </span>
              </div>
              {notification.message && (
                <p className="text-xs text-gray-600 mt-1">
                  "{notification.message}"
                </p>
              )}
            </div>

            {/* Timestamp */}
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{formatTime(notification.createdAt)}</span>
            </div>

            {/* Action Buttons - Only show if pending */}
            {currentStatus === 'pending' && (
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => handleResponse('accepted')}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Accept
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleResponse('rejected')}
                  disabled={isProcessing}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-1" />
                      Decline
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Status Message for completed actions */}
            {currentStatus !== 'pending' && (
              <div className={`mt-3 p-2 rounded-md ${statusDisplay.bgColor} border`}>
                <p className={`text-sm ${statusDisplay.textColor} flex items-center`}>
                  {statusDisplay.icon}
                  <span className="ml-2">
                    {currentStatus === 'accepted' 
                      ? `You accepted ${notification.sender?.fullname}'s collaboration request` 
                      : `You declined ${notification.sender?.fullname}'s collaboration request`
                    }
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Unread indicator */}
        {!notification.isRead && currentStatus === 'pending' && (
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
        )}
      </div>
    </div>
  );
};

export default ProjectCollaborationNotification;