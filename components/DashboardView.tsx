import React from 'react';
import { 
  Plus, BookOpen, Users, ArrowRight, CalendarDays, Target, Calendar as CalendarIcon, Sparkles, Clock, ChevronRight, TrendingUp, Activity
} from 'lucide-react';
import { Session, Cycle, Player, CoachProfile, View, Exercise } from '../types';
import { EMPTY_SESSION } from '../constants';

interface DashboardViewProps {
  coachProfile: CoachProfile;
  session: any;
  savedSessions: Session[];
  players: Player[];
  cycles: Cycle[];
  activeCycleData: any;
  setView: (view: View) => void;
  setCurrentSession: (session: Session) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = React.memo(({
  coachProfile,
  session,
  savedSessions,
  players,
  cycles,
  activeCycleData,
  setView,
  setCurrentSession
}) => {
  // Calculate some derived stats
  const totalHours = Math.round(savedSessions.reduce((acc, s) => {
    const allExercises = Object.values(s.exercises).flat() as Exercise[];
    const duration = allExercises.reduce((sum, ex) => sum + (ex?.duration || 0), 0);
    return acc + duration;
  }, 0) / 60);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
           <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Tableau de bord</div>
           <h2 className="text-3xl font-black text-slate-800 tracking-tight">
             Bonjour, {coachProfile.name || 'Coach'} 👋
           </h2>
           <p className="text-slate-500 font-medium mt-1">
             Prêt à faire progresser vos joueurs aujourd'hui ?
           </p>
        </div>
        <div className="flex gap-3">
            <button onClick={() => setView('players')} className="px-5 py-3 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
                <Users size={18} /> <span className="hidden sm:inline">Joueurs</span>
            </button>
            <button onClick={() => setView('sessions')} className="px-5 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition flex items-center gap-2 transform active:scale-95">
                <Plus size={18} /> <span className="hidden sm:inline">Nouvelle Séance</span>
            </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:border-blue-200 transition-colors group cursor-pointer" onClick={() => setView('history')}>
            <div className="flex justify-between items-start">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors"><BookOpen size={20}/></div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors"/>
            </div>
            <div>
                <div className="text-2xl font-black text-slate-800">{savedSessions.length}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Séances</div>
            </div>
         </div>

         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:border-emerald-200 transition-colors group cursor-pointer" onClick={() => setView('players')}>
            <div className="flex justify-between items-start">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Users size={20}/></div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors"/>
            </div>
            <div>
                <div className="text-2xl font-black text-slate-800">{players.length}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Joueurs</div>
            </div>
         </div>

         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:border-purple-200 transition-colors group cursor-pointer" onClick={() => setView('calendar')}>
            <div className="flex justify-between items-start">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors"><Target size={20}/></div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-purple-500 transition-colors"/>
            </div>
            <div>
                <div className="text-2xl font-black text-slate-800">{cycles.length}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Cycles</div>
            </div>
         </div>

         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Clock size={20}/></div>
            </div>
            <div>
                <div className="text-2xl font-black text-slate-800">{totalHours}h</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Volume Total</div>
            </div>
         </div>
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (2/3) */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* ACTIVE CYCLE HERO */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
                  {activeCycleData ? (
                      <div className="p-8">
                          <div className="flex justify-between items-start mb-6">
                              <div>
                                  <div className="flex items-center gap-2 text-accent mb-2">
                                      <Activity size={18} className="animate-pulse"/>
                                      <span className="text-xs font-bold uppercase tracking-wider">Cycle Actif</span>
                                  </div>
                                  <h3 className="text-2xl font-bold text-slate-800">{activeCycleData.cycle.name}</h3>
                                  <p className="text-slate-500 text-sm mt-1">{activeCycleData.cycle.objectives || 'Aucun objectif défini.'}</p>
                              </div>
                              <div className="bg-slate-50 px-4 py-2 rounded-xl text-center border border-slate-100">
                                  <div className="text-xs text-slate-400 font-bold uppercase">Semaine</div>
                                  <div className="text-2xl font-black text-slate-800">{activeCycleData.weekNum}<span className="text-sm text-slate-400 font-medium">/{activeCycleData.totalWeeks}</span></div>
                              </div>
                          </div>

                          {/* PROGRESS BAR */}
                          <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
                              <div className="bg-accent h-full rounded-full transition-all duration-1000" style={{ width: `${(activeCycleData.weekNum / activeCycleData.totalWeeks) * 100}%` }}></div>
                          </div>

                          <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                              <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-5">
                                  <Target size={150} />
                              </div>
                              <div className="relative z-10">
                                  <div className="text-slate-400 text-xs font-bold uppercase mb-2">Focus de la semaine</div>
                                  <h4 className="text-2xl font-bold mb-2">{activeCycleData.week.theme || 'Thème libre'}</h4>
                                  <p className="text-slate-300 text-sm mb-6 max-w-md italic">"{activeCycleData.week.notes || 'Pas de notes spécifiques pour cette semaine.'}"</p>
                                  
                                  <button 
                                    onClick={() => { setCurrentSession({...EMPTY_SESSION, name: `S${activeCycleData.weekNum} - ${activeCycleData.week.theme || 'Entraînement'}`}); setView('sessions'); }}
                                    className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition shadow-lg"
                                  >
                                      <Plus size={18}/> Préparer la séance
                                  </button>
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="p-12 text-center flex flex-col items-center">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                              <CalendarDays size={32} />
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2">Aucun cycle en cours</h3>
                          <p className="text-slate-500 max-w-sm mx-auto mb-6">La planification est la clé du succès. Créez un cycle d'entraînement pour structurer la progression de vos joueurs.</p>
                          <button onClick={() => setView('calendar')} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition">
                              Créer mon premier cycle
                          </button>
                      </div>
                  )}
              </div>

              {/* RECENT SESSIONS LIST */}
              <div>
                  <div className="flex justify-between items-center mb-4 px-1">
                      <h3 className="text-lg font-bold text-slate-800">Historique Récent</h3>
                      <button onClick={() => setView('history')} className="text-sm font-semibold text-accent hover:text-orange-700 transition">Tout voir</button>
                  </div>
                  <div className="space-y-3">
                      {savedSessions.length === 0 ? (
                          <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
                              Aucune séance terminée récemment.
                          </div>
                      ) : (
                          savedSessions.slice(0, 4).map(sess => (
                              <div key={sess.id} onClick={() => { setCurrentSession({...sess}); setView('sessions'); }} className="group bg-white p-4 rounded-xl border border-slate-100 hover:border-accent/30 hover:shadow-md transition-all cursor-pointer flex justify-between items-center">
                                  <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-accent transition-colors">
                                          <CalendarIcon size={18}/>
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-slate-800 group-hover:text-accent transition-colors">{sess.name}</h4>
                                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                             <span>{new Date(sess.date).toLocaleDateString()}</span>
                                             <span>•</span>
                                             <span>{(Object.values(sess.exercises).flat() as Exercise[]).reduce((acc, ex) => acc + (ex?.duration || 0), 0)} min</span>
                                          </div>
                                      </div>
                                  </div>
                                  <ChevronRight size={20} className="text-slate-300 group-hover:text-accent transition-colors" />
                              </div>
                          ))
                      )}
                  </div>
              </div>

          </div>

          {/* RIGHT COLUMN (1/3) */}
          <div className="space-y-6">
              
              {/* AI CARD */}
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-20"><Sparkles size={80}/></div>
                  <div className="relative z-10">
                      <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase mb-4 backdrop-blur-sm">Assistant Intelligent</div>
                      <h3 className="text-xl font-bold mb-2">Besoin d'inspiration ?</h3>
                      <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Laissez l'IA générer une séance complète basée sur vos objectifs en quelques secondes.</p>
                      <button onClick={() => { setCurrentSession({...EMPTY_SESSION, name: 'Séance IA'}); setView('sessions'); }} className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition flex items-center justify-center gap-2">
                          <Sparkles size={16}/> Générer Séance
                      </button>
                  </div>
              </div>

              {/* COACH STATUS */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Users size={18} className="text-slate-400"/> Status du Club
                  </h3>
                  
                  <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                          <span className="text-sm font-medium text-slate-600">Abonnement</span>
                          {coachProfile.is_pro ? (
                              <span className="text-xs font-bold bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700 px-2 py-1 rounded border border-orange-200">PRO</span>
                          ) : (
                              <button onClick={() => setView('subscription')} className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded hover:bg-slate-300 transition">Gratuit</button>
                          )}
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                          <span className="text-sm font-medium text-slate-600">Mode Synchro</span>
                          {session ? (
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Cloud</span>
                          ) : (
                              <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-400"></div> Local</span>
                          )}
                      </div>
                  </div>

                  {!coachProfile.is_pro && (
                      <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                          <p className="text-xs text-slate-400 mb-3">Passez pro pour débloquer le suivi avancé et la synchro illimitée.</p>
                          <button onClick={() => setView('subscription')} className="text-sm font-bold text-accent hover:underline">Voir les offres</button>
                      </div>
                  )}
              </div>

              {/* QUICK TIP */}
              <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-700 font-bold mb-2 text-sm">
                      <TrendingUp size={16}/> Conseil du jour
                  </div>
                  <p className="text-sm text-amber-800/80 italic leading-relaxed">
                      "Variez les situations au panier de balles pour simuler le stress du match. L'incertitude est la clé de la progression à haut niveau."
                  </p>
              </div>

          </div>
      </div>
    </div>
  );
});