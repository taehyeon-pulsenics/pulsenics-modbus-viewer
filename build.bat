@echo off
REM Build Electron Exe
start "" cmd /c "cd client && npm run make"

REM Build FastAPI Exe
start "" cmd /c "cd server && pyinstaller --onefile --name pulsenics-modbus-viewer-server src/main.py"