# Script PowerShell para build da imagem básica do InovaTech

Write-Host "🐳 Building InovaTech - Dockerfile Básico" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Define variáveis
$IMAGE_NAME = "inovatech-backend"
$IMAGE_TAG = "basico"
$DOCKERFILE = "Dockerfile.basico"
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
Write-Host "📄 Dockerfile: $DOCKERFILE" -ForegroundColor Green
Write-Host "📁 Context: $CONTEXT_PATH" -ForegroundColor Green
Write-Host ""

# Build da imagem
Write-Host "🔨 Iniciando build..." -ForegroundColor Yellow
docker build -f $DOCKERFILE -t "${IMAGE_NAME}:${IMAGE_TAG}" $CONTEXT_PATH

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Informações da imagem:" -ForegroundColor Cyan
    docker images "${IMAGE_NAME}:${IMAGE_TAG}"
    Write-Host ""
    Write-Host "🚀 Para executar o container:" -ForegroundColor Cyan
    Write-Host "   docker run -p 5000:5000 --name inovatech ${IMAGE_NAME}:${IMAGE_TAG}" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Para ver logs:" -ForegroundColor Cyan
    Write-Host "   docker logs -f inovatech" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Build falhou!" -ForegroundColor Red
    exit 1
}
