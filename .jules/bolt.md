## 2026-05-13 - React Native Chat Component Re-renders
**Learning:** In complex chat components, passing changing primitive props derived from an object state (like `!!expandedTools[m.id]`) and wrapping handlers with `useCallback` along with `React.memo` on list item components is critical to prevent entire lists from re-rendering on every keystroke when parent state changes.
**Action:** Always use `React.memo` with stable `useCallback` functions and primitive boolean props extracted from dictionaries when rendering items in highly interactive lists (e.g. chats).
