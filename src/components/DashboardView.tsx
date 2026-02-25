import React, { useMemo } from 'react';
import { 
  Plus, Target, Calendar as CalendarIcon, 
  Clock, Zap, ChevronRight, PlayCircle, Lightbulb,
  Rocket, TrendingUp as ProgressIcon, GraduationCap, Globe, Activity, Trophy
} from 'lucide-react';
import { Session, Cycle, Player, CoachProfile, View } from '../types';
import { GROUPS, INITIAL_EXERCISES } from '../constants';
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
  session,
  savedSessions,
  players,
  cycles,
  setView,
  setCurrentSession,
  setCurrentPlayer,
  onSelectGroup
}) => {
  const groupsStatus = useMemo(() => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return GROUPS.map(group => {
          const activeCycle = [...cycles].filter(c => c.group === group.id && c.startDate).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
          let currentWeekData = null;
          if (activeCycle) {
              const [y, m, d] = activeCycle.startDate.split('-').map(Number);
              const start = new Date(y, m - 1, d);
              const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
              const weekIdx = Math.floor(diffDays / 7);
              const totalWeeks = activeCycle.weeks.length;
              if (weekIdx >= 0 && weekIdx < totalWeeks) {
                  const currentWeek = activeCycle.weeks[weekIdx];
                  currentWeekData = { cycleName: activeCycle.name, weekNum: weekIdx + 1, totalWeeks, theme: currentWeek.theme, progress: Math.round(((weekIdx + 1) / totalWeeks) * 100) };
              }
          }
          return { ...group, activeData: currentWeekData };
      });
  }, [cycles]);

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
              <div className="relative group bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl border border-slate-800 h-full flex flex-col justify-center overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700 overflow-hidden rounded-[3rem] w-full h-full"><Rocket size={250} className="rotate-12 absolute -right-10 top-0" /></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-center md:text-left space-y-4">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-white text-[10px] font-black tracking-widest uppercase shadow-lg shadow-orange-500/20"><Zap size={12} fill="currentColor" /> Prochaine Étape</div>
                      <h2 className="text-5xl font-black leading-none tracking-tight">Prêt pour <span className="text-accent italic">l'entraînement ?</span></h2>
                      <p className="text-slate-400 text-lg font-bold">Gérez vos séances et suivez vos joueurs avec l'IA.</p>
                    </div>
                    <button onClick={() => setView('sessions')} className="group/btn relative px-10 py-8 rounded-[2rem] font-black text-lg flex items-center gap-5 transition-all transform hover:scale-105 shadow-2xl active:scale-95 bg-accent shadow-orange-500/30">
                      <div className="p-3 bg-white/20 rounded-2xl group-hover/btn:rotate-12 transition-transform"><Plus size={32} /></div>
                      <div className="text-left"><div className="leading-none tracking-tighter uppercase text-xl">CRÉER</div><div className="text-[10px] opacity-70 font-black tracking-[0.2em] mt-1 uppercase">SÉANCE</div></div>
                    </button>
                  </div>
              </div>
          </div>
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between group/widget relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2"><div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><ProgressIcon size={18}/></div><h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest italic">Top Progression</h3></div>
                </div>
                <div className="space-y-6">
                    {players.length > 0 ? players.slice(0, 3).map((p, idx) => (
                        <div key={p.id} onClick={() => { setCurrentPlayer(p); setView('players'); }} className="flex items-center justify-between cursor-pointer group/row">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${idx === 0 ? 'bg-accent text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>{idx + 1}</div>
                                <div><div className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-sm group-hover/row:text-accent transition-colors">{p.first_name}</div></div>
                            </div>
                        </div>
                    )) : <div className="py-8 text-center text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">En attente de données...</div>}
                </div>
             </div>
             <button onClick={() => setView('players')} className="mt-8 w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900 hover:text-white transition-all shadow-sm">Détails joueurs</button>
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
    </div>
  );
});