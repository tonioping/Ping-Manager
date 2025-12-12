import { supabase } from './supabase';

type TableName = 'sessions' | 'cycles' | 'players' | 'custom_exercises' | 'profiles' | 'player_evaluations';

const LOCAL_KEYS: Record<TableName, string> = {
  sessions: 'pingmanager_sessions',
  cycles: 'pingmanager_cycles',
  players: 'pingmanager_players',
  custom_exercises: 'pingmanager_exercises',
  profiles: 'pingmanager_profile',
  player_evaluations: 'pingmanager_evaluations'
};

export const storage = {
  async list(table: TableName, userId?: string) {
    if (supabase && userId) {
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw error;
      return data || [];
    } else {
      const item = localStorage.getItem(LOCAL_KEYS[table]);
      return item ? JSON.parse(item) : [];
    }
  },

  async save(table: TableName, data: any, userId?: string, idField: string = 'id') {
    if (supabase && userId) {
      const payload = { ...data, user_id: userId };
      // Sanitize specifically for players to avoid date format errors
      if(table === 'players' && payload.birth_date === '') {
        payload.birth_date = null;
      }
      const { data: res, error } = await supabase.from(table).upsert(payload, { onConflict: idField }).select();
      if (error) throw error;
      return res?.[0];
    } else {
      const current = await this.list(table);
      const index = current.findIndex((item: any) => item[idField] === data[idField]);
      let updated;
      if (index >= 0) {
        updated = current.map((item: any) => item[idField] === data[idField] ? data : item);
      } else {
        updated = [data, ...current];
      }
      localStorage.setItem(LOCAL_KEYS[table], JSON.stringify(updated));
      return data;
    }
  },

  async delete(table: TableName, id: any, userId?: string, idField: string = 'id') {
    if (supabase && userId) {
      const { error } = await supabase.from(table).delete().eq(idField, id);
      if (error) throw error;
    } else {
      const current = await this.list(table);
      const updated = current.filter((item: any) => item[idField] !== id);
      localStorage.setItem(LOCAL_KEYS[table], JSON.stringify(updated));
    }
  },

  // Spécifique pour gérer les conflits d'ID composites (ex: évaluations)
  async saveEvaluation(data: any, userId?: string) {
      if (supabase && userId) {
          const payload = { ...data, user_id: userId };
          const { error } = await supabase.from('player_evaluations').upsert(payload, { onConflict: 'player_id, skill_id, date' });
          if(error) throw error;
      } else {
          const current = await this.list('player_evaluations');
          // On retire l'ancienne éval identique (même joueur, skill, date)
          const filtered = current.filter((e: any) => !(e.player_id === data.player_id && e.skill_id === data.skill_id && e.date === data.date));
          filtered.push(data);
          localStorage.setItem(LOCAL_KEYS['player_evaluations'], JSON.stringify(filtered));
      }
  }
};