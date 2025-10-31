# Proxy ECONNREFUSED Error - Troubleshooting Guide

**Document Version:** 1.1
**Date:** 2025-10-31
**Issue Type:** Runtime Error / Proxy Configuration
**Status:** Resolved

## Issue Summary

When running `npm start`, developers see "Proxy error: Could not proxy request" with ECONNREFUSED errors for image files and logo files. The webpack compiler completes successfully, but 21+ proxy errors appear in the console.

## Error Messages

```
webpack compiled with 1 warning

Proxy error: Could not proxy request /images/216419883.jpeg from localhost:3000 to http://localhost:8080/.
See https://nodejs.org/api/errors.html#errors_common_system_errors for more information (ECONNREFUSED).

Proxy error: Could not proxy request /images/521681749.jpeg from localhost:3000 to http://localhost:8080/.
See https://nodejs.org/api/errors.html#errors_common_system_errors for more information (ECONNREFUSED).

Proxy error: Could not proxy request /logo192.png from localhost:3000 to http://localhost:8080/.
See https://nodejs.org/api/errors.html#errors_common_system_errors for more information (ECONNREFUSED).

[... 19 more similar errors for .jpeg files]
```

## Root Cause Analysis

### Primary Issue: Wrong File Extensions

The root cause was **incorrect file extensions** in image references:
- **Code referenced:** `.jpeg` files
- **Actual files:** `.webp` format

All images in `frontend/public/images/` were converted to WebP format for optimization, but `Home.jsx` still referenced them with `.jpeg` extensions.

### Additional Issue: Missing Logo Files

PWA manifest file (`manifest.json`) referenced logo files that don't exist:
- **Referenced in manifest.json:** `logo192.png` and `logo512.png`
- **Actual files:** Only `favicon.ico` exists in `public/`
- **Result:** Additional proxy error for `/logo192.png`

### Secondary Issue: Misunderstanding of Proxy Behavior

The error message mentions "proxy" because:
1. React development server (`localhost:3000`) uses a proxy configuration
2. When a file isn't found in `public/`, it attempts to proxy to backend (`localhost:8080`)
3. Backend server wasn't running, resulting in ECONNREFUSED
4. The real issue wasn't the proxy, but the missing files due to wrong extensions

### Why This Happens

```javascript
// package.json
{
  "proxy": "http://localhost:8080"
}
```

React's proxy setting means:
- Requests to `/images/*.jpeg` first check `public/images/`
- If not found, they're proxied to `http://localhost:8080/images/*.jpeg`
- Since backend isn't running → ECONNREFUSED error
- Real problem: files are named `*.webp`, not `*.jpeg`

## Solution

### Fix 1: Update Image Extensions in Home.jsx

Changed all image references from `.jpeg` to `.webp`:

**Before:**
```javascript
image: "/images/3207359177.jpeg"
<img src="/images/216419883.jpeg" alt="..." />
```

**After:**
```javascript
image: "/images/3207359177.webp"
<img src="/images/216419883.webp" alt="..." />
```

### Fix 2: Update PWA Manifest

Removed references to non-existent logo files in `manifest.json`:

**Before:**
```json
{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ]
}
```

**After:**
```json
{
  "short_name": "SSF Shop",
  "name": "SSF E-commerce Platform",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ]
}
```

### Files Modified

- `frontend/src/pages/home/Home.jsx`
- `frontend/public/manifest.json`
  - 21 image references updated
  - 5 product images in homeProducts array
  - 3 event banner images
  - 4 ranking item images
  - 5 featured brand images
  - 4 brand story images

### Complete List of Changed References

**Product Images (homeProducts array):**
1. `3207359177.jpeg` → `3207359177.webp`
2. `1010207927.jpeg` → `1010207927.webp`
3. `3793950654.jpeg` → `3793950654.webp`
4. `3826030000.jpeg` → `3826030000.webp`
5. `635366670.jpeg` → `635366670.webp`

