# 🎯 Exercícios Práticos - Docker

## Objetivo
Praticar a criação de imagens Docker através de exercícios progressivos, do básico ao avançado.

---

## 📋 Pré-requisitos

- Docker instalado e funcionando
- Acesso ao terminal/PowerShell
- Projeto InovaTech clonado

Verifique sua instalação:
```powershell
docker --version
docker ps
```

---

## Exercício 1: Primeira Imagem Docker 🌱

### Objetivo
Criar sua primeira imagem Docker usando o Dockerfile básico.

### Passos

1. **Navegue até o diretório Docker:**
   ```powershell
   cd Infra\Docker
   ```

2. **Examine o Dockerfile básico:**
   ```powershell
   Get-Content Dockerfile.basico
   ```

3. **Construa a imagem:**
   ```powershell
   .\build-basico.ps1
   ```
   
   OU manualmente:
   ```powershell
   cd ..\..\APP
   docker build -f ..\Infra\Docker\Dockerfile.basico -t inovatech:v1 .
   ```

4. **Verifique a imagem criada:**
   ```powershell
   docker images | Select-String "inovatech"
   ```

5. **Execute o container:**
   ```powershell
   docker run -p 5000:5000 --name inovatech-ex1 inovatech:v1
   ```

6. **Teste a aplicação:**
   - Abra o navegador: http://localhost:5000/swagger-ui.html
   - Ou use curl: `curl http://localhost:5000/actuator/health`

7. **Pare e remova o container:**
   ```powershell
   docker stop inovatech-ex1
   docker rm inovatech-ex1
   ```

### ✅ Checklist
- [ ] Imagem construída com sucesso
- [ ] Container executando
- [ ] Swagger UI acessível
- [ ] Container parado e removido

### 💡 Perguntas para Reflexão
1. Quanto tempo levou o build?
2. Qual o tamanho da imagem?
3. O que aconteceu em cada camada (layer)?

---

## Exercício 2: Multi-Stage Build 🚀

### Objetivo
Criar uma imagem otimizada usando multi-stage build e comparar com a imagem básica.

### Passos

1. **Construa a imagem multi-stage:**
   ```powershell
   cd Infra\Docker
   .\build-multistage.ps1
   ```

2. **Compare os tamanhos:**
   ```powershell
   docker images | Select-String "inovatech"
   ```

3. **Examine as diferenças:**
   ```powershell
   # Histórico da imagem básica
   docker history inovatech:basico
   
   # Histórico da imagem multi-stage
   docker history inovatech:multistage
   ```

4. **Execute e teste:**
   ```powershell
   docker run -d -p 5000:5000 --name inovatech-ex2 inovatech:multistage
   docker logs -f inovatech-ex2
   ```

5. **Verifique o healthcheck:**
   ```powershell
   # Aguarde 30 segundos após o container iniciar
   docker inspect --format='{{.State.Health.Status}}' inovatech-ex2
   ```

6. **Cleanup:**
   ```powershell
   docker stop inovatech-ex2
   docker rm inovatech-ex2
   ```

### ✅ Checklist
- [ ] Imagem multi-stage construída
- [ ] Tamanho comparado com imagem básica
- [ ] Healthcheck funcionando
- [ ] Diferenças compreendidas

### 📊 Análise de Resultados
Preencha a tabela:

| Métrica | Básico | Multi-Stage | Diferença |
|---------|--------|-------------|-----------|
| Tamanho (MB) | | | |
| Tempo de Build (s) | | | |
| Camadas | | | |

---

## Exercício 3: Otimização com .dockerignore 🎯

### Objetivo
Aprender a usar .dockerignore para acelerar builds e reduzir contexto.

### Passos

1. **Sem .dockerignore - Build inicial:**
   ```powershell
   cd ..\..\APP
   
   # Veja o tamanho do contexto
   docker build -f ..\Infra\Docker\Dockerfile.multistage --no-cache -t inovatech:sem-ignore .
   ```

2. **Crie o .dockerignore:**
   ```powershell
   Copy-Item ..\Infra\Docker\.dockerignore.exemplo .dockerignore
   ```

3. **Examine o arquivo:**
   ```powershell
   Get-Content .dockerignore
   ```

4. **Build com .dockerignore:**
   ```powershell
   docker build -f ..\Infra\Docker\Dockerfile.multistage --no-cache -t inovatech:com-ignore .
   ```

5. **Compare os tempos:**
   - Anote o tempo de cada build
   - Veja a diferença no upload do contexto

### ✅ Checklist
- [ ] .dockerignore criado
- [ ] Build mais rápido observado
- [ ] Diferenças documentadas

### 💡 Desafio Extra
Adicione mais exclusões no .dockerignore:
- Arquivos de log
- Diretórios de IDE
- Arquivos temporários

---

## Exercício 4: Build com Argumentos 🔧

### Objetivo
Usar build arguments para criar imagens parametrizadas.

### Passos

