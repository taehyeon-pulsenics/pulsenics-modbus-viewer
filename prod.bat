@echo off
REM — Go to the folder where this script lives
cd /d "%~dp0"

REM — Start background app minimized (no console window)
start /b "" "%~dp0\server\dist\pulsenics-modbus-viewer-server.exe"

REM — Launch Electron app and wait for it to close
start "" /WAIT "%~dp0\client\out\pulsenics-modbus-viewer-app-win32-x64\pulsenics-modbus-viewer-app.exe"

REM — Electron has exited; now shut down all relevant processes
start /b "" .\stop.bat
