@echo off

set SERVER_PATH=%~dp0server\dist\main.py
set ELECTRON_PATH=%~dp0client\pulsenics-modbus-viewer-app.exe

REM — Go to the folder where this script lives
cd /d "%~dp0"

start cmd /c "python %SERVER_PATH%"

REM — Launch Electron app and wait for it to close
start cmd /c "cd client && npm start"
