'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import type { DailyQuest } from '@/types/dailyQuest';

interface DailyQuestsProps {
  quests: DailyQuest[];
}

export const DailyQuests: React.FC<DailyQuestsProps> = ({ quests }) => {
  if (quests.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
      <CardHeader>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          ✨ Daily Quests
        </h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`p-3 rounded-lg border-2 transition-all ${
                quest.completed
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {quest.title}
                    </p>
                    {quest.completed && (
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {quest.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          quest.completed
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`}
                        style={{
                          width: `${Math.min(
                            (quest.progress / quest.target) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-fit">
                      {quest.progress}/{quest.target}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 dark:text-gray-400">XP</p>
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    +{quest.xpReward}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
