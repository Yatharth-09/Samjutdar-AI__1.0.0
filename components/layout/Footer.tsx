'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-700 dark:text-gray-400 text-sm">
            <p>© 2025 AI Fitness OS. Built for transformation.</p>
          </div>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
