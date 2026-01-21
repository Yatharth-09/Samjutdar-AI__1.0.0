'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

interface DisciplineScoreDisplayProps {
  score: number;
  level: string;
  color: string;
  progressBarColor: string;
}

export const DisciplineScoreDisplay: React.FC<DisciplineScoreDisplayProps> = ({
  score,
  level,
  color,
  progressBarColor,
}) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Discipline Score
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Long-term consistency measurement
        </p>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {/* Score Display */}
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-4xl font-bold ${color}`}>
                {score.toFixed(1)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                out of 100
              </p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-semibold ${color}`}>
                {level}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${progressBarColor} transition-all duration-500`}
              style={{ width: `${score}%` }}
            />
          </div>

          {/* Level Ranges */}
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-between">
              <span>0–30: Unstable</span>
              <span>31–60: Building</span>
            </div>
            <div className="flex items-center justify-between">
              <span>61–80: Disciplined</span>
              <span>81–100: Elite Discipline</span>
            </div>
          </div>

          {/* How it works */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              How Discipline Score Works:
            </p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Complete all tasks: +1.5 points</li>
              <li>• Complete some tasks: +0.5 points</li>
              <li>• Skip all tasks: −1.0 points</li>
              <li>• Active streak day: +0.25 bonus</li>
              <li>• Break streak: −0.5 penalty</li>
            </ul>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
