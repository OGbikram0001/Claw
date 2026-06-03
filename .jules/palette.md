## 2024-06-02 - Ensure React Native custom icon-only components have proper accessibility labels
**Learning:** In React Native, custom icon-only buttons (like `TouchableOpacity` or `Pressable` wrapping an icon) do not automatically inherit meaning. They require explicit `accessibilityRole="button"` and `accessibilityLabel` attributes to be properly announced and understood by screen readers.
**Action:** When creating or modifying icon-only clickable elements in React Native, always include `accessibilityRole="button"` and a descriptive `accessibilityLabel`.
