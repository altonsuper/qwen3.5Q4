@echo off
title Universal Agent Core
color 0D
set OLLAMA_NUM_PARALLEL=1
set OLLAMA_NUM_THREADS=2

echo 🚀 Starting Universal Agent...
echo 📂 Config: config_coder.json | Project: project1

curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 ( echo ❌ Ollama not running! & pause & exit /b )

echo 🔥 Warming up Qwen...
curl -s http://localhost:11434/api/chat -d "{\"model\":\"qwen3.5:0.8b\",\"messages\":[{\"role\":\"user\",\"content\":\"Hi\"}]}" >nul
echo ✅ Ready.

node agent_core.js config_coder.json project1
pause