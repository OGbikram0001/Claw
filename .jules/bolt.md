## 2024-03-24 - Prevent Re-render Cascades in Complex React Native Lists
**Learning:** State co-location in complex React Native / Expo lists without primitive props and `React.memo()` can cause severe re-render cascades. Passing mapping objects as props leads to identity changes on every state update, degrading list performance.
**Action:** Use `React.memo` for list item components, pass specific primitive values (e.g. `isToolExpanded={!!expandedTools[m.id]}` instead of the full object) and use `useCallback` for prop handlers to preserve reference stability and optimize performance.
