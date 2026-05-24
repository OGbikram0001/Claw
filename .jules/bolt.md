## 2026-05-24 - Prevent React Re-render Cascades
**Learning:** In complex list/chat views with state co-location (e.g., highly frequent inputText updates in parent components), passing large mapping objects directly as props to list items causes re-render cascades.
**Action:** Heavily utilize React.memo for list item components and useCallback for their prop handlers to preserve reference stability. Pass specific boolean primitives (e.g. `isToolExpanded={!!expandedTools[m.id]}`) instead of mapping objects.
