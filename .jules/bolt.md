## 2024-07-01 - Prevent O(N) re-renders in chat bubbles
**Learning:** Passing state objects and inline functions as props to items in a mapped array causes O(N) unnecessary re-renders in React Native.
**Action:** Memoize item components using `React.memo`, pass derived primitive values (e.g. `isExpanded`), and use `React.useCallback` for event handlers.
