# Addressables Configuration Fix

## ✅ Fixed Issues

1. **File Name Mismatch**: Updated from `Build12.*` to `Build13.*` to match actual files
2. **StreamingAssets Path**: Set to absolute path `/unity/Build12/StreamingAssets`
3. **CORS Headers**: Added to both `server.js` and `setupProxy.js` for Addressables support

## ⚠️ Important: Remote Addressables Configuration

Your Unity Addressables are configured to load from a **remote S3 bucket**:

```
https://samu-unity-game-assets.s3.ap-southeast-2.amazonaws.com/WebGL/
```

### Current Setup

The `settings.json` shows:
- Catalog location: Remote S3 bucket
- Asset bundles: Expected to be on remote server
- Local catalog.json: Only contains a few test assets

### The Problem

Unity is trying to load assets like:
- `Maps/Core`
- `Maps/loadscene`
- `Maps/buildings2`
- etc.

But these are configured as **remote content**, not local.

## 🔧 Solutions

### Option 1: Use Local Addressables (Recommended for Development)

1. **Open Unity Project**
2. **Window → Asset Management → Addressables → Groups**
3. **For each Addressables group:**
   - Select the group
   - In Inspector, change "Build & Load Paths" from "Remote" to "Local"
4. **Rebuild Addressables:**
   - Window → Asset Management → Addressables → Build → New Build → Default Build Script
5. **Rebuild WebGL:**
   - File → Build Settings → Build
6. **Replace the build folder** in `public/unity/Build12/`

### Option 2: Configure Remote S3 Bucket

If you want to use remote Addressables:

1. **Ensure S3 bucket has CORS configured:**
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

2. **Upload Addressables bundles to S3:**
   - Upload all `.bundle` files to the S3 bucket
   - Upload `catalog.json` and `catalog_*.hash` files
   - Ensure paths match Unity's expected structure

3. **Verify remote URL is accessible** from your domain

### Option 3: Proxy Remote Requests (Development Only)

If you need to test with remote Addressables locally, you can add a proxy to `server.js`:

```javascript
// Add this before the static file serving middleware
app.use('/unity-remote', (req, res, next) => {
  const targetUrl = 'https://samu-unity-game-assets.s3.ap-southeast-2.amazonaws.com/WebGL' + req.url.replace('/unity-remote', '');
  // Proxy logic here (requires http-proxy-middleware package)
  next();
});
```

## 📝 Current Configuration

- **Build Files**: `Build13.*` (fixed)
- **StreamingAssets**: `/unity/Build12/StreamingAssets` (absolute path)
- **CORS**: Enabled for JSON and Addressables files
- **Brotli**: Supported with correct headers

## 🚀 Next Steps

1. **Restart your server** to apply CORS changes
2. **Check browser console** for any remaining errors
3. **If assets still missing**: Configure Unity to use local Addressables (Option 1)

## 🔍 Debugging

Check browser Network tab for:
- Failed requests to S3 bucket (CORS errors)
- Missing catalog.json requests
- 404 errors for asset bundles

If you see CORS errors for S3, you need to configure the S3 bucket CORS settings.


