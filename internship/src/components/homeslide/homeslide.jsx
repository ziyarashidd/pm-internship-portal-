import React, { useState, useEffect, useCallback, useRef } from "react";
import Image3 from '../../assets/pm.jpg';
import Image2 from '../../assets/pm3.jpg';
import Image1 from '../../assets/pm2.jpg';

const images = [
  { src: Image3, alt: "PM Internship Program Overview" },
  { src: Image2, alt: "Internship Opportunities" },
  { src: Image1, alt: "Success Stories from Interns" }
];

function HomePage() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const length = images.length;
  const autoPlayDelay = 5000; // 5 seconds
  const minSwipeDistance = 50;
  const progressIntervalRef = useRef(null);

  // Next slide function (with wrap-around)
  const nextSlide = useCallback(() => {
    setCurrent(prev => (prev === length - 1 ? 0 : prev + 1));
  }, [length]);

  // Previous slide function
  const prevSlide = useCallback(() => {
    setCurrent(prev => (prev === 0 ? length - 1 : prev - 1));
  }, [length]);

  // Go to specific slide
  const goToSlide = useCallback((index) => {
    setCurrent(index);
  }, []);

  // Reset progress on slide change
  useEffect(() => {
    setProgress(0);
  }, [current]);

  // Progress bar animation with pause/resume (time-based, smooth updates)
  useEffect(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    if (isHovered) {
      return;
    }

    // Calculate effective start time to continue from current progress or start fresh
    const effectiveStart = Date.now() - (progress / 100 * autoPlayDelay);
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - effectiveStart;
      let newProgress = (elapsed / autoPlayDelay) * 100;
      newProgress = Math.min(newProgress, 100);

      setProgress(newProgress);

      if (newProgress >= 100) {
        nextSlide();
        // The useEffect on [current] will handle reset; interval will be cleared and restarted by deps
      }
    }, 50); // Update every 50ms for smooth animation

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isHovered, current, autoPlayDelay, progress, nextSlide]);

  // Auto-play effect (only handles the timing via progress; no separate interval needed)
  // Note: Auto-next is handled in progress interval above

  // Touch events for swipe support (mobile-friendly sliding)
  const onTouchStart = useCallback((e) => {
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (!touchStart) return;
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchStart - touchEndX;
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStart(null);
  }, [touchStart, nextSlide, prevSlide, minSwipeDistance]);

  // Keyboard navigation (arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Initial load fade-in animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return (
    <div 
      className={`
        relative w-full h-screen overflow-hidden flex items-center justify-center
        transition-all duration-700 ease-in-out
        ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        md:h-[70vh] sm:h-[60vh] xs:h-[50vh] /* Enhanced responsive heights for better mobile view */
        dark:bg-gray-900
        /* Enhanced shadow for depth */
        shadow-2xl
      `}
      role="region"
      aria-label="Image slider with swipe and keyboard support"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      /* Prevent text selection on swipe */
      onTouchMove={(e) => e.preventDefault()}
    >
      {/* Sliding Container */}
      <div className="w-full h-full overflow-hidden">
        <div 
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ 
            transform: `translateX(-${current * 100}%)`,
            willChange: 'transform' // Optimize for performance
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="w-full h-full flex-shrink-0 relative"
              style={{
                backgroundImage: `url(${image.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                animation: index === current ? 'slideIn 0.7s ease-out forwards' : 'none'
              }}
            >
              {/* Enhanced Gradient Overlay for better text readability/depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/40 to-black/60 pointer-events-none z-10" />
              
              {/* Hidden Image for Accessibility */}
              <img 
                src={image.src} 
                alt={image.alt} 
                className="sr-only"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots - Enhanced with better spacing and hover effects */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-30 p-3 bg-white/25 backdrop-blur-lg rounded-full border border-white/40 shadow-lg dark:bg-black/40 dark:border-white/20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`
              w-2.5 h-2.5 rounded-full border-none cursor-pointer transition-all duration-300 ease-out
              outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2
              bg-white/60 hover:bg-white/90 hover:scale-125 active:scale-90
              ${index === current 
                ? 'bg-white scale-125 ring-2 ring-white/60 shadow-md animate-pulse' 
                : 'opacity-70'
              }
              dark:bg-gray-300/60 dark:hover:bg-gray-300/90 dark:focus-visible:ring-gray-300/60
              dark:${index === current ? 'bg-gray-300 scale-125 ring-2 ring-gray-300/60' : ''}
            `}
            aria-label={`Go to slide ${index + 1} of ${length}`}
            aria-current={index === current ? 'true' : 'false'}
          >
            <span className="sr-only">Slide {index + 1}</span>
          </button>
        ))}
      </div>

      {/* Enhanced Progress Bar (Auto-Play Indicator) with better styling */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30 z-30 overflow-hidden rounded-t-full dark:bg-white/30">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-green-500 transition-all duration-700 ease-linear shadow-inner"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Enhanced Hover Pause Indicator with animation */}
      {isHovered && (
        <div className="absolute top-6 right-6 z-40 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 animate-fadeIn dark:bg-white/20 dark:text-white border border-white/20 shadow-xl">
          <span className="flex items-center gap-2">
            ⏸️ Paused
          </span>
        </div>
      )}

      {/* Custom CSS for animations (add to your global styles or use Tailwind's @layer) */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default HomePage;