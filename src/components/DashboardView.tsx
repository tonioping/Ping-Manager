import React, { useMemo, useState } from 'react';
import { 
  Plus, Target, Calendar as CalendarIcon, 
  Clock, Zap, ChevronRight, PlayCircle, Lightbulb,
  Rocket, TrendingUp as ProgressIcon, GraduationCap, Globe, Activity, Trophy, ListChecks, BookOpen, Users, CheckCircle, Copy, Info
} from 'lucide-react';
import { Session, Cycle, Player, CoachProfile, View, Attendance } from '../types';
import { GROUPS, INITIAL_EXERCISES, PHASES } from '../constants';
import { InfoBubble } from './InfoBubble';

const HeroHeader = ({ coachProfile, playersCount, sessionsCount }: any) => (
  <div className="relative p-6 rounded-[2rem] bg-[#0a0f24] border border-white/5 overflow-hidden mb-8">
    <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-[100px]"></div>
    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-neon/10 rounded-full blur-[100px]"></div>
    
    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-6">
        <div className="relative">
            <div className="w-16 h-16 bg-[#161b33] rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
                <div className="w-8 h-8 rounded-full border-2 border-slate-700 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-accent rounded-xl flex items-center justify-center shadow-neon-purple border-2 border-[#0a0f24]">
                <Zap size={14} className="text-white fill-white" />
            </div>
        </div>
        
        <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none mb-2">
                Ping<span className="text-white/90">Manager</span>
            </h1>
            <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Coach : {coachProfile.name || 'Premium'}
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black text-accent-neon uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-neon shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
                    Synchronisé
                </div>
            </div>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="text-center">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Joueurs</div>
            <div className="text-4xl font-black text-white tracking-tighter">{playersCount}</div>
        </div>
        <div className="text-center">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Séances</div>
            <div className="text-4xl font-black text-white tracking-tighter">{sessionsCount}</div>
        </div>
      </div>
    </div>
  </div>
);

