'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { useProgression } from '@/hooks/useProgression';
import type { LevelTitle } from '@/types/title';

export const TitleSelector: React.FC = () => {
  const { displayTitle, unlockedTitles, allTitles, setSelectedTitle, currentLevel, isClient } = useProgression();

  if (!isClient) return null;

  const handleTitleSelect = (titleId: string) => {
    setSelectedTitle(titleId);
    // Force re-render by reloading
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Title Selection
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Choose your display title from unlocked options
        </p>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {allTitles.map((title) => {
            const isUnlocked = unlockedTitles.some((t) => t.id === title.id);
            const isSelected = displayTitle.id === title.id;
            const isCurrentLevel =
              currentLevel >= title.minLevel &&
              (title.maxLevel === null || currentLevel <= title.maxLevel);

            return (
              <button
                key={title.id}
                onClick={() => isUnlocked && handleTitleSelect(title.id)}
                disabled={!isUnlocked}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : isUnlocked
                    ? 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-gray-800'
                    : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-bold text-base ${
                        isUnlocked
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400 dark:text-gray-600'
                      }`}>
                        {title.name}
                      </p>
                      {isSelected && (
                        <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded font-medium">
                          Selected
                        </span>
                      )}
                      {isCurrentLevel && isUnlocked && !isSelected && (
                        <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded font-medium">
                          Current Level
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mb-2 ${
                      isUnlocked
                        ? 'text-gray-600 dark:text-gray-400'
                        : 'text-gray-400 dark:text-gray-600'
                    }`}>
                      {title.description}
                    </p>
                    <p className={`text-xs font-medium ${
                      isUnlocked
                        ? 'text-gray-500 dark:text-gray-500'
                        : 'text-gray-400 dark:text-gray-600'
                    }`}>
                      Level {title.minLevel}
                      {title.maxLevel !== null ? `–${title.maxLevel}` : '+'}
                    </p>
                  </div>
                  {!isUnlocked && (
                    <div className="text-gray-400 dark:text-gray-600">
                      🔒
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};
