import React, { useState } from 'react';

import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Share2, 
  Star, 
  TrendingUp, 
  UserPlus,
  Code,
  Database,
  Smartphone,
  Globe
} from 'lucide-react';
import MessageBox from "../Components/MessageBox"
import Navbar from '../Components/Navbar';
import ShareWorkModal from '../Components/ShareWorkModal';
import PostFeed from '../Components/PostFeed';


const home = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const SubmitHandler = () => {
  setIsShareModalOpen(true);
}

// 4. Add function to close modal
const closeShareModal = () => {
  setIsShareModalOpen(false);
}

 const projects = [
    {
      id: 1,
      title: 'AI-Powered Task Manager',
      description: 'Built a smart task management app with ML-based priority suggestions and natural language processing for task creation.',
      author: 'Alex Chen',
      avatar: '👨‍💻',
      role: 'Full-Stack Developer',
      rating: 4.9,
      timeAgo: '2 hours ago',
      tags: ['React', 'Python', 'TensorFlow', 'Node.js'],
      verified: true,
      icon: <Code className="h-12 w-12 text-purple-500" />
    },
    {
      id: 2,
      title: 'Real-time Collaboration IDE',
      description: 'A web-based IDE with real-time collaboration features, syntax highlighting, and integrated version control.',
      author: 'Sarah Johnson',
      avatar: '👩‍💻',
      role: 'Frontend Developer',
      rating: 4.8,
      timeAgo: '5 hours ago',
      tags: ['TypeScript', 'WebSocket', 'Monaco', 'Docker'],
      verified: true,
      icon: <Globe className="h-12 w-12 text-blue-500" />
    },
    {
      id: 3,
      title: 'Blockchain Voting System',
      description: 'Secure, transparent voting platform built on Ethereum with smart contracts and decentralized architecture.',
      author: 'Mike Davis',
      avatar: '🧑‍💻',
      role: 'Blockchain Developer',
      rating: 4.7,
      timeAgo: '1 day ago',
      tags: ['Solidity', 'Web3', 'React', 'IPFS'],
      verified: false,
      icon: <Database className="h-12 w-12 text-green-500" />
    },
    {
      id: 4,
      title: 'Mobile Banking App',
      description: 'Secure mobile banking application with biometric authentication, real-time transactions, and budget tracking.',
      author: 'Lisa Wang',
      avatar: '👩‍💻',
      role: 'Mobile Developer',
      rating: 4.9,
      timeAgo: '2 days ago',
      tags: ['React Native', 'Firebase', 'Stripe', 'Redux'],
      verified: true,
      icon: <Smartphone className="h-12 w-12 text-pink-500" />
    }
  ];

  const trendingSkills = [
    { name: 'React', count: '139k', trend: '+5.2%', color: 'bg-blue-500' },
    { name: 'Python', count: '82k', trend: '+3.8%', color: 'bg-green-500' },
    { name: 'TypeScript', count: '87k', trend: '+7.1%', color: 'bg-blue-600' },
    { name: 'Node.js', count: '89k', trend: '+4.3%', color: 'bg-green-600' },
    { name: 'Docker', count: '74k', trend: '+6.9%', color: 'bg-blue-400' },
    { name: 'AWS', count: '65k', trend: '+8.2%', color: 'bg-orange-500' },
    { name: 'GraphQL', count: '43k', trend: '+12.5%', color: 'bg-pink-500' },
    { name: 'Kubernetes', count: '38k', trend: '+15.3%', color: 'bg-purple-500' }
  ];

  const suggestedConnections = [
    {
      name: 'Emma Davis',
      role: 'Frontend Developer',
      avatar: '👩‍💻',
      skills: ['React', 'Vue.js', 'UI/UX'],
      mutualConnections: 12
    },
    {
      name: 'John Smith',
      role: 'Backend Developer',
      avatar: '👨‍💻',
      skills: ['Node.js', 'Python', 'AWS'],
      mutualConnections: 8
    },
    {
      name: 'Lisa Wang',
      role: 'Full-Stack Developer',
      avatar: '👩‍💻',
      skills: ['TypeScript', 'React', 'MongoDB'],
      mutualConnections: 15
    },
    {
      name: 'David Brown',
      role: 'DevOps Engineer',
      avatar: '🧑‍💻',
      skills: ['Docker', 'Kubernetes', 'CI/CD'],
      mutualConnections: 6
    }
  ];
  
  return (
 
    <div>
          <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      {!isShareModalOpen && <Navbar/>}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Welcome Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👋</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome back!</h2>
                <p className="text-gray-600">Ready to showcase your work?</p>
              </div>

              <button onClick={()=>SubmitHandler()} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                Share Your Work
              </button>
            </div>

            {/* Trending Skills */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Trending Skills</h2>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>

              <div className="space-y-3">
                {trendingSkills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${skill.color} mr-3`}></div>
                      <span className="font-medium text-gray-900">{skill.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{skill.count}</div>
                      <div className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {skill.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 text-purple-600 hover:text-purple-700 font-medium text-sm py-2 hover:bg-purple-50 rounded-lg transition-colors duration-200">
                View All Skills
              </button>
            </div>
          </div>

          {/* Main Content - Projects Feed */}
          <div className="lg:col-span-2">
            <PostFeed/>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Suggested Connections</h2>

              <div className="space-y-4">
                {suggestedConnections.map((connection, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-lg">{connection.avatar}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{connection.name}</h3>
                        <p className="text-sm text-gray-600">{connection.role}</p>
                        <p className="text-xs text-gray-500">{connection.mutualConnections} mutual connections</p>
                      </div>
                    </div>
                    <button className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors duration-200 flex items-center">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Connect
                    </button>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 text-purple-600 hover:text-purple-700 font-medium text-sm py-2 hover:bg-purple-50 rounded-lg transition-colors duration-200">
                View All Suggestions
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Message Box */}
      {!isShareModalOpen && <MessageBox />}
      {isShareModalOpen && (
  <ShareWorkModal onClose={closeShareModal} />
)}
    
    </div>


    </div>
  );
}

export default home;