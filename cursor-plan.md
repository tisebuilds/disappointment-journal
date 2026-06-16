# Disappointment Tickets — Cursor Build Plan

> A mobile-first PWA built in Next.js. Every disappointment is sealed as a **capsule entry** — with a 1st checkpoint at 30 days ("I learned…") and a final checkpoint at 90 days ("A good thing that came from this"). All data lives in `localStorage`. No backend, no auth, no friction.

---

## Design Philosophy

This app is built for people jotting things down on their phone — on the commute, between meetings, in a quiet moment. Every decision should serve one-thumb, eyes-half-on-the-screen use:

- **Zero friction entry** — bottom nav + → write → done in 20 seconds
- **Phone-first layout** — overlays instead of page navigations, sticky action buttons, keyboard-aware
- **Warm parchment aesthetic** — aged paper background, high-contrast near-black text, large Playfair Display serif headlines, Space Mono monospace UI labels (reference: Eido Remembers, historical documents)
- **Progressive disclosure** — the app does nothing until it's time; then it surfaces exactly what's needed

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Single-page feel — all screens are client-side overlays |
| Styling | Tailwind CSS | Extend with custom ticket palette (see below) |
| Storage | `localStorage` | JSON under key `dtc_v1`, versioned |
| Data portability | Export/import JSON | File download + `<input type="file">` — no server needed |
| Fonts | `Playfair Display` + `Space Mono` | Serif for writing/headlines, monospace for all UI labels/chrome |
| PWA | `next-pwa` | **Required for v1** — app must install to home screen |
| Deployment | Vercel | One-click from GitHub |

---

## File Structure

```
app/
  layout.tsx              # Viewport meta (viewport-fit=cover), font imports, PWA manifest link
  page.tsx                # Shell — renders Feed + overlays via client state (no sub-routes)
  globals.css             # Tailwind base, 100dvh shell, safe-area utilities
  manifest.json           # PWA manifest — name, icons, theme_color, display: standalone
components/
  Feed.tsx                # Scrollable list: "Your stop is here" + "All entries" sections
  TicketCard.tsx          # List item — full-width, border-bottom divider, track dots
  JourneyTrack.tsx        # 4-dot progress strip (Departed → 1st Stop → Destination → Arrived)
  BottomNav.tsx           # Fixed bottom nav: TICKETS · + · SETTINGS
  NewEntryOverlay.tsx     # Full-screen slide-up — big serif textarea, sticky "Issue ticket" button
  DetailOverlay.tsx       # Full-screen — itinerary view, sticky action button when ready
  SettingsTab.tsx         # About section + Save backup / Load backup / Reset all
lib/
  tickets.ts              # localStorage read/write, export, import
  stages.ts               # daysSince(), stageFor(), STAGE_META constant
  seed.ts                 # Demo ticket generator (3 tickets across all stages)
types/
  ticket.ts               # Ticket type + TicketStage type
public/
  icons/                  # PWA icons (192×192, 512×512)
```

---

## Data Model

```ts
// types/ticket.ts

export type TicketStage = "departed" | "stop" | "destination" | "arrived";

export interface Ticket {
  id: string;               // 8-char alphanumeric, e.g. "A3F9C2B1"
  createdAt: string;        // ISO date string — set at entry time, never changes
  disappointment: string;   // Written at departure — always present
  learning: string | null;  // Written at 1st stop (30+ days) — "I learned…"
  learningAt: string | null;
  silver: string | null;    // Written at final destination (90+ days)
  silverAt: string | null;
}
```

---

## Stage Logic (`lib/stages.ts`)

```ts
export function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

export function stageFor(ticket: Ticket): TicketStage {
  const d = daysSince(ticket.createdAt);
  if (!ticket.learning && d >= 30) return "stop";
  if (ticket.learning && !ticket.silver && d >= 90) return "destination";
  if (ticket.silver) return "arrived";
  return "departed";
}

export const STAGE_META: Record<TicketStage, {
  label: string; short: string; dot: string; accent: string;
}> = {
  departed:    { label: "En Route",       short: "EN ROUTE",   dot: "#c4a882", accent: "#7a5c3a" },
  stop:        { label: "1st Stop Ready", short: "STOP",       dot: "#d4845a", accent: "#b0622a" },
  destination: { label: "Final Stop",     short: "FINAL STOP", dot: "#7a9e7e", accent: "#4a7a54" },
  arrived:     { label: "Complete",       short: "ARRIVED",    dot: "#9e9e9e", accent: "#5a5a5a" },
};
```

