import React, { useState, useEffect } from 'react';

import projectService from '../Services/projectService';


const ShareWorkModal = ({ onClose }) => {
   const [collaborators, setCollaborators] = useState([]);
const [collaboratorInput, setCollaboratorInput] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [showSearchResults, setShowSearchResults] = useState(false);
const [isSearching, setIsSearching] = useState(false);
 
  const [techStackArray, setTechStackArray] = useState(['React', 'Node.js', 'MongoDB']);
  const [techStackInput, setTechStackInput] = useState('');
 const [selectedProjectTypes, setSelectedProjectTypes] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubUrl: '',
    liveUrl: ''
  });

 const dummyUsers = [
  { _id: 'user1', fullname: 'John Doe', email: 'john.doe@email.com', profile: { avatar: 'https://via.placeholder.com/40' } },
  { _id: 'user2', fullname: 'Jane Smith', email: 'jane.smith@email.com', profile: { avatar: 'https://via.placeholder.com/40' } },
  { _id: 'user3', fullname: 'Jack Wilson', email: 'jack.wilson@email.com', profile: { avatar: 'https://via.placeholder.com/40' } },
  { _id: 'user4', fullname: 'Jessica Brown', email: 'jessica.brown@email.com', profile: { avatar: 'https://via.placeholder.com/40' } },
  { _id: 'user5', fullname: 'Mike Johnson', email: 'mike.johnson@email.com', profile: { avatar: 'https://via.placeholder.com/40' } },
  { _id: 'user6', fullname: 'Sarah Davis', email: 'sarah.davis@email.com', profile: { avatar: 'https://via.placeholder.com/40' } },
  { _id: 'user7', fullname: 'James Miller', email: 'james.miller@email.com', profile: { avatar: 'https://via.placeholder.com/40' } },
  { _id: 'user8', fullname: 'Jennifer Garcia', email: 'jennifer.garcia@email.com', profile: { avatar: 'https://via.placeholder.com/40' } },
  { _id: 'user9', fullname: 'Robert Taylor', email: 'robert.taylor@email.com', profile: { avatar: 'https://via.placeholder.com/40' } },
  { _id: 'user10', fullname: 'Julia Anderson', email: 'julia.anderson@email.com', profile: { avatar: 'https://via.placeholder.com/40' } }
];

