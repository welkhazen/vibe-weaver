## 2025-05-14 - Optimizing Background Reactivity
**Learning:** Avoid using JS polling (`setInterval`) or `MutationObserver` to sync React state with CSS variables on the document root. This pattern causes unnecessary re-renders and potential layout thrashing via `getComputedStyle`.
**Action:** Use native CSS variables directly in component styles. This allows the browser's style engine to handle reactivity instantly without JS intervention. Ensure consistency in whether CSS variables include units (like `%`) or are unitless.

## 2025-05-15 - Event-Driven Theme Sync for Canvas
**Learning:** For components that cannot rely solely on CSS (like Canvas-based animations), using a custom `window` event to broadcast theme changes is significantly more efficient than using `MutationObserver` on the root element. `MutationObserver` triggers on every attribute change and requires `getComputedStyle`, which can cause layout thrashing.
**Action:** Centralize theme change broadcasting in the primary theme-switching component (e.g., `Header`) and subscribe via window events in performance-critical visual components.

## 2025-05-16 - Throttling DOM Updates in Animation Loops
**Learning:** Frequent updates to DOM properties like `element.style.opacity` inside a `requestAnimationFrame` loop can cause significant layout thrashing and main-thread congestion even if the value hasn't changed much. Additionally, repeated string allocations for colors (e.g., `hsl(...)`) in every frame create unnecessary GC pressure.
**Action:** Implement threshold-based checks before updating DOM styles (e.g., only update if delta > 0.005) and cache theme-derived color strings in `useRef` to minimize per-frame allocations.
