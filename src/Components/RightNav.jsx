import React from 'react'
import { Search, Bell, User, Menu, Code, MessageCircle, Users, Settings, LogOut, X } from 'lucide-react';
const RightNav = () => {
  const projects = [
    {
      id: 1,
      name: "E-commerce Platform",
      teamMembers: [
        { id: 1, name: "John Smith", avatar: "JS", color: "from-blue-400 to-blue-600" },
        { id: 2, name: "Sarah Johnson", avatar: "SJ", color: "from-green-400 to-green-600" },
        { id: 3, name: "Mike Chen", avatar: "MC", color: "from-purple-400 to-purple-600" },
        { id: 4, name: "Emma Davis", avatar: "ED", color: "from-pink-400 to-pink-600" },
        { id: 5, name: "Alex Wilson", avatar: "AW", color: "from-indigo-400 to-indigo-600" }
      ],
      progress: 75,
      technologies: [
        { name: "React", color: "bg-blue-100 text-blue-800" },
        { name: "Node.js", color: "bg-green-100 text-green-800" },
        { name: "MongoDB", color: "bg-gray-100 text-gray-800" },
        { name: "Express", color: "bg-yellow-100 text-yellow-800" },
        { name: "TypeScript", color: "bg-indigo-100 text-indigo-800" }
      ]
    },
    {
      id: 2,
      name: "Mobile Banking App",
      teamMembers: [
        { id: 1, name: "Alice Brown", avatar: "AB", color: "from-red-400 to-red-600" },
        { id: 2, name: "Bob Wilson", avatar: "BW", color: "from-yellow-400 to-yellow-600" },
        { id: 3, name: "Carol White", avatar: "CW", color: "from-teal-400 to-teal-600" }
      ],
      progress: 45,
      technologies: [
        { name: "React Native", color: "bg-blue-100 text-blue-800" },
        { name: "Firebase", color: "bg-orange-100 text-orange-800" },
        { name: "Redux", color: "bg-purple-100 text-purple-800" }
      ]
    },
    {
      id: 3,
      name: "AI Chat Bot",
      teamMembers: [
        { id: 1, name: "David Lee", avatar: "DL", color: "from-cyan-400 to-cyan-600" },
        { id: 2, name: "Eva Garcia", avatar: "EG", color: "from-lime-400 to-lime-600" },
        { id: 3, name: "Frank Miller", avatar: "FM", color: "from-rose-400 to-rose-600" },
        { id: 4, name: "Grace Kim", avatar: "GK", color: "from-violet-400 to-violet-600" }
      ],
      progress: 90,
      technologies: [
        { name: "Python", color: "bg-green-100 text-green-800" },
        { name: "TensorFlow", color: "bg-orange-100 text-orange-800" },
        { name: "FastAPI", color: "bg-teal-100 text-teal-800" },
        { name: "PostgreSQL", color: "bg-blue-100 text-blue-800" }
      ]
    },
    {
      id: 4,
      name: "Social Media Dashboard",
      teamMembers: [
        { id: 1, name: "Helen Tang", avatar: "HT", color: "from-emerald-400 to-emerald-600" },
        { id: 2, name: "Ivan Petrov", avatar: "IP", color: "from-amber-400 to-amber-600" }
      ],
      progress: 30,
      technologies: [
        { name: "Vue.js", color: "bg-green-100 text-green-800" },
        { name: "Laravel", color: "bg-red-100 text-red-800" },
        { name: "MySQL", color: "bg-blue-100 text-blue-800" }
      ]
    },
    {
      id: 5,
      name: "IoT Monitoring System",
      teamMembers: [
        { id: 1, name: "Jack Ryan", avatar: "JR", color: "from-sky-400 to-sky-600" },
        { id: 2, name: "Kate Foster", avatar: "KF", color: "from-fuchsia-400 to-fuchsia-600" },
        { id: 3, name: "Liam Moore", avatar: "LM", color: "from-slate-400 to-slate-600" }
      ],
      progress: 60,
      technologies: [
        { name: "Angular", color: "bg-red-100 text-red-800" },
        { name: "Spring Boot", color: "bg-green-100 text-green-800" },
        { name: "InfluxDB", color: "bg-purple-100 text-purple-800" },
        { name: "Docker", color: "bg-blue-100 text-blue-800" }
      ]
    }
  ];

  const ProjectCard = ({ project }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 w-full hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          Active
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Team Members ({project.teamMembers.length})
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {project.teamMembers.slice(0, 4).map((member) => (
            <div
              key={member.id}
              className={`h-10 w-10 bg-gradient-to-r ${member.color} rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm`}
              title={member.name}
            >
              {member.avatar}
            </div>
          ))}
          {project.teamMembers.length > 4 && (
            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium border-2 border-white">
              +{project.teamMembers.length - 4}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Technologies</h4>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className={`px-3 py-1 ${tech.color} text-xs font-medium rounded-full`}
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
  return (
   <>
    <div className='flex-1 p-4 md:p-6 lg:p-10 min-h-0'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold'>Active Projects</h1>
          <h2 className='text-gray-500 text-base md:text-lg lg:text-xl mt-1'>
            Track progress and collaborate with your teams
          </h2>
        </div>

        <button className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 md:px-5 py-2 md:py-3 rounded-xl flex items-center gap-2 transition-colors duration-200 whitespace-nowrap'>
          <i className="ri-add-line text-lg"></i>
          <span className="text-sm md:text-base">Add Project</span>
        </button>
      </div>

      <div className='overflow-auto max-h-[calc(100vh-200px)] scrollbar-hide '>
        <div className='space-y-4'>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
   </>
  )
}

export default RightNav
