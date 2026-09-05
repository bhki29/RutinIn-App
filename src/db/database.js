import * as SQLite from "expo-sqlite";

const DB_NAME = "rutinin.db";

let dbInstance = null;

export async function getDatabase() {
  if (dbInstance) return dbInstance;
  dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  return dbInstance;
}

export async function initDatabase() {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      duration_minutes INTEGER,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      repeat_type TEXT NOT NULL CHECK (repeat_type IN ('everyday', 'specific_days', 'x_per_week')),
      repeat_days TEXT,
      repeat_target INTEGER,
      target_streak_milestone INTEGER,
      best_streak INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      archived_at TEXT
    );

    CREATE TABLE IF NOT EXISTS check_ins (
      id TEXT PRIMARY KEY NOT NULL,
      habit_id TEXT NOT NULL,
      date TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE,
      UNIQUE (habit_id, date)
    );

    CREATE INDEX IF NOT EXISTS idx_check_ins_habit_date ON check_ins (habit_id, date);
  `);

  return db;
}
