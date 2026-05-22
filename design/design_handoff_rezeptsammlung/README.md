# Handoff: Rezeptsammlung (persönliche Rezept-App)

## Overview

Mobile-first web app for a personal recipe collection. Two core screens are
designed:

1. **Übersicht (Home)** — browse all recipes as a photo-grid, search & filter.
2. **Kochansicht (Detail)** — a cooking-optimised recipe view where ingredients
   and steps are visible without page-level scrolling.

The aesthetic is warm and editorial — like a good cookbook — with a terracotta
accent on cream, large serif titles, and readable UI sans (designed to stay
legible with messy/wet hands).

---

## About the Design Files

The HTML files in this bundle are **design references**, not production code.
They are interactive React-on-Babel prototypes that demonstrate the intended
look, layout, micro-interactions and state behaviour at a fidelity high
enough to read off measurements, colours and typography.

Your job is to **recreate these designs in the target codebase's existing
environment** — React Native, SwiftUI, Flutter, Next.js, plain React, or
whatever framework the project uses — following that codebase's established
patterns (component library, design tokens, navigation, state management).

If no codebase exists yet, pick the most appropriate framework for a personal
mobile-first recipe app. Likely picks: **React Native + Expo** (real native
app, easiest cross-platform), or **Next.js / Vite + React** if the user
prefers a PWA.

Do *not* ship the prototype HTML as-is; do *not* port the inline `<script
type="text/babel">` style.

---

## Fidelity

**High-fidelity (hifi).** Colours, typography, spacing, radii, and most
interactions are final. Reproduce pixel-faithfully. Three accent palettes
(terracotta / olive / mustard) and a dark mode are defined as
swap-at-runtime CSS-variable themes — implement them as a theme system in
your target environment.

The recipe placeholder gradients are *deliberately* placeholders. Replace
with real food photography in production (one example image,
`images/zucchini.png`, is included as a style reference).

---

## Screens / Views

### 1 · Übersicht (Home)

**Purpose:** Browse, search, and filter the personal recipe collection. Tap a
card to open the cooking view.

**Layout (mobile, ~402 px wide):**

```
┌──────────────────────────────────────────┐
│  iOS status bar (system)                 │  44 pt
├──────────────────────────────────────────┤
│  20px ── horizontal padding ── 20px      │
│                                          │
│  EYEBROW: "DO · 22. MAI"  (mono, 10/12)  │
│  H1:      "Rezepte"  (Newsreader 38)   ⊕ │  ← + button, 40×40, circle
│                                          │
│  ┌──────────────────────────────────────┐│
│  │ 🔍  Rezept oder Zutat suchen         ││  ← search, 12px radius, 1px line
│  └──────────────────────────────────────┘│
│                                          │
│  [Alle] [Frühstück] [Mittagessen] […]  → │  ← horizontal chip scroll
│                                          │
│  ┌──────────┐  ┌──────────┐              │
│  │  PHOTO   │  │  PHOTO   │              │  ← 170 px tall, 14 px radius
│  │       ♡  │  │       ♡  │              │     bookmark top-right
│  └──────────┘  └──────────┘              │
│  Zucchinipuffer  Krautnudeln             │  ← Newsreader 17/1.15
│  ⏱ 25 Min · Mittag  ⏱ 35 Min · Abendessen│  ← Manrope 12, muted
│                                          │
│  ┌──────────┐  ┌──────────┐              │
│  │   …      │  │   …      │              │  ← 2-col grid, 16 px gap
│  └──────────┘  └──────────┘              │
└──────────────────────────────────────────┘
```

**Components:**

- **Header** (`padding: 8px 20px 6px`)
  - Eyebrow date in JetBrains Mono `10/12, letter-spacing 0.18em, uppercase, color: var(--muted)`
  - Title `Rezepte` — Newsreader 400, 38 px / 1.0, letter-spacing −0.01em, color: var(--fg)
  - Right-aligned `+` button — 40×40 circle, `1px solid var(--line)` on `var(--surface)`

