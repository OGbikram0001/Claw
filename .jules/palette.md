## 2025-01-20 - Accessibility for Icon-only Buttons
**Learning:** Icon-only components using `TouchableOpacity` require both `accessibilityRole="button"` and `accessibilityLabel` attributes to be fully accessible for screen readers, which is a widespread missing pattern in this app.
**Action:** Always add `accessibilityRole` and `accessibilityLabel` to `TouchableOpacity` when no visible text is present.
