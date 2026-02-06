
import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { 
  Calendar as CalendarIcon, Plus, Save, Filter, X, 
  Clock, Target, Bot, Search, Menu, SaveAll, Sparkles, User, CheckCircle, AlertCircle,
  CreditCard, Award, UserCircle, Minus, Check, Settings, LogIn, LogOut, Loader2, Box, Pencil
} from 'lucide-react';

import { Exercise, Session, Cycle, View, PhaseId, AIConfig, CoachProfile, CycleType, Player, PlayerEvaluation, Skill } from './types';
import { PHASES, INITIAL_EXERCISES, EMPTY_SESSION, CYCLE_TYPES, DEFAULT_SKILLS, DEMO_PLAYERS, DEMO_SESSIONS, DEMO_CYCLES, DEMO_EVALS } from './constants';
import { refineExerciseDescription, suggestExercises, generateCyclePlan, type SuggestedExercise } from './services/geminiService';
import { GeminiButton } from './components/GeminiButton';
import { Sidebar } from './components/Sidebar'; 

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
  const [session, setSession] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(true); 
  const [isDemoMode, setIsDemoMode] = useState(false);

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
  
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  const [newExercise, setNewExercise] = useState<Partial<Exercise> | null>(null);
  const [currentCycle, setCurrentCycle] = useState<Cycle | Omit<Cycle, 'id'> | null>(null);
  
  const [libSearch, setLibSearch] = useState('');
  const [libFilterPanier, setLibFilterPanier] = useState(false);
  const [libFilterPhase, setLibFilterPhase] = useState<string>('all');
  const [libFilterSub, setLibFilterSub] = useState<string>('all');
  
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [suggestedExercises, setSuggestedExercises] = useState<SuggestedExercise[]>([]);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);

  const dateInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const launchDemoMode = useCallback(() => {
    setIsDemoMode(true);
    setPlayers(DEMO_PLAYERS);
    setSavedSessions(DEMO_SESSIONS);
    setCycles(DEMO_CYCLES);
    setPlayerEvals(DEMO_EVALS);
    setCoachProfile({ name: 'Coach Démo', club: 'PING CLUB DEMO', license: 'DEMO-2024', is_pro: true, subscription_status: 'pro' });
    setExercises([...INITIAL_EXERCISES]);
    setShowAuth(false);
    showToast("Mode Démo activé ! Explorez l'application.");
  }, [showToast]);

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

  useEffect(() => {
    const loadData = async () => {
        if (isDemoMode) return;
        if (session && supabase) {
            try {
                const { data: customExos } = await supabase.from('custom_exercises').select('*');
                setExercises([...INITIAL_EXERCISES, ...(customExos || [])]);
                const { data: sess } = await supabase.from('sessions').select('*').order('date', { ascending: false });
                setSavedSessions(sess || []);
                const { data: cyc } = await supabase.from('cycles').select('*').order('start_date', { ascending: true });
                setCycles((cyc || []).map((c: any) => ({
                    id: c.id, name: c.name, startDate: c.start_date, weeks: c.weeks,
                    type: c.type || 'developpement', objectives: c.objectives || '', group: c.group || ''
                })));
                const { data: pl } = await supabase.from('players').select('*').order('last_name', { ascending: true });
                setPlayers(pl || []);
                const { data: allSkills } = await supabase.from('skills').select('*').order('name', { ascending: true });
                setSkills(allSkills && allSkills.length > 0 ? allSkills : DEFAULT_SKILLS);
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
                if (profile) {
                    setCoachProfile({ 
                        name: profile.full_name || '', club: profile.club_name || '', 
                        license: profile.license_number || '', is_pro: profile.is_pro || false,
                        subscription_status: profile.subscription_status || 'free'
                    });
                }
            } catch (error: any) { console.error("Error loading data:", error); }
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
                setCycles((cyclesResult ? JSON.parse(cyclesResult) : []).map((c: any) => ({ ...c, type: c.type || 'developpement', objectives: c.objectives || '', group: c.group || '' })));
                setPlayers(playersResult ? JSON.parse(playersResult) : []);
                if (aiConfigResult) setAiConfig(JSON.parse(aiConfigResult));
                if (profileResult) setCoachProfile(JSON.parse(profileResult));
            } catch (e) { console.error("Local load error", e); setExercises(INITIAL_EXERCISES); }
        }
    };
    if (!showAuth) loadData();
  }, [session, showAuth, isDemoMode]);

  const persistExercises = async (newExercises: Exercise[], itemToSave?: Exercise) => {
     setExercises(newExercises); 
     if (isDemoMode) return;
     if (supabase && itemToSave) {
         const { data: { user } } = await supabase.auth.getUser();
         if (user) { await supabase.from('custom_exercises').upsert({ ...itemToSave, user_id: user.id }); showToast("Sauvegardé (Cloud)"); } 
         else { localStorage.setItem('pingmanager_exercises', JSON.stringify(newExercises)); }
     } else { localStorage.setItem('pingmanager_exercises', JSON.stringify(newExercises)); }
  };
  const persistSessions = async (newSessions: Session[], currentSess?: Session) => {
      setSavedSessions(newSessions);
      if (isDemoMode) return;
      if (supabase && currentSess) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) { await supabase.from('sessions').upsert({ ...currentSess, user_id: user.id }); showToast("Sauvegardé (Cloud)"); }
          else { localStorage.setItem('pingmanager_sessions', JSON.stringify(newSessions)); }
      } else { localStorage.setItem('pingmanager_sessions', JSON.stringify(newSessions)); }
  };
  const persistCycles = async (newCycles: Cycle[], currentCyc?: Cycle) => {
      setCycles(newCycles);
      if (isDemoMode) return;
      if (supabase && currentCyc) {
           const { data: { user } } = await supabase.auth.getUser();
           if (user) { 
               await supabase.from('cycles').upsert({ 
                   id: currentCyc.id, name: currentCyc.name, start_date: currentCyc.startDate, 
                   weeks: currentCyc.weeks, type: currentCyc.type, objectives: currentCyc.objectives, 
                   group: currentCyc.group, user_id: user.id 
               }); 
               showToast("Sauvegardé (Cloud)"); 
           } 
           else { localStorage.setItem('pingmanager_cycles', JSON.stringify(newCycles)); }
      } else { localStorage.setItem('pingmanager_cycles', JSON.stringify(newCycles)); }
  };

  const saveProfile = async () => {
      if (isDemoMode) return;
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
      if (isDemoMode) { showToast("Modifié (Démo)"); return; }
      if (supabase && session) {
          const rawDate = player.birth_date;
          const sanitizedDate = (rawDate && typeof rawDate === 'string' && rawDate.trim().length > 0) ? rawDate : null;
          const playerPayload = {
              id: player.id, first_name: player.first_name, last_name: player.last_name, level: player.level,
              group: player.group || null, age: player.age || null, birth_date: sanitizedDate, user_id: session.user.id,
              blade: player.blade || null, last_equipment_change: player.last_equipment_change || null
          };
          const { error } = await supabase.from('players').upsert(playerPayload);
          if(error) showToast("Erreur: " + error.message, 'error'); else showToast("Sauvegardé (Cloud)");
      } else { localStorage.setItem('pingmanager_players', JSON.stringify(updatedPlayers)); showToast("Sauvegardé (Local)"); }
      setNewPlayerMode(false); setCurrentPlayer(null);
  };
  
  const saveEvaluation = async (playerId: string, skillId: string, score: number, comment?: string) => {
      const today = new Date().toISOString().split('T')[0];
      const evalToSave: PlayerEvaluation = { player_id: playerId, skill_id: skillId, score, date: today, comment };
      setPlayerEvals(prev => [evalToSave, ...prev]);
      if (isDemoMode) return;
      if (supabase && session) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
              const { data: existingEval } = await supabase.from('player_evaluations').select('id').eq('player_id', playerId).eq('skill_id', skillId).eq('date', today).maybeSingle(); 
              if (existingEval) evalToSave.id = existingEval.id;
              await supabase.from('player_evaluations').upsert({ ...evalToSave, user_id: user.id }); 
              showToast("Évalué (Cloud)");
          }
      } else {
          const allEvalsJSON = localStorage.getItem('pingmanager_evaluations');
          let allEvals: PlayerEvaluation[] = allEvalsJSON ? JSON.parse(allEvalsJSON) : [];
          allEvals = allEvals.filter(e => !(e.player_id === playerId && e.skill_id === skillId && e.date === today));
          allEvals.push(evalToSave);
          localStorage.setItem('pingmanager_evaluations', JSON.stringify(allEvals));
      }
  };

  const handleLogout = useCallback(async () => { 
    if (confirm("Se déconnecter ?")) { 
        if (supabase && !isDemoMode) await supabase.auth.signOut(); 
        setSavedSessions([]); setCycles([]); setExercises(INITIAL_EXERCISES); setPlayers([]); 
        setCurrentPlayer(null); setPlayerEvals([]); setSession(null); 
        setIsDemoMode(false); setShowAuth(true); showToast("Déconnecté."); 
    } 
  }, [supabase, showToast, isDemoMode]);

  const saveSession = async () => { if (!currentSession.name.trim()) return; const isNew = currentSession.id === 0; const sessionToSave: Session = { ...currentSession, id: isNew ? Date.now() : currentSession.id }; let newSessions = isNew ? [sessionToSave, ...savedSessions] : savedSessions.map(s => s.id === sessionToSave.id ? sessionToSave : s); setCurrentSession(sessionToSave); await persistSessions(newSessions, sessionToSave); };
  const saveCycle = useCallback(async () => { if (!currentCycle || !currentCycle.name) return; const cycleId = (currentCycle as any).id || Date.now(); const cycleToSave: Cycle = { ...currentCycle, id: cycleId } as Cycle; const updatedCycles = cycles.find(c => c.id === cycleId) ? cycles.map(c => c.id === cycleId ? cycleToSave : c) : [...cycles, cycleToSave]; await persistCycles(updatedCycles, cycleToSave); setCurrentCycle(null); }, [currentCycle, cycles]);
  const handleUpdateCycle = useCallback(async (updatedCycle: Cycle) => { const updatedCycles = cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c); await persistCycles(updatedCycles, updatedCycle); }, [cycles]);

  const handleSaveExercise = async () => { 
      if (!newExercise?.name) return;
      let exerciseToSave: Exercise; let updatedList: Exercise[];
      if ('id' in newExercise && newExercise.id) { exerciseToSave = newExercise as Exercise; updatedList = exercises.map(ex => ex.id === exerciseToSave.id ? exerciseToSave : ex); } 
      else { exerciseToSave = { ...newExercise, id: `custom_${Date.now()}` } as Exercise; updatedList = [...exercises, exerciseToSave]; }
      await persistExercises(updatedList, exerciseToSave); setNewExercise(null); 
  };

  const totalDuration = useMemo(() => { try { const allExercises = Object.values(currentSession.exercises).flat() as Exercise[]; return allExercises.filter(e => e).reduce((sum, ex) => sum + (ex?.duration || 0), 0); } catch (e) { return 0; } }, [currentSession.exercises]);
  const activeCycleData = useMemo(() => { const now = new Date(); now.setHours(0, 0, 0, 0); return cycles.map(c => { if (!c.startDate) return null; const [y, m, d] = c.startDate.split('-').map(Number); const start = new Date(y, m - 1, d); const diffTime = now.getTime() - start.getTime(); const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); if (diffDays < 0) return null; const weekIdx = Math.floor(diffDays / 7); if (weekIdx < c.weeks.length) { return { cycle: c, week: c.weeks[weekIdx], weekNum: weekIdx + 1, totalWeeks: c.weeks.length }; } return null; }).find(c => c !== null); }, [cycles]);

  if (showAuth) return <Auth onAuthSuccess={() => setShowAuth(false)} launchDemoMode={launchDemoMode} />;

  return (
    <div className="flex h-screen bg-slate-200 font-sans overflow-hidden">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <Sidebar 
        view={view} setView={setView} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}
        session={session} handleLogout={handleLogout} setShowAuth={setShowAuth} aiConfig={aiConfig}
        isDemoMode={isDemoMode}
      />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden bg-white border-b p-4 flex items-center justify-between">
          <div onClick={() => setView('dashboard')} className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
             <Target className="text-accent" /> PingManager
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">{mobileMenuOpen ? <X /> : <Menu />}</button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
          <Suspense fallback={<PageLoader />}>
            {view === 'dashboard' && <DashboardView coachProfile={coachProfile} session={session} savedSessions={savedSessions} players={players} cycles={cycles} activeCycleData={activeCycleData} setView={setView} setCurrentSession={setCurrentSession} setCurrentPlayer={setCurrentPlayer} />}
            {view === 'players' && <PlayersView players={players} currentPlayer={currentPlayer} setCurrentPlayer={setCurrentPlayer} newPlayerMode={newPlayerMode} setNewPlayerMode={setNewPlayerMode} savePlayer={savePlayer} playerEvals={playerEvals} saveEvaluation={saveEvaluation} loadPlayerEvaluations={(id) => {}} deletePlayer={(id) => {}} />}
            {view === 'calendar' && <CyclesView cycles={cycles} currentCycle={currentCycle} setCurrentCycle={setCurrentCycle} saveCycle={saveCycle} setCycleToDelete={(id) => {}} handleGenerateCycle={() => {}} isLoadingAI={isLoadingAI} dateInputRef={dateInputRef} showCalendarPicker={() => {}} savedSessions={savedSessions} onUpdateCycle={handleUpdateCycle} />}
            {view === 'sessions' && <SessionsView exercises={exercises} currentSession={currentSession} setCurrentSession={setCurrentSession} saveSession={saveSession} handleSuggestExercises={() => {}} isLoadingAI={isLoadingAI} totalDuration={totalDuration} />}
            {view === 'library' && <div className="max-w-4xl mx-auto space-y-6"><h2 className="text-2xl font-bold">Bibliothèque</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{exercises.map(ex => (<div key={ex.id} className="bg-white p-6 rounded-2xl border">{ex.name}</div>))}</div></div>}
            {view === 'settings' && <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl">Paramètres</div>}
            {view === 'subscription' && <div className="max-w-4xl mx-auto text-center">Abonnement</div>}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
