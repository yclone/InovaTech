# InovaTech Frontend - Setup Script
# Execute com: .\setup.ps1

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  InovaTech Frontend - Setup Automatico" -ForegroundColor Cyan  
Write-Host "=======================================" -ForegroundColor Cyan

Write-Host "`n1. Verificando Node.js..." -ForegroundColor Blue
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCheck) {
    $nodeVersion = node --version
    Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "Node.js nao encontrado! Instale em: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host "`n2. Verificando npm..." -ForegroundColor Blue
$npmCheck = Get-Command npm -ErrorAction SilentlyContinue
if ($npmCheck) {
    $npmVersion = npm --version
    Write-Host "npm encontrado: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "npm nao encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host "`n3. Instalando dependencias..." -ForegroundColor Blue
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "Dependencias instaladas com sucesso!" -ForegroundColor Green
} else {
    Write-Host "Erro ao instalar dependencias!" -ForegroundColor Red
    exit 1
}

Write-Host "`n4. Configurando ambiente..." -ForegroundColor Blue
if (!(Test-Path ".env.local")) {
    Copy-Item ".env.example" ".env.local"
    Write-Host "Arquivo .env.local criado" -ForegroundColor Green
} else {
    Write-Host ".env.local ja existe" -ForegroundColor Yellow
}

Write-Host "`n5. Verificando backend..." -ForegroundColor Blue
try {
    $null = Invoke-WebRequest -Uri "http://localhost:5000/api/hello" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Backend encontrado em http://localhost:5000" -ForegroundColor Green
} catch {
    Write-Host "Backend nao encontrado em http://localhost:5000" -ForegroundColor Yellow
    Write-Host "Certifique-se de iniciar o backend antes de usar o frontend" -ForegroundColor Yellow
}

Write-Host "`n=======================================" -ForegroundColor Green
Write-Host "  Setup concluido com sucesso!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

Write-Host "`nProximos passos:" -ForegroundColor Blue
Write-Host "1. npm run dev - Inicia servidor de desenvolvimento" -ForegroundColor White
Write-Host "2. Acesse http://localhost:5173 no navegador" -ForegroundColor White
Write-Host "3. Certifique-se que o backend esta em http://localhost:5000" -ForegroundColor White

Write-Host "`nComandos uteis:" -ForegroundColor Blue
Write-Host "npm run build - Build de producao" -ForegroundColor White
Write-Host "npm run preview - Visualiza build de producao" -ForegroundColor White