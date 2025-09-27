import React, { useEffect, useState } from "react";
import AppImage from "../../assets/playstore.jpg"; // Replace with your image

function PlaystorePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white py-8 px-4 lg:py-0 lg:px-0 lg:min-h-screen lg:w-screen overflow-hidden relative">
      {/* Animated background elements for attractiveness - same as footer */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className={`w-full max-w-6xl mx-auto text-center transition-all duration-1000 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      } lg:flex lg:items-center lg:justify-center lg:h-screen lg:p-8 lg:text-left`}>
        {/* Header Text for Engagement - Full Width on Mobile, Half on Desktop */}
        <div className="w-full mb-8 lg:mb-0 lg:w-1/2 lg:pr-8 animate-fade-in-up">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-cyan-300 transition-colors duration-300">
            Download Our App
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-md mx-auto lg:max-w-none lg:mx-0 leading-relaxed hover:scale-105 transition-transform duration-300">
            Get the best experience on your mobile device. Join thousands of students and discover amazing internship opportunities with our app. Available now on Google Play Store!
          </p>
          
          {/* Enhanced Call-to-Action Button */}
          <a
            href=""
            // target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-500 ease-in-out transform hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 shadow-xl animate-bounce-slow lg:py-3 lg:px-6 group"
            aria-label="Get the App on Google Play"
          >
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">📱</span>
            <span>Get It on Google Play</span>
          </a>
        </div>
        
        {/* Enhanced Card Container with Animations */}
        <div className="w-full lg:w-1/2 lg:pl-8 animate-fade-in-up animation-delay-300">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 transform transition-all duration-700 ease-out hover:scale-105 hover:shadow-3xl focus-within:outline-none focus-within:ring-4 focus-within:ring-blue-500 overflow-hidden animate-slide-up lg:p-8 lg:rounded-3xl">
            <a
              href=""
              // target="_blank"
              rel="noopener noreferrer"
              className="block w-full group"
              aria-label="Download App from Play Store"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img 
                  src={AppImage} 
                  alt="App Banner - Download from Google Play Store" 
                  className="w-full h-64 md:h-80 lg:h-full lg:max-h-[500px] object-cover rounded-xl shadow-xl transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-110 lg:rounded-2xl lg:shadow-2xl animate-pulse-slow"
                />
                {/* Subtle overlay for dark theme enhancement */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Download badge-like element */}
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg transform group-hover:scale-110 transition-transform duration-300 animate-bounce">
                  Available Now
                </div>
              </div>
            </a>
          </div>
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
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animate-slide-up {
          animation: slide-up 1s ease-out forwards;
          opacity: 0;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default PlaystorePage;