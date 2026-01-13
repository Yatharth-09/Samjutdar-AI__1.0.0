'use client';

import { useEffect, useState } from 'react';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { RecoveryScore } from '@/components/dashboard/RecoveryScore';
import { getTasks, getCurrentMode } from '@/lib/storage';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { TasksByDate } from '@/types/task';
import type { BodyTransformationMode } from '@/types/mode';

export default function AnalyticsPage() {
  const [allTasks, setAllTasks] = useState<TasksByDate>({});
  const [currentMode, setCurrentMode] = useState<BodyTransformationMode>('maintenance');

  useEffect(() => {
    const tasks = getTasks();
    const mode = getCurrentMode();
    setAllTasks(tasks);
    setCurrentMode(mode);
  }, []);

  const analytics = useAnalytics(allTasks, currentMode);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <WeeklyChart data={analytics?.weekly || null} />
      <RecoveryScore data={analytics?.recovery || null} />
    </div>
  );
}
