import React, { useMemo, useState } from 'react';
import { ArrowLeft, Users, Clock, PlayCircle, TrendingUp, BookOpen, Calendar, ChevronRight, History } from 'lucide-react';
// @ts-ignore
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Player, Session, Attendance, View } from '../types';
import { AttendanceModal } from './AttendanceModal';

interface GroupDetailViewProps {
  group: { id: string; label: string; color: string };
  players: Player[];
  sessions: Session[];
  attendance: Attendance[];
  onBack: () => void;
  onLaunchSession: (sessionId?: number) => void;
  onSaveAttendance: (playerId: string, status: 'present' | 'absent' | 'late') => void;
}

export const GroupDetailView: React.FC<GroupDetailViewProps> = ({
  group,
  players,
  sessions,
  attendance,
  onBack,
  onLaunchSession,
  onSaveAttendance
}) => {
  const [showAttendance, setShowAttendance] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

  const groupPlayers = useMemo(() => players.filter(p => p.group === group.id), [players, group.id]);

  // Calcul de la date de début de saison (1er Septembre)
  const seasonStart = useMemo(() => {
    const now = new Date();
    const year = now.getMonth() < 8 ? now.getFullYear() - 1 : now.getFullYear();
    return new Date(year, 8, 1); // 1er Septembre
  }, []);

  // Filtrage des séances du groupe depuis le début de saison
  const groupSessions = useMemo(() => {
    return sessions
      .filter(s => {
        const sessionDate = new Date(s.date);
        // On vérifie si la séance appartient au groupe (via son nom ou un tag si existant)
        // Ici on se base sur le fait que le coach lance souvent des séances nommées avec le groupe
        return sessionDate >= seasonStart && s.name.toLowerCase().includes(group.label.toLowerCase());
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sessions, group.label, seasonStart]);

  // Statistiques individuelles
  const playerStats = useMemo(() => {
    return groupPlayers.map(player => {
      const playerAttendance = attendance.filter(a => a.player_id === player.id && (a.status === 'present' || a.status === 'late'));
      let totalMinutes = 0;
      playerAttendance.forEach(record => {
        const session = sessions.find(s => s.id === record.session_id);
        if (session) {
          totalMinutes += Object.values(session.exercises).flat().reduce((sum, ex) => sum + (ex?.duration || 0), 0);
        }
      });
      return { ...player, hours: Math.round(totalMinutes / 60) };
    });
  }, [groupPlayers, attendance, sessions]);

  // Données pour le graphique de volume mensuel
  const chartData = useMemo(() => {
    const months = ['Sept', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'];
    const data = months.map((name, index) => {
      const monthIdx = (index + 8) % 12; // Aligner sur Septembre
      const yearOffset = index + 8 >= 12 ? 1 : 0;
      const year = seasonStart.getFullYear() + yearOffset;
      
      // Compter les présences totales du groupe pour ce mois
      const monthAttendance = attendance.filter(a => {
        const session = sessions.find(s => s.id === a.session_id);
        if (!session || !session.name.toLowerCase().includes(group.label.toLowerCase())) return false;
        const d = new Date(session.date);
        return d.getMonth() === monthIdx && d.getFullYear() === year && (a.status === 'present' || a.status === 'late');
      });

      return { name, total: monthAttendance.length };
    });
    return data;
  }, [attendance, sessions, group.label, seasonStart]);

  const handleOpenAttendance = (sessionId: number) => {
    setSelectedSessionId(sessionId);
    setShowAttendance(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {showAttendance && selectedSessionId && (
        <AttendanceModal 
          players={groupPlayers} 
          attendance={attendance.filter(a => a.session_id === selectedSessionId)} 
          onToggle={onSaveAttendance} 
          onClose={() => setShowAttendance(false)} 
          groupName={groupSessions.find(s => s.id === selectedSessionId)?.name}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
            <ArrowLeft size={20} className="dark:text-white" />
            </button>
            <div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                Groupe <span className="text-accent">{group.label}</span>
            </h2>
            <div className="flex items-center gap-3 mt-1">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${group.color}`}>
                {groupPlayers.length} Joueurs actifs
                </span>
            </div>
            </div>
        </div>
        <button 
            onClick={() => onLaunchSession()}
            className="px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl"
        >
            <PlayCircle size={20} /> Nouvelle séance
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLONNE GAUCHE : GRAPHIQUE & HISTORIQUE */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* GRAPHIQUE DE VOLUME */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter flex items-center gap-2 mb-8">
              <TrendingUp className="text-accent" size={20} /> Volume de présence mensuel
            </h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
                        <Tooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.total > 0 ? '#f97316' : '#f1f5f9'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </div>

          {/* HISTORIQUE DES SÉANCES */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter flex items-center gap-2 mb-8">
              <History className="text-blue-500" size={20} /> Séances depuis le 1er Septembre
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupSessions.length > 0 ? (
                groupSessions.map(session => (
                  <div key={session.id} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700 hover:border-accent transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{new Date(session.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</div>
                            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">{session.name}</h4>
                        </div>
                        <button 
                            onClick={() => handleOpenAttendance(session.id)}
                            className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-400 hover:text-accent transition-colors"
                            title="Modifier les présences"
                        >
                            <Users size={18} />
                        </button>
                    </div>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <Clock size={12} /> {Object.values(session.exercises).flat().reduce((sum, ex) => sum + (ex?.duration || 0), 0)} min
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                            <CheckCircle size={12} /> {attendance.filter(a => a.session_id === session.id && (a.status === 'present' || a.status === 'late')).length} Présents
                        </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucune séance enregistrée pour ce groupe cette saison</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : STATS JOUEURS */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm h-full">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter flex items-center gap-2 mb-8">
              <Users className="text-emerald-500" size={20} /> Classement Volume
            </h3>

            <div className="space-y-6">
              {playerStats.sort((a, b) => b.hours - a.hours).map((player, idx) => (
                <div key={player.id} className="space-y-2 group/player">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${idx === 0 ? 'bg-accent text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-sm group-hover/player:text-accent transition-colors">{player.first_name} {player.last_name}</div>
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{player.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900 dark:text-white italic">{player.hours}h</div>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-accent' : 'bg-emerald-500'}`} 
                      style={{ width: `${Math.min((player.hours / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};