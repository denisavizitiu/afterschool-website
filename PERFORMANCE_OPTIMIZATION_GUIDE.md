# Image Compression & Optimization Guide

## Current Performance Status

**Total Image Size:** 10.93 MB (35 images)
**After Optimization Goal:** 3-5 MB (60-70% reduction)

---

## Priority Compression Targets

### 1. **Critical - Over 500 KB** (Compress first)
- `about-1.jpg` - 1.1 MB → target 200-300 KB
- `summer-school-s9.png` - 734 KB → target 200-250 KB
- `summer-school-s8.png` - 557 KB → target 150-200 KB
- `HristinaEducare logo.jpeg.jpg` - 813 KB → target 100-150 KB
- `logo-hristina-educare1.jpg` - 814 KB → target 100-150 KB

### 2. **High Priority - 250-500 KB** (Compress second)
- Various summer-school schedule images (s2, s4, s6, s10)
- `program-1.jpg`, `program-2.jpg` - 256 KB, 186 KB
- `hero.jpg` - 394 KB

### 3. **Medium Priority - 100-250 KB** (Optional)
- Gallery activity images
- Remaining program images

---

## Free Online Compression Tools

### Option 1: **TinyPNG/TinyJPG** (RECOMMENDED - EASIEST)
- **URL:** https://tinypng.com
- **How:** Drag-and-drop images, download compressed versions
- **Typical Reduction:** 30-70% smaller
- **Free Limit:** 20 files per month (or get API key for unlimited)
- **Supported:** PNG, JPG, JPEG, WebP
- **Steps:**
  1. Go to tinypng.com
  2. Drag your largest images (about-1.jpg, summer-school images)
  3. Download compressed versions
  4. Replace originals in `c:\afterschool-website\images\`

### Option 2: **Squoosh** (FREE - Browser-Based)
- **URL:** https://squoosh.app
- **How:** Upload image, adjust quality slider, download
- **Typical Reduction:** 40-80%
- **Supported:** PNG, JPG, WebP, AVIF
- **Advantages:** No upload limits, can preview quality
- **Steps:**
  1. Go to squoosh.app
  2. Click "Select Image"
  3. Drag largest image from `c:\afterschool-website\images\`
  4. Adjust quality slider to ~75-80% (good balance)
  5. Select WebP format for better compression
  6. Download and replace

### Option 3: **ImageOptim (Windows)**
- **URL:** https://imageoptim.com (Mac) or use **FileOptimizer** on Windows
- **FileOptimizer:** https://nikkhokkho.sourceforge.io/static.php?page=FileOptimizer
- **How:** Drag folders, automatically optimizes in place
- **Reduction:** 20-50%
- **Free:** Yes
- **Steps:**
  1. Download FileOptimizer
  2. Drag `c:\afterschool-website\images\` folder
  3. Let it process all images

---

## Alternative: Using FFmpeg (if installed)

If you have FFmpeg installed, you can batch compress JPGs:
```powershell
cd c:\afterschool-website\images
# Compress all JPGs to quality 80 (0-100 scale)
Get-ChildItem *.jpg | ForEach-Object {
    ffmpeg -i $_.Name -q:v 2 ("_optimized_" + $_.Name)
}
# Then replace originals with optimized versions
```

---

## Recommended Compression Steps (Windows)

### Step 1: Batch Compress with TinyPNG
1. Copy your 5 largest files to a temp folder
2. Upload to https://tinypng.com (20 files/month free)
3. Download all at once
4. Replace originals

### Step 2: Use Squoosh for remaining images
1. Go to https://squoosh.app
2. Upload remaining images one-by-one
3. Set quality to 75-80% for JPG
4. Download and replace

### Step 3: Verify Results
1. Run this script again: `.\tools\analyze_images.ps1`
2. Check total size decreased
3. Visually inspect key images in browser

---

## Expected Results After Compression

| Image | Current | Target | Method |
|-------|---------|--------|--------|
| about-1.jpg | 1.1 MB | 250 KB | TinyPNG + resize |
| summer-school-s9.png | 734 KB | 200 KB | Squoosh (WebP) |
| summer-school-s8.png | 557 KB | 180 KB | Squoosh (WebP) |
| Logo files | 814 KB each | 120 KB | TinyPNG |
| hero.jpg | 394 KB | 250 KB | Squoosh 75% quality |
| Gallery JPGs | Varies | <150 KB | TinyPNG batch |

**Expected Total After Optimization:** 3-4 MB (65% reduction)

---

## Advanced Option: WebP Conversion

For browsers supporting WebP (95%+ of users), you can save an additional 25-35%:

1. Download optimized JPEG/PNG files first
2. Use Squoosh to convert each to WebP format
3. Update HTML to use WebP with JPG fallback:
   ```html
   <picture>
     <source srcset="image.webp" type="image/webp">
     <img src="image.jpg" alt="...">
   </picture>
   ```

---

## Performance After All Optimizations

- ✅ Lazy-loaded images (already implemented)
- ✅ Fonts preconnected + display=swap (already in place)
- ⏳ Image compression (IN PROGRESS - see above)
- ⏳ WebP format (OPTIONAL - additional 25-35% savings)

**Timeline to Complete:** 30-45 minutes for full compression

---

## Next Steps

1. **Run image analysis** (done ✓)
2. **Compress images** using TinyPNG or Squoosh (START HERE)
3. **Replace originals** in `/images/` folder
4. **Run analysis again** to verify savings
5. **(Optional) Convert to WebP** for additional gains

---

Questions? See the compression tools' help pages or contact.
