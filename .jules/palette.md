## 2025-03-01 - Add accessibility labels to BottomBar
**Learning:** Icon-only buttons and tab elements often lack descriptive labels, making them inaccessible to screen readers. In `BottomBar.tsx`, the floating action button (FAB) and navigation tabs (`NavTab`) rely solely on visual icons.
**Action:** Added `accessibilityRole`, `accessibilityLabel`, and `accessibilityState` attributes to these components to provide semantic meaning and state information to assistive technologies.
