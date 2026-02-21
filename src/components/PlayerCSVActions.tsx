import React, { useRef } from 'react';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
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
    // Reset input
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
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
        title="Importer depuis CSV"
      >
        <Upload size={16} />
        <span className="hidden sm:inline">Importer</span>
      </button>
      <button
        onClick={() => exportPlayersToCSV(players)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
        title="Exporter en CSV"
      >
        <Download size={16} />
        <span className="hidden sm:inline">Exporter</span>
      </button>
    </div>
  );
};