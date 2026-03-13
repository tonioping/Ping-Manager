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
  
  // Vacances Zone A - Calendrier 2025-2026 et début 2026-2027
  const holidays = [
    // Fin de saison 2025-2026
    { name: 'Hiver', start: new Date(2026, 1, 7), end: new Date(2026, 1, 23) },
    { name: 'Printemps', start: new Date(2026, 3, 11), end: new Date(2026, 3, 27) },
    { name: 'Pont Ascension', start: new Date(2026, 4, 14), end: new Date(2026, 4, 17) },
    { name: 'Grandes Vacances', start: new Date(2026, 6, 4), end: new Date(2026, 8, 1) },
    
    // Début de saison 2026-2027
    { name: 'Toussaint', start: new Date(2026, 9, 17), end: new Date(2026, 10, 2) },
    { name: 'Noël', start: new Date(2026, 11, 19), end: new Date(2027, 0, 4) },
    
    // Rappel 2025 pour les cycles commencés plus tôt
    { name: 'Toussaint 25', start: new Date(2025, 9, 18), end: new Date(2025, 10, 3) },
    { name: 'Noël 25', start: new Date(2025, 11, 20), end: new Date(2026, 0, 5) },
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