## 2024-05-02 - Custom Icon Button Accessibility
**Learning:** In React Native, custom icon-only components (like `TouchableOpacity` wrapping an icon) are completely invisible to screen readers unless specifically annotated. Users rely on `accessibilityRole="button"` and `accessibilityLabel` to understand the component's interactive nature and purpose.
**Action:** Always include both `accessibilityRole="button"` and a context-appropriate `accessibilityLabel` on any custom interactive element that does not contain visible text.
