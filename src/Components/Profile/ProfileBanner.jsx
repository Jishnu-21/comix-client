// src/Components/Profile/ProfileBanner.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const ProfileBanner = ({ name, profilePicture, onEditClick }) => {
  return (
    <div className="relative w-full h-[235px] text-white mb-[100px] overflow-hidden">
      {/* Banner Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-75 -z-10"
        style={{ 
          backgroundImage: `url('https://i0.wp.com/picjumbo.com/wp-content/uploads/space-colors-and-oil-liquid-colorful-abstract-background-free-image.jpeg?w=2210&quality=70')`,
          backgroundPosition: '50% 25%'
        }}
      />
      
      <div className="container mx-auto h-full">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between h-full">
          {/* Left Section - Avatar and Name */}
          <div className="flex flex-col md:flex-row items-center md:items-center gap-6 md:ml-16">
            {/* Avatar Container */}
            <div className="w-[178px] h-[178px] flex justify-center items-center">
              {profilePicture ? (
                <img 
                  src={profilePicture}
                  alt={name}
                  className="w-full h-full object-cover rounded-full border-4 border-white/30 shadow-lg" 
                />
              ) : (
                <FontAwesomeIcon 
                  icon={faUserCircle} 
                  className="w-full h-full text-white/90" 
                />
              )}
            </div>
            
            {/* Name */}
            <div className="flex items-center">
              <h1 className="text-3xl font-semibold text-white drop-shadow-lg">
                {name}
              </h1>
            </div>
          </div>

          {/* Right Section - Edit Button */}
          <div className="md:mr-16 mt-4 md:mt-0">
            <button 
              onClick={onEditClick}
              className="px-6 py-2.5 text-base font-bold bg-white/10 text-white 
                       backdrop-blur-sm border-2 border-white/30 rounded-md
                       hover:bg-black-700 hover:border-white
                       transform transition-all duration-200 ease-out
                       active:scale-95 shadow-lg"
            >
              EDIT PROFILE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;