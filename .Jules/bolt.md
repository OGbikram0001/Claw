## 2024-05-17 - Prevent React Re-render Cascades in Chat View
**Learning:** In complex chat views, co-located state like input text updates can cause severe re-render cascades if child components rely on mapping objects directly, or if they receive inline functions and aren't memoized.
**Action:** Heavily utilize `React.memo` for list item components, pass specific boolean primitives instead of large mapping objects (e.g., `isToolExpanded={!!expandedTools[m.id]}`), and wrap prop handlers in `useCallback`.
