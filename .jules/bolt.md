## 2025-05-14 - Optimizing Background Reactivity
**Learning:** Avoid using JS polling (`setInterval`) or `MutationObserver` to sync React state with CSS variables on the document root. This pattern causes unnecessary re-renders and potential layout thrashing via `getComputedStyle`.
**Action:** Use native CSS variables directly in component styles. This allows the browser's style engine to handle reactivity instantly without JS intervention. Ensure consistency in whether CSS variables include units (like `%`) or are unitless.

## 2025-05-15 - Event-Driven Theme Sync for Canvas
**Learning:** For components that cannot rely solely on CSS (like Canvas-based animations), using a custom `window` event to broadcast theme changes is significantly more efficient than using `MutationObserver` on the root element. `MutationObserver` triggers on every attribute change and requires `getComputedStyle`, which can cause layout thrashing.
**Action:** Centralize theme change broadcasting in the primary theme-switching component (e.g., `Header`) and subscribe via window events in performance-critical visual components.

## 2026-02-22 - Matrix Animation Loop Early Termination
**Learning:** High-frequency animation loops that only serve a transition (e.g., a fade-out on mount) should be explicitly terminated using `cancelAnimationFrame` once they reach their target state. Continuous execution of invisible loops wastes CPU and blocks the main thread unnecessarily. Additionally, threshold-based DOM updates (e.g., only updating `opacity` if the delta > 0.005) effectively reduce layout thrashing.
**Action:** Always implement a termination condition in `requestAnimationFrame` loops and use thresholds for continuous style updates to avoid redundant browser work.
