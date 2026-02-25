import { Player } from '../types';

export const exportPlayersToCSV = (players: Player[]) => {
  const headers = ['Prénom', 'Nom', 'Niveau', 'Groupe', 'Main', 'Prise', 'Bois', 'Dernier Changement Matériel'];
  const rows = players.map(p => [p.first_name, p.last_name, p.level, p.group || '', p.hand || '', p.grip || '', p.blade || '', p.last_equipment_change || '']);
  const csvContent = [headers.join(';'), ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `export_joueurs_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parsePlayersCSV = (csvText: string): Partial<Player>[] => {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];
  const separator = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(separator).map(h => h.trim().replace(/"/g, ''));
  const players: Partial<Player>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(separator).map(v => v.trim().replace(/"/g, ''));
    const player: any = {};
    values.forEach((val, idx) => {
      const header = headers[idx]?.toLowerCase() || '';
      if (header.includes('prénom') || idx === 0) player.first_name = val;
      else if (header.includes('nom') || idx === 1) player.last_name = val;
      else if (header.includes('niveau') || idx === 2) player.level = val.toLowerCase().includes('déb') ? 'Debutants' : 'Intermediaire';
      else if (header.includes('groupe') || idx === 3) player.group = val;
    });
    if (player.first_name && player.last_name) players.push(player);
  }
  return players;
};