## 2026-05-22 - Optimize Chat Message Re-renders
**Learning:** Prevent React re-render cascades in complex list views by passing stable primitives and using React.memo + useCallback.
**Action:** Use React.memo for list items, pass boolean primitives instead of large map objects as props, and use useCallback for handlers.
