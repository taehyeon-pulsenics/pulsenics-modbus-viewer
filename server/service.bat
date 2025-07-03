@echo off
setlocal

:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
    IF "%PROCESSOR_ARCHITECTURE%" EQU "amd64" (
>nul 2>&1 "%SYSTEMROOT%\SysWOW64\cacls.exe" "%SYSTEMROOT%\SysWOW64\config\system"
) ELSE (
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
)

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params= %*
    echo UAC.ShellExecute "cmd.exe", "/c ""%~s0"" %params:"=""%", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------  

:: === CONFIGURATION ===
set SERVICE_NAME=PMVS
set NSSM_EXE=%~dp0nssm\nssm.exe
set SCRIPT_PATH=%~dp0dist\main.py
set LOG_DIR=%~dp0logs

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
  "%NSSM_EXE%" install "%SERVICE_NAME%" "%PYTHON_EXE%" "-u %SCRIPT_PATH%"
  "%NSSM_EXE%" set "%SERVICE_NAME%" AppDirectory "%~dp0dist"
  "%NSSM_EXE%" set "%SERVICE_NAME%" AppStdout  "%LOG_DIR%\stdout.log"
  "%NSSM_EXE%" set "%SERVICE_NAME%" AppStderr  "%LOG_DIR%\stderr.log"
  "%NSSM_EXE%" set "%SERVICE_NAME%" Start SERVICE_AUTO_START
) else (
  echo Service "%SERVICE_NAME%" already installed, skipping install.
)

:: === START SERVICE ===
echo Starting service "%SERVICE_NAME%"...
"%NSSM_EXE%" start "%SERVICE_NAME%"

endlocal
