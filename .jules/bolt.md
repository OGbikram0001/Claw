## 2024-05-18 - Prevent React re-render cascades in chat views
**Learning:** In complex chat views with co-located state (like frequent `inputText` updates in the parent `App` component), child components re-render unnecessarily on every keystroke.
**Action:** Heavily utilize `React.memo` for list item components (like `UserBubble`, `AgentBubble`, `TypingMessage`, and `ApprovalCard`) and `useCallback` for their prop handlers (`toggleTool`, `handleApprove`, `handleReject`) to preserve reference stability and avoid re-render cascades.
