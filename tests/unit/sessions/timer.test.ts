/**
 * Timer Core Unit Tests
 */

import { describe, it, expect } from "vitest";
import {
  timerReducer,
  INITIAL_TIMER_STATE,
  getRemainingSeconds,
  getProgress,
  isComplete,
} from "@/core/sessions/timer";

describe("timerReducer", () => {
  it("should initialize with default state", () => {
    expect(INITIAL_TIMER_STATE.isRunning).toBe(false);
    expect(INITIAL_TIMER_STATE.isPaused).toBe(false);
    expect(INITIAL_TIMER_STATE.elapsedSeconds).toBe(0);
    expect(INITIAL_TIMER_STATE.targetSeconds).toBe(null);
  });

  it("should start timer with target seconds", () => {
    const state = timerReducer(INITIAL_TIMER_STATE, {
      type: "START",
      targetSeconds: 1500,
    });

    expect(state.isRunning).toBe(true);
    expect(state.isPaused).toBe(false);
    expect(state.elapsedSeconds).toBe(0);
    expect(state.targetSeconds).toBe(1500);
    expect(state.startedAt).toBeTruthy();
  });

  it("should start timer without target (flow mode)", () => {
    const state = timerReducer(INITIAL_TIMER_STATE, {
      type: "START",
      targetSeconds: null,
    });

    expect(state.isRunning).toBe(true);
    expect(state.targetSeconds).toBe(null);
  });

  it("should pause running timer", () => {
    const started = timerReducer(INITIAL_TIMER_STATE, {
      type: "START",
      targetSeconds: 1500,
    });
    const paused = timerReducer(started, { type: "PAUSE" });

    expect(paused.isPaused).toBe(true);
    expect(paused.pausedAt).toBeTruthy();
  });

  it("should not pause if not running", () => {
    const result = timerReducer(INITIAL_TIMER_STATE, { type: "PAUSE" });
    expect(result.isPaused).toBe(false);
  });

  it("should not pause if already paused", () => {
    const started = timerReducer(INITIAL_TIMER_STATE, {
      type: "START",
      targetSeconds: 1500,
    });
    const paused = timerReducer(started, { type: "PAUSE" });
    const doublePaused = timerReducer(paused, { type: "PAUSE" });

    expect(doublePaused).toEqual(paused);
  });

  it("should resume paused timer", () => {
    const started = timerReducer(INITIAL_TIMER_STATE, {
      type: "START",
      targetSeconds: 1500,
    });
    const paused = timerReducer(started, { type: "PAUSE" });
    const resumed = timerReducer(paused, { type: "RESUME" });

    expect(resumed.isPaused).toBe(false);
    expect(resumed.pausedAt).toBe(null);
  });

  it("should stop running timer", () => {
    const started = timerReducer(INITIAL_TIMER_STATE, {
      type: "START",
      targetSeconds: 1500,
    });
    const stopped = timerReducer(started, { type: "STOP" });

    expect(stopped.isRunning).toBe(false);
    expect(stopped.isPaused).toBe(false);
  });

  it("should reset to initial state", () => {
    const started = timerReducer(INITIAL_TIMER_STATE, {
      type: "START",
      targetSeconds: 1500,
    });
    const reset = timerReducer(started, { type: "RESET" });

    expect(reset).toEqual(INITIAL_TIMER_STATE);
  });
});

describe("getRemainingSeconds", () => {
  it("should return null for count-up mode", () => {
    const state = { ...INITIAL_TIMER_STATE, targetSeconds: null };
    expect(getRemainingSeconds(state)).toBe(null);
  });

  it("should return target when not started", () => {
    const state = { ...INITIAL_TIMER_STATE, targetSeconds: 1500, elapsedSeconds: 0 };
    expect(getRemainingSeconds(state)).toBe(1500);
  });

  it("should return remaining time", () => {
    const state = { ...INITIAL_TIMER_STATE, targetSeconds: 1500, elapsedSeconds: 600 };
    expect(getRemainingSeconds(state)).toBe(900);
  });

  it("should not return negative values", () => {
    const state = { ...INITIAL_TIMER_STATE, targetSeconds: 100, elapsedSeconds: 150 };
    expect(getRemainingSeconds(state)).toBe(0);
  });
});

describe("getProgress", () => {
  it("should return null for count-up mode", () => {
    const state = { ...INITIAL_TIMER_STATE, targetSeconds: null };
    expect(getProgress(state)).toBe(null);
  });

  it("should return 0 when not started", () => {
    const state = { ...INITIAL_TIMER_STATE, targetSeconds: 1500, elapsedSeconds: 0 };
    expect(getProgress(state)).toBe(0);
  });

  it("should return progress ratio", () => {
    const state = { ...INITIAL_TIMER_STATE, targetSeconds: 1500, elapsedSeconds: 750 };
    expect(getProgress(state)).toBe(0.5);
  });

  it("should return 1 when complete", () => {
    const state = { ...INITIAL_TIMER_STATE, targetSeconds: 1500, elapsedSeconds: 1500 };
    expect(getProgress(state)).toBe(1);
  });
});

describe("isComplete", () => {
  it("should return false for count-up mode", () => {
    const state = { ...INITIAL_TIMER_STATE, targetSeconds: null, isRunning: false };
    expect(isComplete(state)).toBe(false);
  });

  it("should return false when still running", () => {
    const state = { ...INITIAL_TIMER_STATE, targetSeconds: 100, elapsedSeconds: 100, isRunning: true };
    expect(isComplete(state)).toBe(false);
  });

  it("should return true when target reached and stopped", () => {
    const state = { ...INITIAL_TIMER_STATE, targetSeconds: 100, elapsedSeconds: 100, isRunning: false };
    expect(isComplete(state)).toBe(true);
  });
});
