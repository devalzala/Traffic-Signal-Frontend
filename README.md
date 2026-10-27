# Traffic Signal Management System - Frontend

Single-page React app for configuring traffic signal timings for 3-way, 4-way and 5-way intersections and watching the signals run. Built with React, TypeScript, Vite, Tailwind CSS and Redux Toolkit.

The backend lives in a separate repository: **Traffic-Signal-Backend**. Start it first, because the app loads and saves timings through its API.

## Tech stack

- React 19 and TypeScript
- Vite
- Tailwind CSS 4
- Redux Toolkit (async thunks) and react-redux
- Axios

## Prerequisites

- Node.js 20 or newer and npm
- The backend running at `http://localhost:5000` (see the backend README: Docker Postgres, `npm run migrate`, `npm run seed`, `npm run dev`)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Optional: create `.env` if your API is not at the default address:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell use `Copy-Item .env.example .env`.

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

   If you skip this step, the app uses `http://localhost:5000/api`.

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Open `http://localhost:5173`. The backend only allows requests from this address.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Starts the Vite dev server |
| `npm run build` | Type-checks and builds for production |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |

## How to use the app

The page has 5 tabs: **3-Way**, **4-Way (Type 1)**, **4-Way (Type 2)**, **5-Way** and **Visualize**.

1. Pick a tab (or use **Select Ways** on the Visualize tab). The road layout changes to match: a T-junction for 3-way, a crossing for 4-way, and five roads for 5-way.
2. Click **Set Time**. Enter the time in seconds for each signal and click **Save**. The values are stored through the API.
3. After saving, the signals start running. Click **Start** to run them again later, for example after switching tabs. The timer does not start by itself when you change tabs.
4. Click **Reset** to restart the timer from the beginning. It keeps the selected intersection and the saved times.
5. Click an **Emergency** button to open that signal for 30 seconds (see below).

Saved times are loaded from the database when the app opens, so they survive a page reload.

### How the signals behave

- Signals take turns in order (Signal 1, 2, 3 ...). In 4-way Type 2, opposite signals open together: Signals 1 and 3, then Signals 2 and 4. Each signal is green for its own time, so the shorter one closes first, and the next pair opens when the longer one finishes.
- Only one signal is green at a time. All others are red.
- The green signal counts down its configured time in green. A red signal shows its own configured time in red.
- During the last 3 seconds of a slot, the signal that is closing and the signal that is about to open both turn yellow. A signal goes green, yellow, red, and then red, yellow, green. Slots of 3 seconds or less change without yellow.
- Before you click Start or save, all lights are green and no numbers are shown.

### Emergency

Each signal has an Emergency button, so there are 3, 4 or 5 buttons depending on the intersection. Pressing one turns that signal green with a 30 second countdown and turns all other signals red. After 30 seconds the normal timer restarts from Signal 1. Pressing another Emergency button during an emergency switches to that signal. Reset and changing the intersection cancel an emergency.

## Project structure

```
src/
  api/           axios client and API calls
  store/         Redux store, configurations slice (thunks), typed hooks
  components/    Tabs, IntersectionView, SignalLayer, TrafficLight, SignalTimeForm
  hooks/         useSignalCycle (the signal timing logic)
  constants/     intersection layouts, tab list, emergency time
  utils/         geometry helper for placing the traffic lights
  App.tsx        tabs and error banner
```

Data flow: on start, `fetchConfigurations` loads all saved timings into Redux. `saveConfiguration` sends a `PUT` and then fetches the latest data from the API, and the timer restarts from those values.

## Assumptions

- The PDF does not say how 4-way Type 1 and Type 2 differ. Both use the same crossing layout. In Type 1 each signal opens on its own, in order 1, 2, 3, 4. In Type 2 opposite signals share a phase (1 and 3 together, then 2 and 4).
- Yellow is shown for the last 3 seconds of a slot.
- The Figma only shows the 4-way crossing, so the 3-way and 5-way layouts were designed to match its style.
- The Emergency button opens its signal for 30 seconds and holds all other signals on red.

## Troubleshooting

- **Error banner at the top / nothing loads**: the backend is not running or not reachable. Check `http://localhost:5000/api/health`.
- **Set Time button is disabled**: select an intersection first.
- **Start button is disabled**: that intersection has no saved times yet. Use Set Time and Save.
- **CORS errors**: open the app at `http://localhost:5173`.

## Architecture notes

<!-- Add your own architectural choices and the reasoning behind them here. -->

## Time log

- Start: <!-- fill in -->
- End: <!-- fill in -->
