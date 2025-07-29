@echo off

:: ─── Prevent multiple instances ──────────────────────────────
set EXE_NAME=pulsenics-modbus-viewer-app.exe

:: look in the task list for any running copies of your exe
tasklist /FI "IMAGENAME eq %EXE_NAME%" /NH | find /I "%EXE_NAME%" >nul
if not errorlevel 1 (
  echo.
  echo ==> %EXE_NAME% is already running.  Exiting.
  echo.
  pause
  exit /B 1
)
:: ──────────────────────────────────────────────────────────────

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

start .\run_silently.vbs .\start.bat