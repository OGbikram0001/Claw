## 2023-10-24 - Prevent re-render cascades in Chat View
**Learning:** Passing complex mapping objects (like expandedTools) and inline arrow functions to list components causes full list re-renders on every keystroke when state is co-located.
**Action:** Pass boolean primitives (isExpanded) and use React.memo + useCallback for list items and their handlers.
