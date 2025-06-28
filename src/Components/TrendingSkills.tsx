import React from 'react';
import { TrendingUp } from 'lucide-react';

const TrendingSkills = () => {
  const skills = [
    { name: 'React', count: '139k', trend: '+5.2%', color: 'bg-blue-500' },
    { name: 'Python', count: '82k', trend: '+3.8%', color: 'bg-green-500' },
    { name: 'TypeScript', count: '87k', trend: '+7.1%', color: 'bg-blue-600' },
    { name: 'Node.js', count: '89k', trend: '+4.3%', color: 'bg-green-600' },
    { name: 'Docker', count: '74k', trend: '+6.9%', color: 'bg-blue-400' },
    { name: 'AWS', count: '65k', trend: '+8.2%', color: 'bg-orange-500' },
    { name: 'GraphQL', count: '43k', trend: '+12.5%', color: 'bg-pink-500' },
    { name: 'Kubernetes', count: '38k', trend: '+15.3%', color: 'bg-purple-500' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Trending Skills</h2>
        <TrendingUp className="h-5 w-5 text-green-500" />
      </div>

      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
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

      <button className="w-full mt-4 text-purple-600 hover:text-purple-700 font-medium text-sm py-2 hover:bg-purple-50 rounded-lg transition-colors">
        View All Skills
      </button>
    </div>
  );
};

export default TrendingSkills;