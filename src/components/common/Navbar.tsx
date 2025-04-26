// src/components/common/Navbar.tsx
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
  const location = useLocation();
  
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-dark-800 shadow-sm dark:shadow-dark-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Name */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-8 h-8"
              >
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
              </svg>
              <span className="font-display text-xl font-bold">Context Sensei</span>
            </Link>
          </div>
          
          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-8">
              <Link 
                to="/" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActiveLink('/') 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActiveLink('/about') 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                About
              </Link>
              <Link 
                to="/faq" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActiveLink('/faq') 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                FAQ
              </Link>
            </div>
          </div>
          
          {/* Right section - Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation - Only shown on small screens */}
      <div className="md:hidden border-t border-gray-200 dark:border-dark-700">
        <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-dark-700">
          <Link 
            to="/" 
            className={`py-3 text-center text-sm font-medium ${
              isActiveLink('/') 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`py-3 text-center text-sm font-medium ${
              isActiveLink('/about') 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            About
          </Link>
          <Link 
            to="/faq" 
            className={`py-3 text-center text-sm font-medium ${
              isActiveLink('/faq') 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            FAQ
          </Link>
        </div>
      </div>
    </nav>
  );
};