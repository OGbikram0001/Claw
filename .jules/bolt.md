## 2024-06-28 - Preventing O(N) list re-renders in chat
**Learning:** Passing complex state objects (like `expandedTools`) or inline functions to list items causes all items to re-render on every state change (e.g., when the user types).
**Action:** Use `React.memo` for list components, pass derived primitive values (`isExpanded: boolean`), and stabilize event handlers with `useCallback`.
