import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { storage } from '../lib/storage';
import { Exercise, Session, Cycle, Player, PlayerEvaluation, CoachProfile, Skill } from '../types';
import { INITIAL_EXERCISES, DEFAULT_SKILLS, EMPTY_SESSION } from '../constants';

export const useAppData = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerEvals, setPlayerEvals] = useState<PlayerEvaluation[]>([]);
  const [coachProfile, setCoachProfile] = useState<CoachProfile>({ 
    name: '', club: '', license: '', is_pro: false, subscription_status: 'free' 
  });

  // Auth & Init
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      let user = null;
      
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        user = data.session?.user || null;
        setSession(data.session);
      }

      try {
        const userId = user?.id;

        // Parallel fetching
        const [loadedExos, loadedSess, loadedCycles, loadedPlayers, loadedProfile] = await Promise.all([
          storage.list('custom_exercises', userId),
          storage.list('sessions', userId),
          storage.list('cycles', userId),
          storage.list('players', userId),
          userId ? storage.list('profiles', userId) : Promise.resolve([]) // Profile often singular
        ]);

        setExercises([...INITIAL_EXERCISES, ...loadedExos]);
        
        // Sort sessions by date desc
        setSessions((loadedSess as Session[]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        
        // Map cycles correctly
        const mappedCycles = (loadedCycles as any[]).map(c => ({
           ...c,
           startDate: c.start_date || c.startDate, // Handle both snake_case (DB) and camelCase (Local)
           weeks: typeof c.weeks === 'string' ? JSON.parse(c.weeks) : c.weeks
        }));
        setCycles(mappedCycles);
        
        setPlayers(loadedPlayers);

        if (loadedProfile && loadedProfile.length > 0 || !userId) {
             const p = Array.isArray(loadedProfile) ? loadedProfile[0] : loadedProfile;
             if (p) {
                setCoachProfile({
                    name: p.full_name || p.name || '',
                    club: p.club_name || p.club || '',
                    license: p.license_number || p.license || '',
                    is_pro: p.is_pro || false,
                    subscription_status: p.subscription_status || 'free'
                });
             } else if (!userId) {
                 // Try local for profile
                 const localP = localStorage.getItem('pingmanager_profile');
                 if(localP) setCoachProfile(JSON.parse(localP));
             }
        }

      } catch (e) {
        console.error("Error initializing data", e);
      } finally {
        setLoading(false);
      }
    };

    initData();

    const { data: authListener } = supabase ? supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT') initData();
    }) : { data: { subscription: { unsubscribe: () => {} } } };

    return () => authListener.subscription.unsubscribe();
  }, []);

  // Actions
  const saveSessionData = useCallback(async (newSession: Session) => {
      const isNew = newSession.id === 0;
      const sessionToSave = { ...newSession, id: isNew ? Date.now() : newSession.id };
      await storage.save('sessions', sessionToSave, session?.user?.id);
      
      setSessions(prev => {
          const updated = isNew ? [sessionToSave, ...prev] : prev.map(s => s.id === sessionToSave.id ? sessionToSave : s);
          return updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
      return sessionToSave;
  }, [session]);

  const saveCycleData = useCallback(async (cycle: Cycle) => {
      // Mapping for DB compatibility (start_date)
      const payload = { ...cycle, start_date: cycle.startDate };
      await storage.save('cycles', payload, session?.user?.id);
      setCycles(prev => {
          const exists = prev.find(c => c.id === cycle.id);
          return exists ? prev.map(c => c.id === cycle.id ? cycle : c) : [...prev, cycle];
      });
  }, [session]);

  const deleteCycleData = useCallback(async (id: number) => {
      await storage.delete('cycles', id, session?.user?.id);
      setCycles(prev => prev.filter(c => c.id !== id));
  }, [session]);

  const savePlayerData = useCallback(async (player: Player) => {
      await storage.save('players', player, session?.user?.id);
      setPlayers(prev => {
          const exists = prev.find(p => p.id === player.id);
          return exists ? prev.map(p => p.id === player.id ? player : p) : [...prev, player];
      });
  }, [session]);

  const deletePlayerData = useCallback(async (id: string) => {
      await storage.delete('players', id, session?.user?.id);
      setPlayers(prev => prev.filter(p => p.id !== id));
  }, [session]);

  const saveEvaluationData = useCallback(async (evalItem: PlayerEvaluation) => {
      await storage.saveEvaluation(evalItem, session?.user?.id);
      // Optimistic update
      setPlayerEvals(prev => {
          const others = prev.filter(e => !(e.player_id === evalItem.player_id && e.skill_id === evalItem.skill_id && e.date === evalItem.date));
          return [evalItem, ...others];
      });
  }, [session]);
  
  const loadEvaluationsForPlayer = useCallback(async (playerId: string) => {
      // Fetch only if needed or generic list? Storage list gets all usually, but for DB we might want filter
      if (supabase && session?.user?.id) {
          const { data } = await supabase.from('player_evaluations').select('*').eq('player_id', playerId);
          setPlayerEvals(data || []);
      } else {
         const all = await storage.list('player_evaluations');
         setPlayerEvals(all.filter((e: any) => e.player_id === playerId));
      }
  }, [session]);
  
  const saveProfileData = useCallback(async (profile: CoachProfile) => {
     if (session?.user?.id) {
         await storage.save('profiles', { 
             id: session.user.id, 
             full_name: profile.name, 
             club_name: profile.club, 
             license_number: profile.license 
         }, session.user.id);
     } else {
         localStorage.setItem('pingmanager_profile', JSON.stringify(profile));
     }
     setCoachProfile(profile);
  }, [session]);

  const saveCustomExercise = useCallback(async (exo: Exercise) => {
      await storage.save('custom_exercises', exo, session?.user?.id);
      setExercises(prev => [...prev, exo]);
  }, [session]);

  return {
    user: session?.user,
    loading,
    data: { exercises, sessions, cycles, players, playerEvals, coachProfile },
    actions: {
        saveSession: saveSessionData,
        saveCycle: saveCycleData,
        deleteCycle: deleteCycleData,
        savePlayer: savePlayerData,
        deletePlayer: deletePlayerData,
        saveEvaluation: saveEvaluationData,
        loadPlayerEvaluations: loadEvaluationsForPlayer,
        saveProfile: saveProfileData,
        saveExercise: saveCustomExercise,
        logout: async () => { if(supabase) await supabase.auth.signOut(); setSession(null); }
    }
  };
};