---

## Storage Layer (`lib/tickets.ts`)

```ts
const KEY = "dtc_v1";

export const loadTickets = (): Ticket[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); }
  catch { return []; }
};

export const saveTickets = (tickets: Ticket[]) =>
  localStorage.setItem(KEY, JSON.stringify(tickets));

export const exportTickets = () => {
  const blob = new Blob([localStorage.getItem(KEY) ?? "[]"], { type: "application/json" });
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob),
    download: `my-tickets-${Date.now()}.json`,
  });
  a.click();
};

export const importTickets = (file: File): Promise<void> =>
  new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try { saveTickets(JSON.parse(e.target?.result as string)); res(); }
      catch { rej(new Error("Invalid file")); }
    };
    reader.readAsText(file);
  });
```

---

## Screen Architecture

This is a **single-page app** — `app/page.tsx` is the only route. All screens are React state-driven overlays. No `router.push()`, no separate URL routes for new/detail. This ensures instant transitions that feel native on mobile.

```ts
type Screen = "feed" | "new" | "detail";

// In page.tsx
const [screen, setScreen] = useState<Screen>("feed");
const [activeId, setActiveId] = useState<string | null>(null);
```

### Feed (default screen)

- Sticky header: eyebrow "YOUR CAPSULE" + title "Disappointment Log" + "+ New" button
- Scrollable list with `100dvh` shell, `padding-bottom: 100px` to clear bottom nav
- Two sections: **"● YOUR CHECKPOINT IS HERE"** (stage = `stop` or `destination`) and **"ALL ENTRIES"**
- Empty state: "NO ENTRIES YET" + *"Suffering allows you to be a witness for others"* + "Log first disappointment →"
- Center + in bottom nav opens NewEntryOverlay

### NewEntryOverlay

- Slides up over feed (CSS animation: `translateY(40px) → 0, opacity 0 → 1`)
- Header: "NEW ENTRY" eyebrow + "What disappointed you?" title + `×` close button
- Body: large `<textarea>` (font-size 22px minimum — prevents iOS zoom) fills available height with flex-grow
- Footer: sticky `padding-bottom: env(safe-area-inset-bottom)` — holds "Create entry →" button
- On submit → add entry to state → show confirmation screen ("DISAPPOINTMENT SEALED / Your testimony has begun.")
- `autoFocus` with 250ms delay so keyboard opens after animation completes

### DetailOverlay

- Same slide-up overlay pattern
- Header: `← Entries` back button + stage badge + days count
- Scrollable body:
  - Itinerary track (3-dot strip: LOGGED · 1ST CHECKPOINT · FINAL CHECKPOINT)
  - **Logged — Departure:** "LOGGED · {date}" label + original disappointment text
  - **1st Checkpoint:** if `stage === "stop"` and not yet written, shows textarea + "30 DAYS HAVE PASSED. WHAT DID THIS TEACH YOU?"; otherwise locked or saved quote
  - **Final Checkpoint:** same pattern, locked until 1st checkpoint complete; locked copy: "FINAL REFLECTION · COMPLETE 1ST CHECKPOINT FIRST"
- Sticky footer: only rendered when there's an active action (`needsLearning` or `needsSilver`). Button copy:
  - At 1st checkpoint: **"Save my entry →"**
  - At final checkpoint: **"Complete my reflection ✦"**

---

## Key Component Specs

### `<TicketCard />`

```
┌─────────────────────────────────────────────┐
│▌ Mar 31, 2026                    [EN ROUTE] │  ← 5px left accent stripe colored by stage
│                                             │
│  "I was passed over for the promotion I     │
│   had been working toward for two years…"   │
│                                             │
│  ●────────────────○────────────────○        │  ← JourneyTrack
│  6d into the journey                        │
└─────────────────────────────────────────────┘
```

