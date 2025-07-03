@echo off 

set SERVICE_NAME=PulsenicsModbusViewerServer
set NSSM_PATH=%~dp0server\nssm\nssm.exe

:: stop service
"%NSSM_PATH%" stop %SERVICE_NAME%

:: kill gui
taskkill /F /IM pulsenics-modbus-viewer-app.exe /T

exit