**Event Banner Images:**
6. `216419883.jpeg` → `216419883.webp`
7. `521681749.jpeg` → `521681749.webp`
8. `1642450336.jpeg` → `1642450336.webp`

**Ranking Section Images:**
9. `3206396286.jpeg` → `3206396286.webp`
10. `357450008.jpeg` → `357450008.webp`
11. `1491953271.jpeg` → `1491953271.webp`
12. `573690851.jpeg` → `573690851.webp`

**Featured Brands Images:**
13. `1119019333.jpeg` → `1119019333.webp`
14. `578281922.jpeg` → `578281922.webp`
15. `1202455836.jpeg` → `1202455836.webp`
16. `3859394708.jpeg` → `3859394708.webp`
17. `3086143679.jpeg` → `3086143679.webp`

**Brand Story Images:**
18. `133835897.jpeg` → `133835897.webp`
19. `3635466172.jpeg` → `3635466172.webp`
20. `1176900044.jpeg` → `1176900044.webp`
21. `3362617750.jpeg` → `3362617750.webp`

## Verification Steps

### Step 1: Verify File Extensions in Public Folder

```bash
cd frontend/public/images
ls *.webp | wc -l  # Should show 21 files
ls *.jpeg | wc -l  # Should show 0 files
```

### Step 2: Search for Remaining .jpeg References

```bash
cd frontend/src
grep -r "\.jpeg" . --include="*.jsx" --include="*.js"
# Should return no results in Home.jsx after fix
```

### Step 3: Test Development Server

```bash
npm start
```

Expected result:
- ✅ No proxy errors
- ✅ All images load correctly
- ✅ Console is clean (except normal React warnings)

## Understanding the Proxy Configuration

### How React Proxy Works

```
Browser Request Flow:
1. Request: http://localhost:3000/images/example.jpeg
2. React checks: frontend/public/images/example.jpeg
3. If found: Serve directly from public folder
4. If NOT found: Proxy to http://localhost:8080/images/example.jpeg
5. If backend offline: ECONNREFUSED error
```

### When Proxy Errors Are Normal

Proxy errors are expected when:
- Backend server is not running
- Frontend requests API endpoints (e.g., `/api/products`)
- You're developing frontend-only features

### When Proxy Errors Are Problems

Proxy errors indicate issues when:
- Requesting static assets that should be in `public/`
- Wrong file paths or extensions (like this case)
- Missing files that should exist locally

## Prevention Guidelines

### For Developers

1. **Check Actual File Extensions**
   ```bash
   ls frontend/public/images | head -20
   # Verify actual file extensions before coding
   ```

2. **Use Correct Extensions in Code**
   - If files are `.webp`, reference them as `.webp`
   - Don't assume `.jpeg` or `.jpg` without checking

3. **Search Before Committing**
   ```bash
   grep -r "\.jpeg" frontend/src
   # Verify no hardcoded wrong extensions
   ```

4. **Test Locally**
   - Always run `npm start` after image changes
   - Check browser console for 404 errors
   - Verify images load in the UI

### For Image Management

1. **Standardize on WebP Format**
   - WebP provides better compression than JPEG
   - Maintains image quality at smaller file sizes
   - Supported by all modern browsers

2. **Naming Convention**
   - Use numeric IDs: `3207359177.webp`
   - Or descriptive names: `event-banner-sale.webp`
   - Avoid mixed extensions in same directory

3. **Image Optimization Pipeline**
   ```bash
   # Convert JPEG to WebP
   cwebp input.jpeg -o output.webp

   # Batch conversion
   for file in *.jpeg; do
     cwebp "$file" -o "${file%.jpeg}.webp"
   done
   ```

## Common Misconceptions

### Misconception 1: "Backend Must Be Running"

❌ **Wrong:** "I need to start the Spring Boot backend to see images"

✅ **Correct:** Static images in `public/` are served by React dev server, no backend needed

### Misconception 2: "It's a Proxy Issue"

