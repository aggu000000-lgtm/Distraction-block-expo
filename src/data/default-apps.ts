/**
 * FocusGuard Default Apps
 *
 * Pre-populated list of 40+ most common distraction apps.
 * Each app has: id, name, category, icon, bundleId.
 */

import type { AppCategory, TrackedApp } from "@/types/domain";

type DefaultApp = Omit<TrackedApp, "isTracked">;

export const DEFAULT_APPS: DefaultApp[] = [
  // Social
  { id: "instagram", name: "Instagram", bundleId: "com.instagram.app", category: "social", icon: "📸" },
  { id: "tiktok", name: "TikTok", bundleId: "com.zhiliaoapp.musically", category: "social", icon: "🎵" },
  { id: "twitter", name: "X (Twitter)", bundleId: "com.atebits.Tweetie2", category: "social", icon: "🐦" },
  { id: "facebook", name: "Facebook", bundleId: "com.facebook.Facebook", category: "social", icon: "👤" },
  { id: "snapchat", name: "Snapchat", bundleId: "com.toyopagroup.picaboo", category: "social", icon: "👻" },
  { id: "reddit", name: "Reddit", bundleId: "com.reddit.Reddit", category: "social", icon: "🤖" },
  { id: "linkedin", name: "LinkedIn", bundleId: "com.linkedin.LinkedIn", category: "social", icon: "💼" },
  { id: "threads", name: "Threads", bundleId: "com.instagram.barcelona", category: "social", icon: "🧵" },
  { id: "pinterest", name: "Pinterest", bundleId: "com.pinterest", category: "social", icon: "📌" },
  { id: "tumblr", name: "Tumblr", bundleId: "com.tumblr.tumblr", category: "social", icon: "📝" },

  // Entertainment
  { id: "youtube", name: "YouTube", bundleId: "com.google.ios.youtube", category: "entertainment", icon: "▶️" },
  { id: "netflix", name: "Netflix", bundleId: "com.netflix.mediaclient", category: "entertainment", icon: "🎬" },
  { id: "twitch", name: "Twitch", bundleId: "tv.twitch", category: "entertainment", icon: "🎮" },
  { id: "disney", name: "Disney+", bundleId: "com.disney.disneyplus", category: "entertainment", icon: "🏰" },
  { id: "spotify", name: "Spotify", bundleId: "com.spotify.client", category: "entertainment", icon: "🎧" },
  { id: "hulu", name: "Hulu", bundleId: "com.hulu.plus", category: "entertainment", icon: "📺" },
  { id: "prime", name: "Prime Video", bundleId: "com.amazon.aiv.AIVApp", category: "entertainment", icon: "📦" },

  // Messaging
  { id: "whatsapp", name: "WhatsApp", bundleId: "net.whatsapp.WhatsApp", category: "messaging", icon: "💬" },
  { id: "telegram", name: "Telegram", bundleId: "ph.telegra.Telegraph", category: "messaging", icon: "✈️" },
  { id: "discord", name: "Discord", bundleId: "com.hypefactor.Discord", category: "messaging", icon: "🎮" },
  { id: "imessage", name: "Messages", bundleId: "com.apple.MobileSMS", category: "messaging", icon: "💌" },
  { id: "slack", name: "Slack", bundleId: "com.tinyspeck.chatlyio", category: "messaging", icon: "💼" },

  // News
  { id: "news", name: "Apple News", bundleId: "com.apple.news", category: "news", icon: "📰" },
  { id: "flipboard", name: "Flipboard", bundleId: "com.flipboard.flipboard", category: "news", icon: "📖" },
  { id: "cnn", name: "CNN", bundleId: "com.cnn.iphone", category: "news", icon: "📺" },
  { id: "bbc", name: "BBC News", bundleId: "uk.co.bbc.news", category: "news", icon: "🇬🇧" },

  // Gaming
  { id: "clash", name: "Clash Royale", bundleId: "com.supercell.clashroyale", category: "gaming", icon: "👑" },
  { id: "candy", name: "Candy Crush", bundleId: "com.king.candycrushsaga", category: "gaming", icon: "🍬" },
  { id: "amongus", name: "Among Us", bundleId: "com.innersloth.spacemafia", category: "gaming", icon: "🚀" },
  { id: "genshin", name: "Genshin Impact", bundleId: "com.miHoYo.GenshinImpact", category: "gaming", icon: "⚔️" },

  // Shopping
  { id: "amazon", name: "Amazon", bundleId: "com.amazon.Amazon", category: "shopping", icon: "📦" },
  { id: "shein", name: "SHEIN", bundleId: "com.zzkko", category: "shopping", icon: "👗" },
  { id: "temu", name: "Temu", bundleId: "com.einnovation.temu", category: "shopping", icon: "🛍️" },
  { id: "ebay", name: "eBay", bundleId: "com.ebay.mobile", category: "shopping", icon: "🏷️" },

  // Productivity (ironic distractions)
  { id: "email", name: "Email", bundleId: "com.apple.mobilemail", category: "productivity", icon: "📧" },
  { id: "calendar", name: "Calendar", bundleId: "com.apple.mobilecal", category: "productivity", icon: "📅" },

  // Other
  { id: "safari", name: "Safari", bundleId: "com.apple.mobilesafari", category: "other", icon: "🧭" },
  { id: "chrome", name: "Chrome", bundleId: "com.google.chrome.ios", category: "other", icon: "🌐" },
];

/**
 * Get apps filtered by category.
 */
export function getAppsByCategory(category: AppCategory): DefaultApp[] {
  return DEFAULT_APPS.filter((app) => app.category === category);
}

/**
 * Get all unique categories.
 */
export function getCategories(): AppCategory[] {
  return [...new Set(DEFAULT_APPS.map((app) => app.category))];
}

/**
 * Create a TrackedApp from a DefaultApp.
 */
export function toTrackedApp(app: DefaultApp, isTracked = false): TrackedApp {
  return { ...app, isTracked };
}
