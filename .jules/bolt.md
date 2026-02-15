# Bolt's Journal

## 2024-05-15 - [Layout Thrashing in Theme Reactivity]
**Learning:** Polling for CSS variable changes using `setInterval` and `getComputedStyle` causes significant layout thrashing and main-thread blocking (10Hz tasks). Manual DOM manipulation (clearing/recreating elements) for animations further compounds this.
**Action:** Use native CSS variables and `calc()` for theme-aware colors. This offloads reactivity to the browser's style engine. Multiply unitless variables by `1%` or `1px` in `calc()` to ensure valid CSS types. Use React's reconciliation for animation elements instead of manual DOM churn.
## 2025-05-14 - Optimizing Background Reactivity
**Learning:** Avoid using JS polling (`setInterval`) or `MutationObserver` to sync React state with CSS variables on the document root. This pattern causes unnecessary re-renders and potential layout thrashing via `getComputedStyle`.
**Action:** Use native CSS variables directly in component styles. This allows the browser's style engine to handle reactivity instantly without JS intervention. Ensure consistency in whether CSS variables include units (like `%`) or are unitless.

## 2025-05-15 - Event-Driven Theme Sync for Canvas
**Learning:** For components that cannot rely solely on CSS (like Canvas-based animations), using a custom `window` event to broadcast theme changes is significantly more efficient than using `MutationObserver` on the root element. `MutationObserver` triggers on every attribute change and requires `getComputedStyle`, which can cause layout thrashing.
**Action:** Centralize theme change broadcasting in the primary theme-switching component (e.g., `Header`) and subscribe via window events in performance-critical visual components.
