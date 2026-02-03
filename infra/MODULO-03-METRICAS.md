# 📈 MÓDULO 3: Métricas com Micrometer e Prometheus

## 🎯 Objetivos do Módulo

Ao final deste módulo, os alunos serão capazes de:
- ✅ Configurar Spring Boot Actuator
- ✅ Expor métricas para o Prometheus
- ✅ Criar métricas customizadas de negócio
- ✅ Visualizar métricas no Grafana
- ✅ Criar dashboards de performance
- ✅ Entender tipos de métricas (Counter, Gauge, Timer, Summary)

---

## 📚 Conceitos: O que são Métricas?

**Métricas** são valores numéricos medidos ao longo do tempo que representam o estado de um sistema.

### Por que Métricas são Importantes?

- 📊 **Performance** - Identificar gargalos e lentidão
- 🚨 **Alertas** - Detectar problemas antes dos usuários
- 📈 **Tendências** - Planejar capacidade e crescimento
- 💰 **Custos** - Otimizar recursos e infraestrutura

### Logs vs Métricas

| Aspecto | Logs | Métricas |
|---------|------|----------|
| **Tipo** | Eventos discretos | Valores agregados |
| **Volume** | Alto (MB/GB) | Baixo (KB) |
| **Performance** | Consultas lentas | Consultas rápidas |
| **Uso** | Debugging, auditoria | Monitoramento, alertas |
| **Exemplo** | "Cliente 123 criado" | `clientes_criados_total = 1542` |

---

## 🔧 Parte 1: Configurar Spring Boot Actuator

### Passo 1.1: Adicionar dependências

Adicione no `APP/pom.xml`:

```xml
<!-- Spring Boot Actuator - Métricas e Health Checks -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<!-- Micrometer Prometheus Registry - Exportar métricas para Prometheus -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

### Passo 1.2: Configurar application.properties

Adicione em `APP/src/main/resources/application.properties`:

```properties
# ========================================
# ACTUATOR - Endpoints de Monitoramento
# ========================================

# Expor todos os endpoints (dev) - em produção, seja mais restritivo
management.endpoints.web.exposure.include=*

# Porta do Actuator (mesma da aplicação)
management.server.port=5000

# Base path dos endpoints
management.endpoints.web.base-path=/actuator

# Health endpoint detalhado
management.endpoint.health.show-details=always
management.endpoint.health.show-components=always

# ========================================
# PROMETHEUS - Exportar Métricas
# ========================================

# Habilitar endpoint Prometheus
management.endpoint.prometheus.enabled=true

# Métricas adicionais
management.metrics.export.prometheus.enabled=true

# Tags globais (aparecem em todas as métricas)
management.metrics.tags.application=${spring.application.name}
management.metrics.tags.environment=dev

# ========================================
# MÉTRICAS - Configurações Detalhadas
# ========================================

# Distribuição de percentis para latência HTTP
management.metrics.distribution.percentiles-histogram.http.server.requests=true
management.metrics.distribution.slo.http.server.requests=50ms,100ms,200ms,500ms,1s

# Métricas de JVM
management.metrics.enable.jvm=true
management.metrics.enable.process=true
management.metrics.enable.system=true

# Métricas de DataSource
management.metrics.enable.jdbc=true

# Métricas de Tomcat
server.tomcat.mbeanregistry.enabled=true
```

### Passo 1.3: Reiniciar a aplicação

```bash
cd APP
mvn spring-boot:run
```

### Passo 1.4: Verificar endpoints disponíveis

```bash
# Listar todos os endpoints
curl http://localhost:5000/actuator

# Ver métricas no formato Prometheus
curl http://localhost:5000/actuator/prometheus

# Ver health check
curl http://localhost:5000/actuator/health

# Ver informações da aplicação
curl http://localhost:5000/actuator/info
```

---

## 📊 Parte 2: Métricas Padrão do Spring Boot

### Métricas Automáticas Disponíveis

#### 1. **Métricas de JVM**
- `jvm_memory_used_bytes` - Memória usada
- `jvm_memory_max_bytes` - Memória máxima
- `jvm_threads_live` - Threads ativas
- `jvm_gc_pause_seconds` - Tempo de Garbage Collection

#### 2. **Métricas HTTP**
- `http_server_requests_seconds_count` - Total de requisições
- `http_server_requests_seconds_sum` - Tempo total de requisições
- `http_server_requests_seconds_max` - Tempo máximo de requisição

#### 3. **Métricas de Sistema**
- `system_cpu_usage` - Uso de CPU do sistema
- `process_cpu_usage` - Uso de CPU do processo
- `system_load_average_1m` - Load average

#### 4. **Métricas de DataSource**
- `jdbc_connections_active` - Conexões ativas
- `jdbc_connections_idle` - Conexões ociosas
- `jdbc_connections_max` - Máximo de conexões

---

## 🎯 Parte 3: Criar Métricas Customizadas

### Tipos de Métricas do Micrometer

| Tipo | Descrição | Quando Usar | Exemplo |
|------|-----------|-------------|---------|
| **Counter** | Sempre aumenta | Contadores | `clientes_criados_total` |
| **Gauge** | Valor que sobe/desce | Estado atual | `usuarios_ativos_agora` |
| **Timer** | Duração de eventos | Latência | `pagamento_processamento_segundos` |
| **Summary** | Distribuição de valores | Tamanho de payloads | `pedido_valor_reais` |

### Passo 3.1: Criar classe de configuração de métricas

Crie `APP/src/main/java/br/com/InovaTech/InovaTech/config/MetricsConfig.java`:

```java
package br.com.InovaTech.InovaTech.config;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.binder.MeterBinder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MetricsConfig {

    /**
     * Registra métricas customizadas iniciais
     */
    @Bean
    public MeterBinder customMetrics(MeterRegistry registry) {
        return meterRegistry -> {
            // Métricas serão registradas aqui ou nos services
        };
    }
}
```

### Passo 3.2: Adicionar métricas no Service

Modifique `ClienteServiceImpl.java`:

```java
package br.com.InovaTech.InovaTech.service.impl;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Service;

@Service
public class ClienteServiceImpl implements ClienteService {
    
    private static final Logger log = LoggerFactory.getLogger(ClienteServiceImpl.class);
    
    private final ClienteRepository clienteRepository;
    private final ModelMapper modelMapper;
    private final MeterRegistry meterRegistry;
    
    // Métricas customizadas
    private final Counter clientesCriadosCounter;
    private final Counter clientesErroCounter;
    private final Timer clienteCriacaoTimer;
    
    public ClienteServiceImpl(
            ClienteRepository clienteRepository,
            ModelMapper modelMapper,
            MeterRegistry meterRegistry) {
        
        this.clienteRepository = clienteRepository;
        this.modelMapper = modelMapper;
        this.meterRegistry = meterRegistry;
        
        // Inicializar métricas
        this.clientesCriadosCounter = Counter.builder("clientes.criados")
                .description("Total de clientes criados com sucesso")
                .tag("tipo", "sucesso")
                .register(meterRegistry);
        
        this.clientesErroCounter = Counter.builder("clientes.erro")
                .description("Total de erros ao criar clientes")
                .tag("tipo", "erro")
                .register(meterRegistry);
        
        this.clienteCriacaoTimer = Timer.builder("clientes.criacao.tempo")
                .description("Tempo de criação de clientes")
                .register(meterRegistry);
    }
    
    @Override
    public ClienteDto criarCliente(ClienteDto clienteDto) {
        return clienteCriacaoTimer.record(() -> {
            log.info("Iniciando criação de cliente: email={}", clienteDto.getEmail());
            
            try {
                // Validações
                if (clienteRepository.existsByEmail(clienteDto.getEmail())) {
                    log.warn("Email duplicado: {}", clienteDto.getEmail());
                    clientesErroCounter.increment();
                    throw new BusinessException("Email já cadastrado");
                }
                
                Cliente cliente = modelMapper.map(clienteDto, Cliente.class);
                Cliente salvo = clienteRepository.save(cliente);
                
                // Incrementar contador de sucesso
                clientesCriadosCounter.increment();
                
                log.info("Cliente criado: id={}", salvo.getId());
                return modelMapper.map(salvo, ClienteDto.class);
                
            } catch (BusinessException e) {
                clientesErroCounter.increment();
                throw e;
            } catch (Exception e) {
                clientesErroCounter.increment();
                log.error("Erro ao criar cliente", e);
                throw new InternalErrorException("Erro interno ao criar cliente");
            }
        });
    }
    
    @Override
    public List<ClienteDto> listarClientes() {
        // Registrar quantidade atual de clientes (Gauge)
        meterRegistry.gauge("clientes.total", clienteRepository.count());
        
        return clienteRepository.findAll().stream()
                .map(c -> modelMapper.map(c, ClienteDto.class))
                .collect(Collectors.toList());
    }
}
```

### Passo 3.3: Adicionar métricas HTTP customizadas no Controller

Crie um interceptor para métricas HTTP customizadas:

```java
package br.com.InovaTech.InovaTech.config;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Tags;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class MetricsInterceptor implements HandlerInterceptor {
    
    private final MeterRegistry meterRegistry;
    
    public MetricsInterceptor(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }
    
    @Override
    public void afterCompletion(
            HttpServletRequest request, 
            HttpServletResponse response,
            Object handler, 
            Exception ex) {
        
        String endpoint = request.getRequestURI();
        String method = request.getMethod();
        int status = response.getStatus();
        
        // Registrar métrica customizada
        meterRegistry.counter("http.requests.custom",
                Tags.of(
                        "method", method,
                        "endpoint", endpoint,
                        "status", String.valueOf(status)
                )).increment();
    }
}
```

---

## 📊 Parte 4: Visualizar Métricas no Prometheus

### Passo 4.1: Acessar Prometheus UI

Abra: http://localhost:9090

### Passo 4.2: Verificar se o target está UP

1. Vá em **Status → Targets**
2. Procure por `spring-boot-backend`
3. Status deve estar **UP** (verde)

Se estiver **DOWN**, verifique:
- Aplicação está rodando?
- Endpoint `/actuator/prometheus` acessível?

### Passo 4.3: Queries básicas no Prometheus

```promql
# Ver todas as métricas da aplicação
{application="InovaTech"}

# Total de requisições HTTP
http_server_requests_seconds_count

# Taxa de requisições por segundo
rate(http_server_requests_seconds_count[1m])

# Latência média (p95)
histogram_quantile(0.95, 
  rate(http_server_requests_seconds_bucket[5m])
)

# Uso de memória JVM
jvm_memory_used_bytes{area="heap"}

# Threads da JVM
jvm_threads_live

# Clientes criados (métrica customizada)
clientes_criados_total
```

---

## 🎨 Parte 5: Criar Dashboards no Grafana

### Dashboard 1: Visão Geral da Aplicação

#### Painel 1: Taxa de Requisições HTTP

**Query:**
```promql
sum(rate(http_server_requests_seconds_count{application="InovaTech"}[1m]))
```

**Configuração:**
- Visualization: **Time series**
- Title: "Requisições por Segundo"
- Unit: `reqps` (requests per second)

#### Painel 2: Latência HTTP (P50, P95, P99)

**Queries:**
```promql
# P50
histogram_quantile(0.50, 
  sum(rate(http_server_requests_seconds_bucket{application="InovaTech"}[5m])) by (le)
)

# P95
histogram_quantile(0.95, 
  sum(rate(http_server_requests_seconds_bucket{application="InovaTech"}[5m])) by (le)
)

