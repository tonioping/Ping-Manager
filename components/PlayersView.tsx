
import React, { useMemo, useState } from 'react';
import { Plus, ArrowRight, User, Activity, TrendingUp, Save, GraduationCap, Trash2, Sword, Circle, Hand, Trophy, AlertTriangle, Users } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Player, PlayerEvaluation, Skill } from '../types';
import { DEFAULT_SKILLS, GROUPS } from '../constants';

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
  const [filterGroup, setFilterGroup] = useState<string>('all');
  
  const radarData = useMemo(() => { 
      if (!playerEvals.length) return DEFAULT_SKILLS.map(s => ({ subject: s.name, A: 0, fullMark: 5 })); 
      const latestScores: Record<string, number> = {}; 
      playerEvals.forEach(ev => { latestScores[ev.skill_id] = ev.score; }); 
      return DEFAULT_SKILLS.map(skill => ({ subject: skill.name, A: latestScores[skill.id] || 0, fullMark: 5 })); 
  }, [playerEvals]);

  // Check if equipment is old (> 6 months)
  const isEquipmentOld = useMemo(() => {
    if (!currentPlayer?.last_equipment_change) return false;
    const changeDate = new Date(currentPlayer.last_equipment_change);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return changeDate < sixMonthsAgo;
  }, [currentPlayer?.last_equipment_change]);

  const filteredPlayers = useMemo(() => {
      if (filterGroup === 'all') return players;
      return players.filter(p => p.group === filterGroup);
  }, [players, filterGroup]);

  return (
     <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        {!currentPlayer && !newPlayerMode && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3"><GraduationCap className="text-accent"/> Joueurs</h2>
                    <button onClick={() => { setCurrentPlayer({ id: crypto.randomUUID(), first_name: '', last_name: '', birth_date: undefined, age: undefined, level: 'Debutants' }); setNewPlayerMode(true); }} className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg"><Plus size={18} /> Nouveau Joueur</button>
                </div>

                {/* GROUPS FILTER BAR */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    <button 
                        onClick={() => setFilterGroup('all')}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${filterGroup === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                    >
                        Tous
                    </button>
                    {GROUPS.map(g => (
                        <button 
                            key={g.id}
                            onClick={() => setFilterGroup(g.id)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${filterGroup === g.id ? `${g.color.split(' ')[0]} ${g.color.split(' ')[1]} ring-1 ring-offset-1` : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                        >
                            {g.label}
                        </button>
                    ))}
                </div>
            </div>
        )}
        
        {!currentPlayer && !newPlayerMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlayers.map(player => {
                    const playerGroup = GROUPS.find(g => g.id === player.group);
                    return (
                        <div key={player.id} onClick={() => { setCurrentPlayer(player); loadPlayerEvaluations(player.id); }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-accent cursor-pointer transition-all group relative">
                            {playerGroup && (
                                <div className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${playerGroup.color}`}>
                                    {playerGroup.label}
                                </div>
                            )}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-lg group-hover:bg-orange-100 group-hover:text-accent transition-colors">
                                    {player.first_name[0]}{player.last_name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{player.first_name} {player.last_name}</h3>
                                    <div className="flex gap-2 mt-1 flex-wrap">
                                        <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{player.level}</span>
                                        {player.ranking && <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-bold">{player.ranking} pts</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-slate-500"><span>Voir progression</span><ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent"/></div>
                        </div>
                    );
                })}
                {filteredPlayers.length === 0 && (<div className="col-span-full text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300"><p className="text-slate-500 mb-4">Aucun joueur trouvé dans ce groupe.</p></div>)}
            </div>
        )}

        {(currentPlayer || newPlayerMode) && (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                        <button onClick={() => { setCurrentPlayer(null); setNewPlayerMode(false); }} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"><ArrowRight className="rotate-180" size={20}/></button>
                        <div>
                            {newPlayerMode ? <h3 className="text-xl font-bold text-slate-800">Nouveau Joueur</h3> : <><h3 className="text-2xl font-bold text-slate-800">{currentPlayer?.first_name} {currentPlayer?.last_name}</h3><p className="text-slate-500 text-sm">{currentPlayer?.level} {currentPlayer?.ranking ? `• ${currentPlayer.ranking} pts` : ''}</p></>}
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
                     {/* LEFT COLUMN: INFO & MATERIAL */}
                     <div className="lg:col-span-5 space-y-8">
                        {/* BASIC INFO */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-700 flex items-center gap-2"><User size={18}/> État Civil & Niveau</h4>
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
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Naissance (Année)</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-3 border rounded-xl bg-white text-sm" 
                                        value={currentPlayer?.birth_date || ''} 
                                        onChange={e => setCurrentPlayer(prev => prev ? {...prev, birth_date: e.target.value} : null)} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Classement (Pts)</label>
                                    <div className="relative">
                                        <Trophy size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                        <input 
                                            type="number" 
                                            className="w-full p-3 pl-10 border rounded-xl" 
                                            placeholder="Ex: 1250"
                                            value={currentPlayer?.ranking || ''} 
                                            onChange={e => setCurrentPlayer(prev => prev ? {...prev, ranking: parseInt(e.target.value) || 0} : null)} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Groupe d'entraînement</label>
                                    <div className="relative">
                                        <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                        <select 
                                            className="w-full p-3 pl-10 border rounded-xl bg-white text-sm" 
                                            value={currentPlayer?.group || ''} 
                                            onChange={e => setCurrentPlayer(prev => prev ? {...prev, group: e.target.value} : null)}
                                        >
                                            <option value="">-- Aucun groupe --</option>
                                            {GROUPS.map(g => (
                                                <option key={g.id} value={g.id}>{g.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Niveau</label>
                                    <select className="w-full p-3 border rounded-xl bg-white" value={currentPlayer?.level} onChange={e => setCurrentPlayer(prev => prev ? {...prev, level: e.target.value as any} : null)}>
                                        <option value="Debutants">Débutant</option><option value="Intermediaire">Intermédiaire</option><option value="Avance">Avancé</option><option value="Elite">Elite</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Main & Prise</label>
                                    <div className="flex gap-2">
                                        <select className="w-1/2 p-3 border rounded-xl bg-white text-sm" value={currentPlayer?.hand || 'Droitier'} onChange={e => setCurrentPlayer(prev => prev ? {...prev, hand: e.target.value as any} : null)}>
                                            <option value="Droitier">Droitier</option>
                                            <option value="Gaucher">Gaucher</option>
                                        </select>
                                        <select className="w-1/2 p-3 border rounded-xl bg-white text-sm" value={currentPlayer?.grip || 'Europeenne'} onChange={e => setCurrentPlayer(prev => prev ? {...prev, grip: e.target.value as any} : null)}>
                                            <option value="Europeenne">Euro</option>
                                            <option value="Porte-Plume">Plume</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* EQUIPMENT SECTION (The Killer Feature) */}
                        <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Sword size={100} /></div>
                            <h4 className="font-bold text-white mb-4 flex items-center gap-2 relative z-10"><Sword size={18}/> Matériel Actuel</h4>
                            
                            <div className="space-y-4 relative z-10">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bois (Blade)</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ex: Butterfly Viscaria" 
                                        className="w-full bg-slate-800 border-none text-white p-2 rounded-lg text-sm placeholder:text-slate-600 focus:ring-1 focus:ring-accent"
                                        value={currentPlayer?.blade || ''}
                                        onChange={e => setCurrentPlayer(prev => prev ? {...prev, blade: e.target.value} : null)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Circle size={8} fill="currentColor"/> Coup Droit</label>
                                        <input 
                                            type="text" 
                                            placeholder="Ex: Tenergy 05" 
                                            className="w-full bg-slate-800 border-none text-white p-2 rounded-lg text-sm placeholder:text-slate-600 focus:ring-1 focus:ring-red-500"
                                            value={currentPlayer?.rubber_fh || ''}
                                            onChange={e => setCurrentPlayer(prev => prev ? {...prev, rubber_fh: e.target.value} : null)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-900 bg-slate-200 px-1 rounded w-fit uppercase tracking-wider mb-1 flex items-center gap-1"><Circle size={8} fill="black"/> Revers</label>
                                        <input 
                                            type="text" 
                                            placeholder="Ex: Dignics 09c" 
                                            className="w-full bg-slate-800 border-none text-white p-2 rounded-lg text-sm placeholder:text-slate-600 focus:ring-1 focus:ring-slate-400"
                                            value={currentPlayer?.rubber_bh || ''}
                                            onChange={e => setCurrentPlayer(prev => prev ? {...prev, rubber_bh: e.target.value} : null)}
                                        />
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-slate-700">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Dernier changement</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="date" 
                                            className="bg-slate-800 text-white p-2 rounded-lg text-xs border-none w-full"
                                            value={currentPlayer?.last_equipment_change || ''}
                                            onChange={e => setCurrentPlayer(prev => prev ? {...prev, last_equipment_change: e.target.value} : null)}
                                        />
                                        {isEquipmentOld && (
                                            <div className="flex items-center gap-1 text-orange-500 text-xs font-bold bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20 whitespace-nowrap">
                                                <AlertTriangle size={12}/> &gt; 6 mois
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => currentPlayer && savePlayer(currentPlayer)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg"><Save size={18}/> Sauvegarder Fiche</button>
                     </div>

                     {!newPlayerMode && (
                         <div className="lg:col-span-7 space-y-8">
                             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                 <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Activity size={18} className="text-accent"/> Profil Technique (Radar)</h4>
                                 <div className="h-[300px] w-full">
                                     <ResponsiveContainer width="100%" height="100%">
                                         <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
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
                             
                             <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Notes Générales</label>
                                <textarea placeholder="Style de jeu, points forts/faibles, objectifs..." rows={4} className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white transition-colors" value={currentPlayer?.notes || ''} onChange={e => setCurrentPlayer(prev => prev ? {...prev, notes: e.target.value} : null)}></textarea>
                             </div>
                         </div>
                     )}
                </div>
            </div>
        )}
     </div>
  );
});
