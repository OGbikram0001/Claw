## 2024-06-01 - React.memo for Chat Performance
**Learning:** To prevent React re-render cascades in complex list/chat views due to state co-location (e.g., highly frequent `inputText` updates in parent components), it's crucial to utilize `React.memo` for list item components.
**Action:** Use `React.memo` for list items like `AgentBubble` and `UserBubble`. Also, use `useCallback` for their prop handlers to preserve reference stability, and avoid passing large mapping objects directly as props; pass specific boolean primitives instead (e.g., `isToolExpanded={!!expandedTools[m.id]}`).