- **Search field** (`padding: 11px 14px`, `border-radius: 12`, `1px solid var(--line)`, `background: var(--surface)`)
  - Search icon 17 px, color `var(--muted)`
  - Placeholder "Rezept oder Zutat suchen", 15 px
  - Margin-bottom 14 px

- **Filter chips** (horizontal scroll row, `gap: 8`, scrollbar hidden)
  - All labels: `Alle / Frühstück / Mittagessen / Abendessen / vegetarisch / warm / kalt / schnell (<30 Min) / Schweizer Küche / Italienisch`
  - Each chip: `padding: 8px 14px`, `border-radius: 999`, font 13 px
  - **Inactive** chip: `border: 1px solid var(--line)`, `background: var(--surface)`, `color: var(--fg)`, font-weight 500
  - **Active** chip: `border: 1px solid var(--accent)`, `background: var(--accent)`, `color: var(--accent-fg)`, font-weight 600
  - Transition 120 ms

- **Recipe grid** (`grid-template-columns: repeat(2, minmax(0, 1fr))`, `gap: 16`, padding `0 20px`)
  - On tablet/desktop, allow `repeat(auto-fill, minmax(180px, 1fr))` for 3–4 columns
  - **Card**:
    - Photo: full width × 170 px, `border-radius: 14`, `overflow: hidden`
    - If real photo: `object-fit: cover` + bottom-only gradient overlay `linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.18))`
    - If placeholder: layered radial gradients in the recipe's `tint[3]` palette + faint stripe overlay + monospace caption "[ Foto · id ]" bottom-left
    - **Bookmark button** on photo: top-right, 32×32 circle, `rgba(255,255,255,0.85)` with `backdrop-filter: blur(8px)`, icon stroke 15 px (filled when bookmarked, accent-coloured)
    - Title: Newsreader 500, 17 px / 1.15, letter-spacing −0.005em, margin-top 10 px (padding-left 2 px from photo edge)
    - Meta row: 12 px Manrope, `var(--muted)`, gap 5 px — `⏱ {minutes} Min. · {primary_label}`

**Interactions:**

- Tap card body → navigate to Kochansicht (passing recipe id)
- Tap bookmark → toggle local state, stopPropagation
- Tap filter chip → set active filter, filter the grid (only one active at a time; "Alle" clears)
- Type in search → filter cards by title or ingredient substring
- + button → "Neues Rezept" flow (not designed yet)

---

### 2 · Kochansicht (Recipe Detail)

**Purpose:** Cook from the phone. The recipe lives on a single scrollable
page. The **hero photo and title scroll away**, the **ingredients block
pins to the top** of the viewport, and the **steps continue scrolling**
beneath it. The back button floats persistently in the top-left so cooking
hands can always exit.

**Layout (mobile, ~402 × 874):**

```
┌──────────────────────────────────────────┐   ← INITIAL STATE
│  iOS status bar                          │
├──────────────────────────────────────────┤
│  ┌────────────────────────────────────┐  │
│  │ ←       Hero photo, full-bleed   ♥ │  │  ← 220 px tall, no radius
│  │                                    │  │     back/bookmark FLOAT (zIndex 20)
│  └────────────────────────────────────┘  │     they stay visible after scroll
│                                          │
│   Zucchinipuffer       (Newsreader 28)   │
│   [mittagessen] [vegetarisch] [warm]     │
│   ⏱ 25 Min.   👥 4 Portionen             │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ ZUTATEN              8 Zutaten     │  │  ← starts sticky-eligible here
│  │ Zucchini   500 g   Eier         2  │  │
│  │ Mehl         4 EL   Parmesan  60 g │  │
│  │ …                                  │  │
│  └────────────────────────────────────┘  │
│                                          │
│   ZUBEREITUNG              1 / 5         │
│  ┌────────────────────────────────────┐  │
│  │ ① Zucchini grob raspeln …          │  │  ← steps flow naturally below
│  │ ② Eier, Mehl, Parmesan …           │  │     no inner scroll region anymore
│  │ ③ …                                │  │
└─└────────────────────────────────────┘──┘
        ↓ user scrolls down ↓

┌──────────────────────────────────────────┐   ← SCROLLED STATE
│  ←  (back button still floating)      ♥  │
│  ┌────────────────────────────────────┐  │
│  │ ZUTATEN              8 Zutaten     │  │  ← pinned at top
│  │ Zucchini   500 g   Eier         2  │  │     position: sticky; top: 0
│  │ Mehl         4 EL   Parmesan  60 g │  │     soft shadow appears when stuck
│  │ Knoblauch     1    Petersilie  ½  │  │
│  │ Olivenöl     3 EL   Salz n. B.    │  │
│  └────────────────────────────────────┘  │
│  ────────────────────────────────────    │
│   ZUBEREITUNG              3 / 5         │
│   ② Eier, Mehl, Parmesan …               │  ← steps continue scrolling
│   ③ Olivenöl in beschichteter …          │     under the sticky band
│   ④ Bei mittlerer Hitze pro …            │
│   ⑤ Mit Kräuterquark servieren.          │
└──────────────────────────────────────────┘
```

