
export type PhaseId = 'echauffement' | 'regularite' | 'technique' | 'schema' | 'matchs';

export interface Phase {
  id: PhaseId;
  label: string;
  duration: number;
  color: string;
}

export interface Exercise {
  id: string;
  name: string;
  phase: PhaseId;
  theme: string | null;
  duration: number;
  description: string;
  material: string;
  instanceId?: number; 
}

export interface Session {
  id: number;
  name: string;
  date: string;
  exercises: Record<PhaseId, Exercise[]>;
}

export interface CycleWeek {
  weekNumber: number;
  theme: string;
  notes: string;
}

export interface Cycle {
  id: number;
  name: string;
  startDate: string;
  weeks: CycleWeek[];
}

export interface CoachProfile {
  name: string;
  club: string;
  license: string;
}

export type AIProvider = 'google' | 'openrouter';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

export type View = 'dashboard' | 'sessions' | 'history' | 'library' | 'calendar' | 'settings';
