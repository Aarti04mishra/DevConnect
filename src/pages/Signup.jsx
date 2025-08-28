import React, { useState } from 'react';
import { User, Mail, Lock, Code, Users, Rocket, BookOpen, Github, Linkedin, ArrowRight, Eye, EyeOff, CheckCircle, Building, GraduationCap, Star } from 'lucide-react';
import axios from 'axios';
import { signupUser } from '../Services/AuthServices';
import { Link, Navigate, useNavigate } from 'react-router-dom';

// const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


const SignupPage = () => {
   const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    skillLevel: '',
    interests: [],
    github: '',
    linkedin: '',
    bio: ''
  });
  const [errors, setErrors] = useState({});

  const submitHandler=()=>{
   navigate('/login')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (step === 2) {
      if (!formData.university) {
        newErrors.university = 'University/Institution is required';
      }
      if (!formData.skillLevel) {
        newErrors.skillLevel = 'Skill level is required';
      }
      if (formData.interests.length === 0) {
        newErrors.interests = 'Please select at least one interest';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

 const handleSubmit = async () => {
  if (validateStep(currentStep)) {
    try {
      setIsLoading(true);
      setApiError(''); 
      
      const signupData = {
        fullname: formData.fullName,  
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,  
        university: formData.university,
        skillLevel: formData.skillLevel,
        interests: formData.interests,
        github: formData.github || null,
        linkedin: formData.linkedin || null,
        bio: formData.bio || null
      };

      const result = await signupUser(signupData);
      
     navigate('/home')
      
    } catch (error) {
      console.error('Signup error:', error);
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  }
};

  const techInterests = [
    'Web Development', 'Mobile Apps', 'AI/ML', 'Data Science',
    'DevOps', 'Cybersecurity', 'Game Development', 'Blockchain',
    'Cloud Computing', 'IoT', 'AR/VR', 'Robotics'
  ];

  const skillLevels = [
    { value: 'beginner', label: 'Beginner', desc: 'Just starting my coding journey' },
    { value: 'intermediate', label: 'Intermediate', desc: 'Have some experience with projects' },
    { value: 'advanced', label: 'Advanced', desc: 'Experienced with complex projects' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Code className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                DevConnect
              </h1>
            </div>
            <div className="text-gray-600 text-sm">
              Already have an account? 
              <button onClick={() => submitHandler()} className="text-blue-600 hover:text-blue-700 ml-1 font-semibold transition-colors duration-300">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="font-semibold">{step}</span>
                  )}
                </div>
                {step < 3 && (
                  <div className={`h-1 w-16 rounded transition-all duration-300 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-32">
            <span className={`text-sm transition-colors duration-300 ${currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
              Basic Info
            </span>
            <span className={`text-sm transition-colors duration-300 ${currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
              Profile
            </span>
            <span className={`text-sm transition-colors duration-300 ${currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
              Finish
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Your Account</h2>
              <p className="text-lg text-gray-600 mb-12">Let's start with the basics</p>
              
              <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="john@university.edu"
                      />
                    </div>
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <button
                  onClick={nextStep}
                  className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center group"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Profile Information */}
          {currentStep === 2 && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Build Your Profile</h2>
              <p className="text-lg text-gray-600 mb-12">Tell us about your coding journey</p>
              
              <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
                {/* University */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University / Institution
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Stanford University, MIT, etc."
                    />
                  </div>
                  {errors.university && <p className="text-red-600 text-sm mt-1">{errors.university}</p>}
                </div>

                {/* Skill Level */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    What's your coding experience?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {skillLevels.map((skill) => (
                      <button
                        key={skill.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, skillLevel: skill.value }))}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                          formData.skillLevel === skill.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <Star className={`w-4 h-4 mr-2 ${
                            formData.skillLevel === skill.value ? 'text-blue-500' : 'text-gray-400'
                          }`} />
                          <h3 className={`font-semibold ${
                            formData.skillLevel === skill.value ? 'text-blue-700' : 'text-gray-900'
                          }`}>
                            {skill.label}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm">{skill.desc}</p>
                      </button>
                    ))}
                  </div>
                  {errors.skillLevel && <p className="text-red-600 text-sm mt-2">{errors.skillLevel}</p>}
                </div>

                {/* Tech Interests */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    What technologies interest you? (Select multiple)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {techInterests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                          formData.interests.includes(interest)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  {errors.interests && <p className="text-red-600 text-sm mt-2">{errors.interests}</p>}
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    onClick={prevStep}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300 border border-gray-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center group"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Info & Finish */}
          {currentStep === 3 && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Almost Done!</h2>
              <p className="text-lg text-gray-600 mb-12">Add some optional details to make your profile shine</p>
              
              <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
                {/* GitHub */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Profile (Optional)
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile (Optional)
                  </label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="https://linkedin.com/in/yourusername"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about yourself (Optional)
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Share your coding journey, interests, or what you're looking to build..."
                  ></textarea>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your DevConnect Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div>
                      <span className="text-gray-500 text-sm">Name:</span>
                      <p className="text-gray-900 font-medium">{formData.fullName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">University:</span>
                      <p className="text-gray-900 font-medium">{formData.university}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Skill Level:</span>
                      <p className="text-gray-900 font-medium capitalize">{formData.skillLevel}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Interests:</span>
                      <p className="text-gray-900 font-medium">{formData.interests.length} selected</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    onClick={prevStep}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300 border border-gray-300"
                  >
                    Back
                  </button>
                  {apiError && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
    <p className="text-red-600 text-sm">{apiError}</p>
  </div>
)}

                 <button
  onClick={handleSubmit}
  disabled={isLoading}
  className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center group ${
    isLoading ? 'opacity-50 cursor-not-allowed' : ''
  }`}
>
  {isLoading ? (
    <>
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
      Creating Account...
    </>
  ) : (
    <>
      Create Account
      <CheckCircle className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
    </>
  )}
                 </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;