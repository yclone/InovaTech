# Script PowerShell para executar container InovaTech

param(
    [Parameter(Mandatory=$false)]
    [string]$ImageTag = "inovatech-backend:multistage",
    
    [Parameter(Mandatory=$false)]
    [string]$ContainerName = "inovatech",
    
    [Parameter(Mandatory=$false)]
    [int]$Port = 5000,
    
    [Parameter(Mandatory=$false)]
    [string]$Profile = "dev"
)

Write-Host "🐳 Executando InovaTech Container" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📦 Imagem: $ImageTag" -ForegroundColor Green
Write-Host "🏷️  Container: $ContainerName" -ForegroundColor Green
Write-Host "🌐 Porta: $Port" -ForegroundColor Green
Write-Host "⚙️  Profile: $Profile" -ForegroundColor Green
Write-Host ""

# Para e remove container existente se houver
$existing = docker ps -a -q -f name=$ContainerName
if ($existing) {
    Write-Host "🛑 Parando container existente..." -ForegroundColor Yellow
    docker stop $ContainerName | Out-Null
    docker rm $ContainerName | Out-Null
}

# Executa o container
Write-Host "🚀 Iniciando container..." -ForegroundColor Yellow
docker run -d `
    --name $ContainerName `
    -p "${Port}:5000" `
    -e SPRING_PROFILES_ACTIVE=$Profile `
    -e TZ=America/Sao_Paulo `
    $ImageTag

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Container iniciado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Status do container:" -ForegroundColor Cyan
    docker ps -f name=$ContainerName
    Write-Host ""
    Write-Host "🌐 Endpoints disponíveis:" -ForegroundColor Cyan
    Write-Host "   Swagger UI: http://localhost:${Port}/swagger-ui.html" -ForegroundColor White
    Write-Host "   API Docs:   http://localhost:${Port}/v3/api-docs" -ForegroundColor White
    Write-Host "   H2 Console: http://localhost:${Port}/h2-console" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Ver logs:" -ForegroundColor Cyan
    Write-Host "   docker logs -f $ContainerName" -ForegroundColor White
    Write-Host ""
    Write-Host "🛑 Parar container:" -ForegroundColor Cyan
    Write-Host "   docker stop $ContainerName" -ForegroundColor White
    Write-Host ""
    
    # Aguarda alguns segundos e mostra logs iniciais
    Write-Host "⏳ Aguardando inicialização..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    Write-Host ""
    Write-Host "📄 Logs iniciais:" -ForegroundColor Cyan
    docker logs --tail 20 $ContainerName
} else {
    Write-Host ""
    Write-Host "❌ Falha ao iniciar container!" -ForegroundColor Red
    exit 1
}
