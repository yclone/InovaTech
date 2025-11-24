# 📦 Treinamento Docker - Criação de Imagens

## Índice
1. [Introdução ao Docker](#introdução-ao-docker)
2. [Conceitos Fundamentais](#conceitos-fundamentais)
3. [Dockerfile - Estrutura Básica](#dockerfile---estrutura-básica)
4. [Criando Imagem para Aplicação InovaTech](#criando-imagem-para-aplicação-inovatech)
5. [Boas Práticas](#boas-práticas)
6. [Multi-Stage Builds](#multi-stage-builds)
7. [Otimização de Imagens](#otimização-de-imagens)
8. [Comandos Essenciais](#comandos-essenciais)
9. [Exercícios Práticos](#exercícios-práticos)

---

## Introdução ao Docker

Docker é uma plataforma que permite empacotar aplicações e suas dependências em **containers**, garantindo que funcionem de forma consistente em qualquer ambiente.

### Por que usar Docker?

- ✅ **Portabilidade**: Funciona igual em desenvolvimento, homologação e produção
- ✅ **Isolamento**: Cada container é independente
- ✅ **Eficiência**: Containers são mais leves que VMs
- ✅ **Versionamento**: Imagens podem ser versionadas e compartilhadas
- ✅ **Escalabilidade**: Fácil replicação de containers

---

## Conceitos Fundamentais

### Imagem vs Container

| **Imagem** | **Container** |
|------------|---------------|
| Template read-only | Instância executável de uma imagem |
| Armazenada no registry | Em execução no host |
| Pode gerar múltiplos containers | Possui estado e pode ser iniciado/parado |

### Componentes de uma Imagem Docker

- **Layers (Camadas)**: Cada instrução no Dockerfile cria uma camada
- **Base Image**: Imagem base sobre a qual construímos
- **Metadata**: Informações sobre a imagem (autor, versão, etc.)

---

## Dockerfile - Estrutura Básica

O **Dockerfile** é um arquivo de texto com instruções para construir uma imagem Docker.

### Instruções Principais

```dockerfile
# Imagem base
FROM <imagem>:<tag>

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos do host para o container
COPY <origem> <destino>

# Adiciona arquivos (suporta URLs e tar)
ADD <origem> <destino>

# Executa comandos durante o build
RUN <comando>

# Define variáveis de ambiente
ENV <chave>=<valor>

# Expõe portas
EXPOSE <porta>

# Define volumes
VOLUME ["/data"]

# Comando executado ao iniciar o container
CMD ["executável", "param1", "param2"]

# Ponto de entrada (não sobrescrito por argumentos)
ENTRYPOINT ["executável"]
```

---

## Criando Imagem para Aplicação InovaTech

Vamos criar uma imagem Docker para a aplicação Spring Boot na pasta `APP`.

### Exemplo 1: Dockerfile Básico

Crie o arquivo `Dockerfile` na pasta `APP`:

```dockerfile
# Usa imagem oficial do OpenJDK 21
FROM eclipse-temurin:21-jdk-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia o arquivo pom.xml e o wrapper do Maven
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Baixa as dependências (cache layer)
RUN ./mvnw dependency:go-offline

# Copia o código fonte
COPY src src

# Compila a aplicação
RUN ./mvnw package -DskipTests

# Expõe a porta da aplicação
EXPOSE 5000

# Comando para executar a aplicação
CMD ["java", "-jar", "target/InovaTech-0.0.1-SNAPSHOT.jar"]
```

### Como Construir a Imagem

```bash
# Navegar até a pasta APP
cd APP

# Construir a imagem
docker build -t inovatech-backend:1.0 .

# Listar imagens
docker images

# Executar container
docker run -p 5000:5000 inovatech-backend:1.0
```

### Testando a Aplicação

```bash
# Acessar no navegador ou curl
curl http://localhost:5000/swagger-ui.html
```

---

## Exemplo 2: Dockerfile com Multi-Stage Build (RECOMENDADO)

Multi-stage builds permitem criar imagens menores e mais seguras.

```dockerfile
# ============================================
# ESTÁGIO 1: BUILD
# ============================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copia arquivos necessários para build
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Baixa dependências (cached)
RUN ./mvnw dependency:go-offline

# Copia código fonte
COPY src src

# Compila a aplicação
RUN ./mvnw clean package -DskipTests

# ============================================
# ESTÁGIO 2: RUNTIME
# ============================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copia apenas o JAR do estágio anterior
COPY --from=builder /app/target/InovaTech-0.0.1-SNAPSHOT.jar app.jar

# Cria usuário não-root para segurança
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Define variáveis de ambiente
ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV SERVER_PORT=5000

# Expõe a porta
EXPOSE ${SERVER_PORT}

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/actuator/health || exit 1

# Comando de execução
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### Vantagens do Multi-Stage:

- ✅ Imagem final **muito menor** (sem Maven, código fonte, etc.)
- ✅ Apenas o JRE necessário (não o JDK completo)
- ✅ Mais segura (menos ferramentas de desenvolvimento)
- ✅ Mais rápida para download/deploy

### Construir e Executar

```bash
# Build
docker build -t inovatech-backend:2.0 -f Dockerfile.multistage .

# Run com variáveis de ambiente
docker run -d \
  --name inovatech \
  -p 5000:5000 \
  -e JAVA_OPTS="-Xmx1g" \
  inovatech-backend:2.0

# Ver logs
docker logs -f inovatech

# Parar e remover
docker stop inovatech
docker rm inovatech
```

---

## Exemplo 3: Dockerfile com Build Arguments

Use `ARG` para parametrizar builds:

```dockerfile
# Argumentos de build
ARG JAVA_VERSION=21
ARG APP_VERSION=0.0.1-SNAPSHOT

# ============================================
# BUILD STAGE
# ============================================
FROM eclipse-temurin:${JAVA_VERSION}-jdk-alpine AS builder

ARG APP_VERSION
WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN ./mvnw dependency:go-offline

COPY src src

# Usa o argumento na compilação
RUN ./mvnw clean package -DskipTests

# ============================================
# RUNTIME STAGE
# ============================================
FROM eclipse-temurin:${JAVA_VERSION}-jre-alpine

ARG APP_VERSION
LABEL version="${APP_VERSION}"
LABEL description="InovaTech Backend Application"
LABEL maintainer="seu-email@exemplo.com"

WORKDIR /app

COPY --from=builder /app/target/InovaTech-${APP_VERSION}.jar app.jar

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

EXPOSE 5000

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Build com Argumentos

```bash
# Build padrão
docker build -t inovatech-backend:latest .

# Build com Java 17
docker build --build-arg JAVA_VERSION=17 -t inovatech-backend:java17 .

# Build com versão específica
docker build --build-arg APP_VERSION=1.0.0 -t inovatech-backend:1.0.0 .
```

---

## Exemplo 4: Dockerfile com .dockerignore

Crie um arquivo `.dockerignore` na pasta `APP` para excluir arquivos desnecessários:

```
# .dockerignore
target/
!target/InovaTech-*.jar
.git
.gitignore
*.md
.mvn/wrapper/maven-wrapper.jar
*.log
.idea
.vscode
*.iml
```

---

## Boas Práticas

### 1. Use Imagens Oficiais e Específicas

```dockerfile
# ❌ Evite tags genéricas
FROM openjdk:latest

# ✅ Use tags específicas
FROM eclipse-temurin:21-jre-alpine
```

### 2. Minimize o Número de Layers

```dockerfile
# ❌ Múltiplos RUN
RUN apk update
RUN apk add curl
RUN apk add wget

# ✅ Combine comandos
RUN apk update && \
    apk add --no-cache curl wget && \
    rm -rf /var/cache/apk/*
```

### 3. Use Cache de Layers Eficientemente

```dockerfile
# ✅ Copie dependências primeiro (mudam menos)
COPY pom.xml .
RUN ./mvnw dependency:go-offline

# ✅ Copie código depois (muda mais)
COPY src src
```

### 4. Não Execute como Root

```dockerfile
# ✅ Crie e use usuário não-privilegiado
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

### 5. Use Variáveis de Ambiente

```dockerfile
# ✅ Facilita configuração
ENV SPRING_PROFILES_ACTIVE=production
ENV DATABASE_URL=jdbc:postgresql://db:5432/inovatech
```

### 6. Adicione Healthcheck

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:5000/actuator/health || exit 1
```

### 7. Use Multi-Stage Builds

Sempre que possível, separe build de runtime para imagens menores.

---

## Otimização de Imagens

### Comparação de Tamanhos

```bash
# Imagem com JDK completo
FROM eclipse-temurin:21-jdk
# Tamanho: ~400MB

# Imagem com JRE
FROM eclipse-temurin:21-jre
# Tamanho: ~200MB

# Imagem Alpine com JRE
FROM eclipse-temurin:21-jre-alpine
# Tamanho: ~180MB
```

### Técnicas de Otimização

1. **Use Alpine Linux** quando possível
2. **Multi-stage builds** para remover ferramentas de build
3. **Limpe cache** de gerenciadores de pacotes
4. **Remova arquivos temporários**
5. **Use .dockerignore**

---

## Comandos Essenciais

### Build

```bash
# Build básico
docker build -t nome:tag .

# Build sem usar cache
docker build --no-cache -t nome:tag .

# Build com arquivo diferente
docker build -f Dockerfile.dev -t nome:dev .

# Build com contexto remoto
docker build -t nome:tag https://github.com/user/repo.git#branch
```

### Gerenciamento de Imagens

```bash
# Listar imagens
docker images
docker image ls

# Inspecionar imagem
docker inspect nome:tag

# Ver histórico de layers
docker history nome:tag

# Remover imagem
docker rmi nome:tag

# Remover imagens não utilizadas
docker image prune

# Remover todas imagens não usadas
docker image prune -a
```

### Tagging e Push

```bash
# Tag para registry
docker tag inovatech-backend:1.0 registry.com/inovatech-backend:1.0

# Push para registry
docker push registry.com/inovatech-backend:1.0

# Pull de registry
docker pull registry.com/inovatech-backend:1.0
```

### Executar Containers

```bash
# Run básico
docker run nome:tag

# Run em background (-d)
docker run -d --name meu-container nome:tag

# Run com port mapping
docker run -p 8080:5000 nome:tag

# Run com variáveis de ambiente
docker run -e ENV_VAR=value nome:tag

# Run com volume
docker run -v /host/path:/container/path nome:tag

# Run com restart automático
docker run --restart unless-stopped nome:tag
```

---

## Exercícios Práticos

### Exercício 1: Criar Primeira Imagem

1. Crie um `Dockerfile` básico na pasta `APP`
2. Construa a imagem: `docker build -t inovatech:v1 .`
3. Execute o container: `docker run -p 5000:5000 inovatech:v1`
4. Teste acessando: `http://localhost:5000/swagger-ui.html`

### Exercício 2: Multi-Stage Build

1. Crie um `Dockerfile.multistage` com dois estágios
2. Construa: `docker build -f Dockerfile.multistage -t inovatech:v2 .`
3. Compare os tamanhos:
   ```bash
   docker images | grep inovatech
   ```

### Exercício 3: Otimização

1. Adicione `.dockerignore` para excluir arquivos desnecessários
2. Use imagem Alpine
3. Adicione healthcheck
4. Crie usuário não-root
5. Compare o tamanho final

### Exercício 4: Build com Argumentos

1. Parametrize a versão do Java no Dockerfile
2. Construa imagens com Java 17 e 21
3. Compare performance e tamanho

### Exercício 5: Docker Compose

1. Crie um `docker-compose.yml` que suba:
   - Backend (InovaTech)
   - Banco de dados PostgreSQL
   - Frontend (se disponível)

---

## Troubleshooting

### Problema: Build muito lento

**Solução**: Use cache de layers eficientemente
```dockerfile
# Copie apenas pom.xml primeiro
COPY pom.xml .
RUN ./mvnw dependency:go-offline

# Depois copie o código
COPY src src
```

### Problema: Imagem muito grande

**Solução**: Use multi-stage build e Alpine
```dockerfile
FROM eclipse-temurin:21-jre-alpine AS runtime
# Apenas a JRE, não o JDK completo
```

### Problema: Permissões negadas

**Solução**: Ajuste permissões do Maven wrapper
```dockerfile
RUN chmod +x ./mvnw
```

### Problema: Container não inicia

**Solução**: Verifique logs
```bash
docker logs container-name
```

---

## Recursos Adicionais

- 📚 [Documentação Oficial Docker](https://docs.docker.com/)
- 📚 [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- 📚 [Docker Hub](https://hub.docker.com/)
- 📚 [Play with Docker](https://labs.play-with-docker.com/)

---

## Próximos Passos

1. ✅ Aprender sobre **Docker Compose** para orquestrar múltiplos containers
2. ✅ Estudar **Docker Networks** para comunicação entre containers
3. ✅ Entender **Docker Volumes** para persistência de dados
4. ✅ Explorar **Docker Swarm** ou **Kubernetes** para orquestração em produção
5. ✅ Implementar **CI/CD** com Docker

---

**Criado por**: Equipe InovaTech  
**Data**: Novembro 2025  
**Versão**: 1.0
