## 2024-06-12 - React Native Icon Accessibility
**Learning:** In React Native, icon-only components using `TouchableOpacity` require both `accessibilityRole="button"` and `accessibilityLabel` attributes to be fully accessible for screen readers, as the framework cannot infer their purpose automatically.
**Action:** Always add these attributes to icon-only interactive elements during implementation.
