## 2025-06-05 - Required Accessibility Attributes for Custom Icon-Only Components
**Learning:** In React Native, custom icon-only components (like `TouchableOpacity` or `Pressable` wrapping an `<Ic />` component) are not automatically recognized as interactive buttons by screen readers and do not inherently communicate their purpose.
**Action:** Ensure all custom icon-only components include both `accessibilityRole="button"` and a descriptive `accessibilityLabel` attribute for full screen reader accessibility.
