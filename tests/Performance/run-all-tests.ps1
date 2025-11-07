#!/usr/bin/env pwsh

# Script para executar todos os testes de performance K6 - InovaTech
# Uso: ./run-all-tests.ps1

Write-Host "🚀 INICIANDO BATERIA COMPLETA DE TESTES K6 - INOVATECH" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

# Verificar se K6 está instalado
if (!(Get-Command "k6" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ K6 não encontrado! Instale o K6 primeiro:" -ForegroundColor Red
    Write-Host "   - Windows: choco install k6 ou scoop install k6" -ForegroundColor Yellow
    Write-Host "   - Ou baixe de: https://k6.io/docs/get-started/installation/" -ForegroundColor Yellow
    exit 1
}

# Verificar se os serviços estão rodando
Write-Host "🔍 Verificando se os serviços estão rodando..." -ForegroundColor Blue

$apiUrl = "http://localhost:5000"
$frontendUrl = "http://localhost:5173"

try {
    $apiCheck = Invoke-WebRequest -Uri "$apiUrl/clientes" -Method GET -TimeoutSec 5
    Write-Host "✅ API Backend está rodando em $apiUrl" -ForegroundColor Green
} catch {
    Write-Host "❌ API Backend NÃO está rodando em $apiUrl" -ForegroundColor Red
    Write-Host "   Inicie o backend com: cd APP && mvn spring-boot:run" -ForegroundColor Yellow
    Write-Host "   Ou continue apenas com testes que não dependem da API? (y/N)" -ForegroundColor Yellow
    $continue = Read-Host
    if ($continue -ne 'y' -and $continue -ne 'Y') {
        exit 1
    }
}

try {
    $frontendCheck = Invoke-WebRequest -Uri $frontendUrl -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend está rodando em $frontendUrl" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend NÃO está rodando em $frontendUrl" -ForegroundColor Red
    Write-Host "   Inicie o frontend com: cd FrontEnd && npm run dev" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 BATERIA DE TESTES DISPONÍVEIS:" -ForegroundColor Cyan
Write-Host "1. Health Check (30s) - Verificação básica"
Write-Host "2. API CRUD Tests (3m) - Operações da API"
Write-Host "3. Load Test (5m) - Carga normal"
Write-Host "4. Stress Test (29m) - Teste de estresse"
Write-Host "5. Spike Test (6m) - Picos de tráfego"
Write-Host "6. Volume Test (12m) - Grande volume de dados"
Write-Host "7. Soak Test (1h10m) - Resistência prolongada"
Write-Host "8. Breakpoint Test (45m) - Ponto de ruptura"
Write-Host "9. Frontend Test (5m) - Performance da interface"
Write-Host ""

$choice = Read-Host "Digite o número do teste (1-9), 'all' para todos, ou 'quick' para testes rápidos (1,2,3)"

switch ($choice) {
    "1" {
        Write-Host "🏥 Executando Health Check..." -ForegroundColor Blue
        k6 run tests/health-check.js
    }
    "2" {
        Write-Host "🔧 Executando API CRUD Tests..." -ForegroundColor Blue
        k6 run tests/api-crud-test.js
    }
    "3" {
        Write-Host "📊 Executando Load Test..." -ForegroundColor Blue
        k6 run tests/load-test.js
    }
    "4" {
        Write-Host "💪 Executando Stress Test..." -ForegroundColor Blue
        k6 run tests/stress-test.js
    }
    "5" {
        Write-Host "⚡ Executando Spike Test..." -ForegroundColor Blue
        k6 run tests/spike-test.js
    }
    "6" {
        Write-Host "🗄️ Executando Volume Test..." -ForegroundColor Blue
        k6 run tests/volume-test.js
    }
    "7" {
        Write-Host "🕐 Executando Soak Test (1 HORA!)..." -ForegroundColor Blue
        Write-Host "   ⚠️ Este teste demora 1 hora! Tem certeza? (y/N)" -ForegroundColor Yellow
        $confirm = Read-Host
        if ($confirm -eq 'y' -or $confirm -eq 'Y') {
            k6 run tests/soak-test.js
        } else {
            Write-Host "Teste cancelado." -ForegroundColor Yellow
        }
    }
    "8" {
        Write-Host "💥 Executando Breakpoint Test..." -ForegroundColor Blue
        Write-Host "   ⚠️ Este teste pode sobrecarregar o sistema! Tem certeza? (y/N)" -ForegroundColor Yellow
        $confirm = Read-Host
        if ($confirm -eq 'y' -or $confirm -eq 'Y') {
            k6 run tests/breakpoint-test.js
        } else {
            Write-Host "Teste cancelado." -ForegroundColor Yellow
        }
    }
    "9" {
        Write-Host "🌐 Executando Frontend Test..." -ForegroundColor Blue
        Write-Host "   ⚠️ Requer K6 Browser extension. Continuar? (y/N)" -ForegroundColor Yellow
        $confirm = Read-Host
        if ($confirm -eq 'y' -or $confirm -eq 'Y') {
            k6 run tests/frontend-test.js
        } else {
            Write-Host "Teste cancelado." -ForegroundColor Yellow
        }
    }
    "quick" {
        Write-Host "🚀 Executando testes rápidos (Health + CRUD + Load)..." -ForegroundColor Blue
        
        Write-Host "`n1/3 - Health Check..." -ForegroundColor Cyan
        k6 run tests/health-check.js
        
        Write-Host "`n2/3 - API CRUD Tests..." -ForegroundColor Cyan
        k6 run tests/api-crud-test.js
        
        Write-Host "`n3/3 - Load Test..." -ForegroundColor Cyan
        k6 run tests/load-test.js
        
        Write-Host "`n✅ Testes rápidos concluídos!" -ForegroundColor Green
    }
    "all" {
        Write-Host "🔥 Executando TODOS os testes..." -ForegroundColor Blue
        Write-Host "   ⚠️ Isso vai demorar mais de 3 horas! Tem certeza? (y/N)" -ForegroundColor Red
        $confirm = Read-Host
        if ($confirm -eq 'y' -or $confirm -eq 'Y') {
            
            $tests = @(
                @{name="Health Check"; file="health-check.js"; duration="30s"},
                @{name="API CRUD Tests"; file="api-crud-test.js"; duration="3m"},
                @{name="Load Test"; file="load-test.js"; duration="5m"},
                @{name="Stress Test"; file="stress-test.js"; duration="29m"},
                @{name="Spike Test"; file="spike-test.js"; duration="6m"},
                @{name="Volume Test"; file="volume-test.js"; duration="12m"},
                @{name="Soak Test"; file="soak-test.js"; duration="1h10m"},
                @{name="Breakpoint Test"; file="breakpoint-test.js"; duration="45m"}
            )
            
            $totalTests = $tests.Count
            $currentTest = 0
            
            foreach ($test in $tests) {
                $currentTest++
                Write-Host "`n[$currentTest/$totalTests] Executando $($test.name) ($($test.duration))..." -ForegroundColor Cyan
                k6 run "tests/$($test.file)"
                
                if ($LASTEXITCODE -ne 0) {
                    Write-Host "❌ Erro no teste $($test.name)" -ForegroundColor Red
                    Write-Host "Continuar com próximo teste? (y/N)" -ForegroundColor Yellow
                    $continue = Read-Host
                    if ($continue -ne 'y' -and $continue -ne 'Y') {
                        break
                    }
                }
                
                # Pausa entre testes para permitir recuperação do sistema
                if ($currentTest -lt $totalTests) {
                    Write-Host "⏸️ Pausa de 30s para recuperação do sistema..." -ForegroundColor Yellow
                    Start-Sleep -Seconds 30
                }
            }
            
            Write-Host "`n🎉 Bateria completa de testes concluída!" -ForegroundColor Green
        } else {
            Write-Host "Execução completa cancelada." -ForegroundColor Yellow
        }
    }
    default {
        Write-Host "❌ Opção inválida!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n✅ Execução concluída!" -ForegroundColor Green
Write-Host "📊 Verifique os resultados acima para análise de performance." -ForegroundColor Blue