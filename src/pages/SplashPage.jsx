import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

export default function SplashPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center text-center bg-black">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/sports.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      
      <div className="relative z-20 px-4 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
          Dominate The Game
        </h1>
        <p className="text-xl md:text-3xl text-gray-300 mb-12 font-medium max-w-2xl drop-shadow-md">
          Premium verified sports gear and equipment designed to help you reach your peak performance today.
        </p>
        
        <Link
          to="/home"
          className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-xl md:text-2xl rounded-full overflow-hidden shadow-[0_0_40px_rgba(79,70,229,0.7)] hover:shadow-[0_0_60px_rgba(79,70,229,0.9)] hover:-translate-y-1 transition-all duration-300 transform active:scale-95 flex items-center justify-center"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
          <span className="relative z-10 flex items-center gap-4 tracking-wide">
            Start Now Shopping <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300 animate-pulse text-2xl" />
          </span>
        </Link>
      </div>
    </div>
  );
}
