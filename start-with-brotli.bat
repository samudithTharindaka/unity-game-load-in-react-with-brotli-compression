@echo off
echo ========================================
echo  Unity WebGL React App - Brotli Server
echo ========================================
echo.
echo Step 1: Building React app...
echo This may take 1-2 minutes...
echo.
call npm run build
if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)
echo.
echo Step 2: Starting server with Brotli support...
echo.
echo Your app will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
node server.js

