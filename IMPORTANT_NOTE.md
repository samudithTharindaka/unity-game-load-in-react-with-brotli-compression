# ⚠️ Important: Build11 Folder Location

## ✅ Correct Structure

The `Build11` folder **MUST** be inside the `public` folder:

```
unity-web-game-learn/
├── public/
│   └── Build11/          ← Unity build goes here!
│       ├── Build/
│       └── TemplateData/
├── src/
└── package.json
```

## ❌ Incorrect Structure

~~Do NOT place Build11 in the root directory~~

```
unity-web-game-learn/
├── Build11/              ← Wrong location!
├── public/
├── src/
└── package.json
```

## Why?

React apps built with `create-react-app` serve static files from the `public` folder. Files in the `public` folder are:

1. **Served as-is** without processing
2. **Accessible via URL** at runtime
3. **Included in production builds** automatically

## How It Works

When you reference `/Build11/Build/Build11.loader.js` in your code:

- React looks in `public/Build11/Build/Build11.loader.js`
- The file is served directly to the browser
- Unity can load all its assets properly

## If You Need to Update Your Unity Build

1. Export a new WebGL build from Unity
2. Delete the old `public/Build11` folder
3. Copy the new build folder to `public/Build11`
4. Restart the dev server (`npm start`)

## Path References in Code

The code uses `process.env.PUBLIC_URL` to ensure paths work in both development and production:

```jsx
const buildUrl = process.env.PUBLIC_URL + '/Build11/Build';
```

This automatically resolves to:
- Development: `http://localhost:3000/Build11/Build`
- Production: `https://yourdomain.com/Build11/Build`

---

**Status:** ✅ Already configured correctly in this project!