**Structure (single scroll region):**

```
<screen> position: relative; height: 100%; overflow: hidden
  <back-btn> position: absolute; top:14; left:16; zIndex:20 (FLOATS)
  <bookmark-btn> position: absolute; top:14; right:16; zIndex:20 (FLOATS)
  <scroll-container> height: 100%; overflow-y: auto
    <hero>          220 px
    <title-block>   padding 14/20/12, ~96 px tall
    <sticky-band>   position: sticky; top: 0; zIndex: 5
      <ingredients-card>  margin 0 20px, padding 12/14/10, 14 px radius
    <steps-block>   padding 14/20/32
      <step-row>×N
```

**Sticky-band detail:**

- The `<sticky-band>` is a wrapper element with `background: var(--bg)`
  (cream) and `padding: 6px 0 8px`. This means as the user scrolls, the
  ingredients card is wrapped in a cream-coloured strip that hides the
  content above it.
- The wrapper itself is `position: sticky; top: 0`. Inside it, the
  ingredients card has its own border, surface background and rounded
  corners — so the visual sits on the cream strip cleanly.
- **On "stuck" detection** (scrollTop > ~260 px in the prototype, but
  better to use IntersectionObserver in production), the wrapper gets a
  soft drop shadow:
  `box-shadow: 0 6px 14px rgba(42, 31, 26, 0.10)`, transitioned 180 ms.
  This signals "this is now a header bar".

**Components (same specs as before — only the layout structure changes):**

- **Floating back button** (`absolute`, `top: 14, left: 16, zIndex: 20`):
  38×38 circle, `rgba(255,255,255,0.92)` background, `backdrop-filter: blur(8px)`,
  icon stroke 17 px, color `#2a1f1a`, `box-shadow: 0 2px 8px rgba(0,0,0,0.16)`.
  Sits on top of the hero photo initially; sits on top of the sticky
  ingredients band after scroll. The blur + shadow let it read on both.

- **Floating bookmark button:** symmetric on the right, same style, icon
  color `var(--accent)`, filled when bookmarked.

- **Hero photo:** full-bleed, 220 px tall, `border-radius: 0`. Real img
  or placeholder.

- **Title block** (`padding: 14px 20px 12px`):
  - H1 Newsreader 400, 28 px / 1.05, letter-spacing −0.01em, margin-bottom 8 px
  - Label chips row: gap 6, flex-wrap. Each chip: 11 px JetBrains Mono, padding `3px 8px`, `border-radius: 999`, `background: var(--accent-soft)`, `color: var(--accent-deep)`, letter-spacing 0.04em, text-transform lowercase. Max 3 labels.
  - Meta row: gap 18, 13 px `var(--muted)`. Items have icon + text gap 6.

- **Ingredients card** (inside sticky wrapper, `margin: 0 20px`, `padding: 12px 14px 10px`, `border-radius: 14`, `1px solid var(--line)`, `background: var(--surface)`):
  - Header row: "ZUTATEN" mono eyebrow + right-side count
  - 2-column grid (`grid-template-columns: 1fr 1fr`, `column-gap: 14`, `row-gap: 6`)
  - Each row: flex space-between, name (13.5 px) left, amount (12 px mono `var(--muted)`) right
  - `border-bottom: 1px dashed var(--line-soft)`, `padding-bottom: 5`
  - **Tap to check off** → `opacity: 0.4` + `text-decoration: line-through`

