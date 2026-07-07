## 2024-05-24 - React rendering performance
**Learning:** React components defined inside the render body of a parent component (e.g. `SpaceCard` inside `SpacesView`) cause complete unmount and remount on every parent render. This anti-pattern is highly detrimental to performance.
**Action:** Always extract child components to the file level scope and optionally wrap them in `React.memo` to avoid unnecessary work during the React lifecycle.
