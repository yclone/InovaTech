# 🚀 Scripts de Build Docker - InovaTech

Este diretório contém scripts para facilitar o build e execução das imagens Docker.

## Scripts Disponíveis

### Windows (PowerShell)

```powershell
# Build imagem básica
.\build-basico.ps1

# Build imagem multi-stage
.\build-multistage.ps1

# Build imagem de produção
.\build-producao.ps1

# Build imagem de desenvolvimento
.\build-dev.ps1

# Executar container
.\run.ps1 -ImageTag "inovatech:latest"
```

### Linux/Mac (Bash)

```bash
# Build imagem básica
./build-basico.sh

# Build imagem multi-stage
./build-multistage.sh

# Build imagem de produção
./build-producao.sh

# Build imagem de desenvolvimento
./build-dev.sh

# Executar container
./run.sh inovatech:latest
```

## Como Usar os Dockerfiles

### 1. Dockerfile Básico

```bash
cd ../../APP
docker build -f ../Infra/Docker/Dockerfile.basico -t inovatech:basico .
docker run -p 5000:5000 inovatech:basico
```

**Quando usar**: Desenvolvimento rápido, testes locais

### 2. Dockerfile Multi-Stage

```bash
cd ../../APP
docker build -f ../Infra/Docker/Dockerfile.multistage -t inovatech:multistage .
docker run -p 5000:5000 inovatech:multistage
```

**Quando usar**: Reduzir tamanho da imagem, separar build de runtime

### 3. Dockerfile Produção

```bash
cd ../../APP
docker build -f ../Infra/Docker/Dockerfile.producao -t inovatech:prod .
docker run -p 5000:5000 inovatech:prod
```

**Quando usar**: Deploy em produção, máxima otimização

### 4. Dockerfile Dev

```bash
cd ../../APP
docker build -f ../Infra/Docker/Dockerfile.dev -t inovatech:dev .
docker run -p 5000:5000 -p 5005:5005 inovatech:dev
```

**Quando usar**: Desenvolvimento com hot-reload e debug remoto

## Comparação de Tamanhos

| Dockerfile | Tamanho Aproximado | JDK/JRE | Recursos |
|------------|-------------------|---------|----------|
| Básico | ~450MB | JDK | Maven, código fonte |
| Multi-Stage | ~200MB | JRE | Apenas JAR |
| Produção | ~210MB | JRE | JAR + ferramentas mínimas |
| Dev | ~500MB | JDK | Maven + dev tools |

## Variáveis de Ambiente

### Produção

```bash
docker run -p 5000:5000 \
  -e JAVA_OPTS="-Xmx1g -Xms512m" \
  -e SPRING_PROFILES_ACTIVE=production \
  -e DATABASE_URL=jdbc:postgresql://db:5432/inovatech \
  inovatech:prod
```

### Desenvolvimento

```bash
docker run -p 5000:5000 -p 5005:5005 \
  -e SPRING_PROFILES_ACTIVE=dev \
  -v $(pwd)/src:/app/src \
  inovatech:dev
```

## Docker Compose

Para orquestrar múltiplos containers, veja o arquivo `docker-compose.yml` na raiz do projeto.

## Troubleshooting

### Erro: "mvnw: Permission denied"

**Solução**: O Dockerfile já inclui `chmod +x ./mvnw`, mas se persistir:
```bash
git update-index --chmod=+x mvnw
```

### Build muito lento

**Solução**: Use cache do Docker e .dockerignore
```bash
# Crie .dockerignore na pasta APP
cp ../Infra/Docker/.dockerignore.exemplo ../APP/.dockerignore
```

### Container não inicia

**Solução**: Verifique logs
```bash
docker logs <container-name>
```

## Próximos Passos

1. Teste cada Dockerfile para entender as diferenças
2. Personalize as variáveis de ambiente
3. Crie um docker-compose.yml para ambiente completo
4. Configure CI/CD para build automatizado
