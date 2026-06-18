## 2024-06-18 - Prevent React re-render cascades in chat views
**Learning:** Passing complex map objects (like expanded tools state) to list item components triggers expensive re-renders across all items when a single item updates.
**Action:** Use React.memo for list components, pass primitive boolean props (e.g., isToolExpanded) instead of full mapping objects, and wrap handler functions in useCallback to maintain reference stability.
