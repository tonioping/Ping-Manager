
import React, { useMemo, useState } from 'react';
import { Plus, ArrowRight, User, Activity, TrendingUp, Save, GraduationCap, Trash2, Sword, Circle, Hand, Trophy, AlertTriangle, Users } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Player, PlayerEvaluation, Skill } from '../types';
import { DEFAULT_SKILLS, GROUPS } from '../constants';
import { InfoBubble } from './InfoBubble';

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
      playerEvals.forEach(ev => { if (latestScores[ev.skill_id] === undefined) latestScores[ev.skill_id] = ev.score; }); 
      return DEFAULT_SKILLS.map(skill => ({ subject: skill.name, A: latestScores[skill.id] || 0, fullMark: 5 })); 
  }, [playerEvals]);

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

                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    <button onClick={() => setFilterGroup('all')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border ${filterGroup === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200'}`}>Tous</button>
                    {GROUPS.map(g => (
                        <button key={g.id} onClick={() => setFilterGroup(g.id)} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border ${filterGroup === g.id ? `${g.color.split(' ')[0]} ${g.color.split(' ')[1]}` : 'bg-white text-slate-500 border-slate-200'}`}>{g.label}</button>
                    ))}
                </div>
            </div>
        )}
        
        {(currentPlayer || newPlayerMode) && (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                        <button onClick={() => { setCurrentPlayer(null); setNewPlayerMode(false); }} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"><ArrowRight className="rotate-180" size={20}/></button>
                        <div>
                            {newPlayerMode ? <h3 className="text-xl font-bold text-slate-800">Nouveau Joueur</h3> : <><h3 className="text-2xl font-bold text-slate-800">{currentPlayer?.first_name} {currentPlayer?.last_name}</h3></>}
                        </div>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                     <div className="lg:col-span-5 space-y-8">
                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-700 flex items-center gap-2"><User size={18}/> Profil & Niveau</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" className="w-full p-3 border rounded-xl" placeholder="Prénom" value={currentPlayer?.first_name} onChange={e => setCurrentPlayer(prev => prev ? {...prev, first_name: e.target.value} : null)} />
                                <input type="text" className="w-full p-3 border rounded-xl" placeholder="Nom" value={currentPlayer?.last_name} onChange={e => setCurrentPlayer(prev => prev ? {...prev, last_name: e.target.value} : null)} />
                            </div>
                        </div>

                        <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                            <h4 className="font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                              <Sword size={18}/> Matériel Actuel 
                              <InfoBubble content="Renseignez les bois et revêtements. Un avertissement s'affiche si le matériel date de plus de 6 mois." />
                            </h4>
                            <div className="space-y-4 relative z-10">
                                <input type="text" placeholder="Bois" className="w-full bg-slate-800 border-none text-white p-2 rounded-lg text-sm" value={currentPlayer?.blade || ''} onChange={e => setCurrentPlayer(prev => prev ? {...prev, blade: e.target.value} : null)} />
                                <div className="pt-2 border-t border-slate-700">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Dernier changement</label>
                                    <div className="flex items-center gap-2">
                                        <input type="date" className="bg-slate-800 text-white p-2 rounded-lg text-xs border-none w-full" value={currentPlayer?.last_equipment_change || ''} onChange={e => setCurrentPlayer(prev => prev ? {...prev, last_equipment_change: e.target.value} : null)} />
                                        {isEquipmentOld && (
                                            <div className="flex items-center gap-1 text-orange-500 text-xs font-bold bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20"><AlertTriangle size={12}/> Vieux</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => currentPlayer && savePlayer(currentPlayer)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg"><Save size={18}/> Sauvegarder</button>
                     </div>

                     {!newPlayerMode && (
                         <div className="lg:col-span-7 space-y-8">
                             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                 <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                                   <Activity size={18} className="text-accent"/> Profil Technique 
                                   <InfoBubble content="Le graphique radar affiche les notes les plus récentes pour chaque compétence." />
                                 </h4>
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
                                 <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-blue-600"/> Évaluer le joueur</h4>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {DEFAULT_SKILLS.map(skill => {
                                         const latestScore = playerEvals.find(e => e.skill_id === skill.id)?.score || 0;
                                         return (
                                             <div key={skill.id} className="p-4 border border-slate-200 rounded-xl flex justify-between items-center bg-white hover:border-blue-300 transition-colors">
                                                 <div><div className="font-bold text-slate-800">{skill.name}</div></div>
                                                 <div className="flex gap-1">
                                                     {[1, 2, 3, 4, 5].map(star => (
                                                         <button key={star} onClick={() => currentPlayer && saveEvaluation(currentPlayer.id, skill.id, star)} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${latestScore >= star ? 'bg-orange-500 text-white scale-110' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}>{star}</button>
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
