## 2024-06-13 - Icon-only Accessibility Pattern
**Learning:** Icon-only `TouchableOpacity` components across the app's navigation and action bars lack screen reader context. In React Native, these require both `accessibilityRole="button"` and `accessibilityLabel` to be fully accessible.
**Action:** Always ensure `accessibilityRole="button"` and descriptive `accessibilityLabel` props are included when creating or modifying icon-only touch targets.
