
import React, { useMemo } from 'react';
import { 
  Plus, Users, ArrowRight, Target, Calendar as CalendarIcon, Sparkles, 
  Clock, Zap, ChevronRight, PlayCircle, Lightbulb, Wrench, RefreshCw, Box
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
          // Trouver un cycle actif pour ce groupe
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
                      notes: activeCycle.weeks[weekIdx].notes
                  };
              }
          }

          return { ...group, activeData: currentWeekData };
      });
  }, [cycles]);

  // 2. LOGIQUE "NOUVEAUTÉS" & "SMART INSIGHTS"
  
  // A. Exercice du jour (Basé sur la date pour changer chaque jour mais rester fixe le même jour)
  const dailyExercise = useMemo(() => {
      const today = new Date();
      const seed = today.getFullYear() * 1000 + today.getDay(); // Simple seed
      const index = seed % INITIAL_EXERCISES.length;
      return INITIAL_EXERCISES[index];
  }, []);

  // B. Alerte Matériel (Joueurs > 6 mois sans changement)
  const equipmentAlerts = useMemo(() => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      return players.filter(p => {
          if (!p.last_equipment_change) return false;
          return new Date(p.last_equipment_change) < sixMonthsAgo;
      }).length;
  }, [players]);


  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* --- HEADER SIMPLIFIÉ --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <div className="flex items-center gap-2 text-slate-500 font-medium mb-1 text-sm">
             <CalendarIcon size={14}/> {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
           </div>
           <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
             Planning & Objectifs <span className="text-accent text-4xl">.</span>
           </h2>
        </div>
        
        {/* Status Badges */}
        <div className="flex items-center gap-2">
             {session ? (
                 <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> En ligne
                 </span>
             ) : (
                 <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold border border-slate-200">Mode Local</span>
             )}
             {coachProfile.is_pro && <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-bold">PRO</span>}
        </div>
      </div>

      {/* --- 1. SECTION PRINCIPALE : PLANNING DES GROUPES --- */}
      <div>
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Target className="text-accent" /> Cette Semaine
              </h3>
              <button onClick={() => setView('calendar')} className="text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1">
                  Gérer les cycles <ChevronRight size={14}/>
              </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {groupsStatus.map((group) => (
                  <div key={group.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group/card flex flex-col">
                      <div className={`h-2 w-full ${group.color.split(' ')[0].replace('100', '500')}`}></div>
                      <div className="p-5 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-3">
                              <h4 className={`font-black text-lg ${group.color.split(' ')[1].replace('800', '900')}`}>{group.label}</h4>
                              {group.activeData ? (
                                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">Actif</span>
                              ) : (
                                  <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2 py-1 rounded-full">--</span>
                              )}
                          </div>
                          
                          {group.activeData ? (
                              <div className="flex-1 flex flex-col">
                                  <div className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide flex items-center gap-2">
                                      <span className="bg-slate-100 px-1.5 rounded text-slate-600">S{group.activeData.weekNum}</span>
                                      <span className="truncate max-w-[150px]">{group.activeData.cycleName}</span>
                                  </div>
                                  <div className="font-bold text-slate-800 text-lg mb-2 leading-tight">
                                      {group.activeData.theme || 'Thème libre'}
                                  </div>
                                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                      {group.activeData.notes || 'Aucune consigne spécifique.'}
                                  </p>
                                  <div className="mt-auto pt-2">
                                      <button 
                                        onClick={() => { setCurrentSession({...EMPTY_SESSION, name: `${group.label} - S${group.activeData?.weekNum} - ${group.activeData?.theme || 'Entraînement'}`}); setView('sessions'); }}
                                        className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform active:scale-95"
                                      >
                                          <PlayCircle size={16} className="text-accent" /> Préparer la séance
                                      </button>
                                  </div>
                              </div>
                          ) : (
                              <div className="flex-1 flex flex-col items-center justify-center text-center py-6 opacity-60">
                                  <div className="bg-slate-100 p-3 rounded-full mb-3">
                                      <CalendarIcon size={20} className="text-slate-400"/>
                                  </div>
                                  <p className="text-xs text-slate-400 font-medium">Pas de cycle en cours.</p>
                                  <button onClick={() => setView('calendar')} className="mt-2 text-xs font-bold text-accent hover:underline">Planifier maintenant</button>
                              </div>
                          )}
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* --- 2. SECTION SECONDAIRE : LE COIN DU COACH (NOUVEAUTÉS) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLONNE GAUCHE : WIDGETS SMART (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="text-purple-500" /> Le Coin du Coach
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Widget 1: Daily Inspiration */}
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-1 shadow-lg text-white relative overflow-hidden group cursor-pointer" onClick={() => setView('library')}>
                      <div className="bg-white/10 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-0 right-0 p-4 opacity-20"><Lightbulb size={60} /></div>
                      <div className="h-full p-5 flex flex-col relative z-10">
                          <div className="flex items-center gap-2 mb-3">
                              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">Inspiration</span>
                              <span className="text-xs text-indigo-100 font-medium">Exercice du jour</span>
                          </div>
                          <h4 className="font-bold text-xl mb-1 leading-tight">{dailyExercise.name}</h4>
                          <p className="text-indigo-100 text-xs line-clamp-2 mb-4">{dailyExercise.description}</p>
                          <div className="mt-auto flex items-center gap-3 text-xs font-bold">
                              <span className="flex items-center gap-1"><Clock size={12}/> {dailyExercise.duration} min</span>
                              <span className="flex items-center gap-1"><Box size={12}/> {dailyExercise.material}</span>
                          </div>
                      </div>
                  </div>

                  {/* Widget 2: Equipment Alert */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-orange-200 transition-colors" onClick={() => setView('players')}>
                      <div className="flex justify-between items-start mb-2">
                          <div>
                              <div className="flex items-center gap-2 text-slate-500 mb-1">
                                  <Wrench size={16} className="text-slate-400"/>
                                  <span className="text-xs font-bold uppercase tracking-wider">Maintenance Matériel</span>
                              </div>
                              <div className="text-3xl font-black text-slate-800">{equipmentAlerts}</div>
                          </div>
                          <div className={`p-2 rounded-xl ${equipmentAlerts > 0 ? 'bg-orange-100 text-orange-600 animate-pulse' : 'bg-green-100 text-green-600'}`}>
                              {equipmentAlerts > 0 ? <RefreshCw size={20}/> : <Clock size={20}/>}
                          </div>
                      </div>
                      <p className="text-xs text-slate-500">
                          {equipmentAlerts > 0 
                              ? "joueurs n'ont pas changé leurs plaques depuis > 6 mois." 
                              : "Tout le matériel est à jour. Parfait !"}
                      </p>
                      {equipmentAlerts > 0 && <div className="mt-3 text-xs font-bold text-accent hover:underline cursor-pointer">Voir les joueurs concernés</div>}
                  </div>
                  
                  {/* Widget 3: Quick AI Gen */}
                  <div className="md:col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-200 border-dashed flex items-center justify-between hover:bg-white hover:border-accent hover:border-solid transition-all cursor-pointer group" onClick={() => { setCurrentSession({...EMPTY_SESSION, name: 'Séance Surprise IA'}); setView('sessions'); }}>
                       <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm group-hover:scale-110 transition-transform">
                               <Zap size={24}/>
                           </div>
                           <div>
                               <h4 className="font-bold text-slate-800 group-hover:text-purple-600 transition-colors">Panne d'inspiration ?</h4>
                               <p className="text-xs text-slate-500">Laissez l'IA générer une séance complète "Surprise" en 1 clic.</p>
                           </div>
                       </div>
                       <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                           <ChevronRight size={18}/>
                       </div>
                  </div>
              </div>
          </div>

          {/* COLONNE DROITE : ACTIONS & HISTORIQUE (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
              {/* Actions Rapides */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide text-slate-400">Raccourcis</h3>
                  <div className="space-y-3">
                      <button onClick={() => { setCurrentSession({...EMPTY_SESSION}); setView('sessions'); }} className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl transition font-bold text-sm group">
                          <div className="p-2 bg-white rounded-lg text-blue-500 shadow-sm group-hover:scale-110 transition-transform"><Plus size={16}/></div>
                          Nouvelle Séance
                      </button>
                      <button onClick={() => { setCurrentPlayer({ id: crypto.randomUUID(), first_name: '', last_name: '', birth_date: undefined, age: undefined, level: 'Debutants' }); setView('players'); }} className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl transition font-bold text-sm group">
                          <div className="p-2 bg-white rounded-lg text-emerald-500 shadow-sm group-hover:scale-110 transition-transform"><Users size={16}/></div>
                          Ajouter un Joueur
                      </button>
                  </div>
              </div>

               {/* Historique Rapide */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2"><Clock size={16} className="text-slate-400"/> Historique</h3>
                      <button onClick={() => setView('history')} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wide">Voir tout</button>
                  </div>
                  <div className="space-y-2 relative">
                      {/* Vertical Line */}
                      <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                      
                      {savedSessions.length === 0 ? (
                          <div className="text-center py-4 text-slate-400 text-xs italic">Aucune séance terminée.</div>
                      ) : (
                          savedSessions.slice(0, 3).map(sess => (
                              <div key={sess.id} onClick={() => { setCurrentSession({...sess}); setView('sessions'); }} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group relative z-10">
                                  <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-slate-500 font-bold text-[10px] group-hover:border-accent group-hover:text-accent transition-colors shadow-sm">
                                      {new Date(sess.date).getDate()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-slate-700 text-sm truncate group-hover:text-slate-900">{sess.name}</h4>
                                      <p className="text-[10px] text-slate-400 truncate">
                                          {(Object.values(sess.exercises).flat() as Exercise[]).length} exercices • {(Object.values(sess.exercises).flat() as Exercise[]).reduce((acc, ex) => acc + (ex?.duration || 0), 0)} min
                                      </p>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
});
