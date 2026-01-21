export interface DisciplineScoreState {
  score: number; // 0 to 100
  lastUpdatedDate: string; // YYYY-MM-DD of last update
}

export type DisciplineLevel = 'Unstable' | 'Building' | 'Disciplined' | 'Elite Discipline';
