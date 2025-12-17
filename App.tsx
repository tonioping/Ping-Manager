
import React, { useState, useMemo, Suspense, useRef, useCallback } from 'react';
import { Loader2, Plus, Box, Search, Filter } from 'lucide-react';

import { useAppData } from './hooks/useAppData';
import { Sidebar } from './components/Sidebar'; 
import Auth from './components/Auth';

// Views
const DashboardView = React.lazy(() => import('./components/DashboardView').then(m => ({ default: m.DashboardView })));
const CyclesView = React.lazy(() => import('./components/CyclesView').then(m => ({ default: m.CyclesView })));
const SessionsView = React.lazy(() => import('./components/SessionsView').then(m => ({ default: m.SessionsView })));
const PlayersView = React.lazy(() => import('./components/PlayersView').then(m => ({ default: m.PlayersView })));

import { View, Session, Cycle, Player, Exercise, PhaseId, AIConfig } from './types';
import { EMPTY_SESSION, PHASES } from './constants';
import { refineExerciseDescription, suggestExercises, generateCyclePlan, type SuggestedExercise } from './services/geminiService';
import { GeminiButton } from './components/GeminiButton';

const SimpleToast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <div className={`fixed top-4 right-4 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in border ${type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
    <span className="font-black text-sm uppercase tracking-tight">{message}</span>
    <button onClick={onClose} className="hover:scale-110 transition-transform">×</button>
  </div>
);

export default function App() {
  const { user, loading, data, actions } = useAppData();
  
  // UI State
  const [view, setView] = useState<View>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  // Feature State
  const [currentSession, setCurrentSession] = useState<Session>({...EMPTY_SESSION});
  const [currentCycle, setCurrentCycle] = useState<Cycle | Omit<Cycle, 'id'> | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [newPlayerMode, setNewPlayerMode] = useState(false);
  const [newExercise, setNewExercise] = useState<Omit<Exercise, 'id'> | null>(null);
  
  // Library Filtering
  const [libSearch, setLibSearch] = useState('');
  const [libFilterPanier, setLibFilterPanier] = useState(false);

  const [aiConfig] = useState<AIConfig>({ provider: 'google', apiKey: '', model: 'gemini-3-flash-preview' });
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [suggestedExercises, setSuggestedExercises] = useState<SuggestedExercise[]>([]);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  
  const dateInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSaveSession = async () => {
    if (!currentSession.name.trim()) return showToast("Nom requis", "error");
    await actions.saveSession(currentSession);
    showToast("Séance sauvegardée");
  };

  const handleSaveCycle = async () => {
    if (!currentCycle || !currentCycle.name) return showToast("Nom requis", "error");
    const cycleToSave = { ...currentCycle, id: (currentCycle as any).id || Date.now() } as Cycle;
    await actions.saveCycle(cycleToSave);
    setCurrentCycle(null);
    showToast("Cycle sauvegardé");
  };

  const handleUpdateCycle = async (updated: Cycle) => {
      await actions.saveCycle(updated);
  };

  const handleSavePlayer = async (player: Player) => {
    await actions.savePlayer(player);
    setNewPlayerMode(false);
    setCurrentPlayer(null);
    showToast("Joueur enregistré");
  };

  const handleSaveProfile = async () => {
    await actions.saveProfile(data.coachProfile);
    showToast("Profil mis à jour");
  };
  
  const handleSuggestExercises = async () => { 
      if (!currentSession.name) return showToast("Nommez la séance d'abord !", 'error'); 
      setIsLoadingAI(true); 
      try { 
        const allExercises = Object.values(currentSession.exercises).flat().filter(e => e) as Exercise[]; 
        const suggestions = await suggestExercises(currentSession.name, allExercises.map(e => e.name)); 
        if (suggestions.length) { 
            setSuggestedExercises(suggestions.map(s => ({ ...s, phase: 'technique', id: `ai_${Date.now()}_${Math.random()}` }))); 
            setShowSuggestionsModal(true); 
        } else { showToast("Aucune suggestion.", 'error'); } 
      } catch (e: any) { showToast(e.message, 'error'); } 
      finally { setIsLoadingAI(false); } 
  };

  const handleGenerateCycle = async () => {
      if (!currentCycle?.name) return showToast("Objectif requis.", 'error');
      setIsLoadingAI(true);
      try {
          const res = await generateCyclePlan(currentCycle.name, currentCycle.weeks.length);
          if (res) setCurrentCycle(prev => prev ? { ...prev, weeks: res.weeks } : null);
      } catch (e: any) { showToast(e.message, 'error'); }
      finally { setIsLoadingAI(false); }
  };

  const handleRefineDescription = async () => {
      if (!newExercise?.description) return;
      setIsLoadingAI(true);
      const refined = await refineExerciseDescription(newExercise.description);
      setNewExercise(prev => prev ? {...prev, description: refined} : null);
      setIsLoadingAI(false);
  };

  const activeCycleData = useMemo(() => {
    const now = new Date(); now.setHours(0, 0, 0, 0); 
    return data.cycles.map(c => { 
        if (!c.startDate) return null; 
        const start = new Date(c.startDate); 
        const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)); 
        if (diffDays < 0) return null; 
        const weekIdx = Math.floor(diffDays / 7); 
        if (weekIdx < c.weeks.length) return { cycle: c, week: c.weeks[weekIdx], weekNum: weekIdx + 1, totalWeeks: c.weeks.length }; 
        return null; 
    }).find(c => c !== null); 
  }, [data.cycles]);

  const totalDuration = useMemo(() => {
      return (Object.values(currentSession.exercises).flat() as Exercise[]).reduce((acc, ex) => acc + (ex?.duration || 0), 0);
  }, [currentSession.exercises]);

  const filteredLibrary = useMemo(() => {
      return data.exercises.filter(ex => {
          if (libFilterPanier && ex.material !== 'Panier de balles') return false;
          if (libSearch && !ex.name.toLowerCase().includes(libSearch.toLowerCase())) return false;
          return true;
      });
  }, [data.exercises, libSearch, libFilterPanier]);


  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-slate-200"><Loader2 className="animate-spin text-slate-500" size={40} /></div>;
  if (showAuth && !user) return <Auth onAuthSuccess={() => setShowAuth(false)} />;

  return (
    <div className="flex h-screen bg-slate-200 font-sans overflow-hidden">
      {toast && <SimpleToast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <Sidebar 
        view={view} setView={setView} 
        mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}
        session={{ user }} handleLogout={() => { actions.logout(); setShowAuth(true); }} setShowAuth={setShowAuth}
        aiConfig={aiConfig}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
          <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="animate-spin"/></div>}>
            {view === 'dashboard' && (
              <DashboardView 
                coachProfile={data.coachProfile} session={{user}}
                savedSessions={data.sessions} players={data.players}
                cycles={data.cycles} activeCycleData={activeCycleData}
                setView={setView} setCurrentSession={setCurrentSession}
                setCurrentPlayer={setCurrentPlayer}
              />
            )}
            {view === 'sessions' && (
               <SessionsView 
                  exercises={data.exercises} currentSession={currentSession}
                  setCurrentSession={setCurrentSession} saveSession={handleSaveSession}
                  handleSuggestExercises={handleSuggestExercises} isLoadingAI={isLoadingAI}
                  totalDuration={totalDuration}
               />
            )}
            {view === 'calendar' && (
              <CyclesView 
                cycles={data.cycles} currentCycle={currentCycle} setCurrentCycle={setCurrentCycle}
                saveCycle={handleSaveCycle} setCycleToDelete={(id) => actions.deleteCycle(id)}
                handleGenerateCycle={handleGenerateCycle} isLoadingAI={isLoadingAI}
                dateInputRef={dateInputRef} showCalendarPicker={() => dateInputRef.current?.showPicker()}
                savedSessions={data.sessions} onUpdateCycle={handleUpdateCycle}
              />
            )}
            {view === 'players' && (
               <PlayersView 
                 players={data.players} currentPlayer={currentPlayer} setCurrentPlayer={setCurrentPlayer}
                 newPlayerMode={newPlayerMode} setNewPlayerMode={setNewPlayerMode}
                 savePlayer={handleSavePlayer} deletePlayer={(id) => { actions.deletePlayer(id); setCurrentPlayer(null); }}
                 playerEvals={data.playerEvals} saveEvaluation={(pid, sid, sc) => actions.saveEvaluation({ player_id: pid, skill_id: sid, score: sc, date: new Date().toISOString().split('T')[0] })}
                 loadPlayerEvaluations={actions.loadPlayerEvaluations}
               />
            )}
            {view === 'library' && (
                <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-4xl font-black text-black tracking-tighter">Bibliothèque d'exercices</h2>
                        <button onClick={() => setNewExercise({ name: '', phase: 'technique', theme: null, duration: 15, description: '', material: 'Balles' })} className="bg-black text-white px-6 py-3 rounded-2xl flex gap-2 font-black shadow-2xl hover:bg-slate-800 transition"><Plus size={20}/> Créer un exercice</button>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Rechercher par nom..." 
                                value={libSearch}
                                onChange={e => setLibSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-black font-bold outline-none focus:ring-2 focus:ring-black/5"
                            />
                        </div>
                        <button 
                            onClick={() => setLibFilterPanier(!libFilterPanier)}
                            className={`px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all border ${libFilterPanier ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-black'}`}
                        >
                            <Box size={18} /> {libFilterPanier ? 'Filtre: Panier Actif' : 'Voir Panier de balles'}
                        </button>
                    </div>

                    {newExercise && (
                        <div className="bg-white p-8 rounded-[2rem] border-2 border-dashed border-slate-200 space-y-6 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input placeholder="Nom de l'exercice" className="w-full p-4 border rounded-2xl font-black text-black" value={newExercise.name} onChange={e => setNewExercise({...newExercise, name: e.target.value})}/>
                                <select className="w-full p-4 border rounded-2xl font-black text-black" value={newExercise.material} onChange={e => setNewExercise({...newExercise, material: e.target.value})}>
                                    <option value="Balles">Balles simples</option>
                                    <option value="Panier de balles">Panier de balles</option>
                                    <option value="Plots">Plots / Cibles</option>
                                </select>
                            </div>
                            <textarea placeholder="Description détaillée..." className="w-full p-4 border rounded-2xl font-medium text-black min-h-[120px]" value={newExercise.description} onChange={e => setNewExercise({...newExercise, description: e.target.value})}/>
                             <div className="flex justify-between items-center gap-4">
                                <GeminiButton onClick={handleRefineDescription} isLoading={isLoadingAI} className="!px-6 !py-3">IA : Améliorer le texte</GeminiButton>
                                <div className="flex gap-4">
                                    <button onClick={() => setNewExercise(null)} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl">Annuler</button>
                                    <button onClick={async () => { 
                                        if(newExercise.name) { 
                                            await actions.saveExercise({ ...newExercise, id: `custom_${Date.now()}` } as Exercise); 
                                            setNewExercise(null); 
                                            showToast("Exercice ajouté à votre bibliothèque");
                                        } 
                                    }} className="bg-black text-white px-10 py-3 rounded-2xl font-black shadow-xl hover:bg-slate-800 transition">Enregistrer</button>
                                </div>
                             </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLibrary.map(ex => (
                            <div key={ex.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                {ex.material === 'Panier de balles' && (
                                    <div className="absolute -right-4 -top-4 bg-blue-600 text-white p-8 rotate-45 transform origin-center">
                                        <Box size={24} className="-rotate-45" />
                                    </div>
                                )}
                                <div className="flex flex-col h-full">
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{PHASES.find(p => p.id === ex.phase)?.label}</span>
                                            {ex.material === 'Panier de balles' && <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">Panier</span>}
                                        </div>
                                        <h3 className="text-xl font-black text-black group-hover:text-blue-600 transition-colors leading-tight">{ex.name}</h3>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 mb-6 flex-1 line-clamp-3">{ex.description}</p>
                                    <div className="flex items-center justify-between border-t pt-4">
                                        <div className="text-xs font-black text-black flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 border flex items-center justify-center"><Filter size={14}/></div>
                                            {ex.theme || 'Thème libre'}
                                        </div>
                                        <div className="text-xs font-black text-slate-400">Durée: {ex.duration}min</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {view === 'settings' && (
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Profil Coach</h2>
                    <input className="w-full p-3 border rounded-xl mb-4" placeholder="Nom" value={data.coachProfile.name} onChange={e => actions.saveProfile({...data.coachProfile, name: e.target.value})}/>
                    <input className="w-full p-3 border rounded-xl mb-4" placeholder="Club" value={data.coachProfile.club} onChange={e => actions.saveProfile({...data.coachProfile, club: e.target.value})}/>
                    <button onClick={handleSaveProfile} className="bg-slate-900 text-white px-6 py-2 rounded-xl">Sauvegarder</button>
                </div>
            )}
          </Suspense>
        </div>
      </main>

      {/* MODAL SUGGESTIONS */}
      {showSuggestionsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full p-8 overflow-hidden animate-fade-in">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-black flex items-center gap-3">
                        <Box className="text-blue-600"/> Suggestions IA
                    </h3>
                    <button onClick={() => setShowSuggestionsModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition"><Plus size={24} className="rotate-45 text-slate-400 hover:text-black"/></button>
                 </div>
                 <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                     {suggestedExercises.map((ex, i) => (
                         <div key={i} className="group border-2 border-slate-100 p-6 rounded-[2rem] hover:border-blue-600 transition-all bg-slate-50/50 hover:bg-white">
                             <div className="flex justify-between items-start mb-2">
                                <div className="font-black text-lg text-black">{ex.name}</div>
                                <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full">Proposé</span>
                             </div>
                             <p className="text-sm text-slate-600 font-medium mb-4 leading-relaxed">{ex.description}</p>
                             <button onClick={() => {
                                 const phase = 'technique';
                                 setCurrentSession(prev => ({
                                     ...prev, exercises: { ...prev.exercises, [phase]: [...(prev.exercises[phase]||[]), {...ex, id: `ai_${Date.now()}`, phase, instanceId: Date.now()}] as Exercise[] }
                                 }));
                                 showToast("Exercice ajouté à votre séance !");
                             }} className="w-full py-3 bg-black text-white rounded-xl font-black text-sm hover:bg-slate-800 transition shadow-lg">Ajouter à la séance active</button>
                         </div>
                     ))}
                 </div>
                 <button onClick={() => setShowSuggestionsModal(false)} className="mt-8 w-full py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition">Fermer</button>
             </div>
        </div>
      )}
    </div>
  );
}
