

## Smooth Crossfade Transitions for Orbital Category Selector

### Problem
When switching between expanded categories or closing the orbital panel, the transition is abrupt. The current approach directly swaps the selected category state without any fade-out/fade-in effect, causing a visual jump.

### Solution
Introduce a crossfade mechanism using a two-phase transition state:

1. **Category Switching**: When clicking a new category while one is already open, first fade out the current orbital content (subcategories, center icon, ring), then swap the data and fade back in -- all within the same expanded card so it never collapses.

2. **Click-Outside Close**: Use the existing close animation but ensure the non-selected category cards fade back in smoothly in sync.

### Technical Approach

**New state: `isSwitching`** -- tracks when we're crossfading between two categories (as opposed to opening/closing the panel).

**`handleCategoryClick` changes:**
- When a different category is clicked while one is open, set `isSwitching = true` to trigger a fade-out of the inner orbital content (not the outer card).
- After a short delay (~250ms), update `selectedCategory` to the new one and set `isSwitching = false`, which triggers the fade-in of new content.
- The outer card stays open and stable throughout -- no scale/blur animation on the container.

**`closeOrbital` stays mostly the same** but the close animation timing will be refined for smoothness.

**New CSS keyframes:**
- `orbital-content-fade-out`: fades opacity from 1 to 0 with a slight scale-down (1 to 0.95) over ~250ms.
- `orbital-content-fade-in`: fades opacity from 0 to 1 with a slight scale-up (0.95 to 1) over ~300ms.

**Applied to the orbital inner container** (the `relative w-full h-[280px]` div), keyed by `isSwitching` state:
- When `isSwitching` is true: apply `orbital-content-fade-out`
- When `isSwitching` is false and category is selected: apply `orbital-content-fade-in`

**Category cards fade transition:**
- The non-selected cards already have `opacity-40 scale-95` with a 400ms transition, which handles the fade-back-in when closing. No changes needed there.

### File Changes

**`src/components/OrbitalCategorySelector.tsx`:**
- Add `isSwitching` state and `pendingCategory` ref to hold the next category during crossfade.
- Update `handleCategoryClick`: when switching categories, set `isSwitching = true`, then after 250ms timeout, update `selectedCategory` to the pending category and set `isSwitching = false`.
- Add crossfade CSS classes to the inner orbital content container.
- Add two new keyframes (`orbital-content-fade-out`, `orbital-content-fade-in`) to the inline style block.
- Keep the outer card class as `animate-orbital-open` during switches (no re-trigger of the card animation).
- Use a `key` prop on the inner content based on `selectedCategory` to ensure React re-mounts subcategory items with their entrance animations when the category changes.

