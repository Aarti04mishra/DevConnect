import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Search, MoreVertical, Phone, Video, Info, 
  Paperclip, Smile, ArrowLeft, User, Circle, 
  Check, CheckCheck, Image, File, Code, Link2,
  Plus, Settings, Archive, Star, Trash2
} from 'lucide-react';

const MessagingPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConversationInfo, setShowConversationInfo] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      name: 'Sarah Chen',
      avatar: 'SC',
      lastMessage: 'Sure! I can help you with the ML implementation',
      timestamp: '2:30 PM',
      unreadCount: 2,
      isOnline: true,
      project: 'Smart City Traffic Optimizer',
      role: 'AI/ML Engineer'
    },
    {
      id: 2,
      name: 'Alex Rodriguez',
      avatar: 'AR',
      lastMessage: 'The React components are ready for review',
      timestamp: '1:45 PM',
      unreadCount: 0,
      isOnline: false,
      lastSeen: '30m ago',
      project: 'E-commerce Platform',
      role: 'Frontend Developer'
    },
    {
      id: 3,
      name: 'DevConnect Team',
      avatar: 'DT',
      lastMessage: 'Welcome to DevConnect! Start collaborating...',
      timestamp: 'Yesterday',
      unreadCount: 0,
      isOnline: false,
      isGroup: true,
      project: 'Platform Updates',
      role: 'Official'
    },
    {
      id: 4,
      name: 'Maya Patel',
      avatar: 'MP',
      lastMessage: 'Can you review the database schema?',
      timestamp: 'Yesterday',
      unreadCount: 1,
      isOnline: true,
      project: 'Medical Image Analysis',
      role: 'Backend Developer'
    },
    {
      id: 5,
      name: 'Code Review Group',
      avatar: 'CR',
      lastMessage: 'New PR submitted for review',
      timestamp: '2 days ago',
      unreadCount: 0,
      isOnline: false,
      isGroup: true,
      project: 'Multiple Projects',
      role: 'Review Team'
    }
  ];

  // Mock messages data
  const messageData = {
    1: [
      {
        id: 1,
        senderId: 'other',
        senderName: 'Sarah Chen',
        content: 'Hey! I saw your collaboration request for the traffic optimization project. I\'d love to work together on this!',
        timestamp: '2:15 PM',
        status: 'read',
        type: 'text'
      },
      {
        id: 2,
        senderId: 'me',
        content: 'That\'s amazing! I was looking for someone with ML expertise. Have you worked on computer vision projects before?',
        timestamp: '2:18 PM',
        status: 'read',
        type: 'text'
      },
      {
        id: 3,
        senderId: 'other',
        senderName: 'Sarah Chen',
        content: 'Yes, I have experience with OpenCV and TensorFlow. I actually worked on a similar project during my internship at MIT.',
        timestamp: '2:25 PM',
        status: 'read',
        type: 'text'
      },
      {
        id: 4,
        senderId: 'other',
        senderName: 'Sarah Chen',
        content: 'Here\'s my previous work on traffic analysis',
        timestamp: '2:28 PM',
        status: 'read',
        type: 'file',
        fileName: 'traffic-analysis-report.pdf',
        fileSize: '2.3 MB'
      },
      {
        id: 5,
        senderId: 'me',
        content: 'Perfect! Your experience looks exactly what we need. When can we schedule a call to discuss the project details?',
        timestamp: '2:29 PM',
        status: 'delivered',
        type: 'text'
      },
      {
        id: 6,
        senderId: 'other',
        senderName: 'Sarah Chen',
        content: 'Sure! I can help you with the ML implementation',
        timestamp: '2:30 PM',
        status: 'sent',
        type: 'text'
      }
    ],
    2: [
      {
        id: 1,
        senderId: 'other',
        senderName: 'Alex Rodriguez',
        content: 'The React components are ready for review',
        timestamp: '1:45 PM',
        status: 'read',
        type: 'text'
      }
    ],
    3: [
      {
        id: 1,
        senderId: 'other',
        senderName: 'DevConnect Team',
        content: 'Welcome to DevConnect! Start collaborating with fellow developers and build amazing projects together. 🚀',
        timestamp: 'Yesterday',
        status: 'read',
        type: 'text'
      }
    ],
    4: [
      {
        id: 1,
        senderId: 'other',
        senderName: 'Maya Patel',
        content: 'Can you review the database schema?',
        timestamp: 'Yesterday',
        status: 'delivered',
        type: 'text'
      }
    ],
    5: [
      {
        id: 1,
        senderId: 'other',
        senderName: 'Code Review Group',
        content: 'New PR submitted for review',
        timestamp: '2 days ago',
        status: 'read',
        type: 'text'
      }
    ]
  };

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);
  const messages = messageData[selectedConversation] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real app, this would send the message via API
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMessage = (message) => {
    const isMe = message.senderId === 'me';
    
    return (
      <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isMe 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          {message.type === 'file' ? (
            <div className="flex items-center space-x-2">
              <File className="w-4 h-4" />
              <div>
                <p className="text-sm font-medium">{message.fileName}</p>
                <p className="text-xs opacity-75">{message.fileSize}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm">{message.content}</p>
          )}
          
          <div className={`flex items-center justify-end mt-1 space-x-1 ${
            isMe ? 'text-blue-100' : 'text-gray-500'
          }`}>
            <span className="text-xs">{message.timestamp}</span>
            {isMe && getStatusIcon(message.status)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar - Conversations List */}
      <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-80 bg-white border-r border-gray-200`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedConversation === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative mr-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                  {conversation.avatar}
                </div>
                {conversation.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 truncate mb-1">{conversation.lastMessage}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 truncate">{conversation.project}</span>
                  {conversation.unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] h-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  onClick={() => setSelectedConversation(null)}
                  className="lg:hidden mr-3 p-1 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="relative mr-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    {currentConversation?.avatar}
                  </div>
                  {currentConversation?.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{currentConversation?.name}</h2>
                  <p className="text-sm text-gray-600">
                    {currentConversation?.isOnline ? 'Online now' : currentConversation?.lastSeen || 'Offline'}
                    {currentConversation?.project && ` • ${currentConversation.project}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowConversationInfo(!showConversationInfo)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-end space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              
              <div className="flex-1 min-w-0">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                />
              </div>
              
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-all duration-300"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // No conversation selected state
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to DevConnect Messages</h3>
            <p className="text-gray-600 max-w-sm">
              Select a conversation to start collaborating with fellow developers or create a new message to begin.
            </p>
          </div>
        </div>
      )}

      {/* Conversation Info Sidebar */}
      {showConversationInfo && currentConversation && (
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
              {currentConversation.avatar}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{currentConversation.name}</h3>
            <p className="text-sm text-gray-600">{currentConversation.role}</p>
            <p className="text-xs text-gray-500 mt-1">
              {currentConversation.isOnline ? 'Online now' : currentConversation.lastSeen || 'Offline'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Project</h4>
              <p className="text-sm text-gray-600">{currentConversation.project}</p>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                View Profile
              </button>
              <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                <Star className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center">
                  <Archive className="w-4 h-4 mr-3" />
                  Archive Conversation
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center">
                  <Trash2 className="w-4 h-4 mr-3" />
                  Delete Conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingPage;