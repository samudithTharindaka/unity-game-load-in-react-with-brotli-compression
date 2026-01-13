// This file configures the development server to properly serve Brotli compressed Unity files
// create-react-app automatically loads this file

const path = require('path');
const fs = require('fs');

module.exports = function(app) {
  // IMPORTANT: Serve Unity files directly before React Router catches them
  // This prevents the "Unexpected token '<'" error
  app.use((req, res, next) => {
    // Check if this is a Unity file request
    if (req.url.includes('/unity/') || req.url.includes('/Build')) {
      const publicPath = path.join(__dirname, '..', 'public');
      const filePath = path.join(publicPath, req.url);
      
      // Normalize path to handle Windows/Unix differences
      const normalizedPath = path.normalize(filePath);
      
      // Check if file exists
      if (fs.existsSync(normalizedPath)) {
        const stats = fs.statSync(normalizedPath);
        if (stats.isFile()) {
          // Set appropriate headers
          if (req.url.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript; charset=utf-8');
          } else if (req.url.endsWith('.br')) {
            res.set('Content-Encoding', 'br');
            if (req.url.endsWith('.data.br')) {
              res.set('Content-Type', 'application/octet-stream');
            } else if (req.url.endsWith('.wasm.br')) {
              res.set('Content-Type', 'application/wasm');
            } else if (req.url.endsWith('.js.br')) {
              res.set('Content-Type', 'application/javascript');
            }
          } else if (req.url.endsWith('.wasm')) {
            res.set('Content-Type', 'application/wasm');
          } else if (req.url.endsWith('.json')) {
            res.set('Content-Type', 'application/json');
            res.set('Access-Control-Allow-Origin', '*');
          }
          
          // Serve the file with absolute path
          return res.sendFile(path.resolve(normalizedPath));
        }
      }
    }
    next();
  });

  // CORS middleware for Addressables (must be before other middleware)
  app.use((req, res, next) => {
    // Set CORS headers for JSON and Addressables files
    if (req.url.endsWith('.json') || req.url.includes('StreamingAssets') || req.url.includes('aa/') || req.url.includes('catalog')) {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
    }
    // Handle OPTIONS requests
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Middleware to set correct headers for .br files
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
};


