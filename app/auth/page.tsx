'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Authentication
          </h1>
        </CardHeader>
        <CardBody className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400">
            Authentication features coming soon. This page is a placeholder for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>User registration</li>
            <li>Login</li>
            <li>Session management</li>
            <li>Firebase integration</li>
          </ul>
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
