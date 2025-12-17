
import React, { useMemo } from 'react';
import { Plus, ArrowRight, User, Activity, TrendingUp, Save, GraduationCap, Trash2 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Player, PlayerEvaluation, Skill } from '../types';
import { DEFAULT_SKILLS } from '../constants';

interface PlayersViewProps {
  players: Player[];
  currentPlayer: Player | null;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  newPlayerMode: boolean;
  setNewPlayerMode: React.Dispatch<React.SetStateAction<boolean>>;
  savePlayer: (player: Player) => void;
  deletePlayer: (playerId: string) => void;
  playerEvals: PlayerEvaluation[];
  saveEvaluation: (playerId: string, skillId: string, score: number) => void;
  loadPlayerEvaluations: (playerId: string) => void;
}

export const PlayersView: React.FC<PlayersViewProps> = React.memo(({
  players,
  currentPlayer,
  setCurrentPlayer,
  newPlayerMode,
  setNewPlayerMode,
  savePlayer,
  deletePlayer,
  playerEvals,
  saveEvaluation,
  loadPlayerEvaluations
}) => {
  
  const radarData = useMemo(() => { 
      if (!playerEvals.length) return DEFAULT_SKILLS.map(s => ({ subject: s.name, A: 0, fullMark: 5 })); 
      const latestScores: Record<string, number> = {}; 
      playerEvals.forEach(ev => { latestScores[ev.skill_id] = ev.score; }); 
      return DEFAULT_SKILLS.map(skill => ({ subject: skill.name, A: latestScores[skill.id] || 0, fullMark: 5 })); 
  }, [playerEvals]);

  return (
     <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        {!currentPlayer && !newPlayerMode && (
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3"><GraduationCap className="text-accent"/> Joueurs</h2>
                <button onClick={() => { setCurrentPlayer({ id: crypto.randomUUID(), first_name: '', last_name: '', birth_date: undefined, age: undefined, level: 'Debutants' }); setNewPlayerMode(true); }} className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg"><Plus size={18} /> Nouveau Joueur</button>
            </div>
        )}
        
        {!currentPlayer && !newPlayerMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {players.map(player => (
                    <div key={player.id} onClick={() => { setCurrentPlayer(player); loadPlayerEvaluations(player.id); }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-accent cursor-pointer transition-all group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-lg group-hover:bg-orange-100 group-hover:text-accent transition-colors">
                                {player.first_name[0]}{player.last_name[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">{player.first_name} {player.last_name}</h3>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{player.level}</span>
                                    {player.age && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium">{player.age} ans</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-500"><span>Voir progression</span><ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent"/></div>
                    </div>
                ))}
                {players.length === 0 && (<div className="col-span-full text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300"><p className="text-slate-500 mb-4">Aucun joueur enregistré.</p></div>)}
            </div>
        )}

        {(currentPlayer || newPlayerMode) && (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                        <button onClick={() => { setCurrentPlayer(null); setNewPlayerMode(false); }} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"><ArrowRight className="rotate-180" size={20}/></button>
                        <div>
                            {newPlayerMode ? <h3 className="text-xl font-bold text-slate-800">Nouveau Joueur</h3> : <><h3 className="text-2xl font-bold text-slate-800">{currentPlayer?.first_name} {currentPlayer?.last_name}</h3><p className="text-slate-500 text-sm">{currentPlayer?.level} {currentPlayer?.age ? `• ${currentPlayer.age} ans` : ''}</p></>}
                        </div>
                    </div>
                    {!newPlayerMode && currentPlayer && (
                        <button 
                            onClick={() => deletePlayer(currentPlayer.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Supprimer le joueur"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                     <div className="lg:col-span-4 space-y-4">
                        <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><User size={18}/> Informations</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Prénom</label>
                                <input type="text" className="w-full p-3 border rounded-xl" value={currentPlayer?.first_name} onChange={e => setCurrentPlayer(prev => prev ? {...prev, first_name: e.target.value} : null)} />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Nom</label>
                                <input type="text" className="w-full p-3 border rounded-xl" value={currentPlayer?.last_name} onChange={e => setCurrentPlayer(prev => prev ? {...prev, last_name: e.target.value} : null)} />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Age</label>
                                <input 
                                    type="number" 
                                    className="w-full p-3 border rounded-xl" 
                                    value={currentPlayer?.age || ''} 
                                    onChange={e => {
                                        const val = parseInt(e.target.value);
                                        setCurrentPlayer(prev => prev ? {...prev, age: isNaN(val) ? undefined : val} : null);
                                    }} 
                                    placeholder="Ans" 
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Date de naissance</label>
                                <input 
                                    type="date" 
                                    className="w-full p-3 border rounded-xl bg-white text-sm" 
                                    value={currentPlayer?.birth_date || ''} 
                                    onChange={e => setCurrentPlayer(prev => prev ? {...prev, birth_date: e.target.value} : null)} 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Niveau</label>
                            <select className="w-full p-3 border rounded-xl bg-white" value={currentPlayer?.level} onChange={e => setCurrentPlayer(prev => prev ? {...prev, level: e.target.value as any} : null)}>
                                <option value="Debutants">Débutant</option><option value="Intermediaire">Intermédiaire</option><option value="Avance">Avancé</option><option value="Elite">Elite</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Notes</label>
                            <textarea placeholder="Particularités, style de jeu..." rows={4} className="w-full p-3 border rounded-xl" value={currentPlayer?.notes || ''} onChange={e => setCurrentPlayer(prev => prev ? {...prev, notes: e.target.value} : null)}></textarea>
                        </div>
                        <button onClick={() => currentPlayer && savePlayer(currentPlayer)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition"><Save size={18}/> Enregistrer</button>
                     </div>

                     {!newPlayerMode && (
                         <div className="lg:col-span-8 space-y-8">
                             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                 <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Activity size={18} className="text-accent"/> Profil Technique (Radar)</h4>
                                 <div className="h-[300px] w-full">
                                     <ResponsiveContainer width="100%" height="100%">
                                         <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                             <PolarGrid /><PolarAngleAxis dataKey="subject" /><PolarRadiusAxis angle={30} domain={[0, 5]} />
                                             <Radar name={currentPlayer?.first_name} dataKey="A" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
                                             <Tooltip />
                                         </RadarChart>
                                     </ResponsiveContainer>
                                 </div>
                             </div>

                             <div>
                                 <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-blue-600"/> Évaluation des Compétences</h4>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {DEFAULT_SKILLS.map(skill => {
                                         const currentScore = playerEvals.find(e => e.skill_id === skill.id)?.score || 0;
                                         return (
                                             <div key={skill.id} className="p-4 border border-slate-200 rounded-xl flex justify-between items-center bg-white hover:border-blue-300 transition-colors">
                                                 <div><div className="font-bold text-slate-800">{skill.name}</div><div className="text-xs text-slate-500">{skill.category}</div></div>
                                                 <div className="flex gap-1">
                                                     {[1, 2, 3, 4, 5].map(star => (
                                                         <button key={star} onClick={() => currentPlayer && saveEvaluation(currentPlayer.id, skill.id, star)} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${currentScore >= star ? 'bg-orange-500 text-white scale-110' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}>{star}</button>
                                                     ))}
                                                 </div>
                                             </div>
                                         );
                                     })}
                                 </div>
                             </div>
                         </div>
                     )}
                </div>
            </div>
        )}
     </div>
  );
});
