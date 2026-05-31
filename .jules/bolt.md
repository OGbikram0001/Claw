## 2026-05-31 - Prevent React re-render cascades in chat views
**Learning:** Passing large map objects (like `expandedTools`) and inline functions to child components in a frequently updating parent component (like a chat view updating on input typing) causes unnecessary re-renders of the entire list.
**Action:** Heavily utilize `React.memo` for list item components. Pass stable primitive booleans (e.g., `isToolExpanded={!!expandedTools[m.id]}`) and `useCallback` functions instead of large state objects and inline functions to preserve reference stability.
