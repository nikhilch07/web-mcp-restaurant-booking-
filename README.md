# WebMCP Restaurant Booking

A React + Vite restaurant reservation app with accessible form UI, restaurant selection, booking flow, and MCP-B tool integration.

## What this app does

- Lets users search restaurants by cuisine, date, and party size
- Displays restaurant results as accessible badge-style buttons
- Shows restaurant details and available reservation slots
- Collects guest details and confirms a booking
- Displays a final confirmation page with booking and guest information
- Integrates MCP-B tool hooks for AI-driven interactions in the browser
- Uses WCAG 2.0 AA-friendly styling and accessible form semantics

## Features

- React 19 + Vite 4 app architecture
- Client-side routing with `react-router-dom`
- Form validation with `zod`
- Accessible input labels, contrast-safe colors, and keyboard-friendly controls
- Responsive restaurant and booking UI
- Imperative MCP-B hook registration using `useWebMCP`

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Run ESLint checks:

```bash
npm run lint
```

## Project structure

- `src/main.jsx` — App entry, routing, and MCP-B initialization
- `src/App.jsx` — Main layout and shared routes
- `src/pages/SearchPage.jsx` — Search form and restaurant selection
- `src/pages/RestaurantPage.jsx` — Restaurant details and slot selection
- `src/pages/BookPage.jsx` — Guest booking form
- `src/pages/ConfirmPage.jsx` — Reservation confirmation
- `src/index.css` — Global styles and accessibility-focused design

## Notes before pushing

- `.gitignore` already excludes `node_modules`, build output, and local environment files
- Add repository remote and push changes after verifying the app works locally

