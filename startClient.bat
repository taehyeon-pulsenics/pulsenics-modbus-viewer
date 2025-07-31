@echo off
setlocal EnableExtensions

:: === CONFIGURATION ===
set "SCRIPT_DIR=%~dp0"
set "ELECTRON_EXE=%SCRIPT_DIR%client\pulsenics-modbus-viewer-app.exe"

"%ELECTRON_EXE%"

endlocal