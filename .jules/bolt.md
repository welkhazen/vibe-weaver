## 2025-05-14 - Optimizing Background Reactivity
**Learning:** Avoid using JS polling (`setInterval`) or `MutationObserver` to sync React state with CSS variables on the document root. This pattern causes unnecessary re-renders and potential layout thrashing via `getComputedStyle`.
**Action:** Use native CSS variables directly in component styles. This allows the browser's style engine to handle reactivity instantly without JS intervention. Ensure consistency in whether CSS variables include units (like `%`) or are unitless.

## 2025-05-15 - Event-Driven Theme Sync for Canvas
**Learning:** For components that cannot rely solely on CSS (like Canvas-based animations), using a custom `window` event to broadcast theme changes is significantly more efficient than using `MutationObserver` on the root element. `MutationObserver` triggers on every attribute change and requires `getComputedStyle`, which can cause layout thrashing.
**Action:** Centralize theme change broadcasting in the primary theme-switching component (e.g., `Header`) and subscribe via window events in performance-critical visual components.

## 2026-03-11 - [Optimizing Theme Reactivity with CSS Variables]
**Learning:** Using `MutationObserver` and `getComputedStyle` to synchronize React state with CSS variables for theme changes causes layout thrashing and unnecessary re-renders. Offloading this to native CSS variables (`var()` and `currentColor`) allows the browser to handle the updates more efficiently without main-thread JS overhead.
**Action:** Prefer native CSS variables and `currentColor` for theme-reactive components and SVGs over JS-based synchronization loops.
