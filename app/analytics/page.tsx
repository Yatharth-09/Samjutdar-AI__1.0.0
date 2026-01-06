'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Advanced Analytics
          </h1>
        </CardHeader>
        <CardBody className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400">
            Advanced analytics features coming soon. This page will include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Monthly performance trends</li>
            <li>Category breakdown charts</li>
            <li>Goal tracking</li>
            <li>Predictive insights</li>
            <li>Historical data export</li>
          </ul>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              💡 For now, see weekly analytics on the main dashboard.
            </p>
          </div>
          <Link href="/">
            <Button variant="primary" className="w-full">
              Back to Dashboard
            </Button>
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
