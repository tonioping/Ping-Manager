import React from 'react';
import { Calendar, Plus, Trash2, Sparkles, ChevronRight, Target } from 'lucide-react';
import { Cycle, CycleType, Session } from '../types';
import { CYCLE_TYPES } from '../constants';

interface CyclesViewProps {
  cycles: Cycle[];
  currentCycle: any;
  setCurrentCycle: (cycle: any) => void;
  saveCycle: () => void;
  setCycleToDelete: (id: number) => void;
  handleGenerateCycle: () => void;
  isLoadingAI: boolean;
  dateInputRef: React.RefObject<HTMLInputElement>;
  showCalendarPicker: () => void;
  savedSessions: Session[];
  onUpdateCycle: (cycle: Cycle) => void;
}

export const CyclesView: React.FC<CyclesViewProps> = ({
  cycles,
  currentCycle,
  setCurrentCycle,
  saveCycle,
  setCycleToDelete,
  handleGenerateCycle,
  isLoadingAI,
  savedSessions
}) => {
  const startNewCycle = () => {
    setCurrentCycle({
      name: '',
      startDate: new Date().toISOString().split('T')[0],
      type: 'developpement',
      objectives: '',
      weeks: Array.from({ length: 4 }, (_, i) => ({ weekNumber: i + 1, theme: '', notes: '' }))
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {!currentCycle ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter dark:text-white">Planification Annuelle</h2>
            <button onClick={startNewCycle} className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs tracking-widest uppercase flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
              <Plus size={18}/> Nouveau Cycle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cycles.map(cycle => (
              <div key={cycle.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${CYCLE_TYPES[cycle.type]?.color}`}>
                    {CYCLE_TYPES[cycle.type]?.label}
                  </div>
                  <button onClick={() => setCycleToDelete(cycle.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18}/>
                  </button>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">{cycle.name}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Calendar size={14}/> Début : {new Date(cycle.startDate).toLocaleDateString()}
                </p>
                <div className="space-y-3">
                  {cycle.weeks.slice(0, 2).map(w => (
                    <div key={w.weekNumber} className="flex items-center gap-3 text-sm">
                      <span className="font-black text-accent">S{w.weekNumber}</span>
                      <span className="font-bold text-slate-600 dark:text-slate-400 truncate">{w.theme || 'Sans thème'}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setCurrentCycle(cycle)} className="mt-8 w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900 hover:text-white transition-all">
                  Détails du cycle
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter dark:text-white">Configuration du Cycle</h3>
            <div className="flex gap-3">
              <button onClick={handleGenerateCycle} disabled={isLoadingAI} className="px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center gap-2 hover:bg-indigo-100 transition-all disabled:opacity-50">
                <Sparkles size={18}/> {isLoadingAI ? 'Génération...' : 'Planifier avec IA'}
              </button>
              <button onClick={saveCycle} className="px-8 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-xl hover:scale-105 transition-all">
                Enregistrer
              </button>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nom du cycle / Objectif</label>
                <input type="text" value={currentCycle.name} onChange={e => setCurrentCycle({...currentCycle, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" placeholder="Ex: Préparation Championnat"/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Type de cycle</label>
                <select value={currentCycle.type} onChange={e => setCurrentCycle({...currentCycle, type: e.target.value as CycleType})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white">
                  {Object.values(CYCLE_TYPES).map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Planning Hebdomadaire</h4>
              <div className="grid gap-4">
                {currentCycle.weeks.map((week: any, idx: number) => (
                  <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex flex-col md:flex-row gap-4 items-center">
                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center font-black text-accent shadow-sm">S{week.weekNumber}</div>
                    <div className="flex-1 w-full space-y-2">
                      <input 
                        type="text" 
                        value={week.theme} 
                        onChange={e => {
                          const newWeeks = [...currentCycle.weeks];
                          newWeeks[idx].theme = e.target.value;
                          setCurrentCycle({...currentCycle, weeks: newWeeks});
                        }}
                        placeholder="Thème technique..."
                        className="w-full bg-transparent border-none font-black uppercase tracking-tighter text-slate-900 dark:text-white outline-none"
                      />
                      <input 
                        type="text" 
                        value={week.notes} 
                        onChange={e => {
                          const newWeeks = [...currentCycle.weeks];
                          newWeeks[idx].notes = e.target.value;
                          setCurrentCycle({...currentCycle, weeks: newWeeks});
                        }}
                        placeholder="Notes ou exercices clés..."
                        className="w-full bg-transparent border-none text-xs font-bold text-slate-400 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};