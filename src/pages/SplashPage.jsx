import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import basketball from '../assets/cinematic_basketball.png';
import cricket from '../assets/cinematic_cricket_bat.png';
import football from '../assets/cinematic_football.png';
import tennis from '../assets/cinematic_tennis_racket.png';
import volleyball from '../assets/cinematic_volleyball.png';
import baseball from '../assets/cinematic_baseball.png';
import badminton from '../assets/cinematic_badminton.png';
import golf from '../assets/cinematic_golf.png';
import boxing from '../assets/cinematic_boxing_glove.png';
import tabletennis from '../assets/cinematic_table_tennis.png';
import americanFb from '../assets/cinematic_american_football.png';
import hockey from '../assets/cinematic_hockey_stick.png';

const Counter = ({ target, label, delay, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const duration = 2000; 
    const incrementTime = 30;
    const step = Math.max(1, Math.ceil(target / (duration / incrementTime)));
    
    const timeoutId = setTimeout(() => {
      const int = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(int);
        }
        setCount(current);
      }, incrementTime);
      return () => clearInterval(int);
    }, delay * 1000);

    return () => clearTimeout(timeoutId);
  }, [target, delay]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, type: "spring" }}
      className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
    >
       <span className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
         {count.toLocaleString()}{suffix}
       </span>
       <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">{label}</span>
    </motion.div>
  );
};

