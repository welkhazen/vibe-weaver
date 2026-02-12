# Bolt's Journal

## 2024-05-15 - [Layout Thrashing in Theme Reactivity]
**Learning:** Polling for CSS variable changes using `setInterval` and `getComputedStyle` causes significant layout thrashing and main-thread blocking (10Hz tasks). Manual DOM manipulation (clearing/recreating elements) for animations further compounds this.
**Action:** Use native CSS variables and `calc()` for theme-aware colors. This offloads reactivity to the browser's style engine. Multiply unitless variables by `1%` or `1px` in `calc()` to ensure valid CSS types. Use React's reconciliation for animation elements instead of manual DOM churn.
