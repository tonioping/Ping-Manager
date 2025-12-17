import React, { useState, useMemo, useCallback } from 'react';
import { Search, Save, Clock, Target, Plus, X, GripVertical, List, Layers } from 'lucide-react';
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

// Sub-component for dropping exercises (improves performance & readability)
const PhaseDropZone = React.memo(({ phase, exercises, onDrop, onRemove }: { phase: any, exercises: Exercise[], onDrop: (id: PhaseId) => void, onRemove: (pid: PhaseId, iid: number) => void }) => {
  const [isOver, setIsOver] = useState(false);
  
  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={() => { onDrop(phase.id); setIsOver(false); }}
      className={`transition-all duration-200 rounded-xl border-2 border-dashed p-4 min-h-[120px] 
        ${isOver ? 'bg-orange-50 border-orange-400 scale-[1.01]' : `${phase.color.split(' ')[0]} ${phase.color.split(' ')[1]} bg-opacity-30`}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-bold ${phase.color.split(' ')[2]}`}>{phase.label}</h3>
        <span className="text-xs font-bold px-2 py-1 bg-white rounded-full text-slate-500 shadow-sm border">
          {exercises.reduce((acc, ex) => acc + (ex?.duration || 0), 0)} / {phase.duration} min
        </span>
      </div>
      <div className="space-y-2">
        {exercises.length === 0 && <div className="text-center text-slate-400 text-sm py-4 italic">Glissez des exercices ici</div>}
        {exercises.map((ex) => (
          <div key={ex.instanceId} className="group bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-start gap-3 relative hover:shadow-md transition-shadow">
               <div className="mt-1 text-slate-400"><Target size={14} /></div>
               <div className="flex-1 min-w-0 pr-6">
                 <div className="font-semibold text-slate-800 text-sm">{ex.name}</div>
                 <div className="text-xs text-slate-500 line-clamp-1">{ex.description}</div>
                 <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Clock size={10} /> {ex.duration} min
                    </span>
                 </div>
               </div>
               <button onClick={() => onRemove(phase.id, ex.instanceId!)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 p-1"><X size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
});

export const SessionsView: React.FC<SessionsViewProps> = ({
  exercises, currentSession, setCurrentSession, saveSession, handleSuggestExercises, isLoadingAI, totalDuration
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPhase, setFilterPhase] = useState('all');
  const [draggedEx, setDraggedEx] = useState<Exercise | null>(null);
  const [activeTab, setActiveTab] = useState<'library' | 'session'>('session');

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
        if (!ex) return false;
        if (filterPhase !== 'all' && ex.phase !== filterPhase) return false;
        if (searchTerm && !ex.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });
  }, [exercises, filterPhase, searchTerm]);

  const handleDrop = useCallback((phaseId: PhaseId) => {
      if (draggedEx) {
          setCurrentSession(prev => ({
            ...prev, exercises: { ...prev.exercises, [phaseId]: [...(prev.exercises[phaseId] || []), { ...draggedEx, instanceId: Date.now() }] }
          }));
          setDraggedEx(null);
      }
  }, [draggedEx, setCurrentSession]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)]">
      {/* Mobile Tabs */}
      <div className="lg:hidden flex p-1 mx-4 mb-2 bg-slate-200 rounded-xl">
        <button onClick={() => setActiveTab('library')} className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 ${activeTab === 'library' ? 'bg-white shadow-sm' : 'text-slate-500'}`}><List size={16}/> Bibliothèque</button>
        <button onClick={() => setActiveTab('session')} className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 ${activeTab === 'session' ? 'bg-white shadow-sm text-accent' : 'text-slate-500'}`}><Layers size={16}/> Ma Séance</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        {/* Library Panel */}
        <div className={`w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col ${activeTab === 'session' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 border-b bg-slate-50/50 space-y-2">
                <div className="relative"><Search className="absolute left-3 top-2.5 text-slate-400" size={16} /><input type="text" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 p-2 border rounded-lg text-sm" /></div>
                <select value={filterPhase} onChange={e => setFilterPhase(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-white"><option value="all">Tout</option>{PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}</select>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {filteredExercises.map(ex => (
                    <div key={ex.id} draggable onDragStart={() => setDraggedEx(ex)} className="p-3 bg-white border rounded-xl hover:border-accent cursor-grab flex justify-between items-center group">
                        <div className="flex-1">
                            <div className="font-semibold text-sm group-hover:text-accent">{ex.name}</div>
                            <div className="text-[10px] text-slate-500">{PHASES.find(p => p.id === ex.phase)?.label}</div>
                        </div>
                        <button onClick={() => setCurrentSession(prev => ({...prev, exercises: {...prev.exercises, [ex.phase]: [...(prev.exercises[ex.phase]||[]), {...ex, instanceId: Date.now()}]}}))} className="lg:hidden p-2 bg-slate-50 text-accent rounded-lg"><Plus size={16}/></button>
                        <GripVertical size={16} className="hidden lg:block text-slate-300"/>
                    </div>
                ))}
            </div>
        </div>

        {/* Session Builder Panel */}
        <div className={`flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 ${activeTab === 'library' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 border-b bg-white z-10 space-y-4">
                <div className="flex gap-3">
                    <input type="text" placeholder="Nom de la séance" value={currentSession.name} onChange={e => setCurrentSession(prev => ({ ...prev, name: e.target.value }))} className="flex-1 text-lg font-bold border-b-2 border-transparent focus:border-accent outline-none" />
                    <input type="date" value={currentSession.date} onChange={e => setCurrentSession(prev => ({ ...prev, date: e.target.value }))} className="bg-slate-50 rounded-lg text-sm px-2" />
                </div>
                <div className="flex justify-between items-center">
                    <div className="font-bold text-emerald-600 text-lg">{totalDuration} min</div>
                    <div className="flex gap-2">
                        <GeminiButton onClick={handleSuggestExercises} isLoading={isLoadingAI} className="!py-1.5 !px-3 !text-xs">IA Suggest</GeminiButton>
                        <button onClick={saveSession} className="px-4 py-2 bg-slate-900 text-white rounded-lg flex items-center gap-2 hover:bg-slate-800 transition"><Save size={18}/><span className="hidden sm:inline font-bold text-sm">Sauvegarder</span></button>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 pb-20 lg:pb-4">
                {PHASES.map(phase => (
                    <PhaseDropZone 
                        key={phase.id} phase={phase} exercises={currentSession.exercises?.[phase.id] || []} 
                        onDrop={handleDrop} onRemove={(pid, iid) => setCurrentSession(prev => ({ ...prev, exercises: { ...prev.exercises, [pid]: prev.exercises[pid].filter(e => e.instanceId !== iid) } }))} 
                    />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};