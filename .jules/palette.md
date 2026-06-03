## 2024-06-03 - Missing Accessibility Labels on Custom Buttons
**Learning:** Found that custom icon-only components using `TouchableOpacity` in `Header.tsx` lack `accessibilityRole` and `accessibilityLabel` attributes, which makes them inaccessible to screen readers. React Native doesn't infer button semantics from icon components alone.
**Action:** Always ensure that custom icon-only touchable components are decorated with `accessibilityRole="button"` and meaningful `accessibilityLabel` props to make the UI screen reader friendly.
