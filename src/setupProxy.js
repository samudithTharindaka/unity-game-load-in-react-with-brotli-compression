// This file configures the development server to properly serve Brotli compressed Unity files
// create-react-app automatically loads this file

const path = require('path');
const fs = require('fs');

module.exports = function (app) {
  const publicPath = path.resolve(__dirname, '..', 'public');

  function unityFilePathFromUrl(url) {
    const pathname = decodeURIComponent(url.split('?')[0].split('#')[0]);
    const relative = pathname.replace(/^\/+/, '');
    const resolved = path.normalize(path.join(publicPath, relative));
    const relToPublic = path.relative(publicPath, resolved);
    if (relToPublic.startsWith('..') || path.isAbsolute(relToPublic)) {
      return null;
    }
    return resolved;
  }

  // IMPORTANT: Serve Unity files directly before the SPA fallback returns index.html for unknown URLs.
  // If index.html is returned for .loader.js, the browser throws: Unexpected token '<'
  app.use((req, res, next) => {
    if (!req.url.includes('/unity/')) {
      return next();
    }

    const filePath = unityFilePathFromUrl(req.url);
    if (!filePath) {
      return next();
    }

    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        const urlPath = req.url.split('?')[0];

        if (urlPath.endsWith('.js')) {
          res.set('Content-Type', 'application/javascript; charset=utf-8');
        } else if (urlPath.endsWith('.br')) {
          res.set('Content-Encoding', 'br');
          if (urlPath.endsWith('.data.br')) {
            res.set('Content-Type', 'application/octet-stream');
          } else if (urlPath.endsWith('.wasm.br')) {
            res.set('Content-Type', 'application/wasm');
          } else if (urlPath.endsWith('.js.br')) {
            res.set('Content-Type', 'application/javascript');
          }
        } else if (urlPath.endsWith('.wasm')) {
          res.set('Content-Type', 'application/wasm');
        } else if (urlPath.endsWith('.json')) {
          res.set('Content-Type', 'application/json');
          res.set('Access-Control-Allow-Origin', '*');
        }

        return res.sendFile(filePath);
      }
    }

    // Missing file under /unity/ — do not fall through to SPA HTML
    if (req.url.includes('/unity/')) {
      return res
        .status(404)
        .type('text/plain')
        .send(
          `Unity file not found on disk:\n${filePath}\n\n` +
            `Copy your full WebGL output from Unity (Build/ and StreamingAssets/ folders, plus TemplateData/) ` +
            `into the matching folder under public/unity/.`
        );
    }

    next();
  });

  // CORS middleware for Addressables (must be before other middleware)
  app.use((req, res, next) => {
    if (
      req.url.endsWith('.json') ||
      req.url.includes('StreamingAssets') ||
      req.url.includes('aa/') ||
      req.url.includes('catalog')
    ) {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
    }
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
