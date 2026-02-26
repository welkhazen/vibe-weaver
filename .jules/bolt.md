## 2025-05-14 - Optimizing Background Reactivity
**Learning:** Avoid using JS polling (`setInterval`) or `MutationObserver` to sync React state with CSS variables on the document root. This pattern causes unnecessary re-renders and potential layout thrashing via `getComputedStyle`.
**Action:** Use native CSS variables directly in component styles. This allows the browser's style engine to handle reactivity instantly without JS intervention. Ensure consistency in whether CSS variables include units (like `%`) or are unitless.

## 2025-05-15 - Event-Driven Theme Sync for Canvas
**Learning:** For components that cannot rely solely on CSS (like Canvas-based animations), using a custom `window` event to broadcast theme changes is significantly more efficient than using `MutationObserver` on the root element. `MutationObserver` triggers on every attribute change and requires `getComputedStyle`, which can cause layout thrashing.
**Action:** Centralize theme change broadcasting in the primary theme-switching component (e.g., `Header`) and subscribe via window events in performance-critical visual components.

## 2025-05-16 - Optimizing Animation Loops and Layout Thrashing
**Learning:** Transitioning from `setTimeout` to `requestAnimationFrame` with precise timing using `performance.now()` ensures smoother animations and better resource management. Additionally, layout thrashing can be reduced by implementing a threshold check (e.g., 0.005) before writing to the DOM (like `canvas.style.opacity`). Hoisting context state (like `ctx.font`) and caching theme-derived colors out of inner drawing loops significantly reduces CPU overhead.
**Action:** Always prefer `requestAnimationFrame` for high-frequency animations. Implement thresholding for any style-driven updates that depend on state but don't require pixel-perfect precision every frame.
