import React from 'react';
import { Calendar, Plus, Trash2, Sparkles, ChevronRight, Target, LayoutGrid, Link as LinkIcon, X } from 'lucide-react';
import { Cycle, CycleType, Session } from '../types';
import { CYCLE_TYPES, GROUPS } from '../constants';

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
      group: '',
      weeks: Array.from({ length: 12 }, (_, i) => ({ weekNumber: i + 1, theme: '', notes: '', sessions: [] }))
    });
  };

  const getWeekDate = (startDate: string, weekIndex: number) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (weekIndex * 7));
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const addSessionToWeek = (weekIdx: number, sessionId: number) => {
    const session = savedSessions.find(s => s.id === sessionId);
    if (!session) return;

    const newWeeks = [...currentCycle.weeks];
    const week = newWeeks[weekIdx];
    const sessions = week.sessions || [];
    
    if (!sessions.find((s: any) => s.id === sessionId)) {
      newWeeks[weekIdx].sessions = [...sessions, { id: session.id, name: session.name }];
      setCurrentCycle({ ...currentCycle, weeks: newWeeks });
    }
  };

  const removeSessionFromWeek = (weekIdx: number, sessionId: number) => {
    const newWeeks = [...currentCycle.weeks];
    newWeeks[weekIdx].sessions = (newWeeks[weekIdx].sessions || []).filter((s: any) => s.id !== sessionId);
    setCurrentCycle({ ...currentCycle, weeks: newWeeks });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {!currentCycle ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter dark:text-white">Planification Annuelle</h2>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">Format 12 Semaines</span>
            </div>
            <button onClick={startNewCycle} className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs tracking-widest uppercase flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
              <Plus size={18}/> Nouveau Cycle
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {cycles.map(cycle => (
              <div key={cycle.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${CYCLE_TYPES[cycle.type]?.color}`}>
                            {CYCLE_TYPES[cycle.type]?.label}
                        </div>
                        {cycle.group && (
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${GROUPS.find(g => g.id === cycle.group)?.color}`}>
                            {GROUPS.find(g => g.id === cycle.group)?.label}
                          </div>
                        )}
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={14}/> Début : {new Date(cycle.startDate).toLocaleDateString()}
                        </p>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{cycle.name}</h3>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setCurrentCycle(cycle)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all"><ChevronRight size={20}/></button>
                    <button onClick={() => setCycleToDelete(cycle.id!)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-red-500 rounded-xl transition-all"><Trash2 size={20}/></button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {Array.from({ length: 12 }).map((_, idx) => {
                        const week = cycle.weeks[idx];
                        const weekDate = getWeekDate(cycle.startDate, idx);
                        const weekSessions = week?.sessions || (week?.sessionId ? [{ id: week.sessionId, name: week.sessionName }] : []);
                        
                        return (
                            <div key={idx} className={`p-4 rounded-2xl border transition-all ${week?.theme ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 border-dashed'}`}>
                                <div className="flex justify-between items-start mb-1">
                                  <div className={`text-[10px] font-black uppercase tracking-widest ${week?.theme ? 'text-accent' : 'text-slate-300'}`}>S{idx + 1}</div>
                                  <div className="text-[8px] font-bold text-slate-400 uppercase">{weekDate}</div>
                                </div>
                                <div className={`text-[11px] font-bold truncate ${week?.theme ? 'text-white dark:text-slate-900' : 'text-slate-300'}`}>
                                    {week?.theme || 'Libre'}
                                </div>
                                <div className="mt-2 space-y-1">
                                  {weekSessions.map((s: any) => (
                                    <div key={s.id} className="flex items-center gap-1 text-[8px] font-black text-accent uppercase truncate">
                                      <LinkIcon size={8}/> {s.name}
                                    </div>
                                  ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <button onClick={() => setCurrentCycle(null)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"><ChevronRight className="rotate-180" size={20}/></button>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter dark:text-white">Configuration du Cycle</h3>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={handleGenerateCycle} disabled={isLoadingAI} className="flex-1 md:flex-none px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all disabled:opacity-50">
                <Sparkles size={18}/> {isLoadingAI ? 'Génération...' : 'IA'}
              </button>
              <button onClick={saveCycle} className="flex-1 md:flex-none px-8 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-xl hover:scale-105 transition-all">
                Enregistrer
              </button>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nom du cycle</label>
                <input type="text" value={currentCycle.name} onChange={e => setCurrentCycle({...currentCycle, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" placeholder="Ex: Préparation Championnat"/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Groupe concerné</label>
                <select value={currentCycle.group || ''} onChange={e => setCurrentCycle({...currentCycle, group: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white">
                  <option value="">Tous les groupes</option>
                  {GROUPS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Type de cycle</label>
                <select value={currentCycle.type} onChange={e => setCurrentCycle({...currentCycle, type: e.target.value as CycleType})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white">
                  {Object.values(CYCLE_TYPES).map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Date de début</label>
                <input type="date" value={currentCycle.startDate} onChange={e => setCurrentCycle({...currentCycle, startDate: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white"/>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Calendrier (12 Semaines)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {currentCycle.weeks.map((week: any, idx: number) => (
                  <div key={idx} className="p-5 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex flex-col gap-4 border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-accent shadow-sm text-xs">S{week.weekNumber}</div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getWeekDate(currentCycle.startDate, idx)}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        value={week.theme} 
                        onChange={e => {
                          const newWeeks = [...currentCycle.weeks];
                          newWeeks[idx].theme = e.target.value;
                          setCurrentCycle({...currentCycle, weeks: newWeeks});
                        }}
                        placeholder="Thème technique..."
                        className="w-full bg-transparent border-none font-black uppercase tracking-tighter text-slate-900 dark:text-white outline-none text-sm"
                      />
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Séances rattachées</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(week.sessions || []).map((s: any) => (
                            <div key={s.id} className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-900 rounded-lg text-[9px] font-bold dark:text-white border border-slate-100 dark:border-slate-700">
                              <span className="truncate max-w-[100px]">{s.name}</span>
                              <button onClick={() => removeSessionFromWeek(idx, s.id)} className="text-slate-400 hover:text-red-500"><X size={10}/></button>
                            </div>
                          ))}
                        </div>
                        <select 
                          value="" 
                          onChange={e => addSessionToWeek(idx, parseInt(e.target.value))}
                          className="w-full p-2 bg-white dark:bg-slate-900 border-none rounded-xl text-[10px] font-bold dark:text-white outline-none"
                        >
                          <option value="">Ajouter une séance...</option>
                          {savedSessions.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
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