export const getTodayDateKey = (): string => new Date().toISOString().slice(0, 10);

export const getWeekStartDateKey = (inputDate = new Date()): string => {
  const date = new Date(inputDate);
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setUTCDate(date.getUTCDate() + diff);
  return date.toISOString().slice(0, 10);
};
