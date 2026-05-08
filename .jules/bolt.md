## 2026-05-08 - React Native Chat Re-renders
**Learning:** Chat interfaces with co-located state (like frequent `inputText` updates driving the typing indicator or send button) cause O(N) re-renders of the entire message history on every keystroke unless properly memoized.
**Action:** Always wrap list item components in `React.memo` and strictly stabilize prop functions passed to them using `useCallback` when optimizing highly dynamic lists or chat views.
