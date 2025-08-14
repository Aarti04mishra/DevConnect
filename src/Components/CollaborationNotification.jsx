import React, { useState } from 'react';
import { Check, X, User, Calendar, MessageCircle, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { respondToCollaborationRequest } from '../Services/AuthServices';

const CollaborationNotification = ({ 
  notification, 
  onAccept, 
  onReject, 
  onMarkAsRead,
  onRefreshNotifications
}) => {
  // DEBUG: Log the notification to see its structure
  console.log('CollaborationNotification received:', notification);
  console.log('Notification type:', notification.type);
  console.log('Notification message:', notification.message);
  
  const [isResponding, setIsResponding] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [actionType, setActionType] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Check notification type to determine if it's an incoming request or a response
  const isIncomingRequest = notification.type === 'collaboration_request';
  const isAcceptedResponse = notification.type === 'collaboration_accepted' || 
    (notification.type === 'project_update' && notification.message.includes('accepted your collaboration request'));
  const isRejectedResponse = notification.type === 'collaboration_rejected' || 
    (notification.type === 'project_update' && notification.message.includes('declined your collaboration request'));

  const handleResponse = async (action) => {
    setActionType(action);
    setShowResponseModal(true);
  };

  const confirmResponse = async () => {
    try {
      setIsResponding(true);
      setShowErrorMessage(false);
      setShowSuccessMessage(false);
      
      const response = await respondToCollaborationRequest(
        notification._id,
        actionType,
        responseMessage
      );

      if (response.success) {
        const successMsg = actionType === 'accept' 
          ? `✅ Collaboration request accepted! ${requesterName} has been added as a collaborator.`
          : `❌ Collaboration request declined.`;
        
        setSuccessMessage(successMsg);
        setShowSuccessMessage(true);
        
        if (actionType === 'accept') {
          onAccept && onAccept(notification);
        } else {
          onReject && onReject(notification);
        }
        
        onMarkAsRead && onMarkAsRead(notification._id);
        setShowResponseModal(false);
        setResponseMessage('');
        
        if (onRefreshNotifications) {
          await onRefreshNotifications();
        }
        
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
        
      } else {
        throw new Error(response.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error responding to collaboration request:', error);
      setErrorMessage(error.message || 'Failed to respond to collaboration request. Please try again.');
      setShowErrorMessage(true);
      
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
    } finally {
      setIsResponding(false);
    }
  };

  // Safely extract data from notification with fallback values
  const data = notification.relatedData || {};
  const {
    projectTitle = notification.projectTitle || 'Unknown Project',
    requesterName = notification.sender?.fullname || data.requesterName || 'Unknown User',
    requesterEmail = notification.sender?.email || data.requesterEmail || '',
    requestMessage = data.requestMessage || 'No message provided',
    requesterId = notification.sender?._id || data.requesterId || '',
    responded = data.responded || false,
    response = data.response || null,
    responseDate = data.responseDate || null,
    responseMessage: serverResponseMessage = data.responseMessage || ''
  } = data;

  // Extract the actual request message from the notification message for incoming requests
  const extractRequestMessage = (fullMessage) => {
    if (!fullMessage) return 'No message provided';
    
    // For incoming requests, look for the pattern: "Name wants to collaborate on your project "Title": Message"
    if (isIncomingRequest) {
      const match = fullMessage.match(/: (.+)$/);
      if (match && match[1]) {
        return match[1];
      }
      
      if (data.requestMessage) {
        return data.requestMessage;
      }
    }
    
    return fullMessage;
  };

  const actualRequestMessage = extractRequestMessage(notification.message);

  // Render based on notification type
  if (isAcceptedResponse) {
    return (
      <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-lg">
        <div className="flex items-start">
          <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 mb-2">
              Collaboration Request Accepted! 🎉
            </h4>
            <p className="text-green-800 mb-2">
              Your collaboration request for <strong>"{projectTitle}"</strong> has been accepted!
            </p>
            {serverResponseMessage && (
              <div className="bg-white p-3 rounded border mb-3">
                <p className="text-sm text-green-600 mb-1">
                  <strong>Message from project owner:</strong>
                </p>
                <p className="text-gray-800 italic">"{serverResponseMessage}"</p>
              </div>
            )}
            <div className="flex items-center text-sm text-green-600">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(notification.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isRejectedResponse) {
    return (
      <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded-lg">
        <div className="flex items-start">
          <XCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-900 mb-2">
              Collaboration Request Declined
            </h4>
            <p className="text-red-800 mb-2">
              Your collaboration request for <strong>"{projectTitle}"</strong> was declined.
            </p>
            {serverResponseMessage && (
              <div className="bg-white p-3 rounded border mb-3">
                <p className="text-sm text-red-600 mb-1">
                  <strong>Message from project owner:</strong>
                </p>
                <p className="text-gray-800 italic">"{serverResponseMessage}"</p>
              </div>
            )}
            <div className="flex items-center text-sm text-red-600">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(notification.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For incoming collaboration requests (original functionality)
  if (isIncomingRequest) {
    return (
      <>
        <div className={`p-4 border-l-4 ${
          notification.isRead 
            ? 'border-gray-300 bg-gray-50' 
            : 'border-blue-500 bg-blue-50'
        } rounded-lg relative`}>
          
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="absolute top-2 right-2 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-md flex items-center text-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              {successMessage}
            </div>
          )}
          
          {/* Error Message */}
          {showErrorMessage && (
            <div className="absolute top-2 right-2 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-md flex items-center text-sm max-w-sm">
              <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {errorMessage}
            </div>
          )}

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <User className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-gray-900">
                  Collaboration Request
                </h4>
                {!notification.isRead && (
                  <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
              </div>
              
              <p className="text-gray-700 mb-2">
                <strong>{requesterName}</strong> wants to collaborate on your project{' '}
                <strong>"{projectTitle}"</strong>
              </p>
              
              <div className="bg-white p-3 rounded border mb-3">
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Message from {requesterName}:</strong>
                </p>
                <p className="text-gray-800 italic">"{actualRequestMessage}"</p>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(notification.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>

              {/* Action buttons - only show if not responded */}
              {!responded && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleResponse('accept')}
                    disabled={isResponding}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {isResponding && actionType === 'accept' ? 'Accepting...' : 'Accept'}
                  </button>
                  
                  <button
                    onClick={() => handleResponse('reject')}
                    disabled={isResponding}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {isResponding && actionType === 'reject' ? 'Declining...' : 'Decline'}
                  </button>
                  
                  {requesterId && (
                    <button
                      onClick={() => window.open(`/profile/${requesterId}`, '_blank')}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Profile
                    </button>
                  )}
                </div>
              )}

              {/* Show response status if already responded */}
              {responded && (
                <div className={`p-2 rounded-lg ${
                  response === 'accept' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <p className="text-sm font-medium">
                    You {response}ed this collaboration request
                    {responseDate && (
                      <span className="ml-2 text-xs opacity-70">
                        on {new Date(responseDate).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Response Modal */}
        {showResponseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {actionType === 'accept' ? 'Accept' : 'Decline'} Collaboration Request
              </h3>
              
              <p className="text-gray-600 mb-4">
                {actionType === 'accept' 
                  ? `You're about to accept ${requesterName}'s collaboration request for "${projectTitle}". They will be added as a collaborator to your project.`
                  : `You're about to decline ${requesterName}'s collaboration request for "${projectTitle}". They will be notified of your decision.`
                }
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Optional message to {requesterName}:
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder={
                    actionType === 'accept'
                      ? "Welcome to the project! Looking forward to working with you..."
                      : "Thank you for your interest. Unfortunately, we're not looking for collaborators at this time..."
                  }
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={confirmResponse}
                  disabled={isResponding}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    actionType === 'accept'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  } ${isResponding ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isResponding 
                    ? `${actionType === 'accept' ? 'Accepting' : 'Declining'}...` 
                    : `${actionType === 'accept' ? 'Accept' : 'Decline'} Request`
                  }
                </button>
                
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setResponseMessage('');
                  }}
                  disabled={isResponding}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for unknown notification types
  return (
    <div className="p-4 border-l-4 border-gray-500 bg-gray-50 rounded-lg">
      <div className="flex items-start">
        <AlertCircle className="w-6 h-6 text-gray-600 mr-3 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">
            Unknown Notification Type
          </h4>
          <p className="text-gray-700">
            {notification.message}
          </p>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(notification.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationNotification;