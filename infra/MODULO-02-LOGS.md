# 📝 MÓDULO 2: Logs Estruturados com Loki

## 🎯 Objetivos do Módulo

Ao final deste módulo, os alunos serão capazes de:
- ✅ Configurar logs estruturados (JSON) no Spring Boot
- ✅ Enviar logs para o Loki via arquivo
- ✅ Criar queries e filtros no Grafana
- ✅ Entender níveis de log e boas práticas
- ✅ Correlacionar logs com traces (preparação para Módulo 4)

---

## 📚 Conceitos: O que são Logs?

**Logs** são registros cronológicos de eventos que ocorrem em uma aplicação. São essenciais para:
- 🐛 **Debugging** - Identificar erros e comportamentos inesperados
- 🔍 **Troubleshooting** - Investigar problemas em produção
- 📊 **Auditoria** - Rastrear ações de usuários
- 📈 **Análise** - Entender padrões de uso

### Tipos de Logs

#### 1. **Logs Não Estruturados** (Formato Tradicional)
```
2026-02-03 10:30:45 INFO  Cliente criado com ID: 123
2026-02-03 10:30:46 ERROR Falha ao conectar no banco de dados
```

**Problemas:**
- ❌ Difícil de filtrar e buscar
- ❌ Não permite agregações
- ❌ Parsing complexo

#### 2. **Logs Estruturados** (JSON) ✅ **RECOMENDADO**
```json
{
  "timestamp": "2026-02-03T10:30:45.123Z",
  "level": "INFO",
  "logger": "ClienteService",
  "message": "Cliente criado",
  "clienteId": 123,
  "traceId": "abc123",
  "spanId": "def456"
}
```

**Vantagens:**
- ✅ Fácil de filtrar e buscar
- ✅ Permite agregações e análises
- ✅ Correlação com traces e métricas
- ✅ Indexação eficiente

---

## 🔧 Parte 1: Configurar Logback no Spring Boot

### Passo 1.1: Adicionar dependências no `pom.xml`

O Spring Boot já inclui o Logback por padrão, mas vamos adicionar suporte para JSON:

```xml
<!-- Adicionar no pom.xml dentro de <dependencies> -->
<dependency>
    <groupId>net.logstash.logback</groupId>
    <artifactId>logstash-logback-encoder</artifactId>
    <version>7.4</version>
</dependency>
```

### Passo 1.2: Criar arquivo `logback-spring.xml`

Crie o arquivo em: `APP/src/main/resources/logback-spring.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- Propriedades da aplicação -->
    <springProperty scope="context" name="appName" source="spring.application.name"/>
    
    <!-- ========================================
         CONSOLE APPENDER (Para desenvolvimento)
         ======================================== -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
            <includeCallerData>true</includeCallerData>
            <!-- Campos customizados -->
            <customFields>{"application":"${appName}","environment":"dev"}</customFields>
            <!-- Adicionar campos do MDC (para traceId e spanId) -->
            <includeMdcKeyName>traceId</includeMdcKeyName>
            <includeMdcKeyName>spanId</includeMdcKeyName>
        </encoder>
    </appender>

    <!-- ========================================
         FILE APPENDER (Para Loki coletar)
         ======================================== -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- Caminho do arquivo -->
        <file>../infra/logs/spring-boot/application.log</file>
        
        <!-- Política de rotação -->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>../infra/logs/spring-boot/application.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>7</maxHistory>
            <totalSizeCap>1GB</totalSizeCap>
        </rollingPolicy>
        
        <!-- Encoder JSON -->
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
            <includeCallerData>false</includeCallerData>
            <customFields>{"application":"${appName}","environment":"dev"}</customFields>
            <includeMdcKeyName>traceId</includeMdcKeyName>
            <includeMdcKeyName>spanId</includeMdcKeyName>
        </encoder>
    </appender>

    <!-- ========================================
         LOGGERS - Níveis por pacote
         ======================================== -->
    
    <!-- Logger da aplicação -->
    <logger name="br.com.InovaTech" level="DEBUG" additivity="false">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </logger>
    
    <!-- Spring Framework (reduzir verbosidade) -->
    <logger name="org.springframework" level="INFO"/>
    <logger name="org.springframework.web" level="INFO"/>
    <logger name="org.springframework.security" level="INFO"/>
    
    <!-- Hibernate (SQL queries) -->
    <logger name="org.hibernate.SQL" level="DEBUG"/>
    <logger name="org.hibernate.type.descriptor.sql.BasicBinder" level="TRACE"/>
    
    <!-- Root logger (padrão para tudo) -->
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>
</configuration>
```

### Passo 1.3: Adicionar logs no código

Exemplo no `ClienteServiceImpl.java`:

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ClienteServiceImpl implements ClienteService {
    
    private static final Logger log = LoggerFactory.getLogger(ClienteServiceImpl.class);
    
    @Override
    public ClienteDto criarCliente(ClienteDto clienteDto) {
        log.info("Iniciando criação de cliente: email={}", clienteDto.getEmail());
        
        try {
            // Validações
            if (clienteRepository.existsByEmail(clienteDto.getEmail())) {
                log.warn("Tentativa de criar cliente com email duplicado: {}", clienteDto.getEmail());
                throw new BusinessException("Email já cadastrado");
            }
            
            Cliente cliente = modelMapper.map(clienteDto, Cliente.class);
            Cliente salvo = clienteRepository.save(cliente);
            
            log.info("Cliente criado com sucesso: id={}, email={}", salvo.getId(), salvo.getEmail());
            
            return modelMapper.map(salvo, ClienteDto.class);
            
        } catch (Exception e) {
            log.error("Erro ao criar cliente: email={}, erro={}", 
                     clienteDto.getEmail(), e.getMessage(), e);
            throw e;
        }
    }
}
```

---

## 🚀 Parte 2: Testar Logs Localmente

### Passo 2.1: Reiniciar o Spring Boot

```bash
cd APP
mvn spring-boot:run
```

### Passo 2.2: Gerar logs fazendo requisições

Use o Swagger: http://localhost:5000/swagger-ui.html

Ou via curl:
```bash
curl -X POST http://localhost:5000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@example.com","telefone":"11999999999"}'
```

### Passo 2.3: Verificar se os logs estão sendo gerados

```bash
# No terminal
cat ../infra/logs/spring-boot/application.log
```

Você deve ver logs no formato JSON:
```json
{
  "timestamp": "2026-02-03T10:30:45.123Z",
  "level": "INFO",
  "logger": "br.com.InovaTech.InovaTech.service.impl.ClienteServiceImpl",
  "message": "Cliente criado com sucesso",
  "clienteId": 123,
  "application": "InovaTech",
  "environment": "dev"
}
```

---

## 📊 Parte 3: Visualizar Logs no Grafana

### Passo 3.1: Acessar o Grafana Explore

1. Abra http://localhost:3000
2. Vá em **Explore** (ícone de bússola)
3. Selecione **Loki** como data source

### Passo 3.2: Queries Básicas

#### Query 1: Todos os logs da aplicação
```logql
{application="inovatech-backend"}
```

#### Query 2: Filtrar por nível de log
```logql
{application="inovatech-backend"} |= "ERROR"
```

#### Query 3: Buscar por texto específico
```logql
{application="inovatech-backend"} |= "Cliente criado"
```

#### Query 4: Filtrar por logger
```logql
{application="inovatech-backend"} | json | logger="br.com.InovaTech.InovaTech.service.impl.ClienteServiceImpl"
```

#### Query 5: Logs com erro nos últimos 5 minutos
```logql
{application="inovatech-backend"} | json | level="ERROR" [5m]
```

### Passo 3.3: Parsear campos JSON

```logql
{application="inovatech-backend"} 
| json 
| level="INFO"
| line_format "{{.timestamp}} - {{.message}}"
```

---

## 🎨 Parte 4: Criar Dashboard de Logs

### Passo 4.1: Criar novo Dashboard

1. No Grafana, vá em **Dashboards → New → New Dashboard**
2. Clique em **Add visualization**
3. Selecione **Loki** como data source

### Passo 4.2: Painel 1 - Logs em Tempo Real

**Query:**
```logql
{application="inovatech-backend"}
```

**Configurações:**
- Visualization: **Logs**
- Options → Order: **Newest first**
- Options → Show time: **✓ Enabled**

### Passo 4.3: Painel 2 - Quantidade de Logs por Nível

**Query:**
```logql
sum by (level) (count_over_time({application="inovatech-backend"} | json [5m]))
```

**Configurações:**
- Visualization: **Bar chart** ou **Pie chart**
- Legend: `{{level}}`

### Passo 4.4: Painel 3 - Taxa de Erros

**Query:**
```logql
sum(rate({application="inovatech-backend"} | json | level="ERROR" [5m]))
```

**Configurações:**
- Visualization: **Time series**
- Title: "Taxa de Erros (por segundo)"

### Passo 4.5: Salvar o Dashboard

- Clique em **Save** (ícone de disquete)
- Nome: **"InovaTech - Logs"**
- Folder: **InovaTech**

---

## 📋 Parte 5: Boas Práticas de Logs

### ✅ DO - Faça isso

```java
// 1. Use níveis apropriados
log.debug("Detalhes técnicos: cache hit para key={}", key);
log.info("Cliente {} realizou login", username);
log.warn("Limite de requisições próximo: {}/1000", count);
log.error("Falha ao processar pagamento para pedido {}", orderId, exception);

// 2. Use placeholders (não concatenação)
log.info("Cliente criado: id={}, nome={}", cliente.getId(), cliente.getNome()); // ✅

// 3. Adicione contexto relevante
log.error("Erro ao salvar no banco: entidade={}, id={}", 
         entity.getClass().getSimpleName(), entity.getId(), exception);

// 4. Log de operações importantes
log.info("Pagamento processado: pedidoId={}, valor={}, metodo={}", 
         pedidoId, valor, metodoPagamento);
```

### ❌ DON'T - Evite isso

```java
// 1. Não use concatenação de strings
log.info("Cliente criado: " + cliente.getNome()); // ❌ (impacto performance)

// 2. Não logue informações sensíveis
log.info("Login: username={}, senha={}", user, password); // ❌ NUNCA!
log.info("Cartão: {}", cartaoNumero); // ❌

// 3. Não logue objetos inteiros sem toString
log.info("Cliente: {}", cliente); // ❌ (pode ter dados sensíveis)

// 4. Evite logs excessivos em loops
for (Cliente c : clientes) {
    log.debug("Processando cliente {}", c.getId()); // ❌ (pode gerar milhares de logs)
}
```

### 🎯 Níveis de Log - Quando Usar

| Nível | Quando Usar | Exemplo |
|-------|-------------|---------|
| **TRACE** | Detalhes muito específicos | Entrada/saída de métodos |
| **DEBUG** | Informações de debugging | Valores de variáveis, fluxo de execução |
| **INFO** | Eventos importantes do negócio | Cliente criado, pedido finalizado |
| **WARN** | Situações anormais mas recuperáveis | Retry de conexão, cache miss |
| **ERROR** | Erros que precisam atenção | Falha ao salvar, exceções inesperadas |

---

## 🔍 Parte 6: LogQL - Linguagem de Query do Loki

### Operadores de Filtro

```logql
# Contém
{app="backend"} |= "error"

# Não contém
{app="backend"} != "debug"

# Regex match
{app="backend"} |~ "error|exception"

