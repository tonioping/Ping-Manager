import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { X, CheckCircle, AlertCircle, Loader2, Menu, Target, Printer } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SessionsView } from './components/SessionsView';
import { CyclesView } from './components/CyclesView';
import { PlayersView } from './components/PlayersView';
import { GroupDetailView } from './components/GroupDetailView';
import { LibraryView } from './components/LibraryView';
import Auth from './components/Auth';
import { supabase } from './lib/supabase';
import { PHASES, INITIAL_EXERCISES, EMPTY_SESSION, DEFAULT_SKILLS, DEMO_PLAYERS, DEMO_SESSIONS, DEMO_CYCLES, DEMO_EVALS, GROUPS } from './constants';
import { Session, Cycle, View, AIConfig, CoachProfile, Player, PlayerEvaluation, Exercise, PhaseId, Attendance } from './types';
import { suggestExercises, generateCyclePlan } from './services/geminiService';

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all animate-fade-in ${type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
    {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
    <span className="font-medium text-sm">{message}</span>
    <button onClick={onClose}><X size={16} className="opacity-50 hover:opacity-100" /></button>
  </div>
);

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(true); 
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [view, setView] = useState<View>('dashboard');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pingmanager_theme') === 'dark';
    }
    return false;
  });
  
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  const [currentSession, setCurrentSession] = useState<Session>({...EMPTY_SESSION});
  const [savedSessions, setSavedSessions] = useState<Session[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [currentCycle, setCurrentCycle] = useState<Cycle | Omit<Cycle, 'id'> | null>(null);
  const [players, setPlayers] = useState<Player[]>([]); 
  const [playerEvals, setPlayerEvals] = useState<PlayerEvaluation[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [newPlayerMode, setNewPlayerMode] = useState(false);
  const [coachProfile, setCoachProfile] = useState<CoachProfile>({ name: '', club: '', license: '', is_pro: false, subscription_status: 'free' });
  const [aiConfig] = useState<AIConfig>({ provider: 'google', apiKey: '', model: 'gemini-3-flash-preview' });
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const newVal = !prev;
      localStorage.setItem('pingmanager_theme', newVal ? 'dark' : 'light');
      return newVal;
    });
  }, []);

  const loadUserData = useCallback(async (userId: string) => {
    try {
      const [
        { data: playersData },
        { data: sessionsData },
        { data: cyclesData },
        { data: evalsData },
        { data: profileData },
        { data: attendanceData }
      ] = await Promise.all([
        supabase.from('players').select('*').eq('user_id', userId),
        supabase.from('sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('cycles').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('player_evaluations').select('*').eq('user_id', userId),
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('attendance').select('*').eq('user_id', userId)
      ]);

      if (playersData) setPlayers(playersData);
      if (sessionsData) setSavedSessions(sessionsData);
      if (cyclesData) setCycles(cyclesData.map(c => ({ ...c, startDate: c.start_date })));
      if (evalsData) setPlayerEvals(evalsData);
      if (attendanceData) setAttendance(attendanceData);
      if (profileData) setCoachProfile({ 
        name: profileData.full_name || '', 
        club: profileData.club_name || '', 
        license: profileData.license_number || '',
        is_pro: profileData.is_pro,
        subscription_status: profileData.subscription_status
      });
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setShowAuth(false);
        loadUserData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setShowAuth(false);
        loadUserData(session.user.id);
      } else {
        setPlayers([]);
        setSavedSessions([]);
        setCycles([]);
        setPlayerEvals([]);
        setAttendance([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadUserData]);

  const launchDemoMode = useCallback(() => {
    setIsDemoMode(true);
    setPlayers(DEMO_PLAYERS);
    setSavedSessions(DEMO_SESSIONS);
    setCycles(DEMO_CYCLES);
    setPlayerEvals(DEMO_EVALS);
    setAttendance([]);
    setCoachProfile({ name: 'Coach Démo', club: 'PING CLUB DEMO', license: 'DEMO-2024', is_pro: true, subscription_status: 'pro' });
    setShowAuth(false);
    showToast("Mode Démo activé !");
  }, [showToast]);

  const saveSession = useCallback(async () => {
    if (!currentSession.name.trim()) {
      showToast("Veuillez donner un nom à votre séance", "error");
      return;
    }

    const sessionData = {
      name: currentSession.name,
      date: currentSession.date,
      exercises: currentSession.exercises,
      group: currentSession.group,
      user_id: session?.user?.id
    };

    if (session && !isDemoMode) {
      const { data, error } = await supabase
        .from('sessions')
        .upsert(currentSession.id ? { ...sessionData, id: currentSession.id } : sessionData)
        .select()
        .single();

      if (error) {
        showToast("Erreur lors de la sauvegarde Cloud", "error");
        return;
      }
      setSavedSessions(prev => {
        const exists = prev.find(s => s.id === data.id);
        if (exists) return prev.map(s => s.id === data.id ? data : s);
        return [data, ...prev];
      });
      setCurrentSession(data);
    } else {
      const newSession = { ...currentSession, id: currentSession.id || Date.now() };
      setSavedSessions(prev => {
        const exists = prev.find(s => s.id === newSession.id);
        if (exists) return prev.map(s => s.id === newSession.id ? newSession : s);
        return [newSession, ...prev];
      });
      setCurrentSession(newSession);
    }
    
    showToast("Séance enregistrée avec succès !");
  }, [currentSession, session, isDemoMode, showToast]);

  const saveAttendance = useCallback(async (playerId: string, status: 'present' | 'absent' | 'late') => {
    if (!currentSession.id || currentSession.id === 0) {
        showToast("Enregistrez d'abord la séance pour faire l'appel", "error");
        return;
    }

    const record = {
        session_id: currentSession.id,
        player_id: playerId,
        status,
        user_id: session?.user?.id
    };

    if (session && !isDemoMode) {
        const { data, error } = await supabase
            .from('attendance')
            .upsert(record, { onConflict: 'session_id,player_id' })
            .select()
            .single();
        
        if (error) {
            console.error("Erreur Supabase Attendance:", error);
            showToast("Erreur lors de l'enregistrement de la présence", "error");
            return;
        }

        if (data) {
            setAttendance(prev => {
                const exists = prev.find(a => a.session_id === data.session_id && a.player_id === data.player_id);
                if (exists) return prev.map(a => a.session_id === data.session_id && a.player_id === data.player_id ? data : a);
                return [...prev, data];
            });
        }
    } else {
        setAttendance(prev => {
            const exists = prev.find(a => a.session_id === currentSession.id && a.player_id === playerId);
            if (exists) return prev.map(a => a.session_id === currentSession.id && a.player_id === playerId ? { ...record } : a);
            return [...prev, { ...record }];
        });
    }
  }, [currentSession.id, session, isDemoMode, showToast]);

  const saveCycle = useCallback(async () => {
    if (!currentCycle || !currentCycle.name.trim()) {
      showToast("Veuillez donner un nom au cycle", "error");
      return;
    }

    const cycleData = {
      name: currentCycle.name,
      start_date: currentCycle.startDate,
      weeks: currentCycle.weeks,
      type: currentCycle.type,
      objectives: currentCycle.objectives,
      group: currentCycle.group,
      user_id: session?.user?.id
    };

    if (session && !isDemoMode) {
      const { data, error } = await supabase
        .from('cycles')
        .upsert((currentCycle as any).id ? { ...cycleData, id: (currentCycle as any).id } : cycleData)
        .select()
        .single();

      if (error) {
        showToast("Erreur lors de la sauvegarde du cycle", "error");
        return;
      }
      const formatted = { ...data, startDate: data.start_date };
      setCycles(prev => {
        const exists = prev.find(c => c.id === formatted.id);
        if (exists) return prev.map(c => c.id === formatted.id ? formatted : c);
        return [formatted, ...prev];
      });
    } else {
      const newCycle = { ...currentCycle, id: (currentCycle as any).id || Date.now() } as Cycle;
      setCycles(prev => {
        const exists = prev.find(c => c.id === newCycle.id);
        if (exists) return prev.map(c => c.id === newCycle.id ? newCycle : c);
        return [newCycle, ...prev];
      });
    }
    setCurrentCycle(null);
    showToast("Cycle enregistré !");
  }, [currentCycle, session, isDemoMode, showToast]);

  const deleteCycle = useCallback(async (id: number) => {
    if (session && !isDemoMode) {
      await supabase.from('cycles').delete().eq('id', id);
    }
    setCycles(prev => prev.filter(c => c.id !== id));
    showToast("Cycle supprimé");
  }, [session, isDemoMode, showToast]);

  const updateCycle = useCallback(async (updatedCycle: Cycle) => {
    if (session && !isDemoMode) {
      await supabase.from('cycles').update({
        name: updatedCycle.name,
        weeks: updatedCycle.weeks,
        start_date: updatedCycle.startDate
      }).eq('id', updatedCycle.id);
    }
    setCycles(prev => prev.map(c => c.id === updatedCycle.id ? updatedCycle : c));
  }, [session, isDemoMode]);

  const savePlayer = useCallback(async (player: Player) => {
    if (session && !isDemoMode) {
      const { data, error } = await supabase.from('players').upsert({ ...player, user_id: session.user.id }).select().single();
      if (!error && data) setPlayers(prev => {
        const exists = prev.find(p => p.id === data.id);
        if (exists) return prev.map(p => p.id === data.id ? data : p);
        return [...prev, data];
      });
    } else {
      setPlayers(prev => {
        const exists = prev.find(p => p.id === player.id);
        if (exists) return prev.map(p => p.id === player.id ? player : p);
        return [...prev, player];
      });
    }
    setCurrentPlayer(null);
    setNewPlayerMode(false);
    showToast("Joueur enregistré !");
  }, [session, isDemoMode, showToast]);

  const deletePlayer = useCallback(async (id: string) => {
    if (session && !isDemoMode) {
      await supabase.from('players').delete().eq('id', id);
    }
    setPlayers(prev => prev.filter(p => p.id !== id));
    showToast("Joueur supprimé");
  }, [session, isDemoMode, showToast]);

  const saveEvaluation = useCallback(async (playerId: string, skillId: string, score: number) => {
    const evalData = {
      player_id: playerId,
      skill_id: skillId,
      score,
      date: new Date().toISOString().split('T')[0],
      user_id: session?.user?.id
    };

    if (session && !isDemoMode) {
      const { data, error } = await supabase.from('player_evaluations').insert(evalData).select().single();
      if (!error && data) setPlayerEvals(prev => [...prev, data]);
    } else {
      setPlayerEvals(prev => [...prev, { ...evalData, id: Date.now() }]);
    }
    showToast("Évaluation enregistrée");
  }, [session, isDemoMode, showToast]);

  const handleSuggestExercises = useCallback(async () => {
    if (!currentSession.name) {
      showToast("Donnez un titre à la séance pour guider l'IA", "error");
      return;
    }
    setIsLoadingAI(true);
    try {
      const existing = (Object.values(currentSession.exercises) as Exercise[][]).flat().map((e: Exercise) => e.name);
      const suggestions = await suggestExercises(currentSession.name, existing);
      
      if (suggestions.length > 0) {
        const firstSuggested = suggestions[0];
        const phaseId: PhaseId = 'technique';
        const newEx: Exercise = {
          id: `ai-${Date.now()}`,
          name: firstSuggested.name,
          duration: firstSuggested.duration,
          description: firstSuggested.description,
          material: firstSuggested.material,
          theme: firstSuggested.theme,
          phase: phaseId,
          instanceId: Date.now()
        };
        
        setCurrentSession(prev => ({
          ...prev,
          exercises: {
            ...prev.exercises,
            [phaseId]: [...(prev.exercises[phaseId] || []), newEx]
          }
        }));
        showToast("L'IA a ajouté un exercice à votre séance !");
      }
    } catch (err) {
      showToast("Erreur lors de la génération IA", "error");
    } finally {
      setIsLoadingAI(false);
    }
  }, [currentSession.name, currentSession.exercises, showToast]);

  const handleGenerateCycle = useCallback(async () => {
    if (!currentCycle || !currentCycle.name) {
        showToast("L'IA a besoin d'un objectif de cycle (Nom du cycle)", "error");
        return;
    }
    setIsLoadingAI(true);
    try {
        const plan = await generateCyclePlan(currentCycle.name, currentCycle.weeks.length);
        if (plan && plan.weeks) {
            const updatedWeeks = currentCycle.weeks.map((w, i) => {
                const aiWeek = plan.weeks.find(aw => aw.weekNumber === w.weekNumber);
                return aiWeek ? { ...w, theme: aiWeek.theme, notes: aiWeek.notes } : w;
            });
            setCurrentCycle({ ...currentCycle, weeks: updatedWeeks });
            showToast("Plan de cycle généré par Gemini !");
        }
    } catch (e) {
        showToast("Erreur IA Cycle", "error");
    } finally {
        setIsLoadingAI(false);
    }
  }, [currentCycle, showToast]);

  const totalDuration = useMemo(() => {
    const flattenedExercises = Object.values(currentSession.exercises).flat() as Exercise[];
    return flattenedExercises.reduce((sum, ex) => sum + (ex?.duration || 0), 0);
  }, [currentSession.exercises]);

  const handlePrint = () => window.print();

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    setView('group-detail');
  };

  const handleLaunchSessionFromGroup = (sessionId?: number) => {
    if (sessionId) {
      const sess = savedSessions.find(s => s.id === sessionId);
      if (sess) {
        setCurrentSession({...sess});
        setView('sessions');
        return;
      }
    }
    const group = GROUPS.find(g => g.id === selectedGroupId);
    setCurrentSession({
      ...EMPTY_SESSION,
      name: `${group?.label || 'Séance'} - ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString().split('T')[0],
      group: selectedGroupId || undefined
    });
    setView('sessions');
  };

  if (showAuth) return <Auth onAuthSuccess={() => setShowAuth(false)} launchDemoMode={launchDemoMode} />;

  return (
    <div className={`${darkMode ? 'dark' : ''} h-screen font-sans overflow-hidden`}>
      <div className="flex h-full bg-slate-200 dark:bg-slate-950 transition-colors duration-300">
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        
        <div className="no-print h-full flex w-full">
          <Sidebar 
            view={view} setView={setView} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}
            session={session} handleLogout={() => { setIsDemoMode(false); setShowAuth(true); }} setShowAuth={setShowAuth} aiConfig={aiConfig}
            isDemoMode={isDemoMode} darkMode={darkMode} toggleDarkMode={toggleDarkMode}
          />
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header className="lg:hidden bg-white dark:bg-slate-900 border-b dark:border-slate-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                 <Target className="text-accent" /> PingManager
              </div>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 dark:text-slate-400"><Menu /></button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
              {view === 'dashboard' && <DashboardView coachProfile={coachProfile} session={session} savedSessions={savedSessions} players={players} cycles={cycles} activeCycleData={null} setView={setView} setCurrentSession={setCurrentSession} setCurrentPlayer={setCurrentPlayer} onSelectGroup={handleSelectGroup} />}
              
              {view === 'group-detail' && selectedGroupId && (
                <GroupDetailView 
                  group={GROUPS.find(g => g.id === selectedGroupId)!}
                  players={players}
                  sessions={savedSessions}
                  attendance={attendance}
                  onBack={() => setView('dashboard')}
                  onLaunchSession={handleLaunchSessionFromGroup}
                  onSaveAttendance={saveAttendance}
                />
              )}

              {view === 'library' && <LibraryView exercises={exercises} />}

              {view === 'sessions' && (
                  <div className="space-y-4">
                      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mb-4">
                          <div className="flex items-center gap-4">
                              <h2 className="text-xl font-black italic uppercase dark:text-white">Mode Édition</h2>
                              {currentSession.id !== 0 && <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"><Printer size={14}/> Imprimer</button>}
                          </div>
                          <button onClick={() => { setCurrentSession({...EMPTY_SESSION}); setView('dashboard'); }} className="text-slate-400 hover:text-red-500"><X/></button>
                      </div>
                      <SessionsView 
                        exercises={exercises} 
                        currentSession={currentSession} 
                        setCurrentSession={setCurrentSession} 
                        saveSession={saveSession} 
                        handleSuggestExercises={handleSuggestExercises} 
                        isLoadingAI={isLoadingAI} 
                        totalDuration={totalDuration}
                        players={players}
                        attendance={attendance.filter(a => a.session_id === currentSession.id)}
                        onSaveAttendance={saveAttendance}
                      />
                  </div>
              )}
              {view === 'calendar' && (
                <CyclesView 
                  cycles={cycles} 
                  currentCycle={currentCycle} 
                  setCurrentCycle={setCurrentCycle} 
                  saveCycle={saveCycle} 
                  setCycleToDelete={deleteCycle} 
                  handleGenerateCycle={handleGenerateCycle} 
                  isLoadingAI={isLoadingAI} 
                  dateInputRef={dateInputRef} 
                  showCalendarPicker={() => dateInputRef.current?.showPicker()} 
                  savedSessions={savedSessions} 
                  onUpdateCycle={updateCycle} 
                />
              )}
              {view === 'players' && (
                <PlayersView 
                  players={players} 
                  currentPlayer={currentPlayer} 
                  setCurrentPlayer={setCurrentPlayer} 
                  newPlayerMode={newPlayerMode} 
                  setNewPlayerMode={setNewPlayerMode} 
                  savePlayer={savePlayer} 
                  deletePlayer={deletePlayer} 
                  playerEvals={playerEvals} 
                  saveEvaluation={saveEvaluation} 
                  loadPlayerEvaluations={() => {}} 
                  attendance={attendance}
                  sessions={savedSessions}
                />
              )}
              
              {view === 'history' && (
                  <div className="max-w-4xl mx-auto space-y-6">
                      <h2 className="text-3xl font-black italic uppercase tracking-tighter dark:text-white">Historique des séances</h2>
                      <div className="grid gap-4">
                          {savedSessions.length === 0 ? (
                              <div className="bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
                                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Aucune séance archivée</p>
                              </div>
                          ) : (
                              savedSessions.map(s => (
                                  <div key={s.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                                      <div>
                                          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-lg group-hover:text-accent transition-colors">{s.name}</h3>
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(s.date).toLocaleDateString()}</p>
                                      </div>
                                      <button onClick={() => { setCurrentSession(s); setView('sessions'); }} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900 hover:text-white transition-all">Charger</button>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              )}
            </div>
          </main>
        </div>

        <div className="print-only p-8 bg-white text-slate-900 w-full h-full">
            <div className="border-b-4 border-slate-900 pb-4 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">Ping<span className="text-orange-500">Manager</span></h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Assistant Entraîneur</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-black uppercase">{currentSession.name}</h2>
                    <p className="text-sm font-bold">{new Date(currentSession.date).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="space-y-8">
                {PHASES.map(phase => {
                    const phaseExos = currentSession.exercises[phase.id] || [];
                    if (phaseExos.length === 0) return null;
                    return (
                        <div key={phase.id} className="space-y-3">
                            <h3 className="text-lg font-black uppercase tracking-widest border-l-4 border-orange-500 pl-3 bg-slate-50 py-1">{phase.label}</h3>
                            <div className="grid gap-4">
                                {phaseExos.map((ex, i) => (
                                    <div key={i} className="border border-slate-100 p-4 rounded-xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-lg">{ex.name}</h4>
                                            <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded">{ex.duration} min</span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">{ex.description}</p>
                                        {ex.material && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Matériel : {ex.material}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                <span>PingManager Pro v1.1.0</span>
                <span>www.pingmanager.app</span>
            </div>
        </div>
      </div>
    </div>
  );
}