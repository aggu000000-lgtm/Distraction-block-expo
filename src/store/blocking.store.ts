/**
 * FocusGuard Blocking Store
 *
 * Manages tracked apps and block rules.
 */

import { create } from "zustand";
import type { BlockRule, FrictionLevel, TrackedApp } from "@/types/domain";
import { insertOne, findAll, deleteOne } from "@/lib/storage";

type BlockingState = {
  apps: TrackedApp[];
  rules: BlockRule[];
  isShieldActive: boolean;
  isLoading: boolean;
};

type BlockingActions = {
  // App actions
  loadApps: () => void;
  addApp: (app: TrackedApp) => void;
  removeApp: (id: string) => void;
  toggleAppTracked: (id: string) => void;

  // Rule actions
  loadRules: () => void;
  addRule: (rule: BlockRule) => void;
  updateRule: (rule: BlockRule) => void;
  removeRule: (id: string) => void;
  toggleRuleActive: (id: string) => void;

  // Shield actions
  setShieldActive: (active: boolean) => void;
};

export const useBlockingStore = create<BlockingState & BlockingActions>((set, get) => ({
  // ─── State ─────────────────────────────────────────────────────────────────
  apps: [],
  rules: [],
  isShieldActive: false,
  isLoading: false,

  // ─── App Actions ───────────────────────────────────────────────────────────

  loadApps: () => {
    const apps = findAll<TrackedApp>("tracked_apps");
    set({ apps });
  },

  addApp: (app) => {
    insertOne("tracked_apps", app);
    set((state) => ({ apps: [...state.apps, app] }));
  },

  removeApp: (id) => {
    deleteOne("tracked_apps", id);
    set((state) => ({ apps: state.apps.filter((a) => a.id !== id) }));
  },

  toggleAppTracked: (id) => {
    const { apps } = get();
    const app = apps.find((a) => a.id === id);
    if (!app) return;

    const updated = { ...app, isTracked: !app.isTracked };
    insertOne("tracked_apps", updated);
    set((state) => ({
      apps: state.apps.map((a) => (a.id === id ? updated : a)),
    }));
  },

  // ─── Rule Actions ──────────────────────────────────────────────────────────

  loadRules: () => {
    const rules = findAll<BlockRule>("block_rules");
    set({ rules });
  },

  addRule: (rule) => {
    insertOne("block_rules", rule);
    set((state) => ({ rules: [...state.rules, rule] }));
  },

  updateRule: (rule) => {
    insertOne("block_rules", rule);
    set((state) => ({
      rules: state.rules.map((r) => (r.id === rule.id ? rule : r)),
    }));
  },

  removeRule: (id) => {
    deleteOne("block_rules", id);
    set((state) => ({ rules: state.rules.filter((r) => r.id !== id) }));
  },

  toggleRuleActive: (id) => {
    const { rules } = get();
    const rule = rules.find((r) => r.id === id);
    if (!rule) return;

    const updated = { ...rule, isActive: !rule.isActive };
    insertOne("block_rules", updated);
    set((state) => ({
      rules: state.rules.map((r) => (r.id === id ? updated : r)),
    }));
  },

  // ─── Shield Actions ────────────────────────────────────────────────────────

  setShieldActive: (active) => {
    set({ isShieldActive: active });
  },
}));