# Regex não match
{app="backend"} !~ "debug|trace"
```

### Parsear JSON

```logql
{app="backend"} 
| json 
| level="ERROR"
| logger=~".*Service"
```

### Agregações

```logql
# Contar logs
count_over_time({app="backend"}[5m])

# Taxa de logs
rate({app="backend"}[5m])

# Logs por segundo
sum(rate({app="backend"}[1m]))

# Agrupar por campo
sum by (level) (count_over_time({app="backend"} | json [5m]))
```

---

## 🧪 Exercícios Práticos

### Exercício 1: Adicionar Logs no Controller
Adicione logs no `ClienteController` para registrar:
- Requisições recebidas (nível INFO)
- Parâmetros inválidos (nível WARN)
- Erros inesperados (nível ERROR)

### Exercício 2: Query de Análise
Crie uma query LogQL que mostre:
- Quantos clientes foram criados na última hora
- Agrupar por resultado (sucesso/erro)

### Exercício 3: Dashboard de Análise
Crie um painel que mostre:
- Top 5 endpoints mais chamados
- Taxa de erro por endpoint
- Tempo médio de resposta (se disponível nos logs)

### Exercício 4: Correlação
Adicione um campo customizado nos logs:
- `userId` quando houver usuário autenticado
- Crie uma query que filtre logs de um usuário específico

---

## 🛠️ Troubleshooting

### Problema: Logs não aparecem no arquivo

**Verificações:**
1. Caminho do arquivo está correto no `logback-spring.xml`?
2. A pasta `infra/logs/spring-boot/` existe?
3. Permissões de escrita estão corretas?

**Solução:**
```bash
# Criar pasta se não existir
mkdir -p ../infra/logs/spring-boot

# Verificar permissões (Linux/Mac)
ls -la ../infra/logs/spring-boot
```

### Problema: Logs não aparecem no Grafana

**Verificações:**
1. Promtail está rodando? `docker ps | grep promtail`
2. Promtail está lendo o arquivo? `docker logs inovatech-promtail`
3. O caminho no `promtail-config.yml` está correto?

**Solução:**
```bash
# Ver logs do Promtail
docker logs inovatech-promtail

# Reiniciar Promtail
docker-compose restart promtail
```

### Problema: Formato JSON quebrado

Se os logs não estão em JSON válido, verifique:
1. Dependência `logstash-logback-encoder` está no pom.xml?
2. O encoder está configurado corretamente no logback-spring.xml?
3. Rode `mvn clean package` e reinicie a aplicação

---

## 📝 Checklist do Módulo 2

Antes de prosseguir para o Módulo 3:

- [ ] Dependência `logstash-logback-encoder` adicionada no pom.xml
- [ ] Arquivo `logback-spring.xml` criado e configurado
- [ ] Logs estruturados (JSON) sendo gerados no arquivo
- [ ] Promtail coletando logs e enviando para Loki
- [ ] Logs aparecem no Grafana Explore
- [ ] Criou pelo menos 3 queries diferentes no LogQL
- [ ] Dashboard de logs criado com 2+ painéis
- [ ] Entendeu os níveis de log e quando usar cada um

---

## 🎉 Próximos Passos

**PARABÉNS!** Você completou o **MÓDULO 2**.

No **MÓDULO 3**, vamos:
- 📈 Configurar Spring Boot Actuator
- 📊 Expor métricas customizadas
- 🎯 Criar dashboards de performance no Grafana
- 💻 Monitorar JVM, HTTP, Database

---

## 📚 Recursos Adicionais

- [Logback Documentation](http://logback.qos.ch/documentation.html)
- [LogQL Cheat Sheet](https://grafana.com/docs/loki/latest/logql/)
- [SLF4J Best Practices](https://www.slf4j.org/manual.html)
- [Loki Query Language](https://grafana.com/docs/loki/latest/logql/)

---

**Tempo Estimado:** 1h30min
- Teoria e configuração: 30 min
- Prática com queries: 30 min
- Dashboard e exercícios: 30 min
