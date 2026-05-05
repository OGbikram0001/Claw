## 2026-05-05 - React Native Icon Button Accessibility
**Learning:** Icon-only buttons using TouchableOpacity in React Native completely fail for screen readers without explicit attributes, unlike web where aria-labels are common knowledge.
**Action:** Always add accessibilityRole="button" and accessibilityLabel to any touchable wrapping just an icon in React Native.
