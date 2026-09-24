@echo off
setlocal
cd /d "%~dp0"

set "MESACODE_SKIP_REMOTE_ASSETS=1"
set "MESACODE_SKIP_BUILD=0"

call pnpm exec node scripts/bump-desktop-version.mjs
if errorlevel 1 exit /b %errorlevel%

call pnpm bundle:desktop
if errorlevel 1 exit /b %errorlevel%

echo.
echo Installer ready:
dir /b /o-d packages\desktop\dist\*.exe
endlocal
