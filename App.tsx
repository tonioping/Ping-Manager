
import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, Plus, Save, Printer, Filter, X, GripVertical, 
  Clock, Users, Target, Trash2, BookOpen, BarChart3, Bot, Search, 
  ChevronRight, LayoutDashboard, Settings, Menu, Sparkles, ArrowRight, CalendarDays
} from 'lucide-react';
import { Exercise, Session, Cycle, View, PhaseId, CycleWeek } from './types';
import { PHASES, THEMES, INITIAL_EXERCISES, EMPTY_SESSION } from './constants';
import { refineExerciseDescription, suggestExercises, generateCyclePlan, type SuggestedExercise } from './services/geminiService';
import { GeminiButton } from './components/GeminiButton';

// --- Sub-Components for cleaner code ---

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
  // Extract the base color name (e.g., 'blue' from 'bg-blue-500') to ensure correct text coloring
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

const PhaseDropZone = ({ phase, exercises, onDrop, onRemove, totalDuration }: any) => {
  const [isOver, setIsOver] = useState(false);
  // Ensure exercises is always an array
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
          // Filter out null/undefined exercises to prevent crashes
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
  // State
  const [view, setView] = useState<View>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentSession, setCurrentSession] = useState<Session>({...EMPTY_SESSION});
  const [savedSessions, setSavedSessions] = useState<Session[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  
  // Filters & Search
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

  // Initialization
  useEffect(() => {
    const loadData = () => {
      try {
        const exResult = localStorage.getItem('pingmanager_exercises');
        const sessResult = localStorage.getItem('pingmanager_sessions');
        const cyclesResult = localStorage.getItem('pingmanager_cycles');
        
        // Sanitize loaded data to ensure no nulls
        const loadedExercises = exResult ? JSON.parse(exResult) : INITIAL_EXERCISES;
        setExercises(Array.isArray(loadedExercises) ? loadedExercises.filter(e => e) : INITIAL_EXERCISES);

        const loadedSessions = sessResult ? JSON.parse(sessResult) : [];
        setSavedSessions(Array.isArray(loadedSessions) ? loadedSessions : []);
        
        const loadedCycles = cyclesResult ? JSON.parse(cyclesResult) : [];
        setCycles(Array.isArray(loadedCycles) ? loadedCycles : []);

      } catch (err) {
        console.error("Error loading data:", err);
        setExercises(INITIAL_EXERCISES);
        setSavedSessions([]);
        setCycles([]);
      }
    };
    loadData();
  }, []);

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem('pingmanager_exercises', JSON.stringify(exercises));
      localStorage.setItem('pingmanager_sessions', JSON.stringify(savedSessions));
      localStorage.setItem('pingmanager_cycles', JSON.stringify(cycles));
    } catch (err) { console.error('Save error:', err); }
  }, [exercises, savedSessions, cycles]);

  // Helpers
  const filteredExercises = exercises.filter(ex => {
    if (!ex) return false; // Safety check
    if (filterPhase !== 'all' && ex.phase !== filterPhase) return false;
    if (filterTheme !== 'all' && ex.theme !== filterTheme) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = ex.name ? ex.name.toLowerCase().includes(term) : false;
      const matchTheme = ex.theme ? ex.theme.toLowerCase().includes(term) : false;
      if (!matchName && !matchTheme) return false;
    }
    return true;
  });

  const calculateTotalDuration = (session: Session) => {
    if (!session || !session.exercises) return 0;
    try {
      const allExercises = Object.values(session.exercises).flat() as Exercise[];
      if (!Array.isArray(allExercises)) return 0;
      // Filter nulls before reduce
      return allExercises.filter(e => e).reduce((sum, ex) => sum + (ex?.duration || 0), 0);
    } catch (e) {
      console.warn("Error calculating duration", e);
      return 0;
    }
  };

  const getActiveCycleInfo = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset time for accurate date comparison

    // Find first active cycle
    const active = cycles.map(c => {
        if (!c.startDate) return null;
        
        // Fix: Create date from parts to avoid UTC conversion issues that might shift the day
        const [y, m, d] = c.startDate.split('-').map(Number);
        const start = new Date(y, m - 1, d); // Local time 00:00:00
        
        const diffTime = now.getTime() - start.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // Check if cycle has started
        if (diffDays < 0) return null;

        const weekIdx = Math.floor(diffDays / 7);
        
        // Check if cycle is still ongoing
        if (weekIdx < c.weeks.length) {
            return { 
                cycle: c, 
                week: c.weeks[weekIdx], 
                weekNum: weekIdx + 1,
                totalWeeks: c.weeks.length 
            };
        }
        return null;
    }).find(c => c !== null);

    return active;
  };

  const activeCycleData = getActiveCycleInfo();

  // Drag & Drop Handlers
  const handleDragStart = (exercise: Exercise) => setDraggedExercise(exercise);
  
  const handleDrop = (phaseId: PhaseId) => {
    if (draggedExercise) {
      setCurrentSession(prev => ({
        ...prev,
        exercises: {
          ...prev.exercises,
          [phaseId]: [...(prev.exercises[phaseId] || []), { ...draggedExercise, instanceId: Date.now() }]
        }
      }));
      setDraggedExercise(null);
    }
  };

  const removeExerciseFromSession = (phaseId: PhaseId, instanceId: number) => {
    setCurrentSession(prev => ({
      ...prev,
      exercises: {
        ...prev.exercises,
        [phaseId]: (prev.exercises[phaseId] || []).filter(ex => ex.instanceId !== instanceId)
      }
    }));
  };

  // Data Operations
  const saveSession = () => {
    if (!currentSession.name.trim()) return;
    const existingSessionIndex = savedSessions.findIndex(s => s.id === currentSession.id);
    if (existingSessionIndex > -1) {
        const updated = [...savedSessions];
        updated[existingSessionIndex] = currentSession;
        setSavedSessions(updated);
    } else {
        setSavedSessions(prev => [...prev, { ...currentSession, id: Date.now() }]);
    }
    setCurrentSession({ ...EMPTY_SESSION });
    setView('history');
  };

  const addNewExercise = () => {
    if (!newExercise?.name) return;
    setExercises(prev => [...prev, { ...newExercise, id: `custom_${Date.now()}` } as Exercise]);
    setNewExercise(null);
  };

  const saveCycle = () => {
    if (!currentCycle?.name) return;
    if ('id' in currentCycle) {
       setCycles(prev => prev.map(c => c.id === currentCycle.id ? currentCycle as Cycle : c));
    } else {
       setCycles(prev => [...prev, { ...currentCycle, id: Date.now() } as Cycle]);
    }
    setCurrentCycle(null);
  };

  // AI Handlers
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
      const existingNames = allExercises.map(e => e.name);
      
      const suggestions = await suggestExercises(currentSession.name, existingNames);
      if (suggestions && Array.isArray(suggestions)) {
        setSuggestedExercises(suggestions.map((s: SuggestedExercise) => ({ ...s, phase: 'technique', id: `ai_${Date.now()}_${Math.random()}` })));
        setShowSuggestionsModal(true);
      } else {
        alert("L'IA n'a pas pu générer de suggestions valides.");
      }
    } catch (error) {
      console.error("Suggestion error:", error);
    } finally {
      setIsLoadingAI(false);
    }
  };
  
  const handleGenerateCycle = async () => {
      if (!currentCycle?.name) return alert("Définissez un objectif pour le cycle.");
      setIsLoadingAI(true);
      try {
        const result = await generateCyclePlan(currentCycle.name, currentCycle.weeks.length);
        if (result && result.weeks) {
          setCurrentCycle(prev => prev ? { ...prev, weeks: result.weeks } : null);
        }
      } catch (e) {
        console.error("Cycle gen error:", e);
      } finally {
        setIsLoadingAI(false);
      }
  };

  const totalDuration = calculateTotalDuration(currentSession);
  const targetDuration = 90;

  const showCalendarPicker = () => {
    try {
      if (dateInputRef.current) {
        if (typeof (dateInputRef.current as any).showPicker === 'function') {
          (dateInputRef.current as any).showPicker();
        } else {
          dateInputRef.current.focus();
        }
      }
    } catch (e) {
      console.warn("Picker error", e);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary text-slate-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="bg-accent p-2 rounded-lg">
               <Target className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Ping<span className="text-accent">Manager</span></h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <SidebarItem view="dashboard" currentView={view} setView={setView} icon={LayoutDashboard} label="Tableau de bord" />
            <SidebarItem view="sessions" currentView={view} setView={setView} icon={Plus} label="Créer une séance" />
            <SidebarItem view="calendar" currentView={view} setView={setView} icon={CalendarIcon} label="Planification (Cycles)" />
            <SidebarItem view="history" currentView={view} setView={setView} icon={BookOpen} label="Historique Séances" />
            <SidebarItem view="library" currentView={view} setView={setView} icon={Filter} label="Bibliothèque Exos" />
          </nav>
          
          <div className="p-4 bg-slate-900/50 m-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-accent">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">AI Powered</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">Utilisez Gemini 2.5 Flash pour optimiser vos entraînements.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Target className="text-accent" /> PingManager
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
          
          {/* DASHBOARD VIEW */}
          {view === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">Bonjour, Coach 👋</h2>
                  <p className="text-slate-500 mt-1">Voici un aperçu de votre activité.</p>
                </div>
                <button onClick={() => setView('sessions')} className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2">
                  <Plus size={20} /> Nouvelle Séance
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Séances Créées" value={savedSessions.length} icon={BookOpen} colorClass="bg-blue-500 text-white" />
                <StatCard title="Exercices Dispo" value={exercises.length} icon={Target} colorClass="bg-emerald-500 text-white" />
                <StatCard title="Cycles Actifs" value={cycles.length} icon={Users} colorClass="bg-purple-500 text-white" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  
                  {/* Active Cycle Card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden hover:shadow-md transition-shadow">
                      {activeCycleData ? (
                          <>
                              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                  <Target size={120} className="text-accent" />
                              </div>
                              <div className="relative z-10">
                                  <div className="flex items-center gap-2 text-accent mb-3">
                                      <CalendarDays size={18} />
                                      <span className="text-xs font-bold uppercase tracking-wider">Cycle en cours</span>
                                  </div>
                                  <h3 className="text-xl font-bold text-slate-800 mb-1">
                                      {activeCycleData.cycle.name}
                                  </h3>
                                  <div className="flex items-baseline gap-2 mb-3">
                                    <span className="text-3xl font-bold text-accent">Semaine {activeCycleData.weekNum}</span>
                                    <span className="text-slate-400 font-medium text-sm">/ {activeCycleData.totalWeeks}</span>
                                  </div>
                                  
                                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4">
                                      <div className="text-xs font-bold text-orange-800 uppercase mb-1">Focus Technique</div>
                                      <p className="text-lg font-semibold text-slate-800">{activeCycleData.week.theme || 'Thème libre'}</p>
                                      {activeCycleData.week.notes && (
                                        <p className="text-sm text-slate-600 mt-2 italic">"{activeCycleData.week.notes}"</p>
                                      )}
                                  </div>

                                  <div className="flex gap-4 pt-2">
                                      <button onClick={() => { setCurrentSession({...EMPTY_SESSION, name: `S${activeCycleData.weekNum} - ${activeCycleData.week.theme || 'Entraînement'}`}); setView('sessions'); }} className="text-sm font-semibold text-slate-800 hover:text-accent flex items-center gap-1">
                                          <Plus size={16} /> Créer la séance
                                      </button>
                                      <button onClick={() => { setCurrentCycle(activeCycleData.cycle); setView('calendar'); }} className="text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1">
                                          <Settings size={16} /> Gérer le cycle
                                      </button>
                                  </div>
                              </div>
                          </>
                      ) : (
                          <div className="flex flex-col items-center justify-center py-6 text-center">
                               <div className="bg-slate-100 p-3 rounded-full mb-3 text-slate-400">
                                 <CalendarIcon size={24} />
                               </div>
                               <h3 className="text-lg font-bold text-slate-800">Aucun cycle actif</h3>
                               <p className="text-slate-500 text-sm mb-4 max-w-xs mx-auto">Planifiez votre saison pour voir les objectifs de la semaine s'afficher ici.</p>
                               <button onClick={() => setView('calendar')} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition">
                                  Démarrer un cycle
                               </button>
                          </div>
                      )}
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-slate-800">Activités Récentes</h3>
                      <button onClick={() => setView('history')} className="text-sm text-accent font-medium hover:underline">Voir tout</button>
                    </div>
                    {savedSessions.length === 0 ? (
                      <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-400">Aucune séance récente.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {savedSessions.slice(-3).reverse().map(session => (
                          <div key={session.id} onClick={() => { setCurrentSession({...session}); setView('sessions'); }} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-orange-50 cursor-pointer group transition-colors border border-slate-100">
                             <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-accent group-hover:border-orange-200 transition-colors">
                                 <CalendarIcon size={20} />
                               </div>
                               <div>
                                 <h4 className="font-bold text-slate-800">{session.name}</h4>
                                 <p className="text-xs text-slate-500 mt-1">{new Date(session.date).toLocaleDateString('fr-FR', {dateStyle: 'long'})}</p>
                               </div>
                             </div>
                             <div className="text-right">
                                <span className="inline-block px-3 py-1 bg-white rounded-full text-xs font-bold text-slate-600 border border-slate-100">
                                  {session.exercises ? Object.values(session.exercises).flat().filter(e=>e).length : 0} exos
                                </span>
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column (AI Promo) */}
                <div className="bg-gradient-to-br from-primary to-slate-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden flex flex-col justify-center h-full min-h-[300px]">
                   <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-accent rounded-full opacity-20 blur-3xl"></div>
                   <div className="relative z-10">
                     <div className="bg-white/10 w-fit p-2 rounded-lg mb-4 backdrop-blur-sm border border-white/10">
                        <Bot size={24} className="text-accent" />
                     </div>
                     <h3 className="text-2xl font-bold mb-3">Besoin d'inspiration ?</h3>
                     <p className="text-slate-300 mb-8 leading-relaxed">
                        Laissez l'IA Gemini analyser vos objectifs et vous suggérer des exercices sur-mesure pour compléter vos séances.
                     </p>
                     <button onClick={() => setView('sessions')} className="w-full bg-white text-slate-900 hover:bg-slate-100 px-5 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg">
                       Créer avec l'IA <ArrowRight size={18} />
                     </button>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* SESSIONS BUILDER VIEW */}
          {view === 'sessions' && (
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
              {/* Left: Library */}
              <div className="w-full lg:w-80 lg:min-w-[320px] bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                 <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><BookOpen size={18} className="text-accent"/> Bibliothèque</h3>
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Rechercher un exercice..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select value={filterPhase} onChange={(e) => setFilterPhase(e.target.value)} className="flex-1 text-xs p-2 border rounded-lg bg-white text-slate-900">
                        <option value="all">Toutes phases</option>
                        {PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                      </select>
                    </div>
                 </div>
                 <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {filteredExercises.map(ex => (
                      <div 
                        key={ex.id} 
                        draggable 
                        onDragStart={() => handleDragStart(ex)}
                        className="p-3 bg-white border border-slate-200 rounded-xl hover:border-accent hover:shadow-md cursor-grab active:cursor-grabbing transition-all group"
                      >
                        <div className="flex justify-between items-start mb-1">
                           <span className="font-semibold text-sm text-slate-800 leading-tight">{ex.name}</span>
                           <GripVertical size={16} className="text-slate-300 group-hover:text-accent" />
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                           <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border">{PHASES.find(p => p.id === ex.phase)?.label}</span>
                           {ex.theme && <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100">{ex.theme}</span>}
                           <span className="text-[10px] px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded border border-orange-100 font-medium ml-auto">{ex.duration}m</span>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Right: Workspace */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200">
                 {/* Sticky Header for Session Info */}
                 <div className="p-4 border-b border-slate-100 bg-white z-10">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                       <div className="flex-1 w-full md:w-auto flex gap-3">
                          <input 
                            type="text" 
                            placeholder="Nom de la séance (ex: Perfectionnement Service)" 
                            value={currentSession.name}
                            onChange={(e) => setCurrentSession(prev => ({ ...prev, name: e.target.value }))}
                            className="flex-1 p-2 text-lg font-bold text-slate-800 placeholder-slate-300 border-b-2 border-transparent focus:border-accent focus:outline-none bg-transparent"
                          />
                          <input type="date" value={currentSession.date} onChange={(e) => setCurrentSession(prev => ({ ...prev, date: e.target.value }))} className="p-2 bg-slate-50 rounded-lg text-sm border border-transparent focus:border-accent outline-none text-slate-600" />
                       </div>
                       
                       <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                          <div className="flex flex-col items-end mr-2">
                            <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Durée Totale</div>
                            <div className={`text-xl font-bold ${totalDuration > targetDuration ? 'text-red-500' : 'text-emerald-600'}`}>
                              {totalDuration}<span className="text-sm text-slate-400 font-normal">/{targetDuration} min</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                             <GeminiButton onClick={handleSuggestExercises} isLoading={isLoadingAI} className="!py-2 !px-3 !text-sm">IA</GeminiButton>
                             <button onClick={saveSession} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-500/20"><Save size={20} /></button>
                             <button onClick={() => window.print()} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"><Printer size={20} /></button>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Phases Drop Zones */}
                 <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                    {PHASES.map(phase => (
                       <PhaseDropZone 
                         key={phase.id} 
                         phase={phase} 
                         exercises={currentSession.exercises?.[phase.id] || []} 
                         onDrop={handleDrop} 
                         onRemove={removeExerciseFromSession}
                       />
                    ))}
                 </div>
              </div>
            </div>
          )}

          {/* CALENDAR / CYCLES VIEW */}
          {view === 'calendar' && (
             <div className="max-w-6xl mx-auto space-y-6">
               <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3"><CalendarIcon className="text-accent"/> Cycles d'Entraînement</h2>
                  <button onClick={() => setCurrentCycle({ name: '', startDate: new Date().toISOString().split('T')[0], weeks: Array(12).fill(null).map((_, i) => ({ weekNumber: i + 1, theme: '', notes: '' })) })} className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition shadow-lg">
                    <Plus size={18} /> Nouveau Cycle
                  </button>
               </div>

               {/* Editor */}
               {currentCycle && (
                 <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 animate-fade-in ring-4 ring-slate-100">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                       <h3 className="text-lg font-bold text-slate-800">Éditeur de Planification</h3>
                       <button onClick={() => setCurrentCycle(null)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                       <div className="md:col-span-8">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nom de l'objectif</label>
                          <input 
                            type="text" 
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none font-medium text-slate-900 shadow-sm placeholder:text-slate-400" 
                            placeholder="Ex: Préparation Championnat Régional" 
                            value={currentCycle.name} 
                            onChange={(e) => setCurrentCycle({...currentCycle, name: e.target.value})} 
                          />
                       </div>
                       <div className="md:col-span-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date de début</label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                              <CalendarIcon size={18} />
                            </div>
                            <input 
                                ref={dateInputRef}
                                type="date" 
                                className="w-full p-3 pl-10 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-accent text-slate-900 shadow-sm cursor-pointer font-medium" 
                                value={currentCycle.startDate} 
                                onClick={showCalendarPicker}
                                onChange={(e) => setCurrentCycle({...currentCycle, startDate: e.target.value})} 
                            />
                          </div>
                       </div>
                    </div>

                    <div className="mb-6 flex items-center justify-between bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                       <div className="flex items-center gap-3 text-indigo-900">
                          <Bot size={24} />
                          <div>
                             <p className="font-bold text-sm">Génération automatique</p>
                             <p className="text-xs opacity-80">Laissez l'IA structurer votre progression</p>
                          </div>
                       </div>
                       <GeminiButton onClick={handleGenerateCycle} isLoading={isLoadingAI}>Générer le plan</GeminiButton>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                       {currentCycle.weeks.map((week, idx) => (
                         <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm shrink-0">{week.weekNumber}</div>
                            <input type="text" placeholder="Thème (ex: Topspin)" value={week.theme} onChange={(e) => {
                              const newWeeks = [...currentCycle.weeks];
                              newWeeks[idx].theme = e.target.value;
                              setCurrentCycle({...currentCycle, weeks: newWeeks});
                            }} className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-accent text-slate-900 placeholder:text-slate-400" />
                            <input type="text" placeholder="Notes" value={week.notes} onChange={(e) => {
                              const newWeeks = [...currentCycle.weeks];
                              newWeeks[idx].notes = e.target.value;
                              setCurrentCycle({...currentCycle, weeks: newWeeks});
                            }} className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-accent hidden md:block text-slate-900 placeholder:text-slate-400" />
                         </div>
                       ))}
                    </div>
                    
                    <div className="mt-6 flex justify-end gap-3">
                       <button onClick={() => setCurrentCycle(null)} className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">Annuler</button>
                       <button onClick={saveCycle} className="px-6 py-2 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 transition font-medium">Enregistrer</button>
                    </div>
                 </div>
               )}

               {/* List of Cycles */}
               <div className="grid gap-6">
                 {cycles.map(cycle => (
                   <div key={cycle.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <h3 className="text-xl font-bold text-slate-800">{cycle.name}</h3>
                            <p className="text-slate-500 text-sm mt-1">Début: {new Date(cycle.startDate).toLocaleDateString()} • {cycle.weeks.length} semaines</p>
                         </div>
                         <div className="flex gap-2">
                            <button onClick={() => setCurrentCycle(cycle)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Settings size={18}/></button>
                            <button onClick={() => setCycleToDelete(cycle.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                         </div>
                      </div>
                      
                      {/* Horizontal Timeline */}
                      <div className="flex overflow-x-auto pb-4 gap-3 custom-scrollbar">
                         {cycle.weeks.map((week, i) => (
                           <div key={i} className={`min-w-[140px] p-3 rounded-xl border flex flex-col justify-between h-28 ${week.theme ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'}`}>
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase">Sem {week.weekNumber}</span>
                                {week.theme && <div className="w-2 h-2 rounded-full bg-accent"></div>}
                              </div>
                              <p className={`text-sm font-semibold line-clamp-2 ${week.theme ? 'text-orange-900' : 'text-slate-300'}`}>
                                {week.theme || 'Repos / Libre'}
                              </p>
                           </div>
                         ))}
                      </div>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {/* OTHER VIEWS (History & Library Wrapper - simplified logic reuses components potentially but kept explicit for xml) */}
          {view === 'history' && (
             <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Historique des Séances</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {savedSessions.map(session => (
                     <div key={session.id} className="border border-slate-200 rounded-xl p-5 hover:border-accent hover:shadow-md transition-all cursor-pointer" onClick={() => { setCurrentSession({...session}); setView('sessions'); }}>
                        <div className="flex justify-between items-start mb-3">
                           <h3 className="font-bold text-slate-800 line-clamp-1">{session.name}</h3>
                           <ArrowRight size={16} className="text-slate-300"/>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 flex items-center gap-2"><CalendarIcon size={12}/> {new Date(session.date).toLocaleDateString()}</p>
                        <div className="flex gap-2">
                           <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">{calculateTotalDuration(session)} min</span>
                           <span className="text-xs bg-orange-50 text-accent px-2 py-1 rounded-md font-medium">{session.exercises ? Object.values(session.exercises).flat().filter(e=>e).length : 0} exercices</span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          )}

          {view === 'library' && (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Bibliothèque Globale</h2>
                  <button onClick={() => setNewExercise({ name: '', phase: 'technique', theme: null, duration: 15, description: '', material: '' })} className="bg-accent text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:bg-accent-hover transition">
                    <Plus size={18} /> Créer
                  </button>
                </div>
                
                {newExercise && (
                  <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 animate-fade-in">
                     <h3 className="font-bold text-lg mb-4">Nouvel Exercice</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Nom" className="p-3 border rounded-lg col-span-2 text-slate-900 placeholder:text-slate-400" value={newExercise.name} onChange={e => setNewExercise({...newExercise, name: e.target.value})}/>
                        <select className="p-3 border rounded-lg text-slate-900" value={newExercise.phase} onChange={e => setNewExercise({...newExercise, phase: e.target.value as PhaseId})}>
                           {PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                        </select>
                        <input type="number" placeholder="Durée" className="p-3 border rounded-lg text-slate-900 placeholder:text-slate-400" value={newExercise.duration} onChange={e => setNewExercise({...newExercise, duration: parseInt(e.target.value)||0})}/>
                        <textarea className="col-span-2 p-3 border rounded-lg text-slate-900 placeholder:text-slate-400" rows={3} placeholder="Description" value={newExercise.description} onChange={e => setNewExercise({...newExercise, description: e.target.value})}></textarea>
                        <div className="col-span-2 flex justify-between items-center">
                           <GeminiButton onClick={handleRefineDescription} isLoading={isLoadingAI}>Améliorer la description</GeminiButton>
                           <div className="flex gap-2">
                              <button onClick={() => setNewExercise(null)} className="px-4 py-2 text-slate-500">Annuler</button>
                              <button onClick={addNewExercise} className="px-4 py-2 bg-slate-900 text-white rounded-lg">Sauvegarder</button>
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                <div className="space-y-3">
                   {exercises.map(ex => (
                     <div key={ex.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                        <div>
                           <h4 className="font-bold text-slate-800">{ex.name}</h4>
                           <p className="text-sm text-slate-500 mt-1">{ex.description}</p>
                        </div>
                        <div className="text-right">
                           <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${PHASES.find(p => p.id === ex.phase)?.color.split(' ')[2]}`}>
                              {PHASES.find(p => p.id === ex.phase)?.label}
                           </span>
                        </div>
                     </div>
                   ))}
                </div>
            </div>
          )}

        </div>
      </main>

      {/* Modals */}
      {showSuggestionsModal && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
             <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Sparkles size={20}/></div>
                      <h3 className="text-xl font-bold text-slate-800">Suggestions IA</h3>
                   </div>
                   <button onClick={() => setShowSuggestionsModal(false)}><X className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                   {suggestedExercises.map((ex, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-accent/50 transition-all">
                         <div className="flex justify-between items-start">
                            <h4 className="font-bold text-lg text-slate-800">{ex.name}</h4>
                            <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold">{ex.theme}</span>
                         </div>
                         <p className="text-slate-600 mt-2 text-sm leading-relaxed">{ex.description}</p>
                         <div className="mt-4 flex flex-wrap gap-2">
                            {PHASES.map(p => (
                               <button key={p.id} onClick={() => {
                                  setCurrentSession(prev => ({
                                    ...prev,
                                    exercises: { ...prev.exercises, [p.id]: [...(prev.exercises[p.id] || []), {...ex, instanceId: Date.now()}] }
                                  }));
                                  setShowSuggestionsModal(false);
                               }} className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-accent hover:text-white rounded-full transition-colors font-medium text-slate-600">
                                  + {p.label}
                               </button>
                            ))}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
         </div>
      )}
      
      {cycleToDelete && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl text-center">
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24}/></div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Supprimer le cycle ?</h3>
              <p className="text-slate-500 text-sm mb-6">Cette action est irréversible.</p>
              <div className="flex gap-3 justify-center">
                 <button onClick={() => setCycleToDelete(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium">Annuler</button>
                 <button onClick={() => { setCycles(prev => prev.filter(c => c.id !== cycleToDelete)); setCycleToDelete(null); }} className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600">Confirmer</button>
              </div>
           </div>
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        @media print {
           aside, header, .no-print { display: none !important; }
           main { margin: 0; padding: 0; overflow: visible; }
        }
      `}</style>
    </div>
  );
}
