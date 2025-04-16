@echo off
REM Start Electron
start "" cmd /k "cd client && npm run dev"

REM Start Express + SocketIO Server
start "" cmd /k "cd server && npm run dev"