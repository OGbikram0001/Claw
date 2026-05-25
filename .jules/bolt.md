## 2026-05-25 - Prevent re-render cascades in chat lists
**Learning:** Passing complex objects (like a full mapping dictionary) or inline functions as props to list item components causes unnecessary re-renders on every parent state update.
**Action:** Use React.memo for list item components, pass primitive values instead of complex objects, and use useCallback for prop handlers.
