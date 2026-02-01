
# Plan: Matrix Background - Stop After 3 Seconds

## Current Behavior
The matrix rain animation currently slows down from fast (15ms) to slower (50ms) over 8 seconds, but continues running forever.

## Desired Behavior
The animation should gradually slow down and **completely stop** after 3 seconds.

---

## Implementation

### Changes to `src/components/MatrixBackground.tsx`

1. **Update timing constants**
   - Change `slowdownDuration` from 8000ms to 3000ms (3 seconds)
   - Add a `stoppedRef` to track when animation has fully stopped

2. **Modify the speed calculation**
   - Instead of interpolating between 15ms and 50ms, interpolate to a very high interval (effectively stopping)
   - Once 3 seconds elapsed, stop calling the animation loop entirely

3. **Update the animation loop**
   - Check if the animation should stop
   - When stopped, do one final draw to keep the static characters visible on screen
   - Clear the timeout and don't schedule another frame

---

## Technical Details

```text
Timeline:
0s ──────────────────────── 3s
│                           │
Fast (15ms)  ───────>  Stop completely
             (gradual slowdown)
```

The animation will:
- Start at full speed
- Gradually decelerate using an ease-out curve
- Come to a complete stop at 3 seconds
- Characters remain frozen in place as a static background