export default function SplashPage() {
  const sports = [
    { src: basketball, alt: "Basketball", delay: 0.1, x: "-35vw", y: "-35vh", scale: 0.8, rotate: [0, 15, 0], blur: "none", zIndex: 10 },
    { src: cricket, alt: "Cricket", delay: 0.7, x: "-45vw", y: "0vh", scale: 1.0, rotate: [0, -10, 0], blur: "none", zIndex: 10 },
    { src: football, alt: "Football", delay: 0.3, x: "-38vw", y: "35vh", scale: 0.85, rotate: [0, -20, 0], blur: "none", zIndex: 10 },
    { src: tennis, alt: "Tennis", delay: 0.5, x: "35vw", y: "-32vh", scale: 1.0, rotate: [0, 8, 0], blur: "none", zIndex: 10 },
    { src: volleyball, alt: "Volleyball", delay: 0.9, x: "42vw", y: "5vh", scale: 0.9, rotate: [0, -15, 0], blur: "none", zIndex: 10 },
    { src: baseball, alt: "Baseball", delay: 1.1, x: "36vw", y: "35vh", scale: 0.95, rotate: [0, 12, 0], blur: "none", zIndex: 10 },
    { src: badminton, alt: "Badminton", delay: 0.4, x: "-12vw", y: "-40vh", scale: 0.75, rotate: [0, -25, 0], blur: "none", zIndex: 10 },
    { src: golf, alt: "Golf", delay: 1.0, x: "-15vw", y: "42vh", scale: 0.9, rotate: [0, 18, 0], blur: "none", zIndex: 10 },
    { src: boxing, alt: "Boxing", delay: 0.6, x: "12vw", y: "-42vh", scale: 0.85, rotate: [0, -10, 0], blur: "none", zIndex: 10 },
    { src: tabletennis, alt: "Table Tennis", delay: 0.8, x: "15vw", y: "45vh", scale: 0.8, rotate: [0, 20, 0], blur: "none", zIndex: 10 },
    { src: americanFb, alt: "American Football", delay: 1.2, x: "-22vw", y: "15vh", scale: 0.7, rotate: [0, -15, 0], blur: "none", zIndex: 5 },
    { src: hockey, alt: "Hockey", delay: 1.4, x: "22vw", y: "-10vh", scale: 0.8, rotate: [0, 15, 0], blur: "none", zIndex: 5 },
    // Distant/Blurred Background particles to fill space deeply
    { src: basketball, alt: "Background 1", delay: 0.2, x: "0vw", y: "-45vh", scale: 0.5, rotate: [0, 5, 0], blur: "2px", opacity: 0.4, zIndex: 1 },
    { src: baseball, alt: "Background 2", delay: 0.8, x: "0vw", y: "45vh", scale: 0.5, rotate: [0, -5, 0], blur: "2px", opacity: 0.4, zIndex: 1 },
    { src: tennis, alt: "Background 3", delay: 1.5, x: "-48vw", y: "-20vh", scale: 0.4, rotate: [0, 10, 0], blur: "3px", opacity: 0.3, zIndex: 1 },
    { src: volleyball, alt: "Background 4", delay: 1.3, x: "48vw", y: "25vh", scale: 0.45, rotate: [0, -10, 0], blur: "3px", opacity: 0.3, zIndex: 1 },
    { src: football, alt: "Background 5", delay: 0.7, x: "25vw", y: "5vh", scale: 0.3, rotate: [0, -8, 0], blur: "4px", opacity: 0.2, zIndex: 1 },
    { src: badminton, alt: "Background 6", delay: 1.1, x: "-25vw", y: "-5vh", scale: 0.35, rotate: [0, 12, 0], blur: "4px", opacity: 0.2, zIndex: 1 }
  ];

  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [stats, setStats] = useState({ users: 0, products: 0, brands: 0, satisfaction: 0 });

  const loadingMessages = [
    "Initializing physics engine...",
    "Parsing product catalog...",
    "Authenticating active users...",
    "System Ready."
  ];

  // Fetch real database aggregated stats on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/stats')
      .then(res => res.json())
      .then(data => {
        if(data.users !== undefined) {
          setStats(data);
        }
      })
      .catch(err => console.error("Failed to fetch live stats:", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
       setProgress(p => {
         if (p >= 100) {
           clearInterval(interval);
           setReady(true);
           return 100;
         }
         return p + 1;
       });
    }, 35);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 25) setLoadingStep(0);
    else if (progress < 65) setLoadingStep(1);
    else if (progress < 95) setLoadingStep(2);
    else setLoadingStep(3);
  }, [progress]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center text-center bg-black">
      
      {/* Deep cinematic background glow */}
      <div className="absolute inset-0 bg-[#050510] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0f172a] via-black to-black z-0"></div>

      {/* Pop up & Continuous Parallax Floating Layer */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden">
        {sports.map((sport, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0, x: sport.x, y: sport.y }}
            animate={{ 
              opacity: sport.opacity || 0.8, 
              scale: sport.scale, 
              x: sport.x, 
              y: sport.y,
            }}
            transition={{ duration: 1.5, delay: sport.delay, ease: "easeOut" }}
            className={`absolute mix-blend-screen pointer-events-auto cursor-pointer z-${sport.zIndex} ${sport.blur !== "none" ? `blur-[${sport.blur}]` : ''}`}
            style={{ 
              width: "30vw", 
              height: "30vh", 
              maxWidth: "350px", 
              maxHeight: "350px",
              filter: sport.blur !== "none" ? `blur(${sport.blur})` : 'none'
            }}
          >
            <motion.img
              src={sport.src}
              alt={sport.alt}
              animate={{
                y: [0, -35, 0],
                rotate: sport.rotate
              }}
              whileHover={{
                scale: 1.3,
                rotate: 0,
                filter: "brightness(1.5)",
                transition: { duration: 0.3 }
              }}
              transition={{
                duration: 6 + index * 0.4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/50 z-20 pointer-events-none"></div>
      
      <div className="relative z-30 px-4 w-full max-w-6xl mx-auto flex flex-col items-center">
        
        <motion.div 
          className="mb-10 w-full flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
           <div className="flex items-center gap-3 text-cyan-400 font-mono text-sm tracking-widest uppercase bg-cyan-900/20 px-6 py-2 rounded-full border border-cyan-500/30">
              {ready ? <FaArrowRight className="animate-pulse" /> : <FaSpinner className="animate-spin" />}
              {loadingMessages[loadingStep]} {progress}%
           </div>
           
           <div className="w-64 h-1 bg-gray-800 rounded-full mt-4 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
           </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight drop-shadow-2xl uppercase italic"
        >
          Dominate <br/> The Game
        </motion.h1>
        
        {/* Animated Pop-Up Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-8 mb-12">
            <Counter target={stats.users} label="Active Users" delay={0.8} />
            <Counter target={stats.products} label="Gear Products" delay={1.2} />
            <Counter target={stats.brands} label="Premium Items" delay={1.6} suffix="+" />
            <Counter target={stats.satisfaction} label="Satisfaction" delay={2.0} suffix="%" />
        </div>

        <AnimatePresence>
          {ready && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            >
              <Link
                to="/home"
                className="group relative px-12 py-5 bg-white text-black font-black text-xl md:text-2xl rounded-full overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:shadow-[0_0_80px_rgba(255,255,255,0.8)] transition-all duration-300 transform active:scale-95 flex items-center justify-center"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                <span className="relative z-10 flex items-center gap-4 tracking-wide">
                  Enter Catalog <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300 text-2xl" />
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
