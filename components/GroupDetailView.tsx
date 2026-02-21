import React, { useMemo, useState } from 'react';
import { ArrowLeft, Calendar, Users, Clock, PlayCircle, CheckCircle, TrendingUp, BookOpen, ChevronRight } from 'lucide-react';
import { Player, Cycle, Session, Attendance, View } from '../types';
import { AttendanceModal } from './AttendanceModal';

interface GroupDetailViewProps {
  group: { id: string; label: string; color: string };
  players: Player[];
  cycle: Cycle | null;
  sessions: Session[];
  attendance: Attendance[];
  onBack: () => void;
  onLaunchSession: (sessionId?: number) => void;
  onSaveAttendance: (playerId: string, status: 'present' | 'absent' | 'late') => void;
}

export const GroupDetailView: React.FC<GroupDetailViewProps> = ({
  group,
  players,
  cycle,
  sessions,
  attendance,
  onBack,
  onLaunchSession,
  onSaveAttendance
}) => {
  const [showAttendance, setShowAttendance] = useState(false);

  const groupPlayers = useMemo(() => players.filter(p => p.group === group.id), [players, group.id]);

  const playerStats = useMemo(() => {
    return groupPlayers.map(player => {
      const playerAttendance = attendance.filter(a => a.player_id === player.id && (a.status === 'present' || a.status === 'late'));
      let totalMinutes = 0;
      playerAttendance.forEach(record => {
        const session = sessions.find(s => s.id === record.session_id);
        if (session) {
          totalMinutes += Object.values(session.exercises).flat().reduce((sum, ex) => sum + (ex?.duration || 0), 0);
        }
      });
      return { ...player, hours: Math.round(totalMinutes / 60) };
    });
  }, [groupPlayers, attendance, sessions]);

  const currentWeekIndex = useMemo(() => {
    if (!cycle || !cycle.startDate) return -1;
    const start = new Date(cycle.startDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
  }, [cycle]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {showAttendance && (
        <AttendanceModal 
          players={groupPlayers} 
          attendance={attendance.filter(a => cycle?.weeks[currentWeekIndex]?.sessionId === a.session_id)} 
          onToggle={onSaveAttendance} 
          onClose={() => setShowAttendance(false)} 
          groupName={group.label}
        />
      )}

      <div className="flex items-center gap-6">
        <button onClick={onBack} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
          <ArrowLeft size={20} className="dark:text-white" />
        </button>
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
            Groupe <span className="text-accent">{group.label}</span>
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${group.color}`}>
              {groupPlayers.length} Joueurs
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLONNE GAUCHE : CYCLE & SÉANCES */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter flex items-center gap-2">
                <Calendar className="text-accent" size={20} /> Cycle en cours
              </h3>
              {cycle && (
                <button 
                  onClick={() => onLaunchSession(cycle.weeks[currentWeekIndex]?.sessionId)}
                  className="px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-black text-[10px] tracking-widest uppercase flex items-center gap-2 hover:scale-105 transition-all"
                >
                  <PlayCircle size={16} /> Lancer la séance
                </button>
              )}
            </div>

            {cycle ? (
              <div className="space-y-4">
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 mb-8">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{cycle.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{cycle.objectives}</p>
                </div>

                <div className="grid gap-3">
                  {cycle.weeks.map((week, idx) => (
                    <div 
                      key={idx} 
                      className={`p-5 rounded-2xl border transition-all flex items-center justify-between group ${
                        idx === currentWeekIndex 
                          ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 shadow-md' 
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${idx === currentWeekIndex ? 'bg-accent text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                          {week.weekNumber}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-sm">{week.theme || 'Thème à définir'}</div>
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{week.notes || 'Pas de notes'}</div>
                        </div>
                      </div>
                      {week.sessionName && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                          <BookOpen size={12} /> {week.sessionName}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucun cycle actif pour ce groupe</p>
              </div>
            )}
          </div>
        </div>

        {/* COLONNE DROITE : STATS JOUEURS */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter flex items-center gap-2">
                <TrendingUp className="text-emerald-500" size={20} /> Volume & Présences
              </h3>
              <button 
                onClick={() => setShowAttendance(true)}
                className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 transition-all"
              >
                <Users size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {playerStats.sort((a, b) => b.hours - a.hours).map(player => (
                <div key={player.id} className="space-y-2 group/player">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-sm group-hover/player:text-accent transition-colors">{player.first_name} {player.last_name}</div>
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{player.level}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900 dark:text-white italic">{player.hours}h</div>
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Cumul saison</div>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.min((player.hours / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};