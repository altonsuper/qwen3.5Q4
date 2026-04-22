@echo off
title Supreme Master System
color 0A
echo ========================================================
echo   👑 LAUNCHING SUPREME MASTER SYSTEM
echo   Root: C:\ALLAI\ANY\real
echo ========================================================
echo.
echo [1/3] Checking Ollama Core...
ollama list >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama not found! Please install Ollama.com
    pause
    exit
)
echo ✅ Ollama Core Active.

echo.
echo [2/3] Warming up Qwen 3.5 (0.8b)...
start /B ollama run qwen3.5:0.8b ""
timeout /t 3 /nobreak >nul
echo ✅ Qwen is Awake.

echo.
echo [3/3] Launching Supreme Master Agent...
echo.
node suprememaster.js

pause