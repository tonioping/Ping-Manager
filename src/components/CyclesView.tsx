import React, { useMemo } from 'react';
import { Calendar, Plus, Trash2, Sparkles, ChevronRight, Target, LayoutGrid, Link as LinkIcon, X, Umbrella, Palmtree } from 'lucide-react';
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
  savedSessions
}) => {
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
                    <button onClick={() => setCurrentCycle(cycle)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all"><ChevronRight size={20}/></button>
                    <button onClick={() => setCycleToDelete(cycle.id!)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-red-500 rounded-xl transition-all"><Trash2 size={20}/></button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                    {cycle.weeks.map((week: any, idx: number) => {
                        const weekDate = new Date(week.date || new Date(new Date(cycle.startDate).getTime() + idx * 7 * 24 * 60 * 60 * 1000));
                        const holiday = isZoneAHoliday(weekDate);
                        const weekSessions = week?.sessions || (week?.sessionId ? [{ id: week.sessionId, name: week.sessionName }] : []);
                        
                        return (
                            <div key={idx} className={`p-3 rounded-2xl border transition-all ${holiday ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800' : week?.theme ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 border-dashed'}`}>
                                <div className="flex justify-between items-start mb-1">
                                  <div className={`text-[9px] font-black uppercase tracking-widest ${holiday ? 'text-amber-500' : week?.theme ? 'text-accent' : 'text-slate-300'}`}>S{idx + 1}</div>
                                  {holiday && <Umbrella size={10} className="text-amber-400" />}
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
                          onChange={e => {
                            const newWeeks = [...currentCycle.weeks];
                            newWeeks[idx].theme = e.target.value;
                            setCurrentCycle({...currentCycle, weeks: newWeeks});
                          }}
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
    </div>
  );
};