import React, { useEffect, useState } from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-12 relative overflow-hidden">
      {/* Animated background elements for attractiveness */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className={`max-w-7xl mx-auto px-4 transition-all duration-1000 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div className="footer-section about space-y-4 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-blue-400 mb-4 hover:text-blue-300 transition-colors duration-300">
              PM Internship 2025
            </h3>
            <p className="text-gray-300 leading-relaxed hover:scale-105 transition-transform duration-300">
              A platform for students to explore internship opportunities, enhance skills, and connect with mentors.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section links space-y-4 animate-fade-in-up animation-delay-200">
            <h3 className="text-2xl font-bold text-purple-400 mb-4 hover:text-purple-300 transition-colors duration-300">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#home" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:scale-105 block"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#eligible" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:scale-105 block"
                >
                  Eligible
                </a>
              </li>
              <li>
                <a 
                  href="#gallery" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:scale-105 block"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a 
                  href="/playstore" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:scale-105 block"
                >
                  Download App
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section contact space-y-4 animate-fade-in-up animation-delay-400">
            <h3 className="text-2xl font-bold text-pink-400 mb-4 hover:text-pink-300 transition-colors duration-300">
              Contact
            </h3>
            <p className="text-gray-300 hover:scale-105 transition-transform duration-300">
              Email: support@pminternship.com
            </p>
            <p className="text-gray-300 hover:scale-105 transition-transform duration-300">
              Phone: +91 1234567890
            </p>
            <div className="social-icons flex space-x-4 pt-2">
              <a 
                href="#" 
                className="text-2xl text-blue-400 hover:text-blue-300 hover:scale-125 hover:rotate-12 transition-all duration-300 ease-out shadow-lg hover:shadow-blue-500/25 rounded-full p-2 bg-gray-800 hover:bg-blue-900/20"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href="#" 
                className="text-2xl text-blue-400 hover:text-blue-300 hover:scale-125 hover:rotate-12 transition-all duration-300 ease-out shadow-lg hover:shadow-blue-500/25 rounded-full p-2 bg-gray-800 hover:bg-blue-900/20"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="#" 
                className="text-2xl text-blue-600 hover:text-blue-400 hover:scale-125 hover:rotate-12 transition-all duration-300 ease-out shadow-lg hover:shadow-blue-500/25 rounded-full p-2 bg-gray-800 hover:bg-blue-900/20"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
              <a 
                href="#" 
                className="text-2xl text-pink-400 hover:text-pink-300 hover:scale-125 hover:rotate-12 transition-all duration-300 ease-out shadow-lg hover:shadow-pink-500/25 rounded-full p-2 bg-gray-800 hover:bg-pink-900/20"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom text-center mt-8 pt-6 border-t border-gray-700 text-gray-400 animate-fade-in animation-delay-600">
          &copy; {new Date().getFullYear()} PM Internship Scheme. All Rights Reserved.
          <span className="block mt-2 text-sm opacity-75 hover:opacity-100 transition-opacity duration-300">
            Designed with ❤️ for future leaders
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </footer>
  );
}

export default Footer;