- Left accent stripe: `position: absolute`, colored by `STAGE_META[stage].dot`
- Touch feedback: `transform: scale(0.98)` on `:active`
- Min height ensures comfortable tap target

### `<JourneyTrack />`

Three dots connected by lines. Filled dots/lines: `#16100a`. Empty: `#b8a080` border/color. Labels: "Departed", "1st Stop", "Destination" in Space Mono 8px.

### `<FAB />` (center nav button)

The center + in the bottom nav is oversized (22px) and uses `color: #16100a` on the `#ede4d6` nav background. No separate floating button needed — the nav center item acts as the primary CTA.

---

## PWA Setup (required for v1)

Install `next-pwa`:
```bash
npm install next-pwa
```

`next.config.js`:
```js
const withPWA = require("next-pwa")({ dest: "public", register: true, skipWaiting: true });
module.exports = withPWA({ /* ... */ });
```

`app/manifest.json`:
```json
{
  "name": "Disappointment Tickets",
  "short_name": "Tickets",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ede4d6",
  "theme_color": "#16100a",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

`app/layout.tsx` — add to `<head>`:
```tsx
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#16100a" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
```

---

## Viewport & Safe Area Setup

`app/globals.css`:
```css
html, body {
  margin: 0;
  padding: 0;
  overscroll-behavior: none;
  -webkit-text-size-adjust: 100%;
}

/* Full viewport that accounts for iOS browser chrome */
.app-shell {
  width: 100%;
  height: 100dvh; /* dynamic viewport height */
  height: 100vh;  /* fallback */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.feed {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px 16px 100px; /* 100px clears the FAB */
}
```

`app/layout.tsx` viewport meta:
```tsx
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // enables safe-area-inset on notched phones
};
```

---

## Design System

### Color Palette

```ts
// tailwind.config.ts
colors: {
  ticket: {
    paper:    "#ede4d6",   // app background — aged parchment
    surface:  "#faf4ea",   // card/overlay surfaces — warm cream
    border:   "#ddd0bc",   // all borders, dividers — warm hairline
    track:    "#b8a080",   // track dots/lines — visible on cream
    t3:       "#7a6248",   // T3: structure labels, locked, inactive nav
    t2:       "#5e4830",   // T2: dates, metadata, secondary labels
    t1:       "#16100a",   // T1: primary text, headlines — warm near-black
  }
}
```

### Typography

| Use | Font | Weight | Size | Treatment |
|---|---|---|---|---|
| Hero headlines | Playfair Display | 900 | 32–36px | Normal |
| Card snippets | Playfair Display | 700 | 18–20px | Italic |
| Overlay title | Playfair Display | 700 | 20–22px | Normal |
| Entry textarea | Playfair Display | 400 | 22px | Italic |
| All UI labels | Space Mono | 700 | 9–10px | Uppercase, letter-spaced |
| Body / prompts | Space Mono | 400 | 10–11px | Uppercase, letter-spaced |

### Buttons

Three variants — no rounded corners (border-radius: 0):

```
btn-primary  → background: #16100a, color: #faf4ea, border: none
btn-outline  → background: transparent, color: #16100a, border: 1px solid #16100a
btn-ghost    → background: transparent, color: #5e4830, border: none, text-decoration: underline
```

All buttons: 18px padding vertical, 24px horizontal, Space Mono font, 12px, 700 weight, 2px letter-spacing, uppercase.

### Navigation

Bottom nav with 3 items: **TICKETS** · **+** (center, oversized) · **SETTINGS**

- Active state: `#16100a` label + 3px dot above
- Inactive: `#7a6248` (T3)
- Background: `#ede4d6`, border-top: `1px solid #ddd0bc`

### Cards (TicketCard)

Full-width, no border-radius. Background `#faf4ea`. Separated by `margin-bottom: 3px` gap against parchment bg. No box-shadow.

Ready tickets: `background: #fff`, `border-left: 2px solid #16100a`.

```
┌────────────────────────────────────────┐
│ MAR 31, 2026              ● 1ST STOP   │  ← Space Mono 9px, color #7a6248 / dark pill
│                                        │
│ "I was disappointed when I didn't      │  ← Playfair Display 22px italic #16100a
│  get the promotion I'd worked for…"    │
│                                        │
│ ●────────────────●──────────────────○  │  ← Track: filled #16100a, empty #b8a080
│ 38 DAYS IN · Tap to reflect            │  ← Space Mono 9px #7a6248
└────────────────────────────────────────┘
```

