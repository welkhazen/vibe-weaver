

## Spring Animation for Category Cards Returning to Normal

### What Changes
When the orbital panel closes, the non-selected category cards currently transition from `opacity-40 scale-95` back to their normal state using a simple CSS `transition-all duration-400 ease-out`. This produces a linear, mechanical feel. We'll replace this with a spring-like overshoot effect so the cards "bounce" slightly past their resting scale before settling.

### Technical Approach

**`src/components/OrbitalCategorySelector.tsx`:**

1. Add a new `isReturning` state that becomes `true` when the orbital closes and the cards start returning to normal.

2. In `closeOrbital`, set `isReturning = true` at Phase 2 (when `isClosing` starts). After the close animation finishes and state resets, keep `isReturning = true` briefly (~500ms) so the spring plays out, then set it to `false`.

3. On non-selected category buttons, when `isReturning` is true and `hasSelection` is false, apply a CSS animation class `animate-spring-return` instead of relying on the plain CSS transition.

4. Add a new `@keyframes spring-return` in the inline style block:
   - 0%: `opacity: 0.4; transform: scale(0.95)`
   - 50%: `opacity: 1; transform: scale(1.04)`
   - 75%: `opacity: 1; transform: scale(0.99)`
   - 100%: `opacity: 1; transform: scale(1)`
   - Duration: ~450ms with ease-out timing

5. The `.animate-spring-return` class applies this keyframe with `forwards` fill mode.

This gives the cards a subtle overshoot when they pop back into place, making the return feel organic and polished.

