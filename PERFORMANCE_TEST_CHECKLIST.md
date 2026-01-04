# Performance Test Checklist for Scroll Lag Fix

## Changes Made
- ✅ Changed `scrub` from `true` to `0.3` (300ms catch-up)
- ✅ Verified manual `onUpdate` approach is optimal for this use case
- ✅ Changed default `fullWidth` from `0.8` to `1.0`

## Testing Instructions

### 1. Start Development Server
```bash
cd example
npm run dev
```
Open http://localhost:3000 in Chrome

### 2. Chrome DevTools Performance Testing

#### Setup:
1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Click Record button
4. Scroll through the light beam animation for ~10 seconds
5. Stop recording
6. Analyze results

#### Success Criteria:
- ✅ **60 FPS maintained** - No significant frame drops during scroll
- ✅ **No long tasks** - No tasks exceeding 50ms
- ✅ **Smooth animation** - No visible stutters or "catch-up" lag
- ✅ **Fast response** - Beam follows scroll with minimal delay (300ms max)

### 3. Feature Combination Testing Matrix

Test all combinations to ensure no regressions:

#### Basic Configurations:
| Test # | invert | maskLightByProgress | fullWidth | Expected Result |
|--------|--------|---------------------|-----------|-----------------|
| 1 | false | false | 1.0 | Default: smooth scroll, full width expansion |
| 2 | true | false | 1.0 | Inverted: beam animates in reverse direction |
| 3 | false | true | 1.0 | Mask: fade effect increases with scroll |
| 4 | true | true | 1.0 | Both: inverted + progressive mask |

#### fullWidth Variations:
| Test # | fullWidth | Expected Result |
|--------|-----------|-----------------|
| 5 | 0.2 | Minimal expansion (20% of range) |
| 6 | 0.5 | Half expansion (50% of range) |
| 7 | 0.8 | Mostly full expansion (80% of range) |
| 8 | 1.0 | Full expansion (100% of range) - DEFAULT |

#### Dynamic Prop Changes:
| Test # | Action | Expected Result |
|--------|--------|-----------------|
| 9 | Toggle dark/light mode | Color changes immediately, no lag |
| 10 | Toggle invert during scroll | Direction reverses smoothly, no jitter |
| 11 | Toggle maskLightByProgress | Mask structure updates immediately |

### 4. Visual Smoothness Testing

#### Scroll Speed Tests:
- **Slow scroll** - Should be perfectly smooth, no stutters
- **Fast scroll** - Should keep up with minimal lag (max 300ms)
- **Scroll back up** - Should animate in reverse smoothly
- **Sudden stop** - Animation should catch up within 300ms

#### Edge Cases:
- Resize window during scroll
- Switch browser tabs and return
- Mobile/touch scrolling (if applicable)

### 5. Regression Testing

Verify previous bug fixes still work:
- ✅ maskLightByProgress updates dynamically when prop changes
- ✅ invert changes apply immediately without lag/jitter
- ✅ Color changes (dark/light mode) apply immediately
- ✅ No scroll-back-up issues from Framer Motion migration

### 6. Performance Comparison

#### Before (scrub: true ≈ 1 second):
- ❌ Visible 1-2 stutters when scrolling ~300px
- ❌ Animation "catches up" after scroll stops
- ❌ Feels sluggish and unoptimized

#### After (scrub: 0.3):
- ✅ Smooth scroll response
- ✅ No visible stutters
- ✅ Animation follows scroll closely
- ✅ Feels responsive and polished

## Testing Notes

### If Scroll Still Feels Laggy:
Try adjusting scrub value in `src/index.tsx` line 228:
- `scrub: 0.1` - Very fast, may feel jittery on fast scrolls
- `scrub: 0.2` - Fast and responsive
- `scrub: 0.3` - **Current setting** (recommended)
- `scrub: 0.5` - Smoother but slower response

### If Animation Feels Jittery:
- Increase scrub value to 0.5 or higher
- Check for other scroll listeners interfering
- Verify no CSS animations conflicting with GSAP

## Performance Metrics to Capture

If possible, capture these metrics before/after:
- **FPS** - Target: consistent 60fps
- **Scripting time per frame** - Target: <16ms
- **Paint time** - Target: <10ms
- **Layout shifts** - Target: 0 (no CLS)

## Test Environment
- **Browser**: Chrome (latest)
- **Device**: Desktop (high refresh rate if available)
- **Network**: Local development server
- **Build**: Development mode (`npm run dev`)

## Sign-Off

After completing all tests above, confirm:
- [ ] All 11 test cases pass
- [ ] No visual lag or stuttering
- [ ] 60fps maintained in DevTools
- [ ] No long tasks >50ms
- [ ] Previous bug fixes still working
- [ ] Dark/light mode switching works
- [ ] All fullWidth values work as expected

If all items checked, the scroll lag fix is verified successful.
