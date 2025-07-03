@echo off
setlocal enabledelayedexpansion

rem — Use the “python” on PATH
set "PY=python"

rem — Clean out old builds
if exist dist (
    rmdir /S /Q dist
)
if exist temp_src (
    rmdir /S /Q temp_src
)

rem - activate venv
echo Activating Virtual Environemnt...
call .\venv\Scripts\activate

rem — Create dist/ and install dependencies into it
echo Installing dependencies into dist\...
mkdir dist
%PY% -m pip install -r requirements.txt --target dist

rem — Obfuscate all of src/ into a temp folder
echo Obfuscating source...
pyarmor gen --recursive --output temp_src src

rem — Copy obfuscated code into dist/
echo Copying obfuscated code into dist\...
xcopy "temp_src\src\*" dist\ /E /I /Y >nul

rem — Copy the PyArmor runtime folder into dist/
echo Copying PyArmor runtime into dist\...
xcopy "temp_src\pyarmor_runtime_000000" "dist\pyarmor_runtime_000000\" /E /I /Y >nul

rem - remove temp_src
echo Removing temp_src
rmdir /S /Q temp_src

echo.
echo Build complete!  You can now distribute the dist folder.
echo Run with: python dist\main.py
pause
