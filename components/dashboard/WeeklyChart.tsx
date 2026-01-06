'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import type { WeeklyAnalytics } from '@/types/analytics';

interface WeeklyChartProps {
  data: WeeklyAnalytics | null;
  isLoading?: boolean;
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Weekly Performance
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Loading analytics...
          </p>
        </CardBody>
      </Card>
    );
  }

  if (!data || data.dailyMetrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Weekly Performance
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No data available yet
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Weekly Performance
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {data.weekStart} to {data.weekEnd}
        </p>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Overall Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.overallCompletionRate}%
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Streak</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.streak} days
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Days Tracked</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.dailyMetrics.length}
            </p>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Daily Completion Rates
          </p>
          <div className="space-y-2">
            {data.dailyMetrics.map((metric) => (
              <div key={metric.date} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 dark:text-gray-400 w-16">
                  {new Date(metric.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                  })}
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all"
                    style={{ width: `${metric.completionRate}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-white w-10">
                  {metric.completionRate}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
