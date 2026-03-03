# 🚀 Performance Optimization Guide

## Why itch.io Runs Smoothly But Local Doesn't

### itch.io (Production)
- ✅ **Production build** - Minified, optimized code
- ✅ **Aggressive caching** - Files cached for months
- ✅ **CDN delivery** - Fast content delivery
- ✅ **No source maps** - Smaller file sizes
- ✅ **Gzip compression** - Smaller downloads
- ✅ **Optimized React** - Production React build

### Local Development (`npm start`)
- ❌ **Development build** - Unminified, unoptimized
- ❌ **No caching** - Files reloaded every time
- ❌ **Source maps** - Extra overhead
- ❌ **Hot reloading** - Performance overhead
- ❌ **Development React** - Slower React build

## ✅ Solution: Run Production Build Locally

### Option 1: Quick Production Build (Recommended)

```bash
npm run start:prod
```

This will:
1. Build optimized React app (no source maps)
2. Start production server with caching
3. Match itch.io performance

### Option 2: Manual Steps

```bash
# Build production React app
npm run build

# Start production server
npm run serve
```

## 🎯 Performance Optimizations Added

### 1. **Aggressive Caching**
- Unity files cached for 1 year (like itch.io)
- HTML files revalidated on each request
- Reduces network requests significantly

### 2. **Gzip Compression**
- Added `compression` middleware
- Compresses all text-based files
- Reduces download sizes by 60-80%

### 3. **Production React Build**
- Minified JavaScript
- No source maps (unless needed)
- Optimized bundle sizes
- Tree-shaking enabled

### 4. **Optimized Static File Serving**
- Proper cache headers
- ETag support
- Last-Modified headers

## 📊 Performance Comparison

| Metric | Development (`npm start`) | Production (`npm run start:prod`) | itch.io |
|--------|---------------------------|-----------------------------------|---------|
| **Initial Load** | ~5-10s | ~2-3s | ~2-3s |
| **File Size** | ~5MB | ~2MB | ~2MB |
| **Caching** | None | Aggressive | Aggressive |
| **Source Maps** | Yes | No | No |
| **Compression** | Basic | Gzip | Gzip |
| **React Build** | Dev | Prod | Prod |

## 🔧 Additional Optimizations

### Disable Debug Console in Production

The `UnityDebugger` component automatically hides in production builds, but you can also remove it:

```jsx
// In src/App.jsx, the debugger only shows in development
{process.env.NODE_ENV === 'development' && <UnityDebugger />}
```

### Browser Caching

Clear your browser cache when testing:
- **Chrome**: `Ctrl+Shift+Delete` → Clear cached images and files
- Or use **Incognito/Private mode** for testing

### Network Tab Check

Open DevTools → Network tab and check:
- Files should show `(from disk cache)` on refresh
- File sizes should be smaller (compressed)
- No red errors

## 🚨 Common Issues

### Still Slow After Production Build?

1. **Check browser cache**: Clear cache or use incognito
2. **Check Network tab**: Look for failed requests
3. **Check console**: Look for errors
4. **Try different browser**: Some browsers cache differently

### Files Not Caching?

- Make sure you're using `npm run serve` (not `npm start`)
- Check server logs for cache headers
- Verify files are being served from `build/` folder

## 📝 Best Practices

1. **Always use production build for testing performance**
2. **Clear browser cache between tests**
3. **Use Network tab to verify caching**
4. **Test in incognito mode for accurate results**

## 🎮 For Deployment

When deploying to production (Vercel, Netlify, etc.):
- They automatically use production builds
- They handle caching automatically
- They use CDN for fast delivery
- Performance will match itch.io

---

**TL;DR**: Use `npm run start:prod` instead of `npm start` to match itch.io performance! 🚀
