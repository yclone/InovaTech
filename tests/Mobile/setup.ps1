# 🔄 Scripts de Setup

## Windows (PowerShell)

Write-Host "🚀 Configurando projeto InovaTech Mobile Tests..." -ForegroundColor Green

# 1. Verificar Node.js
Write-Host "`n📦 Verificando Node.js..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js não encontrado! Instale em: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# 2. Verificar Java
Write-Host "`n☕ Verificando Java..." -ForegroundColor Yellow
if (Get-Command java -ErrorAction SilentlyContinue) {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✅ Java instalado: $javaVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Java não encontrado! Configure JAVA_HOME" -ForegroundColor Red
    exit 1
}

# 3. Verificar ANDROID_HOME
Write-Host "`n📱 Verificando Android SDK..." -ForegroundColor Yellow
if ($env:ANDROID_HOME) {
    Write-Host "✅ ANDROID_HOME: $env:ANDROID_HOME" -ForegroundColor Green
} else {
    Write-Host "⚠️  ANDROID_HOME não configurado!" -ForegroundColor Yellow
    Write-Host "Configure em: Variáveis de Ambiente do Sistema" -ForegroundColor Yellow
}

# 4. Criar arquivo .env se não existir
Write-Host "`n⚙️  Configurando arquivo .env..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Arquivo .env criado! Edite com suas configurações." -ForegroundColor Green
} else {
    Write-Host "✅ Arquivo .env já existe" -ForegroundColor Green
}

# 5. Instalar dependências
Write-Host "`n📦 Instalando dependências..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}

# 6. Instalar driver UiAutomator2
Write-Host "`n🔧 Instalando driver UiAutomator2..." -ForegroundColor Yellow
npm run uiautomator2:install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Driver instalado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao instalar driver" -ForegroundColor Red
    exit 1
}

# 7. Criar estrutura de diretórios
Write-Host "`n📁 Criando estrutura de diretórios..." -ForegroundColor Yellow
$directories = @("reports", "reports/html-reports", "reports/screenshots", "logs")
foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  ✅ Criado: $dir" -ForegroundColor Green
    }
}

# 8. Verificar dispositivos Android
Write-Host "`n📱 Verificando dispositivos Android..." -ForegroundColor Yellow
if (Get-Command adb -ErrorAction SilentlyContinue) {
    $devices = adb devices | Select-String "device$"
    if ($devices) {
        Write-Host "✅ Dispositivos conectados:" -ForegroundColor Green
        adb devices
    } else {
        Write-Host "⚠️  Nenhum dispositivo conectado" -ForegroundColor Yellow
        Write-Host "   Inicie um emulador ou conecte um dispositivo" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  ADB não encontrado! Verifique ANDROID_HOME/platform-tools" -ForegroundColor Yellow
}

# 9. Verificar APK
Write-Host "`n📦 Verificando APK..." -ForegroundColor Yellow
$apkFiles = Get-ChildItem -Path "APK" -Filter "*.apk" -ErrorAction SilentlyContinue
if ($apkFiles) {
    Write-Host "✅ APK encontrado: $($apkFiles[0].Name)" -ForegroundColor Green
} else {
    Write-Host "⚠️  Nenhum APK encontrado na pasta APK/" -ForegroundColor Yellow
    Write-Host "   Adicione o arquivo APK do aplicativo" -ForegroundColor Yellow
}

# 10. Resumo
Write-Host "`n" + "="*60 -ForegroundColor Cyan
Write-Host "✅ Setup concluído!" -ForegroundColor Green
Write-Host "="*60 -ForegroundColor Cyan
Write-Host "`nPróximos passos:" -ForegroundColor Yellow
Write-Host "1. Edite o arquivo .env com suas configurações" -ForegroundColor White
Write-Host "2. Coloque o APK na pasta APK/" -ForegroundColor White
Write-Host "3. Inicie um emulador: emulator -avd <nome_avd>" -ForegroundColor White
Write-Host "4. Execute os testes: npm test" -ForegroundColor White
Write-Host "`nComandos úteis:" -ForegroundColor Yellow
Write-Host "  npm test              - Executar todos os testes" -ForegroundColor White
Write-Host "  npm run appium        - Iniciar Appium server" -ForegroundColor White
Write-Host "  npm run report:generate - Gerar relatório HTML" -ForegroundColor White
Write-Host "`nDocumentação:" -ForegroundColor Yellow
Write-Host "  README.md            - Documentação completa" -ForegroundColor White
Write-Host "  QUICKSTART.md        - Guia rápido" -ForegroundColor White
Write-Host "  GUIA_SELETORES.md    - Guia de seletores" -ForegroundColor White
Write-Host ""
