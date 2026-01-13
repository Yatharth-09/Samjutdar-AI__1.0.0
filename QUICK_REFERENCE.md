# Quick Reference: AI Weekly Workout Plans

## For Component Developers

### Basic Implementation
```tsx
import { WeeklyPlanner } from '@/components/dashboard/WeeklyPlanner';

export default function Dashboard() {
  const [mode, setMode] = useState<BodyTransformationMode>('fatloss');
  
  return <WeeklyPlanner currentMode={mode} />;
}
```

### Custom Implementation
```tsx
import { useWeeklyTasks } from '@/hooks/useWeeklyTasks';
import { useAnalytics } from '@/hooks/useAnalytics';

export function CustomWeeklyView() {
  const { generateWeeklyPlan, applySuggestedPlan, weeklyPlan } = useWeeklyTasks();
  const { analytics } = useAnalytics();
  
  useEffect(() => {
    const plan = generateWeeklyPlan('muscle', analytics);
    // Use plan...
  }, []);
  
  return (
    <div>
      {weeklyPlan?.workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}
```

---

## Key Exports

### From `lib/ai.ts`
```typescript
export const getSuggestedWeeklyPlan: (
  mode: BodyTransformationMode, 
  analytics: AnalyticsState | null
) => WeeklyWorkoutPlan

export const hasWeekChanged: (lastPlanDate: string | null) => boolean
export const getMonday: (date: Date) => string
```

### From `hooks/useWeeklyTasks.ts`
```typescript
export const useWeeklyTasks = () => ({
  weeklyTasks: WeeklyTasksState,
  weeklyPlan: WeeklyWorkoutPlan | null,
  isLoading: boolean,
  
  // Original methods
  addWeeklyTask: (text, category, daysOfWeek) => void,
  updateWeeklyTask: (id, updates) => void,
  toggleWeeklyTaskActive: (id) => void,
  deleteWeeklyTask: (id) => void,
  getWeeklyTasksArray: () => WeeklyTask[],
  getActiveWeeklyTasks: () => WeeklyTask[],
  
  // New AI methods
  generateWeeklyPlan: (mode, analytics) => WeeklyWorkoutPlan,
  applySuggestedPlan: (plan) => void,
  clearSuggestedPlan: () => void,
  acceptSuggestion: (id) => void,
  getSuggestedTasks: () => WeeklyTask[],
  getUserCreatedTasks: () => WeeklyTask[],
})
```

### From `lib/constants.ts`
```typescript
export const WORKOUT_TEMPLATES: Record<
  BodyTransformationMode, 
  Record<number, WorkoutTemplate[]>
> // Keyed by mode, then by day (0-6)

export interface WorkoutTemplate {
  title: string,
  category: TaskCategory,
  intensity: 'low' | 'moderate' | 'high',
  description: string,
}
```

### From `types/weeklyTask.ts`
```typescript
export interface SuggestedWorkout {
  id: string,
  title: string,
  category: TaskCategory,
  intensity: 'low' | 'moderate' | 'high',
  primaryFocus: 'fatLoss' | 'muscle' | 'balanced',
  dayOfWeek: number,  // 0-6
  description?: string,
  isSuggested: true,
  weekStartDate: string,  // YYYY-MM-DD
}

export interface WeeklyWorkoutPlan {
  id: string,
  weekStartDate: string,  // YYYY-MM-DD (Monday)
  mode: BodyTransformationMode,
  workouts: SuggestedWorkout[],
  recoveryScore: number,  // 0-100
  completionConsistency: number,  // 0-100
  createdAt: number,  // timestamp
}

export interface WeeklyTask {
  // ... existing fields ...
  isSuggested?: boolean,  // NEW: marks AI suggestions
}
```

---

## Data Flow Cheat Sheet

```
User changes mode or page loads
          ↓
    useWeeklyTasks()
          ↓
    generateWeeklyPlan(mode, analytics)
          ↓
    Check: hasWeekChanged()? 
    YES → Generate new | NO → Return cached
          ↓
    getSuggestedWeeklyPlan()
          ↓
    Get Monday date → Get Templates for Mode
          ↓
    Apply Adaptation Rules:
    - Low Recovery (< 60)? → Reduce volume
    - High Consistency (> 80%)? → Keep all
    - Low Consistency (< 50%)? → Simplify
          ↓
    Return WeeklyWorkoutPlan
          ↓
    Save to localStorage[WEEKLY_PLAN]
          ↓
    UI renders suggestions
          ↓
    User clicks "Accept All" or "Accept This"
          ↓
    applySuggestedPlan() or acceptSuggestion()
          ↓
    Convert to WeeklyTask with isSuggested=true
          ↓
    Task appears in "Your Weekly Tasks"
```

---

## Common Patterns

### Accept All Suggestions
```tsx
const { applySuggestedPlan, weeklyPlan } = useWeeklyTasks();

if (weeklyPlan) {
  applySuggestedPlan(weeklyPlan);
}
```

### Clear All Suggestions
```tsx
const { clearSuggestedPlan } = useWeeklyTasks();

clearSuggestedPlan();
```

### Get Only User Tasks
```tsx
const { getUserCreatedTasks } = useWeeklyTasks();
const userTasks = getUserCreatedTasks();
```

