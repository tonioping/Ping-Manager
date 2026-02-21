import { Player } from '../types';

export const exportPlayersToCSV = (players: Player[]) => {
  const headers = ['Prénom', 'Nom', 'Niveau', 'Groupe', 'Main', 'Prise', 'Bois', 'Dernier Changement Matériel'];
  const rows = players.map(p => [
    p.first_name,
    p.last_name,
    p.level,
    p.group || '',
    p.hand || '',
    p.grip || '',
    p.blade || '',
    p.last_equipment_change || ''
  ]);

  // Utilisation du point-virgule pour la compatibilité Excel FR
  const csvContent = [
    headers.join(';'),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
  ].join('\n');

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

  // Détection du séparateur (, ou ;)
  const firstLine = lines[0];
  const separator = firstLine.includes(';') ? ';' : ',';
  
  const headers = firstLine.split(separator).map(h => h.trim().replace(/"/g, ''));
  const players: Partial<Player>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(separator).map(v => v.trim().replace(/"/g, ''));
    // On ne génère pas d'ID ici pour laisser Supabase le faire si c'est une nouvelle insertion
    const player: any = {};

    values.forEach((val, idx) => {
      const header = headers[idx]?.toLowerCase() || '';
      
      if (header.includes('prénom') || idx === 0) player.first_name = val;
      else if (header.includes('nom') || idx === 1) player.last_name = val;
      else if (header.includes('niveau') || idx === 2) {
          // Normalisation du niveau pour correspondre aux types attendus
          if (val.toLowerCase().includes('déb') || val.toLowerCase().includes('deb')) player.level = 'Debutants';
          else if (val.toLowerCase().includes('int')) player.level = 'Intermediaire';
          else if (val.toLowerCase().includes('ava')) player.level = 'Avance';
          else if (val.toLowerCase().includes('eli')) player.level = 'Elite';
          else player.level = 'Debutants';
      }
      else if (header.includes('groupe') || idx === 3) player.group = val;
      else if (header.includes('main') || idx === 4) player.hand = val;
      else if (header.includes('prise') || idx === 5) player.grip = val;
      else if (header.includes('bois') || idx === 6) player.blade = val;
      else if (header.includes('matériel') || idx === 7) {
          // Validation basique de la date (YYYY-MM-DD)
          if (val && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
              player.last_equipment_change = val;
          }
      }
    });

    if (player.first_name && player.last_name) {
      players.push(player);
    }
  }

  return players;
};