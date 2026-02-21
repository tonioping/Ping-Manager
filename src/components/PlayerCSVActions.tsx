import React, { useRef } from 'react';
import { Upload, Download } from 'lucide-react';
import { Player } from '../types';
import { exportPlayersToCSV, parsePlayersCSV } from '../utils/csvHelper';

interface PlayerCSVActionsProps {
  players: Player[];
  onImport: (players: Partial<Player>[]) => void;
}

export const PlayerCSVActions: React.FC<PlayerCSVActionsProps> = ({ players, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const importedPlayers = parsePlayersCSV(text);
      if (importedPlayers.length > 0) {
        onImport(importedPlayers);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="flex gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />
      <button
        onClick={handleImportClick}
        className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm border border-slate-200 dark:border-slate-700"
        title="Importer depuis CSV"
      >
        <Upload size={16} className="text-accent" />
        <span className="hidden md:inline">Importer CSV</span>
      </button>
      <button
        onClick={() => exportPlayersToCSV(players)}
        className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm border border-slate-200 dark:border-slate-700"
        title="Exporter en CSV"
      >
        <Download size={16} className="text-accent" />
        <span className="hidden md:inline">Exporter CSV</span>
      </button>
    </div>
  );
};