// This file configures the development server to properly serve Brotli compressed Unity files
// create-react-app automatically loads this file

module.exports = function(app) {
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


