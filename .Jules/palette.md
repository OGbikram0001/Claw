## 2024-05-18 - First run
**Learning:** Found some linting issues in `blocks.tsx` due to unescaped entities that we should probably fix. But UX-wise, let's explore missing ARIA labels on icon-only buttons as per instructions.
**Action:** Always check `TouchableOpacity` and `Pressable` for `accessibilityLabel` or `aria-label`.
