
import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, Plus, Save, Printer, Filter, X, GripVertical, 
  Clock, Users, Target, Trash2, BookOpen, Bot, Search, 
  LayoutDashboard, Settings, Menu, Sparkles, ArrowRight, CalendarDays,
  Cpu, Key, SaveAll, Cloud, CloudOff, LogOut, LogIn, User, CheckCircle, AlertCircle,
  CreditCard, Award, UserCircle
} from 'lucide-react';
import { Exercise, Session, Cycle, View, PhaseId, AIConfig, CoachProfile } from './types';
import { PHASES, INITIAL_EXERCISES, EMPTY_SESSION } from './constants';
import { refineExerciseDescription, suggestExercises, generateCyclePlan, type SuggestedExercise } from './services/geminiService';
import { GeminiButton } from './components/GeminiButton';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';

// --- Sub-Components ---
const SidebarItem = ({ view, currentView, setView, icon: Icon, label }: any) => (
  <button
    onClick={() => setView(view)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      currentView === view 
        ? 'bg-accent text-white shadow-lg shadow-orange-500/20 font-semibold' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={20} className={currentView === view ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
    <span className="text-sm tracking-wide">{label}</span>
  </button>
);

const StatCard = ({ title, value, icon: Icon, colorClass }: any) => {
  const textColor = colorClass.split(' ')[0].replace('bg-', 'text-');
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${colorClass} bg-opacity-10`}>
        <Icon size={28} className={textColor} />
      </div>
    </div>
  );
};

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all animate-fade-in ${type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
    {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
    <span className="font-medium text-sm">{message}</span>
    <button onClick={onClose}><X size={16} className="opacity-50 hover:opacity-100" /></button>
  </div>
);

const PhaseDropZone = ({ phase, exercises, onDrop, onRemove }: any) => {
  const [isOver, setIsOver] = useState(false);
  const safeExercises = Array.isArray(exercises) ? exercises : [];

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => { onDrop(phase.id); setIsOver(false); }}
      className={`transition-all duration-300 rounded-xl border-2 border-dashed p-4 min-h-[140px] 
        ${isOver ? 'bg-orange-50 border-orange-400 scale-[1.01]' : `${phase.color.split(' ')[0]} ${phase.color.split(' ')[1]} bg-opacity-30`}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-8 rounded-full ${phase.color.split(' ')[0].replace('50', '500')}`}></div>
          <h3 className={`font-bold text-lg ${phase.color.split(' ')[2]}`}>{phase.label}</h3>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-white rounded-full shadow-sm text-slate-600 border border-slate-100">
          {safeExercises.reduce((acc: number, ex: Exercise) => acc + (ex?.duration || 0), 0)} / {phase.duration} min
        </span>
      </div>

      <div className="space-y-3">
        {safeExercises.length === 0 ? (
          <div className="h-20 flex items-center justify-center text-slate-400 italic text-sm">
            Glissez des exercices ici
          </div>
        ) : (
          safeExercises.filter((ex: Exercise) => ex).map((ex: Exercise) => (
            <div key={ex.instanceId} className="group bg-white p-3 rounded-xl shadow-sm border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all flex items-start gap-3">
               <div className="mt-1 p-1.5 bg-slate-50 rounded-lg text-slate-400">
                  <Target size={14} />
               </div>
               <div className="flex-1 min-w-0">
                 <div className="font-semibold text-slate-800 truncate">{ex.name}</div>
                 <div className="text-xs text-slate-500 line-clamp-2 mt-0.5">{ex.description}</div>
                 <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs font-bold text-accent flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded">
                      <Clock size={12} /> {ex.duration} min
                    </span>
                 </div>
               </div>
               <button 
                onClick={() => onRemove(phase.id, ex.instanceId)}
                className="text-slate-300 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
               >
                 <X size={18} />
               </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default function App() {
  // User Session State
  const [session, setSession] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(true); // Default to showing Auth

  // App Data State
  const [view, setView] = useState<View>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentSession, setCurrentSession] = useState<Session>({...EMPTY_SESSION});
  const [savedSessions, setSavedSessions] = useState<Session[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [aiConfig, setAiConfig] = useState<AIConfig>({ provider: 'google', apiKey: '', model: 'gemini-2.5-flash' });
  const [coachProfile, setCoachProfile] = useState<CoachProfile>({ name: '', club: '', license: '' });
  
  // Feedback State
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  // Filters & UI State
  const [filterPhase, setFilterPhase] = useState('all');
  const [filterTheme, setFilterTheme] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedExercise, setDraggedExercise] = useState<Exercise | null>(null);
  
  // Forms State
  const [newExercise, setNewExercise] = useState<Omit<Exercise, 'id'> | null>(null);
  const [currentCycle, setCurrentCycle] = useState<Cycle | Omit<Cycle, 'id'> | null>(null);
  const [cycleToDelete, setCycleToDelete] = useState<number | null>(null);
  
  // AI State
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [suggestedExercises, setSuggestedExercises] = useState<Exercise[]>([]);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);

  // Refs
  const dateInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

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
                // console.log("Loading from Supabase...");
                const { data: customExos, error: errorExos } = await supabase.from('custom_exercises').select('*');
                if (errorExos) throw errorExos;
                setExercises([...INITIAL_EXERCISES, ...(customExos || [])]);

                const { data: sess, error: errorSess } = await supabase.from('sessions').select('*').order('date', { ascending: false });
                if (errorSess) throw errorSess;
                setSavedSessions(sess || []);

                const { data: cyc, error: errorCyc } = await supabase.from('cycles').select('*');
                if (errorCyc) throw errorCyc;
                const mappedCycles = (cyc || []).map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    startDate: c.start_date, // DB uses start_date
                    weeks: c.weeks
                }));
                setCycles(mappedCycles);

                // Load Profile
                const { data: profile, error: errorProfile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                if (profile) {
                    setCoachProfile({ name: profile.full_name || '', club: profile.club_name || '', license: profile.license_number || '' });
                }

            } catch (error: any) {
                console.error("Error loading from Supabase:", error);
                // showToast(`Erreur Cloud: ${error.message}`, 'error');
            }
        } 
        else {
            console.log("Loading from LocalStorage...");
            try {
                const exResult = localStorage.getItem('pingmanager_exercises');
                const sessResult = localStorage.getItem('pingmanager_sessions');
                const cyclesResult = localStorage.getItem('pingmanager_cycles');
                const aiConfigResult = localStorage.getItem('pingmanager_ai_config');
                const profileResult = localStorage.getItem('pingmanager_profile');

                const lsExercises = exResult ? JSON.parse(exResult) : [];
                if (lsExercises.length > 0) {
                    setExercises(lsExercises);
                } else {
                    setExercises(INITIAL_EXERCISES);
                }

                setSavedSessions(sessResult ? JSON.parse(sessResult) : []);
                setCycles(cyclesResult ? JSON.parse(cyclesResult) : []);
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

  // 3. PERSISTENCE LOGIC
  const persistExercises = async (newExercises: Exercise[], newItem?: Exercise) => {
     setExercises(newExercises); 
     if (supabase && newItem) {
         const { data: { user } } = await supabase.auth.getUser();
         if (user) {
             const { error } = await supabase.from('custom_exercises').insert({
                 id: newItem.id,
                 name: newItem.name,
                 phase: newItem.phase,
                 theme: newItem.theme,
                 duration: newItem.duration,
                 description: newItem.description,
                 material: newItem.material,
                 user_id: user.id
             });
             if (error) { console.error(error); showToast("Erreur sauvegarde Exercice (Cloud)", 'error'); } 
             else { showToast("Exercice sauvegardé (Cloud)"); }
         } else {
             localStorage.setItem('pingmanager_exercises', JSON.stringify(newExercises));
             showToast("Exercice sauvegardé (Local)");
         }
     } else {
         localStorage.setItem('pingmanager_exercises', JSON.stringify(newExercises));
         showToast("Exercice sauvegardé (Local)");
     }
  };

  const persistSessions = async (newSessions: Session[], currentSess?: Session) => {
      setSavedSessions(newSessions);
      if (supabase && currentSess) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
              const { error } = await supabase.from('sessions').upsert({
                  id: currentSess.id,
                  name: currentSess.name,
                  date: currentSess.date,
                  exercises: currentSess.exercises,
                  user_id: user.id
              });
              if (error) {
                  console.error("Supabase Session Error:", error);
                  if (error.code === '42P01') { showToast("ERREUR CRITIQUE : Tables manquantes !", 'error'); } 
                  else { showToast(`Erreur sauvegarde : ${error.message}`, 'error'); }
              } else { showToast("Séance sauvegardée (Cloud)"); }
          } else {
              localStorage.setItem('pingmanager_sessions', JSON.stringify(newSessions));
              showToast("Séance sauvegardée (Local)");
          }
      } else {
          localStorage.setItem('pingmanager_sessions', JSON.stringify(newSessions));
          showToast("Séance sauvegardée (Local)");
      }
  };

  const persistCycles = async (newCycles: Cycle[], currentCyc?: Cycle) => {
      setCycles(newCycles);
      if (supabase && currentCyc) {
           const { data: { user } } = await supabase.auth.getUser();
           if (user) {
               const { error } = await supabase.from('cycles').upsert({
                   id: currentCyc.id,
                   name: currentCyc.name,
                   start_date: currentCyc.startDate,
                   weeks: currentCyc.weeks,
                   user_id: user.id
               });
               if (error) { showToast("Erreur sauvegarde Cycle: " + error.message, 'error'); } 
               else { showToast("Cycle sauvegardé (Cloud)"); }
           } else {
               localStorage.setItem('pingmanager_cycles', JSON.stringify(newCycles));
               showToast("Cycle sauvegardé (Local)");
           }
      } else {
           localStorage.setItem('pingmanager_cycles', JSON.stringify(newCycles));
           showToast("Cycle sauvegardé (Local)");
      }
  };

  const deleteCycleData = async (id: number) => {
      const newCycles = cycles.filter(c => c.id !== id);
      setCycles(newCycles);
      if (supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
              await supabase.from('cycles').delete().eq('id', id);
              showToast("Cycle supprimé (Cloud)");
          } else {
              localStorage.setItem('pingmanager_cycles', JSON.stringify(newCycles));
              showToast("Cycle supprimé (Local)");
          }
      } else {
          localStorage.setItem('pingmanager_cycles', JSON.stringify(newCycles));
          showToast("Cycle supprimé (Local)");
      }
  };

  const saveProfile = async () => {
      if (supabase && session) {
          const { error } = await supabase.from('profiles').upsert({
              id: session.user.id,
              full_name: coachProfile.name,
              club_name: coachProfile.club,
              license_number: coachProfile.license
          });
          if (error) {
              console.error("Profile save error", error);
              if (error.code === '42P01') { showToast("ERREUR : Table 'profiles' manquante.", 'error'); }
              else { showToast("Erreur sauvegarde profil", 'error'); }
          } else {
              showToast("Profil mis à jour (Cloud)");
          }
      } else {
          localStorage.setItem('pingmanager_profile', JSON.stringify(coachProfile));
          showToast("Profil mis à jour (Local)");
      }
  };

  const saveAIConfig = () => {
    localStorage.setItem('pingmanager_ai_config', JSON.stringify(aiConfig));
    showToast('Configuration IA sauvegardée !');
  };

  const handleLogout = async () => {
      if (confirm("Déconnexion : Vos données Cloud ne seront plus visibles en mode local. Continuer ?")) {
          if (supabase) await supabase.auth.signOut();
          setSavedSessions([]);
          setCycles([]);
          setExercises(INITIAL_EXERCISES); 
          setCoachProfile({ name: '', club: '', license: '' });
          setSession(null);
          setShowAuth(true);
          showToast("Déconnecté. Mode Local actif.");
      }
  };

  // --- SAVE HANDLERS ADDED HERE ---

  const saveSession = async () => {
      if (!currentSession.name.trim()) {
        showToast("Veuillez donner un nom à la séance.", 'error');
        return;
      }

      // If id is 0, it is a new session
      const isNew = currentSession.id === 0;
      const sessionToSave: Session = {
          ...currentSession,
          id: isNew ? Date.now() : currentSession.id
      };
      
      let newSessions;
      if (isNew) {
          newSessions = [sessionToSave, ...savedSessions];
      } else {
          newSessions = savedSessions.map(s => s.id === sessionToSave.id ? sessionToSave : s);
      }
      
      setCurrentSession(sessionToSave); // Update current session with valid ID
      await persistSessions(newSessions, sessionToSave);
  };

  const saveCycle = async () => {
      if (!currentCycle || !currentCycle.name) {
          showToast("Nom du cycle requis.", 'error');
          return;
      }
      
      const cycleId = (currentCycle as any).id || Date.now();
      const cycleToSave: Cycle = {
          ...currentCycle,
          id: cycleId
      } as Cycle;

      const exists = cycles.find(c => c.id === cycleId);
      let updatedCycles;
      if (exists) {
          updatedCycles = cycles.map(c => c.id === cycleId ? cycleToSave : c);
      } else {
          updatedCycles = [...cycles, cycleToSave];
      }

      await persistCycles(updatedCycles, cycleToSave);
      setCurrentCycle(null); // Close editor
  };

  const addNewExercise = async () => {
      if (!newExercise || !newExercise.name) {
          showToast("Nom de l'exercice requis.", 'error');
          return;
      }

      const exercise: Exercise = {
          ...newExercise,
          id: `custom_${Date.now()}`
      } as Exercise;

      const updatedExercises = [...exercises, exercise];
      await persistExercises(updatedExercises, exercise);
      setNewExercise(null); // Close editor
  };

  // ------------------------------

  // AI Handlers & Helpers (Unchanged)
  const handleRefineDescription = async () => {
    if (!newExercise?.description) return;
    setIsLoadingAI(true);
    const refinedDesc = await refineExerciseDescription(newExercise.description);
    setNewExercise(prev => prev ? {...prev, description: refinedDesc} : null);
    setIsLoadingAI(false);
  };
  const handleSuggestExercises = async () => {
    if (!currentSession.name) return alert("Nommez la séance d'abord !");
    setIsLoadingAI(true);
    try {
      const allExercises = Object.values(currentSession.exercises).flat().filter(e => e) as Exercise[];
      const suggestions = await suggestExercises(currentSession.name, allExercises.map(e => e.name));
      if (suggestions && Array.isArray(suggestions)) {
        setSuggestedExercises(suggestions.map((s: SuggestedExercise) => ({ ...s, phase: 'technique', id: `ai_${Date.now()}_${Math.random()}` })));
        setShowSuggestionsModal(true);
      }
    } catch (error) { console.error(error); } finally { setIsLoadingAI(false); }
  };
  const handleGenerateCycle = async () => {
      if (!currentCycle?.name) return alert("Définissez un objectif pour le cycle.");
      setIsLoadingAI(true);
      try {
        const result = await generateCyclePlan(currentCycle.name, currentCycle.weeks.length);
        if (result && result.weeks) setCurrentCycle(prev => prev ? { ...prev, weeks: result.weeks } : null);
      } catch (e) { console.error(e); } finally { setIsLoadingAI(false); }
  };
  const showCalendarPicker = () => { try { if (dateInputRef.current) (dateInputRef.current as any).showPicker?.() || dateInputRef.current.focus(); } catch (e) {} };
  const calculateTotalDuration = (session: Session) => { try { const allExercises = Object.values(session.exercises).flat() as Exercise[]; if (!Array.isArray(allExercises)) return 0; return allExercises.filter(e => e).reduce((sum, ex) => sum + (ex?.duration || 0), 0); } catch (e) { return 0; } };
  const getActiveCycleInfo = () => { const now = new Date(); now.setHours(0, 0, 0, 0); const active = cycles.map(c => { if (!c.startDate) return null; const [y, m, d] = c.startDate.split('-').map(Number); const start = new Date(y, m - 1, d); const diffTime = now.getTime() - start.getTime(); const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); if (diffDays < 0) return null; const weekIdx = Math.floor(diffDays / 7); if (weekIdx < c.weeks.length) { return { cycle: c, week: c.weeks[weekIdx], weekNum: weekIdx + 1, totalWeeks: c.weeks.length }; } return null; }).find(c => c !== null); return active; };
  const activeCycleData = getActiveCycleInfo();
  const totalDuration = calculateTotalDuration(currentSession);
  const filteredExercises = exercises.filter(ex => { if (!ex) return false; if (filterPhase !== 'all' && ex.phase !== filterPhase) return false; if (filterTheme !== 'all' && ex.theme !== filterTheme) return false; if (searchTerm) { const term = searchTerm.toLowerCase(); const matchName = ex.name ? ex.name.toLowerCase().includes(term) : false; const matchTheme = ex.theme ? ex.theme.toLowerCase().includes(term) : false; if (!matchName && !matchTheme) return false; } return true; });
  const handleDragStart = (exercise: Exercise) => setDraggedExercise(exercise);
  const handleDrop = (phaseId: PhaseId) => { if (draggedExercise) { setCurrentSession(prev => ({ ...prev, exercises: { ...prev.exercises, [phaseId]: [...(prev.exercises[phaseId] || []), { ...draggedExercise, instanceId: Date.now() }] } })); setDraggedExercise(null); } };
  const removeExerciseFromSession = (phaseId: PhaseId, instanceId: number) => { setCurrentSession(prev => ({ ...prev, exercises: { ...prev.exercises, [phaseId]: (prev.exercises[phaseId] || []).filter(ex => ex.instanceId !== instanceId) } })); };

  if (showAuth) return <Auth onAuthSuccess={() => setShowAuth(false)} />;

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary text-slate-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="bg-accent p-2 rounded-lg">
               <Target className="text-white" size={24} />
            </div>
            <div className="min-w-0">
                <h1 className="text-2xl font-bold text-white tracking-tight">Ping<span className="text-accent">Manager</span></h1>
                <div className="flex items-center gap-1 text-[10px] font-medium mt-1 truncate">
                    {session ? (
                        <><User size={10} className="text-emerald-400"/> <span className="text-emerald-400 truncate">{session.user.email}</span></>
                    ) : (
                        <><CloudOff size={10} className="text-slate-500"/> <span className="text-slate-500">Local</span></>
                    )}
                </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <SidebarItem view="dashboard" currentView={view} setView={setView} icon={LayoutDashboard} label="Tableau de bord" />
            <SidebarItem view="sessions" currentView={view} setView={setView} icon={Plus} label="Créer une séance" />
            <SidebarItem view="calendar" currentView={view} setView={setView} icon={CalendarIcon} label="Planification (Cycles)" />
            <SidebarItem view="history" currentView={view} setView={setView} icon={BookOpen} label="Historique Séances" />
            <SidebarItem view="library" currentView={view} setView={setView} icon={Filter} label="Bibliothèque Exos" />
            <SidebarItem view="settings" currentView={view} setView={setView} icon={Settings} label="Paramètres" />
          </nav>
          
          <div className="p-4">
             {session ? (
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 mb-4">
                    <LogOut size={16} /> Déconnexion
                </button>
             ) : (
                <button onClick={() => setShowAuth(true)} className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-accent hover:bg-accent-hover transition-colors rounded-lg mb-4 shadow-lg shadow-orange-500/20">
                    <LogIn size={16} /> Connexion Cloud
                </button>
             )}
             <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-accent">
                <Sparkles size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">AI Powered</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Boosté par {aiConfig.provider === 'openrouter' ? 'OpenRouter' : 'Gemini'}.</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800"><Target className="text-accent" /> PingManager</div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">{mobileMenuOpen ? <X /> : <Menu />}</button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
          {/* DASHBOARD */}
          {view === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">Bonjour, {coachProfile.name || 'Coach'} 👋</h2>
                  <p className="text-slate-500 mt-1">
                      {session ? "Mode Cloud actif. Données synchronisées." : "Mode Local. Données stockées sur cet appareil uniquement."}
                  </p>
                </div>
                <button onClick={() => setView('sessions')} className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"><Plus size={20} /> Nouvelle Séance</button>
              </div>
              {coachProfile.club && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full font-medium text-sm border border-indigo-100">
                      <Award size={16} />
                      {coachProfile.club} {coachProfile.license && <span className="text-indigo-400">| Lic: {coachProfile.license}</span>}
                  </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Séances Créées" value={savedSessions.length} icon={BookOpen} colorClass="bg-blue-500 text-white" />
                <StatCard title="Exercices Dispo" value={exercises.length} icon={Target} colorClass="bg-emerald-500 text-white" />
                <StatCard title="Cycles Actifs" value={cycles.length} icon={Users} colorClass="bg-purple-500 text-white" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden hover:shadow-md transition-shadow">
                        {activeCycleData ? (
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-accent mb-3"><CalendarDays size={18} /><span className="text-xs font-bold uppercase tracking-wider">Cycle en cours</span></div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">{activeCycleData.cycle.name}</h3>
                                <div className="flex items-baseline gap-2 mb-3"><span className="text-3xl font-bold text-accent">Semaine {activeCycleData.weekNum}</span><span className="text-slate-400 font-medium text-sm">/ {activeCycleData.totalWeeks}</span></div>
                                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4"><div className="text-xs font-bold text-orange-800 uppercase mb-1">Focus Technique</div><p className="text-lg font-semibold text-slate-800">{activeCycleData.week.theme || 'Thème libre'}</p>{activeCycleData.week.notes && <p className="text-sm text-slate-600 mt-2 italic">"{activeCycleData.week.notes}"</p>}</div>
                                <div className="flex gap-4 pt-2"><button onClick={() => { setCurrentSession({...EMPTY_SESSION, name: `S${activeCycleData.weekNum} - ${activeCycleData.week.theme || 'Entraînement'}`}); setView('sessions'); }} className="text-sm font-semibold text-slate-800 hover:text-accent flex items-center gap-1"><Plus size={16} /> Créer la séance</button></div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center"><div className="bg-slate-100 p-3 rounded-full mb-3 text-slate-400"><CalendarIcon size={24} /></div><h3 className="text-lg font-bold text-slate-800">Aucun cycle actif</h3><button onClick={() => setView('calendar')} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition mt-4">Démarrer un cycle</button></div>
                        )}
                      </div>
                       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                           <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-slate-800">Activités Récentes</h3><button onClick={() => setView('history')} className="text-sm text-accent font-medium hover:underline">Voir tout</button></div>
                           {savedSessions.length === 0 ? (<div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200"><p className="text-slate-400">Aucune séance récente.</p></div>) : (<div className="space-y-4">{savedSessions.slice(-3).reverse().map(session => (<div key={session.id} onClick={() => { setCurrentSession({...session}); setView('sessions'); }} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-orange-50 cursor-pointer border border-slate-100"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-slate-400"><CalendarIcon size={18} /></div><div><h4 className="font-bold text-slate-800">{session.name}</h4><p className="text-xs text-slate-500 mt-1">{new Date(session.date).toLocaleDateString()}</p></div></div></div>))}</div>)}
                       </div>
                  </div>
                  <div className="bg-gradient-to-br from-primary to-slate-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden flex flex-col justify-center"><div className="relative z-10"><h3 className="text-2xl font-bold mb-3">Besoin d'inspiration ?</h3><p className="text-slate-300 mb-8">L'IA est prête à vous aider.</p><button onClick={() => setView('sessions')} className="w-full bg-white text-slate-900 px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2">Créer avec l'IA <ArrowRight size={18} /></button></div></div>
              </div>
            </div>
          )}
          
          {/* SESSIONS, CALENDAR, HISTORY, LIBRARY (Unchanged logic, using generic components) */}
          {view === 'sessions' && (
             <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
               <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                     <div className="relative mb-3"><Search className="absolute left-3 top-2.5 text-slate-400" size={16} /><input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-sm text-slate-900" /></div>
                     <select value={filterPhase} onChange={(e) => setFilterPhase(e.target.value)} className="w-full text-xs p-2 border rounded-lg bg-white text-slate-900"><option value="all">Toutes phases</option>{PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}</select>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">{filteredExercises.map(ex => (<div key={ex.id} draggable onDragStart={() => handleDragStart(ex)} className="p-3 bg-white border rounded-xl hover:border-accent cursor-grab"><div className="flex justify-between items-start mb-1"><span className="font-semibold text-sm text-slate-800">{ex.name}</span><GripVertical size={16} className="text-slate-300"/></div><div className="flex gap-1"><span className="text-[10px] px-1.5 bg-slate-100 rounded">{PHASES.find(p => p.id === ex.phase)?.label}</span></div></div>))}</div>
               </div>
               <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200">
                  <div className="p-4 border-b border-slate-100 bg-white z-10 flex flex-col md:flex-row gap-4 justify-between items-center">
                     <div className="flex gap-3 w-full"><input type="text" placeholder="Nom de la séance" value={currentSession.name} onChange={(e) => setCurrentSession(prev => ({ ...prev, name: e.target.value }))} className="flex-1 p-2 text-lg font-bold bg-transparent border-b-2 border-transparent focus:border-accent outline-none text-slate-900" /><input type="date" value={currentSession.date} onChange={(e) => setCurrentSession(prev => ({ ...prev, date: e.target.value }))} className="p-2 bg-slate-50 rounded-lg text-sm text-slate-600 outline-none" /></div>
                     <div className="flex gap-2"><div className="text-right mr-2"><div className="text-xs text-slate-400 uppercase font-bold">Durée</div><div className="text-xl font-bold text-emerald-600">{totalDuration} min</div></div><GeminiButton onClick={handleSuggestExercises} isLoading={isLoadingAI} className="!py-2 !px-3 !text-sm">IA</GeminiButton><button onClick={saveSession} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"><Save size={20}/></button></div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">{PHASES.map(phase => (<PhaseDropZone key={phase.id} phase={phase} exercises={currentSession.exercises?.[phase.id] || []} onDrop={handleDrop} onRemove={removeExerciseFromSession}/>))}</div>
               </div>
             </div>
          )}
          
          {view === 'calendar' && (
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3"><CalendarIcon className="text-accent"/> Cycles</h2><button onClick={() => setCurrentCycle({ name: '', startDate: new Date().toISOString().split('T')[0], weeks: Array(12).fill(null).map((_, i) => ({ weekNumber: i + 1, theme: '', notes: '' })) })} className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg"><Plus size={18} /> Nouveau</button></div>
                {currentCycle && (
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 animate-fade-in ring-4 ring-slate-100">
                        <div className="flex justify-between mb-6"><h3 className="text-lg font-bold">Éditeur</h3><button onClick={() => setCurrentCycle(null)}><X /></button></div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6"><input type="text" className="md:col-span-8 p-3 border rounded-xl text-slate-900" placeholder="Objectif" value={currentCycle.name} onChange={(e) => setCurrentCycle({...currentCycle, name: e.target.value})} /><div className="md:col-span-4 relative"><input ref={dateInputRef} type="date" className="w-full p-3 border rounded-xl text-slate-900" value={currentCycle.startDate} onClick={showCalendarPicker} onChange={(e) => setCurrentCycle({...currentCycle, startDate: e.target.value})} /></div></div>
                        <div className="mb-6 bg-indigo-50 p-4 rounded-xl flex justify-between items-center"><div className="flex gap-3 text-indigo-900"><Bot size={24}/><span className="font-bold text-sm">Générer via IA</span></div><GeminiButton onClick={handleGenerateCycle} isLoading={isLoadingAI}>Générer</GeminiButton></div>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">{currentCycle.weeks.map((week, idx) => (<div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-lg border"><div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-slate-500 shrink-0">{week.weekNumber}</div><input type="text" placeholder="Thème" value={week.theme} onChange={(e) => {const w=[...currentCycle.weeks]; w[idx].theme=e.target.value; setCurrentCycle({...currentCycle, weeks:w})}} className="flex-1 p-2 border rounded text-sm text-slate-900"/><input type="text" placeholder="Notes" value={week.notes} onChange={(e) => {const w=[...currentCycle.weeks]; w[idx].notes=e.target.value; setCurrentCycle({...currentCycle, weeks:w})}} className="flex-1 p-2 border rounded text-sm hidden md:block text-slate-900"/></div>))}</div>
                        <div className="mt-6 flex justify-end gap-3"><button onClick={() => setCurrentCycle(null)} className="px-5 py-2 text-slate-600">Annuler</button><button onClick={saveCycle} className="px-6 py-2 bg-slate-900 text-white rounded-lg shadow-lg">Enregistrer</button></div>
                    </div>
                )}
                <div className="grid gap-6">{cycles.map(cycle => (<div key={cycle.id} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"><div className="flex justify-between items-start mb-6"><div><h3 className="text-xl font-bold text-slate-800">{cycle.name}</h3><p className="text-slate-500 text-sm mt-1">Début: {new Date(cycle.startDate).toLocaleDateString()}</p></div><div className="flex gap-2"><button onClick={() => setCurrentCycle(cycle)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Settings size={18}/></button><button onClick={() => setCycleToDelete(cycle.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button></div></div><div className="flex overflow-x-auto pb-4 gap-3 custom-scrollbar">{cycle.weeks.map((week, i) => (<div key={i} className={`min-w-[140px] p-3 rounded-xl border flex flex-col justify-between h-28 ${week.theme ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'}`}><span className="text-xs font-bold text-slate-400 uppercase">Sem {week.weekNumber}</span><p className="text-sm font-semibold line-clamp-2 text-slate-800">{week.theme || 'Repos'}</p></div>))}</div></div>))}</div>
            </div>
          )}
          
          {view === 'history' && (<div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6"><h2 className="text-2xl font-bold text-slate-800 mb-6">Historique</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{savedSessions.map(session => (<div key={session.id} className="border rounded-xl p-5 hover:border-accent cursor-pointer" onClick={() => { setCurrentSession({...session}); setView('sessions'); }}><h3 className="font-bold text-slate-800 line-clamp-1">{session.name}</h3><p className="text-xs text-slate-500 mb-4 flex items-center gap-2"><CalendarIcon size={12}/> {new Date(session.date).toLocaleDateString()}</p><div className="flex gap-2"><span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{calculateTotalDuration(session)} min</span></div></div>))}</div></div>)}
          
          {view === 'library' && (<div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6"><div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-slate-800">Bibliothèque</h2><button onClick={() => setNewExercise({ name: '', phase: 'technique', theme: null, duration: 15, description: '', material: '' })} className="bg-accent text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18} /> Créer</button></div>{newExercise && (<div className="mb-8 p-6 bg-slate-50 rounded-xl border animate-fade-in"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="text" placeholder="Nom" className="p-3 border rounded-lg col-span-2 text-slate-900" value={newExercise.name} onChange={e => setNewExercise({...newExercise, name: e.target.value})}/><select className="p-3 border rounded-lg text-slate-900" value={newExercise.phase} onChange={e => setNewExercise({...newExercise, phase: e.target.value as PhaseId})}>{PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}</select><input type="number" placeholder="Durée" className="p-3 border rounded-lg text-slate-900" value={newExercise.duration} onChange={e => setNewExercise({...newExercise, duration: parseInt(e.target.value)||0})}/><textarea className="col-span-2 p-3 border rounded-lg text-slate-900" rows={3} placeholder="Description" value={newExercise.description} onChange={e => setNewExercise({...newExercise, description: e.target.value})}></textarea><div className="col-span-2 flex justify-between items-center"><GeminiButton onClick={handleRefineDescription} isLoading={isLoadingAI}>Améliorer</GeminiButton><div className="flex gap-2"><button onClick={() => setNewExercise(null)} className="px-4 py-2 text-slate-500">Annuler</button><button onClick={addNewExercise} className="px-4 py-2 bg-slate-900 text-white rounded-lg">Sauvegarder</button></div></div></div></div>)}<div className="space-y-3">{exercises.map(ex => (<div key={ex.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition"><div><h4 className="font-bold text-slate-800">{ex.name}</h4><p className="text-sm text-slate-500 mt-1">{ex.description}</p></div><span className={`text-xs font-bold px-2 py-1 rounded uppercase ${PHASES.find(p => p.id === ex.phase)?.color.split(' ')[2]}`}>{PHASES.find(p => p.id === ex.phase)?.label}</span></div>))}</div></div>)}
          
          {/* SETTINGS VIEW (Updated) */}
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
                    <div className="flex items-center gap-3 mb-8 border-b pb-4"><div className="p-3 bg-slate-100 rounded-full"><Settings size={24} /></div><h2 className="text-2xl font-bold text-slate-800">Configuration IA</h2></div>
                    <div className="space-y-6">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Cpu size={16} className="text-accent"/> Fournisseur</label><div className="grid grid-cols-2 gap-4"><button onClick={() => setAiConfig({...aiConfig, provider: 'google', model: 'gemini-2.5-flash'})} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${aiConfig.provider === 'google' ? 'border-accent bg-orange-50 text-accent' : 'border-slate-200'}`}><span className="font-bold">Google</span></button><button onClick={() => setAiConfig({...aiConfig, provider: 'openrouter', model: 'mistralai/mistral-7b-instruct:free'})} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${aiConfig.provider === 'openrouter' ? 'border-accent bg-orange-50 text-accent' : 'border-slate-200'}`}><span className="font-bold">OpenRouter</span></button></div></div>
                    
                    {aiConfig.provider === 'openrouter' && (
                        <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Key size={16} className="text-accent"/> Clé API OpenRouter</label>
                        <input type="password" value={aiConfig.apiKey} onChange={(e) => setAiConfig({...aiConfig, apiKey: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="sk-or-..." />
                        </div>
                    )}
                    
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

      {/* Modals */}
      {showSuggestionsModal && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col"><div className="p-6 border-b flex justify-between items-center"><h3 className="text-xl font-bold">Suggestions IA</h3><button onClick={() => setShowSuggestionsModal(false)}><X /></button></div><div className="p-6 overflow-y-auto space-y-4 bg-slate-50/50">{suggestedExercises.map((ex, idx) => (<div key={idx} className="bg-white p-5 rounded-xl border shadow-sm"><h4 className="font-bold text-lg">{ex.name}</h4><p className="text-slate-600 mt-2 text-sm">{ex.description}</p><div className="mt-4 flex flex-wrap gap-2">{PHASES.map(p => (<button key={p.id} onClick={() => { setCurrentSession(prev => ({ ...prev, exercises: { ...prev.exercises, [p.id]: [...(prev.exercises[p.id] || []), {...ex, instanceId: Date.now()}] } })); setShowSuggestionsModal(false); }} className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-accent hover:text-white rounded-full transition-colors">+ {p.label}</button>))}</div></div>))}</div></div></div>)}
      {cycleToDelete && (<div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl text-center"><h3 className="text-lg font-bold mb-2">Supprimer ?</h3><div className="flex gap-3 justify-center"><button onClick={() => setCycleToDelete(null)} className="px-4 py-2 bg-slate-100 rounded-lg">Annuler</button><button onClick={() => deleteCycleData(cycleToDelete)} className="px-4 py-2 bg-red-500 text-white rounded-lg">Confirmer</button></div></div></div>)}
      
      <style>{`.custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }.animate-fade-in { animation: fade-in 0.4s ease-out forwards; }@media print { aside, header, .no-print { display: none !important; } main { margin: 0; padding: 0; overflow: visible; }}`}</style>
    </div>
  );
}
