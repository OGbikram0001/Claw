## 2026-06-07 - Memoize chat list items
**Learning:** Passing large mapping objects or unstabilized callbacks as props to list items causes severe re-render cascades.
**Action:** Use React.memo for list item components, useCallback for their handlers, and pass boolean primitives instead of mappings.
