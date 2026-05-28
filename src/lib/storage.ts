/**
 * FocusGuard Storage Layer
 *
 * JSI-SQLite wrapper with typed keys.
 * Synchronous reads — no async, no NOBRIDGE errors.
 */

import * as SQLite from "expo-sqlite";

const DB_NAME = "focusguard.db";

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize the database. Must be called before any storage operations.
 */
export async function initStorage(): Promise<void> {
  db = await SQLite.openDatabaseAsync(DB_NAME);

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS tracked_apps (
      id TEXT PRIMARY KEY NOT NULL,
      data TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );

    CREATE TABLE IF NOT EXISTS block_rules (
      id TEXT PRIMARY KEY NOT NULL,
      data TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );

    CREATE TABLE IF NOT EXISTS focus_sessions (
      id TEXT PRIMARY KEY NOT NULL,
      data TEXT NOT NULL,
      started_at INTEGER NOT NULL,
      ended_at INTEGER,
      outcome TEXT NOT NULL DEFAULT 'ongoing',
      created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );

    CREATE TABLE IF NOT EXISTS usage_events (
      id TEXT PRIMARY KEY NOT NULL,
      data TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );

    CREATE TABLE IF NOT EXISTS day_reports (
      date TEXT PRIMARY KEY NOT NULL,
      data TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );

    CREATE TABLE IF NOT EXISTS kv_store (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );
  `);
}

/**
 * Get the database instance. Throws if not initialized.
 */
function getDB(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error("Storage not initialized. Call initStorage() first.");
  }
  return db;
}

// ─── KV Store (for user preferences, streak data, etc.) ──────────────────────

export function kvGet<T>(key: string): T | null {
  const row = getDB().getFirstSync<{ value: string }>(
    "SELECT value FROM kv_store WHERE key = ?",
    key,
  );
  return row ? (JSON.parse(row.value) as T) : null;
}

export function kvSet<T>(key: string, value: T): void {
  getDB().runSync(
    "INSERT OR REPLACE INTO kv_store (key, value, updated_at) VALUES (?, ?, ?)",
    key,
    JSON.stringify(value),
    Date.now(),
  );
}

export function kvDelete(key: string): void {
  getDB().runSync("DELETE FROM kv_store WHERE key = ?", key);
}

// ─── Generic CRUD ────────────────────────────────────────────────────────────

type TableName = "tracked_apps" | "block_rules" | "focus_sessions" | "usage_events";

export function insertOne<T extends { id: string }>(table: TableName, entity: T): void {
  getDB().runSync(
    `INSERT OR REPLACE INTO ${table} (id, data) VALUES (?, ?)`,
    entity.id,
    JSON.stringify(entity),
  );
}

export function findOne<T>(table: TableName, id: string): T | null {
  const row = getDB().getFirstSync<{ data: string }>(
    `SELECT data FROM ${table} WHERE id = ?`,
    id,
  );
  return row ? (JSON.parse(row.data) as T) : null;
}

export function findAll<T>(table: TableName): T[] {
  const rows = getDB().getAllSync<{ data: string }>(`SELECT data FROM ${table}`);
  return rows.map((row) => JSON.parse(row.data) as T);
}

export function deleteOne(table: TableName, id: string): void {
  getDB().runSync(`DELETE FROM ${table} WHERE id = ?`, id);
}

export function deleteAll(table: TableName): void {
  getDB().runSync(`DELETE FROM ${table}`);
}

// ─── Day Reports (special handling) ──────────────────────────────────────────

export function getDayReport(date: string): Record<string, unknown> | null {
  const row = getDB().getFirstSync<{ data: string }>(
    "SELECT data FROM day_reports WHERE date = ?",
    date,
  );
  return row ? JSON.parse(row.data) : null;
}

export function saveDayReport(date: string, data: Record<string, unknown>): void {
  getDB().runSync(
    "INSERT OR REPLACE INTO day_reports (date, data) VALUES (?, ?)",
    date,
    JSON.stringify(data),
  );
}