1. **Crie um novo Dockerfile parametrizado:**
   ```dockerfile
   ARG JAVA_VERSION=21
   FROM eclipse-temurin:${JAVA_VERSION}-jre-alpine
   
   ARG APP_VERSION=1.0.0
   LABEL version="${APP_VERSION}"
   
   WORKDIR /app
   COPY target/*.jar app.jar
   
   EXPOSE 5000
   CMD ["java", "-jar", "app.jar"]
   ```

2. **Build com diferentes versões de Java:**
   ```powershell
   # Java 21 (padrão)
   docker build --build-arg JAVA_VERSION=21 -t inovatech:java21 .
   
   # Java 17
   docker build --build-arg JAVA_VERSION=17 -t inovatech:java17 .
   ```

3. **Build com versão da aplicação:**
   ```powershell
   docker build `
     --build-arg APP_VERSION=2.0.0 `
     -t inovatech:2.0.0 .
   ```

4. **Inspecione os labels:**
   ```powershell
   docker inspect --format='{{.Config.Labels}}' inovatech:2.0.0
   ```

### ✅ Checklist
- [ ] Builds com diferentes Java versions
- [ ] Labels configurados corretamente
- [ ] Diferenças entre versões compreendidas

---

## Exercício 5: Variáveis de Ambiente 🌍

### Objetivo
Configurar aplicação usando variáveis de ambiente.

### Passos

1. **Execute com profile de desenvolvimento:**
   ```powershell
   docker run -d `
     --name inovatech-dev `
     -p 5000:5000 `
     -e SPRING_PROFILES_ACTIVE=dev `
     -e LOGGING_LEVEL_ROOT=DEBUG `
     inovatech:multistage
   ```

2. **Execute com profile de produção:**
   ```powershell
   docker run -d `
     --name inovatech-prod `
     -p 5001:5000 `
     -e SPRING_PROFILES_ACTIVE=production `
     -e JAVA_OPTS="-Xmx1g -Xms512m" `
     inovatech:multistage
   ```

3. **Compare os logs:**
   ```powershell
   # Dev (verbose)
   docker logs inovatech-dev | Select-Object -First 20
   
   # Prod (conciso)
   docker logs inovatech-prod | Select-Object -First 20
   ```

4. **Inspecione as variáveis:**
   ```powershell
   docker inspect --format='{{.Config.Env}}' inovatech-dev
   ```

5. **Cleanup:**
   ```powershell
   docker stop inovatech-dev inovatech-prod
   docker rm inovatech-dev inovatech-prod
   ```

### ✅ Checklist
- [ ] Containers com diferentes profiles
- [ ] Logs com níveis diferentes
- [ ] Variáveis aplicadas corretamente

---

## Exercício 6: Volumes e Persistência 💾

### Objetivo
Trabalhar com volumes para persistir dados.

### Passos

1. **Crie um volume para logs:**
   ```powershell
   docker volume create inovatech-logs
   ```

2. **Execute com volume montado:**
   ```powershell
   docker run -d `
     --name inovatech-vol `
     -p 5000:5000 `
     -v inovatech-logs:/app/logs `
     inovatech:multistage
   ```

3. **Gere alguma atividade:**
   ```powershell
   # Faça algumas requisições
   curl http://localhost:5000/swagger-ui.html
   ```

4. **Inspecione o volume:**
   ```powershell
   docker volume inspect inovatech-logs
   ```

5. **Pare o container mas mantenha o volume:**
   ```powershell
   docker stop inovatech-vol
   docker rm inovatech-vol
   ```

6. **Inicie novamente com o mesmo volume:**
   ```powershell
   docker run -d `
     --name inovatech-vol2 `
     -p 5000:5000 `
     -v inovatech-logs:/app/logs `
     inovatech:multistage
   ```

7. **Cleanup:**
   ```powershell
   docker stop inovatech-vol2
   docker rm inovatech-vol2
   docker volume rm inovatech-logs
   ```

### ✅ Checklist
- [ ] Volume criado
- [ ] Dados persistidos entre containers
- [ ] Volume removido corretamente

---

## Exercício 7: Networking 🌐

### Objetivo
Conectar múltiplos containers usando redes Docker.

### Passos

1. **Crie uma rede:**
   ```powershell
   docker network create inovatech-network
   ```

