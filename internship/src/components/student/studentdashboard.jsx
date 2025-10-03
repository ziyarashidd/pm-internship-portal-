import React, { useState, useEffect } from "react";
import { FaHome, FaBook, FaUser  , FaSignOutAlt, FaBell, FaClipboardList, FaBars, FaTimes } from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
// Remove or keep "./student.css" if you have custom styles; this uses Tailwind for responsiveness

function StudentDashboard() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile hamburger toggle

  // Close mobile menu on route change or Escape key (optional enhancement)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return; // Added confirmation for better UX
    // Clear login info
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("token"); // Added for completeness if you use tokens

    // Close menu if open
    setIsMenuOpen(false);

    // Navigate to login page
    navigate("/login");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const username = localStorage.getItem("username") || "Student";

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Overlay Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          overflow-y-auto
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 bg-gradient-to-b from-blue-600 to-indigo-700 text-white sticky top-0 z-10">
          <h2 className="text-xl font-bold">PM Internship</h2>
          <p className="text-blue-100 text-sm mt-1">Student Portal</p>
        </div>

        {/* Sidebar Links */}
        <ul className="p-3 space-y-1 mt-2">
          <li>
            <Link 
              to="/dashboard" 
              className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
              onClick={closeMenu}
            >
              <FaHome className="mr-3 text-lg" /> Home
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard/applications" 
              className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
              onClick={closeMenu}
            >
              <FaClipboardList className="mr-3 text-lg" /> My Applications
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard/recommended" 
              className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
              onClick={closeMenu}
            >
              <FaBook className="mr-3 text-lg" /> Recommended
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard/profile" 
              className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
              onClick={closeMenu}
            >
              <FaUser   className="mr-3 text-lg" /> Profile
            </Link>
          </li>
          <li>
            <div 
              className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-all duration-200 font-medium"
              onClick={handleLogout}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleLogout()}
            >
              <FaSignOutAlt className="mr-3 text-lg" /> Logout
            </div>
          </li>
        </ul>

        {/* Mobile Close Button */}
        <button
          onClick={closeMenu}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 md:hidden"
          aria-label="Close menu"
        >
          <FaTimes className="text-xl" />
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-0 h-full overflow-hidden w-full">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-3 md:p-4 flex items-center justify-between sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Hamburger Menu Button (Mobile Only) */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-600 hover:text-blue-600 transition-colors p-1 md:p-2 rounded-lg hover:bg-gray-100"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
              Welcome, <span className="text-blue-600">{username}</span> 👋
            </h1>
          </div>
          <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100">
            <FaBell className="text-xl" />
            {/* Optional: Notification badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
          </button>
        </header>

        {/* Sub-pages will render here */}
        <main className="flex-1 overflow-y-auto p-2 md:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;
