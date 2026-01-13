'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { WeeklyPlannerSaver } from '@/components/dashboard/WeeklyPlannerSaver';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useWeeklyTasks } from '@/hooks/useWeeklyTasks';
import { MUSCLE_GROUPS, WORKOUT_CATALOG, type MuscleGroup, type WorkoutCatalogItem } from '@/lib/workouts';
import type { TaskCategory } from '@/types/task';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

export default function SaveWorkoutPage() {
  const { addWeeklyTask, getWeeklyTasksArray } = useWeeklyTasks();
  const weeklyTasksArray = getWeeklyTasksArray();

  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [activeWorkoutIds, setActiveWorkoutIds] = useState<string[]>([]);

  const groupedWorkouts = useMemo(() => {
    const groups: Record<MuscleGroup, WorkoutCatalogItem[]> = {
      Chest: [],
      Back: [],
      Legs: [],
      Shoulders: [],
      Arms: [],
      Core: [],
      Cardio: [],
    };

    WORKOUT_CATALOG.forEach((w) => {
      groups[w.muscleGroup].push(w);
    });

    return groups;
  }, []);

  const activeWorkouts = useMemo(() => {
    const byId = new Map(WORKOUT_CATALOG.map((w) => [w.id, w] as const));
    return activeWorkoutIds.map((id) => byId.get(id)).filter(Boolean) as WorkoutCatalogItem[];
  }, [activeWorkoutIds]);

  const getTaskCategoryForWorkout = (workout: WorkoutCatalogItem): TaskCategory => {
    return workout.muscleGroup === 'Cardio' ? 'Cardio' : 'Workout';
  };

  const handleWorkoutClick = (workout: WorkoutCatalogItem) => {
    setActiveWorkoutIds((prev) => [...prev, workout.id]);

    const category = getTaskCategoryForWorkout(workout);
    const normalized = workout.name.trim().toLowerCase();
    const existsForDay = weeklyTasksArray.some((t) => {
      const sameText = t.text.trim().toLowerCase() === normalized;
      const sameCategory = t.category === category;
      const onDay = (t.daysOfWeek || []).includes(selectedDay);
      return sameText && sameCategory && onDay;
    });

    if (!existsForDay) {
      addWeeklyTask(workout.name, category, [selectedDay]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Card className="p-4 sm:p-4">
        <WeeklyPlannerSaver />

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Workout Builder
          </h3>

          <Select
            label="Day"
            value={String(selectedDay)}
            onChange={(e) => setSelectedDay(parseInt(e.target.value, 10))}
            options={DAYS_OF_WEEK.map((d) => ({ value: String(d.value), label: d.label }))}
          />

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              Current Set
            </div>
            {activeWorkouts.length === 0 ? (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Click workouts below to build today’s set.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {activeWorkouts.map((w, idx) => (
                  <Button
                    key={`${w.id}_${idx}`}
                    size="sm"
                    variant="secondary"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    {w.name}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {MUSCLE_GROUPS.map((group) => (
              <div key={group} className="space-y-2">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {group}
                </div>
                <div className="flex flex-wrap gap-2">
                  {groupedWorkouts[group].map((workout) => (
                    <Button
                      key={workout.id}
                      size="sm"
                      variant="secondary"
                      className="text-gray-700 dark:text-gray-300"
                      onClick={() => handleWorkoutClick(workout)}
                    >
                      {workout.name}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
