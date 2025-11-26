
import React from 'react';
import { 
  Plus, BookOpen, Users, ArrowRight, CalendarDays, Target, Calendar as CalendarIcon, Sparkles 
} from 'lucide-react';
import { StatCard } from './StatCard';
import { Session, Cycle, Player, CoachProfile, View } from '../types';
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
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Bonjour, {coachProfile.name || 'Coach'} 👋</h2>
          <p className="text-slate-500 mt-1">{session ? "Mode Cloud actif." : "Mode Local."}</p>
        </div>
        <button onClick={() => setView('sessions')} className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2">
          <Plus size={20} /> Nouvelle Séance
        </button>
      </div>

      {coachProfile.is_pro && (
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700 rounded-full font-bold text-xs border border-orange-200 shadow-sm">
          <Sparkles size={14} className="text-orange-500"/> COACH PRO
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Séances Créées" value={savedSessions.length} icon={BookOpen} colorClass="bg-blue-500 text-white" />
        <StatCard title="Joueurs Suivis" value={players.length} icon={Users} colorClass="bg-emerald-500 text-white" />
        <StatCard title="Cycles Actifs" value={cycles.length} icon={Target} colorClass="bg-purple-500 text-white" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Cycle */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden hover:shadow-md transition-shadow">
            {activeCycleData ? (
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-accent mb-3">
                  <CalendarDays size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">Cycle en cours</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{activeCycleData.cycle.name}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-accent">Semaine {activeCycleData.weekNum}</span>
                  <span className="text-slate-400 font-medium text-sm">/ {activeCycleData.totalWeeks}</span>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4">
                  <div className="text-xs font-bold text-orange-800 uppercase mb-1">Focus Technique</div>
                  <p className="text-lg font-semibold text-slate-800">{activeCycleData.week.theme || 'Thème libre'}</p>
                  {activeCycleData.week.notes && <p className="text-sm text-slate-600 mt-2 italic">"{activeCycleData.week.notes}"</p>}
                </div>
                <div className="flex gap-4 pt-2">
                  <button onClick={() => { setCurrentSession({...EMPTY_SESSION, name: `S${activeCycleData.weekNum} - ${activeCycleData.week.theme || 'Entraînement'}`}); setView('sessions'); }} className="text-sm font-semibold text-slate-800 hover:text-accent flex items-center gap-1">
                    <Plus size={16} /> Créer la séance
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="bg-slate-100 p-3 rounded-full mb-3 text-slate-400"><CalendarIcon size={24} /></div>
                <h3 className="text-lg font-bold text-slate-800">Aucun cycle actif</h3>
                <button onClick={() => setView('calendar')} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition mt-4">Démarrer un cycle</button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Activités Récentes</h3>
              <button onClick={() => setView('history')} className="text-sm text-accent font-medium hover:underline">Voir tout</button>
            </div>
            {savedSessions.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-400">Aucune séance récente.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedSessions.slice(-3).reverse().map(session => (
                  <div key={session.id} onClick={() => { setCurrentSession({...session}); setView('sessions'); }} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-orange-50 cursor-pointer border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-slate-400">
                        <CalendarIcon size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{session.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">{new Date(session.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Promo */}
        <div className="bg-gradient-to-br from-primary to-slate-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-3">Besoin d'inspiration ?</h3>
            <p className="text-slate-300 mb-8">L'IA est prête à vous aider.</p>
            <button onClick={() => setView('sessions')} className="w-full bg-white text-slate-900 px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
              Créer avec l'IA <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
    