## 2024-06-07 - Accessibility for Icon-Only Buttons
**Learning:** In React Native, icon-only components (like TouchableOpacity wrapping an icon) require both accessibilityRole="button" and accessibilityLabel attributes for full screen reader accessibility.
**Action:** Always add these props when implementing icon-only touchable elements to ensure screen reader users can identify their function.
