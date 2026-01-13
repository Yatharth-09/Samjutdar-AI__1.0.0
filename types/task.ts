export type TaskCategory = 'Workout' | 'Cardio' | 'Diet' | 'Mindset' | 'Recovery';

export interface Task {
  id: string;
  text: string;
  category: TaskCategory;
  done: boolean;
  date: string; // ISO date string (YYYY-MM-DD)
  createdAt: number; // timestamp
  weeklyTaskId?: string; // Optional: links to weekly template
}

export interface TasksByDate {
  [date: string]: Task[];
}
