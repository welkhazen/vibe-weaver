## 2025-05-14 - Optimizing Background Reactivity
**Learning:** Avoid using JS polling (`setInterval`) or `MutationObserver` to sync React state with CSS variables on the document root. This pattern causes unnecessary re-renders and potential layout thrashing via `getComputedStyle`.
**Action:** Use native CSS variables directly in component styles. This allows the browser's style engine to handle reactivity instantly without JS intervention. Ensure consistency in whether CSS variables include units (like `%`) or are unitless.

## 2025-05-15 - Event-Driven Theme Sync for Canvas
**Learning:** For components that cannot rely solely on CSS (like Canvas-based animations), using a custom `window` event to broadcast theme changes is significantly more efficient than using `MutationObserver` on the root element. `MutationObserver` triggers on every attribute change and requires `getComputedStyle`, which can cause layout thrashing.
**Action:** Centralize theme change broadcasting in the primary theme-switching component (e.g., `Header`) and subscribe via window events in performance-critical visual components.

## 2025-05-16 - Optimizing SVG Theme Reactivity
**Learning:** Using a `MutationObserver` and React state to manually synchronize CSS variables into SVGs is a performance anti-pattern. This causes redundant layout recalculations (via `getComputedStyle`) and React re-renders.
**Action:** Use native CSS variable references directly in SVG `fill` and `stroke` attributes (e.g., `hsl(var(--gold))`). This offloads reactivity to the browser's CSS engine, making theme updates nearly instantaneous and JS-free.
