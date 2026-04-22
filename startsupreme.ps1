# startsupreme.ps1
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  👑 Launching Supreme Master Agent" -ForegroundColor Cyan
Write-Host "  Root: C:\ALLAI\ANY\real" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Check Ollama using curl
Write-Host "🔍 Checking Ollama connection..." -ForegroundColor Gray
try {
    $response = curl -s http://localhost:11434/api/tags
    if ($response -match "models") {
        Write-Host "✅ Ollama is active and ready." -ForegroundColor Green
    } else {
        throw "Invalid response"
    }
} catch {
    Write-Host "❌ Ollama is not responding." -ForegroundColor Red
    Write-Host "💡 Is Ollama Desktop running?" -ForegroundColor Yellow
    Pause
    exit
}

Write-Host ""
Write-Host "⚡ Starting Master Agent..." -ForegroundColor Yellow
Write-Host ""

# Run the Node.js script (This is where the real AI logic lives)
node suprememaster.js

Write-Host ""
Write-Host "Session Ended." -ForegroundColor Gray
Pause