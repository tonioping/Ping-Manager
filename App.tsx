
import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { 
  Calendar as CalendarIcon, Plus, Save, Filter, X, 
  Clock, Target, Bot, Search, Menu, SaveAll, Sparkles, User, CheckCircle, AlertCircle,
  CreditCard, Award, UserCircle, Minus, Check, Settings, LogIn, LogOut, Loader2, Box
} from 'lucide-react';

import { Exercise, Session, Cycle, View, PhaseId, AIConfig, CoachProfile, CycleType, Player, PlayerEvaluation, Skill } from './types';
import { PHASES, INITIAL_EXERCISES, EMPTY_SESSION, CYCLE_TYPES, DEFAULT_SKILLS } from './constants';
import { refineExerciseDescription, suggestExercises, generateCyclePlan, type SuggestedExercise } from './services/geminiService';
import { GeminiButton } from './components/GeminiButton';
import { Sidebar } from './components/Sidebar'; 

// Lazy Loading des vues principales pour alléger le chargement initial
const DashboardView = React.lazy(() => import('./components/DashboardView').then(module => ({ default: module.DashboardView })));
const CyclesView = React.lazy(() => import('./components/CyclesView').then(module => ({ default: module.CyclesView })));
const SessionsView = React.lazy(() => import('./components/SessionsView').then(module => ({ default: module.SessionsView })));
const PlayersView = React.lazy(() => import('./components/PlayersView').then(module => ({ default: module.PlayersView })));

import { supabase } from './lib/supabase';
import Auth from './components/Auth';

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all animate-fade-in ${type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
    {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
    <span className="font-medium text-sm">{message}</span>
    <button onClick={onClose}><X size={16} className="opacity-50 hover:opacity-100" /></button>
  </div>
);

const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center text-indigo-600">
    <Loader2 className="animate-spin" size={40} />
  </div>
);

