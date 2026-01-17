
import React, { useMemo } from 'react';
import { 
  Plus, Users, Target, Calendar as CalendarIcon, Sparkles, 
  Clock, Zap, ChevronRight, PlayCircle, Lightbulb, Wrench, RefreshCw, Box,
  Trophy, TrendingUp, LayoutGrid, Activity, Star
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
          const activeCycle = cycles.find(c => {
              if (c.group !== group.id) return false;
              if (!c.startDate) return false;
              const [y, m, d] = c.startDate.split('-').map(Number);
              const start = new Date(y, m - 1, d);
              const diffTime = now.getTime() - start.getTime();
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              return diffDays >= 0 && Math.floor(diffDays / 7) < c.weeks.length;
          });

          let currentWeekData = null;
          if (activeCycle) {
              const [y, m, d] = activeCycle.startDate.split('-').map(Number);
              const start = new Date(y, m - 1, d);
              const diffTime = now.getTime() - start.getTime();
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              const weekIdx = Math.floor(diffDays / 7);
              
              if (weekIdx < activeCycle.weeks.length) {
                  currentWeekData = {
                      cycleName: activeCycle.name,
                      weekNum: weekIdx + 1,
                      totalWeeks: activeCycle.weeks.length,
                      theme: activeCycle.weeks[weekIdx].theme,
                      notes: activeCycle.weeks[weekIdx].notes,
                      progress: Math.round(((weekIdx + 1) / activeCycle.weeks.length) * 100)
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

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* --- SECTION HERO / BIENVENUE --- */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 md:p-12 text-white shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Target size={240} className="rotate-12" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold mb-6 animate-bounce">
              <Star size={12} fill="currentColor" /> COACHING ACTIF
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
              Bonjour, <span className="bg-gradient-to-r from-accent to-orange-400 bg-clip-text text-transparent">{coachProfile.name || 'Coach'}</span> !
            </h1>
            <p className="text-slate-400 text-lg mb-8 max-w-md">
              Prêt pour une nouvelle séance ? Voici le point sur votre planification de la semaine.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => { setCurrentSession({...EMPTY_SESSION}); setView('sessions'); }}
                className="px-8 py-4 bg-accent hover:bg-accent-hover text-white rounded-2xl font-bold flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-orange-500/20"
              >
                <Plus size={20} /> Nouvelle Séance
              </button>
              <button 
                onClick={() => setView('calendar')}
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold flex items-center gap-3 transition-all border border-slate-700"
              >
                <CalendarIcon size={20} /> Planning Annuel
              </button>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <div className="text-accent mb-2"><Users size={24}/></div>
              <div className="text-2xl font-black">{players.length}</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Joueurs suivis</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <div className="text-blue-400 mb-2"><Activity size={24}/></div>
              <div className="text-2xl font-black">{savedSessions.length}</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Séances réalisées</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <div className="text-emerald-400 mb-2"><Trophy size={24}/></div>
              <div className="text-2xl font-black">{cycles.length}</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Cycles créés</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                <div className="text-purple-400 mb-2"><LayoutGrid size={24}/></div>
                <div className="text-2xl font-black">{INITIAL_EXERCISES.length}</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Bibliothèque</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION DEUX : ACTIONS RAPIDES & ALERTES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Alerte Matériel */}
        <div 
          onClick={() => setView('players')}
          className={`p-6 rounded-[2rem] border shadow-sm transition-all cursor-pointer group ${equipmentAlerts > 0 ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-100 hover:border-slate-300'}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-4 rounded-2xl ${equipmentAlerts > 0 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-100 text-slate-500'}`}>
              <Wrench size={24} className={equipmentAlerts > 0 ? 'animate-bounce' : ''} />
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-black text-slate-800 text-lg mb-1">Matériel</h3>
          <p className="text-sm text-slate-500">
            {equipmentAlerts > 0 ? `${equipmentAlerts} joueurs nécessitent une révision.` : 'Tout le matériel est opérationnel.'}
          </p>
        </div>

        {/* Exercice du jour */}
        <div 
          onClick={() => setView('library')}
          className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:border-accent cursor-pointer transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-4 rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
              <Lightbulb size={24} />
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-black text-slate-800 text-lg mb-1">Inspiration</h3>
          <p className="text-sm text-slate-500 truncate">{dailyExercise.name}</p>
        </div>

        {/* Assistant IA */}
        <div 
          onClick={() => { setCurrentSession({...EMPTY_SESSION, name: 'Séance Surprise IA'}); setView('sessions'); }}
          className="p-6 rounded-[2rem] bg-slate-900 text-white shadow-xl hover:bg-slate-800 cursor-pointer transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-indigo-500/30">
              <Sparkles size={24} />
            </div>
            <ChevronRight className="text-slate-500 group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-black text-white text-lg mb-1">Assistant IA</h3>
          <p className="text-sm text-slate-400">Générer une séance automatique.</p>
        </div>
      </div>

      {/* --- SECTION TROIS : PROGRESSION DES GROUPES --- */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <TrendingUp className="text-accent" /> État des Groupes
          </h2>
          <button onClick={() => setView('calendar')} className="text-sm font-bold text-slate-400 hover:text-accent transition-colors">VOIR TOUTE LA PLANIFICATION</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groupsStatus.map((group) => (
            <div key={group.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className={`md:w-32 flex items-center justify-center p-6 ${group.color.split(' ')[0]}`}>
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-inner">
                  <span className="text-2xl font-bold">{group.label[0]}</span>
                </div>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-black text-slate-800">{group.label}</h4>
                    {group.activeData ? (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black border border-emerald-100">CYCLE ACTIF</span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black">EN ATTENTE</span>
                    )}
                  </div>
                  
                  {group.activeData ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          <span>{group.activeData.cycleName}</span>
                          <span>{group.activeData.weekNum} / {group.activeData.totalWeeks}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent transition-all duration-1000" 
                            style={{ width: `${group.activeData.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-700 truncate">{group.activeData.theme}</p>
                          <p className="text-xs text-slate-400 line-clamp-1">{group.activeData.notes}</p>
                        </div>
                        <button 
                          onClick={() => { setCurrentSession({...EMPTY_SESSION, name: `${group.label} - S${group.activeData?.weekNum} - ${group.activeData?.theme || 'Entraînement'}`}); setView('sessions'); }}
                          className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-90"
                        >
                          <PlayCircle size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-sm text-slate-400 font-medium italic">Aucune planification pour ce groupe.</p>
                      <button onClick={() => setView('calendar')} className="mt-2 text-xs font-bold text-accent hover:underline">Définir un cycle</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECTION QUATRE : HISTORIQUE RÉCENT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <Clock className="text-slate-400" /> Dernières Séances
            </h2>
            <button onClick={() => setView('history')} className="text-xs font-bold text-slate-400 hover:text-accent">HISTORIQUE COMPLET</button>
          </div>
          
          <div className="space-y-4">
            {savedSessions.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-slate-200">
                <Box size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold">Aucune séance encore enregistrée.</p>
              </div>
            ) : (
              savedSessions.slice(0, 5).map(sess => (
                <div 
                  key={sess.id} 
                  onClick={() => { setCurrentSession({...sess}); setView('sessions'); }}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-accent cursor-pointer transition-all flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-accent transition-colors">
                    <span className="text-lg font-black leading-none">{new Date(sess.date).getDate()}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{new Date(sess.date).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 truncate">{sess.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium"><Box size={10}/> {(Object.values(sess.exercises).flat() as Exercise[]).length} exos</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium"><Clock size={10}/> {(Object.values(sess.exercises).flat() as Exercise[]).reduce((acc, ex) => acc + (ex?.duration || 0), 0)} min</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-200 group-hover:text-accent" />
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <Users className="text-slate-400" /> Récemment Ajoutés
            </h2>
          </div>
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-4">
            {players.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-8 font-medium">Aucun joueur pour le moment.</p>
            ) : (
              players.slice(-4).reverse().map(player => (
                <div 
                  key={player.id} 
                  onClick={() => { setCurrentPlayer(player); setView('players'); }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
                    {player.first_name[0]}{player.last_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-700 text-sm truncate">{player.first_name} {player.last_name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{player.level}</p>
                  </div>
                </div>
              ))
            )}
            <button 
              onClick={() => { setCurrentPlayer({ id: crypto.randomUUID(), first_name: '', last_name: '', birth_date: undefined, age: undefined, level: 'Debutants' }); setView('players'); }}
              className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors border border-dashed border-slate-200"
            >
              VOIR TOUS LES JOUEURS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
