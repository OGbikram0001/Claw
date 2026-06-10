## 2024-06-10 - Screen Reader Support for Icon Buttons
**Learning:** In the React Native frontend, icon-only components using `TouchableOpacity` require both `accessibilityRole="button"` and `accessibilityLabel` attributes to be fully accessible for screen readers.
**Action:** Always include both `accessibilityRole="button"` and an accurate `accessibilityLabel` when implementing icon-only touchable buttons.
