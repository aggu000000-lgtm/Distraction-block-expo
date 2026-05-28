/**
 * FocusGuard useBlockingStatus Hook
 *
 * Composes blocking engine with current context.
 */

import { useMemo } from "react";
import { useBlockingStore } from "@/store/blocking.store";
import { useSessionStore } from "@/store/session.store";
import { useUserStore } from "@/store/user.store";
import { evaluateBlocking, type BlockingDecision } from "@/core/blocking/engine";

export function useBlockingStatus(appId: string) {
  const { apps, rules, isShieldActive } = useBlockingStore();
  const { isRunning } = useSessionStore();
  const { streak } = useUserStore();

  const decision: BlockingDecision = useMemo(() => {
    if (!isShieldActive) {
      return { action: "allow" };
    }

    return evaluateBlocking(appId, apps, rules, isRunning, streak.current);
  }, [appId, apps, rules, isShieldActive, isRunning, streak.current]);

  return {
    isBlocked: decision.action === "friction",
    decision,
    frictionLevel: decision.action === "friction" ? decision.level : null,
    rule: decision.action === "friction" ? decision.rule : null,
  };
}
