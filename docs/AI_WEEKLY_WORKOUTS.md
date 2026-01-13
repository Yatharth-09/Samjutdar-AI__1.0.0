# AI-Suggested Weekly Workout Plans

## Overview

The AI-Suggested Weekly Workout Plans feature automatically generates mode-specific workout suggestions based on:
- **Body Transformation Mode** (Fat Loss, Muscle Gain, or Maintenance)
- **Recovery Score** (from analytics)
- **Completion Consistency** (from analytics)

The generated plan **adapts intelligently** without forcing users into a rigid routine.

---

## Architecture

### Files Modified/Created

1. **[types/weeklyTask.ts](../types/weeklyTask.ts)** - New types:
   - `SuggestedWorkout`: Individual AI-suggested workout
   - `WeeklyWorkoutPlan`: Complete weekly plan with adaptations

2. **[lib/constants.ts](../lib/constants.ts)** - New constants:
   - `WORKOUT_TEMPLATES`: Mode-based workout templates (3-6 sessions per mode)
   - `STORAGE_KEYS.WEEKLY_PLAN`: localStorage key for plan persistence

3. **[lib/ai.ts](../lib/ai.ts)** - New functions:
   - `getSuggestedWeeklyPlan(mode, analytics)` → Generates weekly plan with adaptation logic
   - `getMonday(date)` → Calculates Monday of the week (YYYY-MM-DD)
   - `hasWeekChanged(lastPlanDate)` → Prevents mid-week regeneration

4. **[hooks/useWeeklyTasks.ts](../hooks/useWeeklyTasks.ts)** - Enhanced hook:
   - `generateWeeklyPlan(mode, analytics)` → Generates and caches plan
   - `applySuggestedPlan(plan)` → Adds suggestions as weekly tasks (non-destructive)
   - `clearSuggestedPlan()` → Removes all suggestions
   - `acceptSuggestion(id)` → Converts suggestion to user task
   - `getSuggestedTasks()` → Returns AI suggestions only
   - `getUserCreatedTasks()` → Returns user's custom tasks

5. **[components/dashboard/WeeklyPlanner.tsx](../components/dashboard/WeeklyPlanner.tsx)** - Enhanced UI:
   - Displays AI suggestions with "AI Suggested" badge
   - "Accept All" or individual "Accept" buttons
   - Visual distinction: Purple border for suggestions, blue for user tasks
   - "Show Details" / "Hide" toggle for suggestions
   - "Clear" button to remove all suggestions for the week

---

## Adaptation Logic

The AI applies **three simple rules** to adapt the plan:

### Rule 1: Low Recovery Score (< 60)
```
→ Reduce volume (remove high-intensity workouts)
→ Add recovery-focused sessions
→ Keep max 1 workout per day when volume reduced
```

### Rule 2: High Consistency (> 80%)
```
→ Keep all suggested workouts
→ Include high-intensity variations
→ Slightly increase challenge
```

### Rule 3: Low Consistency (< 50%)
```
→ Reduce complexity (filter high-intensity)
→ Maintain frequency (don't skip days)
→ Keep structure simple
```

---

## Workout Templates by Mode

### Fat Loss Mode (4-6 sessions/week)
- **Mon**: Upper Body Strength Circuit + Cardio Finisher (High)
- **Tue**: Lower Body Strength + Steady Cardio (High)
- **Wed**: Light Mobility + Low-Intensity Cardio (Low)
- **Thu**: Full Body Circuit (High)
- **Fri**: Accessory Strength + Cardio Finisher (Moderate)
- **Sat**: Yoga/Stretching (Low)
- **Sun**: Complete Rest (Low)

### Muscle Gain Mode (4-5 sessions/week)
- **Mon**: Chest & Triceps Strength (High)
- **Tue**: Back & Biceps Strength (High)
- **Wed**: Mobility & Light Cardio (Low)
- **Thu**: Lower Body Hypertrophy (High)
- **Fri**: Shoulders & Arms (Moderate)
- **Sat**: Full Body Compound Day (Moderate)
- **Sun**: Complete Rest (Low)

### Maintenance Mode (3-4 sessions/week)
- **Mon**: Upper Body Strength (Moderate)
- **Tue**: Steady Cardio (Moderate)
- **Wed**: Yoga & Mobility (Low)
- **Thu**: Lower Body Strength (Moderate)
- **Fri**: Cardio Variety (Low)
- **Sat**: Active Rest or Sport (Low)
- **Sun**: Rest Day (Low)

---

## Key Features

### ✅ Non-Destructive
- Suggestions **never overwrite** user-created tasks
- User can mix suggestions with custom tasks
- Full control over what gets added

