## 2026-06-16 - Prevent React re-render cascades
**Learning:** In complex list/chat views, co-located state like inputText causes full re-renders. Passing large mapping objects (e.g. expandedTools) breaks React.memo.
**Action:** Use React.memo for list item components, pass specific boolean primitives instead of mappings, and wrap prop handlers in useCallback to preserve reference stability.
