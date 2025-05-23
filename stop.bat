@echo off

:: kill background processes
taskkill /F /IM pulsenics-modbus-viewer-app.exe /T
taskkill /F /IM pulsenics-modbus-viewer-server.exe /T

exit