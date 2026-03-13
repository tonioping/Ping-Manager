import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Sparkles, ChevronRight, Target, LayoutGrid, Link as LinkIcon, X, Umbrella, Palmtree, Check, Edit3 } from 'lucide-react';
import { Cycle, CycleType, Session } from '../types';
import { CYCLE_TYPES, GROUPS } from '../constants';
import { getSeasonWeeks, isZoneAHoliday, getMonthName } from '../utils/dateHelper';

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
  savedSessions,
  onUpdateCycle
}) => {
  const [quickEditWeek, setQuickEditWeek] = useState<{ cycleId: number, weekIdx: number } | null>(null);

  const startNewCycle = () => {
    const startYear = new Date().getMonth() >= 8 ? new Date().getFullYear() : new Date().getFullYear() - 1;
    const startDate = `${startYear}-09-01`;
    const seasonWeeks = getSeasonWeeks(startDate);
    
    setCurrentCycle({
      name: `Saison ${startYear}-${startYear + 1}`,
      startDate: startDate,
      type: 'developpement',
      objectives: '',
      group: '',
      weeks: seasonWeeks.map((date, i) => ({ 
        weekNumber: i + 1, 
        theme: '', 
        notes: '', 
        sessions: [],
        date: date.toISOString()
      }))
    });
  };

  const addSessionToWeek = (weekIdx: number, sessionId: number, cycleToUpdate?: any) => {
    const session = savedSessions.find(s => s.id === sessionId);
    if (!session) return;

    const target = cycleToUpdate || currentCycle;
    const newWeeks = [...target.weeks];
    const week = newWeeks[weekIdx];
    const sessions = week.sessions || [];
    
    if (!sessions.find((s: any) => s.id === sessionId)) {
      newWeeks[weekIdx].sessions = [...sessions, { id: session.id, name: session.name }];
      const updated = { ...target, weeks: newWeeks };
      if (cycleToUpdate) {
        onUpdateCycle(updated);
      } else {
        setCurrentCycle(updated);
      }
    }
  };

  const removeSessionFromWeek = (weekIdx: number, sessionId: number, cycleToUpdate?: any) => {
    const target = cycleToUpdate || currentCycle;
    const newWeeks = [...target.weeks];
    newWeeks[weekIdx].sessions = (newWeeks[weekIdx].sessions || []).filter((s: any) => s.id !== sessionId);
    const updated = { ...target, weeks: newWeeks };
    if (cycleToUpdate) {
      onUpdateCycle(updated);
    } else {
      setCurrentCycle(updated);
    }
  };

  const updateWeekTheme = (weekIdx: number, theme: string, cycleToUpdate?: any) => {
    const target = cycleToUpdate || currentCycle;
    const newWeeks = [...target.weeks];
    newWeeks[weekIdx].theme = theme;
    const updated = { ...target, weeks: newWeeks };
    if (cycleToUpdate) {
      onUpdateCycle(updated);
    } else {
      setCurrentCycle(updated);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      {!currentCycle ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter dark:text-white">Planification Annuelle</h2>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">Septembre - Juillet</span>
            </div>
            <button onClick={startNewCycle} className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs tracking-widest uppercase flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
              <Plus size={18}/> Nouvelle Saison
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
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={14}/> Saison {new Date(cycle.startDate).getFullYear()}
                        </p>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{cycle.name}</h3>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setCurrentCycle(cycle)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest"><Edit3 size={18}/> Configurer</button>
                    <button onClick={() => setCycleToDelete(cycle.id!)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-red-500 rounded-xl transition-all"><Trash2 size={20}/></button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                    {cycle.weeks.map((week: any, idx: number) => {
                        const weekDate = new Date(week.date || new Date(new Date(cycle.startDate).getTime() + idx * 7 * 24 * 60 * 60 * 1000));
                        const holiday = isZoneAHoliday(weekDate);
                        
                        return (
                            <div 
                              key={idx} 
                              onClick={() => setQuickEditWeek({ cycleId: cycle.id!, weekIdx: idx })}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer hover:scale-105 active:scale-95 relative group/week ${holiday ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800' : week?.theme ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 border-dashed'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                  <div className={`text-[9px] font-black uppercase tracking-widest ${holiday ? 'text-amber-500' : week?.theme ? 'text-accent' : 'text-slate-300'}`}>S{idx + 1}</div>
                                  {holiday ? <Umbrella size={10} className="text-amber-400" /> : <Plus size={10} className="text-slate-300 opacity-0 group-hover/week:opacity-100 transition-opacity" />}
                                </div>
                                <div className={`text-[10px] font-bold truncate ${holiday ? 'text-amber-600' : week?.theme ? 'text-white dark:text-slate-900' : 'text-slate-300'}`}>
                                    {holiday ? 'VACANCES' : week?.theme || 'Libre'}
                                </div>
                                <div className="text-[8px] font-bold text-slate-400 uppercase mt-1">
                                  {weekDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
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
                <h3 className="text-2xl font-black uppercase italic tracking-tighter dark:text-white">Configuration Saisonnière</h3>
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

          <div className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nom de la saison</label>
                <input type="text" value={currentCycle.name} onChange={e => setCurrentCycle({...currentCycle, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" placeholder="Ex: Saison 2024-2025"/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Groupe</label>
                <select value={currentCycle.group || ''} onChange={e => setCurrentCycle({...currentCycle, group: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white">
                  <option value="">Tous les groupes</option>
                  {GROUPS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Date de début</label>
                <input type="date" value={currentCycle.startDate} onChange={e => {
                  const newWeeks = getSeasonWeeks(e.target.value).map((date, i) => ({
                    weekNumber: i + 1,
                    theme: currentCycle.weeks[i]?.theme || '',
                    notes: currentCycle.weeks[i]?.notes || '',
                    sessions: currentCycle.weeks[i]?.sessions || [],
                    date: date.toISOString()
                  }));
                  setCurrentCycle({...currentCycle, startDate: e.target.value, weeks: newWeeks});
                }} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white"/>
              </div>
              <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-[2rem] border border-amber-100 dark:border-amber-800">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-[10px] uppercase tracking-widest mb-2">
                  <Umbrella size={14}/> Zone A (Saint-Loubès)
                </div>
                <p className="text-[9px] text-amber-700 dark:text-amber-500 font-bold leading-relaxed">Les vacances scolaires sont automatiquement marquées pour vous aider à planifier vos stages ou repos.</p>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Calendrier de la saison</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {currentCycle.weeks.map((week: any, idx: number) => {
                  const weekDate = new Date(week.date);
                  const holiday = isZoneAHoliday(weekDate);
                  return (
                    <div key={idx} className={`p-5 rounded-[2rem] flex flex-col gap-4 border transition-all ${holiday ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-black shadow-sm text-xs ${holiday ? 'bg-amber-500 text-white' : 'bg-white dark:bg-slate-900 text-accent'}`}>S{week.weekNumber}</div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{weekDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                            <span className="text-[8px] font-black text-slate-500 uppercase">{getMonthName(weekDate)}</span>
                          </div>
                        </div>
                        {holiday && <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-lg text-[8px] font-black uppercase tracking-widest">{holiday.name}</span>}
                      </div>
                      <div className="space-y-3">
                        <input 
                          type="text" 
                          value={week.theme} 
                          onChange={e => updateWeekTheme(idx, e.target.value)}
                          placeholder={holiday ? "Stage / Repos..." : "Thème technique..."}
                          className="w-full bg-transparent border-none font-black uppercase tracking-tighter text-slate-900 dark:text-white outline-none text-sm"
                        />
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {(week.sessions || []).map((s: any) => (
                              <div key={s.id} className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-900 rounded-lg text-[9px] font-bold dark:text-white border border-slate-100 dark:border-slate-700">
                                <span className="truncate max-w-[80px]">{s.name}</span>
                                <button onClick={() => removeSessionFromWeek(idx, s.id)} className="text-slate-400 hover:text-red-500"><X size={10}/></button>
                              </div>
                            ))}
                          </div>
                          <select 
                            value="" 
                            onChange={e => addSessionToWeek(idx, parseInt(e.target.value))}
                            className="w-full p-2 bg-white dark:bg-slate-900 border-none rounded-xl text-[10px] font-bold dark:text-white outline-none"
                          >
                            <option value="">+ Séance</option>
                            {savedSessions.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL D'ÉDITION RAPIDE */}
      {quickEditWeek && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 dark:border-slate-800">
            {(() => {
              const cycle = cycles.find(c => c.id === quickEditWeek.cycleId);
              const week = cycle?.weeks[quickEditWeek.weekIdx];
              const weekDate = week ? new Date(week.date) : new Date();
              const holiday = isZoneAHoliday(weekDate);
              
              return (
                <>
                  <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-black shadow-lg">S{quickEditWeek.weekIdx + 1}</div>
                      <div>
                        <h3 className="text-lg font-black uppercase italic tracking-tighter dark:text-white">{weekDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cycle?.name}</p>
                      </div>
                    </div>
                    <button onClick={() => setQuickEditWeek(null)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"><X size={20} className="text-slate-400"/></button>
                  </div>
                  
                  <div className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Thème de la semaine</label>
                      <input 
                        type="text" 
                        autoFocus
                        value={week?.theme || ''} 
                        onChange={e => updateWeekTheme(quickEditWeek.weekIdx, e.target.value, cycle)}
                        placeholder={holiday ? "Stage / Repos..." : "Ex: Topspin CD..."}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-accent/20"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Séances liées</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(week?.sessions || []).map((s: any) => (
                          <div key={s.id} className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold dark:text-white">
                            {s.name}
                            <button onClick={() => removeSessionFromWeek(quickEditWeek.weekIdx, s.id, cycle)} className="text-slate-400 hover:text-red-500"><X size={14}/></button>
                          </div>
                        ))}
                      </div>
                      <select 
                        value="" 
                        onChange={e => addSessionToWeek(quickEditWeek.weekIdx, parseInt(e.target.value), cycle)}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-accent/20"
                      >
                        <option value="">+ Ajouter une séance</option>
                        {savedSessions.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50/30 dark:bg-slate-800/30 border-t border-slate-50 dark:border-slate-800 flex justify-center">
                    <button onClick={() => setQuickEditWeek(null)} className="px-10 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-black text-[10px] tracking-widest uppercase shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                      <Check size={16}/> Terminer
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};