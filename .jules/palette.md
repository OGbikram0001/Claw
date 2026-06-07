## 2024-06-06 - Screen Reader Accessibility for Icon-only Buttons
**Learning:** In React Native, custom icon-only components like `TouchableOpacity` or `Pressable` that wrap icons are completely opaque to screen readers by default. This makes critical navigation and action buttons (like back, menu, send) invisible to visually impaired users.
**Action:** Always ensure that any interactive element without visible text includes both `accessibilityRole="button"` and a descriptive `accessibilityLabel` to clearly communicate its purpose and interaction state to assistive technologies.
