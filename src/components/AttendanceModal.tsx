import React from 'react';
import { X, Check, UserX, Clock, Users } from 'lucide-react';
import { Player, Attendance } from '../types';

interface AttendanceModalProps {
  players: Player[];
  attendance: Attendance[];
  onToggle: (playerId: string, status: 'present' | 'absent' | 'late') => void;
  onClose: () => void;
  groupName?: string;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({ players, attendance, onToggle, onClose, groupName }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter flex items-center gap-2"><Users className="text-accent" size={20}/> Faire l'appel</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{groupName || 'Tous les joueurs'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm"><X size={20} className="text-slate-400"/></button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-3">
          {players.length === 0 ? <p className="text-center py-8 text-slate-400 font-bold uppercase text-xs tracking-widest">Aucun joueur dans ce groupe</p> : players.map(player => {
              const record = attendance.find(a => a.player_id === player.id);
              const status = record?.status || 'absent';
              return (
                <div key={player.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${status === 'present' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>{player.first_name[0]}{player.last_name[0]}</div>
                    <span className="font-bold text-slate-900 dark:text-white">{player.first_name} {player.last_name}</span>
                  </div>
                  <div className="flex gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <button onClick={() => onToggle(player.id, 'present')} className={`p-2 rounded-lg transition-all ${status === 'present' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-300 hover:text-emerald-500'}`} title="Présent"><Check size={18} /></button>
                    <button onClick={() => onToggle(player.id, 'late')} className={`p-2 rounded-lg transition-all ${status === 'late' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-300 hover:text-amber-500'}`} title="En retard"><Clock size={18} /></button>
                    <button onClick={() => onToggle(player.id, 'absent')} className={`p-2 rounded-lg transition-all ${status === 'absent' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-300 hover:text-rose-500'}`} title="Absent"><UserX size={18} /></button>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="p-6 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 flex justify-center">
           <button onClick={onClose} className="px-8 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-black text-[10px] tracking-widest uppercase shadow-xl hover:scale-105 transition-all">Terminer l'appel</button>
        </div>
      </div>
    </div>
  );
};