export const DashboardView: React.FC<any> = React.memo(({
  coachProfile,
  savedSessions,
  players,
  cycles,
  setView,
  setCurrentSession,
  onSelectGroup,
  attendance,
  onSaveAttendance,
  onDuplicateSession
}) => {
  const [selectedSessionForModal, setSelectedSessionForModal] = useState<Session | null>(null);

  const groupsStatus = useMemo(() => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      return GROUPS.map(group => {
          const groupSessions = savedSessions
            .filter(s => s.group === group.id && new Date(s.date) >= now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(a.date).getTime());
          
          const nextGroupSession = groupSessions[0];

          const activeCycle = [...cycles]
            .filter(c => c.group === group.id && c.startDate)
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
          
          let currentWeekData = null;
          if (activeCycle) {
              const [y, m, d] = activeCycle.startDate.split('-').map(Number);
              const start = new Date(y, m - 1, d);
              const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
              const weekIdx = Math.floor(diffDays / 7);
              const totalWeeks = activeCycle.weeks.length;
              if (weekIdx >= 0 && weekIdx < totalWeeks) {
                  const currentWeek = activeCycle.weeks[weekIdx];
                  currentWeekData = { 
                    cycleName: activeCycle.name, 
                    weekNum: weekIdx + 1, 
                    totalWeeks, 
                    theme: currentWeek.theme, 
                    progress: Math.round(((weekIdx + 1) / totalWeeks) * 100) 
                  };
              }
          }
          
          return { ...group, activeData: currentWeekData, nextSession: nextGroupSession };
      });
  }, [cycles, savedSessions]);

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-10">
      <HeroHeader coachProfile={coachProfile} playersCount={players.length} sessionsCount={savedSessions.length} />

      <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Pilotage par Groupe</h3>
                <Info size={16} className="text-slate-600" />
              </div>
              <button onClick={() => setView('sessions')} className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest hover:text-accent transition-colors">
                <Plus size={14} className="text-accent" /> Planifier
              </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupsStatus.map(group => (
                  <div key={group.id} className="bg-[#0a0f24] p-6 rounded-[2rem] border border-white/5 hover:border-accent/30 transition-all group/card flex flex-col min-h-[380px]">
                      <div className="flex justify-between items-center mb-6">
                          <div className="px-4 py-1.5 bg-accent-neon/10 rounded-full border border-accent-neon/20 text-[9px] font-black text-accent-neon uppercase tracking-widest">
                              {group.label}
                          </div>
                          <button onClick={() => onSelectGroup(group.id)} className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 group-hover/card:text-white group-hover/card:bg-white/10 transition-all">
                              <ChevronRight size={18} />
                          </button>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="p-6 rounded-[1.5rem] bg-white/[0.02] border border-dashed border-white/10 flex flex-col items-center text-center">
                            <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                                <CalendarIcon size={10} className="text-accent" /> Prochaine séance
                            </div>
                            
                            {group.nextSession ? (
                                <div className="space-y-4 w-full">
                                    <div className="font-black text-white uppercase tracking-tighter text-2xl leading-tight italic line-clamp-2">
                                        {group.nextSession.name}
                                    </div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        {new Date(group.nextSession.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                    </div>
                                    <button 
                                        onClick={() => setSelectedSessionForModal(group.nextSession)}
                                        className="w-full py-3.5 bg-white text-black rounded-xl font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl"
                                    >
                                        <ListChecks size={14} /> Détails & Appel
                                    </button>
                                </div>
                            ) : (
                                <div className="py-2">
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Aucune séance prévue</p>
                                    <button onClick={() => { setCurrentSession({...INITIAL_EXERCISES, group: group.id}); setView('sessions'); }} className="text-white font-black text-[10px] uppercase tracking-widest border-b border-accent pb-0.5 hover:text-accent transition-colors">Créer maintenant</button>
                                </div>
                            )}
                        </div>
                      </div>

                      {group.activeData && (
                        <div className="mt-6 space-y-2">
                            <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.15em]">
                                <span className="text-slate-500 truncate max-w-[150px]">Cycle : {group.activeData.cycleName}</span>
                                <span className="text-white">Sem. {group.activeData.weekNum}/{group.activeData.totalWeeks}</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-accent shadow-neon-purple transition-all duration-1000" style={{ width: `${group.activeData.progress}%` }}></div>
                            </div>
                        </div>
                      )}
                  </div>
              ))}
          </div>
      </div>

      {selectedSessionForModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0a0f24] rounded-[2.5rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10 flex flex-col">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-neon-purple">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{selectedSessionForModal.name}</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{new Date(selectedSessionForModal.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSessionForModal(null)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-all">
                <Plus className="rotate-45" size={24}/>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 custom-scrollbar">
              <div className="space-y-8">
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2 border-b border-white/5 pb-4">
                  <Target size={14} className="text-accent" /> Contenu
                </h4>
                <div className="space-y-6">
                  {PHASES.map(phase => {
                    const phaseExos = selectedSessionForModal.exercises[phase.id] || [];
                    if (phaseExos.length === 0) return null;
                    return (
                      <div key={phase.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{phase.label}</span>
                          <span className="text-[9px] font-black text-accent uppercase">{phaseExos.reduce((sum, e) => sum + e.duration, 0)} min</span>
                        </div>
                        <div className="space-y-2">
                          {phaseExos.map((ex, i) => (
                            <div key={i} className="p-4 bg-white/[0.03] rounded-xl border border-white/5">
                              <div className="font-black text-white text-xs mb-1 uppercase tracking-tight">{ex.name}</div>
                              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{ex.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2 border-b border-white/5 pb-4">
                  <CheckCircle size={14} className="text-accent-neon" /> Appel
                </h4>
                <div className="space-y-3">
                  {(selectedSessionForModal.group ? players.filter(p => p.group === selectedSessionForModal.group) : players).map(player => {
                    const record = attendance.find(a => a.session_id === selectedSessionForModal.id && a.player_id === player.id);
                    const status = record?.status || 'absent';
                    return (
                      <div key={player.id} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-[10px] ${status === 'present' ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' : status === 'late' ? 'bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'bg-white/5 text-slate-600'}`}>{player.first_name[0]}{player.last_name[0]}</div>
                          <span className="font-bold text-white text-xs">{player.first_name} {player.last_name}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => onSaveAttendance(player.id, 'present', selectedSessionForModal.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${status === 'present' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-600 hover:text-emerald-500'}`}><Trophy size={14} /></button>
                          <button onClick={() => onSaveAttendance(player.id, 'late', selectedSessionForModal.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${status === 'late' ? 'bg-amber-500 text-white' : 'bg-white/5 text-slate-600 hover:text-amber-500'}`}><Clock size={14} /></button>
                          <button onClick={() => onSaveAttendance(player.id, 'absent', selectedSessionForModal.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${status === 'absent' ? 'bg-rose-500 text-white' : 'bg-white/5 text-slate-600 hover:text-rose-500'}`}><Plus className="rotate-45" size={14} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-center">
              <button onClick={() => setSelectedSessionForModal(null)} className="px-12 py-4 bg-white text-black rounded-xl font-black text-[10px] tracking-[0.2em] uppercase shadow-2xl hover:scale-105 transition-all">Terminer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});