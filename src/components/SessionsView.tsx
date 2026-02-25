import React, { useState, useMemo } from 'react';
import { 
  Plus, Trash2, Clock, Sparkles, Users, Calendar, Target, 
  Search, Filter, GripVertical, ChevronRight, Info, X
} from 'lucide-react';
import { Exercise, Session, PhaseId, Player, Attendance } from '../types';
import { PHASES, THEMES } from '../constants';
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

export const SessionsView: React.FC<SessionsViewProps> = ({
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
  const [showAttendance, setShowAttendance] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPhase, setFilterPhase] = useState<string>('all');
  const [draggedExercise, setDraggedExercise] = useState<Exercise | null>(null);

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           ex.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPhase = filterPhase === 'all' || ex.phase === filterPhase;
      return matchesSearch && matchesPhase;
    });
  }, [exercises, searchTerm, filterPhase]);

  const addExercise = (phaseId: PhaseId, exercise: Exercise) => {
    const newEx = { ...exercise, instanceId: Date.now() };
    setCurrentSession(prev => ({
      ...prev,
      exercises: {
        ...prev.exercises,
        [phaseId]: [...(prev.exercises[phaseId] || []), newEx]
      }
    }));
  };

  const removeExercise = (phaseId: PhaseId, instanceId: number) => {
    setCurrentSession(prev => ({
      ...prev,
      exercises: {
        ...prev.exercises,
        [phaseId]: prev.exercises[phaseId].filter(ex => ex.instanceId !== instanceId)
      }
    }));
  };

  // Drag & Drop Handlers
  const onDragStart = (e: React.DragEvent, ex: Exercise) => {
    setDraggedExercise(ex);
    e.dataTransfer.setData('exerciseId', ex.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e: React.DragEvent, phaseId: PhaseId) => {
    e.preventDefault();
    if (draggedExercise) {
      addExercise(phaseId, draggedExercise);
      setDraggedExercise(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-120px)] animate-fade-in">
      {/* COLONNE GAUCHE : BIBLIOTHÈQUE */}
      <div className="w-full lg:w-80 xl:w-96 flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-black uppercase italic tracking-tighter dark:text-white flex items-center gap-2">
            <Search size={18} className="text-accent"/> Bibliothèque
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-accent/20 dark:text-white"
            />
          </div>
          <select 
            value={filterPhase} 
            onChange={(e) => setFilterPhase(e.target.value)}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[10px] font-black uppercase tracking-widest outline-none dark:text-white"
          >
            <option value="all">Toutes les phases</option>
            {PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {filteredExercises.map(ex => (
            <div 
              key={ex.id}
              draggable
              onDragStart={(e) => onDragStart(e, ex)}
              className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-grab active:cursor-grabbing hover:border-accent/30 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-black text-[11px] uppercase tracking-tight dark:text-white group-hover:text-accent transition-colors">{ex.name}</span>
                <Plus size={14} className="text-slate-300 group-hover:text-accent cursor-pointer" onClick={() => addExercise(ex.phase, ex)}/>
              </div>
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <Clock size={10} /> {ex.duration} min • {ex.theme}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={handleSuggestExercises} 
            disabled={isLoadingAI}
            className="w-full py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all disabled:opacity-50"
          >
            <Sparkles size={14} className={isLoadingAI ? 'animate-spin' : ''}/> {isLoadingAI ? 'Génération...' : 'Suggérer avec IA'}
          </button>
        </div>
      </div>

      {/* COLONNE DROITE : CONSTRUCTEUR DE SÉANCE */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* HEADER RAPIDE */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex-1 w-full flex items-center gap-4">
            <div className="p-2 bg-slate-900 dark:bg-white rounded-xl">
              <Target className="text-accent" size={20} />
            </div>
            <input 
              type="text" 
              value={currentSession.name} 
              onChange={e => setCurrentSession(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Titre de la séance..."
              className="text-xl font-black uppercase italic tracking-tighter bg-transparent border-none outline-none w-full dark:text-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-accent font-black text-[10px] uppercase tracking-widest bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-xl">
              {totalDuration} min
            </div>
            <button onClick={saveSession} className="px-8 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-black text-[10px] tracking-widest uppercase shadow-xl hover:scale-105 transition-all">
              Enregistrer
            </button>
          </div>
        </div>

        {/* ZONES DE DROP PAR PHASE */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {PHASES.map(phase => (
            <div 
              key={phase.id}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, phase.id)}
              className={`bg-white dark:bg-slate-900 rounded-[2rem] border-2 transition-all ${currentSession.exercises[phase.id]?.length > 0 ? 'border-slate-100 dark:border-slate-800' : 'border-dashed border-slate-200 dark:border-slate-800'}`}
            >
              <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${phase.color.split(' ')[0]}`}></div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest dark:text-white">{phase.label}</h4>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {currentSession.exercises[phase.id]?.reduce((sum, e) => sum + e.duration, 0) || 0} min
                </span>
              </div>

              <div className="p-4 space-y-3 min-h-[80px]">
                {currentSession.exercises[phase.id]?.length > 0 ? (
                  currentSession.exercises[phase.id].map((ex, idx) => (
                    <div key={ex.instanceId || idx} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group/item">
                      <GripVertical size={16} className="text-slate-300" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs dark:text-white">{ex.name}</span>
                          <span className="text-[9px] font-black text-accent uppercase">{ex.duration} min</span>
                        </div>
                      </div>
                      <button onClick={() => removeExercise(phase.id, ex.instanceId!)} className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover/item:opacity-100">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center py-4">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Glissez un exercice ici</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAttendance && (
        <AttendanceModal 
          players={players} 
          attendance={attendance} 
          onToggle={onSaveAttendance} 
          onClose={() => setShowAttendance(false)}
        />
      )}
    </div>
  );
};