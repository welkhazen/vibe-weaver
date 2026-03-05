## 2025-05-14 - Optimizing Background Reactivity
**Learning:** Avoid using JS polling (`setInterval`) or `MutationObserver` to sync React state with CSS variables on the document root. This pattern causes unnecessary re-renders and potential layout thrashing via `getComputedStyle`.
**Action:** Use native CSS variables directly in component styles. This allows the browser's style engine to handle reactivity instantly without JS intervention. Ensure consistency in whether CSS variables include units (like `%`) or are unitless.

## 2025-05-15 - Event-Driven Theme Sync for Canvas
**Learning:** For components that cannot rely solely on CSS (like Canvas-based animations), using a custom `window` event to broadcast theme changes is significantly more efficient than using `MutationObserver` on the root element. `MutationObserver` triggers on every attribute change and requires `getComputedStyle`, which can cause layout thrashing.
**Action:** Centralize theme change broadcasting in the primary theme-switching component (e.g., `Header`) and subscribe via window events in performance-critical visual components.

## 2025-05-16 - Canvas Loop String Optimization
**Learning:** In high-frequency Canvas animation loops, pre-calculating HSL/RGB strings and caching array lengths can measurably reduce CPU overhead. String concatenation and object creation (like `new Date()`) inside the loop are primary sources of GC pressure and frame-time jitter.
**Action:** Always hoist color calculations and static property lookups out of `requestAnimationFrame` callbacks. Use `performance.now()` for high-precision timing if needed, rather than `Date.now()`.
