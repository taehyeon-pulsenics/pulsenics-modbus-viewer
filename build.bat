@echo off
REM Build Electron Exe
start "" cmd /c "cd client && npm run make"

REM Build Express + SocketIO Server Exe
start "" cmd /c "cd server-js && npm run dist"