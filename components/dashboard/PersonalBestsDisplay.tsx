'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import type { PersonalBestsState } from '@/types/personalBests';

interface PersonalBestsDisplayProps {
  personalBests: PersonalBestsState;
}

export const PersonalBestsDisplay: React.FC<PersonalBestsDisplayProps> = ({ personalBests }) => {
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'Not yet achieved';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const pbItems = [
    {
      icon: '📋',
      label: 'Most Tasks in a Day',
      value: personalBests.mostTasksInDay.value,
      unit: 'tasks',
      date: personalBests.mostTasksInDay.dateAchieved,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: '🔥',
      label: 'Longest Streak',
      value: personalBests.longestStreak.value,
      unit: 'days',
      date: personalBests.longestStreak.dateAchieved,
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      icon: '⚡',
      label: 'Most XP in a Day',
      value: personalBests.mostXPInDay.value,
      unit: 'XP',
      date: personalBests.mostXPInDay.dateAchieved,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      icon: '📈',
      label: 'Most XP in a Week',
      value: personalBests.mostXPInWeek.value,
      unit: 'XP',
      date: personalBests.mostXPInWeek.dateAchieved,
      color: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      icon: '⭐',
      label: 'Perfect Weeks',
      value: personalBests.mostPerfectWeeks.value,
      unit: 'weeks',
      date: personalBests.mostPerfectWeeks.dateAchieved,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      icon: '💎',
      label: 'Highest Discipline Score',
      value: personalBests.highestDisciplineScore.value,
      unit: '/ 100',
      date: personalBests.highestDisciplineScore.dateAchieved,
      color: 'text-pink-600 dark:text-pink-400',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          🏆 Personal Bests
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Your lifetime best achievements
        </p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pbItems.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {item.label}
                  </p>
                  <p className={`text-2xl font-bold ${item.color} mb-1`}>
                    {item.value > 0 ? item.value : '—'}
                    {item.value > 0 && (
                      <span className="text-sm font-normal ml-1">{item.unit}</span>
                    )}
                  </p>
                  {item.date && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {formatDate(item.date)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
            Keep grinding to beat your own records! 💪
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
