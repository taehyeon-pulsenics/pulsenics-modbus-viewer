@echo off
setlocal EnableExtensions

:: pass the service name as the first argument:
::   checkService.bat MyServiceName
if "%~1"=="" (
    echo Service Name is expected here
    exit /b 1
) else (
    set "ServiceName=%~1"
)

:: Query the service and look for “RUNNING”
sc query "%ServiceName%" | findstr /I "RUNNING" >nul

if %ERRORLEVEL% EQU 0 (
    echo Already running
    exit /b 2
)

echo Service "%ServiceName%" is not running.

endlocal

exit /b 0