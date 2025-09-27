import React, { useState, useEffect, useRef } from "react";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Logo1 from "../../assets/logo1.png"; // Your logo import

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [isLoading, setIsLoading] = useState(true); // For initial load animation
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state
  const navigate = useNavigate();
  const mobileMenuRef = useRef(null);

  // Dark mode toggle
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  // Scroll listener for shrink effect
  useEffect(() => {
    let ticking = false;
    const updateScroll = () => {
      setIsScrolled(window.scrollY > 50);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initial load fade-in
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Apply dark mode on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle Escape key for accessibility and mobile menu close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        document.querySelector('button')?.focus();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Close mobile menu on route change or outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav 
      className={`
        bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300 ease-in-out shadow-md
        ${isScrolled ? 'shadow-lg h-14' : 'shadow-md h-16'}
        ${isLoading ? 'opacity-0' : 'opacity-100 animate-fade-in'}
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center ${isScrolled ? 'h-14' : 'h-16'} transition-all duration-300`}>
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 hover:scale-105 transition-all duration-300 animate-float"
              aria-label="Go to Home"
            >
              <img
                src={Logo1}
                alt="PM Internship Logo"
                className="h-8 sm:h-10 w-auto object-contain rounded-md shadow-sm hover:shadow-md transition-shadow duration-300"
              />
              {/* Optional text fallback if image fails */}
              <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-purple-400 dark:to-pink-500 bg-clip-text text-transparent">
                PM Internship
              </span>
            </button>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Sign Up Button (Primary) */}
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center px-6 py-2.5 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-pulse disabled:opacity-50"
              aria-label="Sign Up for Internship"
              disabled={isLoading}
            >
              Sign Up
            </button>

            {/* Login Button (Secondary) */}
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 dark:hover:text-purple-400 transition-all duration-300 transform hover:scale-105 hover:shadow-md disabled:opacity-50"
              aria-label="Login to Account"
              disabled={isLoading}
            >
              Login
            </button>

            {/* Dark Mode Toggle (Desktop) */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-purple-400 transition-all duration-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-purple-400 transition-all duration-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          ref={mobileMenuRef}
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-3">
            {/* Mobile Sign Up */}
            <button
              onClick={() => {
                navigate("/signup");
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 text-left"
              aria-label="Sign Up for Internship"
              disabled={isLoading}
            >
              Sign Up
            </button>

            {/* Mobile Login */}
            <button
              onClick={() => {
                navigate("/login");
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 dark:hover:text-purple-400 transition-all duration-300 transform hover:scale-105 hover:shadow-md disabled:opacity-50 text-left"
              aria-label="Login to Account"
              disabled={isLoading}
            >
              Login
            </button>

            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={() => {
                toggleDarkMode();
                setIsMobileMenuOpen(false); // Optional: close menu after toggle
              }}
              className="w-full flex items-center justify-between px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-purple-400 transition-all duration-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span>Toggle {darkMode ? 'Light' : 'Dark'} Mode</span>
              {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-[fade-in-up_0.4s_ease-out] { animation: fade-in-up 0.4s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; } /* Tailwind's pulse for Sign Up */
      `}</style>
    </nav>
  );
}

export default Navbar;