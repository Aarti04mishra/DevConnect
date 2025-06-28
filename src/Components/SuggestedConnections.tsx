import React from 'react';
import { UserPlus } from 'lucide-react';

const SuggestedConnections = () => {
  const connections = [
    {
      name: 'Emma Davis',
      role: 'Frontend Dev',
      avatar: '👩‍💻',
      skills: ['React', 'Vue.js', 'UI/UX'],
      mutualConnections: 12
    },
    {
      name: 'John Smith',
      role: 'Backend Dev',
      avatar: '👨‍💻',
      skills: ['Node.js', 'Python', 'AWS'],
      mutualConnections: 8
    },
    {
      name: 'Lisa Wang',
      role: 'Full-Stack Dev',
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Suggested Connections</h2>

      <div className="space-y-4">
        {connections.map((connection, index) => (
          <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
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
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center">
              <UserPlus className="h-4 w-4 mr-1" />
              Connect
            </button>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-purple-600 hover:text-purple-700 font-medium text-sm py-2 hover:bg-purple-50 rounded-lg transition-colors">
        View All Suggestions
      </button>
    </div>
  );
};

export default SuggestedConnections;