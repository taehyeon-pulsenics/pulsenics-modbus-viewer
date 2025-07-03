@echo off
setlocal

:: === CONFIGURATION ===
set SERVICE_NAME=PulsenicsModbusViewerServer
set NSSM_EXE=%~dp0server\nssm\nssm.exe
set SERVER_PATH=%~dp0server\src\main.py
set ELECTRON_PATH=%~dp0client\pulsenics-modbus-viewer-app.exe
set LOG_DIR=%~dp0server\logs

:: === FIND PYTHON (first match only) ===
for /f "delims=" %%A in ('where python.exe 2^>nul') do (
    set "PYTHON_EXE=%%A"
    goto :gotPython
)
:gotPython
if not defined PYTHON_EXE (
  echo [ERROR] Python not found in PATH.
  exit /b 1
)
echo Python path: "%PYTHON_EXE%"

:: === PREPARE LOG DIRECTORY ===
if not exist "%LOG_DIR%" (
  echo Creating log directory "%LOG_DIR%"
  mkdir "%LOG_DIR%"
)

:: === INSTALL SERVICE (if missing) ===
"%NSSM_EXE%" status "%SERVICE_NAME%" >nul 2>&1
if errorlevel 1 (
  echo Installing service "%SERVICE_NAME%"...
  "%NSSM_EXE%" install "%SERVICE_NAME%" "%PYTHON_EXE%" "-u \"%SERVER_PATH%\""
  "%NSSM_EXE%" set "%SERVICE_NAME%" AppDirectory "%~dp0server\src"
  "%NSSM_EXE%" set "%SERVICE_NAME%" AppStdout  "%LOG_DIR%\service.log"
  "%NSSM_EXE%" set "%SERVICE_NAME%" AppStderr  "%LOG_DIR%\service-error.log"
  "%NSSM_EXE%" set "%SERVICE_NAME%" Start SERVICE_AUTO_START
) else (
  echo Service "%SERVICE_NAME%" already installed, skipping install.
)

REM — Start server service
"%NSSM_EXE%" start %SERVICE_NAME%

REM — Launch Electron app and wait for it to close
start "" /WAIT "%ELECTRON_PATH%"

REM — Electron has exited; now shut down all relevant processes
start /b "" .\stop.bat

endlocal