### Get Only Suggestions
```tsx
const { getSuggestedTasks } = useWeeklyTasks();
const suggestions = getSuggestedTasks();
```

### Display with Visual Distinction
```tsx
const { isSuggested } = task;

const borderColor = isSuggested ? 'border-purple-400' : 'border-blue-500';
const bgColor = isSuggested ? 'bg-purple-50' : 'bg-blue-50';

return <div className={`border-2 ${borderColor} ${bgColor}`}>{task.text}</div>;
```

---

## Adaptation Rule Quick Reference

| Condition | Action | Result |
|-----------|--------|--------|
| Recovery < 60 | Remove high-intensity, add recovery, limit to 1/day | Fewer, gentler workouts |
| Consistency > 80 | Keep all templates, include high-intensity | Full plan as designed |
| Consistency < 50 | Filter high-intensity, maintain frequency | Simpler structure, same count |
| Recovery 60-100 | Normal variation based on mode | Standard templates |
| Consistency 50-80 | Moderate variation based on mode | Balanced approach |

---

## Testing Scenarios

### Low Recovery Test
```typescript
const analytics = {
  recovery: { score: 45 },  // < 60 triggers adaptation
  weekly: { overallCompletionRate: 60 },
};

const plan = getSuggestedWeeklyPlan('fatloss', analytics);
// Expected: Fewer workouts, mostly low-moderate intensity
```

### High Consistency Test
```typescript
const analytics = {
  recovery: { score: 80 },
  weekly: { overallCompletionRate: 90 },  // > 80 triggers challenge
};

const plan = getSuggestedWeeklyPlan('fatloss', analytics);
// Expected: All high-intensity workouts included
```

### No Week Change Test
```typescript
const lastPlan = getSuggestedWeeklyPlan('fatloss', analytics);
const shouldRegen = hasWeekChanged(lastPlan.weekStartDate);
// Expected: false (same week, same Monday)
```

---

## Common Issues & Solutions

### Issue: Suggestions not appearing
**Check**:
1. Is `weeklyPlan` null? → Analytics might be loading
2. Is `getSuggestedTasks()` empty? → Plan might not have rendered yet
3. Check localStorage for `ai_fitness_weekly_plan` key

**Fix**:
```tsx
useEffect(() => {
  generateWeeklyPlan(mode, analytics);
}, [mode, analytics]); // Re-generate when dependencies change
```

### Issue: Suggestions overwriting user tasks
**This shouldn't happen** - `applySuggestedPlan` checks:
```typescript
if (!weeklyTasks[id]) {  // Only add if doesn't exist
  newTasks[id] = newTask;
}
```

If it does, check that IDs aren't colliding.

### Issue: Plan regenerating mid-week
**Check**:
```typescript
if (weeklyPlan && !hasWeekChanged(weeklyPlan.weekStartDate)) {
  return weeklyPlan; // Should return cached
}
```

If not returning cached, ensure `weeklyStartDate` is correctly stored as Monday.

---

## Environment Requirements

- React 18+ (uses `useCallback`, `useEffect`)
- TypeScript 4.5+
- localStorage available (checks `typeof window !== 'undefined'`)

---

## Storage Schema

```json
{
  "ai_fitness_weekly_plan": {
    "id": "plan_2026-01-06_1234567890",
    "weekStartDate": "2026-01-06",
    "mode": "fatloss",
    "workouts": [
      {
        "id": "sw_2026-01-06_1_0_1234567890",
        "title": "Upper Body Strength Circuit",
        "category": "Workout",
        "intensity": "high",
        "primaryFocus": "fatLoss",
        "dayOfWeek": 1,
        "description": "...",
        "isSuggested": true,
        "weekStartDate": "2026-01-06"
      }
    ],
    "recoveryScore": 75,
    "completionConsistency": 80,
    "createdAt": 1234567890
  }
}
```

---

## Performance Notes

- **Generation**: ~1ms (rule-based, no API calls)
- **Caching**: Instant return if week hasn't changed
- **Storage**: ~2-5KB per plan (small)
- **UI Render**: Minimal impact (just filter & display existing tasks)

---

## Version History

- **v1.0** (Current)
  - Mode-based templates
  - 3-rule adaptation logic
  - Non-destructive application
  - UI with suggestion panel
  - Full persistence

---

## Related Components

- `WeeklyPlanner` - Main UI component
- `Dashboard` - Parent component (likely)
- `useAnalytics` - Provides recovery & consistency data
- `useWeeklyTasks` - State management

---

## Next Steps for Integration

1. ✅ WeeklyPlanner is ready to use as-is
2. Pass `currentMode` prop from parent
3. Ensure `useAnalytics` is working
4. Test with different modes
5. Customize styles if needed
6. Optional: Add notifications on week start

---

## Support & Debugging

### Enable verbose logging:
```typescript
// In getSuggestedWeeklyPlan
console.log('Adaptation rules:', { 
  shouldReduceVolume, 
  shouldIncreaseChallenge,
  recoveryScore,
  completionConsistency 
});
console.log('Generated workouts:', suggestedWorkouts);
```

### Check state:
```typescript
const { weeklyPlan, getSuggestedTasks, getUserCreatedTasks } = useWeeklyTasks();

console.log('Current plan:', weeklyPlan);
console.log('Suggested:', getSuggestedTasks());
console.log('User created:', getUserCreatedTasks());
```