2. **Execute um banco de dados:**
   ```powershell
   docker run -d `
     --name postgres-db `
     --network inovatech-network `
     -e POSTGRES_PASSWORD=senha123 `
     -e POSTGRES_DB=inovatech `
     postgres:15-alpine
   ```

3. **Execute a aplicação conectada à rede:**
   ```powershell
   docker run -d `
     --name inovatech-app `
     --network inovatech-network `
     -p 5000:5000 `
     -e DATABASE_URL=jdbc:postgresql://postgres-db:5432/inovatech `
     inovatech:multistage
   ```

4. **Teste a conectividade:**
   ```powershell
   # Ping do container da aplicação para o banco
   docker exec inovatech-app ping -c 3 postgres-db
   ```

5. **Inspecione a rede:**
   ```powershell
   docker network inspect inovatech-network
   ```

6. **Cleanup:**
   ```powershell
   docker stop inovatech-app postgres-db
   docker rm inovatech-app postgres-db
   docker network rm inovatech-network
   ```

### ✅ Checklist
- [ ] Rede criada
- [ ] Containers comunicando-se
- [ ] Conectividade testada
- [ ] Recursos limpos

---

## Exercício 8: Debug e Troubleshooting 🔍

### Objetivo
Aprender técnicas de debug de containers.

### Passos

1. **Execute um container com problema:**
   ```powershell
   docker run -d `
     --name inovatech-debug `
     -p 5000:5000 `
     -e SPRING_PROFILES_ACTIVE=invalid `
     inovatech:multistage
   ```

2. **Verifique o status:**
   ```powershell
   docker ps -a
   ```

3. **Inspecione os logs:**
   ```powershell
   docker logs inovatech-debug
   ```

4. **Entre no container:**
   ```powershell
   docker exec -it inovatech-debug sh
   ```
   
   Dentro do container:
   ```sh
   # Verifique processos
   ps aux
   
   # Verifique variáveis
   env | grep SPRING
   
   # Saia
   exit
   ```

5. **Verifique recursos:**
   ```powershell
   docker stats inovatech-debug --no-stream
   ```

6. **Inspecione detalhes:**
   ```powershell
   docker inspect inovatech-debug
   ```

7. **Cleanup:**
   ```powershell
   docker stop inovatech-debug
   docker rm inovatech-debug
   ```

### ✅ Checklist
- [ ] Problema identificado nos logs
- [ ] Container inspecionado
- [ ] Comandos de debug executados
- [ ] Recursos monitorados

---

## Exercício 9: Imagem de Produção 🏭

### Objetivo
Criar e executar uma imagem production-ready.

### Passos

1. **Build da imagem de produção:**
   ```powershell
   cd Infra\Docker
   .\build-producao.ps1
   ```

2. **Execute em modo produção:**
   ```powershell
   docker run -d `
     --name inovatech-prod `
     --restart unless-stopped `
     -p 5000:5000 `
     -e SPRING_PROFILES_ACTIVE=production `
     -e JAVA_OPTS="-Xmx1g -Xms512m" `
     -v inovatech-logs:/app/logs `
     inovatech:prod
   ```

3. **Monitore healthcheck:**
   ```powershell
   # Aguarde 30 segundos
   docker inspect --format='{{json .State.Health}}' inovatech-prod
   ```

4. **Teste restart automático:**
   ```powershell
   # Force um stop
   docker stop inovatech-prod
   
   # Aguarde alguns segundos
   Start-Sleep -Seconds 5
   
   # Verifique se reiniciou
   docker ps -f name=inovatech-prod
   ```

5. **Simule falha:**
   ```powershell
   # Mate o processo Java dentro do container
   docker exec inovatech-prod pkill java
   
   # Verifique se o container reiniciou
   docker ps -a -f name=inovatech-prod
   ```

### ✅ Checklist
- [ ] Imagem de produção construída
- [ ] Healthcheck configurado
- [ ] Restart policy funcionando
- [ ] Monitoramento ativo

---

## Exercício 10: Limpeza e Manutenção 🧹

### Objetivo
Aprender a manter o ambiente Docker limpo.

### Passos

1. **Liste todos os recursos:**
   ```powershell
   docker ps -a        # Todos containers
   docker images       # Todas imagens
   docker volume ls    # Todos volumes
   docker network ls   # Todas redes
   ```

2. **Remova containers parados:**
   ```powershell
   docker container prune
   ```

3. **Remova imagens não utilizadas:**
   ```powershell
   docker image prune
   
   # Ou todas não usadas
   docker image prune -a
   ```

4. **Remova volumes não utilizados:**
   ```powershell
   docker volume prune
   ```

5. **Limpeza completa (cuidado!):**
   ```powershell
   docker system prune -a --volumes
   ```

6. **Verifique o espaço recuperado:**
   ```powershell
   docker system df
   ```

### ✅ Checklist
- [ ] Containers não utilizados removidos
- [ ] Imagens antigas limpas
- [ ] Volumes órfãos removidos
- [ ] Espaço em disco recuperado

---

## 🎓 Certificado de Conclusão

Parabéns! Ao completar todos os exercícios, você aprendeu:

- ✅ Criar Dockerfiles básicos e avançados
- ✅ Usar multi-stage builds
- ✅ Otimizar imagens Docker
- ✅ Trabalhar com variáveis de ambiente
- ✅ Gerenciar volumes e persistência
- ✅ Configurar networking entre containers
- ✅ Debug e troubleshooting
- ✅ Preparar imagens para produção
- ✅ Manter ambiente Docker limpo

---

## 📚 Próximos Passos

1. **Docker Compose**: Aprenda a orquestrar múltiplos containers
2. **CI/CD**: Integre Docker no seu pipeline
3. **Registry**: Configure um registry privado
4. **Kubernetes**: Migre para orquestração em larga escala
5. **Segurança**: Scan de vulnerabilidades e hardening

---

**Bom treinamento! 🚀**
