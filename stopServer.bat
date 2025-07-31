@echo off
setlocal EnableExtensions

:: === CONFIGURATION ===
set "SERVICE_NAME=PulsenicsModbusViewerServer"
set "SCRIPT_DIR=%~dp0"
set "NSSM_EXE=%SCRIPT_DIR%nssm\nssm.exe"

:: === SHUT DOWN AND CLEAN UP ===
"%NSSM_EXE%" stop "%SERVICE_NAME%"

endlocal