## 2024-05-20 - Memoization of Chat Messages
**Learning:** In complex chat views with co-located state (like text input updates alongside large lists of messages), the entire list can re-render needlessly on every keystroke.
**Action:** Always wrap heavy list components (like `UserBubble` and `AgentBubble`) in `React.memo` and strictly use primitive props (avoid passing full map objects like `expandedTools` down directly, pass derived booleans) along with `useCallback` for prop handlers to preserve reference stability and guarantee memoization boundaries.
