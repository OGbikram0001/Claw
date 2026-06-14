## 2024-06-14 - React List View Performance
**Learning:** Passing a large state mapping object (like `expandedTools` map) directly to child components in a list breaks reference stability and causes re-render cascades, even if `React.memo` is used.
**Action:** Pass specific boolean primitives (e.g. `isToolExpanded={!!expandedTools[m.id]}`) instead of the whole object, and heavily utilize `React.memo` and `useCallback` for prop handlers to preserve reference stability in complex list views.
