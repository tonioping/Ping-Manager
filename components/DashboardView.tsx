
import React, { useMemo } from 'react';
import { 
  Plus, Users, Target, Calendar as CalendarIcon, Sparkles, 
  Clock, Zap, ChevronRight, PlayCircle, Lightbulb, Wrench, Box,
  Trophy, TrendingUp, Activity, Star, BookOpen, Rocket, ArrowRight
} from 'lucide-react';
import { Session, Cycle, Player, CoachProfile, View, Exercise } from '../types';
import { EMPTY_SESSION, GROUPS, INITIAL_EXERCISES } from '../constants';

interface DashboardViewProps {
  coachProfile: CoachProfile;
  session: any;
  savedSessions: Session[];
  players: Player[];
  cycles: Cycle[];
  activeCycleData: any;
  setView: (view: View) => void;
  setCurrentSession: (session: Session) => void;
  setCurrentPlayer: (player: Player | null) => void;
}

const FashionLogo = () => (
  <div className="relative group cursor-pointer flex items-center justify-center scale-90 md:scale-100">
    <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full group-hover:bg-accent/30 transition-all duration-500"></div>
    <div className="relative flex flex-col items-center">
        <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-2xl rotate-12 flex items-center justify-center shadow-2xl border-4 border-white group-hover:rotate-0 transition-transform duration-500 overflow-hidden">
                <Target size={32} className="text-white -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 md:w-10 md:h-10 bg-accent rounded-xl -rotate-12 flex items-center justify-center shadow-xl border-2 border-white group-hover:rotate-0 transition-transform duration-500">
                <Zap size={18} className="text-white fill-white" />
            </div>
        </div>
    </div>
  </div>
);

