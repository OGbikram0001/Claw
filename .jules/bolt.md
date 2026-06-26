## 2024-05-18 - Memoizing Chat Bubbles
**Learning:** When building a chat UI with frequent updates (like typing indicators or input changes), unmemoized list items (like chat bubbles) will re-render on every state change in the parent. Passing large state objects (like expandedTools) or inline functions to list items breaks memoization.
**Action:** Always wrap chat bubbles in React.memo, pass primitive values (e.g., isExpanded: boolean instead of the whole object) for list item state, and use useCallback for event handlers passed into list items to prevent O(N) unnecessary re-renders.
