@echo off
setlocal EnableExtensions

:: === CONFIGURATION ===
set "SERVICE_NAME=PulsenicsModbusViewerServer"

:: === STOP SERVICE ===
sc stop "%SERVICE_NAME%" >nul 2>&1

endlocal
