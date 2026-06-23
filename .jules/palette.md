## 2024-06-23 - Accessibility for Icon-only buttons
**Learning:** Icon-only buttons using `TouchableOpacity` require both `accessibilityRole="button"` and `accessibilityLabel` attributes to be fully accessible for screen readers in React Native.
**Action:** Always verify `TouchableOpacity` usages containing only icons have appropriate accessibility attributes attached to them.
