export const getTodayDate = () => new Date().toISOString().split('T')[0];

export const getDateOffset = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};