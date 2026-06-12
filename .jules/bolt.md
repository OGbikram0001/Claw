## 2024-06-12 - Prevent React Re-render Cascade in Chat View
**Learning:** In complex chat views with co-located state (like frequent `inputText` updates in the parent `ChatScreen`), passing mapping objects and inline arrow functions to list items causes every message to re-render on every keystroke.
**Action:** Heavily utilize `React.memo` for list item components. Use `useCallback` for their prop handlers to preserve reference stability. Avoid passing large mapping objects directly as props; pass specific boolean primitives instead (e.g., `isToolExpanded={!!expandedTools[m.id]}`).