- **Steps block** (`padding: 14px 20px 32px`):
  - Header row: "ZUBEREITUNG" mono eyebrow + `{activeStep + 1} / {total}` step counter
  - Each step row: padding `12px 4px`, `border-bottom: 1px solid var(--line-soft)` (none on last)
  - Number badge: 26×26 circle, JetBrains Mono 12/600
    - **Active**: `background: var(--accent)`, `color: var(--accent-fg)`, no border
    - **Inactive**: transparent bg, `1px solid var(--line)`, `color: var(--muted)`
  - Step text: line-height 1.45, `text-wrap: pretty`
    - **Active**: 15 px / 500, color `var(--fg)`
    - **Inactive**: 14 px / 400, color `var(--fg-soft)`
  - Tap step to make it active

**Why the sticky behavior matters for cooking:** ingredients are the part
you reference constantly while measuring and chopping. They must remain
visible no matter how far down the steps you've scrolled. Hero + title can
go — you only see them once.

---

## Interactions & Behavior

| Action | Result |
|---|---|
| Tap recipe card | Open Kochansicht for that recipe |
| Tap bookmark | Toggle bookmark (persist locally) |
| Type in search | Filter cards by title/ingredient (debounce 100 ms) |
| Tap chip | Set active filter (single-select; tapping "Alle" clears) |
| Scroll chip row | Horizontal momentum scroll, hidden scrollbar |
| Tap ingredient | Mark as checked off (strike-through, faded) |
| Tap step | Mark as active step (visual emphasis, advance counter) |
| Tap back | Pop navigation to Übersicht |

**Animations:**
- Chip activation: 120 ms ease background/color/border
- Step activation: 120 ms ease font-size/color
- Bookmark toggle: instant fill, optional subtle scale pulse

**No router needed** — the prototype passes a `recipeId` and an `onBack` prop;
in the target app, use the codebase's existing navigation pattern.

---

## State Management

Minimal — fits in component state or a thin store.

- `recipes: Recipe[]` — load from local storage / backend
- `query: string` — search input
- `activeFilter: string` — current chip
- `bookmarks: Set<recipeId>` — persisted to local storage
- Per-detail-screen:
  - `checkedIngredients: Set<index>` — ephemeral, reset on screen exit
  - `activeStep: number` — ephemeral

---

## Design Tokens

### Colors (light, default — Terrakotta accent)

```css
--bg:          #faf6f0;
--surface:     #ffffff;
--fg:          #2a1f1a;
--fg-soft:     #4a3a30;
--muted:       #8a7a6e;
--line:        rgba(42, 31, 26, 0.10);
--line-soft:   rgba(42, 31, 26, 0.06);
--accent:      #c8623f;
--accent-deep: #8a3e25;
--accent-soft: #f4e3d9;
--accent-fg:   #fffaf6;
```

### Accent variants (only --accent-* tokens change)

| Palette     | --accent | --accent-deep | --accent-soft | --accent-fg |
|-------------|----------|---------------|---------------|-------------|
| Terrakotta  | #c8623f  | #8a3e25       | #f4e3d9       | #fffaf6     |
| Olivgrün    | #6f7a3a  | #4a521f       | #e8eadc       | #fafbf3     |
| Senfgelb    | #c89432  | #8a611a       | #f4ebd2       | #fffaf0     |

### Dark mode (override bg/surface/fg/lines)

```css
--bg:        #1a1411;
--surface:   #241c17;
--fg:        #f5ece2;
--fg-soft:   #d6c8b8;
--muted:     #a39283;
--line:      rgba(245, 236, 226, 0.10);
--line-soft: rgba(245, 236, 226, 0.06);
```

### Typography

- **Display:** `Newsreader` (Google Fonts, weights 400, 500). Used for H1
  (Rezepte 38 / recipe title 28) and card titles (17 / 500).
