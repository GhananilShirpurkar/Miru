<div align="center">

# MIRU // 見・ル

### The Cybernetic Anime Telemetry Console & Intelligence Engine

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite 7](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GraphQL](https://img.shields.io/badge/AniList-GraphQL_API-E10098?style=flat-square&logo=graphql&logoColor=white)](https://graphql.anilist.co)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-black?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Web Audio API](https://img.shields.io/badge/Audio-Pure_Web_Audio_Synth-FF2E4D?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

<br />

> **Traditional anime trackers are cluttered, slow, and built on designs from 2008.**  
> **MIRU is an editorial command center for anime intelligence—tactile, instantaneous, keyboard-first, and bathed in obsidian and crimson.**

<br />

[Live Demo](#quick-start) • [Core Engines](#core-engines) • [Keyboard Architecture](#keyboard-first-command-matrix) • [Tech Stack](#technical-architecture) • [Getting Started](#quick-start)

---

</div>

<br />

## ⚡ The MIRU Manifesto

Most anime platforms treat data like a bureaucratic filing cabinet: sluggish page reloads, intrusive advertising, bloated social feeds, and clunky CRUD interactions.

**MIRU reimagines anime discovery as a cybernetic telemetry station.** Built on React 19, Tailwind CSS v4, and AniList's high-fidelity GraphQL API, MIRU strips away the fluff to deliver an editorial interface engineered for speed, density, and aesthetic supremacy.

- **Zero-Page-Hop Exploration:** Inspect complete show dossiers without breaking your scroll position or ditching your active search query.
- **Hardware-Accelerated Tactility:** Physical spring interactions, interactive 3D perspective cards, and a procedural Web Audio synthesizer that computes soundwaves in real time.
- **Data Sovereignty:** Offline-first architecture with instant JSON import/export. No forced logins, no tracking cookies, and zero cloud vendor lock-in.

---

## 🛰️ Core Engines

### 1. 🗂️ Non-Destructive Quick Dossier Drawer
Click any anime card across any view to deploy a side-docked telemetry dossier.
- Deep metric readouts: mean scores, popularity percentiles, broadcast statuses, and studio genealogy.
- Instant vault categorization without navigating away from your discovery flow.
- Seamless keyboard dismissal via <kbd>Esc</kbd> or backdrop blurs.

### 2. ⚔️ Combatant Versus Matrix (`/compare`)
Head-to-head metric battleground pitting any two titles against each other in real-time.
- Automated statistical dominance calculation across community rating, episode distribution, and global popularity rank.
- Visual victor badges and comparative delta badges for instant telemetry comparison.
- Integrated search picker to hot-swap combatants on the fly.

### 3. 📊 High-Density Telemetry & Analytics (`/analytics`)
Dual-engine visual analytics suite driven by Recharts custom gradient pipelines.
- **Global Intelligence:** Aggregated genre distributions, format breakdowns, and season release curves parsed directly from the top tier of anime history.
- **Personal Vault Analytics:** Visual breakdown of your viewing velocity, status distributions (Watching, Plan, Completed, Favorite), and computed time investments.
- **Simulated Real-Time Telemetry Feed:** Dynamic event log monitoring synchronization heartbeat and data throughput.

### 4. 🛡️ Autonomous Reactive Vault (`/vault`)
Your personal offline-first repository.
- Four distinct lifecycle tiers: `Watching`, `Plan to Watch`, `Completed`, and `Favorites`.
- Reactive local storage with cross-component event dispatchers that synchronize state across drawers, grids, and analytic graphs instantly.
- One-click zero-loss data portability: Export and import complete backup dossiers formatted in structured JSON.

### 5. ⌨️ Command Palette & Quick HUD
Engineered for zero mouse dependency.
- Hit <kbd>/</kbd> anywhere to trigger immediate search focus.
- Hit <kbd>Cmd</kbd> + <kbd>K</kbd> (or click the quick command terminal) to trigger the HUD Command Palette.
- Instant access to mood presets: *Dark Psychological Thriller*, *Cozy Slice of Life*, *Epic Shonen Battles*, and *High-Budget Sci-Fi*.

### 6. 🔊 Zero-Asset Cybernetic Sound Synthesizer
Every click, hover, and drawer interaction emits crisp, tactile acoustic feedback.
- Powered exclusively by the mathematical **Web Audio API** (`OscillatorNode` + `GainNode` exponential decay ramps).
- **0 kB sound asset footprint:** No MP3 or WAV downloads—pure browser wave generation.
- Built-in mute toggle persisted in local configuration.

---

## ⌨️ Keyboard-First Command Matrix

MIRU was designed from the ground up for power users who prefer the keyboard over the cursor:

| Keybinding | Scope | Operation |
| :--- | :--- | :--- |
| <kbd>/</kbd> | Global | Jump directly to Search Engine input |
| <kbd>Cmd</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> | Global | Open Cybernetic Command Palette HUD |
| <kbd>Esc</kbd> | Modal / Drawer | Dismiss Quick Dossier Drawer or Command Palette |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Command Palette | Navigate active search matches |
| <kbd>Enter</kbd> | Command Palette | Select show / Open detailed dossier |

---

## 🎨 Kurogane Aesthetic Design System

MIRU’s visual signature blends high-contrast cyberpunk utility with editorial manga craftsmanship:

```
[#09090b]  OBSIDIAN VOID   ── Primary surface background
[#121216]  STEEL SURFACE   ── Card containers and elevated panels
[#ff2e4d]  CRIMSON SIGNAL  ── Primary telemetry accent & highlights
[#ff7e33]  EMBER FLARE     ── Secondary warning / seasonal accent
[#fbbf24]  CYBER GOLD      ── Star ratings and pinnacle rankings
```

- **Manga Halftone Shaders:** Custom CSS radial micro-dot patterns echoing vintage print and modern screentone techniques.
- **Kinetic Stagger Sequences:** Orchestrated with Framer Motion spring physics (`damping: 25`, `stiffness: 220`) for zero-sluggishness transitions.
- **Editorial Typography:**
  - **Headings & Display:** *Outfit* / *Space Grotesk*
  - **Body & Editorial Copy:** *Plus Jakarta Sans*
  - **Telemetry Data & Timestamps:** *JetBrains Mono*
  - **Kanji & Subtitles:** *Noto Sans JP*

---

## 🏗️ Technical Architecture

```
                       ┌──────────────────────────────┐
                       │      AniList GraphQL API     │
                       └──────────────┬───────────────┘
                                      │  Rate-Limited (90 req/min)
                                      ▼
                       ┌──────────────────────────────┐
                       │     LRU Cache & Retry Engine │
                       │    (Auto Backoff on 429s)    │
                       └──────────────┬───────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
  ┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
  │   Browse / Hero   │     │  Compare Matrix   │     │  Global Analytics │
  │  Trending/Seasonal│     │ Head-to-Head Sim  │     │  Recharts Engine  │
  └─────────┬─────────┘     └─────────┬─────────┘     └─────────┬─────────┘
            │                         │                         │
            └─────────────────────────┼─────────────────────────┘
                                      ▼
                       ┌──────────────────────────────┐
                       │  Reactive Event Emitter Bus  │
                       └──────────────┬───────────────┘
                                      ▼
                       ┌──────────────────────────────┐
                       │   Local Vault Persistence    │
                       │   (JSON Export / Import)     │
                       └──────────────────────────────┘
```

| Domain | Technology | Implementation Detail |
| :--- | :--- | :--- |
| **Runtime & Core** | React 19 + Vite 7 | Modern React architecture with lightning HMR |
| **Routing** | React Router DOM v7 | Route-driven telemetry views with deep URL parameter sync |
| **Style Layer** | Tailwind CSS v4 + Tokens | Zero runtime CSS overhead, container-aware classes |
| **Animation** | Framer Motion 12 | Hardware-accelerated exit/enter springs and tilt physics |
| **Data Visualization** | Recharts 3 | Custom gradient fills, dynamic bar projections, radial charts |
| **Audio Engine** | Web Audio API | Client-side synthesized sine/sawtooth soundwave triggers |
| **Icons** | Lucide React | Clean, monochrome vector iconography |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**, **pnpm**, or **yarn**

### 1. Clone & Install
```bash
git clone https://github.com/GhananilShirpurkar/Miru.git
cd Miru
npm install
```

### 2. Launch Local Console
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 📁 Repository Blueprint

```
MIRU/
├── public/                # Static brand assets & favicon
├── src/
│   ├── components/        # Editorial UI component library
│   │   ├── AnimeCard.jsx          # Interactive 3D perspective card
│   │   ├── CommandPalette.jsx     # Global search HUD (Cmd+K)
│   │   ├── HeroSection.jsx        # Editorial headline carousel
│   │   ├── MangaFX.jsx            # Speedlines and halftone overlays
│   │   ├── Navbar.jsx             # Cyberpunk glass header with shortcuts
│   │   ├── QuickDossierDrawer.jsx # Slide-out telemetry drawer
│   │   └── VaultCategoryPicker.jsx# Multi-status triage switcher
│   ├── hooks/             # Custom reactive hooks (sound, vault, drawer)
│   ├── lib/
│   │   ├── api.js                 # AniList GraphQL client with retry/cache
│   │   ├── sound.js               # Web Audio API procedural synthesizer
│   │   └── watchlist.js           # Vault store with cross-tab events
│   ├── pages/
│   │   ├── Analytics.jsx          # Telemetry dashboard & charts
│   │   ├── AnimeDetail.jsx        # Deep-dive dossier view
│   │   ├── Compare.jsx            # Head-to-head combatant arena
│   │   ├── Home.jsx               # Curated radar & trending broadcasts
│   │   ├── Search.jsx             # Multi-filter tactical query engine
│   │   ├── Seasonal.jsx           # Broadcast calendar grid
│   │   └── Watchlist.jsx          # Offline vault & JSON data manager
│   ├── index.css          # Design system tokens & halftone utilities
│   └── App.jsx            # Router and persistent HUD layers
├── package.json           # Scripts and dependencies
└── vite.config.js         # Vite configuration
```

---

## 🔒 Privacy & Data Sovereignty

- **Zero Telemetry Tracking:** MIRU does not track your IP, search queries, or viewing history.
- **Local Storage Isolation:** Your vault data lives exclusively within your browser's `localStorage`.
- **Portable Backups:** Move your library anywhere with instant `.json` exports and imports.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

Data provided by the [AniList GraphQL API](https://anilist.gitbook.io/anilist-apiv2-docs/). All anime imagery and metadata are copyright to their respective studios and creators.

---

<div align="center">
  <sub>Engineered for speed, clarity, and visual impact.</sub><br />
  <strong>MIRU // 見・ル</strong>
</div>
