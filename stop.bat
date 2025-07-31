@echo off 

set "NSSM_PATH=%~dp0nssm\nssm.exe"
set "STOP_CLIENT_BAT=%SCRIPTDIR%stopClient.bat"
set "STOP_SERVER_BAT=%SCRIPTDIR%stopServer.bat"

:: stop service
call "%STOP_SERVER_BAT%"

:: kill gui
call "%STOP_CLIENT_BAT%"

exit