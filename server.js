// Custom development server with Brotli support for Unity WebGL
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

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

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the React build (for production)
app.use(express.static(path.join(__dirname, 'build')));

// Fallback to index.html for React Router
app.get('*', (req, res) => {
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
  console.log(`\n✅ Server running with Brotli support!`);
  console.log(`\n   Local:            http://localhost:${PORT}`);
  console.log(`   On Your Network:  http://192.168.1.132:${PORT}`);
  console.log(`\n📝 Press Ctrl+C to stop the server\n`);
});


