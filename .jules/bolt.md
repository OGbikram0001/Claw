## 2024-07-02 - React List Rendering Optimization
**Learning:** In React Native/React lists (e.g., chat bubbles), passing large state objects (like an `expandedTools` dictionary) or inline functions to list item components causes O(N) unnecessary re-renders whenever any single item's state changes.
**Action:** Always derive primitive values (like `isExpanded: boolean`) from the state object and pass them alongside stable event handlers wrapped in `useCallback` when using `React.memo` to ensure only the actually changed items re-render.
