## 2024-05-18 - Prevent React Re-render Cascades in List Views
**Learning:** In complex chat or list views where parent state changes frequently (e.g., typing in an input field), inline arrow functions passed to list items cause unnecessary re-renders of the entire list, severely impacting performance.
**Action:** Heavily utilize `React.memo` for list item components (like chat bubbles) and `useCallback` for their prop handlers to preserve reference stability. Avoid passing large mapping objects directly as props; pass specific boolean primitives instead.
