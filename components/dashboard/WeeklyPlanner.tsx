'use client';

import { useState, useEffect } from 'react';
import { useWeeklyTasks } from '@/hooks/useWeeklyTasks';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { TASK_CATEGORIES, CATEGORY_LABELS } from '@/lib/constants';
import type { TaskCategory } from '@/types/task';
import type { TasksByDate } from '@/types/task';
import type { WeeklyTask, WeeklyWorkoutPlan } from '@/types/weeklyTask';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { BodyTransformationMode } from '@/types/mode';


const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

interface WeeklyPlannerProps {
  currentMode?: BodyTransformationMode;
  allTasks?: TasksByDate;
}

export const WeeklyPlanner = ({ 
  currentMode = 'maintenance',
  allTasks = {},
}: WeeklyPlannerProps) => {
  const {
    getWeeklyTasksArray,
    addWeeklyTask,
    toggleWeeklyTaskActive,
    deleteWeeklyTask,
    updateWeeklyTask,
    generateWeeklyPlan,
    applySuggestedPlan,
    clearSuggestedPlan,
    acceptSuggestion,
    getSuggestedTasks,
    getUserCreatedTasks,
    weeklyPlan,
  } = useWeeklyTasks();

  // Get analytics with proper parameters
  const analytics = useAnalytics(allTasks, currentMode);

  const [newTaskText, setNewTaskText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>('Workout');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiPlan, setAiPlan] = useState<WeeklyWorkoutPlan | null>(weeklyPlan);

  // Generate AI plan on mount or mode change
  useEffect(() => {
    const plan = generateWeeklyPlan(currentMode, analytics || null);
    setAiPlan(plan);
  }, [currentMode, generateWeeklyPlan, analytics]);

  const weeklyTasksArray = getWeeklyTasksArray();
  const suggestedTasks = getSuggestedTasks();
  const userCreatedTasks = getUserCreatedTasks();

  const getDayLabel = (day: number): string => {
    return DAYS_OF_WEEK.find((d) => d.value === day)?.label || String(day);
  };

  const getActiveTasksForDay = (day: number): WeeklyTask[] => {
    return weeklyTasksArray.filter((t) => t.active && (t.daysOfWeek || []).includes(day));
  };

  const handleDayToggle = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleAddWeeklyTask = () => {
    if (!newTaskText.trim()) return;
    if (selectedDays.length === 0) {
      alert('Please select at least one day of the week');
      return;
    }

    addWeeklyTask(newTaskText.trim(), selectedCategory, selectedDays);

    // Reset form
    setNewTaskText('');
    setSelectedDays([]);
    setSelectedCategory('Workout');
  };

  const handleApplyAllSuggestions = () => {
    if (aiPlan) {
      applySuggestedPlan(aiPlan);
      setShowAISuggestions(false);
    }
  };

  const handleAcceptSuggestion = (taskId: string) => {
    acceptSuggestion(taskId);
  };

  const handleClearSuggestions = () => {
    if (confirm('Remove all AI suggestions? Your custom tasks will remain.')) {
      clearSuggestedPlan();
    }
  };

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📅 Weekly Planner
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create recurring tasks that automatically appear on selected days
          </p>
        </div>

        {/* AI Suggestions Section */}
        {aiPlan && suggestedTasks.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border-2 border-purple-200 dark:border-purple-700 p-4 rounded-lg space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  🤖 AI-Suggested Workout Plan
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Week starting {new Date(aiPlan.weekStartDate).toLocaleDateString()} •{' '}
                  Recovery: {aiPlan.recoveryScore}/100 • Consistency: {aiPlan.completionConsistency}%
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAISuggestions(!showAISuggestions)}
                  className="px-3 py-1 rounded text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  {showAISuggestions ? 'Hide' : 'Show'} Details
                </button>
                <button
                  onClick={handleClearSuggestions}
                  className="px-3 py-1 rounded text-sm font-medium bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {showAISuggestions && (
              <div className="space-y-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Accept individual workouts below or apply all at once:
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleApplyAllSuggestions}
                    className="flex-1 px-4 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    ✅ Accept All Suggestions
                  </button>
                </div>
              </div>
            )}

            {/* Suggested Workouts Display */}
            {showAISuggestions && suggestedTasks.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {suggestedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-300 dark:border-purple-600"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase bg-purple-200 dark:bg-purple-700 text-purple-900 dark:text-purple-100 px-2 py-0.5 rounded">
                            AI Suggested
                          </span>
                        </div>
                        <p className="font-medium text-gray-900 dark:text-white mt-1">
                          {task.text}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <span>{CATEGORY_LABELS[task.category]}</span>
                      <span>•</span>
                      <span>{DAYS_OF_WEEK.find((d) => d.value === task.daysOfWeek?.[0])?.label}</span>
                    </div>
                    <button
                      onClick={() => handleAcceptSuggestion(task.id)}
                      className="w-full px-2 py-1 rounded text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Accept This
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add New Weekly Task Form */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Add New Weekly Task
          </h3>

          <Input
            placeholder="e.g., Morning workout, Meal prep, Cardio session"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddWeeklyTask();
              }
            }}
          />

          <Select
            label="Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as TaskCategory)}
            options={TASK_CATEGORIES.map((cat) => ({
              value: cat,
              label: CATEGORY_LABELS[cat],
            }))}
          />

          {/* Day Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Repeat on
            </label>
            <div className="flex gap-2 flex-wrap">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => handleDayToggle(day.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedDays.includes(day.value)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleAddWeeklyTask} className="w-full">
            ➕ Add Weekly Task
          </Button>
        </div>

        {/* Existing Weekly Tasks */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Your Weekly Tasks ({weeklyTasksArray.length})
          </h3>

          {weeklyTasksArray.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No weekly tasks yet. Create one above to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {/* User-Created Tasks */}
              {userCreatedTasks.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Custom Tasks
                  </h4>
                  <div className="space-y-2">
                    {userCreatedTasks.map((task) => (
                      <WeeklyTaskItem
                        key={task.id}
                        task={task}
                        isSuggested={false}
                        onToggleActive={() => toggleWeeklyTaskActive(task.id)}
                        onDelete={() => {
                          if (confirm('Delete this weekly task? Past completed tasks will remain.')) {
                            deleteWeeklyTask(task.id);
                          }
                        }}
                        onAccept={undefined}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* AI-Suggested Tasks */}
              {suggestedTasks.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                    🤖 AI Suggestions
                  </h4>
                  <div className="space-y-2">
                    {suggestedTasks.map((task) => (
                      <WeeklyTaskItem
                        key={task.id}
                        task={task}
                        isSuggested={true}
                        onToggleActive={() => toggleWeeklyTaskActive(task.id)}
                        onDelete={() => {
                          if (confirm('Delete this AI-suggested task?')) {
                            deleteWeeklyTask(task.id);
                          }
                        }}
                        onAccept={() => handleAcceptSuggestion(task.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Weekly Task Item Component
interface WeeklyTaskItemProps {
  task: WeeklyTask;
  isSuggested: boolean;
  onToggleActive: () => void;
  onDelete: () => void;
  onAccept?: () => void;
}

const WeeklyTaskItem = ({
  task,
  isSuggested,
  onToggleActive,
  onDelete,
  onAccept,
}: WeeklyTaskItemProps) => {
  const getDayLabels = (days: number[]): string => {
    return days
      .map((d) => DAYS_OF_WEEK.find((day) => day.value === d)?.label)
      .join(', ');
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all ${
        task.active
          ? isSuggested
            ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20'
            : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 opacity-60'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {CATEGORY_LABELS[task.category]}
            </span>
            {isSuggested && (
              <span className="text-xs font-bold uppercase bg-purple-200 dark:bg-purple-700 text-purple-900 dark:text-purple-100 px-2 py-0.5 rounded">
                AI
              </span>
            )}
            {!task.active && (
              <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                Paused
              </span>
            )}
          </div>
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {task.text}
          </p>
          <div className="flex gap-1 flex-wrap">
            {task.daysOfWeek.map((day) => (
              <span
                key={day}
                className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
              >
                {DAYS_OF_WEEK.find((d) => d.value === day)?.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {isSuggested && onAccept && (
            <button
              onClick={onAccept}
              className="px-3 py-1 rounded text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              Accept
            </button>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleActive}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                task.active ? '' : ''
              }`}
            >
              <img
                src={task.active ? '/icons/pause.png' : '/icons/play.png'}
                alt={task.active ? 'Pause' : 'Resume'}
                className="mx-auto h-6 w-6 opacity-90"
              />
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              <img
                src="/icons/delete.png"
                alt="Delete"
                className="mx-auto h-6 w-6 opacity-90"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
