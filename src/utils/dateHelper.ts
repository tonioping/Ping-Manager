export const getSeasonWeeks = (startDateStr: string) => {
  const start = new Date(startDateStr);
  const end = new Date(start.getFullYear() + (start.getMonth() >= 8 ? 1 : 0), 6, 14); // 14 Juillet
  
  const weeks = [];
  let current = new Date(start);
  
  while (current <= end) {
    weeks.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }
  
  return weeks;
};

export const isZoneAHoliday = (date: Date) => {
  const time = date.getTime();
  const year = date.getFullYear();
  
  // Vacances Zone A 2024-2025 (Bordeaux)
  const holidays = [
    { name: 'Toussaint', start: new Date(2024, 9, 19), end: new Date(2024, 10, 4) },
    { name: 'Noël', start: new Date(2024, 11, 21), end: new Date(2025, 0, 6) },
    { name: 'Hiver', start: new Date(2025, 1, 22), end: new Date(2025, 2, 10) },
    { name: 'Printemps', start: new Date(2025, 3, 19), end: new Date(2025, 4, 5) },
    { name: 'Été', start: new Date(2025, 6, 5), end: new Date(2025, 8, 1) },
  ];

  return holidays.find(h => time >= h.start.getTime() && time <= h.end.getTime());
};

export const getMonthName = (date: Date) => {
  return date.toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase();
};