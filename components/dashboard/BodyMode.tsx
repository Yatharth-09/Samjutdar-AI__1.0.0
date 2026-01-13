'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { MODE_CONFIGS, BODY_MODES } from '@/lib/constants';
import type { BodyTransformationMode } from '@/types/mode';

interface BodyModeProps {
  currentMode: BodyTransformationMode;
  onModeChange: (mode: BodyTransformationMode) => void;
}

export const BodyMode: React.FC<BodyModeProps> = ({
  currentMode,
  onModeChange,
}) => {
  const modeConfig = MODE_CONFIGS[currentMode];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Body Transformation Mode
        </h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Current Mode
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {BODY_MODES.map((mode) => {
              const config = MODE_CONFIGS[mode];
              const isActive = currentMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => onModeChange(mode)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isActive
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {config.description}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {config.primaryFocus}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {modeConfig.description}
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
            <strong>Philosophy:</strong> {modeConfig.philosophy}
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            <strong>Primary Focus:</strong> {modeConfig.primaryCategories.join(', ')}
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
            <strong>Recovery Emphasis:</strong> {modeConfig.recoveryEmphasis}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
