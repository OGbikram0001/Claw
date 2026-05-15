
## 2024-04-12 - Added Accessibility Props to Icon-Only Buttons in React Native BottomBar
**Learning:** React Native custom icon-only components (like `TouchableOpacity` wrapping an `<Ic />` element) are often completely opaque to screen readers because they lack inherent semantic roles or textual labels.
**Action:** Always add `accessibilityRole="button"` (or `"tab"`, etc. as appropriate) and an explicit `accessibilityLabel` to all custom touchable elements that do not contain visible text nodes, to ensure full screen reader accessibility. Also use `accessibilityState` to convey dynamic states (like `selected` for tabs).
