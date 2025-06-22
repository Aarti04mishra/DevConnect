import React, { useState } from 'react';
import { Search, Bell, User, Menu, Code, MessageCircle, Users, Settings, LogOut, X } from 'lucide-react';
import Navbar from '../Components/Navbar'
import RightNav from '../Components/RightNav'
import LeftNav from '../Components/LeftNav'


const ActiveProjects = () => {
  const [isRightNavOpen, setIsRightNavOpen] = useState(false);
  return (
    <div className='h-screen w-full flex flex-col overflow-hidden'>
      <Navbar />
      <div className='flex flex-1 min-h-0'>
        <LeftNav />
        <RightNav 
          isOpen={isRightNavOpen} 
          onClose={() => setIsRightNavOpen(false)}
        />
        
        {/* Mobile toggle button for RightNav */}
        <button
          onClick={() => setIsRightNavOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg z-30 hover:bg-indigo-700 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}

export default ActiveProjects
