@echo off
title Supreme Master Agent v14.1 [Optimized]
color 0D

:: OPTIMIZATION: Limit Ollama parallel requests
set OLLAMA_NUM_PARALLEL=1

:: OUTPUT DESTINATION: project1 (default) or output
set SUPREME_OUTPUT_TARGET=project1

echo ========================================================
echo   👑 Launching Supreme Master Agent [OPTIMIZED]
echo   Root: C:\ALLAI\ANY\real
echo   Target: %SUPREME_OUTPUT_TARGET%
echo   CPU Threads: 2 | Parallel: 1
echo ========================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH.
    echo    Download from: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js found.

:: 2. Check if Ollama is running (simple check)
echo 🔍 Checking Ollama...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama is not running at http://localhost:11434
    echo    Please start Ollama first, then run this script again.
    pause
    exit /b 1
)
echo ✅ Ollama is active.

:: 3. Optional: Warm up model (skip if causes issues)
echo 🔥 Warming up Qwen 3.5 (0.8b)...
curl -s http://localhost:11434/api/chat -d "{\"model\":\"qwen3.5:0.8b\",\"messages\":[{\"role\":\"user\",\"content\":\"Hi\"}]}" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Qwen is awake!
) else (
    echo ⚠️  Warmup skipped (non-critical).
)
echo.

:: 4. Start the Agent
echo ⚡ Starting Master Agent...
echo    Press Ctrl+C to stop.
echo.
node suprememaster.js %SUPREME_OUTPUT_TARGET%

:: 5. Final pause (only reached if node exits)
echo.
echo ⚠️  Agent exited. Press any key to close...
pause >nul