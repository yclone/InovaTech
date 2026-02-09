#!/usr/bin/env pwsh
# Script para executar testes individuais
# Uso: .\run-individual-tests.ps1

Write-Host "🧪 Executando testes individuais do InovaTech Mobile" -ForegroundColor Cyan
Write-Host ""

$config = "./app/android/wdio.conf.android.js"
$specsDir = "./specs/individual"
$failedTests = @()
$passedTests = @()

# Lista de testes
$tests = @(
    @{Name="Elementos Visíveis"; File="test-elementos-visiveis.spec.js"},
    @{Name="Preencher Campos"; File="test-preencher-campos.spec.js"},
    @{Name="Botão Entrar"; File="test-botao-entrar.spec.js"},
    @{Name="Link Criar Conta"; File="test-criar-conta.spec.js"}
)

foreach ($test in $tests) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "▶️  Teste: $($test.Name)" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host ""
    
    $specPath = "$specsDir/$($test.File)"
    
    # Executa o teste
    npx wdio $config --spec $specPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $($test.Name) - PASSOU" -ForegroundColor Green
        $passedTests += $test.Name
    } else {
        Write-Host "❌ $($test.Name) - FALHOU" -ForegroundColor Red
        $failedTests += $test.Name
    }
    
    Write-Host ""
    
    # Pausa entre testes para estabilizar
    if ($test -ne $tests[-1]) {
        Write-Host "⏱️  Aguardando 3 segundos antes do próximo teste..." -ForegroundColor Gray
        Start-Sleep -Seconds 3
    }
}

# Resumo final
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 RESUMO DOS TESTES INDIVIDUAIS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Testes que passaram: $($passedTests.Count)" -ForegroundColor Green
foreach ($test in $passedTests) {
    Write-Host "   • $test" -ForegroundColor Green
}
Write-Host ""
Write-Host "❌ Testes que falharam: $($failedTests.Count)" -ForegroundColor Red
foreach ($test in $failedTests) {
    Write-Host "   • $test" -ForegroundColor Red
}
Write-Host ""
Write-Host "📈 Taxa de sucesso: $([math]::Round(($passedTests.Count / $tests.Count) * 100, 2))%" -ForegroundColor Cyan
Write-Host ""

if ($failedTests.Count -eq 0) {
    Write-Host "🎉 Todos os testes passaram!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  Alguns testes falharam. Veja os detalhes acima." -ForegroundColor Yellow
    exit 1
}
