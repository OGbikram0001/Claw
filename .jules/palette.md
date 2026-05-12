## 2025-02-18 - Missing ARIA/Accessibility attributes on icon-only custom components
**Learning:** In the React Native frontend, custom icon-only components (like `TouchableOpacity` wrapping an icon) often lack proper screen reader properties, preventing accurate accessibility navigation.
**Action:** Always ensure that custom icon-only components include both `accessibilityRole="button"` and `accessibilityLabel` attributes to provide necessary context to screen readers.
