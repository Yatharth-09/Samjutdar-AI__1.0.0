'use client';

import React, { useState } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export const Header: React.FC = () => {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen((v) => !v)}
                title="Menu"
                aria-label="Open menu"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 7H20M4 12H20M4 17H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </Button>

              {isMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-96 z-50">
                  <Card className="p-4 sm:p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Link
                          href="/"
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                        >
                          Back to Home
                        </Link>
                        <Link
                          href="/save-workout"
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                        >
                          Save Workout
                        </Link>
                        <Link
                          href="/analytics"
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                        >
                          Analytics
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                        >
                          Settings
                        </Link>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>

            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SAMJUTDAR AI
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
            >
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleDarkMode(!isDark)}
              title="Toggle dark mode"
            >
              {isDark ? '☀️' : '🌙'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
