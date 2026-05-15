## 2024-05-15 - React Native Chat Re-render Cascades

**Learning:** In complex chat or list views in React Native, using inline functions or passing large mapping objects (like `expandedTools: Record<number, boolean>`) directly to list items causes severe re-render cascades because the prop references change on every parent render (e.g. from highly frequent `inputText` updates).

**Action:** Heavily utilize `React.memo` for list item components. Ensure their prop references remain stable by using `useCallback` for event handlers and by passing primitive values (e.g., `isToolExpanded={!!expandedTools[m.id]}`) instead of passing mapping objects directly.
