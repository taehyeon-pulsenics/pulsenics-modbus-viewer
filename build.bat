@echo off
setlocal

echo [1/3] Building Electron client...
echo Killing any running Electron instances...
taskkill /F /IM pulsenics-modbus-viewer-app.exe /T >nul 2>&1
taskkill /F /IM electron.exe /T >nul 2>&1
cd /d "%~dp0client"
call npm run package
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Electron client build failed.
    exit /b 1
)

echo [2/3] Building server executable...
cd /d "%~dp0server"
call npm run dist
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Server build failed.
    exit /b 1
)

echo [3/3] Compiling installer...
cd /d "%~dp0"
set "ISCC=%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe"
if not exist "%ISCC%" set "ISCC=%ProgramFiles%\Inno Setup 6\ISCC.exe"
if not exist "%ISCC%" (
    echo ERROR: Inno Setup 6 not found. Install it from https://jrsoftware.org/isinfo.php
    exit /b 1
)
"%ISCC%" setup.iss
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Inno Setup compilation failed.
    exit /b 1
)

echo.
echo Build complete. Installer is in the Output folder.
endlocal
