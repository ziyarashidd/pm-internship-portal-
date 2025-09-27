import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaBook, FaClock, FaHandsHelping, FaStar, FaLightbulb, FaGraduationCap, FaUsers, FaChartLine } from "react-icons/fa";

function About() {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger initial animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Eligibility cards - Redesigned with new icons and structure
  const eligibilityData = [
    { icon: <FaGraduationCap />, title: "Academic Qualification", desc: "Must hold a bachelor's degree or equivalent in any relevant field.", size: "large", color: "teal" },
    { icon: <FaBook />, title: "PM Tool Proficiency", desc: "Hands-on experience with agile tools like Jira, Trello, or Monday.com.", size: "small", color: "indigo" },
    { icon: <FaClock />, title: "Time Commitment", desc: "Flexible schedule to commit 20-30 hours weekly during the program.", size: "medium", color: "amber" },
    { icon: <FaUsers />, title: "Collaborative Mindset", desc: "Proven ability to thrive in diverse team settings and communicate effectively.", size: "small", color: "emerald" },
  ];

  // Benefits/Skills cards - Enhanced with new icons
  const skillsData = [
    { icon: <FaStar />, title: "Professional Growth", desc: "Build practical PM skills through live projects and case studies.", size: "medium", color: "violet" },
    { icon: <FaLightbulb />, title: "Mentor Guidance", desc: "Direct access to industry veterans for personalized feedback and insights.", size: "large", color: "rose" },
    { icon: <FaCheckCircle />, title: "Certification Award", desc: "Earn a verifiable certificate to boost your resume and LinkedIn profile.", size: "small", color: "sky" },
    { icon: <FaChartLine />, title: "Career Networking", desc: "Expand your professional circle with peers and leaders in project management.", size: "medium", color: "orange" },
  ];

  // Enhanced animation classes with new stagger and reveal effects
  const getAnimationClass = (index, isEligibility) => {
    const baseDelay = isEligibility ? 0.4 : 1.2; // Phased section reveals
    const direction = index % 2 === 0 ? "slide-in-bottom" : "slide-in-top";
    const staggerDelay = (index * 0.2) + baseDelay;
    const fadeEffect = "fade-reveal";
    return `${direction} ${fadeEffect} animate-delay-[${staggerDelay}s]`;
  };

  // New color schemes: Modern PM theme (Teal/Indigo base, warm accents for energy)
  const getColorClasses = (color) => {
    const colors = {
      teal: { 
        bg: "from-teal-50 to-cyan-50", 
        darkBg: "from-teal-900/20 to-cyan-900/20", 
        icon: "text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300", 
        gradient: "from-teal-500/10 to-cyan-500/10", 
        glow: "from-teal-500/30 to-cyan-500/30",
        border: "border-teal-200 dark:border-teal-800"
      },
      indigo: { 
        bg: "from-indigo-50 to-blue-50", 
        darkBg: "from-indigo-900/20 to-blue-900/20", 
        icon: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300", 
        gradient: "from-indigo-500/10 to-blue-500/10", 
        glow: "from-indigo-500/30 to-blue-500/30",
        border: "border-indigo-200 dark:border-indigo-800"
      },
      amber: { 
        bg: "from-amber-50 to-orange-50", 
        darkBg: "from-amber-900/20 to-orange-900/20", 
        icon: "text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300", 
        gradient: "from-amber-500/10 to-orange-500/10", 
        glow: "from-amber-500/30 to-orange-500/30",
        border: "border-amber-200 dark:border-amber-800"
      },
      emerald: { 
        bg: "from-emerald-50 to-green-50", 
        darkBg: "from-emerald-900/20 to-green-900/20", 
        icon: "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300", 
        gradient: "from-emerald-500/10 to-green-500/10", 
        glow: "from-emerald-500/30 to-green-500/30",
        border: "border-emerald-200 dark:border-emerald-800"
      },
      violet: { 
        bg: "from-violet-50 to-purple-50", 
        darkBg: "from-violet-900/20 to-purple-900/20", 
        icon: "text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300", 
        gradient: "from-violet-500/10 to-purple-500/10", 
        glow: "from-violet-500/30 to-purple-500/30",
        border: "border-violet-200 dark:border-violet-800"
      },
      rose: { 
        bg: "from-rose-50 to-pink-50", 
        darkBg: "from-rose-900/20 to-pink-900/20", 
        icon: "text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300", 
        gradient: "from-rose-500/10 to-pink-500/10", 
        glow: "from-rose-500/30 to-pink-500/30",
        border: "border-rose-200 dark:border-rose-800"
      },
      sky: { 
        bg: "from-sky-50 to-blue-50", 
        darkBg: "from-sky-900/20 to-blue-900/20", 
        icon: "text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300", 
        gradient: "from-sky-500/10 to-blue-500/10", 
        glow: "from-sky-500/30 to-blue-500/30",
        border: "border-sky-200 dark:border-sky-800"
      },
      orange: { 
        bg: "from-orange-50 to-red-50", 
        darkBg: "from-orange-900/20 to-red-900/20", 
        icon: "text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300", 
        gradient: "from-orange-500/10 to-red-500/10", 
        glow: "from-orange-500/30 to-red-500/30",
        border: "border-orange-200 dark:border-orange-800"
      },
    };
    return colors[color] || colors.teal;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 py-20 px-4 sm:px-6 lg:px-8 dark:from-gray-900 dark:via-gray-800 dark:to-teal-900/20 relative overflow-hidden">
      {/* Redesigned Background: Subtle geometric patterns for modern feel */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Redesigned Title: Larger, with underline animation and new gradient */}
      <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-teal-600 via-indigo-600 to-amber-600 bg-clip-text text-transparent animate-typewriter-glow">
          PM Internship Essentials
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-indigo-500 mx-auto rounded-full animate-expand-width mb-4"></div>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-500">
          Unlock your potential in project management with clear eligibility paths and rewarding skill-building opportunities.
        </p>
      </div>

      {/* Eligibility Section: Redesigned with vertical accent line on desktop */}
      <div className={`mb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 delay-600' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-16 animate-slide-in-up animation-delay-200 relative">
          Eligibility Criteria
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-1 h-8 bg-gradient-to-b from-teal-500 to-transparent"></div>
        </h2>
        <div className="relative max-w-7xl mx-auto">
          {/* Vertical line for desktop */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-teal-200 to-indigo-200 opacity-30"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {eligibilityData.map((item, index) => {
              const colors = getColorClasses(item.color);
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={`eligibility-${index}`}
                  className={`
                    relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-3xl transition-all duration-800 ease-out transform hover:-translate-y-6 hover:scale-102
                    p-8 lg:p-10 border ${colors.border} overflow-hidden group
                    ${getAnimationClass(index, true)}
                    ${item.size === 'large' ? 'lg:col-span-2' : 'col-span-1'}
                    ${isLeft ? 'lg:pr-8 lg:border-r' : 'lg:pl-8 lg:border-l'}
                  `}
                >
                  {/* Redesigned gradient overlay with wave pattern */}
                  <div className={`absolute inset-0 ${colors.gradient} pointer-events-none animate-wave`} />
                  
                  {/* Icon: Larger, with floating animation */}
                  <div className="flex justify-center mb-8 relative z-10">
                    <div className={`p-6 ${colors.bg} dark:${colors.darkBg} rounded-2xl shadow-lg transition-all duration-600 hover:rotate-6 hover:scale-110 animate-float`}>
                      <div className={`text-4xl ${colors.icon} transition-all duration-400 group-hover:scale-125`}>
                        {item.icon}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content: Redesigned with badge-like title */}
                  <div className="text-center relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 inline-block px-4 py-2 bg-gradient-to-r from-teal-100 to-indigo-100 dark:from-teal-900/50 dark:to-indigo-900/50 rounded-full shadow-md animate-pulse-title">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      {item.desc}
                    </p>
                  </div>
                  
                  {/* Enhanced glow with ripple effect */}
                  <div className="absolute inset-0 rounded-3xl ${colors.glow} opacity-0 group-hover:opacity-100 transition-all duration-800 blur-2xl scale-90 group-hover:scale-110 animate-ripple" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Skills/Benefits Section: Similar redesign with accent */}
      <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 delay-1000' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-16 animate-slide-in-up animation-delay-300 relative">
          Skills & Benefits
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-1 h-8 bg-gradient-to-b from-emerald-500 to-transparent"></div>
        </h2>
        <div className="relative max-w-7xl mx-auto">
          {/* Vertical line for desktop */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-emerald-200 to-violet-200 opacity-30"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {skillsData.map((item, index) => {
              const colors = getColorClasses(item.color);
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={`skills-${index}`}
                  className={`
                    relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-3xl transition-all duration-800 ease-out transform hover:-translate-y-6 hover:scale-102
                    p-8 lg:p-10 border ${colors.border} overflow-hidden group
                    ${getAnimationClass(index, false)}
                    ${item.size === 'large' ? 'lg:col-span-2' : 'col-span-1'}
                    ${isLeft ? 'lg:pr-8 lg:border-r' : 'lg:pl-8 lg:border-l'}
                  `}
                >
                  {/* Gradient overlay with wave */}
                  <div className={`absolute inset-0 ${colors.gradient} pointer-events-none animate-wave`} />
                  
                  {/* Icon: Floating animation */}
                  <div className="flex justify-center mb-8 relative z-10">
                    <div className={`p-6 ${colors.bg} dark:${colors.darkBg} rounded-2xl shadow-lg transition-all duration-600 hover:rotate-6 hover:scale-110 animate-float`}>
                      <div className={`text-4xl ${colors.icon} transition-all duration-400 group-hover:scale-125`}>
                        {item.icon}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content with badge title */}
                  <div className="text-center relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 inline-block px-4 py-2 bg-gradient-to-r from-emerald-100 to-violet-100 dark:from-emerald-900/50 dark:to-violet-900/50 rounded-full shadow-md animate-pulse-title">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      {item.desc}
                    </p>
                  </div>
                  
                  {/* Glow with ripple */}
                  <div className="absolute inset-0 rounded-3xl ${colors.glow} opacity-0 group-hover:opacity-100 transition-all duration-800 blur-2xl scale-90 group-hover:scale-110 animate-ripple" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Redesigned Custom Animations: More fluid and modern */}
       <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes scale-in {
          from { transform: scale(0.8); }
          to { transform: scale(1); }
        }
        @keyframes pulse-glow {
          0%, 100% { text-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
          50% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(147, 51, 234, 0.6); }
        }
        @keyframes pulse-icon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes bounce-light {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-slide-in-up { animation: slide-in-up 0.8s ease-out forwards; }
        .slide-in-left { animation: slide-in-left 0.7s ease-out forwards; }
        .slide-in-right { animation: slide-in-right 0.7s ease-out forwards; }
        .scale-in { animation: scale-in 0.6s ease-out forwards; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-pulse-icon { animation: pulse-icon 2s ease-in-out infinite; }
        .animate-shimmer { 
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 3s infinite linear; 
        }
        .group-hover\\:animate-bounce-light:hover { animation: bounce-light 0.5s ease-out; }
        .animate-delay-100 { animation-delay: 0.1s; }
        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-400 { animation-delay: 0.4s; }
        /* Dynamic delays handled in JS classes */
      `}</style>
    </div>
  );
}

export default About;