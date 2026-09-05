import { toISODate, addDays, dayIndexOf, getWeekKey } from "./dateUtils";

export function isDayScheduled(habit, date) {
  if (habit.repeatType === "everyday") return true;
  if (habit.repeatType === "x_per_week") return true;
  if (habit.repeatType === "specific_days") {
    const days = habit.repeatDays || [];
    return days.includes(dayIndexOf(date));
  }
  return false;
}

function calculateDailyStreak(habit, checkInSet) {
  let streak = 0;
  let cursor = new Date();

  if (isDayScheduled(habit, cursor) && !checkInSet.has(toISODate(cursor))) {
    cursor = addDays(cursor, -1);
  }

  // Batas aman supaya tidak loop tak terbatas
  const MAX_LOOKBACK_DAYS = 3650;

  for (let i = 0; i < MAX_LOOKBACK_DAYS; i++) {
    if (!isDayScheduled(habit, cursor)) {
      cursor = addDays(cursor, -1);
      continue;
    }

    if (checkInSet.has(toISODate(cursor))) {
      streak += 1;
      cursor = addDays(cursor, -1);
    } else {
      break;
    }
  }

  return streak;
}

function calculateWeeklyStreak(habit, checkInSet) {
  const target = habit.repeatTarget || 1;
  const weekCounts = new Map();

  for (const dateStr of checkInSet) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const key = getWeekKey(date);
    weekCounts.set(key, (weekCounts.get(key) || 0) + 1);
  }

  let streak = 0;
  let cursor = new Date();
  let cursorKey = getWeekKey(cursor);

  if ((weekCounts.get(cursorKey) || 0) >= target) {
    streak += 1;
  }
  cursor = addDays(cursor, -7);

  const MAX_LOOKBACK_WEEKS = 520;

  for (let i = 0; i < MAX_LOOKBACK_WEEKS; i++) {
    cursorKey = getWeekKey(cursor);
    const count = weekCounts.get(cursorKey) || 0;

    if (count >= target) {
      streak += 1;
      cursor = addDays(cursor, -7);
    } else {
      break;
    }
  }

  return streak;
}

export function calculateCurrentStreak(habit, checkInSet) {
  if (habit.repeatType === "x_per_week") {
    return calculateWeeklyStreak(habit, checkInSet);
  }
  return calculateDailyStreak(habit, checkInSet);
}

export function calculatePercentDone(habit, checkInSet, createdAt) {
  const created = new Date(createdAt);
  const today = new Date();

  let targetCount = 0;
  let actualCount = 0;

  if (habit.repeatType === "x_per_week") {
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeksElapsed = Math.max(1, Math.ceil((today - created) / msPerWeek));
    targetCount = weeksElapsed * (habit.repeatTarget || 1);
    actualCount = checkInSet.size;
  } else {
    let cursor = new Date(created);
    while (cursor <= today) {
      if (isDayScheduled(habit, cursor)) {
        targetCount += 1;
        if (checkInSet.has(toISODate(cursor))) {
          actualCount += 1;
        }
      }
      cursor = addDays(cursor, 1);
    }
  }

  if (targetCount === 0) return 0;
  return Math.round((actualCount / targetCount) * 100);
}

export function getRepeatLabel(habit) {
  if (habit.repeatType === "everyday") return "Daily habit";

  if (habit.repeatType === "x_per_week") {
    const target = habit.repeatTarget || 1;
    return `${target} times a week target`;
  }

  if (habit.repeatType === "specific_days") {
    const days = (habit.repeatDays || []).slice().sort((a, b) => a - b);
    const WEEKDAYS = [1, 2, 3, 4, 5];
    const WEEKENDS = [0, 6];

    const isSameSet = (a, b) =>
      a.length === b.length && a.every((v, i) => v === b[i]);

    if (isSameSet(days, WEEKDAYS)) return "Weekdays";
    if (isSameSet(days, WEEKENDS)) return "Weekends";
    if (days.length === 7) return "Daily habit";

    const NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days.map((d) => NAMES[d]).join(", ");
  }

  return "";
}
