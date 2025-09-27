import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaImages, FaGem } from "react-icons/fa";
import Image1 from '../../assets/1.jpg';
import Image2 from '../../assets/2.jpg';
import Image3 from '../../assets/3.jpg';
import Image4 from '../../assets/4.jpg';

const images = [Image1, Image2, Image3, Image4];

function SingleSlider({ sliderIndex }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hovered, setHovered] = useState(false);
  const length = images.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev === length - 1 ? 0 : prev + 1));
    }, 4000); // Slightly faster for more dynamic feel
    return () => clearInterval(interval);
  }, [length]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(current === length - 1 ? 0 : current + 1);
      setIsTransitioning(false);
    }, 400); // Smoother transition
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(current === 0 ? length - 1 : current - 1);
      setIsTransitioning(false);
    }, 400);
  };

  // Staggered entrance delay based on slider index
  const entranceDelay = sliderIndex * 0.3;

  return (
    <div 
      className={`
        relative w-full h-72 md:h-80 lg:h-96 xl:h-[28rem] overflow-hidden rounded-3xl shadow-2xl group bg-gradient-to-br from-white/80 via-transparent to-gray-100/80 
        dark:from-gray-800/80 dark:via-transparent dark:to-gray-900/80 backdrop-blur-md border border-white/20 dark:border-gray-700/50
        transform transition-all duration-1000 ease-out hover:scale-105 hover:shadow-3xl hover:-translate-y-2
        animate-slide-in-up animate-delay-[${entranceDelay}s]
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated Border Glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 animate-border-glow" />

      {/* Image Container with Enhanced Zoom-Slide Transition */}
      <div className="absolute inset-0 flex transition-all duration-700 ease-in-out">
        {images.map((image, index) => {
          const isActive = index === current;
          const transitionClass = isTransitioning 
            ? 'transition-transform duration-400 ease-out' 
            : 'transition-all duration-1000 ease-in-out';
          
          return (
            <div
              key={index}
              className={`
                absolute inset-0 w-full h-full overflow-hidden
                ${transitionClass}
                ${isActive 
                  ? 'opacity-100 scale-100 translate-x-0 blur-none' 
                  : hovered 
                    ? 'opacity-30 scale-110 translate-x-10 blur-sm' 
                    : 'opacity-0 scale-90 translate-x-[-10px] blur-md'
                }
              `}
            >
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className={`
                  w-full h-full object-cover transition-all duration-1000 ease-in-out
                  ${isActive ? 'animate-zoom-pulse' : ''}
                `}
              />
              {/* Image Overlay with Vignette */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          );
        })}
      </div>

      {/* Floating Particles for Attractiveness */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float-particle"
            style={{
              left: `${20 + i * 20}%`,
              top: `${10 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Navigation Buttons with Bounce and Rotate */}
      <button
        onClick={prevSlide}
        className={`
          absolute left-3 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-lg shadow-xl
          text-blue-600 dark:text-blue-400 text-2xl flex items-center justify-center font-bold
          opacity-80 hover:opacity-100 hover:scale-110 hover:rotate-180 transition-all duration-400 ease-out
          transform -translate-x-4 group-hover:translate-x-0 animate-bounce-in
          hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/50
        `}
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className={`
          absolute right-3 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-lg shadow-xl
          text-blue-600 dark:text-blue-400 text-2xl flex items-center justify-center font-bold
          opacity-80 hover:opacity-100 hover:scale-110 hover:rotate-180 transition-all duration-400 ease-out
          transform translate-x-4 group-hover:translate-x-0 animate-bounce-in
          hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/50
        `}
      >
        <FaChevronRight />
      </button>

      {/* Enhanced Progress Bar with Shimmer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 bg-white/30 dark:bg-black/30 rounded-full overflow-hidden shadow-lg">
        <div
          className="h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden transition-all duration-400 ease-linear animate-shimmer-progress"
          style={{ width: `${((current % length) / length) * 100}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full h-full animate-shimmer" />
        </div>
      </div>

      {/* Corner Accent Icons */}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-fade-in-right">
        <FaGem className="text-2xl text-purple-400 drop-shadow-lg" />
      </div>
      <div className="absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-fade-in-left delay-200">
        <FaImages className="text-2xl text-blue-400 drop-shadow-lg" />
      </div>
    </div>
  );
}

export default function GalleryRow() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Bubbles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 md:w-6 md:h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-sm opacity-40 animate-float-bubble"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}
        {/* Subtle Wave */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-500/20 to-transparent animate-wave-bottom" />
      </div>

      {/* Enhanced Animated Heading with Typewriter */}
      <div className={`text-center mb-16 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-6 animate-typewriter-shimmer">
          Gallery
        </h1>
        <div className="flex justify-center space-x-2 mb-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-bounce stagger-delay-1"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-500">
          Immerse yourself in our captivating collection of moments, projects, and creative visions.
        </p>
      </div>

      {/* Gallery Row: Staggered Grid */}
      <div className={`relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 delay-700' : 'opacity-0 translate-y-10'}`}>
        <SingleSlider sliderIndex={0} />
        <SingleSlider sliderIndex={1} />
        <SingleSlider sliderIndex={2} />
      </div>

      {/* Extensive Custom Animations */}
      <style jsx>{`
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(60px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typewriter-shimmer {
          0%, 100% { 
            text-shadow: 0 0 10px rgba(99, 102, 241, 0.5); 
            background-position: 0% 50%; 
          }
          50% { 
            text-shadow: 0 0 30px rgba(99, 102, 241, 0.8), 0 0 40px rgba(168, 85, 247, 0.6); 
            background-position: 200% 50%; 
          }
        }
        @keyframes zoom-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes border-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6), 0 0 60px rgba(168, 85, 247, 0.4); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.7; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.8) translateY(0); }
          50% { transform: scale(1.2) translateY(-5px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes shimmer-progress {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float-bubble {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }
        @keyframes wave-bottom {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in-up { animation: slide-in-up 0.8s ease-out forwards; }
        .animate-typewriter-shimmer { 
          animation: typewriter-shimmer 3s ease-in-out infinite; 
          background-size: 200% 200%; 
        }
        .animate-zoom-pulse { animation: zoom-pulse 4s ease-in-out infinite; }
        .animate-border-glow { animation: border-glow 2s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle 3s ease-in-out infinite; }
        .animate-bounce-in { animation: bounce-in 0.6s ease-out; }
        .animate-shimmer-progress { 
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6); 
          background-size: 300% 100%; 
          animation: shimmer-progress 2s linear infinite; 
        }
        .animate-shimmer { 
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); 
          animation: shimmer 1.5s infinite linear; 
        }
        .animate-fade-in-right { animation: fade-in-right 0.6s ease-out forwards; }
        .animate-fade-in-left { animation: fade-in-left 0.6s ease-out forwards; }
        .animate-float-bubble { animation: float-bubble 4s ease-in-out infinite; }
        .animate-wave-bottom { animation: wave-bottom 10s linear infinite; }
        .animate-bounce { animation: bounce 1s infinite; }
        .stagger-delay-1 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}