@echo off
setlocal

:: === CONFIGURATION ===
set "SCRIPT_DIR=%~dp0"
set "START_SERVER_BAT=%SCRIPT_DIR%startServer.bat"
set "START_CLIENT_BAT=%SCRIPT_DIR%startClient.bat"
set "STOP_SERVER_BAT=%SCRIPTDIR%stopServer.bat"

call "%START_SERVER_BAT%"
set "SERVER_RETURN_CODE=%ERRORLEVEL%"

echo "%SERVER_RETURN_CODE%"

call "%START_CLIENT_BAT%"

if %SERVER_RETURN_CODE% EQU 0 (
    call "%STOP_SERVER_BAT%"
)

endlocal
