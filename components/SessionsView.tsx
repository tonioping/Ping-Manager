
import React, { useState, useMemo, useCallback } from 'react';
import { Search, Save, Clock, Target, Plus, X, GripVertical, List, Layers, Box } from 'lucide-react';
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
        <h3 className={`font-black text-black uppercase text-sm tracking-wider`}>{phase.label}</h3>
        <span className="text-xs font-bold px-2 py-1 bg-white rounded-full text-black shadow-sm border">
          {exercises.reduce((acc, ex) => acc + (ex?.duration || 0), 0)} / {phase.duration} min
        </span>
      </div>
      <div className="space-y-2">
        {exercises.length === 0 && <div className="text-center text-slate-500 text-sm py-4 italic">Glissez des exercices ici</div>}
        {exercises.map((ex) => (
          <div key={ex.instanceId} className="group bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-start gap-3 relative hover:shadow-md transition-shadow">
               <div className="mt-1 text-slate-400"><Target size={14} /></div>
               <div className="flex-1 min-w-0 pr-6">
                 <div className="font-black text-black text-sm">{ex.name}</div>
                 <div className="text-xs text-slate-700 line-clamp-1">{ex.description}</div>
                 <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold text-black bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Clock size={10} /> {ex.duration} min
                    </span>
                    {ex.material === 'Panier de balles' && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Box size={10} /> Panier
                      </span>
                    )}
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
  const [filterMaterial, setFilterMaterial] = useState<'all' | 'panier'>('all');
  const [draggedEx, setDraggedEx] = useState<Exercise | null>(null);
  const [activeTab, setActiveTab] = useState<'library' | 'session'>('session');

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
        if (!ex) return false;
        if (filterPhase !== 'all' && ex.phase !== filterPhase) return false;
        if (filterMaterial === 'panier' && ex.material !== 'Panier de balles') return false;
        if (searchTerm && !ex.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });
  }, [exercises, filterPhase, filterMaterial, searchTerm]);

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
      <div className="lg:hidden flex p-1 mx-4 mb-2 bg-slate-200 rounded-xl">
        <button onClick={() => setActiveTab('library')} className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 ${activeTab === 'library' ? 'bg-white shadow-sm text-black' : 'text-slate-500'}`}><List size={16}/> Bibliothèque</button>
        <button onClick={() => setActiveTab('session')} className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 ${activeTab === 'session' ? 'bg-white shadow-sm text-black' : 'text-slate-500'}`}><Layers size={16}/> Ma Séance</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        <div className={`w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col ${activeTab === 'session' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 border-b bg-slate-50/50 space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 p-2 border rounded-lg text-sm text-black font-medium" />
                </div>
                <div className="flex gap-2">
                  <select value={filterPhase} onChange={e => setFilterPhase(e.target.value)} className="flex-1 p-2 border rounded-lg text-[11px] bg-white text-black font-black uppercase tracking-tighter">
                    <option value="all">Phases</option>
                    {PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                  <button 
                    onClick={() => setFilterMaterial(prev => prev === 'all' ? 'panier' : 'all')}
                    className={`p-2 border rounded-lg text-[11px] font-black uppercase transition-all flex items-center gap-1 ${filterMaterial === 'panier' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200'}`}
                  >
                    <Box size={14} /> Panier
                  </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {filteredExercises.map(ex => (
                    <div key={ex.id} draggable onDragStart={() => setDraggedEx(ex)} className="p-3 bg-white border rounded-xl hover:border-black cursor-grab flex justify-between items-center group transition-all">
                        <div className="flex-1">
                            <div className="font-black text-sm text-black group-hover:text-blue-600 transition-colors">{ex.name}</div>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-slate-500 uppercase">{PHASES.find(p => p.id === ex.phase)?.label}</span>
                                {ex.material === 'Panier de balles' && <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-0.5"><Box size={8}/> Panier</span>}
                            </div>
                        </div>
                        <button onClick={() => setCurrentSession(prev => ({...prev, exercises: {...prev.exercises, [ex.phase]: [...(prev.exercises[ex.phase]||[]), {...ex, instanceId: Date.now()}]}}))} className="lg:hidden p-2 bg-slate-100 text-black rounded-lg"><Plus size={16}/></button>
                        <GripVertical size={16} className="hidden lg:block text-slate-300"/>
                    </div>
                ))}
            </div>
        </div>

        <div className={`flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 ${activeTab === 'library' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 border-b bg-white z-10 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <input type="text" placeholder="Nom de la séance" value={currentSession.name} onChange={e => setCurrentSession(prev => ({ ...prev, name: e.target.value }))} className="flex-1 text-xl font-black text-black border-b-2 border-transparent focus:border-black outline-none" />
                    <input type="date" value={currentSession.date} onChange={e => setCurrentSession(prev => ({ ...prev, date: e.target.value }))} className="bg-slate-50 rounded-xl text-sm px-3 font-black text-black border" />
                </div>
                <div className="flex justify-between items-center">
                    <div className="font-black text-emerald-600 text-xl tracking-tighter">{totalDuration} min</div>
                    <div className="flex gap-2">
                        <GeminiButton onClick={handleSuggestExercises} isLoading={isLoadingAI} className="!py-1.5 !px-3 !text-xs">IA Suggest</GeminiButton>
                        <button onClick={saveSession} className="px-5 py-2.5 bg-black text-white rounded-xl flex items-center gap-2 hover:bg-slate-800 transition shadow-lg"><Save size={18}/><span className="font-black text-sm">Sauvegarder</span></button>
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
