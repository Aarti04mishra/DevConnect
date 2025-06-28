import React from 'react';
import { Filter, Plus, Share2, Star } from 'lucide-react';

const ProjectsSection = () => {
  const projects = [
    {
      id: 1,
      title: 'AI-Powered Task Manager',
      description: 'Built a smart task management app with ML-based priority suggestions and natural language processing for task creation.',
      author: 'Alex Chen',
      avatar: '👨‍💻',
      rating: 4.9,
      timeAgo: '2 hours ago',
      tags: ['React', 'Python', 'TensorFlow', 'Node.js'],
      verified: true
    },
    {
      id: 2,
      title: 'Real-time Collaboration IDE',
      description: 'A web-based IDE with real-time collaboration features, syntax highlighting, and integrated version control.',
      author: 'Sarah Johnson',
      avatar: '👩‍💻',
      rating: 4.8,
      timeAgo: '5 hours ago',
      tags: ['TypeScript', 'WebSocket', 'Monaco', 'Docker'],
      verified: true
    },
    {
      id: 3,
      title: 'Blockchain Voting System',
      description: 'Secure, transparent voting platform built on Ethereum with smart contracts and decentralized architecture.',
      author: 'Mike Davis',
      avatar: '🧑‍💻',
      rating: 4.7,
      timeAgo: '1 day ago',
      tags: ['Solidity', 'Web3', 'React', 'IPFS'],
      verified: false
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Latest Projects</h2>
          <p className="text-gray-600 text-sm mt-1">See what developers are building</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
            <Plus className="h-4 w-4 mr-2" />
            Share Project
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg">{project.avatar}</span>
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-900 mr-2">{project.author}</h3>
                    {project.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Full-Stack Developer</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                {project.rating}
                <span className="mx-2">•</span>
                {project.timeAgo}
                <button className="ml-3 p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{project.description}</p>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;