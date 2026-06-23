## 2024-06-23 - Prevent CodeBlock Re-renders on Keystroke
**Learning:** In a chat interface where the root component manages the text input state, every keystroke triggers a re-render of all previously rendered message components. The `CodeBlock` component performs heavy synchronous syntax highlighting on every render.
**Action:** Always wrap heavy, pure leaf components (like `CodeBlock`) in `React.memo()` and wrap expensive synchronous calculations in `React.useMemo()` to isolate them from frequent parent re-renders.
