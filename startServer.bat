@echo off
setlocal EnableExtensions

set "SCRIPT_DIR=%~dp0"
set "SERVER_EXE=%SCRIPT_DIR%server\dist\pulsenics-modbus-viewer-server.exe"

start "Pulsenics Modbus Viewer Server" "%SERVER_EXE%"

endlocal
