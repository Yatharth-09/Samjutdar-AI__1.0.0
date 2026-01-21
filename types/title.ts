export interface LevelTitle {
  id: string;
  name: string;
  minLevel: number;
  maxLevel: number | null; // null means no upper bound
  description: string;
}

export interface TitleState {
  selectedTitleId: string | null; // ID of the title the user has chosen to display
}
