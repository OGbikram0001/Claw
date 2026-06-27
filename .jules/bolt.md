## 2024-06-27 - Initial Setup
**Learning:** Initializing Bolt journal.
**Action:** Ready to track performance learnings.

## 2024-06-27 - O(N) Re-render Bottleneck in React Lists
**Learning:** Found a major performance anti-pattern where an input's `onChangeText` caused the entire list of chat bubbles (O(N)) to re-render on every keystroke because the components were unmemoized and passed entire state objects/inline handlers instead of primitive values and memoized callbacks. This results in heavy UI thread blocking.
**Action:** When rendering lists of components in React, wrap list items in `React.memo`, pass primitive derived values (e.g., `isExpanded: boolean` instead of `expandedTools: object`), and use `useCallback` for event handlers to maintain fast user interaction responsiveness.
