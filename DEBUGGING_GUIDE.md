# 🐛 Unity WebGL Debugging Guide

## ✅ What I've Fixed

1. **File Names**: Updated to `Build13.*` to match actual files
2. **Product Version**: Updated to `0.2.0` to match Unity build
3. **Error Logging**: Enhanced error capture and display
4. **Debug Console**: Added visual debugger component (bottom-right corner in dev mode)
5. **Server Logging**: Added logging for Addressables requests
6. **CORS Headers**: Added for all Addressables-related files

## 🔍 How to Debug Console Errors

### 1. Check Browser Console
Open browser DevTools (F12) and check:
- **Console tab**: Look for red errors
- **Network tab**: Check failed requests (red entries)
- **Filter by**: "Unity", "Addressables", "Build", "catalog"

### 2. Check Debug Console Component
A debug console appears in the **bottom-right corner** (dev mode only) showing:
- Unity errors
- Unity warnings  
- Unity-related logs

### 3. Check Server Logs
If using `npm run serve`, check terminal for:
```
[Addressables] GET /unity/Build12/StreamingAssets/aa/catalog.json
```

## 🎯 Common Issues & Solutions

### Issue 1: Addressables Loading from Remote S3

**Symptoms:**
- Errors like: `No Location found for Key=Maps/Core`
- CORS errors in console
- 404 errors for `.bundle` files

**Cause:**
Your Addressables are configured to load from:
```
https://samu-unity-game-assets.s3.ap-southeast-2.amazonaws.com/WebGL/
```

**Solutions:**

#### Option A: Configure S3 CORS (If using remote)
Add this CORS configuration to your S3 bucket:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

#### Option B: Use Local Addressables (Recommended)
1. Open Unity Project
2. Window → Asset Management → Addressables → Groups
3. For each group, change "Build & Load Paths" from "Remote" to "Local"
4. Rebuild Addressables: Window → Asset Management → Addressables → Build → New Build → Default Build Script
5. Rebuild WebGL
6. Replace `public/unity/Build12` folder

### Issue 2: File Not Found Errors

**Check:**
- Are files named correctly? (`Build13.*` not `Build12.*`)
- Are files in correct location? (`public/unity/Build12/Build/`)
- Check Network tab for 404 errors

### Issue 3: Brotli Compression Errors

**Symptoms:**
- `Unable to parse .br file`
- `Content-Encoding: br` errors

**Solution:**
Use the custom server: `npm run build && npm run serve`

### Issue 4: CORS Errors

**Symptoms:**
- `Access-Control-Allow-Origin` errors
- Cross-origin request blocked

**Solution:**
CORS headers are already added. If still failing:
1. Check server is running (`npm run serve`)
2. Verify CORS middleware is active (check server logs)
3. For remote S3, configure S3 bucket CORS

## 📋 Debug Checklist

- [ ] Server is running (`npm run serve` or `npm start`)
- [ ] Files exist: `public/unity/Build12/Build/Build13.*`
- [ ] Browser console shows no 404 errors
- [ ] Network tab shows successful requests for:
  - `Build13.loader.js`
  - `Build13.data.br`
  - `Build13.framework.js.br`
  - `Build13.wasm.br`
- [ ] Addressables catalog loads: `StreamingAssets/aa/catalog.json`
- [ ] No CORS errors in console
- [ ] Debug console (bottom-right) shows errors if any

## 🔧 Quick Fixes

### Restart Server
```bash
# Stop server (Ctrl+C)
npm run build
npm run serve
```

### Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or clear cache in DevTools

### Check File Paths
Verify these URLs work in browser:
- `http://localhost:3000/unity/Build12/Build/Build13.loader.js`
- `http://localhost:3000/unity/Build12/StreamingAssets/aa/catalog.json`

## 📝 What to Report

If errors persist, check and report:

1. **Browser Console Errors** (copy exact error messages)
2. **Network Tab** (screenshot of failed requests)
3. **Server Logs** (any [Addressables] entries)
4. **Debug Console** (bottom-right corner errors)

## 🎮 Testing

1. Open browser: `http://localhost:3000`
2. Open DevTools (F12)
3. Check Console tab for errors
4. Check Network tab for failed requests
5. Look at Debug Console component (bottom-right)
6. Check if Unity game loads

---

**Note**: The debug console only appears in development mode (`npm start` or `npm run serve`). It won't show in production builds.


