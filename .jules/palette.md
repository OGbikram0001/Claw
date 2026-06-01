## 2024-05-31 - Accessibility labels for icon-only components in React Native
**Learning:** In the React Native frontend, custom icon-only components (like `TouchableOpacity` or `Pressable` wrapping an icon) require explicit `accessibilityRole="button"` and `accessibilityLabel` attributes to be properly accessible to screen readers, unlike web `button` elements which often have semantic roles by default.
**Action:** When creating or modifying icon-only touchable elements in React Native, always ensure `accessibilityRole` and a descriptive `accessibilityLabel` are included.
