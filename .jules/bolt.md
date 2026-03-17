## 2025-05-14 - Optimizing Background Reactivity
**Learning:** Avoid using JS polling (`setInterval`) or `MutationObserver` to sync React state with CSS variables on the document root. This pattern causes unnecessary re-renders and potential layout thrashing via `getComputedStyle`.
**Action:** Use native CSS variables directly in component styles. This allows the browser's style engine to handle reactivity instantly without JS intervention. Ensure consistency in whether CSS variables include units (like `%`) or are unitless.

## 2025-05-15 - Event-Driven Theme Sync for Canvas
**Learning:** For components that cannot rely solely on CSS (like Canvas-based animations), using a custom `window` event to broadcast theme changes is significantly more efficient than using `MutationObserver` on the root element. `MutationObserver` triggers on every attribute change and requires `getComputedStyle`, which can cause layout thrashing.
**Action:** Centralize theme change broadcasting in the primary theme-switching component (e.g., `Header`) and subscribe via window events in performance-critical visual components.

## 2025-05-16 - SVG Reactivity via CSS Variables
**Learning:** Complexity in syncing SVG styles with app themes can be entirely avoided by using native CSS variables directly in SVG `fill` and `stroke` attributes. This eliminates the need for `MutationObserver` and `getComputedStyle` loops entirely for UI icons.
**Action:** Prefer `fill="hsl(var(--gold))"` or similar over JS-based prop drilling or polling for theme-reactive icons.

## 2025-05-17 - Environment-Induced Lockfile Pollution
**Learning:** Running `npm install` in this sandbox environment can cause massive, unintended changes to `package-lock.json`, such as removing `"dev": true` flags from development dependencies. This pollutes the pull request and risks treating dev dependencies as production ones.
**Action:** Always check `git status` after environment setup. If `package-lock.json` is modified without explicit intent, revert it using `git restore --staged package-lock.json && git checkout package-lock.json` before staging final changes.
