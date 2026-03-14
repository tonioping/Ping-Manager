export const getSeasonWeeks = (startDateStr: string) => {
  const start = new Date(startDateStr);
  start.setHours(12, 0, 0, 0);
  
  const end = new Date(start.getFullYear() + (start.getMonth() >= 8 ? 1 : 0), 6, 14); // 14 Juillet
  end.setHours(12, 0, 0, 0);
  
  const weeks = [];
  let current = new Date(start);
  
  while (current <= end) {
    weeks.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }
  
  return weeks;
};

export const isZoneAHoliday = (date: Date) => {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  const time = d.getTime();
  
  // Vacances Zone A 2026 - Dates ajustées pour finir le dimanche (évite la 3ème semaine fantôme)
  const holidays = [
    // Fin de saison 2025-2026
    { name: 'Hiver', start: new Date(2026, 1, 7), end: new Date(2026, 1, 22) },
    { name: 'Printemps', start: new Date(2026, 3, 11), end: new Date(2026, 3, 26) },
    { name: 'Pont Ascension', start: new Date(2026, 4, 14), end: new Date(2026, 4, 17) },
    { name: 'Grandes Vacances', start: new Date(2026, 6, 4), end: new Date(2026, 8, 31) },
    
    // Début de saison 2026-2027
    { name: 'Toussaint', start: new Date(2026, 9, 17), end: new Date(2026, 11, 1) },
    { name: 'Noël', start: new Date(2026, 11, 19), end: new Date(2027, 0, 3) },
    
    // Rappel 2025
    { name: 'Toussaint 25', start: new Date(2025, 9, 18), end: new Date(2025, 11, 2) },
    { name: 'Noël 25', start: new Date(2025, 11, 20), end: new Date(2026, 0, 4) },
  ];

  return holidays.find(h => {
    const s = new Date(h.start); s.setHours(0, 0, 0, 0);
    const e = new Date(h.end); e.setHours(23, 59, 59, 999);
    return time >= s.getTime() && time <= e.getTime();
  });
};

export const getMonthName = (date: Date) => {
  return date.toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase();
};