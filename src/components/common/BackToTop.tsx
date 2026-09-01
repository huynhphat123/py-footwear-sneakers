import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface BackToTopProps {
  threshold?: number;
  className?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({
  threshold = 320,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      id="back-to-top-btn"
      type="button"
      onClick={scrollToTop}
      aria-label="Lên đầu trang"
      title="Lên đầu trang"
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-neutral-900/90 hover:bg-neutral-950 dark:bg-neutral-100/90 dark:hover:bg-white text-white dark:text-neutral-950 shadow-xl backdrop-blur-sm border border-neutral-700/40 dark:border-neutral-300/40 transition-all duration-300 transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white active:scale-95 group ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto hover:scale-110 hover:shadow-2xl'
          : 'opacity-0 translate-y-6 pointer-events-none'
      } ${className}`}
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
      <span className="sr-only">Lên đầu trang</span>
    </button>
  );
};
