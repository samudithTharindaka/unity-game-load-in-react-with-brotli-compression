# Setup Guide for Windows

## Quick Start

### Option 1: Using Batch Files (Easiest)

1. **Install Dependencies**
   - Double-click `install.bat`
   - Wait for installation to complete

2. **Start the App**
   - Double-click `start.bat`
   - Your browser will open automatically at http://localhost:3000

### Option 2: Using Command Prompt

1. Open Command Prompt (cmd.exe) in this folder
2. Run: `npm install`
3. Run: `npm start`

### Option 3: Fix PowerShell (If you prefer PowerShell)

If you want to use PowerShell, you need to enable script execution:

1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Type 'Y' and press Enter
4. Close PowerShell and reopen normally
5. Run: `npm install`
6. Run: `npm start`

## What to Expect

1. **Installation** (first time only)
   - Takes 2-5 minutes
   - Downloads React and dependencies
   - Creates `node_modules` folder

2. **Starting the App**
   - Development server starts
   - Browser opens automatically
   - You'll see your Unity game with a fullscreen button

3. **Using the App**
   - Click "Fullscreen" button to enter fullscreen mode
   - Press ESC to exit fullscreen
   - Press F11 for browser fullscreen

## Troubleshooting

### "npm is not recognized"
- Install Node.js from https://nodejs.org/
- Restart your computer
- Try again

### Port 3000 already in use
- Close other applications using port 3000
- Or the app will automatically use port 3001

### Game not loading
- Make sure `Build11` folder is inside the `public` directory
- Check that all Unity build files are present
- Clear browser cache and refresh
- Ensure you're using `npm start` (not opening files directly)

## Building for Production

To create a production build:

1. Run: `npm run build`
2. The optimized app will be in the `build` folder
3. Deploy the `build` folder to any web server

## Need Help?

Check the main README.md file for more detailed information.

