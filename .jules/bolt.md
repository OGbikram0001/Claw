## 2026-05-30 - Prevent React re-render cascades in chat view
**Learning:** Passing a large mapping object (like `expandedTools`) and inline functions directly to list item components causes every item in the list to re-render unnecessarily when any state changes.
**Action:** Use `React.memo` for list items, pass specific boolean primitives instead of mappings, and heavily utilize `useCallback` for prop handlers to preserve reference stability and prevent re-render cascades in complex list views.
