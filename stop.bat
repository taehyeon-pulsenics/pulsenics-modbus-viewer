@echo off

set "STOP_CLIENT_BAT=%~dp0stopClient.bat"
set "STOP_SERVER_BAT=%~dp0stopServer.bat"

:: stop service
call "%STOP_SERVER_BAT%"

:: kill gui
call "%STOP_CLIENT_BAT%"

exit
