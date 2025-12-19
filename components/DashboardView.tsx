
import React, { useMemo } from 'react';
import { 
  Plus, Users, ArrowRight, Target, Calendar as CalendarIcon, Sparkles, 
  Clock, TrendingUp, Activity, Zap, ChevronRight, Crown, Layout, PlayCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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
  setCurrentPlayer: (player: Player | null) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = React.memo(({
  coachProfile,
  session,
  savedSessions,
  players,
  cycles,
  activeCycleData,
  setView,
  setCurrentSession,
  setCurrentPlayer
}) => {
  
  // 1. CALCUL DES STATS
  const stats = useMemo(() => {
    const totalHours = Math.round(savedSessions.reduce((acc, s) => {
      const allExercises = Object.values(s.exercises).flat() as Exercise[];
      const duration = allExercises.reduce((sum, ex) => sum + (ex?.duration || 0), 0);
      return acc + duration;
    }, 0) / 60);

    return { totalHours };
  }, [savedSessions]);

  // 2. DONNÉES DU GRAPHIQUE (6 derniers mois)
  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = d.toLocaleDateString('fr-FR', { month: 'short' });
        const sessionsInMonth = savedSessions.filter(s => {
            const sDate = new Date(s.date);
            return sDate.getMonth() === d.getMonth() && sDate.getFullYear() === d.getFullYear();
        }).length;
        data.push({ name: monthName, sessions: sessionsInMonth });
    }
    return data;
  }, [savedSessions]);

  // Dégradé pour le graph
  const barColors = ['#e2e8f0', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#f97316'];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <div className="flex items-center gap-2 text-slate-500 font-medium mb-1 text-sm">
             <CalendarIcon size={14}/> {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
           </div>
           <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
             Bonjour, {coachProfile.name || 'Coach'} <span className="text-2xl">👋</span>
           </h2>
        </div>
        
        {/* Quick Pro Toggle Visual */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${session ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {session ? 'Cloud Sync' : 'Mode Local'}
            </div>
            <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${coachProfile.is_pro ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                {coachProfile.is_pro ? 'PRO' : 'Gratuit'}
            </div>
        </div>
      </div>

      {/* --- BENTO GRID LAYOUT --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* 1. KEY METRICS (Top Row) - Spans full width on mobile, 8 cols on desktop */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden" onClick={() => setView('sessions')}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Layout size={80}/></div>
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform"><Activity size={20}/></div>
                      <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{stats.totalHours}h Total</span>
                  </div>
                  <div className="text-3xl font-black text-slate-800 mb-1">{savedSessions.length}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Séances Réalisées</div>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden" onClick={() => setView('players')}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Users size={80}/></div>
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform"><Users size={20}/></div>
                      {players.length > 0 && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1"><TrendingUp size={12}/> Actifs</span>}
                  </div>
                  <div className="text-3xl font-black text-slate-800 mb-1">{players.length}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Joueurs Suivis</div>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden" onClick={() => setView('calendar')}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Target size={80}/></div>
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform"><Target size={20}/></div>
                      <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{cycles.length} Total</span>
                  </div>
                  <div className="text-3xl font-black text-slate-800 mb-1">{activeCycleData ? 'En cours' : 'Aucun'}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cycle Actif</div>
              </div>
          </div>

          {/* 2. ACTIVITY CHART (Top Row Right) - Spans 4 cols */}
          <div className="md:col-span-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-700 flex items-center gap-2"><TrendingUp size={16} className="text-orange-500"/> Activité (6 mois)</h3>
              </div>
              <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            cursor={{fill: '#f1f5f9'}}
                          />
                          <Bar dataKey="sessions" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={barColors[index]} />
                            ))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* 3. HERO SECTION: CURRENT FOCUS (Middle Left) - Spans 7 cols */}
          <div className="md:col-span-7 space-y-6">
              <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800 group">
                  {/* Background Accents */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                  
                  {activeCycleData ? (
                      <div className="relative z-10">
                          <div className="flex items-center gap-2 text-orange-400 font-bold mb-4 text-xs uppercase tracking-widest">
                              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                              Cycle en cours
                          </div>
                          
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                              <div>
                                  <h3 className="text-3xl font-bold mb-1 leading-tight">{activeCycleData.week.theme || 'Thème de la semaine'}</h3>
                                  <p className="text-slate-400 text-sm mb-6 max-w-md line-clamp-2">
                                      {activeCycleData.week.notes || "Aucune note spécifique. Concentrez-vous sur les fondamentaux."}
                                  </p>
                                  <div className="flex items-center gap-3">
                                      <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10">
                                          {activeCycleData.cycle.name}
                                      </div>
                                      <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10">
                                          Semaine {activeCycleData.weekNum} / {activeCycleData.totalWeeks}
                                      </div>
                                  </div>
                              </div>
                              
                              <button 
                                onClick={() => { setCurrentSession({...EMPTY_SESSION, name: `S${activeCycleData.weekNum} - ${activeCycleData.week.theme || 'Training'}`}); setView('sessions'); }}
                                className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 transform active:scale-95 whitespace-nowrap"
                              >
                                  <PlayCircle size={20} /> Préparer la séance
                              </button>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="mt-8 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-1000" style={{ width: `${(activeCycleData.weekNum / activeCycleData.totalWeeks) * 100}%` }}></div>
                          </div>
                      </div>
                  ) : (
                      <div className="relative z-10 flex flex-col items-center text-center py-4">
                          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 text-slate-300">
                              <CalendarIcon size={32} />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">Pas de cycle actif</h3>
                          <p className="text-slate-400 text-sm max-w-sm mb-6">Planifiez votre saison pour structurer la progression.</p>
                          <button onClick={() => setView('calendar')} className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-100 transition">
                              Créer un cycle
                          </button>
                      </div>
                  )}
              </div>

              {/* Recent History List */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2"><Clock size={16} className="text-slate-400"/> Historique Récent</h3>
                      <button onClick={() => setView('history')} className="text-xs font-bold text-accent hover:underline">Voir tout</button>
                  </div>
                  <div className="space-y-2">
                      {savedSessions.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 text-sm italic">Aucune séance terminée.</div>
                      ) : (
                          savedSessions.slice(0, 3).map(sess => (
                              <div key={sess.id} onClick={() => { setCurrentSession({...sess}); setView('sessions'); }} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group border border-transparent hover:border-slate-100">
                                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs group-hover:bg-white group-hover:text-accent group-hover:shadow-sm transition-all">
                                      {new Date(sess.date).getDate()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-slate-800 truncate group-hover:text-accent transition-colors">{sess.name}</h4>
                                      <p className="text-xs text-slate-500">{new Date(sess.date).toLocaleDateString()}</p>
                                  </div>
                                  <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                      {(Object.values(sess.exercises).flat() as Exercise[]).reduce((acc, ex) => acc + (ex?.duration || 0), 0)} min
                                  </div>
                                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500"/>
                              </div>
                          ))
                      )}
                  </div>
              </div>
          </div>

          {/* 4. RIGHT COLUMN: ACTIONS & AI (Middle Right) - Spans 5 cols */}
          <div className="md:col-span-5 space-y-6">
              
              {/* Quick Actions Grid */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Zap size={18} className="text-amber-500"/> Actions Rapides</h3>
                  <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => { setCurrentSession({...EMPTY_SESSION}); setView('sessions'); }} className="p-4 bg-slate-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-slate-100 transition-all text-left group">
                          <Plus size={24} className="text-blue-500 mb-2 group-hover:scale-110 transition-transform"/>
                          <div className="font-bold text-slate-700 text-sm">Nouvelle Séance</div>
                      </button>
                      <button onClick={() => { setCurrentPlayer({ id: crypto.randomUUID(), first_name: '', last_name: '', birth_date: undefined, age: undefined, level: 'Debutants' }); setView('players'); }} className="p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 border border-slate-100 transition-all text-left group">
                          <Users size={24} className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform"/>
                          <div className="font-bold text-slate-700 text-sm">Ajouter Joueur</div>
                      </button>
                      <button onClick={() => { setCurrentSession({...EMPTY_SESSION, name: 'Séance IA'}); setView('sessions'); }} className="p-4 bg-slate-50 rounded-xl hover:bg-purple-50 hover:border-purple-200 border border-slate-100 transition-all text-left group col-span-2 flex items-center justify-between">
                          <div>
                              <Sparkles size={24} className="text-purple-500 mb-1 group-hover:rotate-12 transition-transform"/>
                              <div className="font-bold text-slate-700 text-sm">Générer avec l'IA</div>
                              <div className="text-[10px] text-slate-400">Création automatique de séance</div>
                          </div>
                          <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                              <ArrowRight size={16}/>
                          </div>
                      </button>
                  </div>
              </div>

              {/* Pro / Subscription Teaser or Info */}
              {!coachProfile.is_pro && (
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><Crown size={80}/></div>
                      <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Crown size={18} className="text-yellow-400"/> Passez Pro</h3>
                      <p className="text-sm text-slate-300 mb-4 leading-relaxed">Débloquez la synchronisation cloud illimitée et les analyses avancées.</p>
                      <button onClick={() => setView('subscription')} className="w-full py-2 bg-white text-slate-900 text-sm font-bold rounded-lg hover:bg-slate-100 transition">
                          Voir les offres
                      </button>
                  </div>
              )}
              
              {/* Simple Quote/Tip */}
              <div className="p-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                   <p className="text-xs font-medium text-slate-500 italic text-center leading-relaxed">
                       "La répétition est la mère de l'apprentissage, mais la variété est le père du plaisir."
                   </p>
              </div>

          </div>

      </div>
    </div>
  );
});
