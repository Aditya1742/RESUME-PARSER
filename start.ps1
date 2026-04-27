# Resume Parser - Full Stack Startup Script
# Usage: .\start.ps1

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Resume Parser - Full Stack Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Start Backend
Write-Host "`n[1/2] Starting Python Backend..." -ForegroundColor Green
$backendPath = Join-Path $PSScriptRoot "backend"
$venvPath = Join-Path $backendPath ".venv"

# Create virtual environment if it doesn't exist
if (-not (Test-Path $venvPath)) {
    Write-Host "  Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv $venvPath
}

# Install dependencies
$pip = Join-Path $venvPath "Scripts\pip.exe"
$python = Join-Path $venvPath "Scripts\python.exe"

Write-Host "  Installing backend dependencies..." -ForegroundColor Yellow
& $pip install -r (Join-Path $backendPath "requirements.txt") | Out-Null

# Check for spaCy model
& $python -m spacy info en_core_web_sm 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Downloading spaCy model (en_core_web_sm)..." -ForegroundColor Yellow
    & $python -m spacy download en_core_web_sm
}

# Start Flask backend in new window
$flaskApp = Join-Path $backendPath "app.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$backendPath`"; & `"$python`" `"$flaskApp`"" -WindowStyle Normal
Write-Host "  Backend started at http://localhost:5000" -ForegroundColor Green

# Start Frontend
Write-Host "`n[2/2] Starting React Frontend..." -ForegroundColor Green
$frontendPath = Join-Path $PSScriptRoot "frontend"

# Install frontend dependencies if needed
if (-not (Test-Path (Join-Path $frontendPath "node_modules"))) {
    Write-Host "  Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location $frontendPath
    npm install
    Set-Location $PSScriptRoot
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$frontendPath`"; npm run dev" -WindowStyle Normal
Write-Host "  Frontend started at http://localhost:5173" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   All services started successfully!" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nPress any key to exit this window (services will keep running)..."
[void][System.Console]::ReadKey($true)

