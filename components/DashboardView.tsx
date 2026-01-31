
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
  <div className="relative group cursor-pointer flex items-center justify-center scale-75 md:scale-100">
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
    const active = groupsStatus.find(g => g.activeData && !g.activeData.isFinished);
    if (!active) return null;
    return active;
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
    // Création automatique
    setCurrentSession({
        ...EMPTY_SESSION, 
        name: `${group.label} - S${group.activeData?.weekNum} - ${group.activeData?.theme || 'Entraînement'}`
    }); 
    setView('sessions');
  };

  const dailyExercise = useMemo(() => {
      const today = new Date();
      const index = (today.getFullYear() * 1000 + today.getDay()) % INITIAL_EXERCISES.length;
      return INITIAL_EXERCISES[index];
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12 px-4 md:px-0">
      
      {/* --- HEADER COMPACT AVEC LOGO --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <FashionLogo />
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Bonjour, <span className="text-accent">{coachProfile.name || 'Coach'}</span>
            </h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
               <Activity size={14} className="text-accent" /> {coachProfile.club || 'Prêt pour l\'entraînement'}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
            <div className="hidden md:flex flex-col items-end px-4 border-r border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Joueurs</span>
                <span className="text-xl font-black text-slate-900">{players.length}</span>
            </div>
            <div className="hidden md:flex flex-col items-end px-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Séances</span>
                <span className="text-xl font-black text-slate-900">{savedSessions.length}</span>
            </div>
            <button 
                onClick={() => setView('settings')}
                className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-accent transition-colors border border-slate-100"
            >
                <ArrowRight size={20} />
            </button>
        </div>
      </div>

      {/* --- CENTRE D'ACTION PRIORITAIRE (1-CLIC) --- */}
      {priorityAction && (
        <div className="relative group overflow-hidden bg-slate-900 rounded-[3rem] p-8 md:p-10 text-white shadow-2xl border border-slate-800 transition-all hover:shadow-orange-500/10">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <Rocket size={200} className="rotate-12" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-white text-[10px] font-black mb-4 tracking-tighter uppercase">
                <Rocket size={12} fill="currentColor" /> Action Recommandée
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-2 leading-tight">
                {priorityAction.activeData?.nextSessionId ? 'Lancer la séance' : 'Préparer la séance'}
              </h2>
              <p className="text-slate-400 text-lg font-medium">
                Groupe <span className="text-white font-black">{priorityAction.label}</span> • Semaine {priorityAction.activeData?.weekNum} : <span className="italic">{priorityAction.activeData?.theme}</span>
              </p>
            </div>
            <button 
              onClick={() => handleLaunchSession(priorityAction)}
              className={`group/btn relative px-10 py-6 rounded-[2rem] font-black text-lg flex items-center gap-4 transition-all transform hover:scale-105 shadow-2xl shadow-accent/30 ${priorityAction.activeData?.nextSessionId ? 'bg-blue-600' : 'bg-accent'}`}
            >
              <div className="p-2 bg-white/20 rounded-xl group-hover/btn:rotate-12 transition-transform">
                {priorityAction.activeData?.nextSessionId ? <PlayCircle size={28} /> : <Plus size={28} />}
              </div>
              <div className="text-left">
                 <div className="leading-none">{priorityAction.activeData?.nextSessionId ? 'DÉMARRER' : 'GÉNÉRER'}</div>
                 <div className="text-[10px] opacity-70 font-black tracking-widest mt-1 uppercase">1-Clic Access</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* --- GRILLE DES GROUPES --- */}
      <div>
        <div className="flex items-center justify-between mb-6 px-4">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <TrendingUp className="text-accent" /> Planification des Groupes
          </h2>
          <button onClick={() => setView('calendar')} className="text-xs font-black text-slate-400 hover:text-accent tracking-widest uppercase">VOIR LE PLANNING</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupsStatus.map((group) => (
            <div key={group.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all group/card border-b-4 border-b-transparent hover:border-b-accent">
              <div className={`h-24 flex items-center justify-between px-8 ${group.color.split(' ')[0]}`}>
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-transform">
                  <span className="text-xl font-black text-slate-900">{group.label[0]}</span>
                </div>
                {group.activeData ? (
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black border ${group.activeData.isFinished ? 'bg-slate-100 text-slate-900 border-slate-200' : 'bg-white/80 text-slate-900 border-white shadow-sm'}`}>
                    {group.activeData.isFinished ? 'FINI' : `S${group.activeData.weekNum}`}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-white/20 text-slate-900 rounded-full text-[10px] font-black">VIDE</span>
                )}
              </div>
              
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-black text-slate-900 mb-4">{group.label}</h4>
                  
                  {group.activeData ? (
                    <div className="space-y-4">
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent rounded-full transition-all duration-1000" 
                          style={{ width: `${group.activeData.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="min-h-[60px]">
                        <p className="text-sm font-black text-slate-900 line-clamp-1">{group.activeData.theme}</p>
                        {group.activeData.nextSessionName ? (
                            <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg mt-2 border border-blue-100 w-fit">
                                <BookOpen size={12} /> {group.activeData.nextSessionName}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 mt-2 italic">Pas de séance liée</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center border-2 border-dashed border-slate-50 rounded-2xl">
                      <p className="text-xs text-slate-400 font-bold italic mb-3">Aucun cycle actif</p>
                      <button onClick={() => setView('calendar')} className="text-[10px] font-black text-accent hover:underline uppercase tracking-widest">Planifier</button>
                    </div>
                  )}
                </div>

                {group.activeData && (
                    <button 
                      onClick={() => handleLaunchSession(group)}
                      className={`mt-6 w-full py-4 rounded-2xl font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-sm ${group.activeData.nextSessionId ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'}`}
                    >
                      {group.activeData.nextSessionId ? <><PlayCircle size={16}/> Lancer</> : <><Plus size={16}/> Créer séance</>}
                    </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- RACCOURCIS SECONDAIRES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button onClick={() => setView('library')} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-accent transition-all flex items-center gap-4 group">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform"><Lightbulb size={24}/></div>
            <div className="text-left"><div className="font-black text-slate-900">Bibliothèque</div><div className="text-[10px] text-slate-400 font-bold">{INITIAL_EXERCISES.length} exercices</div></div>
        </button>
        <button onClick={() => setView('players')} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-accent transition-all flex items-center gap-4 group">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform"><Users size={24}/></div>
            <div className="text-left"><div className="font-black text-slate-900">Joueurs</div><div className="text-[10px] text-slate-400 font-bold">{players.length} suivis</div></div>
        </button>
        <button onClick={() => setView('history')} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-accent transition-all flex items-center gap-4 group">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform"><Clock size={24}/></div>
            <div className="text-left"><div className="font-black text-slate-900">Historique</div><div className="text-[10px] text-slate-400 font-bold">Dernières séances</div></div>
        </button>
        <button onClick={() => setView('subscription')} className="p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-lg hover:bg-slate-800 transition-all flex items-center gap-4 group">
            <div className="p-3 bg-accent text-white rounded-2xl group-hover:scale-110 transition-transform"><Trophy size={24}/></div>
            <div className="text-left"><div className="font-black text-white">Version PRO</div><div className="text-[10px] text-slate-400 font-bold">Cloud & IA</div></div>
        </button>
      </div>

      {/* --- SÉANCE DU JOUR (INSPIRATION) --- */}
      <div className="bg-indigo-600 text-white rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles size={120} />
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-black mb-2 flex items-center gap-3"><Sparkles size={24}/> Inspiration du jour</h3>
              <p className="text-indigo-100 text-sm font-medium mb-6">Ajoutez cet exercice à votre prochaine séance pour varier l'entraînement.</p>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20">
                <h4 className="text-xl font-black mb-2">{dailyExercise.name}</h4>
                <p className="text-sm text-indigo-100 line-clamp-2 italic">"{dailyExercise.description}"</p>
                <div className="flex gap-4 mt-4 text-[10px] font-black uppercase tracking-widest text-white/70">
                   <span className="flex items-center gap-1"><Clock size={12}/> {dailyExercise.duration} min</span>
                   <span className="flex items-center gap-1"><Target size={12}/> {dailyExercise.theme || 'Général'}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
               <button onClick={() => setView('library')} className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-xl">Explorer la bibliothèque</button>
            </div>
          </div>
      </div>
    </div>
  );
});
