# Bolt's Performance Journal

## 2025-05-15 - Native CSS Variable Reactivity vs JS Polling
**Learning:** Transitioning theme-based UI components from JS-driven reactivity (setInterval/MutationObserver) to native CSS variables (`var()`, `calc()`) significantly reduces main thread load and prevents layout thrashing. However, inconsistencies in whether CSS variables contain units (e.g., `90%` vs `90`) can lead to functional regressions if not verified across the whole codebase.

**Action:** Always verify the actual computed values of CSS variables in the target environment before assuming they are unitless or have units. Use `calc(var(--var) * 1%)` as a safer pattern if unitless values are expected but inconsistent.
