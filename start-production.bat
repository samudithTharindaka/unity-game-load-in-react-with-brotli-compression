@echo off
echo ========================================
echo  Unity WebGL React App - Production
echo ========================================
echo.
echo Building optimized production app...
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
echo Starting production server...
echo.
echo Your optimized app will be available at: http://localhost:3000
echo Performance matches itch.io deployment!
echo Press Ctrl+C to stop the server
echo.
node server.js
