
import React, { useState, useMemo, useCallback } from 'react';
import { Search, GripVertical, Save, Clock, Target, Plus, X, List, Layers } from 'lucide-react';
import { Exercise, Session, PhaseId } from '../types';
import { PHASES } from '../constants';
import { GeminiButton } from './GeminiButton';

interface SessionsViewProps {
  exercises: Exercise[];
  currentSession: Session;
  setCurrentSession: React.Dispatch<React.SetStateAction<Session>>;
  saveSession: () => void;
  handleSuggestExercises: () => void;
  isLoadingAI: boolean;
  totalDuration: number;
}

const PhaseDropZone = React.memo(({ phase, exercises, onDrop, onRemove }: any) => {
  const [isOver, setIsOver] = useState(false);
  const safeExercises = Array.isArray(exercises) ? exercises : [];

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => { onDrop(phase.id); setIsOver(false); }}
      className={`transition-all duration-300 rounded-xl border-2 border-dashed p-4 min-h-[100px] 
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
          <div className="h-16 flex items-center justify-center text-slate-400 italic text-sm">
            Glissez des exercices ici
          </div>
        ) : (
          safeExercises.filter((ex: Exercise) => ex).map((ex: Exercise) => (
            <div key={ex.instanceId} className="group bg-white p-3 rounded-xl shadow-sm border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all flex items-start gap-3 relative">
               <div className="mt-1 p-1.5 bg-slate-50 rounded-lg text-slate-400">
                  <Target size={14} />
               </div>
               <div className="flex-1 min-w-0 pr-6">
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
                className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors p-1"
               >
                 <X size={18} />
               </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

export const SessionsView: React.FC<SessionsViewProps> = React.memo(({
  exercises,
  currentSession,
  setCurrentSession,
  saveSession,
  handleSuggestExercises,
  isLoadingAI,
  totalDuration
}) => {
  // Local state for filtering and Mobile UI
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPhase, setFilterPhase] = useState('all');
  const [draggedExercise, setDraggedExercise] = useState<Exercise | null>(null);
  
  // Tooltip State
  const [tooltip, setTooltip] = useState<{x: number, y: number, content: string} | null>(null);
  
  // Mobile Tab State: 'session' displayed by default to see content immediately
  const [activeTab, setActiveTab] = useState<'library' | 'session'>('session');

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => { 
        if (!ex) return false; 
        if (filterPhase !== 'all' && ex.phase !== filterPhase) return false; 
        if (searchTerm) { 
            const term = searchTerm.toLowerCase(); 
            const matchName = ex.name ? ex.name.toLowerCase().includes(term) : false; 
            const matchTheme = ex.theme ? ex.theme.toLowerCase().includes(term) : false; 
            if (!matchName && !matchTheme) return false; 
        } 
        return true; 
    });
  }, [exercises, filterPhase, searchTerm]);

  const handleDragStart = (exercise: Exercise) => setDraggedExercise(exercise);
  
  const handleDrop = useCallback((phaseId: PhaseId) => { 
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
  }, [draggedExercise, setCurrentSession]);

  // Mobile: Add exercise directly to its default phase on click
  const handleDirectAdd = (exercise: Exercise) => {
     setCurrentSession(prev => ({
         ...prev,
         exercises: {
             ...prev.exercises,
             [exercise.phase]: [...(prev.exercises[exercise.phase] || []), { ...exercise, instanceId: Date.now() }]
         }
     }));
     // Optional: Feedback or switch tab
     // setActiveTab('session'); 
  };

  const removeExerciseFromSession = useCallback((phaseId: PhaseId, instanceId: number) => { 
      setCurrentSession(prev => ({ 
        ...prev, 
        exercises: { 
          ...prev.exercises, 
          [phaseId]: (prev.exercises[phaseId] || []).filter(ex => ex.instanceId !== instanceId) 
        } 
      })); 
  }, [setCurrentSession]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] relative">
      
      {/* TOOLTIP RENDERER */}
      {tooltip && (
        <div 
          className="fixed z-[100] bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl max-w-xs pointer-events-none animate-fade-in border border-slate-700 leading-relaxed"
          style={{ top: tooltip.y + 15, left: Math.min(tooltip.x + 15, window.innerWidth - 320) }}
        >
          {tooltip.content}
        </div>
      )}

      {/* MOBILE TABS */}
      <div className="lg:hidden flex p-1 mx-4 mb-2 bg-slate-200 rounded-xl">
        <button 
            onClick={() => setActiveTab('library')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'library' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
            <List size={16}/> Bibliothèque
        </button>
        <button 
            onClick={() => setActiveTab('session')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'session' ? 'bg-white text-accent shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
            <Layers size={16}/> Ma Séance
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        
        {/* LEFT PANEL: LIBRARY (Hidden on mobile if tab is session) */}
        <div className={`w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden ${activeTab === 'session' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative mb-3">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                type="text" 
                placeholder="Rechercher..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-accent/20 outline-none" 
                />
            </div>
            <select 
                value={filterPhase} 
                onChange={(e) => setFilterPhase(e.target.value)} 
                className="w-full text-xs p-2 border rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-accent/20 outline-none"
            >
                <option value="all">Toutes phases</option>
                {PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {filteredExercises.map(ex => (
                <div 
                key={ex.id} 
                draggable 
                onDragStart={() => { handleDragStart(ex); setTooltip(null); }}
                onMouseEnter={(e) => !draggedExercise && setTooltip({x: e.clientX, y: e.clientY, content: ex.description})}
                onMouseMove={(e) => !draggedExercise && setTooltip({x: e.clientX, y: e.clientY, content: ex.description})}
                onMouseLeave={() => setTooltip(null)}
                className="p-3 bg-white border rounded-xl hover:border-accent cursor-grab active:cursor-grabbing transition-colors group flex justify-between items-center"
                >
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm text-slate-800 group-hover:text-accent transition-colors">{ex.name}</span>
                    </div>
                    <div className="flex gap-1">
                        <span className="text-[10px] px-1.5 bg-slate-100 rounded text-slate-500">{PHASES.find(p => p.id === ex.phase)?.label}</span>
                    </div>
                </div>
                {/* Mobile 'Add' Button because Drag&Drop is hard on touch */}
                <button 
                    onClick={() => handleDirectAdd(ex)}
                    className="lg:hidden p-2 bg-slate-50 text-accent rounded-lg border border-slate-200 active:bg-accent active:text-white"
                >
                    <Plus size={18}/>
                </button>
                <div className="hidden lg:block text-slate-300"><GripVertical size={16}/></div>
                </div>
            ))}
            </div>
        </div>

        {/* RIGHT PANEL: SESSION (Hidden on mobile if tab is library) */}
        <div className={`flex-1 flex flex-col overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200 ${activeTab === 'library' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 border-b border-slate-100 bg-white z-10 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-3 w-full items-start md:items-center">
                <input 
                type="text" 
                placeholder="Nom de la séance" 
                value={currentSession.name} 
                onChange={(e) => setCurrentSession(prev => ({ ...prev, name: e.target.value }))} 
                className="flex-1 w-full p-2 text-lg font-bold bg-transparent border-b-2 border-transparent focus:border-accent outline-none text-slate-900 transition-colors placeholder:text-slate-300" 
                />
                <input 
                type="date" 
                value={currentSession.date} 
                onChange={(e) => setCurrentSession(prev => ({ ...prev, date: e.target.value }))} 
                className="w-full md:w-auto p-2 bg-slate-50 rounded-lg text-sm text-slate-600 outline-none border border-transparent focus:border-accent/50 cursor-pointer" 
                />
            </div>
            <div className="flex justify-between items-center w-full">
                <div className="text-left">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Durée</div>
                    <div className="text-lg font-bold text-emerald-600">{totalDuration} min</div>
                </div>
                <div className="flex gap-2">
                    <GeminiButton onClick={handleSuggestExercises} isLoading={isLoadingAI} className="!py-2 !px-3 !text-sm whitespace-nowrap">
                    IA Suggest
                    </GeminiButton>
                    <button onClick={saveSession} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <Save size={20}/> <span className="hidden sm:inline font-bold text-sm">Sauvegarder</span>
                    </button>
                </div>
            </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar pb-20 lg:pb-4">
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
    </div>
  );
});
