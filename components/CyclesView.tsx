import React, { useState } from 'react';
import { CalendarDays, Plus, X, Bot, Save, Minus, Pencil, Trash2, Calendar as CalendarIcon, Edit3, Link, Check, BookOpen } from 'lucide-react';
import { GeminiButton } from './GeminiButton';
import { Cycle, CycleType, Session } from '../types';
import { CYCLE_TYPES, GROUPS } from '../constants';
import { InfoBubble } from './InfoBubble';

interface CyclesViewProps {
  cycles: Cycle[];
  currentCycle: Cycle | Omit<Cycle, 'id'> | null;
  setCurrentCycle: React.Dispatch<React.SetStateAction<Cycle | Omit<Cycle, 'id'> | null>>;
  saveCycle: () => void;
  setCycleToDelete: (id: number) => void;
  handleGenerateCycle: () => void;
  isLoadingAI: boolean;
  dateInputRef: React.RefObject<HTMLInputElement>;
  showCalendarPicker: () => void;
  savedSessions: Session[];
  onUpdateCycle: (cycle: Cycle) => void;
}

export const CyclesView: React.FC<CyclesViewProps> = React.memo(({
  cycles,
  currentCycle,
  setCurrentCycle,
  saveCycle,
  setCycleToDelete,
  handleGenerateCycle,
  isLoadingAI,
  dateInputRef,
  showCalendarPicker,
  savedSessions,
  onUpdateCycle
}) => {
  const [editingWeek, setEditingWeek] = useState<{cycle: Cycle, weekIndex: number} | null>(null);
  const [editingCycleTitleId, setEditingCycleTitleId] = useState<number | null>(null);
  const [editingWeekTheme, setEditingWeekTheme] = useState<{cycleId: number, weekIdx: number, val: string} | null>(null);

  const handleLinkSession = (session: Session) => {
    if (!editingWeek) return;
    const { cycle, weekIndex } = editingWeek;
    const updatedWeeks = [...cycle.weeks];
    updatedWeeks[weekIndex] = { ...updatedWeeks[weekIndex], sessionId: session.id, sessionName: session.name };
    onUpdateCycle({ ...cycle, weeks: updatedWeeks });
    setEditingWeek(null);
  };

  const handleUnlinkSession = () => {
    if (!editingWeek) return;
    const { cycle, weekIndex } = editingWeek;
    const updatedWeeks = [...cycle.weeks];
    updatedWeeks[weekIndex] = { ...updatedWeeks[weekIndex], sessionId: undefined, sessionName: undefined };
    onUpdateCycle({ ...cycle, weeks: updatedWeeks });
    setEditingWeek(null);
  };

  const saveInlineCycleName = (cycle: Cycle, newName: string) => {
    if (newName.trim() && newName !== cycle.name) onUpdateCycle({ ...cycle, name: newName.trim() });
    setEditingCycleTitleId(null);
  };

  const saveInlineWeekTheme = (cycle: Cycle) => {
    if (!editingWeekTheme) return;
    const { weekIdx, val } = editingWeekTheme;
    if (val !== cycle.weeks[weekIdx].theme) {
        const updatedWeeks = [...cycle.weeks];
        updatedWeeks[weekIdx] = { ...updatedWeeks[weekIdx], theme: val.trim() };
        onUpdateCycle({ ...cycle, weeks: updatedWeeks });
    }
    setEditingWeekTheme(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <CalendarDays className="text-accent"/> Planification Annuelle
          </h2>
          <InfoBubble content="Créez des cycles d'entraînement pour structurer la progression de vos groupes." />
        </div>
        <button 
          onClick={() => setCurrentCycle({ 
            name: '', 
            startDate: new Date().toISOString().split('T')[0], 
            weeks: Array(12).fill(null).map((_, i) => ({ weekNumber: i + 1, theme: '', notes: '' })), 
            type: 'developpement', 
            objectives: '', 
            group: '' 
          })} 
          className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:bg-slate-800 transition"
        >
          <Plus size={18} /> Nouveau Cycle
        </button>
      </div>

      {editingWeek && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
                 <h3 className="font-bold text-slate-800 dark:text-white">Lier une séance</h3>
                 <button onClick={() => setEditingWeek(null)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
              </div>
              <div className="p-4">
                 <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {savedSessions.map(sess => (
                        <button key={sess.id} onClick={() => handleLinkSession(sess)} className="w-full text-left p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-accent hover:bg-orange-50 dark:hover:bg-slate-800 transition-all flex justify-between items-center group">
                            <div><div className="font-bold text-slate-800 dark:text-white">{sess.name}</div></div>
                            {editingWeek.cycle.weeks[editingWeek.weekIndex].sessionId === sess.id && <Check size={18} className="text-green-500"/>}
                        </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {currentCycle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{(currentCycle as any).id ? 'Modifier le Cycle' : 'Nouveau Cycle'}</h3>
              <button onClick={() => setCurrentCycle(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-950/30 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                <div className="md:col-span-8">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nom du Cycle</label>
                  <input type="text" className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-accent outline-none shadow-sm text-lg font-medium" placeholder="Ex: Phase 1 - Reprise" value={currentCycle.name} onChange={(e) => setCurrentCycle(prev => prev ? {...prev, name: e.target.value} : null)} />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Groupe Cible</label>
                  <select value={(currentCycle as any).group || ''} onChange={(e) => setCurrentCycle(prev => prev ? {...prev, group: e.target.value} : null)} className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-accent outline-none shadow-sm font-medium">
                    <option value="">-- Tous --</option>
                    {GROUPS.map(g => (<option key={g.id} value={g.id}>{g.label}</option>))}
                  </select>
                </div>
              </div>

              <div className="mb-8 bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-4 items-center">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm text-indigo-600 dark:text-indigo-400"><Bot size={24}/></div>
                  <div>
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">Assistant IA</h4>
                    <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80">Générez automatiquement une progression sur {currentCycle.weeks.length} semaines.</p>
                  </div>
                </div>
                <GeminiButton onClick={handleGenerateCycle} isLoading={isLoadingAI}>Générer le plan</GeminiButton>
              </div>

              <div className="space-y-4">
                {currentCycle.weeks.map((week, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group hover:border-accent/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">{week.weekNumber}</div>
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 text-lg">Semaine {week.weekNumber}</h4>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Thème Technique</label>
                        <input type="text" placeholder="Ex: Topspin Revers" value={week.theme} onChange={(e) => {const newWeeks = [...currentCycle.weeks]; newWeeks[idx] = { ...newWeeks[idx], theme: e.target.value }; setCurrentCycle(prev => prev ? {...prev, weeks: newWeeks} : null);}} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-accent/20 transition-all"/>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Notes & Objectifs</label>
                        <textarea placeholder="Points clés..." value={week.notes} onChange={(e) => {const newWeeks = [...currentCycle.weeks]; newWeeks[idx] = { ...newWeeks[idx], notes: e.target.value }; setCurrentCycle(prev => prev ? {...prev, weeks: newWeeks} : null);}} rows={2} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-accent/20 transition-all resize-none"/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-4">
              <button onClick={() => setCurrentCycle(null)} className="px-6 py-3 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition">Annuler</button>
              <button onClick={saveCycle} className="px-8 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl shadow-lg hover:bg-slate-800 transition font-bold flex items-center gap-2 transform hover:scale-105 active:scale-95"><Save size={20}/> Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {cycles.map(cycle => { 
          const cycleTypeConfig = CYCLE_TYPES[(cycle as any).type || 'developpement']; 
          return (
            <div key={cycle.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all group">
                <div className={`p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 justify-between items-start ${cycleTypeConfig.color.replace('text-', 'bg-').replace('800', '50')}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-xl`}>{cycleTypeConfig.icon}</span>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">{cycle.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {cycle.weeks.map((week, i) => (
                      <div key={i} onClick={() => setEditingWeek({cycle, weekIndex: i})} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col h-32 justify-between hover:border-accent hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm cursor-pointer transition-all relative group/week">
                        <div className="absolute top-2 right-2 text-slate-300 group-hover/week:text-accent transition-colors"><Link size={14} /></div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sem {week.weekNumber}</span>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white line-clamp-2 leading-tight">{week.theme || 'À définir'}</p>
                        {week.sessionName && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-1.5 py-0.5 rounded border border-orange-200 dark:border-orange-800 truncate"><BookOpen size={10} /> <span className="truncate">{week.sessionName}</span></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
            </div>
          ); 
        })}
      </div>
    </div>
  );
});