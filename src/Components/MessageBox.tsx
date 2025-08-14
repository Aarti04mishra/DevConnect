import React, { useState } from 'react';
import { MessageCircle, X, Send, Minus } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const MessageBox = () => {
   const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Emma Davis',
      avatar: '👩‍💻',
      message: 'Hey! I saw your latest project, really impressive work!',
      time: '2m ago',
      isOwn: false
    },
    {
      id: 2,
      sender: 'You',
      avatar: '👤',
      message: 'Thanks! Would love to collaborate on something similar.',
      time: '1m ago',
      isOwn: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'You',
        avatar: '👤',
        message: newMessage,
        time: 'now',
        isOwn: true
      }]);
      setNewMessage('');
    }
  };

  const SubmitHandler=()=>{
     navigate("/messages")
  }

  return (
    <>
      {/* Chat Button */}
      
        <button
          onClick={() =>SubmitHandler()}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
    

     
    </>
  );
};

export default MessageBox;