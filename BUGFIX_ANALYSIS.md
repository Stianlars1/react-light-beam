# Bug Analysis: react-light-beam GSAP Implementation

## Progress Calculation Comparison

### Framer Motion (old.tsx)
```typescript
// When element entering viewport (below viewport):
// rect.top > windowHeight, clamped to 1
// normalizedPosition = Math.max(adjustedFullWidth, 1) = 1
// progress (invert=false) = 1 - 1 = 0

// When element at viewport top:
// rect.top = 0
// normalizedPosition = Math.max(adjustedFullWidth, 0) = adjustedFullWidth
// progress (invert=false) = 1 - adjustedFullWidth = 1 (if fullWidth=1.0)

// Result: progress goes 0→1 as element scrolls UP
```

### GSAP (new.tsx)
```typescript
// When element entering (rawProgress=0 at "top bottom"):
// normalizedPosition = max(adjustedFullWidth, min(1, 1-0)) = 1
// progress (invert=false) = 1 - 1 = 0

// When element at top (rawProgress=1 at "top top"):
// normalizedPosition = max(adjustedFullWidth, min(1, 1-1)) = adjustedFullWidth
// progress (invert=false) = 1 - adjustedFullWidth = 1 (if fullWidth=1.0)

// Result: progress goes 0→1 as element scrolls UP ✅ CORRECT
```

**Conclusion**: Progress calculation is mathematically CORRECT.

---

## Bug #1: maskLightByProgress Not Updating

### Root Cause
`initGradientStructure()` is only called ONCE during component initialization (line 166). It reads `maskByProgressRef.current` to decide which gradient structure to set.

**Problem**: When `maskLightByProgress` prop changes after initialization:
1. The ref gets updated (line 64) ✅
2. But the mask gradient structure is NEVER rebuilt ❌

### Visual Impact
- User toggles `maskLightByProgress` from false to true
- Mask gradient stays as static `25% to 95%`
- Variable `--beam-mask-stop` gets updated but has no effect because gradient doesn't reference it

### Fix Required
When `maskLightByProgress` changes, we need to:
1. Rebuild the mask gradient structure
2. Reinitialize the mask stop value
3. Apply the new state immediately

---

## Bug #2: invert Lag/Jitter

### Root Cause Analysis

**Current Flow When `invert` Changes:**
1. useEffect triggers (line 61-71)
2. `invertRef.current = invert` updates the ref
3. **NOTHING ELSE HAPPENS** - no visual update
4. Visual only updates on next scroll event

**Why This Causes Lag:**
1. User toggles `invert` while scrolled to 50% position
2. Ref updates but `calculateProgress()` isn't called
3. Beam stays in old state until user scrolls
4. When scroll happens, sudden jump to new state = jitter

**Why There's No Dependency on `invert`:**
The `useGSAP` dependencies (line 238-243) intentionally exclude `invert` to avoid recreating ScrollTrigger. But this means changes to `invert` don't trigger any update.

### Fix Required
When `invert` changes, we need to:
1. Get current ScrollTrigger progress
2. Recalculate using new `invert` value
3. Apply new state immediately without waiting for scroll

---

## Bug #3 (Discovered): Color Changes Not Rebuilding Gradient

### Root Cause
`initGradientStructure(colorRef.current)` is only called once. When color changes:
1. CSS variable `--beam-color` updates (line 69) ✅
2. But this only works because the gradient string references the variable ✅

This one actually works correctly! The gradient uses `var(--beam-color)` so updating the CSS variable automatically updates the gradient.

---

## Performance Analysis

### Current Bottlenecks (per scroll frame)

1. **3-5 `setProperty()` calls**:
   - `--beam-left-pos`
   - `--beam-right-pos`
   - `--beam-left-size`
   - `--beam-mask-stop` (conditional)
   - `--base-opacity`
   - `opacity` (conditional)

2. **String template literals**: `` `${value}%` `` created 3-5 times per frame

3. **Function calls**: Multiple helper function calls per frame

### Optimization Strategy

**Option A: Batch CSS Updates** (Recommended)
- Collect all CSS updates
- Apply in single operation

**Option B: Direct GSAP Animation**
- Use `gsap.set()` with object
- Batch all style updates
- Let GSAP handle optimization

**Option C: Pre-calculate Strings**
- Use lookup tables for common values
- Reduce template literal overhead

---

## Implementation Plan

### Phase 1: Fix maskLightByProgress
1. Create `updateMaskStructure()` function
2. Call when `maskLightByProgress` changes
3. Store ScrollTrigger instance in ref for access

### Phase 2: Fix invert Lag
1. Add immediate update when `invert` changes
2. Manually call progress calculation with current ScrollTrigger progress
3. Apply new state without waiting for scroll

### Phase 3: Optimize Performance
1. Batch all `setProperty()` calls
2. Use `gsap.set()` for batch updates
3. Minimize string allocations

### Phase 4: Testing
Test matrix:
- ✅ `invert=false` + `maskLightByProgress=false`
- ✅ `invert=true` + `maskLightByProgress=false`
- ✅ `invert=false` + `maskLightByProgress=true`
- ✅ `invert=true` + `maskLightByProgress=true`
- ✅ Dynamic prop changes during scroll
- ✅ Different `fullWidth` values
- ✅ Dark mode switching
