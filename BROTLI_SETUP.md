# Brotli Compression Setup

Your Unity build uses **Brotli compression** (`.br` files), which requires special server configuration.

## ✅ What's Already Done

I've added:
1. `src/setupProxy.js` - Configures dev server headers
2. `public/.htaccess` - For Apache production servers
3. `express` dependency in `package.json`

## 🚀 Steps to Run

### 1. Install Dependencies (Including Express)

```bash
npm install
```

### 2. Restart the Dev Server

```bash
npm start
```

The `setupProxy.js` file will automatically configure the development server to serve `.br` files with the correct `Content-Encoding: br` header.

## 🔧 If It Still Doesn't Work

### Option A: Use HTTP-Server with Brotli Support

1. Install http-server globally:
```bash
npm install -g http-server
```

2. Build the React app:
```bash
npm run build
```

3. Serve with proper headers:
```bash
http-server build -p 3000 --brotli
```

### Option B: Rebuild Unity Without Compression (Easiest!)

If you have access to the Unity project:

1. Open Unity project
2. Go to **File → Build Settings → Player Settings**
3. Find **Publishing Settings**
4. Change **Compression Format** to:
   - **Disabled** (no compression - larger files but easier to serve)
   - **Gzip** (widely supported, works out of the box)

5. Rebuild for WebGL
6. Replace `public/Build11` with the new build

## 📝 Why This Happens

Brotli compression (`.br` files) requires:
- Server must send `Content-Encoding: br` header
- HTTPS connection (Brotli often doesn't work over HTTP)
- Proper MIME types for each file

Development servers don't usually configure this automatically.

## 🌐 For Production Deployment

### Apache (.htaccess already created)
The `.htaccess` file in `public/` will handle this automatically.

### Nginx
Add to your nginx config:
```nginx
location ~* \\.br$ {
    add_header Content-Encoding br;
    types {
        application/octet-stream data.br;
        application/wasm wasm.br;
        application/javascript js.br;
    }
}
```

### Vercel/Netlify
These platforms automatically handle Brotli compression.

## ✨ Recommended Solution

**Rebuild Unity with Gzip or no compression** - This is the simplest solution and works everywhere without configuration.


