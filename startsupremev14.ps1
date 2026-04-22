# start.ps1 - Supreme Master Agent Launcher
$ErrorActionPreference = "Continue"
$env:OLLAMA_NUM_PARALLEL = 1

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  👑 Supreme Master Agent [PowerShell]" -ForegroundColor Cyan
Write-Host "  Root: C:\ALLAI\ANY\real" -ForegroundColor Cyan
Write-Host "========================================================`n"

# Check Ollama
try {
    Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -UseBasicParsing -TimeoutSec 3 | Out-Null
    Write-Host "✅ Ollama active" -ForegroundColor Green
} catch {
    Write-Host "❌ Ollama not running" -ForegroundColor Red; pause; exit
}

# Warmup (optional)
Write-Host "🔥 Warming up Qwen..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "http://localhost:11434/api/chat" -Method POST -Body (@{
        model = "qwen3.5:0.8b"
        messages = @(@{role="user"; content="Hi"})
    } | ConvertTo-Json) -UseBasicParsing | Out-Null
    Write-Host "✅ Qwen ready`n" -ForegroundColor Green
} catch { Write-Host "⚠️  Warmup skipped`n" -ForegroundColor Yellow }

# Run Agent
Write-Host "⚡ Starting Agent..." -ForegroundColor Cyan
& node "$PSScriptRoot\suprememaster.js" "project1"

Write-Host "`n⚠️  Done. Press any key..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")