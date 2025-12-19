
export type PhaseId = 'echauffement' | 'regularite' | 'technique' | 'deplacement' | 'schema' | 'matchs';

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
  user_id?: string;
}

export interface Session {
  id: number;
  name: string;
  date: string;
  exercises: Record<PhaseId, Exercise[]>;
  user_id?: string;
}

export interface CycleWeek {
  weekNumber: number;
  theme: string;
  notes: string;
  sessionId?: number;
  sessionName?: string;
}

export type CycleType = 'developpement' | 'competition' | 'recuperation' | 'pre-saison';

export interface Cycle {
  id: number;
  name: string;
  startDate: string;
  weeks: CycleWeek[];
  type: CycleType;
  objectives: string;
  user_id?: string;
  group?: string; // Ajout du groupe cible
}

export interface CoachProfile {
  name: string;
  club: string;
  license: string;
  is_pro?: boolean;
  subscription_status?: string;
}

export type AIProvider = 'google' | 'openrouter';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

export type View = 'dashboard' | 'sessions' | 'history' | 'library' | 'calendar' | 'settings' | 'players' | 'subscription';

export interface Player {
    id: string;
    first_name: string;
    last_name: string;
    birth_date?: string;
    age?: number;
    level: 'Debutants' | 'Intermediaire' | 'Avance' | 'Elite';
    group?: string; 
    notes?: string;
    user_id?: string;
    
    // Ping Specifics
    ranking?: number; // Points (ex: 1250)
    hand?: 'Droitier' | 'Gaucher';
    grip?: 'Europeenne' | 'Porte-Plume';
    
    // Equipment
    blade?: string;
    rubber_fh?: string;
    rubber_bh?: string;
    last_equipment_change?: string; // Date
}

export interface Skill {
    id: string;
    name: string;
    category: string;
}

export interface PlayerEvaluation {
    id?: number;
    player_id: string;
    skill_id: string;
    score: number;
    date: string;
    comment?: string;
    user_id?: string;
}
