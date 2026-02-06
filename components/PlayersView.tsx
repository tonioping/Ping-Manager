
import React, { useMemo, useState } from 'react';
import { Plus, ArrowRight, User, Activity, TrendingUp, Save, GraduationCap, Trash2, Sword, Circle, Hand, Trophy, AlertTriangle, Users, History, LineChart as LineChartIcon } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
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
  const [historySkillFilter, setHistorySkillFilter] = useState<string>('average');
  
  const currentPlayerEvals = useMemo(() => {
      if (!currentPlayer) return [];
      return playerEvals.filter(ev => ev.player_id === currentPlayer.id);
  }, [playerEvals, currentPlayer]);

  const radarData = useMemo(() => { 
      if (!currentPlayerEvals.length) return DEFAULT_SKILLS.map(s => ({ subject: s.name, A: 0, fullMark: 5 })); 
      const latestScores: Record<string, number> = {}; 
      // Sort by date desc to get the most recent ones first
      [...currentPlayerEvals].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).forEach(ev => { 
          if (latestScores[ev.skill_id] === undefined) latestScores[ev.skill_id] = ev.score; 
      }); 
      return DEFAULT_SKILLS.map(skill => ({ subject: skill.name, A: latestScores[skill.id] || 0, fullMark: 5 })); 
  }, [currentPlayerEvals]);

  const progressionData = useMemo(() => {
      if (!currentPlayerEvals.length) return [];
      
      // Group evaluations by date
      const evalsByDate: Record<string, PlayerEvaluation[]> = {};
      currentPlayerEvals.forEach(ev => {
          if (!evalsByDate[ev.date]) evalsByDate[ev.date] = [];
          evalsByDate[ev.date].push(ev);
      });

      // Sort dates
      const sortedDates = Object.keys(evalsByDate).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());

      return sortedDates.map(date => {
          const dayEvals = evalsByDate[date];
          let scoreVal = 0;
          
          if (historySkillFilter === 'average') {
              scoreVal = dayEvals.reduce((sum, e) => sum + e.score, 0) / dayEvals.length;
          } else {
              const specificEval = dayEvals.find(e => e.skill_id === historySkillFilter);
              scoreVal = specificEval ? specificEval.score : 0;
          }

          return {
              date: new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
              score: parseFloat(scoreVal.toFixed(1)),
              fullDate: date
          };
      }).filter(d => d.score > 0);
  }, [currentPlayerEvals, historySkillFilter]);

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
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter"><GraduationCap className="text-accent" size={28}/> Joueurs</h2>
                        <InfoBubble content="Gérez vos effectifs et suivez la progression technique individuelle de chaque licencié." />
                    </div>
                    <button onClick={() => { setCurrentPlayer({ id: crypto.randomUUID(), first_name: '', last_name: '', level: 'Debutants' }); setNewPlayerMode(true); }} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs tracking-widest uppercase flex items-center gap-2 shadow-xl hover:bg-slate-800 transition transform hover:scale-105 active:scale-95"><Plus size={18} /> Nouveau Joueur</button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                    <button onClick={() => setFilterGroup('all')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${filterGroup === 'all' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>Tous</button>
                    {GROUPS.map(g => (
                        <button key={g.id} onClick={() => setFilterGroup(g.id)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${filterGroup === g.id ? `${g.color.split(' ')[0]} ${g.color.split(' ')[1]} shadow-lg` : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>{g.label}</button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlayers.map(p => (
                        <div key={p.id} onClick={() => setCurrentPlayer(p)} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group/card">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black group-hover/card:scale-110 transition-transform">
                                    {p.first_name[0]}{p.last_name[0]}
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 uppercase tracking-tighter">{p.first_name} {p.last_name}</h3>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.level}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${GROUPS.find(g => g.id === p.group)?.color || 'bg-slate-100 text-slate-400'}`}>
                                    {GROUPS.find(g => g.id === p.group)?.label || 'Sans Groupe'}
                                </span>
                                <ArrowRight className="text-slate-300 group-hover/card:translate-x-1 transition-transform" size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {(currentPlayer || newPlayerMode) && (
            <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-6 items-center">
                        <button onClick={() => { setCurrentPlayer(null); setNewPlayerMode(false); }} className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"><ArrowRight className="rotate-180 text-slate-900" size={20}/></button>
                        <div>
                            {newPlayerMode ? <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Nouveau Profil</h3> : <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">{currentPlayer?.first_name} <span className="text-accent">{currentPlayer?.last_name}</span></h3>}
                            {!newPlayerMode && <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{currentPlayer?.level} • {GROUPS.find(g => g.id === currentPlayer?.group)?.label}</div>}
                        </div>
                    </div>
                    <div className="flex gap-3">
                         <button onClick={() => currentPlayer && savePlayer(currentPlayer)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase flex items-center gap-3 hover:bg-slate-800 transition shadow-xl hover:scale-[1.02] active:scale-95"><Save size={18}/> Sauvegarder</button>
                    </div>
                </div>

                <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                     <div className="lg:col-span-4 space-y-10">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2"><User size={14}/> Informations de base</h4>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Prénom</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 outline-none font-bold text-slate-900" placeholder="Prénom" value={currentPlayer?.first_name} onChange={e => setCurrentPlayer(prev => prev ? {...prev, first_name: e.target.value} : null)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Nom</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 outline-none font-bold text-slate-900" placeholder="Nom" value={currentPlayer?.last_name} onChange={e => setCurrentPlayer(prev => prev ? {...prev, last_name: e.target.value} : null)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Groupe</label>
                                    <select className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 outline-none font-bold text-slate-900" value={currentPlayer?.group || ''} onChange={e => setCurrentPlayer(prev => prev ? {...prev, group: e.target.value} : null)}>
                                        <option value="">Sélectionner un groupe</option>
                                        {GROUPS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 text-slate-200 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group/gear">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl group-hover/gear:bg-accent/30 transition-all"></div>
                            <h4 className="text-[10px] font-black text-white mb-6 flex items-center gap-2 relative z-10 uppercase tracking-widest">
                              <Sword size={14} className="text-accent" /> Équipement Technique 
                              <InfoBubble content="Un bon suivi du matériel est crucial. Les gommes perdent leur adhérence après 6 mois ou 50 heures de jeu." position="right" />
                            </h4>
                            <div className="space-y-6 relative z-10">
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-2">Modèle de Bois</label>
                                    <input type="text" placeholder="Ex: Butterfly Viscaria" className="w-full bg-slate-800 border-none text-white p-4 rounded-xl text-sm font-bold" value={currentPlayer?.blade || ''} onChange={e => setCurrentPlayer(prev => prev ? {...prev, blade: e.target.value} : null)} />
                                </div>
                                <div className="pt-4 border-t border-slate-800">
                                    <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">Dernier entretien</label>
                                    <div className="flex items-center gap-3">
                                        <input type="date" className="bg-slate-800 text-white p-3 rounded-xl text-xs border-none w-full font-bold" value={currentPlayer?.last_equipment_change || ''} onChange={e => setCurrentPlayer(prev => prev ? {...prev, last_equipment_change: e.target.value} : null)} />
                                        {isEquipmentOld && (
                                            <div className="flex items-center gap-1 text-orange-500 text-[8px] font-black bg-orange-500/10 px-3 py-2 rounded-xl border border-orange-500/20 uppercase tracking-widest animate-pulse"><AlertTriangle size={12}/> Usé</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>

                     {!newPlayerMode && (
                         <div className="lg:col-span-8 space-y-12">
                             <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                 {/* RADAR CHART */}
                                 <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center">
                                     <div className="w-full flex justify-between items-center mb-6">
                                         <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                           <Activity size={14} className="text-accent"/> Radar de Compétences
                                         </h4>
                                         <InfoBubble content="Ce graphique montre le niveau actuel sur les 7 piliers du joueur de tennis de table." />
                                     </div>
                                     <div className="h-[300px] w-full">
                                         <ResponsiveContainer width="100%" height="100%">
                                             <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                                 <PolarGrid stroke="#f1f5f9" />
                                                 <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                                                 <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                                                 <Radar name={currentPlayer?.first_name} dataKey="A" stroke="#f97316" strokeWidth={3} fill="#f97316" fillOpacity={0.15} />
                                                 <Tooltip 
                                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                                 />
                                             </RadarChart>
                                         </ResponsiveContainer>
                                     </div>
                                 </div>

                                 {/* PROGRESSION LINE CHART */}
                                 <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
                                     <div className="w-full flex justify-between items-center mb-4">
                                         <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                           <TrendingUp size={14} className="text-blue-500"/> Courbe de Progression
                                         </h4>
                                         <select 
                                            value={historySkillFilter} 
                                            onChange={(e) => setHistorySkillFilter(e.target.value)}
                                            className="text-[9px] font-black uppercase tracking-widest bg-slate-50 border-none rounded-lg p-2 focus:ring-0 outline-none"
                                         >
                                             <option value="average">Moyenne Globale</option>
                                             {DEFAULT_SKILLS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                         </select>
                                     </div>
                                     <div className="flex-1 min-h-[250px] w-full mt-2">
                                         {progressionData.length > 1 ? (
                                             <ResponsiveContainer width="100%" height="100%">
                                                 <LineChart data={progressionData}>
                                                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                     <XAxis dataKey="date" tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
                                                     <YAxis domain={[0, 5]} tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} axisLine={false} tickLine={false} dx={-10} />
                                                     <Tooltip 
                                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                                        labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                                                     />
                                                     <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                                 </LineChart>
                                             </ResponsiveContainer>
                                         ) : (
                                             <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                                 <History size={32} className="text-slate-300 mb-2" />
                                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Pas assez de recul historique.<br/>Évaluez le joueur sur plusieurs dates.</p>
                                             </div>
                                         )}
                                     </div>
                                 </div>
                             </div>

                             {/* EVALUATION GRID */}
                             <div className="space-y-6">
                                 <div className="flex items-center justify-between px-2">
                                     <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                       <LineChartIcon size={14} className="text-accent"/> Évaluer aujourd'hui
                                     </h4>
                                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Date : {new Date().toLocaleDateString()}</span>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {DEFAULT_SKILLS.map(skill => {
                                         const todayStr = new Date().toISOString().split('T')[0];
                                         const todayEval = currentPlayerEvals.find(e => e.skill_id === skill.id && e.date === todayStr);
                                         const latestEval = [...currentPlayerEvals].filter(e => e.skill_id === skill.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                                         
                                         const currentVal = todayEval ? todayEval.score : 0;

                                         return (
                                             <div key={skill.id} className="group/eval p-6 bg-white border border-slate-100 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center gap-4 hover:border-accent/30 hover:shadow-lg transition-all">
                                                 <div className="text-center sm:text-left">
                                                     <div className="font-black text-slate-900 uppercase tracking-tighter text-sm">{skill.name}</div>
                                                     {latestEval && latestEval.date !== todayStr && (
                                                         <div className="text-[8px] font-black text-slate-400 uppercase mt-1 tracking-widest">Dernier : {latestEval.score}/5 ({new Date(latestEval.date).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })})</div>
                                                     )}
                                                 </div>
                                                 <div className="flex gap-1 bg-slate-50 p-1 rounded-2xl">
                                                     {[1, 2, 3, 4, 5].map(star => (
                                                         <button 
                                                            key={star} 
                                                            onClick={() => currentPlayer && saveEvaluation(currentPlayer.id, skill.id, star)} 
                                                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all transform active:scale-90 ${currentVal >= star ? 'bg-accent text-white shadow-lg shadow-orange-500/20' : 'bg-transparent text-slate-300 hover:text-slate-500'}`}
                                                         >
                                                             {star}
                                                         </button>
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
