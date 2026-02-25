import React, { useState } from 'react';
import { ArrowLeft, Users, Calendar, PlayCircle, TrendingUp, CheckCircle } from 'lucide-react';
import { Player, Session, Attendance } from '../types';
import { AttendanceModal } from './AttendanceModal';

interface GroupDetailViewProps {
  group: { id: string; label: string; color: string };
  players: Player[];
  sessions: Session[];
  attendance: Attendance[];
  onBack: () => void;
  onLaunchSession: (sessionId?: number) => void;
  onSaveAttendance: (playerId: string, status: 'present' | 'absent' | 'late') => void;
}

export const GroupDetailView: React.FC<GroupDetailViewProps> = ({
  group,
  players,
  sessions,
  attendance,
  onBack,
  onLaunchSession,
  onSaveAttendance
}) => {
  const [showAttendance, setShowAttendance] = useState(false);
  const groupPlayers = players.filter(p => p.group === group.id);
  const groupSessions = sessions.filter(s => s.name.includes(group.label));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-6">
        <button onClick={onBack} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
          <ArrowLeft size={20} className="dark:text-white"/>
        </button>
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Groupe <span className="text-accent">{group.label}</span></h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">{groupPlayers.length} Joueurs actifs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic tracking-tighter dark:text-white">Effectif du groupe</h3>
              <button onClick={() => setShowAttendance(true)} className="px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center gap-2 hover:scale-105 transition-all">
                <CheckCircle size={16}/> Faire l'appel
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupPlayers.map(player => (
                <div key={player.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center font-black text-xs dark:text-white shadow-sm">
                    {player.first_name[0]}{player.last_name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{player.first_name} {player.last_name}</div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{player.level}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic tracking-tighter dark:text-white">Dernières séances</h3>
              <button onClick={() => onLaunchSession()} className="px-6 py-3 bg-accent text-white rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center gap-2 hover:scale-105 transition-all">
                <PlayCircle size={16}/> Nouvelle séance
              </button>
            </div>
            <div className="space-y-4">
              {groupSessions.map(session => (
                <div key={session.id} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl flex justify-between items-center group">
                  <div>
                    <div className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">{session.name}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(session.date).toLocaleDateString()}</div>
                  </div>
                  <button onClick={() => onLaunchSession(session.id)} className="p-3 bg-white dark:bg-slate-900 rounded-xl text-slate-400 hover:text-accent transition-all shadow-sm">
                    <PlayCircle size={20}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp size={14} className="text-accent"/> Statistiques Groupe
            </h3>
            <div className="space-y-6">
              <div>
                <div className="text-3xl font-black italic tracking-tighter">85%</div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Taux de présence moyen</div>
              </div>
              <div className="pt-6 border-t border-slate-800">
                <div className="text-3xl font-black italic tracking-tighter">{groupSessions.length}</div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Séances réalisées</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAttendance && (
        <AttendanceModal 
          players={groupPlayers} 
          attendance={attendance} 
          onToggle={onSaveAttendance} 
          onClose={() => setShowAttendance(false)}
          groupName={group.label}
        />
      )}
    </div>
  );
};