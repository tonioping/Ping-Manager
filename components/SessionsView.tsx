
import React, { useState, useMemo, useCallback } from 'react';
import { Search, GripVertical, Save, Clock, Target, Plus, X, List, Layers, Box } from 'lucide-react';
import { Exercise, Session, PhaseId } from '../types';
import { PHASES } from '../constants';
import { GeminiButton } from './GeminiButton';
import { InfoBubble } from './InfoBubble';

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
          <div className="h-16 flex items-center justify-center text-slate-400 italic text-sm">Glissez des exercices ici</div>
        ) : (
          safeExercises.filter((ex: Exercise) => ex).map((ex: Exercise) => (
            <div key={ex.instanceId} className="group bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-start gap-3 relative">
               <div className="flex-1 min-w-0 pr-6">
                 <div className="font-semibold text-slate-800 truncate">{ex.name}</div>
                 <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs font-bold text-accent flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded"><Clock size={12} /> {ex.duration} min</span>
                 </div>
               </div>
               <button onClick={() => onRemove(phase.id, ex.instanceId)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors p-1"><X size={18} /></button>
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPhase, setFilterPhase] = useState('all');
  const [filterMaterial, setFilterMaterial] = useState<'all' | 'panier'>('all');
  const [draggedExercise, setDraggedExercise] = useState<Exercise | null>(null);
  const [activeTab, setActiveTab] = useState<'library' | 'session'>('session');

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => { 
        if (!ex) return false; 
        if (filterPhase !== 'all' && ex.phase !== filterPhase) return false; 
        if (filterMaterial === 'panier' && ex.material !== 'Panier de balles') return false;
        if (searchTerm) { 
            const term = searchTerm.toLowerCase(); 
            if (!ex.name.toLowerCase().includes(term)) return false; 
        } 
        return true; 
    });
  }, [exercises, filterPhase, filterMaterial, searchTerm]);

  const handleDragStart = (exercise: Exercise) => setDraggedExercise(exercise);
  
  const handleDrop = useCallback((phaseId: PhaseId) => { 
      if (draggedExercise) { 
          setCurrentSession(prev => ({ ...prev, exercises: { ...prev.exercises, [phaseId]: [...(prev.exercises[phaseId] || []), { ...draggedExercise, instanceId: Date.now() }] } })); 
          setDraggedExercise(null); 
      } 
  }, [draggedExercise, setCurrentSession]);

  const handleDirectAdd = (exercise: Exercise) => {
     setCurrentSession(prev => ({ ...prev, exercises: { ...prev.exercises, [exercise.phase]: [...(prev.exercises[exercise.phase] || []), { ...exercise, instanceId: Date.now() }] } }));
  };

  const removeExerciseFromSession = useCallback((phaseId: PhaseId, instanceId: number) => { 
      setCurrentSession(prev => ({ ...prev, exercises: { ...prev.exercises, [phaseId]: (prev.exercises[phaseId] || []).filter(ex => ex.instanceId !== instanceId) } })); 
  }, [setCurrentSession]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] relative">
      <div className="lg:hidden flex p-1 mx-4 mb-2 bg-slate-200 rounded-xl">
        <button onClick={() => setActiveTab('library')} className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 ${activeTab === 'library' ? 'bg-white shadow-sm' : 'text-slate-500'}`}><List size={16}/> Biblio</button>
        <button onClick={() => setActiveTab('session')} className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 ${activeTab === 'session' ? 'bg-white shadow-sm' : 'text-slate-500'}`}><Layers size={16}/> Séance</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden px-4 md:px-0">
        <div className={`w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden ${activeTab === 'session' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bibliothèque</span>
                <InfoBubble content="Maintenez un exercice et glissez-le dans une zone à droite pour l'ajouter." />
              </div>
              <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 bg-white border rounded-lg text-sm text-slate-900 outline-none" />
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {filteredExercises.map(ex => (
                <div key={ex.id} draggable onDragStart={() => handleDragStart(ex)} className="p-3 bg-white border rounded-xl hover:border-accent cursor-grab active:cursor-grabbing flex justify-between items-center group">
                <div className="flex-1"><span className="font-semibold text-sm text-slate-800">{ex.name}</span></div>
                <button onClick={() => handleDirectAdd(ex)} className="lg:hidden p-2 text-accent"><Plus size={18}/></button>
                <div className="hidden lg:block text-slate-300"><GripVertical size={16}/></div>
                </div>
            ))}
            </div>
        </div>

        <div className={`flex-1 flex flex-col overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200 ${activeTab === 'library' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 border-b border-slate-100 bg-white z-10">
              <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-4">
                  <input type="text" placeholder="Nom de la séance" value={currentSession.name} onChange={(e) => setCurrentSession(prev => ({ ...prev, name: e.target.value }))} className="flex-1 w-full p-2 text-lg font-bold bg-transparent border-b-2 border-transparent focus:border-accent outline-none text-slate-900 transition-colors" />
                  <div className="flex gap-2">
                      <div className="flex items-center gap-1">
                        <GeminiButton onClick={handleSuggestExercises} isLoading={isLoadingAI} className="!py-2 !px-3 !text-sm">IA Suggest</GeminiButton>
                        <InfoBubble content="L'IA analyse le titre de votre séance pour vous proposer 3 exercices originaux et complémentaires." position="left" />
                      </div>
                      <button onClick={saveSession} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-md flex items-center gap-2"><Save size={20}/></button>
                  </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
            {PHASES.map(phase => (
                <PhaseDropZone key={phase.id} phase={phase} exercises={currentSession.exercises?.[phase.id] || []} onDrop={handleDrop} onRemove={removeExerciseFromSession} />
            ))}
            </div>
        </div>
      </div>
    </div>
  );
});
