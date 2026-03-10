## 2025-05-14 - Optimizing Background Reactivity
**Learning:** Avoid using JS polling (`setInterval`) or `MutationObserver` to sync React state with CSS variables on the document root. This pattern causes unnecessary re-renders and potential layout thrashing via `getComputedStyle`.
**Action:** Use native CSS variables directly in component styles. This allows the browser's style engine to handle reactivity instantly without JS intervention. Ensure consistency in whether CSS variables include units (like `%`) or are unitless.

## 2025-05-15 - Event-Driven Theme Sync for Canvas
**Learning:** For components that cannot rely solely on CSS (like Canvas-based animations), using a custom `window` event to broadcast theme changes is significantly more efficient than using `MutationObserver` on the root element. `MutationObserver` triggers on every attribute change and requires `getComputedStyle`, which can cause layout thrashing.
**Action:** Centralize theme change broadcasting in the primary theme-switching component (e.g., `Header`) and subscribe via window events in performance-critical visual components.

## 2025-05-16 - SVG Theme Refactoring
**Learning:** When refactoring SVG components for theme reactivity, ensure paths designed as outlines retain `fill="none"` even when applying `stroke="currentColor"`. Changing outline paths to `fill="currentColor"` can result in solid shapes (blobs) that break icon aesthetics.
**Action:** Always verify the visual integrity of SVG icons after refactoring them to use CSS-based coloring. Use `currentColor` only on paths intended to be filled.