- **UI:** `Manrope` (Google Fonts, weights 400, 500, 600, 700). Used for body,
  buttons, meta, search input.
- **Meta / placeholders:** `JetBrains Mono` (Google Fonts, weights 400, 500).
  Used for eyebrows, label chips, ingredient amounts, step badges, counters.

Google Fonts URL:
```
https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap
```

### Spacing scale

Used implicitly: `4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 38, 56` px.
Outer screen padding is `20 px`. Card inner padding is `12–14 px`.

### Radius scale

| Use | Radius |
|---|---|
| Pills (chips, buttons) | 999 px |
| Cards (recipe card photo, ingredient block, search) | 12–14 px |
| Step number badge | 999 px |
| Step rows separators | n/a (1 px dashed/solid border) |

### Shadows

- Bookmark button float over photo: `0 2px 8px rgba(0,0,0,0.12)` (only the back button on the detail hero uses this; the in-card bookmark uses backdrop blur alone).

---

## Assets

- `images/zucchini.png` — example real food photo (style reference for the
  rest of the photography). User generates the remaining 4 via Gemini using
  the prompts in `Gemini Prompts.html`.
- All icons are inline SVG (simple line icons: search, clock, portions, back
  arrow, bookmark, plus). Replace with the codebase's existing icon library
  if it has equivalents (Lucide, Heroicons, SF Symbols, Material Icons).

---

## Recipe data schema

```ts
type Recipe = {
  id: string;
  title: string;
  minutes: number;         // total cooking time
  portions: number;
  labels: string[];        // e.g. ["Mittagessen", "vegetarisch", "warm", "schnell"]
  photo?: string;          // path/URL; if missing, fall back to gradient placeholder
  tint: [string, string, string]; // fallback placeholder gradient
  ingredients: Array<[name: string, amount: string]>; // e.g. ["Zucchini", "500 g"]
  steps: string[];         // each step is one paragraph
};
```

Full seed data for 5 recipes (Zucchinipuffer, Krautnudeln, Kaspressknödel,
Gemüsegratin, Lachs im Ofen) is in `recipe-data.jsx`.

---

## Files in this bundle

| File | Purpose |
|---|---|
| `README.md` | This document |
| `screenshots/00-overview.png` | Both screens side-by-side (above the fold) |
| `screenshots/01-uebersicht.png` | Home / Übersicht screen — top portion |
| `screenshots/02-kochansicht.png` | Recipe detail / Kochansicht — top portion |
| `Rezeptsammlung.html` | Main prototype file — App shell, theme system, Tweaks panel wiring |
| `screens.jsx` | The two screens (`HomeScreen`, `CookScreen`) + `RecipePhoto` |
| `recipe-data.jsx` | The 5 seed recipes + gradient helpers |
| `ios-frame.jsx` | iPhone bezel — IGNORE for production; just a presentation wrapper |
| `design-canvas.jsx` | Design canvas wrapper for showing both screens side-by-side — IGNORE |
| `tweaks-panel.jsx` | Live theme-tweak panel — IGNORE; just a design exploration tool |
| `Gemini Prompts.html` | Image prompts for generating the remaining 4 recipe photos |
| `images/zucchini.png` | Example real food photo (style reference) |

The PNG screenshots show the above-the-fold portion of each screen. For the
full interactive layout (including the scrollable filter chips, the rest of
the recipe grid, and the steps list of the cooking view), open
`Rezeptsammlung.html` in a browser.

The screens and tokens are what you implement.
Everything else is design-time scaffolding.

---

## Suggested implementation order

1. Set up theme tokens (CSS variables, or a theme object — pick whatever the
   codebase uses) including the 3 accent palettes + dark mode.
2. Wire Google Fonts (Newsreader, Manrope, JetBrains Mono).
3. Build `RecipeCard` — photo (with placeholder fallback), title, meta.
4. Build `HomeScreen` — header, search, chip row, grid.
5. Build `CookScreen` — hero, title block, ingredients grid, scrollable steps.
6. Add navigation between the two.
7. Wire data — start with the 5 seed recipes; later, add CRUD for "Neues Rezept".
