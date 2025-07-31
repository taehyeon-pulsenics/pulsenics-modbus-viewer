@echo off
setlocal EnableExtensions

:: === CONFIGURATION ===
set "SERVICE_NAME=PulsenicsModbusViewerServer"
set "SCRIPT_DIR=%~dp0"
set "NSSM_EXE=%SCRIPT_DIR%nssm\nssm.exe"
set "SERVER_EXE=%SCRIPT_DIR%server-js\dist\pulsenics-modbus-viewer-server.exe"
set "LOG_DIR=%SCRIPT_DIR%logs"

:: === CHECK IF SERVICE IS ALREADY RUNNING ===
call "%SCRIPT_DIR%checkService.bat" "%SERVICE_NAME%"
if %ERRORLEVEL% NEQ 0 (
    :: 1 = missing arg, 2+ = already running
    exit /b %ERRORLEVEL%
)

:: === PREPARE LOG DIRECTORY ===
if not exist "%LOG_DIR%" (
    echo Creating log directory "%LOG_DIR%"
    mkdir "%LOG_DIR%"
)

:: === INSTALL SERVICE IF MISSING ===
"%NSSM_EXE%" status "%SERVICE_NAME%" >nul 2>&1
if errorlevel 1 (
    echo Installing service "%SERVICE_NAME%"…
    "%NSSM_EXE%" install "%SERVICE_NAME%" "%SERVER_EXE%"
    "%NSSM_EXE%" set "%SERVICE_NAME%" AppDirectory "%SCRIPT_DIR%server-js\dist"
    "%NSSM_EXE%" set "%SERVICE_NAME%" AppStdout  "%LOG_DIR%\service.log"
    "%NSSM_EXE%" set "%SERVICE_NAME%" AppStderr  "%LOG_DIR%\service-error.log"
    "%NSSM_EXE%" set "%SERVICE_NAME%" Start SERVICE_AUTO_START
) else (
    echo Service "%SERVICE_NAME%" already installed, skipping install.
)

:: === START SERVER ===
"%NSSM_EXE%" start "%SERVICE_NAME%"

popd
endlocal
