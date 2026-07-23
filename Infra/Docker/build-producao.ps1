# Script PowerShell para build da imagem de produção do InovaTech

Write-Host "🐳 Building InovaTech - Production Image" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Define variáveis
$IMAGE_NAME = "inovatech-backend"
$IMAGE_TAG = "prod"
$IMAGE_VERSION = "1.0.0"
$DOCKERFILE = "Dockerfile.producao"
$CONTEXT_PATH = "../../APP"

# Navega para o diretório correto
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $SCRIPT_DIR

# Verifica se o Dockerfile existe
if (-not (Test-Path $DOCKERFILE)) {
    Write-Host "❌ Erro: $DOCKERFILE não encontrado!" -ForegroundColor Red
    exit 1
}

# Verifica se o contexto existe
if (-not (Test-Path $CONTEXT_PATH)) {
    Write-Host "❌ Erro: Diretório APP não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Imagem: ${IMAGE_NAME}:${IMAGE_TAG}" -ForegroundColor Green
Write-Host "🏷️  Versão: ${IMAGE_VERSION}" -ForegroundColor Green
Write-Host "📄 Dockerfile: $DOCKERFILE" -ForegroundColor Green
Write-Host "📁 Context: $CONTEXT_PATH" -ForegroundColor Green
Write-Host "🎯 Ambiente: Production" -ForegroundColor Green
Write-Host ""

# Build da imagem
Write-Host "🔨 Iniciando build..." -ForegroundColor Yellow
docker build -f $DOCKERFILE `
    -t "${IMAGE_NAME}:${IMAGE_TAG}" `
    -t "${IMAGE_NAME}:${IMAGE_VERSION}" `
    -t "${IMAGE_NAME}:latest" `
    $CONTEXT_PATH

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Imagens criadas:" -ForegroundColor Cyan
    docker images | Select-String "inovatech"
    Write-Host ""
    Write-Host "🔍 Inspecionar imagem:" -ForegroundColor Cyan
    Write-Host "   docker inspect ${IMAGE_NAME}:${IMAGE_TAG}" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 Para executar em produção:" -ForegroundColor Cyan
    Write-Host "   docker run -d ``" -ForegroundColor White
    Write-Host "     --name inovatech-prod ``" -ForegroundColor White
    Write-Host "     --restart unless-stopped ``" -ForegroundColor White
    Write-Host "     -p 5000:5000 ``" -ForegroundColor White
    Write-Host "     -e SPRING_PROFILES_ACTIVE=production ``" -ForegroundColor White
    Write-Host "     -e JAVA_OPTS='-Xmx1g -Xms512m' ``" -ForegroundColor White
    Write-Host "     ${IMAGE_NAME}:${IMAGE_TAG}" -ForegroundColor White
    Write-Host ""
    Write-Host "📤 Para enviar ao registry:" -ForegroundColor Cyan
    Write-Host "   docker tag ${IMAGE_NAME}:${IMAGE_TAG} registry.com/${IMAGE_NAME}:${IMAGE_VERSION}" -ForegroundColor White
    Write-Host "   docker push registry.com/${IMAGE_NAME}:${IMAGE_VERSION}" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Build falhou!" -ForegroundColor Red
    exit 1
}
