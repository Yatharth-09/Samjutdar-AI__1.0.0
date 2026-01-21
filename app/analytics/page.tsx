'use client';

import { useEffect, useState } from 'react';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { RecoveryScore } from '@/components/dashboard/RecoveryScore';
import { DisciplineScoreDisplay } from '@/components/dashboard/DisciplineScoreDisplay';
import { PersonalBestsDisplay } from '@/components/dashboard/PersonalBestsDisplay';
import { getTasks, getCurrentMode } from '@/lib/storage';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useDisciplineScore } from '@/hooks/useDisciplineScore';
import { usePersonalBests } from '@/hooks/usePersonalBests';
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
  const { score, level, color, progressBarColor, isClient } = useDisciplineScore(allTasks);
  const { personalBests, isClient: isPBsClient } = usePersonalBests(allTasks, score);

  return (
    <div className="space-y-6">
      {/* Personal Bests */}
      {isPBsClient && personalBests && (
        <PersonalBestsDisplay personalBests={personalBests} />
      )}

      {/* Discipline Score */}
      {isClient && (
        <DisciplineScoreDisplay
          score={score}
          level={level}
          color={color}
          progressBarColor={progressBarColor}
        />
      )}
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyChart data={analytics?.weekly || null} />
        <RecoveryScore data={analytics?.recovery || null} />
      </div>
    </div>
  );
}
