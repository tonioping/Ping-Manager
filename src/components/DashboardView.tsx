import React, { useMemo, useState } from 'react';
import { 
  Plus, Target, Calendar as CalendarIcon, 
  Clock, Zap, ChevronRight, PlayCircle, Lightbulb,
  Rocket, TrendingUp as ProgressIcon, GraduationCap, Globe, Activity, Trophy, ListChecks, BookOpen, Users, CheckCircle, Copy
} from 'lucide-react';
import { Session, Cycle, Player, CoachProfile, View, Attendance } from '../types';
import { GROUPS, INITIAL_EXERCISES, PHASES } from '../constants';
import { InfoBubble } from './InfoBubble';

const FashionLogo = () => (
  <div className="relative group cursor-pointer flex items-center justify-center scale-90 md:scale-100">
    <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full group-hover:bg-accent/30 transition-all duration-500"></div>
    <div className="relative flex flex-col items-center">
        <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-2xl rotate-12 flex items-center justify-center shadow-2xl border-4 border-white dark:border-slate-800 group-hover:rotate-0 transition-transform duration-500 overflow-hidden">
                <Target size={32} className="text-white -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 md:w-10 md:h-10 bg-accent rounded-xl -rotate-12 flex items-center justify-center shadow-xl border-2 border-white dark:border-slate-800 group-hover:rotate-0 transition-transform duration-500">
                <Zap size={18} className="text-white fill-white" />
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
  setCurrentPlayer,
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
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
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
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12 px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-visible relative">
        <div className="flex items-center gap-6">
          <FashionLogo />
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Ping<span className="text-accent">Manager</span></h1>
            <div className="flex flex-wrap items-center gap-3 mt-1">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2"><Activity size={12} className="text-accent" /> Coach : {coachProfile.name || 'Premium'}</p>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest"><Globe size={10} /> Synchronisé</div>
            </div>
          </div>
        </div>
        <div className="flex gap-8">
            <div className="flex flex-col items-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Joueurs</span><span className="text-2xl font-black text-slate-900 dark:text-white">{players.length}</span></div>
            <div className="flex flex-col items-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Séances</span><span className="text-2xl font-black text-slate-900 dark:text-white">{savedSessions.length}</span></div>
        </div>
      </div>

      <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Pilotage par Groupe</h3>
                <InfoBubble content="Visualisez la prochaine séance de chaque groupe et accédez directement à l'appel des joueurs." />
              </div>
              <button onClick={() => setView('sessions')} className="hidden md:flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-widest hover:underline">
                <Plus size={14}/> Planifier une séance
              </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupsStatus.map(group => (
                  <div key={group.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group/groupcard relative overflow-hidden flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${group.color}`}>
                              {group.label}
                          </div>
                          <button onClick={() => onSelectGroup(group.id)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-300 group-hover/groupcard:text-accent transition-colors">
                              <ChevronRight size={20} />
                          </button>
                      </div>
                      
                      <div className="flex-1 space-y-6">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                <CalendarIcon size={12} className="text-accent" /> Prochaine séance
                            </div>
                            {group.nextSession ? (
                                <div className="space-y-3">
                                    <div className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-lg leading-tight truncate">
                                        {group.nextSession.name}
                                    </div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        {new Date(group.nextSession.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                    </div>
                                    <button 
                                        onClick={() => setSelectedSessionForModal(group.nextSession)}
                                        className="w-full mt-2 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-black text-[9px] tracking-widest uppercase flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg"
                                    >
                                        <ListChecks size={14} /> Détails & Appel
                                    </button>
                                </div>
                            ) : (
                                <div className="py-4 text-center">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Aucune séance prévue</p>
                                    <button onClick={() => { setCurrentSession({...INITIAL_EXERCISES, group: group.id}); setView('sessions'); }} className="mt-2 text-accent font-black text-[9px] uppercase tracking-widest hover:underline">Créer maintenant</button>
                                </div>
                            )}
                        </div>

                        {group.activeData && (
                            <div className="px-2 space-y-2">
                                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                    <span className="text-slate-400">Cycle : {group.activeData.cycleName}</span>
                                    <span className="text-accent">Sem. {group.activeData.weekNum}/{group.activeData.totalWeeks}</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${group.activeData.progress}%` }}></div>
                                </div>
                            </div>
                        )}
                      </div>
                  </div>
              ))}
          </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Bibliothèque', sub: `${INITIAL_EXERCISES.length} fiches`, icon: Lightbulb, view: 'library', color: 'indigo' },
          { label: 'Effectifs', sub: `${players.length} licenciés`, icon: GraduationCap, view: 'players', color: 'emerald' },
          { label: 'Historique', sub: 'Archives', icon: Clock, view: 'history', color: 'blue' },
          { label: 'Version Pro', sub: 'Cloud & IA', icon: Trophy, view: 'subscription', color: 'slate' },
        ].map((item, i) => (
          <button key={i} onClick={() => setView(item.view as View)} className={`relative p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:border-accent hover:shadow-xl transition-all flex flex-col gap-6 group text-left ${item.color === 'slate' ? 'bg-slate-900 text-white border-slate-800' : 'bg-white dark:bg-slate-900'}`}>
            <div className={`p-5 rounded-2xl w-fit group-hover:scale-110 transition-transform ${item.color === 'slate' ? 'bg-accent text-white shadow-lg shadow-orange-500/20' : `bg-${item.color}-50 dark:bg-${item.color}-900/30 text-${item.color}-600 dark:text-${item.color}-400`}`}><item.icon size={28}/></div>
            <div><div className={`font-black uppercase text-xs tracking-widest mb-1 ${item.color === 'slate' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{item.label}</div><div className={`text-[9px] font-black uppercase opacity-60 tracking-widest`}>{item.sub}</div></div>
          </button>
        ))}
      </div>

      {selectedSessionForModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 dark:bg-white rounded-2xl text-accent shadow-lg">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">{selectedSessionForModal.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{new Date(selectedSessionForModal.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { onDuplicateSession(selectedSessionForModal); setSelectedSessionForModal(null); }} 
                  className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-2xl transition-all shadow-sm text-slate-400 hover:text-accent"
                  title="Dupliquer cette séance"
                >
                  <Copy size={24}/>
                </button>
                <button onClick={() => setSelectedSessionForModal(null)} className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-2xl transition-all shadow-sm"><Plus className="rotate-45 text-slate-400" size={24}/></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 custom-scrollbar">
              <div className="space-y-8">
                <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <Target size={14} className="text-accent" /> Contenu de la séance
                </h4>
                <div className="space-y-6">
                  {PHASES.map(phase => {
                    const phaseExos = selectedSessionForModal.exercises[phase.id] || [];
                    if (phaseExos.length === 0) return null;
                    return (
                      <div key={phase.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{phase.label}</span>
                          <span className="text-[9px] font-black text-accent uppercase">{phaseExos.reduce((sum, e) => sum + e.duration, 0)} min</span>
                        </div>
                        <div className="space-y-2">
                          {phaseExos.map((ex, i) => (
                            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                              <div className="font-bold text-slate-900 dark:text-white text-sm mb-1">{ex.name}</div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{ex.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <CheckCircle size={14} className="text-emerald-500" /> Faire l'appel
                </h4>
                <div className="space-y-3">
                  {(selectedSessionForModal.group ? players.filter(p => p.group === selectedSessionForModal.group) : players).map(player => {
                    const record = attendance.find(a => a.session_id === selectedSessionForModal.id && a.player_id === player.id);
                    const status = record?.status || 'absent';
                    return (
                      <div key={player.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${status === 'present' ? 'bg-emerald-500 text-white' : status === 'late' ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>{player.first_name[0]}{player.last_name[0]}</div>
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{player.first_name} {player.last_name}</span>
                        </div>
                        <div className="flex gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                          <button onClick={() => onSaveAttendance(player.id, 'present', selectedSessionForModal.id)} className={`p-2 rounded-lg transition-all ${status === 'present' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-300 hover:text-emerald-500'}`}><Trophy size={16} /></button>
                          <button onClick={() => onSaveAttendance(player.id, 'late', selectedSessionForModal.id)} className={`p-2 rounded-lg transition-all ${status === 'late' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-300 hover:text-amber-500'}`}><Clock size={16} /></button>
                          <button onClick={() => onSaveAttendance(player.id, 'absent', selectedSessionForModal.id)} className={`p-2 rounded-lg transition-all ${status === 'absent' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-300 hover:text-rose-500'}`}><Plus className="rotate-45" size={16} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 flex justify-center">
              <button onClick={() => setSelectedSessionForModal(null)} className="px-12 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl hover:scale-105 transition-all">Terminer l'entraînement</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});