# DESIGN SYSTEM — FocusGuard Visual Language

---

## Philosophy

> Design is not how it looks. Design is how it makes you feel when you need to check Instagram for the 19th time and the app gently shows you a number instead of a wall.

Every pixel earns its place. Every animation has a reason. Every color carries meaning.

---

## The Mood

Dark. Not "dark mode dark." **Observatory dark.** The kind of darkness that makes you feel like you're inside a cockpit. In control. Serious. Calm.

We are not playful. We are not bubbly. We are not pastel. We are the visual equivalent of a cold glass of water at 2am — clarifying, honest, a little bracing.

---

## Color System

### Base Palette

```
Name              Hex         Usage
─────────────────────────────────────────────────────────
Void              #080811     True background (deepest)
Abyss             #0d0d1c     Screen background
Depth             #111122     Card background (primary)
Surface           #18182e     Card background (elevated)
Rim               #22223a     Border, divider
Fog               #2e2e4e     Muted border, placeholder bg

Nebula            #6c63ff     Primary accent (violet-purple)
Nebula Glow       #6c63ff22   Accent background wash
Nebula Bright     #8a82ff     Accent hover / active state

Pulse             #00e5a0     Success / active / streak (electric green)
Pulse Soft        #00e5a015   Success background wash

Alert             #ff5c5c     Danger / blocked (red)
Alert Soft        #ff5c5c15   Danger background wash

Amber             #ffb547     Warning / in-progress
Amber Soft        #ffb54715   Warning background wash

─────────────────────────────────────────────────────────

Frost             #e8e8ff     Primary text (cool white)
Mist              #8888aa     Secondary text
Shadow            #44446a     Muted / disabled text
```

### Semantic Usage

| Context | Color |
|---|---|
| App is blocking | Alert (red), pulsing |
| Session running | Pulse (green), breathing |
| Idle / ready | Nebula (violet) |
| Streak alive | Amber → Pulse gradient |
| Danger action | Alert |
| Primary CTA | Nebula |
| Success / complete | Pulse |

### Do Not
- Use white text on Pulse (contrast fails)
- Use more than 2 accent colors on one screen
- Use opacity hacks where a proper color exists

---

## Typography

**Font:** `Geist` (variable) for UI + `Geist Mono` for numbers/timers  
**Fallback:** System default (San Francisco / Roboto)

```
Scale    Size    Weight    Line Height    Usage
─────────────────────────────────────────────────────────
display  40px    800       44px           Timer display, hero numbers
h1       28px    800       32px           Screen titles
h2       22px    700       28px           Section headers
h3       18px    700       24px           Card titles
body     15px    400       22px           Body copy, descriptions
label    13px    600       18px           Labels, badges, metadata
caption  11px    500       14px           Fine print, timestamps
mono-xl  48px    700       52px           Countdown timer
mono-lg  24px    600       28px           Elapsed time, small counters
```

