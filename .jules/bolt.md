## 2025-05-14 - Optimizing Background Reactivity
**Learning:** Avoid using JS polling (`setInterval`) or `MutationObserver` to sync React state with CSS variables on the document root. This pattern causes unnecessary re-renders and potential layout thrashing via `getComputedStyle`.
**Action:** Use native CSS variables directly in component styles. This allows the browser's style engine to handle reactivity instantly without JS intervention. Ensure consistency in whether CSS variables include units (like `%`) or are unitless.

## 2025-05-15 - Event-Driven Theme Sync for Canvas
**Learning:** For components that cannot rely solely on CSS (like Canvas-based animations), using a custom `window` event to broadcast theme changes is significantly more efficient than using `MutationObserver` on the root element. `MutationObserver` triggers on every attribute change and requires `getComputedStyle`, which can cause layout thrashing.
**Action:** Centralize theme change broadcasting in the primary theme-switching component (e.g., `Header`) and subscribe via window events in performance-critical visual components.

## 2025-05-16 - SVG Reactivity via CSS Variables
**Learning:** Complexity in syncing SVG styles with app themes can be entirely avoided by using native CSS variables directly in SVG `fill` and `stroke` attributes. This eliminates the need for `MutationObserver` and `getComputedStyle` loops entirely for UI icons.
**Action:** Prefer `fill="hsl(var(--gold))"` or similar over JS-based prop drilling or polling for theme-reactive icons.

## 2025-05-17 - Memoization for Shared Layout Decorators
**Learning:** Background visual components used across multiple routes or tabs often re-render or reset state on every navigation if they are not memoized. This causes expensive canvas re-initialization and "flicker" during tab transitions.
**Action:** Use `React.memo()` for background visual components and refactor high-frequency animation loops from `setTimeout` to `requestAnimationFrame` to ensure frame synchronization and reduce CPU overhead.
## 2025-05-17 - Redundant DOM Writes in Animation Loops
**Learning:** Updating DOM properties (like `canvas.style.opacity`) or context properties (like `ctx.font`) inside a 60FPS animation loop is expensive and can cause layout thrashing. Even if the value hasn't changed, the browser may still perform unnecessary work.
**Action:** Implement threshold-based checks (e.g., `delta > 0.001`) before updating non-critical style properties and move context setup (like `ctx.font`) out of the draw loop into initialization or resize handlers. Cache theme-derived color strings to avoid per-frame string concatenation.

## 2026-04-10 - [State Update Anti-pattern in SwipeablePollCard]
**Learning:** Calling a state setter (e.g., `setComments`) inside the functional updater of another state (`setUpvotedIds`) can lead to race conditions and makes state transitions harder to trace, as it bypasses standard React batching expectations and can cause inconsistent UI states.
**Action:** Decouple state updates into sequential calls within the event handler, using local variables to capture necessary state-dependent logic (like calculating the delta for an upvote) before triggering independent updates.
