// Production server with Brotli support for Unity WebGL
// Optimized for performance - matches itch.io deployment
const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable gzip compression for better performance
app.use(compression());

// S3 bucket URL for Addressables
const S3_BASE_URL = 'https://samu-unity-game-assets.s3.ap-southeast-2.amazonaws.com/WebGL';

// Logging middleware for debugging
app.use((req, res, next) => {
  // Log Addressables-related requests
  if (req.url.includes('StreamingAssets') || req.url.includes('aa/') || req.url.includes('catalog') || req.url.includes('.bundle')) {
    console.log(`[Addressables] ${req.method} ${req.url}`);
  }
  next();
});

// CORS middleware for Addressables (must be before other middleware)
app.use((req, res, next) => {
  // Set CORS headers for JSON and Addressables files
  if (req.url.endsWith('.json') || req.url.includes('StreamingAssets') || req.url.includes('aa/') || req.url.includes('catalog') || req.url.includes('.bundle') || req.url.includes('.hash')) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    if (req.url.endsWith('.json')) {
      res.set('Content-Type', 'application/json');
    }
  }
  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Middleware to handle Brotli compressed files
app.use((req, res, next) => {
  if (req.url.endsWith('.br')) {
    res.set('Content-Encoding', 'br');
    
    // Set correct content type based on file extension
    if (req.url.endsWith('.data.br')) {
      res.set('Content-Type', 'application/octet-stream');
    } else if (req.url.endsWith('.wasm.br')) {
      res.set('Content-Type', 'application/wasm');
    } else if (req.url.endsWith('.js.br')) {
      res.set('Content-Type', 'application/javascript');
    }
  }
  next();
});

// Proxy for remote Addressables (S3 bucket)
app.use('/unity-remote', (req, res) => {
  const targetUrl = S3_BASE_URL + req.url.replace('/unity-remote', '');
  console.log(`[Proxy] Fetching: ${targetUrl}`);
  
  https.get(targetUrl, (proxyRes) => {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    // Copy content type
    if (proxyRes.headers['content-type']) {
      res.set('Content-Type', proxyRes.headers['content-type']);
    }
    
    // Copy status code
    res.status(proxyRes.statusCode);
    
    // Pipe the response
    proxyRes.pipe(res);
  }).on('error', (err) => {
    console.error(`[Proxy] Error fetching ${targetUrl}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch from S3', details: err.message });
  });
});

// Serve static files with aggressive caching (production optimization)
const staticOptions = {
  maxAge: '1y', // Cache for 1 year (like itch.io)
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Unity files should be cached aggressively
    if (path.includes('/unity/') || path.includes('.br') || path.includes('.wasm') || path.includes('.data')) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // HTML should be cached less aggressively
    if (path.endsWith('.html')) {
      res.set('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
};

// Serve static files from public folder (Unity files must be served before catch-all)
app.use(express.static(path.join(__dirname, 'public'), staticOptions));

// Serve the React build (for production) with optimizations
app.use(express.static(path.join(__dirname, 'build'), staticOptions));

// Error handling middleware (must be before catch-all route)
app.use((err, req, res, next) => {
  // Handle URL decoding errors gracefully
  if (err instanceof URIError && err.message.includes('decode')) {
    console.warn(`[Warning] Invalid URL parameter: ${req.url}`);
    // Clean the URL and try to serve the file
    const cleanUrl = req.url.replace(/%PUBLIC_URL%/g, '');
    if (cleanUrl !== req.url) {
      req.url = cleanUrl;
      return next();
    }
    // If it's a React Router route, serve index.html
    const buildIndex = path.join(__dirname, 'build', 'index.html');
    if (require('fs').existsSync(buildIndex)) {
      return res.sendFile(buildIndex);
    }
    return res.status(404).send('File not found');
  }
  next(err);
});

// Fallback to index.html for React Router (but NOT for Unity files)
app.get('*', (req, res, next) => {
  // Skip invalid URLs with %PUBLIC_URL% or other encoded characters
  if (req.url.includes('%PUBLIC_URL%') || req.url.includes('%')) {
    const buildIndex = path.join(__dirname, 'build', 'index.html');
    if (require('fs').existsSync(buildIndex)) {
      return res.sendFile(buildIndex);
    }
    return res.status(404).send('File not found');
  }
  
  // Don't intercept Unity build files or other static assets
  if (req.url.includes('/unity/') || 
      req.url.includes('.js') || 
      req.url.includes('.br') || 
      req.url.includes('.wasm') ||
      req.url.includes('.data') ||
      req.url.includes('.bundle') ||
      req.url.includes('.json')) {
    // Let express.static handle these, return 404 if not found
    return res.status(404).send('File not found');
  }
  
  const buildIndex = path.join(__dirname, 'build', 'index.html');
  const publicIndex = path.join(__dirname, 'public', 'index.html');
  
  // Try build folder first, then public folder
  if (require('fs').existsSync(buildIndex)) {
    res.sendFile(buildIndex);
  } else {
    res.sendFile(publicIndex);
  }
});

app.listen(PORT, () => {
  console.log(`\n🎮 Unity WebGL React App Server`);
  console.log(`\n✅ Server running with Brotli & Addressables support!`);
  console.log(`\n   Local:            http://localhost:${PORT}`);
  console.log(`   On Your Network:  http://192.168.1.132:${PORT}`);
  console.log(`\n📝 Press Ctrl+C to stop the server\n`);
});


