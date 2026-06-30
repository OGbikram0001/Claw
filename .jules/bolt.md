## 2024-07-01 - Avoid O(N) Re-Renders in Lists
**Learning:** Passing complex state objects and inline functions to child components in a React Native FlatList/ScrollView causes O(N) re-renders on state changes.
**Action:** Pass primitive derived values instead of complex objects, and use `React.memo` with `useCallback` for event handlers.
