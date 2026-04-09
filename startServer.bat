@echo off
setlocal EnableExtensions

:: === CONFIGURATION ===
set "SERVICE_NAME=PulsenicsModbusViewerServer"
set "SCRIPT_DIR=%~dp0"
set "SERVER_EXE=%SCRIPT_DIR%server\dist\pulsenics-modbus-viewer-server.exe"
set "LOG_DIR=%SCRIPT_DIR%logs"

:: === CHECK IF SERVICE IS ALREADY RUNNING ===
sc query "%SERVICE_NAME%" | findstr /I "RUNNING" >nul
if %ERRORLEVEL% EQU 0 (
    echo Service "%SERVICE_NAME%" is already running.
    exit /b 2
)

:: === PREPARE LOG DIRECTORY ===
if not exist "%LOG_DIR%" (
    echo Creating log directory "%LOG_DIR%"
    mkdir "%LOG_DIR%"
)

:: === CREATE SERVICE IF MISSING, OR UPDATE BINARY PATH IF ALREADY EXISTS ===
sc query "%SERVICE_NAME%" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Installing service "%SERVICE_NAME%"...
    sc create "%SERVICE_NAME%" binPath= "\"%SERVER_EXE%\"" start= auto DisplayName= "%SERVICE_NAME%"
    timeout /t 1 /nobreak >nul
    sc description "%SERVICE_NAME%" "Pulsenics Modbus Viewer backend server"
) else (
    echo Service "%SERVICE_NAME%" already installed, updating binary path...
    sc config "%SERVICE_NAME%" binPath= "\"%SERVER_EXE%\""
)

:: === START SERVICE ===
sc start "%SERVICE_NAME%"

endlocal
