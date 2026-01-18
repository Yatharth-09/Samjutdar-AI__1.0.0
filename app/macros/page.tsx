'use client';

import { Card } from '@/components/ui/Card';
import { FoodPhotoMacros } from '@/components/dashboard/FoodPhotoMacros';

export default function MacrosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <Card className="p-4 sm:p-4">
        <FoodPhotoMacros />
      </Card>
    </div>
  );
}