### ✅ No Mid-Week Regeneration
- Plan generates only on **week start** (Monday)
- Calling `generateWeeklyPlan` mid-week returns cached plan
- New plan only generated when week changes

### ✅ Persistence
- Plans stored in `localStorage` under `WEEKLY_PLAN` key
- Survives page refreshes
- Can be cleared explicitly

### ✅ Visual Distinction
- AI Suggestions: **Purple border**, "AI" badge
- User Tasks: **Blue border**, no badge
- Easy to identify source at a glance

### ✅ User Autonomy
- "Accept All" for quick adoption
- "Accept This" for individual workouts
- "Pause" to temporarily disable
- "Delete" to remove completely
- "Accept" button converts suggestion to user task

---

## Data Flow

```
┌─────────────────────────────────────────────────────┐
│ User Selects Body Mode or Page Loads               │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ useWeeklyTasks.generateWeeklyPlan() called          │
│ Passes: mode, analytics                             │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ ai.getSuggestedWeeklyPlan()                         │
│ • Gets Monday of week                              │
│ • Checks if plan already exists (cached)           │
│ • Applies adaptation rules based on:               │
│   - Recovery score                                 │
│   - Completion consistency                         │
│ • Selects from WORKOUT_TEMPLATES                   │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ WeeklyWorkoutPlan returned with SuggestedWorkouts   │
│ Stored in localStorage (WEEKLY_PLAN)               │
│ Stored in hook state (weeklyPlan)                  │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ WeeklyPlanner displays suggestions with:           │
│ • AI Suggestions section (collapsible)             │
│ • Preview of workouts                              │
│ • "Accept All" button                              │
│ • Individual "Accept This" buttons                 │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ User clicks "Accept All" or "Accept This"          │
│ applySuggestedPlan() or acceptSuggestion() called  │
│ Suggestions added as WeeklyTask with isSuggested=true
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ Tasks display in "Your Weekly Tasks" section       │
│ User can modify, pause, or delete each task        │
└─────────────────────────────────────────────────────┘
```

---

## Usage Example

### 1. Component Integration

```tsx
<WeeklyPlanner currentMode={selectedMode} />
```

### 2. Manual Hook Usage

```tsx
const { generateWeeklyPlan, applySuggestedPlan, weeklyPlan } = useWeeklyTasks();
const { analytics } = useAnalytics();

// Generate plan
const plan = generateWeeklyPlan('fatloss', analytics);

// Apply all suggestions
applySuggestedPlan(plan);

// Or clear suggestions
clearSuggestedPlan();
```

### 3. Accepting Individual Suggestions

```tsx
const { acceptSuggestion } = useWeeklyTasks();

acceptSuggestion('wt_sw_monday_strength_123');
// Now that task is user-created (isSuggested = false)
```

---

## Testing

### Scenario 1: Low Recovery Score
```
Inputs:
- Mode: Fat Loss
- Recovery Score: 45
- Consistency: 50%

Expected:
- Volume reduced (fewer/lower intensity workouts)
- Recovery day added (Wednesday mobility)
- Max 1 workout per day
```

### Scenario 2: High Consistency
```
Inputs:
- Mode: Muscle Gain
- Recovery Score: 85
- Consistency: 90%

Expected:
- All templates included
- High-intensity workouts present
- Full 4-5 session structure
```

### Scenario 3: Mid-Week Check
```
Inputs:
- Week Started: Monday (2026-01-05)
- Current Day: Thursday (2026-01-08)
- Call: generateWeeklyPlan()

Expected:
- Returns cached plan (not regenerated)
- Same suggestions as Monday
```

---

## Edge Cases Handled

✅ **No Analytics Data**: Defaults to recovery=75, consistency=50 (safe defaults)
✅ **Week Boundary**: Monday calculation handles Sunday correctly (day 0)
✅ **Duplicate Prevention**: `isSuggested` flag prevents applying same suggestion twice
✅ **User Task Preservation**: Suggested tasks never overwrite existing user tasks
✅ **localStorage Unavailable**: useWeeklyTasks gracefully handles missing plan from storage

---

## Future Enhancements

- [ ] Learning: Track which suggestions users accept/reject
- [ ] Personalization: Adjust templates based on user preferences
- [ ] Notifications: Remind users of weekly plan at week start
- [ ] Sharing: Export weekly plan as PDF or share with coach
- [ ] Comparison: Show how suggested plan differs from last week
- [ ] Fine-tuning: Allow users to customize template library

---

## Principle: AI Suggests, User Decides

The entire feature is built around this core principle:

> **"AI generates smart defaults, but the user always has full control."**

- Suggestions never force changes
- User can accept, modify, or ignore entirely
- Custom tasks are always preserved
- Mid-week editing supported
- No locked-in plans
