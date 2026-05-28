/**
 * FocusGuard Notification Scheduler
 *
 * Local notification scheduling.
 * Maximum 2 notifications per day. No spam. Ever.
 */

import * as Notifications from "expo-notifications";
import type { StreakData } from "@/types/domain";

// ─── Configuration ──────────────────────────────────────────────────────────

const MAX_DAILY_NOTIFICATIONS = 2;

// ─── Notification Setup ──────────────────────────────────────────────────────

/**
 * Request notification permissions.
 * Returns true if granted.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

/**
 * Configure notification behavior.
 */
export function configureNotifications(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// ─── Scheduling ──────────────────────────────────────────────────────────────

/**
 * Schedule a daily session reminder.
 */
export async function scheduleSessionReminder(hour: number, minute: number): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to focus",
      body: "Start a session and protect your attention.",
      data: { type: "session_reminder" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

/**
 * Schedule a streak danger alert (8pm if no session today).
 */
export async function scheduleStreakAlert(streak: StreakData): Promise<void> {
  if (streak.current === 0) return;

  const messages = [
    "Your streak is at risk. 3 hours left to protect it.",
    "Don't break the chain. Start a quick session.",
    `${streak.current} days of focus. Keep it going.`,
    "One session today is all you need.",
  ];

  const message = messages[Math.floor(Math.random() * messages.length)];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Streak at risk 🔥",
      body: message,
      data: { type: "streak_danger" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });
}

/**
 * Send a milestone notification immediately.
 */
export async function sendMilestoneNotification(days: number): Promise<void> {
  const messages: Record<number, string> = {
    3: "3 days strong. The habit is forming.",
    7: "One full week! You're proving something.",
    14: "Two weeks. This is becoming who you are.",
    30: "30 days. Most people never get here.",
    60: "60 days. You're in rare territory.",
    100: "100 days. You've built something unbreakable.",
  };

  const message = messages[days] ?? `${days} days of consistent focus.`;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${days}-day streak! 🔥`,
      body: message,
      data: { type: "milestone", days },
    },
    trigger: null, // Immediate
  });
}

/**
 * Cancel all scheduled notifications.
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