export default function App() {
  // User Session State
  const [session, setSession] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(true); 

  // App Data State
  const [view, setView] = useState<View>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentSession, setCurrentSession] = useState<Session>({...EMPTY_SESSION});
  const [savedSessions, setSavedSessions] = useState<Session[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [players, setPlayers] = useState<Player[]>([]); 
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS); 
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null); 
  const [playerEvals, setPlayerEvals] = useState<PlayerEvaluation[]>([]); 
  const [newPlayerMode, setNewPlayerMode] = useState(false); 

  const [aiConfig, setAiConfig] = useState<AIConfig>({ provider: 'google', apiKey: '', model: 'gemini-3-flash-preview' });
  const [coachProfile, setCoachProfile] = useState<CoachProfile>({ name: '', club: '', license: '', is_pro: false, subscription_status: 'free' });
  
  // Feedback State
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  // Forms State
  const [newExercise, setNewExercise] = useState<Omit<Exercise, 'id'> | null>(null);
  const [currentCycle, setCurrentCycle] = useState<Cycle | Omit<Cycle, 'id'> | null>(null);
  const [cycleToDelete, setCycleToDelete] = useState<number | null>(null);
  
  // Library Filtering
  const [libSearch, setLibSearch] = useState('');
  const [libFilterPanier, setLibFilterPanier] = useState(false);
  
  // AI State
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [suggestedExercises, setSuggestedExercises] = useState<SuggestedExercise[]>([]);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);

  // Refs
  const dateInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // 1. INITIALIZATION: Check Auth & Load Data
  useEffect(() => {
    if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) setShowAuth(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) setShowAuth(false);
        });

        return () => subscription.unsubscribe();
    } else {
        setShowAuth(false);
    }
  }, []);

  // 2. DATA LOADING LOGIC
  useEffect(() => {
    const loadData = async () => {
        if (session && supabase) {
            try {
                const { data: customExos } = await supabase.from('custom_exercises').select('*');
                setExercises([...INITIAL_EXERCISES, ...(customExos || [])]);

                const { data: sess } = await supabase.from('sessions').select('*').order('date', { ascending: false });
                setSavedSessions(sess || []);

                const { data: cyc } = await supabase.from('cycles').select('*').order('start_date', { ascending: true });
                const mappedCycles = (cyc || []).map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    startDate: c.start_date, 
                    weeks: c.weeks,
                    type: c.type || 'developpement',
                    objectives: c.objectives || '',
                    group: c.group || ''
                }));
                setCycles(mappedCycles);

                const { data: pl } = await supabase.from('players').select('*').order('last_name', { ascending: true });
                setPlayers(pl || []);
                
                const { data: allSkills } = await supabase.from('skills').select('*').order('name', { ascending: true });
                setSkills(allSkills && allSkills.length > 0 ? allSkills : DEFAULT_SKILLS);

                const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                if (profile) {
                    setCoachProfile({ 
                        name: profile.full_name || '', 
                        club: profile.club_name || '', 
                        license: profile.license_number || '',
                        is_pro: profile.is_pro || false,
                        subscription_status: profile.subscription_status || 'free'
                    });
                }

            } catch (error: any) {
                console.error("Error loading from Supabase:", error);
            }
        } 
        else {
            try {
                const exResult = localStorage.getItem('pingmanager_exercises');
                const sessResult = localStorage.getItem('pingmanager_sessions');
                const cyclesResult = localStorage.getItem('pingmanager_cycles');
                const playersResult = localStorage.getItem('pingmanager_players');
                const aiConfigResult = localStorage.getItem('pingmanager_ai_config');
                const profileResult = localStorage.getItem('pingmanager_profile');

                setExercises(exResult ? JSON.parse(exResult) : INITIAL_EXERCISES);
                setSavedSessions(sessResult ? JSON.parse(sessResult) : []);
                
                const loadedCycles = cyclesResult ? JSON.parse(cyclesResult) : [];
                setCycles(loadedCycles.map((c: any) => ({ ...c, type: c.type || 'developpement', objectives: c.objectives || '', group: c.group || '' })));
                
                setPlayers(playersResult ? JSON.parse(playersResult) : []);
                if (aiConfigResult) setAiConfig(JSON.parse(aiConfigResult));
                if (profileResult) setCoachProfile(JSON.parse(profileResult));
            } catch (e) {
                console.error("Local load error", e);
                setExercises(INITIAL_EXERCISES);
            }
        }
    };

    if (!showAuth) {
        loadData();
    }
  }, [session, showAuth]);

  // --- PERSISTENCE LOGIC (Condensed) ---
  const persistExercises = async (newExercises: Exercise[], newItem?: Exercise) => {
     setExercises(newExercises); 
     if (supabase && newItem) {
         const { data: { user } } = await supabase.auth.getUser();
         if (user) { await supabase.from('custom_exercises').insert({ ...newItem, user_id: user.id }); showToast("Exercice sauvegardé (Cloud)"); } 
         else { localStorage.setItem('pingmanager_exercises', JSON.stringify(newExercises)); showToast("Exercice sauvegardé (Local)"); }
     } else { localStorage.setItem('pingmanager_exercises', JSON.stringify(newExercises)); showToast("Exercice sauvegardé (Local)"); }
  };
  const persistSessions = async (newSessions: Session[], currentSess?: Session) => {
      setSavedSessions(newSessions);
      if (supabase && currentSess) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) { await supabase.from('sessions').upsert({ ...currentSess, user_id: user.id }); showToast("Séance sauvegardée (Cloud)"); }
          else { localStorage.setItem('pingmanager_sessions', JSON.stringify(newSessions)); }
      } else { localStorage.setItem('pingmanager_sessions', JSON.stringify(newSessions)); }
  };
  const persistCycles = async (newCycles: Cycle[], currentCyc?: Cycle) => {
      setCycles(newCycles);
      if (supabase && currentCyc) {
           const { data: { user } } = await supabase.auth.getUser();
           if (user) { 
               await supabase.from('cycles').upsert({ 
                   id: currentCyc.id, 
                   name: currentCyc.name, 
                   start_date: currentCyc.startDate, 
                   weeks: currentCyc.weeks, 
                   type: currentCyc.type, 
                   objectives: currentCyc.objectives, 
                   group: currentCyc.group,
                   user_id: user.id 
               }); 
               showToast("Cycle sauvegardé (Cloud)"); 
           } 
           else { localStorage.setItem('pingmanager_cycles', JSON.stringify(newCycles)); }
      } else { localStorage.setItem('pingmanager_cycles', JSON.stringify(newCycles)); }
  };
  const deleteCycleData = useCallback(async (id: number) => {
      const newCycles = cycles.filter(c => c.id !== id);
      setCycles(newCycles);
      if (supabase) { const { data: { user } } = await supabase.auth.getUser(); if (user) await supabase.from('cycles').delete().eq('id', id); } 
      else { localStorage.setItem('pingmanager_cycles', JSON.stringify(newCycles)); }
  }, [cycles]);

  const saveProfile = async () => {
      if (supabase && session) {
          await supabase.from('profiles').upsert({ id: session.user.id, full_name: coachProfile.name, club_name: coachProfile.club, license_number: coachProfile.license });
          showToast("Profil mis à jour (Cloud)");
      } else {
          localStorage.setItem('pingmanager_profile', JSON.stringify(coachProfile));
          showToast("Profil mis à jour (Local)");
      }
  };
  
  const savePlayer = async (player: Player) => {
      let updatedPlayers = [...players];
      const isNew = !players.find(p => p.id === player.id); 
      if (isNew) updatedPlayers.push(player); else updatedPlayers = players.map(p => p.id === player.id ? player : p);
      setPlayers(updatedPlayers);
      
      if (supabase && session) {
          const rawDate = player.birth_date;
          const sanitizedDate = (rawDate && typeof rawDate === 'string' && rawDate.trim().length > 0) ? rawDate : null;

          const playerPayload = {
              id: player.id,
              first_name: player.first_name,
              last_name: player.last_name,
              level: player.level,
              group: player.group || null,
              age: player.age || null, 
              birth_date: sanitizedDate,
              notes: player.notes || null,
              user_id: session.user.id,
              
              // New Fields
              ranking: player.ranking || null,
              hand: player.hand || null,
              grip: player.grip || null,
              blade: player.blade || null,
              rubber_fh: player.rubber_fh || null,
              rubber_bh: player.rubber_bh || null,
              last_equipment_change: player.last_equipment_change || null
          };
          
          const { error } = await supabase.from('players').upsert(playerPayload);
          if(error) {
              console.error("Supabase Error:", error);
              showToast("Erreur sauvegarde: " + error.message, 'error');
          } else {
              showToast("Joueur sauvegardé (Cloud)");
          }
      } else { 
          localStorage.setItem('pingmanager_players', JSON.stringify(updatedPlayers)); 
          showToast("Joueur sauvegardé (Local)"); 
      }
      setNewPlayerMode(false); 
      setCurrentPlayer(null);
  };
  
  const deletePlayer = async (playerId: string) => {
      if (!confirm("Êtes-vous sûr de vouloir supprimer ce joueur ? Cette action est irréversible.")) return;

      const newPlayers = players.filter(p => p.id !== playerId);
      setPlayers(newPlayers);
      
      if (supabase && session) {
          const { error } = await supabase.from('players').delete().eq('id', playerId);
          if(error) {
             showToast("Erreur suppression: " + error.message, 'error');
          } else {
             showToast("Joueur supprimé (Cloud)");
          }
      } else {
          localStorage.setItem('pingmanager_players', JSON.stringify(newPlayers));
          showToast("Joueur supprimé (Local)");
      }
      setPlayerEvals(prev => prev.filter(e => e.player_id !== playerId));
      setCurrentPlayer(null);
  };

  const loadPlayerEvaluations = async (playerId: string) => {
      if (supabase && session) {
          const { data } = await supabase.from('player_evaluations').select('*').eq('player_id', playerId).order('date', { ascending: false });
          setPlayerEvals(data || []);
      } else {
          try {
             const allEvalsJSON = localStorage.getItem('pingmanager_evaluations');
             const allEvals: PlayerEvaluation[] = allEvalsJSON ? JSON.parse(allEvalsJSON) : [];
             const playerSpecificEvals = allEvals.filter(e => e.player_id === playerId);
             playerSpecificEvals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
             setPlayerEvals(playerSpecificEvals);
          } catch(e) {
             console.error("Erreur lecture evals local", e);
             setPlayerEvals([]);
          }
      }
  };
  
  const saveEvaluation = async (playerId: string, skillId: string, score: number, comment?: string) => {
      const today = new Date().toISOString().split('T')[0];
      const evalToSave: PlayerEvaluation = { 
          player_id: playerId, 
          skill_id: skillId, 
          score, 
          date: today, 
          comment 
      };

      if (supabase && session) {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) { showToast("Veuillez vous connecter.", 'error'); return; }
          
          evalToSave.user_id = user.id;
          
          // Mise à jour de l'état local : On insère la nouvelle évaluation en haut de la pile
          // Note : On ne filtre PAS les anciennes évaluations ici pour garder l'historique dans l'état local
          setPlayerEvals(prev => [evalToSave, ...prev]);

          // Sauvegarde en base de données avec gestion d'erreur
          const { error } = await supabase.from('player_evaluations').upsert(evalToSave, { onConflict: 'player_id, skill_id, date' }); 
          
          if (error) {
              console.error("Erreur Supabase:", error);
              showToast("Erreur sauvegarde: " + error.message, 'error');
              // Optionnel : Revert state update if needed, but keeping it simple for now
          } else {
              showToast("Évaluation sauvegardée (Cloud)");
          }
      } else {
          try {
              const allEvalsJSON = localStorage.getItem('pingmanager_evaluations');
              let allEvals: PlayerEvaluation[] = allEvalsJSON ? JSON.parse(allEvalsJSON) : [];
              // En local, on écrase l'évaluation du même jour
              allEvals = allEvals.filter(e => !(e.player_id === playerId && e.skill_id === skillId && e.date === today));
              allEvals.push(evalToSave);
              localStorage.setItem('pingmanager_evaluations', JSON.stringify(allEvals));

              setPlayerEvals(prev => [evalToSave, ...prev]);
              
              showToast("Évaluation sauvegardée (Local)");
          } catch(e) {
              console.error("Erreur sauvegarde eval local", e);
              showToast("Erreur sauvegarde locale", 'error');
          }
      }
  };
  
  const saveAIConfig = () => { localStorage.setItem('pingmanager_ai_config', JSON.stringify(aiConfig)); showToast('Configuration IA sauvegardée !'); };
  const handleLogout = useCallback(async () => { if (confirm("Déconnexion ?")) { if (supabase) await supabase.auth.signOut(); setSavedSessions([]); setCycles([]); setExercises(INITIAL_EXERCISES); setPlayers([]); setCurrentPlayer(null); setPlayerEvals([]); setSession(null); setShowAuth(true); showToast("Déconnecté."); } }, [supabase, showToast]);

  // --- SUBSCRIPTION HANDLER (MOCK) ---
  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
     alert(`Redirection vers Stripe pour l'abonnement ${plan === 'monthly' ? 'Mensuel (9.99€)' : 'Annuel (89.99€)'}...\n\n(Simulation: Votre compte passe en PRO)`);
     if (supabase && session) {
         await supabase.from('profiles').update({ is_pro: true, subscription_status: 'active' }).eq('id', session.user.id);
         setCoachProfile(prev => ({ ...prev, is_pro: true, subscription_status: 'active' }));
         showToast("Bienvenue dans le club PRO ! 🚀");
     }
  };

  // --- SAVE WRAPPERS & HELPERS (Condensed) ---
  const saveSession = async () => { if (!currentSession.name.trim()) { showToast("Nom requis.", 'error'); return; } const isNew = currentSession.id === 0; const sessionToSave: Session = { ...currentSession, id: isNew ? Date.now() : currentSession.id }; let newSessions = isNew ? [sessionToSave, ...savedSessions] : savedSessions.map(s => s.id === sessionToSave.id ? sessionToSave : s); setCurrentSession(sessionToSave); await persistSessions(newSessions, sessionToSave); };
  
  const saveCycle = useCallback(async () => { 
      if (!currentCycle || !currentCycle.name) { showToast("Nom requis.", 'error'); return; } 
      const cycleId = (currentCycle as any).id || Date.now(); 
      const cycleToSave: Cycle = { 
          ...currentCycle, 
          id: cycleId, 
          type: (currentCycle as any).type || 'developpement', 
          objectives: (currentCycle as any).objectives || '',
          group: (currentCycle as any).group || '' 
      } as Cycle; 
      
      const exists = cycles.find(c => c.id === cycleId); 
      const updatedCycles = exists ? cycles.map(c => c.id === cycleId ? cycleToSave : c) : [...cycles, cycleToSave]; 
      await persistCycles(updatedCycles, cycleToSave); 
      setCurrentCycle(null); 
  }, [currentCycle, cycles, showToast]);

  const handleUpdateCycle = useCallback(async (updatedCycle: Cycle) => {
    const updatedCycles = cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c);
    await persistCycles(updatedCycles, updatedCycle);
  }, [cycles]);

  const addNewExercise = async () => { if (!newExercise || !newExercise.name) { showToast("Nom requis.", 'error'); return; } const exercise: Exercise = { ...newExercise, id: `custom_${Date.now()}` } as Exercise; await persistExercises([...exercises, exercise], exercise); setNewExercise(null); };
  const handleRefineDescription = async () => { if (!newExercise?.description) return; setIsLoadingAI(true); const refinedDesc = await refineExerciseDescription(newExercise.description); setNewExercise(prev => prev ? {...prev, description: refinedDesc} : null); setIsLoadingAI(false); };
  const handleSuggestExercises = async () => { if (!currentSession.name) { showToast("Nommez la séance d'abord !", 'error'); return; } setIsLoadingAI(true); try { const allExercises = Object.values(currentSession.exercises).flat().filter(e => e) as Exercise[]; const suggestions = await suggestExercises(currentSession.name, allExercises.map(e => e.name)); if (suggestions) { setSuggestedExercises(suggestions.map((s: SuggestedExercise) => ({ ...s, phase: 'technique', id: `ai_${Date.now()}_${Math.random()}` }))); setShowSuggestionsModal(true); } else { showToast("Aucune suggestion IA.", 'error'); } } catch (error) { console.error(error); showToast("Erreur IA: " + (error as Error).message, 'error'); } finally { setIsLoadingAI(false); } };
  
  const handleGenerateCycle = useCallback(async () => { if (!currentCycle?.name) { showToast("Objectif requis.", 'error'); return; } setIsLoadingAI(true); try { const result = await generateCyclePlan(currentCycle.name, currentCycle.weeks.length); if (result) setCurrentCycle(prev => prev ? { ...prev, weeks: result.weeks } : null); } catch (e) { console.error(e); showToast("Erreur IA: " + (e as Error).message, 'error'); } finally { setIsLoadingAI(false); } }, [currentCycle, showToast]);
  
  const showCalendarPicker = useCallback(() => { try { if (dateInputRef.current) (dateInputRef.current as any).showPicker?.() || dateInputRef.current.focus(); } catch (e) {} }, []);
  
  // OPTIMIZED: Memoized calculations
  const totalDuration = useMemo(() => { 
    try { 
        const allExercises = Object.values(currentSession.exercises).flat() as Exercise[]; 
        return allExercises.filter(e => e).reduce((sum, ex) => sum + (ex?.duration || 0), 0); 
    } catch (e) { return 0; } 
  }, [currentSession.exercises]);
  
  // Filter logic for Library View
  const filteredLibrary = useMemo(() => {
      return exercises.filter(ex => {
          if (libFilterPanier && ex.material !== 'Panier de balles') return false;
          if (libSearch && !ex.name.toLowerCase().includes(libSearch.toLowerCase())) return false;
          return true;
      });
  }, [exercises, libSearch, libFilterPanier]);

  const activeCycleData = useMemo(() => {
    const now = new Date(); now.setHours(0, 0, 0, 0); 
    return cycles.map(c => { 
        if (!c.startDate) return null; 
        const [y, m, d] = c.startDate.split('-').map(Number); 
        const start = new Date(y, m - 1, d); 
        const diffTime = now.getTime() - start.getTime(); 
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays < 0) return null; 
        const weekIdx = Math.floor(diffDays / 7); 
        if (weekIdx < c.weeks.length) { return { cycle: c, week: c.weeks[weekIdx], weekNum: weekIdx + 1, totalWeeks: c.weeks.length }; } 
        return null; 
    }).find(c => c !== null); 
  }, [cycles]);

  if (showAuth) return <Auth onAuthSuccess={() => setShowAuth(false)} />;

  return (
    <div className="flex h-screen bg-slate-200 font-sans overflow-hidden">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <Sidebar 
        view={view} 
        setView={setView} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen}
        session={session} 
        handleLogout={handleLogout} 
        setShowAuth={setShowAuth} 
        aiConfig={aiConfig}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden bg-white border-b p-4 flex items-center justify-between">
          <div onClick={() => setView('dashboard')} className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer hover:opacity-80 transition-opacity">
             <Target className="text-accent" /> PingManager
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">{mobileMenuOpen ? <X /> : <Menu />}</button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
          <Suspense fallback={<PageLoader />}>
            {/* DASHBOARD VIEW */}
            {view === 'dashboard' && (
              <DashboardView 
                coachProfile={coachProfile}
                session={session}
                savedSessions={savedSessions}
                players={players}
                cycles={cycles}
                activeCycleData={activeCycleData}
                setView={setView}
                setCurrentSession={setCurrentSession}
                setCurrentPlayer={setCurrentPlayer}
              />
            )}

            {/* PLAYERS VIEW */}
            {view === 'players' && (
               <PlayersView 
                 players={players}
                 currentPlayer={currentPlayer}
                 setCurrentPlayer={setCurrentPlayer}
                 newPlayerMode={newPlayerMode}
                 setNewPlayerMode={setNewPlayerMode}
                 savePlayer={savePlayer}
                 playerEvals={playerEvals}
                 saveEvaluation={saveEvaluation}
                 loadPlayerEvaluations={loadPlayerEvaluations}
                 deletePlayer={deletePlayer}
               />
            )}
            
            {/* CALENDAR VIEW */}
            {view === 'calendar' && (
              <CyclesView 
                cycles={cycles}
                currentCycle={currentCycle}
                setCurrentCycle={setCurrentCycle}
                saveCycle={saveCycle}
                setCycleToDelete={setCycleToDelete}
                handleGenerateCycle={handleGenerateCycle}
                isLoadingAI={isLoadingAI}
                dateInputRef={dateInputRef}
                showCalendarPicker={showCalendarPicker}
                savedSessions={savedSessions}
                onUpdateCycle={handleUpdateCycle}
              />
            )}
            
            {/* SESSIONS VIEW */}
            {view === 'sessions' && (
               <SessionsView 
                  exercises={exercises}
                  currentSession={currentSession}
                  setCurrentSession={setCurrentSession}
                  saveSession={saveSession}
                  handleSuggestExercises={handleSuggestExercises}
                  isLoadingAI={isLoadingAI}
                  totalDuration={totalDuration}
               />
            )}
          </Suspense>
          
          {/* HISTORY */}
          {view === 'history' && (<div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6"><h2 className="text-2xl font-bold text-slate-800 mb-6">Historique</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{savedSessions.map(session => (<div key={session.id} className="border rounded-xl p-5 hover:border-accent cursor-pointer" onClick={() => { setCurrentSession({...session}); setView('sessions'); }}><h3 className="font-bold text-slate-800 line-clamp-1">{session.name}</h3><p className="text-xs text-slate-500 mb-4 flex items-center gap-2"><CalendarIcon size={12}/> {new Date(session.date).toLocaleDateString()}</p><div className="flex gap-2"><span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{totalDuration} min</span></div></div>))}</div></div>)}
          
          {/* LIBRARY */}
          {view === 'library' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Filter className="text-accent" /> Bibliothèque d'exercices</h2>
                    <button onClick={() => setNewExercise({ name: '', phase: 'technique', theme: null, duration: 15, description: '', material: 'Balles' })} className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:bg-slate-800 transition"><Plus size={18} /> Créer un exercice</button>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Rechercher par nom..." 
                            value={libSearch}
                            onChange={e => setLibSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-accent/20 outline-none"
                        />
                    </div>
                    <button 
                        onClick={() => setLibFilterPanier(!libFilterPanier)}
                        className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all border ${libFilterPanier ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                        <Box size={16} /> {libFilterPanier ? 'Panier (Actif)' : 'Voir Panier de balles'}
                    </button>
                </div>

                {newExercise && (
                    <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 animate-fade-in shadow-inner">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Nouvel Exercice</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Nom de l'exercice" className="p-3 border rounded-lg col-span-2 text-slate-900 focus:ring-2 focus:ring-accent/20 outline-none" value={newExercise.name} onChange={e => setNewExercise({...newExercise, name: e.target.value})}/>
                            <select className="p-3 border rounded-lg text-slate-900 bg-white" value={newExercise.phase} onChange={e => setNewExercise({...newExercise, phase: e.target.value as PhaseId})}>{PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}</select>
                            <input type="number" placeholder="Durée (min)" className="p-3 border rounded-lg text-slate-900" value={newExercise.duration} onChange={e => setNewExercise({...newExercise, duration: parseInt(e.target.value)||0})}/>
                            <select className="p-3 border rounded-lg text-slate-900 bg-white col-span-2 md:col-span-1" value={newExercise.material || 'Balles'} onChange={e => setNewExercise({...newExercise, material: e.target.value})}>
                                <option value="Balles">Balles simples</option>
                                <option value="Panier de balles">Panier de balles</option>
                                <option value="Plots">Plots / Cibles</option>
                                <option value="Aucun">Aucun matériel</option>
                            </select>
                            <textarea 
                                className="col-span-2 p-3 border rounded-lg text-slate-900 focus:ring-2 focus:ring-accent/20 outline-none h-32 resize-none" 
                                placeholder="Description détaillée de l'exercice..." 
                                value={newExercise.description} 
                                onChange={e => setNewExercise({...newExercise, description: e.target.value})}
                            />
                            <div className="col-span-2 flex justify-between items-center mt-2">
                                <GeminiButton onClick={handleRefineDescription} isLoading={isLoadingAI} className="!text-xs !py-2 !px-3">Améliorer (IA)</GeminiButton>
                                <div className="flex gap-2">
                                    <button onClick={() => setNewExercise(null)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-medium transition">Annuler</button>
                                    <button onClick={addNewExercise} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold shadow-lg hover:bg-slate-800 transition">Enregistrer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLibrary.map(ex => (
                        <div key={ex.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all group relative overflow-hidden">
                            {ex.material === 'Panier de balles' && (
                                <div className="absolute -right-4 -top-4 bg-blue-600 text-white p-8 rotate-45 transform origin-center shadow-lg">
                                    <Box size={20} className="-rotate-45 relative top-1 left-[-2px]" />
                                </div>
                            )}
                            
                            <div className="mb-4">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block ${PHASES.find(p => p.id === ex.phase)?.color}`}>
                                    {PHASES.find(p => p.id === ex.phase)?.label}
                                </span>
                                <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-accent transition-colors">{ex.name}</h3>
                            </div>
                            
                            <p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed">{ex.description}</p>
                            
                            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                    <Target size={14} className="text-slate-400"/>
                                    {ex.theme || 'Général'}
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                                    <Clock size={14}/> {ex.duration} min
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {filteredLibrary.length === 0 && (
                    <div className="text-center py-20 opacity-50">
                        <Box size={48} className="mx-auto mb-4 text-slate-400"/>
                        <p className="font-bold text-slate-500">Aucun exercice trouvé.</p>
                    </div>
                )}
              </div>
          )}

            {/* SETTINGS */}
            {view === 'settings' && (
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800"><Settings className="text-slate-400"/> Paramètres</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Nom du Coach</label>
                            <input className="w-full p-3 border rounded-xl" value={coachProfile.name} onChange={e => setCoachProfile({...coachProfile, name: e.target.value})}/>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Club</label>
                            <input className="w-full p-3 border rounded-xl" value={coachProfile.club} onChange={e => setCoachProfile({...coachProfile, club: e.target.value})}/>
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Numéro de Licence</label>
                            <input className="w-full p-3 border rounded-xl" value={coachProfile.license} onChange={e => setCoachProfile({...coachProfile, license: e.target.value})}/>
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-3">Configuration IA</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <select 
                                    value={aiConfig.provider} 
                                    onChange={e => setAiConfig({...aiConfig, provider: e.target.value as any})}
                                    className="w-full p-3 border rounded-xl"
                                >
                                    <option value="google">Google Gemini</option>
                                    <option value="openrouter">OpenRouter (Mistral, etc.)</option>
                                </select>
                                {aiConfig.provider === 'openrouter' && (
                                    <input 
                                        type="password" 
                                        placeholder="Clé API OpenRouter" 
                                        className="w-full p-3 border rounded-xl"
                                        value={aiConfig.apiKey}
                                        onChange={e => setAiConfig({...aiConfig, apiKey: e.target.value})}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={saveAIConfig} className="px-4 py-2 text-indigo-600 font-bold hover:bg-indigo-50 rounded-lg">Sauvegarder Config IA</button>
                            <button onClick={saveProfile} className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg shadow-lg hover:bg-slate-800">Enregistrer Profil</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* SUBSCRIPTION */}
            {view === 'subscription' && (
                 <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-center">
                    <h2 className="text-3xl font-bold text-slate-800">Passez au niveau supérieur 🚀</h2>
                    <p className="text-slate-500 max-w-lg mx-auto">Débloquez des fonctionnalités avancées pour gérer votre club comme un pro.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-800">Gratuit</h3>
                            <div className="text-4xl font-black text-slate-900 my-4">0€<span className="text-sm font-medium text-slate-400">/mois</span></div>
                            <ul className="text-left space-y-3 mb-8 text-slate-600">
                                <li className="flex gap-2"><Check size={18} className="text-green-500"/> Gestion basique</li>
                                <li className="flex gap-2"><Check size={18} className="text-green-500"/> 50 exercices max</li>
                                <li className="flex gap-2"><Check size={18} className="text-green-500"/> Mode Local uniquement</li>
                            </ul>
                            <button disabled className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed">Actuel</button>
                        </div>
                        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAIRE</div>
                            <h3 className="text-xl font-bold">Coach Pro</h3>
                            <div className="text-4xl font-black text-white my-4">9.99€<span className="text-sm font-medium text-slate-400">/mois</span></div>
                            <ul className="text-left space-y-3 mb-8 text-slate-300">
                                <li className="flex gap-2"><Check size={18} className="text-accent"/> Cloud Sync (Supabase)</li>
                                <li className="flex gap-2"><Check size={18} className="text-accent"/> IA Illimitée</li>
                                <li className="flex gap-2"><Check size={18} className="text-accent"/> Suivi Joueurs Avancé</li>
                            </ul>
                            <button onClick={() => handleSubscribe('monthly')} className="w-full py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition shadow-lg shadow-orange-500/30">Choisir Pro</button>
                        </div>
                    </div>
                 </div>
            )}

            {/* AI SUGGESTIONS MODAL */}
            {showSuggestionsModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                                <Sparkles className="text-accent"/> Suggestions IA
                            </h3>
                            <button onClick={() => setShowSuggestionsModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition">
                                <X size={20} className="text-slate-400 hover:text-slate-600"/>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1 bg-slate-50/30">
                            {suggestedExercises.map((ex, i) => (
                                <div key={i} className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-accent hover:shadow-lg transition-all relative">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">{i+1}</span>
                                            <h4 className="font-bold text-lg text-slate-800">{ex.name}</h4>
                                        </div>
                                        <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-wider">{ex.theme}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-6 leading-relaxed pl-8">{ex.description}</p>
                                    <div className="flex justify-end gap-3 pl-8">
                                        <div className="mr-auto flex items-center gap-2 text-xs font-bold text-slate-400">
                                            <Clock size={14}/> {ex.duration} min
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const phase = 'technique';
                                                const newEx: Exercise = { ...ex, phase, id: `ai_${Date.now()}_${i}`, instanceId: Date.now() };
                                                setCurrentSession(prev => ({
                                                    ...prev, exercises: { ...prev.exercises, [phase]: [...(prev.exercises[phase]||[]), newEx] }
                                                }));
                                                showToast("Exercice ajouté !");
                                            }}
                                            className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition shadow-md flex items-center gap-2"
                                        >
                                            <Plus size={16}/> Ajouter
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-white text-center">
                            <button onClick={() => setShowSuggestionsModal(false)} className="text-slate-500 font-bold hover:text-slate-800 text-sm">Fermer</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
      </main>
    </div>
  );
}
