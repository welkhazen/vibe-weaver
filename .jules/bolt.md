## 2025-05-14 - Optimizing Background Reactivity
**Learning:** Avoid using JS polling (`setInterval`) or `MutationObserver` to sync React state with CSS variables on the document root. This pattern causes unnecessary re-renders and potential layout thrashing via `getComputedStyle`.
**Action:** Use native CSS variables directly in component styles. This allows the browser's style engine to handle reactivity instantly without JS intervention. Ensure consistency in whether CSS variables include units (like `%`) or are unitless.

## 2025-05-15 - Event-Driven Theme Sync for Canvas
**Learning:** For components that cannot rely solely on CSS (like Canvas-based animations), using a custom `window` event to broadcast theme changes is significantly more efficient than using `MutationObserver` on the root element. `MutationObserver` triggers on every attribute change and requires `getComputedStyle`, which can cause layout thrashing.
**Action:** Centralize theme change broadcasting in the primary theme-switching component (e.g., `Header`) and subscribe via window events in performance-critical visual components.

## 2025-05-16 - Threshold-based DOM updates and HSL Caching in Canvas Loops
**Learning:** In high-frequency Canvas animation loops, repeatedly updating `canvas.style` properties (like `opacity`) can cause layout thrashing even if the value hasn't changed significantly. Additionally, regenerating HSL/RGB strings on every frame is a common source of GC pressure.
**Action:** Implement threshold-based updates for DOM/style properties inside animation loops (e.g., only update `opacity` if it changes by >0.005). Cache calculated color strings in `useRef` and only update them when external state (like theme) changes, rather than every frame.
