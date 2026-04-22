@echo off
title Stop Qwen Session
color 0C

echo ========================================================
echo   🛑 STOPPING Local Qwen Session
echo ========================================================
echo.

REM Kill any running node.exe processes
taskkill /F /IM node.exe >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ Qwen session terminated successfully.
) else (
    echo ⚠️ No active Qwen session found (or already stopped).
)

echo.
echo Press any key to close...
pause >nul