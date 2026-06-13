## 2024-05-20 - Prevent re-render cascades in chat views
**Learning:** In complex chat views with frequent input state updates, passing large mapping objects (like `expandedTools`) to child components causes unnecessary re-renders of all chat bubbles.
**Action:** Heavily utilize `React.memo` for list item components, pass specific boolean primitives instead of large mapping objects (e.g., `isToolExpanded={!!expandedTools[m.id]}`), and use `useCallback` for their prop handlers to preserve reference stability.
