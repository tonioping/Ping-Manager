
import React, { useMemo } from 'react';
import { 
  Plus, Users, Target, Calendar as CalendarIcon, Sparkles, 
  Clock, Zap, ChevronRight, PlayCircle, Lightbulb, Wrench, RefreshCw, Box,
  Trophy, TrendingUp, LayoutGrid, Activity, Star, BookOpen
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

// Logo stylisé pour l'accueil
const FashionLogo = () => (
  <div className="relative group cursor-pointer flex items-center justify-center">
    <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full group-hover:bg-accent/30 transition-all duration-500"></div>
    <div className="relative flex flex-col items-center">
        <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-3xl rotate-12 flex items-center justify-center shadow-2xl border-4 border-slate-900 group-hover:rotate-0 transition-transform duration-500 overflow-hidden">
                <Target size={64} className="text-slate-900 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 md:w-16 md:h-16 bg-accent rounded-2xl -rotate-12 flex items-center justify-center shadow-xl border-4 border-slate-900 group-hover:rotate-0 transition-transform duration-500">
                <Zap size={32} className="text-white fill-white" />
            </div>
        </div>
        <div className="mt-6 text-center">
            <div className="text-2xl md:text-3xl font-black text-white tracking-tighter">
                PING<span className="text-accent">MANAGER</span>
            </div>
            <div className="h-1.5 w-12 bg-accent mx-auto mt-1 rounded-full group-hover:w-24 transition-all duration-500"></div>
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
  
  // 1. CALCUL DU STATUT PAR GROUPE (PLANNING)
  const groupsStatus = useMemo(() => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      return GROUPS.map(group => {
          // Trouver le cycle le plus récent pour ce groupe
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
                      notes: "Planifiez un nouveau cycle",
                      progress: 100,
                      isFinished: true
                  };
              }
          }

          return { ...group, activeData: currentWeekData };
      });
  }, [cycles]);

  const dailyExercise = useMemo(() => {
      const today = new Date();
      const seed = today.getFullYear() * 1000 + today.getDay();
      const index = seed % INITIAL_EXERCISES.length;
      return INITIAL_EXERCISES[index];
  }, []);

  const equipmentAlerts = useMemo(() => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return players.filter(p => p.last_equipment_change && new Date(p.last_equipment_change) < sixMonthsAgo).length;
  }, [players]);

  const handleLaunchSession = (group: any) => {
    if (group.activeData?.nextSessionId) {
        const linkedSess = savedSessions.find(s => s.id === group.activeData.nextSessionId);
        if (linkedSess) {
            setCurrentSession({...linkedSess});
            setView('sessions');
            return;
        }
    }
    setCurrentSession({
        ...EMPTY_SESSION, 
        name: `${group.label} - S${group.activeData?.weekNum} - ${group.activeData?.theme || 'Entraînement'}`
    }); 
    setView('sessions');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* --- SECTION HERO / BIENVENUE --- */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl border border-slate-800">
        {/* Background elements */}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Target size={300} className="rotate-12" />
        </div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-accent/10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-black mb-6 tracking-widest uppercase animate-pulse">
                  <Star size={14} fill="currentColor" /> Coach Premium
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-tight">
                  Bonjour, <span className="bg-gradient-to-r from-accent to-orange-400 bg-clip-text text-transparent">{coachProfile.name || 'Coach'}</span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-md leading-relaxed">
                  Prêt pour une nouvelle séance ? Gérez vos joueurs et planifiez vos succès aujourd'hui.
                </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => { setCurrentSession({...EMPTY_SESSION}); setView('sessions'); }}
                className="group px-8 py-5 bg-accent hover:bg-accent-hover text-white rounded-3xl font-black flex items-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-orange-500/30"
              >
                <div className="p-1 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform duration-300">
                    <Plus size={20} />
                </div>
                Nouvelle Séance
              </button>
              <button 
                onClick={() => setView('calendar')}
                className="px-8 py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-3xl font-black flex items-center gap-3 transition-all border border-slate-700 hover:border-slate-600 shadow-xl"
              >
                <CalendarIcon size={20} className="text-accent" /> Planning
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-12">
            <FashionLogo />
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 text-center hover:bg-white/10 transition-colors">
                  <div className="text-accent flex justify-center mb-2"><Users size={24}/></div>
                  <div className="text-2xl font-black text-white">{players.length}</div>
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Joueurs</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 text-center hover:bg-white/10 transition-colors">
                  <div className="text-blue-400 flex justify-center mb-2"><Activity size={24}/></div>
                  <div className="text-2xl font-black text-white">{savedSessions.length}</div>
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Séances</div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ACTIONS RAPIDES & ALERTES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => setView('players')}
          className={`p-8 rounded-[2.5rem] border shadow-sm transition-all cursor-pointer group ${equipmentAlerts > 0 ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-100 hover:border-slate-300'}`}
        >
          <div className="flex justify-between items-start mb-6">
            <div className={`p-5 rounded-2xl ${equipmentAlerts > 0 ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' : 'bg-slate-100 text-slate-500'}`}>
              <Wrench size={28} className={equipmentAlerts > 0 ? 'animate-bounce' : ''} />
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-black text-slate-900 text-xl mb-2">Matériel</h3>
          <p className="text-sm text-slate-500 font-medium">
            {equipmentAlerts > 0 ? `${equipmentAlerts} joueurs nécessitent une révision.` : 'Tout le matériel est opérationnel.'}
          </p>
        </div>

        <div 
          onClick={() => setView('library')}
          className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:border-accent cursor-pointer transition-all group"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-5 rounded-2xl bg-indigo-500 text-white shadow-xl shadow-indigo-500/20">
              <Lightbulb size={28} />
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-black text-slate-900 text-xl mb-2">Inspiration</h3>
          <p className="text-sm text-slate-500 font-medium truncate">{dailyExercise.name}</p>
        </div>

        <div 
          onClick={() => { setCurrentSession({...EMPTY_SESSION, name: 'Séance Surprise IA'}); setView('sessions'); }}
          className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-xl hover:bg-slate-800 cursor-pointer transition-all group border border-slate-800"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-xl shadow-indigo-500/30">
              <Sparkles size={28} />
            </div>
            <ChevronRight className="text-slate-500 group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-black text-white text-xl mb-2">Assistant IA</h3>
          <p className="text-sm text-slate-400 font-medium">Générer une séance automatique.</p>
        </div>
      </div>

      {/* --- PROGRESSION DES GROUPES --- */}
      <div>
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <TrendingUp className="text-accent" /> État des Groupes
          </h2>
          <button onClick={() => setView('calendar')} className="text-xs font-black text-slate-400 hover:text-accent tracking-widest uppercase transition-colors">DÉTAILS DU PLANNING</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {groupsStatus.map((group) => (
            <div key={group.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-shadow duration-500 group/card">
              <div className={`md:w-36 flex items-center justify-center p-8 ${group.color.split(' ')[0]}`}>
                <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center shadow-xl group-hover/card:scale-110 transition-transform duration-500">
                  <span className="text-3xl font-black text-slate-900">{group.label[0]}</span>
                </div>
              </div>
              <div className="flex-1 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-2xl font-black text-slate-900">{group.label}</h4>
                    {group.activeData ? (
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${group.activeData.isFinished ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-emerald-50 text-slate-900 border-emerald-100'}`}>
                        {group.activeData.isFinished ? 'CYCLE TERMINÉ' : 'EN COURS'}
                      </span>
                    ) : (
                      <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black">À PLANIFIER</span>
                    )}
                  </div>
                  
                  {group.activeData ? (
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          <span className="truncate max-w-[200px]">{group.activeData.cycleName}</span>
                          <span className="text-accent">Semaine {group.activeData.weekNum} / {group.activeData.totalWeeks}</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50">
                          <div 
                            className="h-full bg-accent rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(249,115,22,0.4)]" 
                            style={{ width: `${group.activeData.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-slate-900 mb-1">{group.activeData.theme}</p>
                          {group.activeData.nextSessionName && (
                              <div className="flex items-center gap-2 text-[11px] font-black text-slate-900 bg-orange-100 px-3 py-1.5 rounded-2xl border border-orange-200 w-fit max-w-full shadow-sm">
                                  <BookOpen size={14} className="text-accent" />
                                  <span className="truncate">Séance : {group.activeData.nextSessionName}</span>
                              </div>
                          )}
                          <p className="text-xs text-slate-400 line-clamp-1 mt-2 font-medium italic">{group.activeData.notes}</p>
                        </div>
                        <button 
                          onClick={() => handleLaunchSession(group)}
                          className="p-4 bg-slate-900 text-white rounded-[1.5rem] hover:bg-slate-800 transition-all shadow-xl active:scale-90 flex-shrink-0 group-hover/card:bg-accent group-hover/card:rotate-6"
                        >
                          <PlayCircle size={24} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                      <p className="text-sm text-slate-400 font-bold italic mb-4">Aucune planification active.</p>
                      <button onClick={() => setView('calendar')} className="px-6 py-2 bg-white text-slate-900 text-xs font-black rounded-xl border border-slate-200 shadow-sm hover:border-accent hover:text-accent transition-all">DÉFINIR UN CYCLE</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- HISTORIQUE & JOUEURS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Clock className="text-slate-400" /> Historique récent
            </h2>
            <button onClick={() => setView('history')} className="text-xs font-black text-slate-400 hover:text-accent tracking-widest uppercase">TOUT VOIR</button>
          </div>
          
          <div className="space-y-4">
            {savedSessions.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-16 text-center border-2 border-dashed border-slate-200">
                <Box size={56} className="mx-auto text-slate-200 mb-6" />
                <p className="text-slate-400 font-black text-lg">Prêt à démarrer votre première séance ?</p>
              </div>
            ) : (
              savedSessions.slice(0, 5).map(sess => (
                <div 
                  key={sess.id} 
                  onClick={() => { setCurrentSession({...sess}); setView('sessions'); }}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-accent cursor-pointer transition-all flex items-center gap-6 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-accent transition-colors shadow-inner">
                    <span className="text-xl font-black leading-none text-slate-900">{new Date(sess.date).getDate()}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest mt-1">{new Date(sess.date).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 text-lg truncate group-hover:text-accent transition-colors">{sess.name}</h4>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold uppercase tracking-wider"><Box size={14} className="text-slate-300"/> {(Object.values(sess.exercises).flat() as Exercise[]).length} EXERCICES</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold uppercase tracking-wider"><Clock size={14} className="text-slate-300"/> {(Object.values(sess.exercises).flat() as Exercise[]).reduce((acc, ex) => acc + (ex?.duration || 0), 0)} MIN</span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-200 group-hover:text-accent group-hover:translate-x-2 transition-all" />
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Users className="text-slate-400" /> Nouveaux Joueurs
            </h2>
          </div>
          <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm space-y-6">
            {players.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-12 font-bold italic">Aucun joueur enregistré.</p>
            ) : (
              players.slice(-4).reverse().map(player => (
                <div 
                  key={player.id} 
                  onClick={() => { setCurrentPlayer(player); setView('players'); }}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 font-black text-xs shadow-inner group-hover:bg-accent group-hover:text-white transition-colors">
                    {player.first_name[0]}{player.last_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 text-sm truncate group-hover:text-accent transition-colors">{player.first_name} {player.last_name}</h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{player.level}</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-200 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              ))
            )}
            <div className="pt-4">
                <button 
                  onClick={() => { setCurrentPlayer({ id: crypto.randomUUID(), first_name: '', last_name: '', birth_date: undefined, age: undefined, level: 'Debutants' }); setView('players'); }}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all border border-slate-800 shadow-lg tracking-widest uppercase flex items-center justify-center gap-2"
                >
                  <Users size={16} /> Gérer les joueurs
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