const handleCollaboratorSearch = (e) => {
  const value = e.target.value;
  setCollaboratorInput(value);
  
  if (value.trim()) {
    setIsSearching(true);
    setShowSearchResults(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Filter dummy users based on search input
      const filtered = dummyUsers.filter(user => 
        user.fullname.toLowerCase().includes(value.toLowerCase()) &&
        !collaborators.some(collab => collab.id === user._id)
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);
  } else {
    setSearchResults([]);
    setShowSearchResults(false);
    setIsSearching(false);
  }
};

const addCollaborator = (user) => {
  // Adapt user object to match expected format
  const collaborator = {
    id: user._id,
    name: user.fullname,
    username: user.email.split('@')[0], // Generate username from email
    avatar: user.profile?.avatar || 'https://via.placeholder.com/40'
  };
  
  setCollaborators(prev => [...prev, collaborator]);
  setCollaboratorInput('');
  setSearchResults([]);
  setShowSearchResults(false);
};

const removeCollaborator = (userId) => {
  setCollaborators(prev => prev.filter(collab => collab.id !== userId));
};


const projectData = {
  ...formData,
  techStack: techStackArray,
  projectTypes: selectedProjectTypes,
  collaborators: collaborators // Add this line
};

  const closeDialog = () => {
  onClose();
};
 

  const projectTypeOptions = [
    {
      value: 'completed',
      title: 'Fully Completed',
      description: 'Project is 100% complete and ready for production'
    },
    {
      value: 'active',
      title: 'Active Project',
      description: 'Currently working on this project'
    },
    {
      value: 'collaborative',
      title: 'Collaborative Project',
      description: 'Open for collaboration with other developers'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTechStackKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = techStackInput.trim();
      
      if (value && !techStackArray.includes(value)) {
        setTechStackArray(prev => [...prev, value]);
        setTechStackInput('');
      }
    }
  };

  const removeTechStack = (tech) => {
    setTechStackArray(prev => prev.filter(t => t !== tech));
  };

  const toggleProjectType = (type) => {
  setSelectedProjectTypes(type);
};

const handleShareProject = async () => {
  if (!formData.title || !formData.description) {
    alert('Please fill in the required fields (Title and Description)');
    return;
  }

  if (!selectedProjectTypes) {
    alert('Please select a project status');
    return;
  }

  setIsSharing(true);

  try {
    const projectData = {
      title: formData.title,
      description: formData.description,
      githubUrl: formData.githubUrl,
      liveUrl: formData.liveUrl,
      techStack: techStackArray,
      projectTypes: selectedProjectTypes,
      collaborators: collaborators
    };

    const response = await projectService.createProject(projectData);

    if (response.success) {
      alert('Project shared successfully! 🎉');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        githubUrl: '',
        liveUrl: ''
      });
      setTechStackArray([]);
      setSelectedProjectTypes('');
      setCollaborators([]);
      
      onClose(); // Close the modal
    } else {
      throw new Error(response.message || 'Failed to create project');
    }

  } catch (error) {
    console.error('Error creating project:', error);
    
    // Show user-friendly error message
    const errorMessage = error.message || 
      (error.response?.data?.message) || 
      'Failed to share project. Please try again.';
    
    alert(`Error: ${errorMessage}`);
  } finally {
    setIsSharing(false);
  }
};

  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center p-5 font-sans">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      
      {/* Dialog */}
      <div className="bg-white rounded-3xl p-10 w-full max-w-4xl max-h-screen overflow-y-auto shadow-2xl relative z-10 animate-fade-in scrollbar-hide">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-5 border-b-2 border-gray-100">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
            Share Your Work
          </h2>
          <button 
            onClick={closeDialog}
            className="text-2xl text-gray-600 hover:bg-gray-100 hover:text-gray-800 p-2 rounded-full transition-all duration-200"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Project Title */}
          <div>
            <label className="block font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide">
              Project Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              placeholder="Enter your project title..."
              required
            />
          </div>

          {/* Project Description */}
          <div>
            <label className="block font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide">
              Project Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 resize-vertical min-h-32"
              placeholder="Describe your project, its purpose, and key features..."
              required
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide">
              Tech Stack Used
            </label>
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              onKeyPress={handleTechStackKeyPress}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              placeholder="Add technology (press Enter to add)"
            />
            <div className="flex flex-wrap gap-3 mt-3">
              {techStackArray.map((tech, index) => (
                <div key={index} className="bg-gradient-to-r from-indigo-400 to-purple-600 text-white px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  {tech}
                  <span 
                    onClick={() => removeTechStack(tech)}
                    className="cursor-pointer bg-white bg-opacity-30 rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-opacity-50 transition-all"
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
  <label className="block font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide">
    Project Collaborators
  </label>
  <div className="relative">
    <input
      type="text"
      value={collaboratorInput}
      onChange={handleCollaboratorSearch}
      className="w-full p-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
      placeholder="Search for collaborators..."
    />
    
    {/* Search Results Dropdown */}
   {showSearchResults && (
  <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
    {isSearching ? (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-500">Searching users...</div>
      </div>
    ) : searchResults.length > 0 ? (
      searchResults.map((user) => (
        <div
          key={user._id}
          onClick={() => addCollaborator(user)}
          className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <img 
            src={user.profile?.avatar || 'https://via.placeholder.com/40'} 
            alt={user.fullname}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="font-medium text-gray-800">{user.fullname}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ))
    ) : (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-500">No users found</div>
      </div>
    )}
  </div>
)}
  </div>

   <div className="flex flex-wrap gap-3 mt-3">
    {collaborators.map((collaborator) => (
      <div key={collaborator.id} className="bg-gradient-to-r from-indigo-400 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
        <img 
          src={collaborator.avatar} 
          alt={collaborator.name}
          className="w-5 h-5 rounded-full"
        />
        {collaborator.name}
        <span 
          onClick={() => removeCollaborator(collaborator.id)}
          className="cursor-pointer bg-white bg-opacity-30 rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-opacity-50 transition-all"
        >
          ×
        </span>
      </div>
    ))}
  </div>
</div>

          {/* Project Status */}
          <div>
            <label className="block font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide">
              Project Status
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
              {projectTypeOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => toggleProjectType(option.value)}
                  className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedProjectTypes.includes(option.value)
                      ? 'border-indigo-400 bg-gradient-to-r from-indigo-50 to-purple-50'
                      : 'border-gray-200 bg-gray-50 hover:border-indigo-400 hover:bg-white'
                  }`}
                >
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-300 ${
                    selectedProjectTypes.includes(option.value)
                      ? 'bg-indigo-400 border-indigo-400 text-white'
                      : 'border-gray-200'
                  }`}>
                    {selectedProjectTypes.includes(option.value) && '✓'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{option.title}</div>
                    <div className="text-xs text-gray-600">{option.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide">
                GitHub Repository URL
              </label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                placeholder="https://github.com/username/repository"
              />
            </div>
            
            <div>
              <label className="block font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide">
                Live Demo URL
              </label>
              <input
                type="url"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                placeholder="https://your-project-demo.com"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-end mt-10 pt-8 border-t-2 border-gray-100">
          <button
            type="button"
            onClick={closeDialog}
            className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wide hover:bg-gray-200 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleShareProject}
            disabled={isSharing}
            className="px-8 py-4 bg-gradient-to-r from-indigo-400 to-purple-600 text-white rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wide hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-200 relative overflow-hidden disabled:opacity-50"
          >
            <span className="relative z-10">
              {isSharing ? 'Sharing...' : 'Share Project'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-transparent opacity-0 hover:opacity-20 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ShareWorkModal;