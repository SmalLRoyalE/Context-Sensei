// src/components/layout/PageContainer.tsx
import React from 'react';
import { Navbar } from '../common/Navbar';
import { Footer } from './Footer';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      <main className={`flex-grow ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};