# FocusGuard — Distraction Blocker App 🛡️

A beautiful, dark-themed distraction blocker app built with **Expo** + **Expo Router** + **TypeScript**.

## ✨ Features

- 🛡️ **App Blocking** — Toggle individual apps on/off with a master switch
- ⏱️ **Focus Timer** — Pomodoro, Flow State, Power Hour, Quick Sprint modes
- 📊 **Stats Dashboard** — Weekly bar charts, streaks, and insights
- 📋 **Block Rules** — Schedule-based rules (e.g., block social 9am–5pm weekdays)
- ⚙️ **Settings** — Strict mode, notifications, break reminders
- 🔥 **Streak Tracking** — Daily focus streak motivation
- 🌑 **Dark UI** — Deep purple/indigo dark theme with glow accents

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios
```

## 📁 Project Structure

```
app/
  _layout.tsx          # Root layout (GestureHandler + Stack)
  (tabs)/
    _layout.tsx        # Tab bar layout
    index.tsx          # Home screen
    blocklist.tsx      # App block list
    focus.tsx          # Focus timer
    stats.tsx          # Statistics
    settings.tsx       # Settings
constants/
  theme.ts             # Colors, fonts, spacing
store/
  useStore.ts          # State management with AsyncStorage
```

## 🎨 Design

- **Color scheme**: Deep navy/indigo dark theme with violet accent (`#7c6eff`)
- **Typography**: System fonts with careful weight/size hierarchy
- **Components**: Cards, pills, progress bars, bar charts, toggle switches

## 🛠️ Tech Stack

- [Expo](https://expo.dev) ~52
- [Expo Router](https://expo.github.io/router) v4 (file-based routing)
- [React Native](https://reactnative.dev) 0.76
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) for persistence
- [@expo/vector-icons](https://icons.expo.fyi) (Ionicons)
- TypeScript
