'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { signIn } from 'next-auth/react';

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
            Sign in with Google to continue to your dashboard.
          </p>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            Continue with Google
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
