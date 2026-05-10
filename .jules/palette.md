## $(date +%Y-%m-%d) - Adding accessibility to icon-only buttons in React Native
**Learning:** React Native requires `accessibilityRole="button"` and `accessibilityLabel` instead of standard web `aria-label` attributes for accessibility on custom button components (like `TouchableOpacity`).
**Action:** Always verify if a UI codebase is React/HTML or React Native before applying standard accessibility attributes, and map HTML standard ARIA properties to their equivalent React Native accessibility props.
