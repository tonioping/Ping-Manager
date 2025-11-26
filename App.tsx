import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { 
  Calendar as CalendarIcon, Plus, Save, Filter, X, 
  Clock, Target, Bot, Search, Menu, SaveAll, Sparkles, User, CheckCircle, AlertCircle,
  CreditCard, Award, UserCircle, Minus, Check, Settings, LogIn, LogOut, Loader2
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

  const [aiConfig, setAiConfig] = useState<AIConfig>({ provider: 'google', apiKey: '', model: 'gemini-2.5-flash' });
  const [coachProfile, setCoachProfile] = useState<CoachProfile>({ name: '', club: '', license: '', is_pro: false, subscription_status: 'free' });
  
  // Feedback State
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  // Forms State
  const [newExercise, setNewExercise] = useState<Omit<Exercise, 'id'> | null>(null);
  const [currentCycle, setCurrentCycle] = useState<Cycle | Omit<Cycle, 'id'> | null>(null);
  const [cycleToDelete, setCycleToDelete] = useState<number | null>(null);
  
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
                    objectives: c.objectives || ''
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
                setCycles(loadedCycles.map((c: any) => ({ ...c, type: c.type || 'developpement', objectives: c.objectives || '' })));
                
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
           if (user) { await supabase.from('cycles').upsert({ id: currentCyc.id, name: currentCyc.name, start_date: currentCyc.startDate, weeks: currentCyc.weeks, type: currentCyc.type, objectives: currentCyc.objectives, user_id: user.id }); showToast("Cycle sauvegardé (Cloud)"); } 
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
          const { error } = await supabase.from('players').upsert({ ...player, user_id: session.user.id });
          if(error) showToast("Erreur sauvegarde joueur: " + error.message, 'error'); else showToast("Joueur sauvegardé (Cloud)");
      } else { localStorage.setItem('pingmanager_players', JSON.stringify(updatedPlayers)); showToast("Joueur sauvegardé (Local)"); }
      setNewPlayerMode(false); setCurrentPlayer(null);
  };
  const loadPlayerEvaluations = async (playerId: string) => {
      if (supabase && session) {
          const { data } = await supabase.from('player_evaluations').select('*').eq('player_id', playerId).order('date', { ascending: false });
          setPlayerEvals(data || []);
      }
  };
  const saveEvaluation = async (playerId: string, skillId: string, score: number, comment?: string) => {
      if (!supabase) { showToast("Sauvegarde impossible en local.", 'error'); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { showToast("Veuillez vous connecter.", 'error'); return; }
      const evalToSave = { player_id: playerId, skill_id: skillId, score, date: new Date().toISOString().split('T')[0], comment, user_id: user.id };
      const updatedEvals = [...playerEvals.filter(e => e.skill_id !== skillId), evalToSave as PlayerEvaluation];
      setPlayerEvals(updatedEvals);
      await supabase.from('player_evaluations').upsert(evalToSave, { onConflict: 'player_id, skill_id, date' }); showToast("Évaluation sauvegardée");
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
          objectives: (currentCycle as any).objectives || '' 
      } as Cycle; 
      
      const exists = cycles.find(c => c.id === cycleId); 
      const updatedCycles = exists ? cycles.map(c => c.id === cycleId ? cycleToSave : c) : [...cycles, cycleToSave]; 
      await persistCycles(updatedCycles, cycleToSave); 
      setCurrentCycle(null); 
  }, [currentCycle, cycles, showToast]);

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
        session={session} 
        handleLogout={handleLogout} 
        setShowAuth={setShowAuth} 
        aiConfig={aiConfig}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800"><Target className="text-accent" /> PingManager</div>
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
          {view === 'library' && (<div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6"><div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-slate-800">Bibliothèque</h2><button onClick={() => setNewExercise({ name: '', phase: 'technique', theme: null, duration: 15, description: '', material: '' })} className="bg-accent text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18} /> Créer</button></div>{newExercise && (<div className="mb-8 p-6 bg-slate-50 rounded-xl border animate-fade-in"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="text" placeholder="Nom" className="p-3 border rounded-lg col-span-2 text-slate-900" value={newExercise.name} onChange={e => setNewExercise({...newExercise, name: e.target.value})}/><select className="p-3 border rounded-lg text-slate-900" value={newExercise.phase} onChange={e => setNewExercise({...newExercise, phase: e.target.value as PhaseId})}>{PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}</select><input type="number" placeholder="Durée" className="p-3 border rounded-lg text-slate-900" value={newExercise.duration} onChange={e => setNewExercise({...newExercise, duration: parseInt(e.target.value)||0})}/><textarea className="col-span-2 p-3 border rounded-lg text-slate-900" rows={3} placeholder="Description" value={newExercise.description} onChange={e => setNewExercise({...newExercise, description: e.target.value})}></textarea><div className="col-span-2 flex justify-between items-center"><GeminiButton onClick={handleRefineDescription} isLoading={isLoadingAI}>Améliorer</GeminiButton><div className="flex gap-2"><button onClick={() => setNewExercise(null)} className="px-4 py-2 text-slate-500">Annuler</button><button onClick={addNewExercise} className="px-4 py-2 bg-slate-900 text-white rounded-lg">Sauvegarder</button></div></div></div></div>)}<div className="space-y-3">{exercises.map(ex => (<div key={ex.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition"><div><h4 className="font-bold text-slate-800">{ex.name}</h4><p className="text-sm text-slate-500 mt-1">{ex.description}</p></div><span className={`text-xs font-bold px-2 py-1 rounded uppercase ${PHASES.find(p => p.id === ex.phase)?.color.split(' ')[2]}`}>{PHASES.find(p => p.id === ex.phase)?.label}</span></div>))}</div></div>)}

          {/* SUBSCRIPTION VIEW */}
          {view === 'subscription' && (
             <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">Passez au niveau supérieur 🚀</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">Débloquez tout le potentiel de PingManager pour gérer votre club comme un pro. Joueurs illimités, IA avancée et support prioritaire.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-slate-200"></div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Découverte</h3>
                        <div className="text-4xl font-bold text-slate-900 mb-6">0€<span className="text-base font-normal text-slate-500">/mois</span></div>
                        <ul className="space-y-3 text-slate-600 mb-8">
                            <li className="flex items-center gap-2"><Check size={18} className="text-green-500"/> Jusqu'à 3 joueurs</li>
                            <li className="flex items-center gap-2"><Check size={18} className="text-green-500"/> Création de séances illimitée</li>
                            <li className="flex items-center gap-2"><Check size={18} className="text-green-500"/> Bibliothèque d'exercices</li>
                            <li className="flex items-center gap-2 opacity-50"><Minus size={18}/> Pas de statistiques avancées</li>
                        </ul>
                        <button className="w-full py-3 rounded-xl font-bold border-2 border-slate-200 text-slate-600 cursor-default">Votre plan actuel</button>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-3xl shadow-xl relative overflow-hidden text-white transform md:scale-105">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-pink-500"></div>
                        <div className="absolute top-4 right-4 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">POPULAIRE</div>
                        <h3 className="text-xl font-bold mb-2">Coach Pro</h3>
                        <div className="text-4xl font-bold mb-6">9.99€<span className="text-base font-normal text-slate-400">/mois</span></div>
                        <ul className="space-y-3 text-slate-300 mb-8">
                            <li className="flex items-center gap-2"><Check size={18} className="text-orange-400"/> Joueurs illimités</li>
                            <li className="flex items-center gap-2"><Check size={18} className="text-orange-400"/> Suivi de progression (Graphiques)</li>
                            <li className="flex items-center gap-2"><Check size={18} className="text-orange-400"/> Générateur de cycles IA</li>
                            <li className="flex items-center gap-2"><Check size={18} className="text-orange-400"/> Export PDF</li>
                        </ul>
                        {coachProfile.is_pro ? (
                            <button className="w-full py-3 rounded-xl font-bold bg-green-500 text-white cursor-default">Abonnement Actif ✅</button>
                        ) : (
                            <button onClick={() => handleSubscribe('monthly')} className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/30">Passer Pro maintenant</button>
                        )}
                    </div>
                </div>
                <div className="text-center text-xs text-slate-400 mt-8">Paiement sécurisé via Stripe • Annulation à tout moment</div>
             </div>
          )}

          {/* SETTINGS VIEW */}
          {view === 'settings' && (
             <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center gap-3 mb-8 border-b pb-4"><div className="p-3 bg-slate-100 rounded-full"><UserCircle size={24} /></div><h2 className="text-2xl font-bold text-slate-800">Profil Coach</h2></div>
                    <div className="space-y-4">
                        <div><label className="block text-sm font-bold text-slate-700 mb-2">Nom complet</label><input type="text" value={coachProfile.name} onChange={(e) => setCoachProfile({...coachProfile, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-slate-900" placeholder="Ex: Antoine Dupont" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Award size={16}/> Club</label><input type="text" value={coachProfile.club} onChange={(e) => setCoachProfile({...coachProfile, club: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-slate-900" placeholder="Ex: Ping Paris 12" /></div>
                            <div><label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><CreditCard size={16}/> Licence</label><input type="text" value={coachProfile.license} onChange={(e) => setCoachProfile({...coachProfile, license: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-slate-900" placeholder="Numéro" /></div>
                        </div>
                        <div className="pt-4 flex justify-end"><button onClick={saveProfile} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2"><Save size={18} /> Sauvegarder Profil</button></div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center gap-3 mb-8 border-b pb-4"><div className="p-3 bg-slate-100 rounded-full"><Settings size={24} className="text-slate-600"/></div><h2 className="text-2xl font-bold text-slate-800">Configuration IA</h2></div>
                    <div className="space-y-6">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Target size={16} className="text-accent"/> Fournisseur</label><div className="grid grid-cols-2 gap-4"><button onClick={() => setAiConfig({...aiConfig, provider: 'google', model: 'gemini-2.5-flash'})} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${aiConfig.provider === 'google' ? 'border-accent bg-orange-50 text-accent' : 'border-slate-200'}`}><span className="font-bold">Google</span></button><button onClick={() => setAiConfig({...aiConfig, provider: 'openrouter', model: 'mistralai/mistral-7b-instruct:free'})} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${aiConfig.provider === 'openrouter' ? 'border-accent bg-orange-50 text-accent' : 'border-slate-200'}`}><span className="font-bold">OpenRouter</span></button></div></div>
                    
                    {aiConfig.provider === 'google' && (
                        <div className="p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 flex items-center gap-3"><Sparkles size={20} /><div><p className="font-bold text-sm">Mode Google Gemini natif</p><p className="text-xs opacity-80">L'application utilise la clé API sécurisée du serveur.</p></div></div>
                    )}

                    <div className="pt-6 border-t flex justify-end"><button onClick={saveAIConfig} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2"><SaveAll size={20} /> Enregistrer Config IA</button></div>
                    </div>
                </div>
             </div>
          )}
        </div>
      </main>

      {/* MODAL: EXERCISE SUGGESTIONS */}
      {showSuggestionsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-orange-50 to-white">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg text-accent"><Sparkles size={20} /></div>
                <h3 className="text-xl font-bold text-slate-800">Suggestions IA</h3>
              </div>
              <button onClick={() => setShowSuggestionsModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
            </div>
            <div className="p-6 overflow-y-auto bg-slate-50/30">
              <p className="text-slate-600 mb-4">Voici des exercices créatifs basés sur votre séance actuelle :</p>
              <div className="space-y-4">
                {suggestedExercises.map((ex, i) => (
                   <div key={i} className="bg-white border border-slate-200 p-5 rounded-xl hover:shadow-md transition-all group hover:border-accent">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800 text-lg">{ex.name}</h4>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{ex.theme}</span>
                      </div>
                      <p className="text-slate-600 text-sm mb-3 leading-relaxed">{ex.description}</p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                          <div className="flex gap-4 text-xs font-medium text-slate-500">
                             <span className="flex items-center gap-1"><Clock size={12}/> {ex.duration} min</span>
                             <span className="flex items-center gap-1"><Target size={12}/> {ex.material}</span>
                          </div>
                          <button 
                            onClick={() => {
                                const phaseToAddTo = 'technique';
                                setCurrentSession(prev => ({
                                    ...prev,
                                    exercises: {
                                        ...prev.exercises,
                                        [phaseToAddTo]: [...(prev.exercises[phaseToAddTo] || []), { ...ex, id: `ai_added_${Date.now()}_${i}`, phase: phaseToAddTo, instanceId: Date.now() } as Exercise]
                                    }
                                }));
                                showToast("Exercice ajouté !");
                            }}
                            className="text-accent font-bold text-sm hover:underline flex items-center gap-1"
                          >
                             <Plus size={16}/> Ajouter
                          </button>
                      </div>
                   </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
               <button onClick={() => setShowSuggestionsModal(false)} className="px-5 py-2 text-slate-600 font-semibold hover:bg-slate-50 rounded-lg transition">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}