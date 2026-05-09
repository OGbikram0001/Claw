## 2026-05-09 - Missing Accessibility Props on Interactive UI Elements
**Learning:** React Native applications often use `TouchableOpacity` or `Pressable` wrapping an icon (like `<Ic>`) to create icon-only buttons. This creates a pattern of silent interactive elements for screen readers.
**Action:** Always add `accessibilityRole="button"` and meaningful `accessibilityLabel` attributes to these custom icon-only components to ensure full screen reader accessibility.
