## 2024-06-20 - Prevent re-render cascades in chat view
**Learning:** React re-render cascades occur in complex list/chat views when passing large mapping objects directly as props to child components, combined with inline functions that recreate on every parent render.
**Action:** Heavily utilize `React.memo` for list item components, `useCallback` for their prop handlers, and pass specific boolean primitives instead of full objects.
