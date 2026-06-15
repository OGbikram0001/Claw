## 2024-06-15 - Prevent re-render cascade in ChatScreen
**Learning:** In complex chat views, passing large mapping objects directly as props to list item components causes unnecessary re-renders of the entire list on every state update.
**Action:** Use React.memo for list item components and pass specific boolean primitives instead of large mapping objects to preserve reference stability.
