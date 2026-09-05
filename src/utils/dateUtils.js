export function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function addDays(date, n) {
  const result = new Date(date);
  result.setDate(result.getDate() + n);
  return result;
}

export function dayIndexOf(date) {
  return date.getDay();
}

export const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function dayLabel(dayIndex) {
  return DAY_LABELS[dayIndex];
}

export function getWeekDates(date, weekStartsOn = 1) {
  const current = dayIndexOf(date);
  const diffToStart = (current - weekStartsOn + 7) % 7;
  const start = addDays(date, -diffToStart);

  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function isSameDay(a, b) {
  return toISODate(a) === toISODate(b);
}

export function getWeekKey(date, weekStartsOn = 1) {
  const [monday] = getWeekDates(date, weekStartsOn);
  return toISODate(monday);
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function getMonthYearLabel(date) {
  return `${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`;
}
