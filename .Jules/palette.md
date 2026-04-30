## 2026-04-30 - Accessible Icon Buttons in React Native
**Learning:** In React Native, custom icon-only components (like `TouchableOpacity` wrapping an icon without text) are opaque to screen readers, meaning users navigating via assistive technologies lack context about the button's purpose.
**Action:** Always add `accessibilityRole="button"` and a descriptive `accessibilityLabel` to any `TouchableOpacity` or `Pressable` that functions as an icon-only button to ensure full accessibility.
