export interface PersonalBest {
  value: number;
  dateAchieved: string; // YYYY-MM-DD
}

export interface PersonalBestsState {
  mostTasksInDay: PersonalBest;
  longestStreak: PersonalBest;
  mostXPInDay: PersonalBest;
  mostXPInWeek: PersonalBest;
  mostPerfectWeeks: PersonalBest;
  highestDisciplineScore: PersonalBest;
}