---

## Language & Copy Guide

Consistency matters — use this language throughout:

| Old (don't use)         | Use this instead                     |
|-------------------------|--------------------------------------|
| Ticket                  | Entry                                |
| Issue ticket            | Create entry                         |
| Journey                 | Testimony / Reflection               |
| All tickets             | All entries                          |
| Your stop is here       | Your checkpoint is here              |
| Waiting / En route      | En route                             |
| 1st Stop                | 1st Checkpoint                       |
| Final Destination       | Final Checkpoint / Final Reflection  |
| Stamp my ticket →       | Save my entry →                      |
| Complete my journey ✦   | Complete my reflection ✦             |
| Back to my tickets      | Back to my entries                   |
| Complete                | Arrived                              |

---

## User Flow

```
First use:
  Open app (PWA on home screen)
  → + tap → overlay slides up ("NEW ENTRY")
  → User types disappointment in big textarea
  → Taps "Create entry →"
  → Confirmation: "DISAPPOINTMENT SEALED — Your testimony has begun. 1st checkpoint in 30 days."
  → Returns to feed ("Back to my entries")

Day 30+:
  Open app
  → Feed shows "● YOUR CHECKPOINT IS HERE" section with entry highlighted
  → Tap entry → detail overlay opens ("← Entries")
  → Sees original entry + "1ST CHECKPOINT · I LEARNED…" prompt
  → Types reflection → taps "Save my entry →"
  → Sticky button saves and disappears — checkpoint is marked

Day 90+:
  Same pattern — "FINAL CHECKPOINT" unlocks
  → Prompt: "A good thing that happened because of this…"
  → Taps "Complete my reflection ✦"
  → Entry moves to "Arrived" state
```

---

## Stretch Features (after v1)

- **Shareable read-only entry** — URL-encoded JSON, no server needed
- **Notification prompt** — use the Web Notifications API to schedule a reminder at day 30 and day 90 (works offline via service worker)
- **"Add to Home Screen" nudge** — detect if not installed as PWA and show a one-time banner
- **Haptic feedback** — `navigator.vibrate()` on entry creation and checkpoint save
- **Entry themes** — minimal / capsule / journal / document variants

---

## Cursor Prompt to Start

Paste this into Cursor to initialize the project:

```
Build a mobile-first PWA called "Disappointment Capsule" using Next.js 14 App Router + Tailwind CSS.

Core concept: Every disappointment is sealed as a capsule entry. Users write a disappointment, then are prompted at two future checkpoints:
- 30 days later: "I learned…" (1st Checkpoint)
- 90 days later: "A good thing that came from this…" (Final Checkpoint)

Stack:
- Next.js 14 App Router, "use client" for all interactive components
- Tailwind CSS with custom parchment palette (paper: #ede4d6, surface: #faf4ea, t1: #16100a, t2: #5e4830, t3: #7a6248, border: #ddd0bc, track: #b8a080)
- All data in localStorage under key "dtc_v1" — no backend, no auth
- next-pwa for PWA/home screen install support
- Fonts: Playfair Display (serif, headlines + writing) + Space Mono (all UI labels, monospace chrome)

Data model:
interface Ticket {
  id: string;               // 8-char alphanumeric
  createdAt: string;        // ISO
  disappointment: string;
  learning: string | null;
  learningAt: string | null;
  silver: string | null;
  silverAt: string | null;
}

Stage logic:
- "departed": d < 30, no learning  → badge: EN ROUTE
- "stop": d >= 30, no learning yet  → badge: 1ST CHECKPOINT
- "destination": has learning, d >= 90, no silver yet  → badge: FINAL CHECKPOINT
- "arrived": has silver  → badge: ARRIVED

Design: warm parchment aesthetic inspired by Eido Remembers + historical documents.
- Background: #ede4d6 (aged paper). Cards/overlays: #faf4ea (cream). Primary text: #16100a (warm near-black).
- T2 metadata: #5e4830. T3 structure/inactive: #7a6248. Borders: #ddd0bc. Track: #b8a080.
- Headlines: Playfair Display 900 weight, large (32–36px). Italic for all written content.
- Labels: Space Mono, 9–10px, uppercase, 2–3px letter-spacing. No Inter anywhere.
- Buttons: border-radius: 0 (square). Primary = #16100a bg / #faf4ea text. Outlined = #16100a border + text. Ghost = underline only, #5e4830.
- Cards: full-width, no rounding, no shadows. Background #faf4ea, separated by 3px parchment gap. Ready tickets: #fff bg + 2px left accent border #16100a.

Architecture: Single page (app/page.tsx only). Two tabs (ENTRIES, SETTINGS) + overlays for new entry and detail. State: `screen` ("feed" | "new" | "detail") and `tab` ("entries" | "settings").

Layout:
- App shell: 100dvh, flex column, overflow hidden, background #ede4d6
- Feed: flex-grow, overflow-y scroll, padding-bottom 80px to clear bottom nav
- Bottom nav: 3 items — ENTRIES · + (center) · SETTINGS. Fixed, border-top: 1px solid #ddd0bc, background #ede4d6.

New entry overlay:
- Slides up (animation: translateY 30px → 0, opacity 0 → 1, 200ms)
- Header: Space Mono eyebrow "NEW ENTRY" + Playfair Display title "What disappointed you?" + × close button (square border)
- Large Playfair Display italic textarea (22px) fills remaining height with flex-grow, transparent background
- Sticky footer holds btn-primary "Create entry →"
- 22px font size prevents iOS zoom
- autoFocus with 250ms delay
- Confirmation screen: "DISAPPOINTMENT SEALED" / "Your testimony has begun." / "1ST CHECKPOINT IN 30 DAYS. LAST CHECKPOINT AT 90." / "Back to my entries"

Detail overlay (same slide-up):
- Header: "← Entries" back (Space Mono) + stage badge + days count
- Itinerary strip: Space Mono "ITINERARY" eyebrow, 3-dot track labeled LOGGED · 1ST CHECKPOINT · FINAL CHECKPOINT
- Each checkpoint: Space Mono label (9px, uppercase) + Playfair Display italic content
- Locked checkpoints: Space Mono dim text, no border boxes
- Sticky bottom btn-primary only when action ready: "Save my entry →" (1st checkpoint) / "Complete my reflection ✦" (final)

TicketCard:
- Full-width, padding 20px, background #faf4ea, margin-bottom 3px (parchment gap shows through)
- Date (Space Mono 9px #7a6248) + stage badge (Space Mono 9px #7a6248, dark pill #16100a when ready)
- Snippet: Playfair Display 22px italic, color #16100a
- 4-dot track (filled: #16100a, empty: #b8a080) + "X DAYS IN" Space Mono 9px
- Ready tickets: background #fff, border-left: 2px solid #16100a
- background: #f3ead8 on :active

Settings tab:
- About section: "ABOUT" eyebrow + "Disappointment Capsule" headline + "SEAL A DISAPPOINTMENT. REFLECT AT 30 DAYS. FIND THE SILVER LINING AT 90."
- Data section: "DATA" eyebrow + Save backup (btn-outline) + Load backup (label wrapping hidden input, btn-outline) + Reset (btn-ghost)
- Reset triggers inline confirm: "This will delete all entries. Are you sure?" → "Yes, delete all" / "Cancel"

Viewport meta:
- viewportFit: "cover" for notched phone support
- All safe areas via env(safe-area-inset-*)
- theme_color: "#16100a" in PWA manifest

Build order:
1. lib/tickets.ts and lib/stages.ts (data layer)
2. types/ticket.ts
3. app/layout.tsx with PWA meta + Playfair Display + Space Mono from Google Fonts
4. app/globals.css — parchment shell, overlay animations, button variants, Space Mono labels
5. components/JourneyTrack.tsx
6. components/TicketCard.tsx
7. components/BottomNav.tsx
8. components/NewEntryOverlay.tsx
9. components/DetailOverlay.tsx
10. components/Feed.tsx
11. components/SettingsTab.tsx
12. app/page.tsx (wires everything together)
13. PWA manifest + icons (theme_color #16100a)
```
