## 2024-05-28 - Add Accessibility Labels to Icon-Only Buttons
**Learning:** React Native's `TouchableOpacity` wrapping icons (like `<Ic>`) require both `accessibilityRole="button"` and `accessibilityLabel` attributes to be fully accessible to screen readers, especially when they don't contain any explicit `<Text>` elements.
**Action:** Always verify that interactive elements relying solely on visual icons have appropriate screen reader labels provided to maintain accessibility across all components.
