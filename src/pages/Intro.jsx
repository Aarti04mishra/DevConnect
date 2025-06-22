import React, { useState } from 'react';
import { User, Mail, Lock, Code, Users, Rocket, BookOpen, Github, Linkedin, ArrowRight, Eye, EyeOff, Star, Trophy, Zap } from 'lucide-react';

const Intro = () => {
  const [currentView, setCurrentView] = useState('intro');

  // Auth Page View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">DevConnect.</h1>
            <div className="flex items-center space-x-4">
             
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            {/* Main Branding */}
            <div className="mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
                  DevConnect
                </h1>
              </div>
              <p className="text-xl lg:text-2xl text-gray-600 mb-6 font-medium">
                Where Developers Connect, Collaborate & Create
              </p>
              <p className="text-gray-500 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                Join a vibrant community of student developers, share projects, find collaborators, 
                and build the future together. From beginners to experts, everyone has something to contribute.
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
                <div className="text-gray-600">Active Developers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
                <div className="text-gray-600">Projects Launched</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">1,200+</div>
                <div className="text-gray-600">Successful Collaborations</div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
              <p className="text-gray-600 text-lg mb-6">
                Join thousands of student developers who are already building amazing projects together.
              </p>
              <button
                onClick={() => setCurrentView('auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center mx-auto group"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <div className="flex items-center justify-center mt-6 space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <Github className="w-4 h-4 mr-2" />
                  <span>Open Source</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>10k+ Members</span>
                </div>
                <div className="flex items-center">
                  <Rocket className="w-4 h-4 mr-2" />
                  <span>500+ Projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose DevConnect?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides everything you need to connect with fellow developers and bring your ideas to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center hover:shadow-md transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Find Team Members</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with developers who share your passion and complement your skills. 
                Build diverse teams for better project outcomes.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center hover:shadow-md transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Launch Projects</h3>
              <p className="text-gray-600 leading-relaxed">
                Turn your innovative ideas into reality with the perfect team by your side. 
                From concept to deployment, we've got you covered.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center hover:shadow-md transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Learn & Grow</h3>
              <p className="text-gray-600 leading-relaxed">
                Expand your skills through collaboration and mentorship from peers. 
                Share knowledge and grow together as a community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
            <p className="text-lg text-gray-600">
              Hear from developers who have found success through DevConnect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  JS
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">John Smith</h4>
                  <p className="text-sm text-gray-600">Stanford University</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "DevConnect helped me find the perfect team for my AI project. We launched successfully and learned so much from each other."
              </p>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  AL
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Alice Lee</h4>
                  <p className="text-sm text-gray-600">MIT</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "The platform made it easy to showcase my skills and connect with like-minded developers. I've collaborated on 5 projects so far!"
              </p>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  MR
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Maria Rodriguez</h4>
                  <p className="text-sm text-gray-600">UC Berkeley</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "From a beginner to leading my own projects, DevConnect has been instrumental in my growth as a developer."
              </p>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Highlights */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Achievements</h2>
            <p className="text-lg text-gray-600">
              Recognizing excellence in our developer community.
            </p>
          </div>

          <div className="flex justify-center space-x-8">
            <div className="flex items-center px-6 py-3 bg-white rounded-full border border-gray-200 shadow-sm">
              <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Top Innovation Platform</span>
            </div>
            <div className="flex items-center px-6 py-3 bg-white rounded-full border border-gray-200 shadow-sm">
              <Zap className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Fastest Growing Community</span>
            </div>
            <div className="flex items-center px-6 py-3 bg-white rounded-full border border-gray-200 shadow-sm">
              <Star className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">95% Success Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">DevConnect</h3>
              <p className="text-gray-600 mb-4">
                Empowering student developers to collaborate, learn, and build amazing projects together.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Find Projects</a></li>
                <li><a href="#" className="hover:text-gray-900">Browse Developers</a></li>
                <li><a href="#" className="hover:text-gray-900">Create Profile</a></li>
                <li><a href="#" className="hover:text-gray-900">Join Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact Us</a></li>
                <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2024 DevConnect. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;