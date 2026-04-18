## 🎯 PERFORMANCE FIX ACTION PLAN - Aya Home Project

**Status:** PageSpeed Insights Analysis Complete  
**Date:** April 18, 2026, 9:44 PM  
**Current Scores:** Desktop 87, Mobile 64

---

## 📋 PROBLEM ANALYSIS

### Why Images Aren't Optimizing
- ✅ **Code is deployed:** Picture elements with WebP format requests ✅
- ❌ **Missing infrastructure:** Supabase doesn't support query-based image transformation
- ❌ **Result:** Browsers still download full-size JPG images (no format change)

### Opportunities (Per Lighthouse)
1. **Image delivery:** 4,792 KiB savings (CRITICAL)
2. **Render blocking:** 1,020 ms (partially fixed)
3. **Cache headers:** 270 KiB (not configured)
4. **Network payload:** 5,764 KiB total

---

## 🚀 SOLUTION STRATEGY

### OPTION 1: Use Vercel Image Optimization (RECOMMENDED)
**Time:** 20 minutes | **Difficulty:** Easy | **Cost:** FREE (included with Vercel)

Since your site is hosted on Vercel, use their built-in Image Optimization:

```typescript
// Install package
npm install next/image

// Replace image URLs
<img src="product.jpg" />

// With:
<Image 
  src="product.jpg"
  width={700}
  height={700}
  quality={80}
  responsive={true}
/>
```

**Automatic:**
- WebP conversion
- Responsive sizing
- Lazy loading
- Caching

**Deploy:** Push to Vercel, done!

---

### OPTION 2: Use Cloudinary (FREE TIER)
**Time:** 30 minutes | **Difficulty:** Medium | **Cost:** FREE tier (generous limits)

1. Create Cloudinary account (free)
2. Upload images to Cloudinary
3. Use transformation URLs:

```typescript
const cloudinaryUrl = `https://res.cloudinary.com/{cloud_name}/image/fetch/
  w_700,q_auto,f_auto/
  {external_image_url}`;
```

**Benefits:**
- Automatic format selection (WebP for supported browsers)
- Responsive sizing
- 25GB/month free tier
- No server needed

---

### OPTION 3: Pre-convert to WebP + Upload (MANUAL)
**Time:** 45 minutes | **Difficulty:** Hard | **Cost:** Storage only

Steps:
1. Convert all JPG images to WebP locally
2. Upload both formats to Supabase
3. Use conditional serving in code

```bash
# Convert JPG to WebP
magick convert product.jpg -quality 80 product.webp

# Or online: https://convertio.co/ (free)
```

---

## ✅ RECOMMENDED: Option 1 (Vercel Image Optimization)

### Why?
- Zero cost (already included)
- Requires minimal code changes
- Handles all optimization automatically
- Works with Supabase URLs
- Production-ready now

### Implementation Steps

**Step 1:** Install Next.js Image component compatibility
```bash
npm install sharp
```

**Step 2:** Update React components to remove picture elements
```tsx
// BEFORE: Manual picture element
<picture>
  <source srcSet="...webp" type="image/webp" />
  <img src="...jpg" />
</picture>

// AFTER: Let Vercel handle optimization
<img src="product.jpg" alt="..." loading="lazy" />
```

**Step 3:** Vercel automatically optimizes at build/runtime
- Detects WebP support
- Sends WebP to capable browsers
- Sends JPG to others
- Caches optimized versions

**Step 4:** Configure in vercel.json
```json
{
  "images": {
    "domains": ["plokugmfybeumlyvefne.supabase.co"],
    "sizes": [200, 250, 400, 700, 1024],
    "formats": ["image/webp", "image/avif"]
  }
}
```

---

## 💡 QUICK FIX (15 minutes)

Since image transformation requires infrastructure changes, let's do **quick wins first:**

### 1. Configure Supabase Cache Headers (5 min)
```
Dashboard → Storage → products → Settings
Cache-Control: public, max-age=2592000, immutable
```
✅ **Gain:** +5-8 Lighthouse points  
✅ **Impact:** 270 KiB repeat visit savings

### 2. Fix Remaining Render-Blocking Issues (5 min)
- Remove unused CSS imports
- Defer non-critical JavaScript
- Inline critical CSS

