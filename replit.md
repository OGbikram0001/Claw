# Project Overview

This repository contains an Expo (React Native + web) frontend that renders a UI mockup of an agent dashboard ("kittyclaw"), and a small FastAPI backend scaffold.

## Structure

- `frontend/` — Expo Router app. Renders on web via Metro. Uses mock data only — it does not call the backend.
  - `app/` — Expo Router routes (`index.tsx`, `+html.tsx`).
  - `src/` — UI primitives, theme, views, bubbles, and mock data.
  - `metro.config.js` — Metro bundler config; `server.host` is set to `0.0.0.0` so the Replit proxy can reach the dev server.
- `backend/` — FastAPI scaffold (`server.py`) that depends on MongoDB (motor). Currently not wired to any frontend feature and not started by a workflow because MongoDB is not provisioned in this Repl.

## Replit Setup

- Workflow `Start application` runs `cd frontend && npx expo start --web --port 5000` on port 5000 (webview).
- The frontend is served by Metro and reachable through the Replit preview proxy.
- Deployment is configured as a `static` site:
  - Build: `cd frontend && npx expo export -p web`
  - Public dir: `frontend/dist`

## Notes

- The backend uses MongoDB; it is not active in development. To enable it later, provide `MONGO_URL` and `DB_NAME` env vars and add a workflow such as `cd backend && uvicorn server:app --host 0.0.0.0 --port 8000`.
- Frontend host config: `metro.config.js` binds the dev server to `0.0.0.0`, which is required for the Replit iframe proxy.