export const DashboardView: React.FC<DashboardViewProps> = React.memo(({
  coachProfile,
  session,
  savedSessions,
  players,
  cycles,
  setView,
  setCurrentSession,
  setCurrentPlayer
}) => {
  
  const groupsStatus = useMemo(() => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      return GROUPS.map(group => {
          const activeCycle = [...cycles]
            .filter(c => c.group === group.id && c.startDate)
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];

          let currentWeekData = null;
          if (activeCycle) {
              const [y, m, d] = activeCycle.startDate.split('-').map(Number);
              const start = new Date(y, m - 1, d);
              const diffTime = now.getTime() - start.getTime();
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              const weekIdx = Math.floor(diffDays / 7);
              const totalWeeks = activeCycle.weeks.length;
              
              if (weekIdx >= 0 && weekIdx < totalWeeks) {
                  const currentWeek = activeCycle.weeks[weekIdx];
                  currentWeekData = {
                      cycleName: activeCycle.name,
                      weekNum: weekIdx + 1,
                      totalWeeks: totalWeeks,
                      theme: currentWeek.theme,
                      notes: currentWeek.notes,
                      nextSessionId: currentWeek.sessionId,
                      nextSessionName: currentWeek.sessionName,
                      progress: Math.round(((weekIdx + 1) / totalWeeks) * 100)
                  };
              } else if (weekIdx >= totalWeeks) {
                  currentWeekData = {
                      cycleName: activeCycle.name,
                      weekNum: totalWeeks,
                      totalWeeks: totalWeeks,
                      theme: "Cycle Terminé",
                      progress: 100,
                      isFinished: true
                  };
              }
          }
          return { ...group, activeData: currentWeekData };
      });
  }, [cycles]);

  const priorityAction = useMemo(() => {
    // On cherche d'abord s'il y a une séance prête
    const ready = groupsStatus.find(g => g.activeData && g.activeData.nextSessionId);
    if (ready) return ready;
    // Sinon on cherche un cycle en cours sans séance liée
    return groupsStatus.find(g => g.activeData && !g.activeData.isFinished) || null;
  }, [groupsStatus]);

  const handleLaunchSession = (group: any) => {
    if (group.activeData?.nextSessionId) {
        const linkedSess = savedSessions.find(s => s.id === group.activeData.nextSessionId);
        if (linkedSess) {
            setCurrentSession({...linkedSess});
            setView('sessions');
            return;
        }
    }
    // Création 1-clic intelligente
    const newSessionName = `${group.label} - Semaine ${group.activeData?.weekNum} - ${group.activeData?.theme || 'Entraînement'}`;
    setCurrentSession({
        ...EMPTY_SESSION, 
        name: newSessionName,
        date: new Date().toISOString().split('T')[0]
    }); 
    setView('sessions');
  };

  const dailyExercise = useMemo(() => {
      const today = new Date();
      const index = (today.getFullYear() * 1000 + today.getDay()) % INITIAL_EXERCISES.length;
      return INITIAL_EXERCISES[index];
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12 px-2 md:px-0">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <FashionLogo />
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
              Ping<span className="text-accent">Manager</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
               <Activity size={12} className="text-accent" /> Coach : {coachProfile.name || 'Premium'}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
            <div className="flex flex-col items-center px-4 md:px-6 border-r border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Joueurs</span>
                <span className="text-xl font-black text-slate-900">{players.length}</span>
            </div>
            <div className="flex flex-col items-center px-4 md:px-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Séances</span>
                <span className="text-xl font-black text-slate-900">{savedSessions.length}</span>
            </div>
        </div>
      </div>

      {/* --- ACCÈS DIRECT 1-CLIC (HERO) --- */}
      {priorityAction && (
        <div className="relative group overflow-hidden bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl border border-slate-800 transition-all hover:shadow-orange-500/10">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <Rocket size={200} className="rotate-12" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-white text-[10px] font-black tracking-widest uppercase">
                <Zap size={12} fill="currentColor" /> Action Prioritaire
              </div>
              <h2 className="text-4xl font-black leading-none tracking-tight">
                {priorityAction.label} <span className="text-accent italic">Sem. {priorityAction.activeData?.weekNum}</span>
              </h2>
              <p className="text-slate-400 text-lg font-bold">
                Focus : <span className="text-white italic">{priorityAction.activeData?.theme || 'Général'}</span>
              </p>
            </div>
            <button 
              onClick={() => handleLaunchSession(priorityAction)}
              className={`group/btn relative px-10 py-6 rounded-[2rem] font-black text-lg flex items-center gap-5 transition-all transform hover:scale-105 shadow-2xl active:scale-95 ${priorityAction.activeData?.nextSessionId ? 'bg-indigo-600 shadow-indigo-500/30' : 'bg-accent shadow-orange-500/30'}`}
            >
              <div className="p-3 bg-white/20 rounded-2xl group-hover/btn:rotate-12 transition-transform">
                {priorityAction.activeData?.nextSessionId ? <PlayCircle size={28} /> : <Plus size={28} />}
              </div>
              <div className="text-left">
                 <div className="leading-none tracking-tighter uppercase">{priorityAction.activeData?.nextSessionId ? 'LANCER' : 'PRÉPARER'}</div>
                 <div className="text-[10px] opacity-70 font-black tracking-[0.2em] mt-1 uppercase">1-CLIC ACCÈS</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* --- GRILLE DES GROUPES --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Suivi des cycles</h2>
          <button onClick={() => setView('calendar')} className="text-[10px] font-black text-slate-400 hover:text-accent tracking-widest uppercase">Voir planning complet</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupsStatus.map((group) => (
            <div key={group.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all group/card">
              <div className={`h-24 flex items-center justify-between px-8 ${group.color.split(' ')[0]}`}>
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-transform">
                  <span className="text-xl font-black text-slate-900">{group.label[0]}</span>
                </div>
                {group.activeData ? (
                  <span className="px-3 py-1 bg-white/90 text-slate-900 rounded-full text-[10px] font-black border border-white shadow-sm">
                    {group.activeData.isFinished ? 'FINI' : `S${group.activeData.weekNum}`}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-white/20 text-slate-900 rounded-full text-[10px] font-black">À PLANIFIER</span>
                )}
              </div>
              
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tighter">{group.label}</h4>
                  
                  {group.activeData ? (
                    <div className="space-y-4">
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${group.activeData.progress}%` }}></div>
                      </div>
                      <div className="min-h-[40px]">
                        <p className="text-xs font-black text-slate-900 leading-tight line-clamp-2 italic">"{group.activeData.theme}"</p>
                        {group.activeData.nextSessionName && (
                            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg mt-3 border border-indigo-100 w-fit">
                                <BookOpen size={10} /> {group.activeData.nextSessionName}
                            </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center border-2 border-dashed border-slate-50 rounded-2xl">
                      <button onClick={() => setView('calendar')} className="text-[10px] font-black text-slate-400 hover:text-accent uppercase tracking-widest">Créer un cycle</button>
                    </div>
                  )}
                </div>

                {group.activeData && (
                    <button 
                      onClick={() => handleLaunchSession(group)}
                      className={`mt-6 w-full py-3.5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-3 ${group.activeData.nextSessionId ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-200'}`}
                    >
                      {group.activeData.nextSessionId ? <><PlayCircle size={16}/> Lancer</> : <><Plus size={16}/> Préparer</>}
                    </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- RACCOURCIS RAPIDES --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Exercices', sub: `${INITIAL_EXERCISES.length} fiches`, icon: Lightbulb, view: 'library', color: 'indigo' },
          { label: 'Joueurs', sub: `${players.length} suivis`, icon: Users, view: 'players', color: 'emerald' },
          { label: 'Historique', sub: 'Archives', icon: Clock, view: 'history', color: 'blue' },
          { label: 'Version Pro', sub: 'Cloud & IA', icon: Trophy, view: 'subscription', color: 'slate' },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => setView(item.view as View)} 
            className={`p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-accent transition-all flex flex-col gap-4 group text-left ${item.color === 'slate' ? 'bg-slate-900 text-white border-slate-800' : ''}`}
          >
            <div className={`p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform ${item.color === 'slate' ? 'bg-accent text-white' : `bg-${item.color}-50 text-${item.color}-600`}`}>
              <item.icon size={24}/>
            </div>
            <div>
              <div className={`font-black uppercase text-[10px] tracking-widest mb-1 ${item.color === 'slate' ? 'text-white' : 'text-slate-900'}`}>{item.label}</div>
              <div className={`text-[10px] font-black uppercase opacity-60`}>{item.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});
