export type BodyTransformationMode = 'fatloss' | 'muscle' | 'maintenance';

export interface ModeConfig {
  mode: BodyTransformationMode;
  description: string;
  primaryFocus: string;
  recoveryEmphasis: 'high' | 'medium' | 'low';
  philosophy: string; // Workout approach philosophy
  primaryCategories: string[]; // Categories that are primary focus
  secondaryCategories: string[]; // Categories that are secondary focus
}
