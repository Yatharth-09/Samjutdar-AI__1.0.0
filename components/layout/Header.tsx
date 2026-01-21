'use client';

import React, { useState, useEffect } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useProgression } from '@/hooks/useProgression';
import { useDisciplineScore } from '@/hooks/useDisciplineScore';
import { getTasks } from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import type { TasksByDate } from '@/types/task';

export const Header: React.FC = () => {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [allTasks, setAllTasks] = useState<TasksByDate>({});
  const { currentLevel, xpProgress, title, streakLength, hasPerfectWeekThisWeek, isClient } = useProgression();
  const { score, level, color, isClient: isDisciplineClient } = useDisciplineScore(allTasks);

  useEffect(() => {
    const tasks = getTasks();
    setAllTasks(tasks);
  }, []);

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
                          href="/macros"
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                        >
                          Know What You Are Eating
                        </Link>
                        <Link
                          href="/health"
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                        >
                          Health Calculators
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
                        <button
                          type="button"
                          onClick={() => {
                            setIsMenuOpen(false);
                            void signOut({ callbackUrl: '/auth' });
                          }}
                          className="block text-left w-full text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                        >
                          Logout
                        </button>
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

          <div className="flex items-center gap-4">
            {isClient && (
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  Lv. {currentLevel}
                </div>
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${xpProgress * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  {title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  🔥 {streakLength || 0}
                </div>
                {isDisciplineClient && (
                  <div className={`text-xs font-semibold ${color}`} title={`Discipline: ${level}`}>
                    💎 {score.toFixed(0)}
                  </div>
                )}
                {hasPerfectWeekThisWeek && (
                  <div className="text-xs text-green-600 dark:text-green-400">⭐ Perfect Week</div>
                )}
              </div>
            )}
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
