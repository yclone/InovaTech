#!/usr/bin/env pwsh
# Script de configuração inicial para testes mobile
# Autor: InovaTech Team
# Uso: .\setup-inicial.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   Configuração Inicial" -ForegroundColor Cyan
Write-Host "   Testes Mobile - InovaTech" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$step = 1

# Passo 1: Verificar Node.js
Write-Host "[$step/6] Verificando Node.js..." -ForegroundColor Yellow
if (Get-Command "node" -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "      ✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "      ❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "      Instale em: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
$step++

# Passo 2: Instalar dependências
Write-Host "`n[$step/6] Instalando dependências do npm..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "      ✅ Dependências instaladas com sucesso" -ForegroundColor Green
} catch {
    Write-Host "      ❌ Erro ao instalar dependências" -ForegroundColor Red
    Write-Host "      Execute manualmente: npm install" -ForegroundColor Yellow
    exit 1
}
$step++

# Passo 3: Configurar arquivo .env
Write-Host "`n[$step/6] Configurando arquivo .env..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "      ⚠️  Arquivo .env já existe" -ForegroundColor Yellow
    $resposta = Read-Host "      Deseja sobrescrever? (s/N)"
    if ($resposta -eq "s" -or $resposta -eq "S") {
        Copy-Item ".env.example" ".env" -Force
        Write-Host "      ✅ Arquivo .env sobrescrito" -ForegroundColor Green
    } else {
        Write-Host "      ℹ️  Mantendo .env existente" -ForegroundColor Cyan
    }
} else {
    Copy-Item ".env.example" ".env"
    Write-Host "      ✅ Arquivo .env criado a partir do .env.example" -ForegroundColor Green
}
$step++

# Passo 4: Verificar APK
Write-Host "`n[$step/6] Verificando APK..." -ForegroundColor Yellow
$apkPath = Join-Path $PSScriptRoot "APK\app-debug.apk"
if (Test-Path $apkPath) {
    $apkSize = (Get-Item $apkPath).Length / 1MB
    Write-Host "      ✅ APK encontrado ($([math]::Round($apkSize, 2)) MB)" -ForegroundColor Green
} else {
    Write-Host "      ⚠️  APK não encontrado em: $apkPath" -ForegroundColor Yellow
    Write-Host "      Certifique-se de ter o APK antes de executar os testes" -ForegroundColor Yellow
}
$step++

# Passo 5: Verificar Appium
Write-Host "`n[$step/6] Verificando Appium..." -ForegroundColor Yellow
if (Get-Command "appium" -ErrorAction SilentlyContinue) {
    $appiumVersion = appium --version
    Write-Host "      ✅ Appium encontrado: v$appiumVersion" -ForegroundColor Green
} else {
    Write-Host "      ⚠️  Appium não encontrado" -ForegroundColor Yellow
    Write-Host "      Instale com: npm install -g appium" -ForegroundColor Yellow
    Write-Host "      Em seguida: appium driver install uiautomator2" -ForegroundColor Yellow
}
$step++

# Passo 6: Verificar Android SDK
Write-Host "`n[$step/6] Verificando Android SDK..." -ForegroundColor Yellow
if ($env:ANDROID_HOME) {
    Write-Host "      ✅ ANDROID_HOME configurado: $env:ANDROID_HOME" -ForegroundColor Green
    
    # Verificar ADB
    if (Get-Command "adb" -ErrorAction SilentlyContinue) {
        Write-Host "      ✅ ADB disponível" -ForegroundColor Green
    } else {
        Write-Host "      ⚠️  ADB não encontrado no PATH" -ForegroundColor Yellow
        Write-Host "      Adicione ao PATH: `$env:ANDROID_HOME\platform-tools" -ForegroundColor Yellow
    }
} else {
    Write-Host "      ❌ ANDROID_HOME não configurado" -ForegroundColor Red
    Write-Host "      Configure para o diretório do Android SDK" -ForegroundColor Yellow
}

# Resumo final
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   Configuração Concluída!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📝 Próximos passos:`n" -ForegroundColor Cyan

Write-Host "1. Execute a verificação completa de pré-requisitos:" -ForegroundColor White
Write-Host "   .\verificar-pre-requisitos.ps1`n" -ForegroundColor Yellow

Write-Host "2. Configure o arquivo .env com suas preferências:" -ForegroundColor White
Write-Host "   notepad .env`n" -ForegroundColor Yellow

Write-Host "3. Certifique-se de que o Backend está rodando:" -ForegroundColor White
Write-Host "   cd ..\APP" -ForegroundColor Yellow
Write-Host "   mvn spring-boot:run`n" -ForegroundColor Yellow

Write-Host "4. Inicie o emulador Android:" -ForegroundColor White
Write-Host "   Android Studio > Device Manager > Play`n" -ForegroundColor Yellow

Write-Host "5. Execute os testes:" -ForegroundColor White
Write-Host "   npm run test:smoke`n" -ForegroundColor Yellow

Write-Host "📖 Para mais informações, consulte:" -ForegroundColor Cyan
Write-Host "   - PRE-REQUISITOS.md (guia completo)" -ForegroundColor White
Write-Host "   - README.md (documentação do projeto)`n" -ForegroundColor White

Write-Host "========================================`n" -ForegroundColor Cyan
