export type BodyTransformationMode = 'fatloss' | 'muscle' | 'maintenance';

export interface ModeConfig {
  mode: BodyTransformationMode;
  description: string;
  primaryFocus: string;
  recoveryEmphasis: 'high' | 'medium' | 'low';
}
