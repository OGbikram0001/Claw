## 2024-07-06 - Preventing O(N) list re-renders in chat components
**Learning:** In chat interfaces, storing input state in the same component as the message list causes all messages to re-render on every keystroke. Passing large objects or inline functions to list items breaks React's shallow comparison.
**Action:** Always wrap list item components in React.memo(), pass primitive derived values, and wrap event handlers in useCallback() to ensure O(N) list renders become O(1) during user input.
