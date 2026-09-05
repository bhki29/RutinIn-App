import { getDatabase } from "./database";
import { toISODate, todayISO } from "../utils/dateUtils";
import { calculateCurrentStreak } from "../utils/streakUtils";

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function mapHabitRow(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    durationMinutes: row.duration_minutes,
    icon: row.icon,
    color: row.color,
    repeatType: row.repeat_type,
    repeatDays: row.repeat_days ? JSON.parse(row.repeat_days) : [],
    repeatTarget: row.repeat_target,
    targetStreakMilestone: row.target_streak_milestone,
    bestStreak: row.best_streak,
    createdAt: row.created_at,
    archivedAt: row.archived_at,
  };
}

export async function createHabit({
  name,
  description,
  durationMinutes,
  icon,
  color,
  repeatType,
  repeatDays,
  repeatTarget,
  targetStreakMilestone,
}) {
  const db = await getDatabase();
  const id = generateId();
  const createdAt = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO habits (
      id, name, description, duration_minutes, icon, color,
      repeat_type, repeat_days, repeat_target, target_streak_milestone,
      best_streak, created_at, archived_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, NULL)`,
    [
      id,
      name,
      description || null,
      durationMinutes || null,
      icon,
      color,
      repeatType,
      repeatType === "specific_days" ? JSON.stringify(repeatDays || []) : null,
      repeatType === "x_per_week" ? repeatTarget || 1 : null,
      targetStreakMilestone || null,
      createdAt,
    ],
  );

  return id;
}

export async function getAllHabits() {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    `SELECT * FROM habits WHERE archived_at IS NULL ORDER BY created_at ASC`,
  );
  return rows.map(mapHabitRow);
}

export async function getHabitById(id) {
  const db = await getDatabase();
  const row = await db.getFirstAsync(`SELECT * FROM habits WHERE id = ?`, [id]);
  return row ? mapHabitRow(row) : null;
}

export async function getCheckInDatesForHabit(habitId) {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    `SELECT date FROM check_ins WHERE habit_id = ? AND completed = 1`,
    [habitId],
  );
  return new Set(rows.map((r) => r.date));
}

export async function toggleCheckIn(habitId, dateISO = todayISO()) {
  const db = await getDatabase();
  const existing = await db.getFirstAsync(
    `SELECT id FROM check_ins WHERE habit_id = ? AND date = ?`,
    [habitId, dateISO],
  );

  if (existing) {
    await db.runAsync(`DELETE FROM check_ins WHERE id = ?`, [existing.id]);
    return false;
  }

  const id = `${habitId}-${dateISO}`;
  await db.runAsync(
    `INSERT INTO check_ins (id, habit_id, date, completed) VALUES (?, ?, ?, 1)`,
    [id, habitId, dateISO],
  );
  return true;
}

export async function getTotalCheckInsCount() {
  const db = await getDatabase();
  const row = await db.getFirstAsync(
    `SELECT COUNT(*) as total FROM check_ins WHERE completed = 1`,
  );
  return row?.total || 0;
}

export async function recalculateStreaks(habitId) {
  const db = await getDatabase();
  const habit = await getHabitById(habitId);
  if (!habit) return { currentStreak: 0, bestStreak: 0 };

  const checkInSet = await getCheckInDatesForHabit(habitId);
  const currentStreak = calculateCurrentStreak(habit, checkInSet);
  const bestStreak = Math.max(currentStreak, habit.bestStreak || 0);

  if (bestStreak !== habit.bestStreak) {
    await db.runAsync(`UPDATE habits SET best_streak = ? WHERE id = ?`, [
      bestStreak,
      habitId,
    ]);
  }

  return { currentStreak, bestStreak };
}

export async function getOverallBestStreak() {
  const db = await getDatabase();
  const row = await db.getFirstAsync(
    `SELECT MAX(best_streak) as best FROM habits WHERE archived_at IS NULL`,
  );
  return row?.best || 0;
}

export async function getHabitsWithStats() {
  const habits = await getAllHabits();

  const withStats = await Promise.all(
    habits.map(async (habit) => {
      const checkInSet = await getCheckInDatesForHabit(habit.id);
      const currentStreak = calculateCurrentStreak(habit, checkInSet);
      return { ...habit, checkInSet, currentStreak };
    }),
  );

  return withStats;
}

export { toISODate };
