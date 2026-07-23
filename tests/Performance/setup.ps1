#!/usr/bin/env pwsh

# Script de setup para testes K6 - InovaTech
# Instala K6 e prepara ambiente de testes

Write-Host "🛠️ SETUP TESTES K6 - INOVATECH" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host ""

# Verificar se já tem K6 instalado
if (Get-Command "k6" -ErrorAction SilentlyContinue) {
    $k6Version = k6 version
    Write-Host "✅ K6 já está instalado: $k6Version" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "📦 K6 não encontrado. Instalando..." -ForegroundColor Blue
    
    # Verificar se tem Chocolatey
    if (Get-Command "choco" -ErrorAction SilentlyContinue) {
        Write-Host "   Instalando via Chocolatey..." -ForegroundColor Blue
        choco install k6 -y
    }
    # Verificar se tem Scoop
    elseif (Get-Command "scoop" -ErrorAction SilentlyContinue) {
        Write-Host "   Instalando via Scoop..." -ForegroundColor Blue
        scoop install k6
    }
    # Instalação manual
    else {
        Write-Host "   ⚠️ Chocolatey e Scoop não encontrados." -ForegroundColor Yellow
        Write-Host "   Por favor, instale o K6 manualmente:" -ForegroundColor Yellow
        Write-Host "   1. Baixe de: https://github.com/grafana/k6/releases" -ForegroundColor Cyan
        Write-Host "   2. Ou instale Chocolatey: https://chocolatey.org/install" -ForegroundColor Cyan
        Write-Host "   3. Ou instale Scoop: https://scoop.sh/" -ForegroundColor Cyan
        exit 1
    }
    
    # Verificar se instalação foi bem-sucedida
    if (Get-Command "k6" -ErrorAction SilentlyContinue) {
        $k6Version = k6 version
        Write-Host "✅ K6 instalado com sucesso: $k6Version" -ForegroundColor Green
    } else {
        Write-Host "❌ Falha na instalação do K6" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🔍 Verificando estrutura do projeto..." -ForegroundColor Blue

# Verificar se estamos na pasta correta
if (!(Test-Path "package.json")) {
    Write-Host "❌ package.json não encontrado!" -ForegroundColor Red
    Write-Host "   Execute este script na pasta tests/Performance/" -ForegroundColor Yellow
    exit 1
}

# Verificar se pasta tests existe
if (!(Test-Path "tests")) {
    Write-Host "📁 Criando pasta tests..." -ForegroundColor Blue
    New-Item -ItemType Directory -Name "tests" -Force
}

# Verificar se pasta utils existe  
if (!(Test-Path "utils")) {
    Write-Host "📁 Criando pasta utils..." -ForegroundColor Blue
    New-Item -ItemType Directory -Name "utils" -Force
}

# Verificar se pasta config existe
if (!(Test-Path "config")) {
    Write-Host "📁 Criando pasta config..." -ForegroundColor Blue
    New-Item -ItemType Directory -Name "config" -Force
}

# Verificar se pasta reports existe
if (!(Test-Path "reports")) {
    Write-Host "📁 Criando pasta reports..." -ForegroundColor Blue
    New-Item -ItemType Directory -Name "reports" -Force
}

Write-Host "✅ Estrutura do projeto verificada!" -ForegroundColor Green
Write-Host ""

# Verificar conectividade com serviços
Write-Host "🌐 Verificando conectividade com serviços..." -ForegroundColor Blue

$apiUrl = "http://localhost:5000"
$frontendUrl = "http://localhost:5173"

Write-Host "   Testando API Backend ($apiUrl)..." -ForegroundColor Gray
try {
    $apiCheck = Invoke-WebRequest -Uri "$apiUrl/clientes" -Method GET -TimeoutSec 5
    Write-Host "   ✅ API Backend acessível" -ForegroundColor Green
} catch {
    Write-Host "   ❌ API Backend não acessível" -ForegroundColor Red
    Write-Host "      Para iniciar: cd ..\..\APP && mvn spring-boot:run" -ForegroundColor Yellow
}

Write-Host "   Testando Frontend ($frontendUrl)..." -ForegroundColor Gray
try {
    $frontendCheck = Invoke-WebRequest -Uri $frontendUrl -Method GET -TimeoutSec 5
    Write-Host "   ✅ Frontend acessível" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Frontend não acessível" -ForegroundColor Red
    Write-Host "      Para iniciar: cd ..\..\FrontEnd && npm install && npm run dev" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 LISTA DE TESTES DISPONÍVEIS:" -ForegroundColor Cyan
Write-Host ""

$testFiles = Get-ChildItem -Path "tests" -Name "*.js" | Sort-Object
$testCount = 0

foreach ($file in $testFiles) {
    $testCount++
    $testName = ($file -replace '\.js$', '') -replace '-', ' ' | ForEach-Object { (Get-Culture).TextInfo.ToTitleCase($_) }
    
    switch ($file) {
        "health-check.js" { 
            Write-Host "   $testCount. Health Check (30s) - Verificação básica de conectividade" -ForegroundColor White
        }
        "api-crud-test.js" { 
            Write-Host "   $testCount. API CRUD Test (3m) - Operações completas da API" -ForegroundColor White
        }
        "load-test.js" { 
            Write-Host "   $testCount. Load Test (5m) - Carga normal de usuários" -ForegroundColor White
        }
        "stress-test.js" { 
            Write-Host "   $testCount. Stress Test (29m) - Teste de estresse progressivo" -ForegroundColor White
        }
        "spike-test.js" { 
            Write-Host "   $testCount. Spike Test (6m) - Picos súbitos de tráfego" -ForegroundColor White
        }
        "volume-test.js" { 
            Write-Host "   $testCount. Volume Test (12m) - Grande volume de dados" -ForegroundColor White
        }
        "soak-test.js" { 
            Write-Host "   $testCount. Soak Test (1h10m) - Resistência prolongada" -ForegroundColor White
        }
        "breakpoint-test.js" { 
            Write-Host "   $testCount. Breakpoint Test (45m) - Ponto de ruptura" -ForegroundColor White
        }
        "frontend-test.js" { 
            Write-Host "   $testCount. Frontend Test (5m) - Performance da interface" -ForegroundColor White
        }
        default { 
            Write-Host "   $testCount. $testName" -ForegroundColor White
        }
    }
}

Write-Host ""
Write-Host "🚀 COMO EXECUTAR OS TESTES:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Teste individual:" -ForegroundColor White
Write-Host "   k6 run tests/health-check.js" -ForegroundColor Gray
Write-Host ""
Write-Host "   Via NPM scripts:" -ForegroundColor White
Write-Host "   npm run test:health" -ForegroundColor Gray
Write-Host "   npm run test:load" -ForegroundColor Gray
Write-Host "   npm run test:all" -ForegroundColor Gray
Write-Host ""
Write-Host "   Via script PowerShell:" -ForegroundColor White
Write-Host "   .\run-all-tests.ps1" -ForegroundColor Gray
Write-Host ""

Write-Host "💡 DICAS IMPORTANTES:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   📊 Monitoramento recomendado durante os testes:" -ForegroundColor White
Write-Host "   - Task Manager / Resource Monitor (CPU, RAM)" -ForegroundColor Gray
Write-Host "   - Logs da aplicação (console do backend/frontend)" -ForegroundColor Gray
Write-Host "   - Conexões de banco de dados" -ForegroundColor Gray
Write-Host ""
Write-Host "   ⚠️ Testes que podem impactar o sistema:" -ForegroundColor White
Write-Host "   - Stress Test (alta carga por 29 minutos)" -ForegroundColor Gray
Write-Host "   - Soak Test (1 hora de teste contínuo)" -ForegroundColor Gray
Write-Host "   - Breakpoint Test (busca ponto de ruptura)" -ForegroundColor Gray
Write-Host ""
Write-Host "   🔧 Para melhores resultados:" -ForegroundColor White
Write-Host "   - Execute em ambiente dedicado (não use a máquina para outras tarefas)" -ForegroundColor Gray
Write-Host "   - Feche outros aplicativos que consomem recursos" -ForegroundColor Gray
Write-Host "   - Execute testes em horários de baixo uso de rede" -ForegroundColor Gray
Write-Host ""

# Perguntar se quer executar teste básico
Write-Host "🧪 Deseja executar um teste básico para verificar se tudo está funcionando? (y/N)" -ForegroundColor Blue
$runTest = Read-Host

if ($runTest -eq 'y' -or $runTest -eq 'Y') {
    Write-Host ""
    Write-Host "🏥 Executando Health Check..." -ForegroundColor Blue
    
    if (Test-Path "tests/health-check.js") {
        k6 run tests/health-check.js
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Teste básico executado com sucesso!" -ForegroundColor Green
            Write-Host "🎉 Ambiente K6 está pronto para uso!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "❌ Teste básico apresentou problemas." -ForegroundColor Red
            Write-Host "   Verifique se os serviços estão rodando e tente novamente." -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Arquivo health-check.js não encontrado!" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "✅ Setup concluído!" -ForegroundColor Green
    Write-Host "🚀 Você pode executar os testes quando quiser usando:" -ForegroundColor Blue
    Write-Host "   .\run-all-tests.ps1" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📚 RECURSOS ADICIONAIS:" -ForegroundColor Cyan
Write-Host "   - Documentação K6: https://k6.io/docs/" -ForegroundColor Gray
Write-Host "   - Exemplos K6: https://k6.io/docs/examples/" -ForegroundColor Gray
Write-Host "   - README do projeto: README.md" -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 Bom treinamento com K6!" -ForegroundColor Green