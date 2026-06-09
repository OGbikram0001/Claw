## 2024-06-10 - React Performance
**Learning:** Passing mapping objects (like expandedTools) to list components causes massive re-render cascades during input typing.
**Action:** Heavily utilize React.memo for list items, use useCallback for prop handlers, and pass specific boolean primitives instead.
