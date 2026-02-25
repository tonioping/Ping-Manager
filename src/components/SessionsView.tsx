import React, { useState } from 'react';
import { Plus, Trash2, Clock, Sparkles, Users, ChevronDown, ChevronUp, Calendar, Target, Info, GripVertical } from 'lucide-react';
import { Exercise, Session, PhaseId, Player, Attendance } from '../types';
import { PHASES } from '../constants';
import { AttendanceModal } from './AttendanceModal';
import { InfoBubble } from './InfoBubble';

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
  const [expandedPhase, setExpandedPhase] = useState<PhaseId | null>('echauffement');

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

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24 animate-fade-in">
      {/* HEADER DE SÉANCE */}
      <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-900 dark:bg-white rounded-2xl shadow-lg">
                <Target className="text-accent" size={24} />
              </div>
              <input 
                type="text" 
                value={currentSession.name} 
                onChange={e => setCurrentSession(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Titre de la séance..."
                className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter bg-transparent border-none outline-none w-full dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-800"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-6 pl-2">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                <Calendar size={16} className="text-slate-400" />
                <input 
                  type="date" 
                  value={currentSession.date} 
                  onChange={e => setCurrentSession(prev => ({ ...prev, date: e.target.value }))}
                  className="text-[11px] font-black uppercase tracking-widest bg-transparent outline-none dark:text-white"
                />
              </div>
              
              <div className="flex items-center gap-2 text-accent font-black text-[11px] uppercase tracking-widest bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-xl border border-orange-100 dark:border-orange-900/30">
                <Clock size={16}/> {totalDuration} minutes au total
              </div>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <button 
              onClick={() => setShowAttendance(true)} 
              className="flex-1 lg:flex-none px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <Users size={18} className="text-accent"/> 
              Appel ({attendance.filter(a => a.status !== 'absent').length})
            </button>
            <button 
              onClick={saveSession} 
              className="flex-1 lg:flex-none px-10 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>

      {/* PHASES DE LA SÉANCE */}
      <div className="space-y-6">
        {PHASES.map(phase => (
          <div key={phase.id} className={`bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all ${expandedPhase === phase.id ? 'ring-2 ring-accent/10' : ''}`}>
            <button 
              onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
              className="w-full p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className={`w-4 h-4 rounded-full shadow-sm ${phase.color.split(' ')[0]}`}></div>
                <div className="text-left">
                  <h3 className="font-black uppercase tracking-[0.15em] text-sm dark:text-white group-hover:text-accent transition-colors">{phase.label}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {currentSession.exercises[phase.id]?.length || 0} exercice(s) • {currentSession.exercises[phase.id]?.reduce((sum, e) => sum + e.duration, 0) || 0} min
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {expandedPhase !== phase.id && (
                   <div className="hidden md:flex -space-x-2">
                      {currentSession.exercises[phase.id]?.slice(0, 3).map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900"></div>
                      ))}
                   </div>
                )}
                {expandedPhase === phase.id ? <ChevronUp size={20} className="text-accent"/> : <ChevronDown size={20} className="text-slate-300"/>}
              </div>
            </button>

            {expandedPhase === phase.id && (
              <div className="p-8 pt-0 space-y-8 animate-fade-in">
                {/* LISTE DES EXERCICES AJOUTÉS */}
                <div className="space-y-4">
                  {currentSession.exercises[phase.id]?.length > 0 ? (
                    currentSession.exercises[phase.id].map((ex, idx) => (
                      <div key={ex.instanceId || idx} className="flex items-center gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 group/item hover:bg-white dark:hover:bg-slate-800 transition-all hover:shadow-md">
                        <div className="text-slate-300 group-hover/item:text-accent transition-colors cursor-grab active:cursor-grabbing">
                          <GripVertical size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{ex.name}</span>
                            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-accent rounded-lg text-[10px] font-black uppercase tracking-widest">{ex.duration} min</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 font-medium leading-relaxed">{ex.description}</p>
                        </div>
                        <button 
                          onClick={() => removeExercise(phase.id, ex.instanceId!)} 
                          className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover/item:opacity-100"
                        >
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Aucun exercice pour cette phase</p>
                    </div>
                  )}
                </div>

                {/* SUGGESTIONS ET AJOUT RAPIDE */}
                <div className="pt-8 border-t border-slate-50 dark:border-slate-800 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Plus size={14} className="text-accent"/> Ajouter un exercice
                    </h4>
                    <button 
                      onClick={handleSuggestExercises} 
                      disabled={isLoadingAI} 
                      className="px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-100 transition-all disabled:opacity-50 shadow-sm"
                    >
                      <Sparkles size={16} className={isLoadingAI ? 'animate-spin' : ''}/> 
                      {isLoadingAI ? 'Génération IA...' : 'Suggérer avec Gemini'}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exercises.filter(e => e.phase === phase.id).slice(0, 6).map(ex => (
                      <button 
                        key={ex.id} 
                        onClick={() => addExercise(phase.id, ex)} 
                        className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-left hover:border-accent hover:shadow-lg transition-all group/add"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-black text-[11px] text-slate-900 dark:text-white uppercase tracking-tight group-hover/add:text-accent transition-colors">{ex.name}</span>
                          <Plus size={14} className="text-slate-300 group-hover/add:text-accent" />
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <Clock size={10} /> {ex.duration} min
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
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