### Rules
- Display & h1 always in `Frost` (#e8e8ff)
- Body text always in `Mist` (#8888aa)
- Numbers (focus time, blocked count) always in `Geist Mono`
- Never use font-size < 11px
- Never bold body copy mid-paragraph (use a different color instead)

---

## Spacing System

Base unit: **4px**

```
xs   4px    Tight inline gaps (icon + label)
sm   8px    Compact internal padding
md   16px   Standard padding, gap between cards
lg   24px   Section separation
xl   32px   Large section gaps
2xl  48px   Screen-level breathing room
3xl  64px   Hero section padding
```

---

## Border Radius

```
none    0px     Data tables, full-bleed images
xs      6px     Chips, pills, small badges
sm      10px    Compact cards
md      16px    Standard cards, buttons
lg      22px    Large cards, modals
xl      32px    Floating panels, sheets
full    9999px  Toggle switches, avatar circles
```

---

## Motion System

> Animation is not decoration. It is communication.

### Principles
1. **Physics over timing** — use spring animations, not cubic-bezier everywhere
2. **Enter fast, exit faster** — elements enter at 300ms, exit at 200ms
3. **Chain, don't stack** — stagger list items by 40ms, not all at once
4. **Never block interaction** — all animations run on the UI thread (Reanimated)

### Presets

```typescript
// src/design/motion.ts

export const spring = {
  snappy: { damping: 20, stiffness: 300 },       // Button press
  smooth: { damping: 18, stiffness: 180 },       // Modal entrance
  bouncy: { damping: 12, stiffness: 200 },       // Achievement pop
  gentle: { damping: 25, stiffness: 120 },       // Fade/slide
}

export const duration = {
  instant:  100,   // Haptic response, color change
  fast:     200,   // Button feedback, tab switch
  normal:   300,   // Modal open, card expand
  slow:     500,   // Screen transition, progress fill
  dramatic: 800,   // Streak milestone, completion
}
```

### Choreography by Screen

**Home Dashboard**
- Cards fade-slide up, staggered 40ms each (enter)
- Master toggle: spring scale + color shift on UI thread
- Blocked count: number rolls up (odometer style) on load

**Focus Timer**
- Ring draws using Skia path animation (SVG-native performance)
- Completion: ring flashes Pulse, then explodes outward, then fades
- Each second tick: subtle haptic (light) + ring arc update

**Friction Modal ("Are you sure?")**
- Blurs background using `@react-native-community/blur`
- Countdown renders as filling ring (pressure, not just a number)
- Dismiss: slide down with spring, no interruption possible

**Stats / Insights**
- Bar chart bars grow up from baseline (800ms, staggered 60ms)
- Numbers count up from 0 when screen enters viewport
- Insight cards slide in from right

---

## Component Anatomy

### The Card

```
┌─────────────────────────────────────────┐
│  ●  [Icon 20px]  Title — h3             │
│                  Subtitle — label/Mist  │
│                                         │
│  ───────────────────────────────── Rim  │
│                                         │
│  [Body content — body/Frost]            │
│                                         │
└─────────────────────────────────────────┘
Border: 1px Rim (#22223a)
Bg: Depth (#111122)
Border-radius: md (16px)
Padding: md (16px)
```

### The Button

**Primary:**
```
Background: Nebula
Text: Frost, label weight
Border-radius: md
Padding: 16px vertical, 24px horizontal
Press: scale(0.97) spring + haptic medium
Shadow: 0 8px 24px Nebula@40%
```

**Secondary:**
```
Background: transparent
Border: 1px Rim
Text: Mist
Press: background → Surface, no scale
```

**Destructive:**
```
Background: Alert Soft
Border: 1px Alert@40%
Text: Alert
Press: scale(0.97) + haptic heavy
```

### The Toggle (Master Switch)

Not the native switch. Custom.

```
Width: 56px, Height: 30px, Border-radius: full
Track OFF: Rim color + 1px border
Track ON:  Nebula Glow + Nebula border
Thumb: 22px circle, spring-animated across track
ON:  Pulse (green) thumb, Pulse glow shadow
OFF: Fog thumb, no shadow
Transition: 250ms spring
```

---

## Iconography

**Library:** Lucide React Native (24px grid)

Consistent icons map to consistent meanings:
```
shield-check    → Blocking active
shield-off      → Blocking inactive
ban             → Blocked app
timer           → Focus session
flame           → Streak
bar-chart-2     → Stats / Insights
settings-2      → Settings
plus-circle     → Add / Create
trash-2         → Delete (always destructive color)
check-circle    → Completed / success
x-circle        → Cancel / failed
lock            → Locked (cannot bypass)
unlock          → Can bypass
sparkles        → Achievement / milestone
```

---

## Screen Templates

Three screen templates cover 95% of all screens:

### 1. List Screen
```
SafeArea
  ScrollView
    ScreenHeader (title, subtitle, optional action)
    [optional] FilterBar
    SectionList or FlatList
      SectionHeader (label style, uppercase, Mist)
      ItemCard × n
    Spacer (FAB clearance)
  FAB (if applicable)
```

### 2. Detail / Focus Screen
```
SafeArea
  [Hero — full-width, may be animated canvas]
  ScrollView (no momentum scroll, feels like native)
    ContentCards × n
  BottomActions (fixed, above home indicator)
```

### 3. Modal Sheet
```
BlurView (background)
  BottomSheet (drag to dismiss)
    Handle Bar
    Title (h2)
    Content
    [Primary Action] + [Cancel]
```

---

## Accessibility

- All touch targets ≥ 44×44 pt
- Color is never the **only** differentiator (always paired with icon or text)
- All animated values respect `useReducedMotion()`
- Every interactive element has `accessibilityLabel`
- Minimum text contrast: 4.5:1 (WCAG AA)
- Timer screen works with VoiceOver / TalkBack (announces time remaining every minute)
