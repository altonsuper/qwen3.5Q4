@echo off
title Qwen 3.5 Local Chat
color 0A

echo ========================================================
echo   🚀 Launching Qwen 3.5 (0.8b)
echo   Path: C:\ALLAI\ANY\real
echo ========================================================
echo.

REM Check if Ollama is running
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama is not running. Please start Ollama Desktop.
    pause
    exit /b
)

echo ✅ Ollama is ready.
echo ⚡ Starting Node.js Chat Interface...
echo.

node clean-chat.js

pause