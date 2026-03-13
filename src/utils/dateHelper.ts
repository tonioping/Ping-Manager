export const getSeasonWeeks = (startDateStr: string) => {
  const start = new Date(startDateStr);
  // On s'assure de commencer à midi pour éviter les problèmes de fuseau horaire
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
  // On compare uniquement les dates (Y-M-D) pour éviter les décalages d'heures
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  const time = d.getTime();
  
  // Vacances Zone A 2024-2025 (Bordeaux, Lyon, etc.)
  const holidays = [
    { name: 'Toussaint', start: new Date(2024, 9, 19), end: new Date(2024, 10, 3) },
    { name: 'Noël', start: new Date(2024, 11, 21), end: new Date(2025, 0, 5) },
    { name: 'Hiver', start: new Date(2025, 1, 22), end: new Date(2025, 3, 9) },
    { name: 'Printemps', start: new Date(2025, 3, 19), end: new Date(2025, 4, 4) },
    { name: 'Pont Ascension', start: new Date(2025, 4, 28), end: new Date(2025, 5, 1) },
    { name: 'Grandes Vacances', start: new Date(2025, 6, 5), end: new Date(2025, 8, 1) },
  ];

  // On ajuste les dates de début/fin à midi pour la comparaison
  return holidays.find(h => {
    const s = new Date(h.start); s.setHours(0, 0, 0, 0);
    const e = new Date(h.end); e.setHours(23, 59, 59, 999);
    return time >= s.getTime() && time <= e.getTime();
  });
};

export const getMonthName = (date: Date) => {
  return date.toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase();
};