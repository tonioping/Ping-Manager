
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
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl rotate-12 flex items-center justify-center shadow-2xl border-4 border-slate-900 group-hover:rotate-0 transition-transform duration-500 overflow-hidden">
                <Target size={40} className="text-slate-900 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-10 h-10 md:w-12 md:h-12 bg-accent rounded-xl -rotate-12 flex items-center justify-center shadow-xl border-4 border-slate-900 group-hover:rotate-0 transition-transform duration-500">
                <Zap size={24} className="text-white fill-white" />
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

  // Déterminer l'action prioritaire (la séance la plus proche à faire)
  const priorityAction = useMemo(() => {
    // On prend le premier groupe qui a un cycle en cours
    const active = groupsStatus.find(g => g.activeData && !g.activeData.isFinished);
    return active || null;
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
    // Création automatique si aucune séance n'est liée
    const newSessionName = `${group.label} - S${group.activeData?.weekNum} - ${group.activeData?.theme || 'Entraînement'}`;
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <FashionLogo />
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
              Ping<span className="text-accent">Manager</span>
            </h1>
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
               <Activity size={14} className="text-accent" /> Coach {coachProfile.name || 'Premium'}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
            <div className="flex flex-col items-center px-6 border-r border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Joueurs</span>
                <span className="text-2xl font-black text-slate-900">{players.length}</span>
            </div>
            <div className="flex flex-col items-center px-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sessions</span>
                <span className="text-2xl font-black text-slate-900">{savedSessions.length}</span>
            </div>
        </div>
      </div>

      {/* --- ACTION PRIORITAIRE (1-CLIC) --- */}
      {priorityAction && (
        <div className="relative group overflow-hidden bg-slate-900 rounded-[3.5rem] p-8 md:p-12 text-white shadow-2xl border border-slate-800 transition-all hover:shadow-orange-500/10">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <Rocket size={240} className="rotate-12" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-white text-[10px] font-black tracking-widest uppercase">
                <Zap size={12} fill="currentColor" /> Prochaine Séance
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-none tracking-tight">
                {priorityAction.label} <span className="text-accent italic">S{priorityAction.activeData?.weekNum}</span>
              </h2>
              <p className="text-slate-400 text-xl font-bold">
                Thème : <span className="text-white">{priorityAction.activeData?.theme}</span>
              </p>
            </div>
            <button 
              onClick={() => handleLaunchSession(priorityAction)}
              className={`group/btn relative px-12 py-7 rounded-[2.5rem] font-black text-xl flex items-center gap-5 transition-all transform hover:scale-105 shadow-2xl active:scale-95 ${priorityAction.activeData?.nextSessionId ? 'bg-indigo-600 shadow-indigo-500/30' : 'bg-accent shadow-orange-500/30'}`}
            >
              <div className="p-3 bg-white/20 rounded-2xl group-hover/btn:rotate-12 transition-transform">
                {priorityAction.activeData?.nextSessionId ? <PlayCircle size={32} /> : <Plus size={32} />}
              </div>
              <div className="text-left">
                 <div className="leading-none">{priorityAction.activeData?.nextSessionId ? 'LANCER' : 'GÉNÉRER'}</div>
                 <div className="text-[10px] opacity-70 font-black tracking-[0.2em] mt-2 uppercase">Accès 1-Clic</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* --- GRILLE DES GROUPES --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Suivi Planification</h2>
          <button onClick={() => setView('calendar')} className="text-[10px] font-black text-slate-400 hover:text-accent tracking-widest uppercase border-b border-transparent hover:border-accent transition-all">Planning Complet</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupsStatus.map((group) => (
            <div key={group.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all group/card">
              <div className={`h-28 flex items-center justify-between px-8 ${group.color.split(' ')[0]}`}>
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-transform">
                  <span className="text-2xl font-black text-slate-900">{group.label[0]}</span>
                </div>
                {group.activeData ? (
                  <span className="px-4 py-1.5 bg-white/90 text-slate-900 rounded-full text-[10px] font-black border border-white shadow-sm">
                    {group.activeData.isFinished ? 'FINI' : `SEMAINE ${group.activeData.weekNum}`}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-white/20 text-slate-900 rounded-full text-[10px] font-black">EN ATTENTE</span>
                )}
              </div>
              
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">{group.label}</h4>
                  
                  {group.activeData ? (
                    <div className="space-y-5">
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent rounded-full transition-all duration-1000" 
                          style={{ width: `${group.activeData.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="min-h-[40px]">
                        <p className="text-sm font-black text-slate-900 leading-tight">{group.activeData.theme}</p>
                        {group.activeData.nextSessionName && (
                            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg mt-3 border border-indigo-100 w-fit">
                                <BookOpen size={12} /> {group.activeData.nextSessionName}
                            </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">Aucun cycle actif</p>
                      <button onClick={() => setView('calendar')} className="text-[10px] font-black text-accent hover:underline uppercase tracking-widest">Planifier</button>
                    </div>
                  )}
                </div>

                {group.activeData && (
                    <button 
                      onClick={() => handleLaunchSession(group)}
                      className={`mt-8 w-full py-4 rounded-2xl font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-sm ${group.activeData.nextSessionId ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-200'}`}
                    >
                      {group.activeData.nextSessionId ? <><PlayCircle size={18}/> Démarrer</> : <><Plus size={18}/> Créer séance</>}
                    </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- RACCOURCIS --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button onClick={() => setView('library')} className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-accent transition-all flex flex-col gap-4 group text-left">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl w-fit group-hover:scale-110 transition-transform"><Lightbulb size={24}/></div>
            <div>
              <div className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1">Bibliothèque</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">{INITIAL_EXERCISES.length} Exos</div>
            </div>
        </button>
        <button onClick={() => setView('players')} className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-accent transition-all flex flex-col gap-4 group text-left">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl w-fit group-hover:scale-110 transition-transform"><Users size={24}/></div>
            <div>
              <div className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1">Joueurs</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">{players.length} Membres</div>
            </div>
        </button>
        <button onClick={() => setView('history')} className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-accent transition-all flex flex-col gap-4 group text-left">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl w-fit group-hover:scale-110 transition-transform"><Clock size={24}/></div>
            <div>
              <div className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1">Historique</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Archives</div>
            </div>
        </button>
        <button onClick={() => setView('subscription')} className="p-6 bg-slate-900 rounded-[2rem] border border-slate-800 shadow-lg hover:bg-slate-800 transition-all flex flex-col gap-4 group text-left">
            <div className="p-4 bg-accent text-white rounded-2xl w-fit group-hover:scale-110 transition-transform"><Trophy size={24}/></div>
            <div>
              <div className="font-black text-white uppercase text-xs tracking-widest mb-1">Version Pro</div>
              <div className="text-[10px] text-slate-500 font-black uppercase">Plus d'IA</div>
            </div>
        </button>
      </div>

      {/* --- INSPIRATION IA --- */}
      <div className="bg-indigo-600 text-white rounded-[3.5rem] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Sparkles size={160} />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-black flex items-center gap-4 italic uppercase tracking-tighter"><Sparkles size={32}/> Inspiration IA</h3>
              <p className="text-indigo-100 text-lg font-bold">Un exercice recommandé pour dynamiser vos séances aujourd'hui.</p>
              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl">
                <h4 className="text-2xl font-black mb-3 text-white italic">{dailyExercise.name}</h4>
                <p className="text-indigo-50 text-sm leading-relaxed mb-6 font-medium italic opacity-80">"{dailyExercise.description}"</p>
                <div className="flex flex-wrap gap-4">
                   <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full"><Clock size={12}/> {dailyExercise.duration} min</span>
                   <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full"><Target size={12}/> {dailyExercise.theme || 'Général'}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
               <button onClick={() => setView('library')} className="px-10 py-5 bg-white text-indigo-600 rounded-[2rem] font-black text-sm hover:scale-105 transition-all shadow-2xl uppercase tracking-widest active:scale-95">Voir plus d'exercices</button>
            </div>
          </div>
      </div>
    </div>
  );
});
