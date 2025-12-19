
import React, { useState } from 'react';
import { CalendarDays, Plus, X, Bot, Save, Minus, Pencil, Trash2, Calendar as CalendarIcon, Edit3, Link, Check, BookOpen } from 'lucide-react';
import { GeminiButton } from './GeminiButton';
import { Cycle, CycleType, Session } from '../types';
import { CYCLE_TYPES, GROUPS } from '../constants';

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

  const handleLinkSession = (session: Session) => {
    if (!editingWeek) return;
    const { cycle, weekIndex } = editingWeek;
    
    // Create updated weeks array
    const updatedWeeks = [...cycle.weeks];
    updatedWeeks[weekIndex] = {
      ...updatedWeeks[weekIndex],
      sessionId: session.id,
      sessionName: session.name
    };

    const updatedCycle = { ...cycle, weeks: updatedWeeks };
    onUpdateCycle(updatedCycle);
    setEditingWeek(null);
  };

  const handleUnlinkSession = () => {
    if (!editingWeek) return;
    const { cycle, weekIndex } = editingWeek;

    const updatedWeeks = [...cycle.weeks];
    updatedWeeks[weekIndex] = {
        ...updatedWeeks[weekIndex],
        sessionId: undefined,
        sessionName: undefined
    };

    const updatedCycle = { ...cycle, weeks: updatedWeeks };
    onUpdateCycle(updatedCycle);
    setEditingWeek(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <CalendarDays className="text-accent"/> Planification Annuel
        </h2>
        <button 
          onClick={() => setCurrentCycle({ name: '', startDate: new Date().toISOString().split('T')[0], weeks: Array(12).fill(null).map((_, i) => ({ weekNumber: i + 1, theme: '', notes: '' })), type: 'developpement', objectives: '', group: '' })} 
          className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg"
        >
          <Plus size={18} /> Nouveau
        </button>
      </div>

      {/* MODAL SELECTION SEANCE */}
      {editingWeek && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h3 className="font-bold text-slate-800">Lier une séance</h3>
                 <button onClick={() => setEditingWeek(null)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
              </div>
              <div className="p-4">
                 <p className="text-sm text-slate-500 mb-4">Sélectionnez une séance pour la <strong>Semaine {editingWeek.weekIndex + 1}</strong> de <strong>{editingWeek.cycle.name}</strong>.</p>
                 <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {savedSessions.length === 0 && <p className="text-center text-slate-400 py-4">Aucune séance enregistrée.</p>}
                    {savedSessions.map(sess => (
                        <button 
                            key={sess.id}
                            onClick={() => handleLinkSession(sess)}
                            className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-accent hover:bg-orange-50 transition-all flex justify-between items-center group"
                        >
                            <div>
                                <div className="font-bold text-slate-800">{sess.name}</div>
                                <div className="text-xs text-slate-500">{new Date(sess.date).toLocaleDateString()}</div>
                            </div>
                            {editingWeek.cycle.weeks[editingWeek.weekIndex].sessionId === sess.id && <Check size={18} className="text-green-500"/>}
                        </button>
                    ))}
                 </div>
                 {editingWeek.cycle.weeks[editingWeek.weekIndex].sessionName && (
                     <div className="mt-4 pt-4 border-t border-slate-100">
                         <button onClick={handleUnlinkSession} className="w-full py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition">Détacher la séance actuelle</button>
                     </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {currentCycle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{(currentCycle as any).id ? 'Modifier le Cycle' : 'Nouveau Cycle'}</h3>
                <p className="text-xs text-slate-500 mt-1">Définissez les objectifs et la progression.</p>
              </div>
              <button onClick={() => setCurrentCycle(null)} className="p-2 hover:bg-slate-100 rounded-full transition">
                <X size={20} className="text-slate-400 hover:text-slate-600"/>
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/30 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                <div className="md:col-span-8">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nom du Cycle</label>
                  <input type="text" className="w-full p-4 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-accent outline-none shadow-sm text-lg font-medium" placeholder="Ex: Phase 1 - Reprise" value={currentCycle.name} onChange={(e) => setCurrentCycle({...currentCycle, name: e.target.value})} />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Groupe Cible</label>
                  <select 
                    value={(currentCycle as any).group || ''} 
                    onChange={(e) => setCurrentCycle({...currentCycle, group: e.target.value})} 
                    className="w-full p-4 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-accent outline-none shadow-sm font-medium"
                  >
                    <option value="">-- Tous --</option>
                    {GROUPS.map(g => (<option key={g.id} value={g.id}>{g.label}</option>))}
                  </select>
                </div>
                <div className="md:col-span-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                  <select value={(currentCycle as any).type || 'developpement'} onChange={(e) => setCurrentCycle({...currentCycle, type: e.target.value as CycleType})} className="w-full p-4 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-accent outline-none shadow-sm font-medium">
                    {Object.entries(CYCLE_TYPES).map(([key, val]) => (<option key={key} value={key}>{val.icon} {val.label}</option>))}
                  </select>
                </div>
                <div className="md:col-span-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Début</label>
                  <input ref={dateInputRef} type="date" className="w-full p-4 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-accent outline-none shadow-sm font-medium cursor-pointer" value={currentCycle.startDate} onClick={showCalendarPicker} onChange={(e) => setCurrentCycle({...currentCycle, startDate: e.target.value})} />
                </div>
                <div className="md:col-span-12">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Objectifs Globaux</label>
                  <textarea className="w-full p-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-accent outline-none resize-none shadow-sm" rows={2} placeholder="Quels sont les buts principaux de cette période ?" value={(currentCycle as any).objectives || ''} onChange={(e) => setCurrentCycle({...currentCycle, objectives: e.target.value})}></textarea>
                </div>
              </div>

              <div className="mb-8 bg-indigo-50 p-5 rounded-xl border border-indigo-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-4 items-center">
                  <div className="bg-white p-3 rounded-lg shadow-sm text-indigo-600"><Bot size={24}/></div>
                  <div>
                    <h4 className="font-bold text-indigo-900">Assistant IA</h4>
                    <p className="text-sm text-indigo-700/80">Générez automatiquement une progression sur {currentCycle.weeks.length} semaines.</p>
                  </div>
                </div>
                <GeminiButton onClick={handleGenerateCycle} isLoading={isLoadingAI}>Générer le plan</GeminiButton>
              </div>

              <div className="space-y-4">
                {currentCycle.weeks.map((week, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group hover:border-accent/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">{week.weekNumber}</div>
                      <h4 className="font-bold text-slate-700 text-lg">Semaine {week.weekNumber}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Thème Technique</label>
                        <div className="relative">
                          <input type="text" placeholder="Ex: Topspin Revers" value={week.theme} onChange={(e) => {const newWeeks = [...currentCycle.weeks]; newWeeks[idx] = { ...newWeeks[idx], theme: e.target.value }; setCurrentCycle({...currentCycle, weeks: newWeeks});}} className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"/>
                          <Edit3 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Notes & Objectifs</label>
                        <textarea placeholder="Points clés à travailler..." value={week.notes} onChange={(e) => {const newWeeks = [...currentCycle.weeks]; newWeeks[idx] = { ...newWeeks[idx], notes: e.target.value }; setCurrentCycle({...currentCycle, weeks: newWeeks});}} rows={2} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4 mt-8 mb-4">
                <button onClick={() => setCurrentCycle(prev => prev ? {...prev, weeks: [...prev.weeks, { weekNumber: prev.weeks.length + 1, theme: '', notes: '' }]} : null)} className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 hover:border-accent hover:text-accent rounded-xl text-slate-600 font-medium transition shadow-sm">
                  <Plus size={18}/> Ajouter une semaine
                </button>
                <button onClick={() => setCurrentCycle(prev => prev && prev.weeks.length > 1 ? {...prev, weeks: prev.weeks.slice(0, -1)} : prev)} className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 hover:border-red-300 hover:text-red-500 rounded-xl text-slate-600 font-medium transition shadow-sm">
                  <Minus size={18}/> Retirer semaine
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-4">
              <button onClick={() => setCurrentCycle(null)} className="px-6 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition">Annuler</button>
              <button onClick={saveCycle} className="px-8 py-3 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-slate-800 transition font-bold flex items-center gap-2 transform hover:scale-105 active:scale-95">
                <Save size={20}/> Enregistrer le cycle
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {cycles.map(cycle => { 
          const cycleTypeConfig = CYCLE_TYPES[(cycle as any).type || 'developpement']; 
          return (
            <div key={cycle.id} className="relative animate-fade-in">
              <div className={`absolute -left-[29px] top-6 w-6 h-6 rounded-full border-4 border-white shadow-sm ${cycleTypeConfig.color.split(' ')[0]} z-10`}></div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
                <div className={`p-4 border-b border-slate-100 flex flex-wrap gap-4 justify-between items-start ${cycleTypeConfig.color.replace('text-', 'bg-').replace('800', '50')}`}>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-xl`}>{cycleTypeConfig.icon}</span>
                      <h3 className="text-lg font-bold text-slate-800">{cycle.name}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium flex-wrap">
                      <span className="flex items-center gap-1"><CalendarIcon size={12}/> {new Date(cycle.startDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{cycle.weeks.length} semaines</span>
                      <span className={`px-2 py-0.5 rounded-full ${cycleTypeConfig.color}`}>{cycleTypeConfig.label}</span>
                      {cycle.group && (() => {
                          const grp = GROUPS.find(g => g.id === cycle.group);
                          return grp ? <span className={`px-2 py-0.5 rounded-full ${grp.color} text-xs ml-2 border`}>{grp.label}</span> : null;
                      })()}
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setCurrentCycle(cycle)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Pencil size={18}/></button>
                    <button onClick={() => setCycleToDelete(cycle.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18}/></button>
                  </div>
                </div>
                {cycle.objectives && (<div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100 text-sm text-slate-600 italic">"{cycle.objectives}"</div>)}
                <div className="p-4">
                  {/* GRID SYSTEM: 6 WEEKS PER LINE */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {cycle.weeks.map((week, i) => (
                      <div 
                        key={i} 
                        onClick={() => setEditingWeek({cycle, weekIndex: i})}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col h-28 justify-between hover:border-accent hover:bg-white hover:shadow-sm cursor-pointer transition-all relative group/week"
                      >
                        <div className="absolute top-2 right-2 text-slate-300 group-hover/week:text-accent transition-colors">
                            <Link size={14} />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sem {week.weekNumber}</span>
                          {week.theme && <div className={`w-1.5 h-1.5 rounded-full ${cycleTypeConfig.color.split(' ')[0].replace('bg-', 'bg-').replace('100', '500')}`}></div>}
                        </div>
                        <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-tight" title={week.theme}>{week.theme || 'Non défini'}</p>
                        
                        {week.sessionName ? (
                            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded border border-orange-200 truncate">
                                <BookOpen size={10} /> <span className="truncate">{week.sessionName}</span>
                            </div>
                        ) : (
                            week.notes && <div className="h-1 w-8 bg-slate-200 rounded-full mt-1"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ); 
        })}
      </div>
    </div>
  );
});
