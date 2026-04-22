$ErrorActionPreference = "Continue"
$env:OLLAMA_NUM_PARALLEL = 1
$env:OLLAMA_NUM_THREADS = 2

Write-Host "🚀 Universal Agent Core [PowerShell]" -ForegroundColor Cyan
Write-Host "📂 Config: config_coder.json | Target: project1`n"

try {
    Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -UseBasicParsing -TimeoutSec 3 | Out-Null
    Write-Host "✅ Ollama active" -ForegroundColor Green
} catch { Write-Host "❌ Ollama not running" -ForegroundColor Red; pause; exit }

Write-Host "🔥 Warming up..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "http://localhost:11434/api/chat" -Method POST -Body (@{
        model = "qwen3.5:0.8b"; messages = @(@{role="user"; content="Hi"})
    } | ConvertTo-Json) -UseBasicParsing | Out-Null
    Write-Host "✅ Qwen ready`n" -ForegroundColor Green
} catch { Write-Host "⚠️ Warmup skipped`n" -ForegroundColor Yellow }

& node "$PSScriptRoot\agent_core.js" "config_coder.json" "project1"

Write-Host "`n⚠️ Done. Press any key..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")