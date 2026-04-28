## 2026-04-28 - [React Re-rendering Optimization]
**Learning:** In a React Native/Expo app, passing a large state object (like `expandedTools`) down to list items (`AgentBubble`) causes all items to re-render when the object changes.
**Action:** Instead, pass specific primitive values (e.g., `isToolExpanded={!!expandedTools[m.id]}`) and use `React.memo()` alongside `useCallback()` to prevent these massive re-renders when a single list item is updated.
