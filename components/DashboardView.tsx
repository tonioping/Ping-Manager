import React, { useMemo } from 'react';
import { 
  Plus, Users, Target, Calendar as CalendarIcon, Sparkles, 
  Clock, Zap, ChevronRight, PlayCircle, Lightbulb, Wrench, Box,
  Trophy, TrendingUp, Activity, Star, BookOpen, Rocket, ArrowRight,
  TrendingUp as ProgressIcon, GraduationCap, Globe
} from 'lucide-react';
import { Session, Cycle, Player, CoachProfile, View, Exercise, PlayerEvaluation } from '../types';
import { EMPTY_SESSION, GROUPS, INITIAL_EXERCISES } from '../constants';
import { InfoBubble } from './InfoBubble';

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
    const ready = groupsStatus.find(g => g.activeData && g.activeData.nextSessionId);
    if (ready) return ready;
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
    const newSessionName = `${group.label} - Semaine ${group.activeData?.weekNum} - ${group.activeData?.theme || 'Entraînement'}`;
    setCurrentSession({
        ...EMPTY_SESSION, 
        name: newSessionName,
        date: new Date().toISOString().split('T')[0]
    }); 
    setView('sessions');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12 px-2 md:px-0">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-visible relative">
        
        <div className="flex items-center gap-6">
          <FashionLogo />
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
              Ping<span className="text-accent">Manager</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                   <Activity size={12} className="text-accent" /> Coach : {coachProfile.name || 'Premium'}
                </p>
                <div className="h-3 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                    <Globe size={10} /> Synchronisé
                </div>
            </div>
          </div>
        </div>
        <div className="flex gap-8">
            <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Joueurs</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{players.length}</span>
            </div>
            <div className="w-px h-10 bg-slate-100 dark:bg-slate-800 hidden md:block"></div>
            <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Séances</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{savedSessions.length}</span>
            </div>
        </div>
      </div>

      {/* --- ACCÈS DIRECT & STATS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CARTE ACTION PRIORITAIRE */}
          <div className="lg:col-span-8">
              {priorityAction ? (
                <div className="relative group bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl border border-slate-800 transition-all hover:shadow-orange-500/10 h-full flex flex-col justify-center overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700 overflow-hidden rounded-[3rem] w-full h-full">
                    <Rocket size={250} className="rotate-12 absolute -right-10 top-0" />
                  </div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-center md:text-left space-y-4">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-white text-[10px] font-black tracking-widest uppercase shadow-lg shadow-orange-500/20">
                        <Zap size={12} fill="currentColor" /> Prochaine Étape
                        <InfoBubble content="Cette carte détecte automatiquement la séance prévue dans votre planning pour aujourd'hui." position="right" className="ml-1" />
                      </div>
                      <h2 className="text-5xl font-black leading-none tracking-tight">
                        {priorityAction.label} <span className="text-accent italic">Sem. {priorityAction.activeData?.weekNum}</span>
                      </h2>
                      <p className="text-slate-400 text-lg font-bold">
                        Focus technique : <span className="text-white italic">{priorityAction.activeData?.theme || 'Général'}</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => handleLaunchSession(priorityAction)}
                      className={`group/btn relative px-10 py-8 rounded-[2rem] font-black text-lg flex items-center gap-5 transition-all transform hover:scale-105 shadow-2xl active:scale-95 ${priorityAction.activeData?.nextSessionId ? 'bg-indigo-600 shadow-indigo-500/30' : 'bg-accent shadow-orange-500/30'}`}
                    >
                      <div className="p-3 bg-white/20 rounded-2xl group-hover/btn:rotate-12 transition-transform">
                        {priorityAction.activeData?.nextSessionId ? <PlayCircle size={32} /> : <Plus size={32} />}
                      </div>
                      <div className="text-left">
                         <div className="leading-none tracking-tighter uppercase text-xl">{priorityAction.activeData?.nextSessionId ? 'LANCER' : 'PRÉPARER'}</div>
                         <div className="text-[10px] opacity-70 font-black tracking-[0.2em] mt-1 uppercase">ACCÈS 1-CLIC</div>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-4 h-full">
                   <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-300 dark:text-slate-700"><CalendarIcon size={40}/></div>
                   <div>
                     <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Aucun cycle actif</h3>
                     <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Commencez par planifier une saison dans le calendrier.</p>
                   </div>
                   <button onClick={() => setView('calendar')} className="px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-slate-800 transition shadow-lg">Créer un planning</button>
                </div>
              )}
          </div>

          {/* PETIT WIDGET PROGRESSION CLUB */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between group/widget relative overflow-hidden">
             <div className="absolute -bottom-12 -right-12 text-slate-50 dark:text-slate-800 group-hover/widget:text-orange-50 dark:group-hover/widget:text-slate-800 group-hover/widget:scale-110 transition-all duration-700 pointer-events-none">
                <ProgressIcon size={180} />
             </div>
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><ProgressIcon size={18}/></div>
                        <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest italic">Top Progression</h3>
                    </div>
                    <InfoBubble content="Basé sur la hausse de moyenne technique globale ce mois-ci." />
                </div>
                
                <div className="space-y-6">
                    {players.length > 0 ? (
                        [...players].slice(0, 3).map((p, idx) => (
                            <div key={p.id} onClick={() => { setCurrentPlayer(p); setView('players'); }} className="flex items-center justify-between cursor-pointer group/row">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${idx === 0 ? 'bg-accent text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>{idx + 1}</div>
                                    <div>
                                        <div className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-sm group-hover/row:text-accent transition-colors">{p.first_name}</div>
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{p.group}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-emerald-500 font-black text-sm flex items-center gap-1">+{15 - idx * 2}% <TrendingUp size={12}/></div>
                                    <div className="text-[8px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest">Moyenne : 4.2</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">En attente de données...</div>
                    )}
                </div>
             </div>
             
             <button onClick={() => setView('players')} className="mt-8 w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900 hover:text-white transition-all shadow-sm group-hover/widget:translate-y-0 translate-y-2 opacity-0 group-hover/widget:opacity-100 duration-500">Détails joueurs</button>
          </div>
      </div>

      {/* --- GRILLE DES GROUPES & CYCLES --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Suivi des cycles <span className="text-accent">&</span> Objectifs</h2>
            <InfoBubble content="Suivez ici l'avancement de vos groupes par rapport à vos objectifs annuels." />
          </div>
          <button onClick={() => setView('calendar')} className="text-[10px] font-black text-slate-400 hover:text-accent tracking-widest uppercase flex items-center gap-2 group">Voir planning complet <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groupsStatus.map((group) => (
            <div key={group.id} className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-2xl transition-all group/card overflow-visible">
              <div className={`h-28 flex items-center justify-between px-10 rounded-t-[3rem] ${group.color.split(' ')[0]}`}>
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-transform">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{group.label[0]}</span>
                </div>
                {group.activeData ? (
                  <span className="px-4 py-1.5 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white rounded-full text-[10px] font-black border border-white dark:border-slate-700 shadow-sm uppercase tracking-widest">
                    {group.activeData.isFinished ? 'Cycle Fini' : `Semaine ${group.activeData.weekNum}`}
                  </span>
                ) : (
                  <span className="px-4 py-1.5 bg-white/20 dark:bg-slate-800/20 text-slate-900 dark:text-white rounded-full text-[10px] font-black uppercase tracking-widest">Libre</span>
                )}
              </div>
              
              <div className="p-10 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">{group.label}</h4>
                  
                  {group.activeData ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avancement</span>
                            <span className="text-[9px] font-black text-accent uppercase tracking-widest">{group.activeData.progress}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                          <div className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)] transition-all duration-1000" style={{ width: `${group.activeData.progress}%` }}></div>
                        </div>
                      </div>
                      <div className="min-h-[48px] p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[11px] font-black text-slate-900 dark:text-slate-200 leading-tight italic">"{group.activeData.theme}"</p>
                        {group.activeData.nextSessionName && (
                            <div className="flex items-center gap-2 text-[8px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg mt-3 border border-indigo-100 dark:border-indigo-800 w-fit uppercase tracking-widest">
                                <BookOpen size={10} /> {group.activeData.nextSessionName}
                            </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center border-2 border-dashed border-slate-50 dark:border-slate-800 rounded-[2rem] flex flex-col items-center gap-3">
                      <div className="text-slate-200 dark:text-slate-700"><Rocket size={32}/></div>
                      <button onClick={() => setView('calendar')} className="text-[10px] font-black text-slate-400 hover:text-accent uppercase tracking-widest transition-colors">Créer une planification</button>
                    </div>
                  )}
                </div>

                {group.activeData && (
                    <button 
                      onClick={() => handleLaunchSession(group)}
                      className={`mt-10 w-full py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-sm hover:scale-[1.02] active:scale-95 ${group.activeData.nextSessionId ? 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-slate-800' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                    >
                      {group.activeData.nextSessionId ? <><PlayCircle size={16}/> Lancer la séance</> : <><Plus size={16}/> Préparer séance</>}
                    </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- RACCOURCIS RAPIDES --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Bibliothèque', sub: `${INITIAL_EXERCISES.length} fiches`, icon: Lightbulb, view: 'library', color: 'indigo', help: 'Retrouvez tous les exercices classiques et vos propres créations.' },
          { label: 'Effectifs', sub: `${players.length} licenciés`, icon: GraduationCap, view: 'players', color: 'emerald', help: 'Gérez les fiches techniques, le matériel et la progression de vos joueurs.' },
          { label: 'Historique', sub: 'Archives', icon: Clock, view: 'history', color: 'blue', help: 'Consultez et réutilisez vos anciennes séances d\'entraînement.' },
          { label: 'Version Pro', sub: 'Cloud & IA', icon: Trophy, view: 'subscription', color: 'slate', help: 'Débloquez la synchronisation cloud et les outils avancés de Gemini.' },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => setView(item.view as View)} 
            className={`relative p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:border-accent hover:shadow-xl transition-all flex flex-col gap-6 group text-left overflow-visible ${item.color === 'slate' ? 'bg-slate-900 text-white border-slate-800' : 'bg-white dark:bg-slate-900'}`}
          >
            <div className="absolute top-6 right-6 z-20">
              <InfoBubble content={item.help} position="top" />
            </div>
            <div className={`p-5 rounded-2xl w-fit group-hover:scale-110 transition-transform ${item.color === 'slate' ? 'bg-accent text-white shadow-lg shadow-orange-500/20' : `bg-${item.color}-50 dark:bg-${item.color}-900/30 text-${item.color}-600 dark:text-${item.color}-400`}`}>
              <item.icon size={28}/>
            </div>
            <div>
              <div className={`font-black uppercase text-xs tracking-widest mb-1 ${item.color === 'slate' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{item.label}</div>
              <div className={`text-[9px] font-black uppercase opacity-60 tracking-widest`}>{item.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});