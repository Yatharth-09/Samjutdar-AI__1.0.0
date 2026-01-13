'use client';

import { useEffect, useState } from 'react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useWeeklyTasks } from '@/hooks/useWeeklyTasks';
import { getWeeklyPlans, saveWeeklyPlans } from '@/lib/storage';
import type { WeeklyPlan, WeeklyPlanItem } from '@/types/weeklyPlan';
import type { WeeklyTask } from '@/types/weeklyTask';

export const WeeklyPlannerSaver = () => {
  const { getWeeklyTasksArray, addWeeklyTask, deleteWeeklyTask } = useWeeklyTasks();

  const [savedWeeklyPlans, setSavedWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [selectedWeeklyPlanId, setSelectedWeeklyPlanId] = useState<string>('');

  const weeklyTasksArray = getWeeklyTasksArray();

  useEffect(() => {
    const storedPlans = getWeeklyPlans();
    setSavedWeeklyPlans(storedPlans);
    if (storedPlans.length > 0) {
      setSelectedWeeklyPlanId(storedPlans[0].id);
    }
  }, []);

  const getActiveTasksForDay = (day: number): WeeklyTask[] => {
    return weeklyTasksArray.filter((t) => t.active && (t.daysOfWeek || []).includes(day));
  };

  const tasksToPlanItems = (tasks: WeeklyTask[]): WeeklyPlanItem[] => {
    const seen = new Set<string>();
    const items: WeeklyPlanItem[] = [];
    tasks.forEach((t) => {
      const key = `${t.category}:${t.text.trim().toLowerCase()}`;
      if (seen.has(key)) return;
      seen.add(key);
      items.push({ text: t.text, category: t.category });
    });
    return items;
  };

  const buildWeeklyPlanSnapshot = (): Record<number, WeeklyPlanItem[]> => {
    const days: Record<number, WeeklyPlanItem[]> = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    };

    for (let day = 0; day < 7; day++) {
      days[day] = tasksToPlanItems(getActiveTasksForDay(day));
    }

    return days;
  };

  const handleSaveWeekAsPlan = () => {
    const snapshot = buildWeeklyPlanSnapshot();
    const taskCount = Object.values(snapshot).reduce((acc, items) => acc + items.length, 0);
    if (taskCount === 0) {
      alert('No active weekly tasks to save as a weekly plan.');
      return;
    }

    const name = prompt('Weekly plan name:', `Week Plan (${taskCount})`);
    if (!name || !name.trim()) return;

    const now = Date.now();
    const existing = savedWeeklyPlans.find(
      (p) => p.name.trim().toLowerCase() === name.trim().toLowerCase()
    );

    if (existing) {
      if (!confirm(`A weekly plan named "${existing.name}" already exists. Overwrite it?`)) return;
      const updatedPlans = savedWeeklyPlans.map((p) =>
        p.id === existing.id
          ? { ...p, days: snapshot, updatedAt: now }
          : p
      );
      setSavedWeeklyPlans(updatedPlans);
      setSelectedWeeklyPlanId(existing.id);
      saveWeeklyPlans(updatedPlans);
      return;
    }

    const newPlan: WeeklyPlan = {
      id: `wpl_${now}_${Math.random().toString(36).slice(2, 9)}`,
      name: name.trim(),
      days: snapshot,
      createdAt: now,
      updatedAt: now,
    };

    const updatedPlans = [newPlan, ...savedWeeklyPlans];
    setSavedWeeklyPlans(updatedPlans);
    setSelectedWeeklyPlanId(newPlan.id);
    saveWeeklyPlans(updatedPlans);
  };

  const handleLoadWeeklyPlan = () => {
    if (!selectedWeeklyPlanId) {
      alert('Select a weekly plan first.');
      return;
    }
    const plan = savedWeeklyPlans.find((p) => p.id === selectedWeeklyPlanId);
    if (!plan) return;

    if (!confirm(`Load "${plan.name}"? This will replace your current weekly tasks.`)) return;

    // Clear existing tasks (including AI suggestions)
    weeklyTasksArray.slice().forEach((t) => deleteWeeklyTask(t.id));

    // Apply tasks day-by-day
    for (let day = 0; day < 7; day++) {
      const items = (plan.days as any)[day] || (plan.days as any)[String(day)] || [];
      (items as WeeklyPlanItem[]).forEach((item) => {
        addWeeklyTask(item.text, item.category, [day]);
      });
    }
  };

  const handleDeleteWeeklyPlan = () => {
    if (!selectedWeeklyPlanId) {
      alert('Select a weekly plan first.');
      return;
    }
    const plan = savedWeeklyPlans.find((p) => p.id === selectedWeeklyPlanId);
    if (!plan) return;
    if (!confirm(`Delete weekly plan "${plan.name}"?`)) return;

    const updatedPlans = savedWeeklyPlans.filter((p) => p.id !== selectedWeeklyPlanId);
    setSavedWeeklyPlans(updatedPlans);
    setSelectedWeeklyPlanId(updatedPlans[0]?.id || '');
    saveWeeklyPlans(updatedPlans);
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900 dark:text-white">
        Weekly Planner Saver
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <Select
          label="Saved week"
          value={selectedWeeklyPlanId}
          onChange={(e) => setSelectedWeeklyPlanId(e.target.value)}
          options={[
            {
              value: '',
              label: savedWeeklyPlans.length ? 'Select a weekly plan' : 'No weekly plans yet',
            },
            ...savedWeeklyPlans.map((p) => ({ value: p.id, label: p.name })),
          ]}
        />
        <div className="flex gap-2">
          <Button onClick={handleLoadWeeklyPlan} className="flex-1">
            Load Week
          </Button>
          <Button onClick={handleSaveWeekAsPlan} variant="secondary" className="flex-1">
            Save Week
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleDeleteWeeklyPlan} variant="danger" size="sm">
          Delete
        </Button>
      </div>
    </div>
  );
};
