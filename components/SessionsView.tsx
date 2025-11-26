import React, { useState, useMemo, useCallback } from 'react';
import { Search, GripVertical, Save, Clock, Target, Plus, X } from 'lucide-react';
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
  // Local state for filtering (avoids re-rendering parent App)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPhase, setFilterPhase] = useState('all');
  const [draggedExercise, setDraggedExercise] = useState<Exercise | null>(null);

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
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
      <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
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
              onDragStart={() => handleDragStart(ex)} 
              className="p-3 bg-white border rounded-xl hover:border-accent cursor-grab active:cursor-grabbing transition-colors group"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm text-slate-800 group-hover:text-accent transition-colors">{ex.name}</span>
                <GripVertical size={16} className="text-slate-300"/>
              </div>
              <div className="flex gap-1">
                <span className="text-[10px] px-1.5 bg-slate-100 rounded text-slate-500">{PHASES.find(p => p.id === ex.phase)?.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-100 bg-white z-10 flex flex-col md:flex-row gap-4 justify-between items-center">
           <div className="flex gap-3 w-full">
             <input 
               type="text" 
               placeholder="Nom de la séance" 
               value={currentSession.name} 
               onChange={(e) => setCurrentSession(prev => ({ ...prev, name: e.target.value }))} 
               className="flex-1 p-2 text-lg font-bold bg-transparent border-b-2 border-transparent focus:border-accent outline-none text-slate-900 transition-colors placeholder:text-slate-300" 
             />
             <input 
               type="date" 
               value={currentSession.date} 
               onChange={(e) => setCurrentSession(prev => ({ ...prev, date: e.target.value }))} 
               className="p-2 bg-slate-50 rounded-lg text-sm text-slate-600 outline-none border border-transparent focus:border-accent/50 cursor-pointer" 
             />
           </div>
           <div className="flex gap-2 shrink-0">
             <div className="text-right mr-2 hidden sm:block">
               <div className="text-xs text-slate-400 uppercase font-bold">Durée</div>
               <div className="text-xl font-bold text-emerald-600">{totalDuration} min</div>
             </div>
             <GeminiButton onClick={handleSuggestExercises} isLoading={isLoadingAI} className="!py-2 !px-3 !text-sm whitespace-nowrap">
               IA Suggest
             </GeminiButton>
             <button onClick={saveSession} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-md hover:shadow-lg transition-all">
               <Save size={20}/>
             </button>
           </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
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
  );
});