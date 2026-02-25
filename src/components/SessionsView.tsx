import React, { useState } from 'react';
import { Plus, Trash2, Clock, Sparkles, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Exercise, Session, PhaseId, Player, Attendance } from '../types';
import { PHASES } from '../constants';
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
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex-1 w-full">
          <input 
            type="text" 
            value={currentSession.name} 
            onChange={e => setCurrentSession(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Nom de la séance..."
            className="text-2xl font-black uppercase italic tracking-tighter bg-transparent border-none outline-none w-full dark:text-white"
          />
          <div className="flex items-center gap-4 mt-2">
            <input 
              type="date" 
              value={currentSession.date} 
              onChange={e => setCurrentSession(prev => ({ ...prev, date: e.target.value }))}
              className="text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 p-2 rounded-lg dark:text-white"
            />
            <div className="flex items-center gap-1 text-accent font-black text-[10px] uppercase tracking-widest">
              <Clock size={14}/> {totalDuration} min
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAttendance(true)} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center gap-2 hover:bg-slate-200 transition-all">
            <Users size={16}/> Appel ({attendance.filter(a => a.status !== 'absent').length})
          </button>
          <button onClick={saveSession} className="px-8 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-xl hover:scale-105 transition-all">
            Enregistrer
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {PHASES.map(phase => (
          <div key={phase.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden">
            <button 
              onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
              className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${phase.color.split(' ')[0]}`}></div>
                <h3 className="font-black uppercase tracking-widest text-xs dark:text-white">{phase.label}</h3>
                <span className="text-[10px] font-black text-slate-400">({currentSession.exercises[phase.id]?.length || 0})</span>
              </div>
              {expandedPhase === phase.id ? <ChevronUp size={18} className="text-slate-400"/> : <ChevronDown size={18} className="text-slate-400"/>}
            </button>

            {expandedPhase === phase.id && (
              <div className="p-6 pt-0 space-y-4 animate-fade-in">
                <div className="grid gap-3">
                  {currentSession.exercises[phase.id]?.map((ex, idx) => (
                    <div key={ex.instanceId || idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm dark:text-white">{ex.name}</span>
                          <span className="text-[10px] font-black text-accent uppercase">{ex.duration} min</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{ex.description}</p>
                      </div>
                      <button onClick={() => removeExercise(phase.id, ex.instanceId!)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50 dark:border-slate-800">
                  {exercises.filter(e => e.phase === phase.id).slice(0, 4).map(ex => (
                    <button key={ex.id} onClick={() => addExercise(phase.id, ex)} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-accent hover:text-accent transition-all">
                      + {ex.name}
                    </button>
                  ))}
                  <button onClick={handleSuggestExercises} disabled={isLoadingAI} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-100 transition-all disabled:opacity-50">
                    <Sparkles size={14}/> {isLoadingAI ? 'IA...' : 'Suggérer'}
                  </button>
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