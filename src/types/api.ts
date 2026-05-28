/**
 * FocusGuard API Types (Phase 3 — Supabase)
 *
 * Response shapes for cloud sync. Not used in Phase 1/2.
 */

export type SupabaseResponse<T> =
  | { data: T; error: null }
  | { data: null; error: SupabaseError };

export type SupabaseError = {
  message: string;
  status: number;
  code?: string;
};

export type SyncPayload = {
  sessions: unknown[];
  usageEvents: unknown[];
  blockRules: unknown[];
  lastSyncedAt: number;
};
