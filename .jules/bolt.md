## 2024-07-04 - Prevent O(N) Unnecessary Re-renders in React List Items
**Learning:** In chat interfaces, passing large state objects (like `expandedTools`) or inline arrow functions as props to message components inside a `.map` loop causes all items to re-render whenever the parent state changes, leading to O(N) re-renders which scales poorly.
**Action:** Pass derived primitive values (e.g., `isExpanded: boolean`) instead of full objects, and use `useCallback` for event handlers passed to child components alongside `React.memo` to ensure stable references and prevent unnecessary re-renders.
