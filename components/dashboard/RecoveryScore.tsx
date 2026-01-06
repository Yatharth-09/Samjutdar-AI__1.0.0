'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import type { RecoveryMetrics } from '@/types/analytics';

interface RecoveryScoreProps {
  data: RecoveryMetrics | null;
  isLoading?: boolean;
}

const getRecoveryColor = (score: number): string => {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-blue-600 dark:text-blue-400';
  if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

const getRecoveryBgColor = (score: number): string => {
  if (score >= 80) return 'bg-green-50 dark:bg-green-900/20';
  if (score >= 60) return 'bg-blue-50 dark:bg-blue-900/20';
  if (score >= 40) return 'bg-yellow-50 dark:bg-yellow-900/20';
  return 'bg-red-50 dark:bg-red-900/20';
};

export const RecoveryScore: React.FC<RecoveryScoreProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recovery Score
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Calculating recovery...
          </p>
        </CardBody>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recovery Score
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No recovery data yet
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Recovery Score
        </h2>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Score Circle */}
        <div className={`p-8 rounded-lg ${getRecoveryBgColor(data.score)}`}>
          <div className="flex flex-col items-center justify-center">
            <p className={`text-5xl font-bold ${getRecoveryColor(data.score)}`}>
              {data.score}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              out of 100
            </p>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            💭 Recommendation
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            {data.recommendation}
          </p>
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Recovery Tasks Completed</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {data.recoveryTasksCompleted}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Weekly Workouts</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {data.workoutFrequency}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
