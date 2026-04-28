# Kittyclaw - AI Agent Mobile App (PRD)

## Overview
Pixel-perfect React Native (Expo) port of the Kittyclaw AI agent dashboard with custom themed rich-content blocks, A2UI v0.9 renderer, and a fully-animated liquid-glass UI.

## Stack
- Frontend: Expo 54 + React Native + Expo Router
- Animation: react-native-reanimated v4
- Glass: expo-blur + expo-linear-gradient
- SVG/Diagrams: react-native-svg, mermaid (via WebView/iframe)
- Icons: @expo/vector-icons (Ionicons)
- Backend: not used in v1 (mocked chat responses)

## Key Features

### 1. Navigation Shell (matches reference design)
- **Top Header** (transparent floating): morphing hamburger ↔ back button, logo ↔ chat title, progress pill ↔ chat actions (new chat / menu)
- **Bottom Bar** (liquid glass): Chats/Spaces/Files nav pill + morphing FAB that expands into "What should I build?" composer
- **Sidebar drawer** with workspace items + user card

### 2. Three home tabs
- **Chats** – conversation list with status dots, unread badges, agent icons
- **Spaces** – 2-column space grid with agent stack avatars and live status
- **Files** – cloud storage progress, folders carousel, recent files list

### 3. Chat experience
- Lightweight in-house Markdown renderer (bold, italic, code, links, lists, headings, quotes)
- Floating glass input pill with attach / mic / send
- User & agent bubbles with proper tail orientation
- Approval cards with Approve/Reject CTAs

### 4. 12 Custom themed agent blocks
1. **CodeBlock** – fake-highlighted Python with copy button
2. **TerminalBlock** – streaming character output + blinking cursor
3. **ConnectionBlock** – animated architecture diagram (vertical or horizontal)
4. **MermaidBlock** – real mermaid diagrams (WebView on native, iframe on web) themed in amber/violet
5. **SwarmBlock** – floating multi-agent visualization with breathing animation
6. **PreviewBlock** – browser-chrome web preview with stat tiles
7. **BrowserBlock** – live agent web-session with action checklist
8. **SearchBlock** – search results with colored source badges
9. **DeepResearchBlock** – multi-step research with source counters
10. **ToolCallBlock** – collapsible tool execution (search/code/file/browser)
11. **PlanBlock** – numbered plan with per-step progress bars
12. **AutomationBlock** – workflow pipeline with pulsing "running" state

### 5. A2UI v0.9 Renderer
- Implements Google's [A2UI](https://a2ui.org) declarative agent-UI protocol
- Supports Basic Catalog: Text (with variants), Card, Row, Column, Button, TextField, CheckBox, Divider, List, Icon
- Components addressed by `id`, children referenced by id (adjacency-list style)
- v0.9 spec compliant — agent sends JSON, client renders natively

### 6. Background tasks indicator
- Live circular progress in header
- Tap reveals glass-dropdown with all running tasks + per-task progress

## Mocked Conversations
5 demo chats showcasing every block type (architecture, swarm+terminal, automation+plan+approval, deep-research+browser, mermaid+search).

## Files
- `app/index.tsx` — main shell, view orchestration, mock chat brain
- `src/theme.ts` — design tokens
- `src/primitives.tsx` — Logo, GlassPill (BlurView+Gradient), CircularProgress, StatusDot, TypingDots, BlinkingCursor, AmbientBlob, Ic
- `src/blocks.tsx` — all 12 themed blocks
- `src/A2UIRenderer.tsx` — A2UI v0.9 component renderer
- `src/Markdown.tsx` — lightweight RN markdown
- `src/Bubbles.tsx` — User/Agent bubbles + Approval card
- `src/Header.tsx` — animated top header with morphs
- `src/BottomBar.tsx` — liquid-glass nav + morphing FAB composer
- `src/Views.tsx` — Chats / Spaces / Files / Sidebar / Dropdowns
- `src/data/mock.ts` — mock conversations and seed data

## Next Steps
- Wire backend with FastAPI + MongoDB for chat persistence
- Connect to a real LLM via Emergent LLM key (Claude/GPT) for AI responses
- Stream A2UI surfaces from agent over WebSockets
- Add voice input integration
