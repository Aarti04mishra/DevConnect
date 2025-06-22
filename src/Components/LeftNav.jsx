import React from 'react'
import { Search, Bell, User, Menu, Code, MessageCircle, Users, Settings, LogOut, X } from 'lucide-react';

const LeftNav = ({ isOpen, onClose }) => {
    
  return (
  <>
  {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`
        scrollbar-hide 
        fixed lg:static top-0 left-0 
        h-screen w-80 lg:w-[400px] 
        p-5 bg-[#F9FAFB] 
        transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        {/* Close button for mobile */}
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 left-4 p-2 hover:bg-gray-200 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className='font-bold text-xl'>Welcome Back!👋</h2>
        <h4 className='mt-3 text-gray-600'>You have 10 tasks pending and 3 active projects</h4>
        
        <div className='flex sm:flex-row  items-center gap-5 mt-8'>
          <div className='h-[150px] w-[150px] bg-indigo-200 text-indigo-800 rounded-xl p-4 shadow-md'>
            <i className="ri-trophy-line text-6xl font-light"></i>
            <p className="text-2xl font-semibold">15</p>
            <p className="text-sm">Completed</p>
          </div>
          <div className='h-[150px] w-[150px] bg-blue-200 text-blue-800 rounded-xl p-4 shadow-md'>
            <i className="ri-group-line text-6xl font-light"></i>
            <p className="text-2xl font-semibold">8</p>
            <p className="text-sm">Connections</p>
          </div>
        </div>

        <h3 className='mt-8 font-semibold text-xl'>
          <i className="ri-timer-2-line"></i> Today's Tasks
        </h3>

        <div className='mt-3 space-y-3'>
          <div className='w-full rounded-xl border border-gray-300 p-4 flex justify-between bg-white hover:shadow-md transition-shadow'>
            <div>
              <h3 className='text-base font-semibold'>Fix authentication bug</h3>
              <h5 className='text-gray-400 text-sm'>09:30AM E-commerce</h5>
            </div>
            <div className='h-3 w-3 bg-red-600 rounded-full mt-1'></div>
          </div>
          
          <div className='w-full rounded-xl border border-gray-300 p-4 flex justify-between bg-white hover:shadow-md transition-shadow'>
            <div>
              <h3 className='text-base font-semibold'>Design user Dashboard</h3>
              <h5 className='text-gray-400 text-sm'>10:30AM Task Manager</h5>
            </div>
            <div className='h-3 w-3 bg-yellow-500 rounded-full mt-1'></div>
          </div>
          
          <div className='w-full rounded-xl border border-gray-300 p-4 flex justify-between bg-white hover:shadow-md transition-shadow'>
            <div>
              <h3 className='text-base font-semibold'>Team standup meeting</h3>
              <h5 className='text-gray-400 text-sm'>12:00PM AI Bot</h5>
            </div>
            <div className='h-3 w-3 bg-green-500 rounded-full mt-1'></div>
          </div>
        </div>
      </div>
  </>
  )
}

export default LeftNav
