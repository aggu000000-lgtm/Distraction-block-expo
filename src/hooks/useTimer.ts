/**
 * FocusGuard useTimer Hook
 *
 * Composes core timer logic with React lifecycle.
 * Handles background/foreground transitions.
 */

import { useEffect, useRef, useCallback, useReducer } from "react";
import { AppState, type AppStateStatus } from "react-native";
import {
  timerReducer,
  INITIAL_TIMER_STATE,
  getRemainingSeconds,
  getProgress,
  isComplete,
} from "@/core/sessions/timer";
import { useSessionStore } from "@/store/session.store";

export function useTimer() {
  const [state, dispatch] = useReducer(timerReducer, INITIAL_TIMER_STATE);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const backgroundedAtRef = useRef<number | null>(null);

  const { tick } = useSessionStore();

  // ─── Timer Loop ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (state.isRunning && !state.isPaused) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: "TICK" });
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.isPaused, tick]);

  // ─── Background Handling ──────────────────────────────────────────────────

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appStateRef.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        // App going to background
        backgroundedAtRef.current = Date.now();
      }

      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState.match(/active/)
      ) {
        // App coming to foreground
        if (backgroundedAtRef.current && state.isRunning && !state.isPaused) {
          // Calculate elapsed time while backgrounded
          const backgroundDuration = Date.now() - backgroundedAtRef.current;
          const missedTicks = Math.floor(backgroundDuration / 1000);

          // Dispatch multiple ticks to catch up (but fast)
          for (let i = 0; i < missedTicks; i++) {
            dispatch({ type: "TICK" });
          }
        }
        backgroundedAtRef.current = null;
      }

      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, [state.isRunning, state.isPaused]);

  // ─── Actions ──────────────────────────────────────────────────────────────

  const start = useCallback((targetSeconds: number | null) => {
    dispatch({ type: "START", targetSeconds });
  }, []);

  const pause = useCallback(() => {
    dispatch({ type: "PAUSE" });
  }, []);

  const resume = useCallback(() => {
    dispatch({ type: "RESUME" });
  }, []);

  const stop = useCallback(() => {
    dispatch({ type: "STOP" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  // ─── Derived State ────────────────────────────────────────────────────────

  return {
    // State
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    elapsedSeconds: state.elapsedSeconds,
    targetSeconds: state.targetSeconds,

    // Derived
    remainingSeconds: getRemainingSeconds(state),
    progress: getProgress(state),
    isComplete: isComplete(state),

    // Actions
    start,
    pause,
    resume,
    stop,
    reset,
  };
}
