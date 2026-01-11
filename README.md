# Unity WebGL React App

A React application to run your Unity WebGL game with fullscreen support.

## Features

- ✨ Modern React 18 application
- 🎮 Unity WebGL game integration
- 🖥️ Fullscreen mode support
- 📱 Responsive design (mobile & desktop)
- 🎨 Beautiful gradient UI with glassmorphism effects
- ⚡ Loading progress indicator
- 🔄 Error handling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode

Start the development server:

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Production Build

Build the app for production:

```bash
npm run build
```

The optimized build will be in the `build` folder.

## Project Structure

```
unity-webgl-react-app/
├── public/
│   ├── Build11/            # Unity WebGL build files
│   │   ├── Build/          # Compiled game files
│   │   └── TemplateData/   # Unity assets
│   ├── index.html          # HTML template
│   └── favicon.ico         # App icon
├── src/
│   ├── components/
│   │   ├── UnityPlayer.jsx # Unity WebGL player component
│   │   └── UnityPlayer.css # Unity player styles
│   ├── App.jsx             # Main app component
│   ├── App.css             # App styles
│   ├── index.jsx           # Entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Unity WebGL Build Setup

Your Unity WebGL build should be in the `public/Build11` folder with the following structure:

```
public/Build11/
├── Build/
│   ├── Build11.data.br
│   ├── Build11.framework.js.br
│   ├── Build11.loader.js
│   └── Build11.wasm.br
└── TemplateData/
    └── (Unity template assets)
```

**Important:** The `Build11` folder must be inside the `public` folder so React can serve it as a static asset.

## Fullscreen Mode

- Click the **Fullscreen** button in the header
- Press **F11** for browser fullscreen
- Press **ESC** to exit fullscreen

## Customization

### Change Game Title

Edit `src/App.jsx`:
```jsx
<h1>Your Game Title</h1>
```

### Modify Colors

Edit `src/App.css` to change the gradient background:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Update Unity Build Path

If your Unity build has a different name, update `src/components/UnityPlayer.jsx`:
```jsx
const buildUrl = '/YourBuildName/Build';
const loaderUrl = buildUrl + '/YourBuildName.loader.js';
```

## Troubleshooting

### Game Not Loading

1. Ensure Unity build files are in the `public/Build11` folder
2. Check browser console for errors
3. Verify file paths in `UnityPlayer.jsx`
4. Make sure you're using `npm start` (not opening HTML directly)

### CORS Errors

If running locally, make sure to use `npm start` instead of opening `index.html` directly.

### Performance Issues

- Use Unity's compression (Brotli or Gzip)
- Optimize Unity build settings
- Consider reducing canvas resolution for mobile devices

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT

## Credits

Built with React and Unity WebGL

