@echo off
setlocal

set "SCRIPT_DIR=%~dp0"

call "%SCRIPT_DIR%startServer.bat"
call "%SCRIPT_DIR%startClient.bat"

endlocal
