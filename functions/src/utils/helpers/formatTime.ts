export const formatTime = (date: string) => {
  const _date = new Date(date);

  const day = _date.getDate();
  const month = _date.getMonth() + 1;
  const year = _date.getFullYear();
  return `${day.toString().padStart(2, "0")}-${month.toString().padStart(2, "0")}-${year}`;
};