# P99
histogram_quantile(0.99, 
  sum(rate(http_server_requests_seconds_bucket{application="InovaTech"}[5m])) by (le)
)
```

**Configuração:**
- Visualization: **Time series**
- Title: "Latência HTTP (percentis)"
- Unit: `s` (seconds)
- Legend: `P50`, `P95`, `P99`

#### Painel 3: Status HTTP por Código

**Query:**
```promql
sum by (status) (
  rate(http_server_requests_seconds_count{application="InovaTech"}[5m])
)
```

**Configuração:**
- Visualization: **Bar gauge** ou **Stat**
- Title: "Requisições por Status HTTP"
- Legend: `{{status}}`

### Dashboard 2: Métricas de JVM

#### Painel 1: Uso de Memória Heap

**Query:**
```promql
jvm_memory_used_bytes{application="InovaTech", area="heap"}
```

**Configuração:**
- Visualization: **Time series**
- Title: "Memória Heap Usada"
- Unit: `bytes`

#### Painel 2: Garbage Collection

**Query:**
```promql
rate(jvm_gc_pause_seconds_sum{application="InovaTech"}[1m])
```

**Configuração:**
- Visualization: **Time series**
- Title: "Tempo de GC (por segundo)"
- Unit: `s`

#### Painel 3: Threads JVM

**Query:**
```promql
jvm_threads_live{application="InovaTech"}
```

**Configuração:**
- Visualization: **Stat**
- Title: "Threads Ativas"

### Dashboard 3: Métricas de Negócio

#### Painel 1: Clientes Criados (Total)

**Query:**
```promql
clientes_criados_total
```

**Configuração:**
- Visualization: **Stat**
- Title: "Total de Clientes Criados"

#### Painel 2: Taxa de Criação de Clientes

**Query:**
```promql
rate(clientes_criados_total[5m])
```

**Configuração:**
- Visualization: **Time series**
- Title: "Clientes Criados por Segundo"

#### Painel 3: Taxa de Erros

**Query:**
```promql
rate(clientes_erro_total[5m])
```

**Configuração:**
- Visualization: **Time series**
- Title: "Taxa de Erros"
- Color: Red

---

## 📈 Parte 6: Importar Dashboard Pronto

### Passo 6.1: Importar JVM Dashboard

1. No Grafana, vá em **Dashboards → Import**
2. Digite o ID: **4701** (JVM Micrometer)
3. Clique em **Load**
4. Selecione **Prometheus** como data source
5. Clique em **Import**

### Passo 6.2: Importar Spring Boot Dashboard

1. **Dashboards → Import**
2. ID: **12900** (Spring Boot Statistics)
3. Data source: **Prometheus**
4. **Import**

---

## 🧪 Exercícios Práticos

### Exercício 1: Métrica de Mailing
Adicione métricas no `MailingService`:
- Counter: `emails_enviados_total`
- Counter: `emails_erro_total`
- Timer: `email_envio_tempo_segundos`

### Exercício 2: Dashboard de Mailing
Crie um dashboard com:
- Total de emails enviados
- Taxa de erro de envio
- Latência média de envio

### Exercício 3: Gauge de Usuários Online
Implemente uma métrica que rastreie:
- Quantos usuários estão autenticados agora
- Use um Gauge que incrementa no login e decrementa no logout

### Exercício 4: Alert Rule
Crie uma regra de alerta no Prometheus:
- Alertar se taxa de erro > 5%
- Alertar se latência p95 > 1s
- Alertar se memória heap > 80%

---

## 🚨 Parte 7: Conceitos Avançados

### Golden Signals (4 Sinais Dourados)

Criados pelo Google SRE, são as métricas mais importantes:

#### 1. **Latency** (Latência)
Tempo que leva para responder uma requisição.

```promql
histogram_quantile(0.95, 
  rate(http_server_requests_seconds_bucket[5m])
)
```

#### 2. **Traffic** (Tráfego)
Volume de requisições.

```promql
sum(rate(http_server_requests_seconds_count[1m]))
```

#### 3. **Errors** (Erros)
Taxa de requisições com erro.

```promql
sum(rate(http_server_requests_seconds_count{status=~"5.."}[1m])) 
/ 
sum(rate(http_server_requests_seconds_count[1m]))
```

#### 4. **Saturation** (Saturação)
Uso de recursos (CPU, memória, etc).

```promql
jvm_memory_used_bytes / jvm_memory_max_bytes
```

---

## 🛠️ Troubleshooting

### Problema: Endpoint /actuator/prometheus não encontrado

**Solução:**
1. Verifique se a dependência `micrometer-registry-prometheus` está no pom.xml
2. Rode `mvn clean package`
3. Reinicie a aplicação

### Problema: Prometheus não coleta métricas (target DOWN)

**Solução:**
1. Verifique se a aplicação está rodando: `curl http://localhost:5000/actuator/health`
2. No Windows, o Prometheus dentro do Docker precisa usar `host.docker.internal` ao invés de `localhost`
3. Verifique o `prometheus.yml`: target deve ser `host.docker.internal:5000`

### Problema: Métricas customizadas não aparecem

**Solução:**
1. Verifique se o `MeterRegistry` foi injetado corretamente
2. Certifique-se de que a métrica foi registrada: `registry.find("nome.metrica").counter()`
3. Execute a operação que gera a métrica (ex: criar um cliente)
4. Aguarde ~15s (intervalo de scrape do Prometheus)

---

## 📝 Checklist do Módulo 3

- [ ] Spring Boot Actuator configurado
- [ ] Endpoint `/actuator/prometheus` acessível
- [ ] Prometheus coletando métricas (target UP)
- [ ] Métricas customizadas implementadas (Counter, Timer)
- [ ] Dashboard de métricas HTTP criado
- [ ] Dashboard de JVM importado
- [ ] Entendeu os 4 tipos de métricas (Counter, Gauge, Timer, Summary)
- [ ] Entendeu os Golden Signals

---

## 🎉 Próximos Passos

No **MÓDULO 4**, vamos:
- 🔍 Configurar Distributed Tracing com Micrometer Tracing
- 🔗 Correlacionar logs, métricas e traces
- 🗺️ Visualizar Service Maps
- ⚡ Identificar gargalos de performance

---

**Tempo Estimado:** 2h
- Teoria e configuração: 40 min
- Métricas customizadas: 40 min
- Dashboards: 40 min