❌ **Wrong:** "There's something wrong with the proxy configuration"

✅ **Correct:** Proxy is working fine. The issue is wrong file extensions in code.

### Misconception 3: "ECONNREFUSED Means Backend Error"

❌ **Wrong:** "This is a backend connection problem"

✅ **Correct:** It's a frontend issue. Backend is only contacted when file isn't in `public/`.

## Related Configuration Files

### package.json Proxy Setting

```json
{
  "name": "frontend",
  "proxy": "http://localhost:8080"
}
```

This setting:
- Proxies API requests to backend
- Only activates when file not found in `public/`
- Useful for `/api/*` endpoints
- Not needed for static assets

### Alternative: Manual Proxy Configuration

If you need more control, use `src/setupProxy.js`:

```javascript
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
};
```

This only proxies `/api/*` requests, not static assets.

## Troubleshooting Checklist

When you see proxy ECONNREFUSED errors:

- [ ] Check if requested files exist in `public/` folder
- [ ] Verify file extensions match code references
- [ ] Check browser DevTools Network tab for 404 errors
- [ ] Search codebase for wrong extensions: `grep -r "\.jpeg"`
- [ ] Verify image file format: `file frontend/public/images/*.webp`
- [ ] Clear browser cache: Ctrl+Shift+R (hard refresh)
- [ ] Restart development server: `npm start`
- [ ] Check if only API calls should be proxied (not static assets)

## Image File Standards

### Current Image Storage Structure

```
frontend/
├── public/
│   ├── images/          # Main product/content images (WebP)
│   │   ├── 216419883.webp
│   │   ├── 521681749.webp
│   │   └── ... (21 total)
│   └── icons/           # UI icons and brand logos
│       ├── main1.webp
│       ├── brand_*.webp
│       └── ... (63 total)
└── src/
    └── assets/
        └── brands/      # Brand assets imported in JS
            ├── brand_eight-seconds.webp
            └── ... (35 files)
```

### Image Reference Guidelines

| Location | Usage | Reference Method | Example |
|----------|-------|------------------|---------|
| `public/images/` | Content images | Absolute path from public | `/images/photo.webp` |
| `public/icons/` | UI icons | Absolute path from public | `/icons/logo.svg` |
| `src/assets/` | Imported assets | ES6 import | `import logo from '../../assets/brands/logo.webp'` |

## Success Criteria

After applying the fix:
- ✅ No "Proxy error: Could not proxy request" messages
- ✅ No ECONNREFUSED errors in console
- ✅ All 21 images load successfully on Home page
- ✅ Browser DevTools shows 200 OK for all image requests
- ✅ No 404 errors for `/images/*` paths
- ✅ Page renders correctly with all images visible

## Additional Notes

### Why WebP Instead of JPEG?

WebP advantages:
- **25-35% smaller** file sizes than JPEG at same quality
- **Supports transparency** (like PNG)
- **Better compression** algorithm
- **Fast decoding** in modern browsers
- **Wide support** (Chrome, Firefox, Safari, Edge)

### Browser Compatibility

WebP support:
- ✅ Chrome 32+
- ✅ Firefox 65+
- ✅ Safari 14+
- ✅ Edge 18+

For older browsers, use `<picture>` with fallback:
```html
<picture>
  <source srcset="/images/photo.webp" type="image/webp">
  <img src="/images/photo.jpeg" alt="Photo">
</picture>
```

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-31 | Claude Code | Initial documentation of proxy ECONNREFUSED error fix |
| 1.1 | 2025-10-31 | Claude Code | Added manifest.json fix for missing logo files (logo192.png, logo512.png) |

---

**Last Updated:** 2025-10-31
**Maintained By:** Development Team
**Category:** Troubleshooting / Runtime Errors
**Related Docs:**
- [npm start Module Not Found Error](./npm-start-module-not-found-error.md)
- [Image File Standardization](../06-changelog/image-file-standardization.md)