### 3. Reduce TBT to <50ms (5 min)
- Optimize React components
- Break large computations into chunks
- Use requestIdleCallback for non-critical tasks

---

## 📊 EXPECTED IMPROVEMENTS

### After Quick Wins (Cache + Code):
- Mobile: 64 → 72-75 (+8-11 points)
- TBT: 70ms → 50-60ms
- Time: ~15 minutes

### After Image Optimization (Option 1):
- Mobile: 72 → 85+ (+13-15 points)
- LCP: 12.3s → 5-6s (50% faster!)
- FCP: 3.6s → 1.8-2.0s (50% faster!)
- Time: ~30 minutes

### FINAL TARGET:
- **Desktop: 87 → 94+**
- **Mobile: 64 → 85+**
- **Gap closed:** 23 points → 9 points

---

## 📋 STEP-BY-STEP IMPLEMENTATION

### PHASE 1: Quick Wins (Next 15 minutes)

```bash
# 1. Configure Supabase Cache (manual via dashboard)
#    Dashboard → Storage → products → Cache-Control settings

# 2. Rebuild and deploy
npm run build
git add -A
git commit -m "perf: Configure cache headers and optimize TBT"
git push origin main

# 3. Wait for Vercel auto-deploy (2-3 min)

# 4. Retest with PageSpeed
```

**Expected Result:** 64 → 72-75 points

---

### PHASE 2: Image Optimization (Next 30 minutes)

```bash
# Option A: Vercel Image Optimization
npm install sharp

# Update components to remove manual picture elements
# Remove from: src/pages/ProductDetail.tsx, src/pages/Products.tsx

# Update vercel.json with image config

# Deploy
git add -A
git commit -m "perf: Switch to Vercel Image Optimization for WebP + responsive"
git push origin main

# Wait for deployment
```

**Expected Result:** 75 → 85+ points

---

## 🎓 KEY LEARNINGS

### What Worked ✅
- Font preconnect optimization
- CSS code splitting
- Lazy loading implementation
- Picture element structure

### What Didn't Work ❌
- Query-based image transformation (Supabase limitation)
- Our getOptimizedImageUrl() generates URLs Supabase can't process

### Best Practice
- For Vercel hosting: Use Vercel Image Optimization
- For other hosting: Use dedicated CDN (Cloudinary, imgix, etc.)
- Never assume CDN supports transformation without testing

---

## 🔍 VERIFICATION STEPS

### After Cache Headers:
```bash
curl -I https://plokugmfybeumlyvefne.supabase.co/storage/...
# Look for: Cache-Control: public, max-age=2592000
```

### After Vercel Optimization:
- Open DevTools > Network tab
- Filter by images
- Check that WebP is served on supported browsers
- Verify responsive sizes are working

### After All Changes:
```
1. Run PageSpeed Insights again
2. Compare: 64 → 85+ (target achieved!)
3. Check Core Web Vitals
4. Test on actual mobile device
```

---

## 📞 SUPPORT RESOURCES

- **Vercel Image Optimization:** https://vercel.com/docs/concepts/image-optimization
- **Cloudinary Transformation:** https://cloudinary.com/documentation
- **WebP Conversion:** https://convertio.co/
- **Cache Headers:** https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control

---

## ⏱️ TIME ESTIMATE

- **Quick Wins:** 15 minutes → 64 → 72 points
- **Image Optimization:** 30 minutes → 72 → 85 points
- **Total Time:** ~45 minutes to hit 85+ Lighthouse score

---

## 🎯 FINAL STATUS CHECK

| Metric | Current | Target | Method |
|--------|---------|--------|--------|
| Mobile Score | 64 | 85+ | Vercel Img + Cache |
| Desktop Score | 87 | 94+ | Cache headers |
| LCP | 12.3s | 5-6s | WebP + responsive |
| FCP | 3.6s | 1.8-2.0s | WebP + responsive |
| Cache Control | ❌ | ✅ | Supabase dashboard |
| Image Format | JPG | WebP | Vercel optimization |

---

**Status:** Ready for implementation
**Priority:** HIGH - Quick wins will improve score significantly
**Next Action:** Configure Supabase cache headers
