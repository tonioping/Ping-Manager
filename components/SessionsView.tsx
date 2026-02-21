import React, { useState, useMemo, useCallback } from 'react';
import { Search, GripVertical, Save, Clock, Target, Plus, X, List, Layers, Box, Users, Tag, Wrench, Filter } from 'lucide-react';
import { Exercise, Session, PhaseId, Player, Attendance } from '../types';
import { PHASES, THEMES, GROUPS } from '../constants';
import { GeminiButton } from './GeminiButton';
import { InfoBubble } from './InfoBubble';
import { AttendanceModal } from './AttendanceModal';

interface SessionsViewProps {
  exercises: Exercise[];
  currentSession: Session;
  setCurrentSession: React.Dispatch<React.SetStateAction<Session>>;
  saveSession: () => void;
  handleSuggestExercises: () => void;
  isLoadingAI: boolean;
  totalDuration: number;
  players: Player[];
  attendance: Attendance[];
  onSaveAttendance: (playerId: string, status: 'present' | 'absent' | 'late') => void;
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
  totalDuration,
  players,
  attendance,
  onSaveAttendance
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPhase, setFilterPhase] = useState('all');
  const [filterTheme, setFilterTheme] = useState('all');
  const [filterMaterial, setFilterMaterial] = useState('all');
  const [draggedExercise, setDraggedExercise] = useState<Exercise | null>(null);
  const [activeTab, setActiveTab] = useState<'library' | 'session'>('session');
  const [showAttendance, setShowAttendance] = useState(false);

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => { 
        if (!ex) return false; 
        if (filterPhase !== 'all' && ex.phase !== filterPhase) return false; 
        if (filterTheme !== 'all' && ex.theme !== filterTheme) return false;
        if (filterMaterial !== 'all') {
            if (filterMaterial === 'panier' && ex.material !== 'Panier de balles') return false;
            if (filterMaterial === 'standard' && ex.material === 'Panier de balles') return false;
        }
        if (searchTerm) { 
            const term = searchTerm.toLowerCase(); 
            if (!ex.name.toLowerCase().includes(term) && !ex.description.toLowerCase().includes(term)) return false; 
        } 
        return true; 
    });
  }, [exercises, filterPhase, filterTheme, filterMaterial, searchTerm]);

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
      {showAttendance && (
        <AttendanceModal 
            players={players.filter(p => !currentSession.group || p.group === currentSession.group)} 
            attendance={attendance} 
            onToggle={onSaveAttendance} 
            onClose={() => setShowAttendance(false)} 
            groupName={currentSession.name}
        />
      )}

      <div className="lg:hidden flex p-1 mx-4 mb-2 bg-slate-200 rounded-xl">
        <button onClick={() => setActiveTab('library')} className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 ${activeTab === 'library' ? 'bg-white shadow-sm' : 'text-slate-500'}`}><List size={16}/> Biblio</button>
        <button onClick={() => setActiveTab('session')} className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 ${activeTab === 'session' ? 'bg-white shadow-sm' : 'text-slate-500'}`}><Layers size={16}/> Séance</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden px-4 md:px-0">
        {/* BIBLIOTHÈQUE LATÉRALE AVEC FILTRES PERMANENTS */}
        <div className={`w-full lg:w-96 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden ${activeTab === 'session' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bibliothèque</span>
                </div>
                <Filter size={14} className="text-slate-300" />
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-accent/20" 
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <select 
                  value={filterPhase} 
                  onChange={(e) => setFilterPhase(e.target.value)}
                  className="w-full p-2 bg-white border rounded-lg text-[9px] font-black uppercase tracking-wider outline-none focus:border-accent"
                >
                  <option value="all">Phases</option>
                  {PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
                <select 
                  value={filterTheme} 
                  onChange={(e) => setFilterTheme(e.target.value)}
                  className="w-full p-2 bg-white border rounded-lg text-[9px] font-black uppercase tracking-wider outline-none focus:border-accent"
                >
                  <option value="all">Thèmes</option>
                  {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-slate-50/30">
              {filteredExercises.map(ex => (
                <div 
                  key={ex.id} 
                  draggable 
                  onDragStart={() => handleDragStart(ex)} 
                  className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-accent cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${PHASES.find(p => p.id === ex.phase)?.color.split(' ')[0].replace('50', '500')}`}></span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{PHASES.find(p => p.id === ex.phase)?.label}</span>
                      </div>
                      <h4 className="font-black text-slate-900 uppercase tracking-tighter text-sm group-hover:text-accent transition-colors">{ex.name}</h4>
                    </div>
                    <button 
                      onClick={() => handleDirectAdd(ex)} 
                      className="p-2 bg-slate-50 text-accent rounded-xl hover:bg-accent hover:text-white transition-all"
                    >
                      <Plus size={16}/>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 font-medium italic mb-2">{ex.description}</p>
                  <div className="flex gap-2">
                    <span className="text-[8px] font-black text-accent flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg uppercase tracking-widest"><Clock size={10} /> {ex.duration} min</span>
                    {ex.theme && <span className="text-[8px] font-black text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg uppercase tracking-widest"><Tag size={10} /> {ex.theme}</span>}
                  </div>
                </div>
              ))}
            </div>
        </div>

        <div className={`flex-1 flex flex-col overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200 ${activeTab === 'library' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-6 border-b border-slate-100 bg-white z-10 space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex-1 w-full">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Nom de la séance</label>
                    <input type="text" placeholder="Ex: Perfectionnement Topspin" value={currentSession.name} onChange={(e) => setCurrentSession(prev => ({ ...prev, name: e.target.value }))} className="w-full p-2 text-xl font-black bg-transparent border-b-2 border-slate-100 focus:border-accent outline-none text-slate-900 transition-colors uppercase italic tracking-tighter" />
                  </div>
                  <div className="w-full md:w-48">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Groupe</label>
                    <select 
                        value={currentSession.group || ''} 
                        onChange={(e) => setCurrentSession(prev => ({ ...prev, group: e.target.value }))}
                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-accent/20"
                    >
                        <option value="">-- Aucun --</option>
                        {GROUPS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2 pt-4">
                      <button 
                        onClick={() => setShowAttendance(true)}
                        className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-lg flex items-center gap-2 transition-all active:scale-95"
                        title="Faire l'appel"
                      >
                        <Users size={20}/>
                      </button>
                      <button onClick={saveSession} className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-lg flex items-center gap-2 transition-all active:scale-95"><Save size={20}/></button>
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