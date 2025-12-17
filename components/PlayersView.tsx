
import React, { useMemo } from 'react';
import { Plus, ArrowRight, User, Activity, TrendingUp, Save, GraduationCap, Trash2, ShieldAlert, Zap, MousePointer2, Settings2, Info, Users } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Player, PlayerEvaluation, Skill, PlayerGroup } from '../types';
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
  saveEvaluation: (playerId: string, skill_id: string, score: number) => void;
  loadPlayerEvaluations: (playerId: string) => void;
}

const PLAYER_GROUPS: PlayerGroup[] = ['Initiation', 'Débutant', 'Perfectionnement', 'Loisir', 'Compétition'];

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
      
      const relevantEvals = currentPlayer 
        ? playerEvals.filter(e => e.player_id === currentPlayer.id)
        : playerEvals;

      const sorted = [...relevantEvals].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      const latestScores: Record<string, number> = {}; 
      sorted.forEach(ev => { latestScores[ev.skill_id] = ev.score; }); 
      
      return DEFAULT_SKILLS.map(skill => ({ subject: skill.name, A: latestScores[skill.id] || 0, fullMark: 5 })); 
  }, [playerEvals, currentPlayer]);

  const handleNewPlayer = () => {
      const newId = crypto.randomUUID();
      setCurrentPlayer({ 
        id: newId, 
        first_name: '', 
        last_name: '', 
        level: 'Initiation',
        hand: 'Droitier',
        grip: 'Européenne',
        ranking_points: 500,
        equipment: {
          blade: '',
          forehand_rubber: '',
          backhand_rubber: '',
          last_change_date: new Date().toISOString().split('T')[0]
        }
      });
      setNewPlayerMode(true);
      loadPlayerEvaluations(newId);
  };

  const isEquipmentOld = (dateStr?: string) => {
    if (!dateStr) return false;
    const lastChange = new Date(dateStr);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return lastChange < sixMonthsAgo;
  };

  return (
     <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-20">
        {!currentPlayer && !newPlayerMode && (
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3"><GraduationCap className="text-accent"/> Gestion des Joueurs</h2>
                <button onClick={handleNewPlayer} className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:bg-slate-800 transition"><Plus size={18} /> Ajouter un joueur</button>
            </div>
        )}
        
        {!currentPlayer && !newPlayerMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {players.map(player => {
                    const equipmentWarning = isEquipmentOld(player.equipment?.last_change_date);
                    return (
                        <div key={player.id} onClick={() => { setCurrentPlayer(player); loadPlayerEvaluations(player.id); }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-accent cursor-pointer transition-all group relative">
                            {equipmentWarning && (
                              <div className="absolute top-4 right-4 text-amber-500 bg-amber-50 p-1.5 rounded-full" title="Plaques usées (+6 mois)">
                                <ShieldAlert size={16} />
                              </div>
                            )}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-lg group-hover:bg-orange-100 group-hover:text-accent transition-colors">
                                    {player.first_name[0]}{player.last_name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{player.first_name} {player.last_name}</h3>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${player.level === 'Compétition' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{player.level}</span>
                                        <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">{player.ranking_points || 500} PTS</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-slate-500 border-t pt-4 mt-2">
                              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1"><Users size={12}/> {player.level}</span>
                              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent"/>
                            </div>
                        </div>
                    );
                })}
                {players.length === 0 && (<div className="col-span-full text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300"><p className="text-slate-500 mb-4">Aucun joueur enregistré.</p></div>)}
            </div>
        )}

        {(currentPlayer || newPlayerMode) && (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                        <button onClick={() => { setCurrentPlayer(null); setNewPlayerMode(false); }} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition"><ArrowRight className="rotate-180" size={20}/></button>
                        <div>
                            {newPlayerMode ? <h3 className="text-xl font-bold text-slate-800">Nouveau Joueur</h3> : <><h3 className="text-2xl font-bold text-slate-800">{currentPlayer?.first_name} {currentPlayer?.last_name}</h3><p className="text-slate-500 text-sm">{currentPlayer?.level} • {currentPlayer?.ranking_points || 500} pts</p></>}
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
                     <div className="lg:col-span-4 space-y-8">
                        {/* INFOS DE BASE */}
                        <section className="space-y-4">
                          <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><User size={18} className="text-accent"/> Infos de base</h4>
                          <div className="grid grid-cols-2 gap-3">
                              <div className="col-span-1">
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Prénom</label>
                                  <input type="text" className="w-full p-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none" value={currentPlayer?.first_name} onChange={e => setCurrentPlayer(prev => prev ? {...prev, first_name: e.target.value} : null)} />
                              </div>
                              <div className="col-span-1">
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nom</label>
                                  <input type="text" className="w-full p-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none" value={currentPlayer?.last_name} onChange={e => setCurrentPlayer(prev => prev ? {...prev, last_name: e.target.value} : null)} />
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                              <div className="col-span-1">
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Année Naissance</label>
                                  <input 
                                      type="number" 
                                      className="w-full p-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none" 
                                      value={currentPlayer?.birth_year || ''} 
                                      onChange={e => setCurrentPlayer(prev => prev ? {...prev, birth_year: parseInt(e.target.value) || undefined} : null)} 
                                      placeholder="Ex: 2008" 
                                  />
                              </div>
                              <div className="col-span-1">
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Classement (Pts)</label>
                                  <input 
                                      type="number" 
                                      className="w-full p-2.5 border rounded-xl text-sm font-bold text-blue-600 focus:ring-2 focus:ring-accent outline-none" 
                                      value={currentPlayer?.ranking_points || ''} 
                                      onChange={e => setCurrentPlayer(prev => prev ? {...prev, ranking_points: parseInt(e.target.value) || undefined} : null)} 
                                      placeholder="Ex: 1245" 
                                  />
                              </div>
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Groupe d'entraînement</label>
                              <select className="w-full p-2.5 border rounded-xl bg-white text-sm focus:ring-2 focus:ring-accent outline-none" value={currentPlayer?.level} onChange={e => setCurrentPlayer(prev => prev ? {...prev, level: e.target.value as PlayerGroup} : null)}>
                                  {PLAYER_GROUPS.map(group => (
                                    <option key={group} value={group}>{group}</option>
                                  ))}
                              </select>
                          </div>
                        </section>

                        {/* SPECIFICITÉS TECHNIQUES */}
                        <section className="space-y-4">
                          <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><Zap size={18} className="text-amber-500"/> Spécificités</h4>
                          <div className="grid grid-cols-2 gap-3">
                              <div className="col-span-1">
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Main</label>
                                  <select className="w-full p-2.5 border rounded-xl bg-white text-sm focus:ring-2 focus:ring-accent outline-none" value={currentPlayer?.hand} onChange={e => setCurrentPlayer(prev => prev ? {...prev, hand: e.target.value as any} : null)}>
                                      <option value="Droitier">Droitier</option>
                                      <option value="Gaucher">Gaucher</option>
                                  </select>
                              </div>
                              <div className="col-span-1">
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Prise</label>
                                  <select className="w-full p-2.5 border rounded-xl bg-white text-sm focus:ring-2 focus:ring-accent outline-none" value={currentPlayer?.grip} onChange={e => setCurrentPlayer(prev => prev ? {...prev, grip: e.target.value as any} : null)}>
                                      <option value="Européenne">Européenne</option>
                                      <option value="Porte-plume">Porte-plume</option>
                                  </select>
                              </div>
                          </div>
                        </section>

                        {/* MATÉRIEL */}
                        <section className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><Settings2 size={18} className="text-slate-500"/> Matériel</h4>
                          <div className="space-y-3">
                              <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bois</label>
                                  <input type="text" placeholder="Ex: Butterfly Viscaria" className="w-full p-2 border rounded-lg text-xs focus:ring-2 focus:ring-accent outline-none" value={currentPlayer?.equipment?.blade || ''} onChange={e => setCurrentPlayer(prev => prev ? {...prev, equipment: { ...prev.equipment!, blade: e.target.value }} : null)} />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                  <div>
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plaque CD</label>
                                      <input type="text" placeholder="Ex: Tenergy 05" className="w-full p-2 border rounded-lg text-xs focus:ring-2 focus:ring-accent outline-none" value={currentPlayer?.equipment?.forehand_rubber || ''} onChange={e => setCurrentPlayer(prev => prev ? {...prev, equipment: { ...prev.equipment!, forehand_rubber: e.target.value }} : null)} />
                                  </div>
                                  <div>
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plaque RV</label>
                                      <input type="text" placeholder="Ex: Dignics 09c" className="w-full p-2 border rounded-lg text-xs focus:ring-2 focus:ring-accent outline-none" value={currentPlayer?.equipment?.backhand_rubber || ''} onChange={e => setCurrentPlayer(prev => prev ? {...prev, equipment: { ...prev.equipment!, backhand_rubber: e.target.value }} : null)} />
                                  </div>
                              </div>
                              <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Dernier changement</label>
                                  <input type="date" className="w-full p-2 border rounded-lg text-xs bg-white focus:ring-2 focus:ring-accent outline-none" value={currentPlayer?.equipment?.last_change_date || ''} onChange={e => setCurrentPlayer(prev => prev ? {...prev, equipment: { ...prev.equipment!, last_change_date: e.target.value }} : null)} />
                                  {isEquipmentOld(currentPlayer?.equipment?.last_change_date) && (
                                    <p className="text-[10px] text-amber-600 font-bold mt-1 flex items-center gap-1"><ShieldAlert size={12}/> Attention : Plaques usées (+6 mois)</p>
                                  )}
                              </div>
                          </div>
                        </section>

                        <button onClick={() => currentPlayer && savePlayer(currentPlayer)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg"><Save size={18}/> Enregistrer le profil</button>
                     </div>

                     {!newPlayerMode && (
                         <div className="lg:col-span-8 space-y-8">
                             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                 <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Activity size={18} className="text-accent"/> Profil Technique (Radar)</h4>
                                 <div className="h-[300px] w-full">
                                     <ResponsiveContainer width="100%" height="100%">
                                         <RadarChart key={JSON.stringify(radarData)} cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                             <PolarGrid stroke="#e2e8f0" /><PolarAngleAxis dataKey="subject" tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} /><PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                                             <Radar name={currentPlayer?.first_name} dataKey="A" stroke="#f97316" strokeWidth={2} fill="#f97316" fillOpacity={0.4} />
                                             <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                         </RadarChart>
                                     </ResponsiveContainer>
                                 </div>
                             </div>

                             <div>
                                 <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-blue-600"/> Évaluation des Compétences</h4>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {DEFAULT_SKILLS.map(skill => {
                                         const skillEvals = playerEvals.filter(e => e.skill_id === skill.id && e.player_id === currentPlayer?.id);
                                         const sortedEvals = skillEvals.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                                         const currentScore = sortedEvals[0]?.score || 0;
                                         
                                         return (
                                             <div key={skill.id} className="p-4 border border-slate-200 rounded-xl flex justify-between items-center bg-white hover:border-blue-300 transition-all shadow-sm">
                                                 <div><div className="font-bold text-slate-800 text-sm">{skill.name}</div><div className="text-[10px] text-slate-400 font-bold uppercase">{skill.category}</div></div>
                                                 <div className="flex gap-1">
                                                     {[1, 2, 3, 4, 5].map(star => (
                                                         <button key={star} onClick={() => currentPlayer && saveEvaluation(currentPlayer.id, skill.id, star)} className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${currentScore >= star ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}>{star}</button>
                                                     ))}
                                                 </div>
                                             </div>
                                         );
                                     })}
                                 </div>
                             </div>

                             {currentPlayer?.notes && (
                               <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl">
                                  <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2"><Info size={16}/> Notes du coach</h4>
                                  <p className="text-sm text-blue-700 leading-relaxed italic">"{currentPlayer.notes}"</p>
                               </div>
                             )}
                         </div>
                     )}
                </div>
            </div>
        )}
     </div>
  );
});
