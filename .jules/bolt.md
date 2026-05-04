## 2026-05-04 - [Preventing List Cascade Renders]
**Learning:** In complex chat or list views, state co-location (like `inputText` state updating on every keystroke) can cause massive re-render cascades in unoptimized child items.
**Action:** Always heavily utilize `React.memo` for list item components (like Chat Bubbles) and `useCallback` for their handlers to preserve reference stability and isolate the re-renders.
