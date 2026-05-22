## 2024-05-31 - Add accessible roles and labels to icon-only React Native buttons
**Learning:** Custom icon-only components using `TouchableOpacity` or `Pressable` in React Native are completely opaque to screen readers without explicit accessibility attributes.
**Action:** Always ensure all custom icon-only components include both `accessibilityRole="button"` and `accessibilityLabel` attributes for full screen reader accessibility.
