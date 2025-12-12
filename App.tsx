import React, { useState, useMemo, Suspense, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

import { useAppData } from './hooks/useAppData';
import { Sidebar } from './components/Sidebar'; 
import Auth from './components/Auth';
import { Toast } from './components/Toast'; // On supposera que Toast est extrait ou on le laisse ici pour l'instant

// Views
const DashboardView = React.lazy(() => import('./components/DashboardView').then(m => ({ default: m.DashboardView })));
const CyclesView = React.lazy(() => import('./components/CyclesView').then(m => ({ default: m.CyclesView })));
const SessionsView = React.lazy(() => import('./components/SessionsView').then(m => ({ default: m.SessionsView })));
const PlayersView = React.lazy(() => import('./components/PlayersView').then(m => ({ default: m.PlayersView })));

import { View, Session, Cycle, Player, Exercise, PhaseId, AIConfig, PlayerEvaluation } from './types';
import { EMPTY_SESSION, PHASES, INITIAL_EXERCISES } from './constants';
import { refineExerciseDescription, suggestExercises, generateCyclePlan, type SuggestedExercise } from './services/geminiService';
import { Calendar as CalendarIcon, Plus, Filter } from 'lucide-react';
import { GeminiButton } from './components/GeminiButton';

// Simple Local Toast Component to avoid file dependency loop if not extracted
const SimpleToast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in ${type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
    <span className="font-medium text-sm">{message}</span>
    <button onClick={onClose}>×</button>
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
  const [cycleToDelete, setCycleToDelete] = useState<number | null>(null); // Kept for interface compatibility
  
  // AI State
  const [aiConfig, setAiConfig] = useState<AIConfig>({ provider: 'google', apiKey: '', model: 'gemini-2.5-flash' });
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [suggestedExercises, setSuggestedExercises] = useState<SuggestedExercise[]>([]);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  
  const dateInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // --- Handlers (Simplified thanks to hook) ---

  const handleSaveSession = async () => {
    if (!currentSession.name.trim()) return showToast("Nom requis", "error");
    await actions.saveSession(currentSession);
    showToast("Séance sauvegardée");
  };

  const handleSaveCycle = async () => {
    if (!currentCycle || !currentCycle.name) return showToast("Nom requis", "error");
    // Ensure ID exists for hook
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
  
  // AI Handlers (Business Logic kept here as it's UI interaction heavy)
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

  // Computed
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
      // Fix: Cast flat() result to Exercise[] to avoid 'unknown' type error
      return (Object.values(currentSession.exercises).flat() as Exercise[]).reduce((acc, ex) => acc + (ex?.duration || 0), 0);
  }, [currentSession.exercises]);


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
        {/* Mobile Header logic handled in Sidebar or here if needed, keeping simple */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
          <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="animate-spin"/></div>}>
            {view === 'dashboard' && (
              <DashboardView 
                coachProfile={data.coachProfile} session={{user}}
                savedSessions={data.sessions} players={data.players}
                cycles={data.cycles} activeCycleData={activeCycleData}
                setView={setView} setCurrentSession={setCurrentSession}
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
                // Simplification: Inline library code moved here or kept in separate component if it was large
                // Keeping existing minimal structure for Library to save space in this response
                <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between mb-6">
                        <h2 className="text-2xl font-bold">Bibliothèque</h2>
                        <button onClick={() => setNewExercise({ name: '', phase: 'technique', theme: null, duration: 15, description: '', material: '' })} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex gap-2"><Plus size={18}/> Créer</button>
                    </div>
                    {newExercise && (
                        <div className="mb-6 p-4 bg-slate-50 rounded-xl border space-y-3">
                            <input placeholder="Nom" className="w-full p-2 border rounded" value={newExercise.name} onChange={e => setNewExercise({...newExercise, name: e.target.value})}/>
                            <textarea placeholder="Description" className="w-full p-2 border rounded" value={newExercise.description} onChange={e => setNewExercise({...newExercise, description: e.target.value})}/>
                             <div className="flex justify-between">
                                <GeminiButton onClick={handleRefineDescription} isLoading={isLoadingAI}>Améliorer</GeminiButton>
                                <button onClick={async () => { 
                                    if(newExercise.name) { 
                                        await actions.saveExercise({ ...newExercise, id: `custom_${Date.now()}` } as Exercise); 
                                        setNewExercise(null); 
                                    } 
                                }} className="bg-emerald-500 text-white px-4 py-2 rounded">Sauvegarder</button>
                             </div>
                        </div>
                    )}
                    <div className="space-y-2">
                        {data.exercises.map(ex => (
                            <div key={ex.id} className="p-3 border rounded-lg hover:bg-slate-50">
                                <div className="font-bold">{ex.name}</div>
                                <div className="text-sm text-slate-500 truncate">{ex.description}</div>
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
                 <h3 className="text-xl font-bold mb-4">Suggestions IA</h3>
                 <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                     {suggestedExercises.map((ex, i) => (
                         <div key={i} className="border p-4 rounded-xl hover:bg-slate-50">
                             <div className="font-bold">{ex.name}</div>
                             <p className="text-sm text-slate-600 mb-2">{ex.description}</p>
                             <button onClick={() => {
                                 const phase = 'technique';
                                 setCurrentSession(prev => ({
                                     ...prev, exercises: { ...prev.exercises, [phase]: [...(prev.exercises[phase]||[]), {...ex, id: `ai_${Date.now()}`, phase, instanceId: Date.now()}] as Exercise[] }
                                 }));
                                 showToast("Ajouté !");
                             }} className="text-accent font-bold text-sm">+ Ajouter</button>
                         </div>
                     ))}
                 </div>
                 <button onClick={() => setShowSuggestionsModal(false)} className="mt-4 w-full py-2 bg-slate-100 rounded-lg">Fermer</button>
             </div>
        </div>
      )}
    </div>
  );
}