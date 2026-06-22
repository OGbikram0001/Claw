## 2024-06-22 - Memoizing Chat List Items
**Learning:** Chat bubbles (`UserBubble`, `AgentBubble`) re-render unnecessarily when parent chat state (like input text or new messages) changes. For `AgentBubble`, functions like `onApprove` and object props like `expandedTools` pass new references on each render.
**Action:** Use `React.memo` with a custom equality function to compare message properties and relevant tool state, rather than relying on shallow prop comparison.
