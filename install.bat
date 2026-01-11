@echo off
echo Installing dependencies...
call npm install
echo.
echo Installation complete!
echo.
echo IMPORTANT: Your Unity build uses Brotli compression (.br files)
echo This requires the express package which has been installed.
echo.
echo The setupProxy.js file will configure the dev server automatically.
echo.
echo To start the development server, run: npm start
echo.
pause

