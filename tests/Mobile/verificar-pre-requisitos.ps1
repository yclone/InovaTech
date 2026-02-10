#!/usr/bin/env pwsh
# Script de verificação de pré-requisitos para testes mobile
# Autor: InovaTech Team
# Uso: .\verificar-pre-requisitos.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   Verificação de Pré-requisitos" -ForegroundColor Cyan
Write-Host "   Testes Mobile - InovaTech" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$erros = 0
$avisos = 0

# Função auxiliar para verificar comandos
function Test-Command {
    param($comando)
    try {
        Get-Command $comando -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# 1. Verificar Node.js
Write-Host "[1/10] Verificando Node.js..." -NoNewline
if (Test-Command "node") {
    $nodeVer = node --version
    Write-Host " ✅ OK ($nodeVer)" -ForegroundColor Green
} else {
    Write-Host " ❌ ERRO: Node.js não encontrado" -ForegroundColor Red
    Write-Host "        Instale em: https://nodejs.org/" -ForegroundColor Yellow
    $erros++
}

# 2. Verificar Java
Write-Host "[2/10] Verificando Java..." -NoNewline
if (Test-Command "java") {
    $javaVer = java -version 2>&1 | Select-String "version" | Select-Object -First 1
    Write-Host " ✅ OK" -ForegroundColor Green
    Write-Host "        $javaVer" -ForegroundColor Gray
} else {
    Write-Host " ❌ ERRO: Java não encontrado" -ForegroundColor Red
    Write-Host "        Instale JDK 11 ou superior" -ForegroundColor Yellow
    $erros++
}

# 3. Verificar Maven
Write-Host "[3/10] Verificando Maven..." -NoNewline
if (Test-Command "mvn") {
    $mvnVer = mvn --version | Select-String "Apache Maven" | Select-Object -First 1
    Write-Host " ✅ OK" -ForegroundColor Green
    Write-Host "        $mvnVer" -ForegroundColor Gray
} else {
    Write-Host " ❌ ERRO: Maven não encontrado" -ForegroundColor Red
    Write-Host "        Instale em: https://maven.apache.org/" -ForegroundColor Yellow
    $erros++
}

# 4. Verificar ANDROID_HOME
Write-Host "[4/10] Verificando ANDROID_HOME..." -NoNewline
if ($env:ANDROID_HOME) {
    Write-Host " ✅ OK" -ForegroundColor Green
    Write-Host "        Path: $env:ANDROID_HOME" -ForegroundColor Gray
} else {
    Write-Host " ❌ ERRO: Variável ANDROID_HOME não configurada" -ForegroundColor Red
    Write-Host "        Configure para o diretório do Android SDK" -ForegroundColor Yellow
    $erros++
}

# 5. Verificar ADB
Write-Host "[5/10] Verificando ADB..." -NoNewline
if (Test-Command "adb") {
    $adbVer = adb --version | Select-String "Version" | Select-Object -First 1
    Write-Host " ✅ OK" -ForegroundColor Green
    Write-Host "        $adbVer" -ForegroundColor Gray
} else {
    Write-Host " ❌ ERRO: ADB não encontrado" -ForegroundColor Red
    Write-Host "        Adicione %ANDROID_HOME%\platform-tools ao PATH" -ForegroundColor Yellow
    $erros++
}

# 6. Verificar Appium
Write-Host "[6/10] Verificando Appium..." -NoNewline
if (Test-Command "appium") {
    $appiumVer = appium --version
    Write-Host " ✅ OK (v$appiumVer)" -ForegroundColor Green
} else {
    Write-Host " ⚠️  AVISO: Appium não encontrado" -ForegroundColor Yellow
    Write-Host "        Instale com: npm install -g appium" -ForegroundColor Yellow
    $avisos++
}

# 7. Verificar dispositivo Android
Write-Host "[7/10] Verificando dispositivo Android..." -NoNewline
if (Test-Command "adb") {
    $devices = adb devices | Select-String "device$" | Where-Object { $_ -notmatch "List" }
    if ($devices) {
        Write-Host " ✅ OK" -ForegroundColor Green
        $devices | ForEach-Object { Write-Host "        $_" -ForegroundColor Gray }
    } else {
        Write-Host " ⚠️  AVISO: Nenhum dispositivo conectado" -ForegroundColor Yellow
        Write-Host "        Inicie o emulador Android" -ForegroundColor Yellow
        $avisos++
    }
}

# 8. Verificar APK
Write-Host "[8/10] Verificando APK..." -NoNewline
$apkPath = Join-Path $PSScriptRoot "APK\app-debug.apk"
if (Test-Path $apkPath) {
    $apkSize = (Get-Item $apkPath).Length / 1MB
    Write-Host " ✅ OK ($([math]::Round($apkSize, 2)) MB)" -ForegroundColor Green
} else {
    Write-Host " ❌ ERRO: APK não encontrado" -ForegroundColor Red
    Write-Host "        Esperado em: $apkPath" -ForegroundColor Yellow
    $erros++
}

# 9. Verificar node_modules
Write-Host "[9/10] Verificando dependências..." -NoNewline
$nodeModules = Join-Path $PSScriptRoot "node_modules"
if (Test-Path $nodeModules) {
    Write-Host " ✅ OK" -ForegroundColor Green
} else {
    Write-Host " ⚠️  AVISO: node_modules não encontrado" -ForegroundColor Yellow
    Write-Host "        Execute: npm install" -ForegroundColor Yellow
    $avisos++
}

# 10. Verificar Backend
Write-Host "[10/10] Verificando Backend..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
    Write-Host " ✅ OK (Backend rodando)" -ForegroundColor Green
} catch {
    Write-Host " ⚠️  AVISO: Backend não está rodando" -ForegroundColor Yellow
    Write-Host "        Inicie com: cd ..\APP && mvn spring-boot:run" -ForegroundColor Yellow
    $avisos++
}

# Resumo
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   Resumo da Verificação" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if ($erros -eq 0 -and $avisos -eq 0) {
    Write-Host "✅ Todos os pré-requisitos estão OK!" -ForegroundColor Green
    Write-Host "`nVocê está pronto para executar os testes:" -ForegroundColor Green
    Write-Host "   npm run test:smoke" -ForegroundColor White
} elseif ($erros -eq 0) {
    Write-Host "⚠️  Pré-requisitos básicos OK, mas há $avisos aviso(s)" -ForegroundColor Yellow
    Write-Host "`nResolva os avisos antes de executar os testes." -ForegroundColor Yellow
} else {
    Write-Host "❌ Encontrados $erros erro(s) e $avisos aviso(s)" -ForegroundColor Red
    Write-Host "`nResolva os erros antes de executar os testes." -ForegroundColor Red
    Write-Host "Consulte PRE-REQUISITOS.md para mais detalhes.`n" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
