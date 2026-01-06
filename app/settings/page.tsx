'use client';

import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { clearAllData } from '@/lib/storage';
import { APP_CONFIG } from '@/lib/constants';
import Link from 'next/link';
import { useState } from 'react';

export default function SettingsPage() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    if (
      typeof window !== 'undefined' &&
      confirm(
        'Are you sure you want to reset all data? This action cannot be undone.'
      )
    ) {
      clearAllData();
      setShowConfirm(false);
      // Reload page to reset state
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      {/* App Info */}
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              App Name
            </p>
            <p className="text-gray-900 dark:text-white">{APP_CONFIG.APP_NAME}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Version
            </p>
            <p className="text-gray-900 dark:text-white">
              {APP_CONFIG.APP_VERSION}
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Preferences
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Additional preferences coming soon:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 text-sm">
            <li>Notification settings</li>
            <li>Task reminders</li>
            <li>Weekly report frequency</li>
            <li>Default task categories</li>
            <li>Data export options</li>
          </ul>
        </CardBody>
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
            Danger Zone
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Reset all app data and start fresh. This will clear all tasks,
            analytics, and preferences.
          </p>
          <Button variant="danger" onClick={handleReset} className="w-full">
            Reset All Data
          </Button>
        </CardBody>
      </Card>

      {/* Back Button */}
      <Link href="/">
        <Button variant="secondary" className="w-full">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
