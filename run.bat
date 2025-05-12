@echo off
REM Start Electron
start "" cmd /k "cd client && npm run dev"

REM Start Express + SocketIO Server
start "" cmd /k "cd server-py && python main.py"