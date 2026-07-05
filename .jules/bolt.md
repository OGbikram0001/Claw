## 2024-07-05 - Fix O(N) Unnecessary Re-renders in Chat Bubbles
**Learning:** Passing large state objects (like `expandedTools`) or inline event handlers to message components causes O(N) re-renders across the entire list for every user keystroke.
**Action:** Always wrap list items in `React.memo`, pass derived primitive values (e.g., `isExpanded: boolean`), and memoize event handlers using `useCallback`.
