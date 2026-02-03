# 📊 Treinamento de Observabilidade - InovaTech

## 🎯 Objetivo do Treinamento

Este treinamento tem como objetivo ensinar os **3 pilares da Observabilidade** usando o projeto InovaTech como exemplo prático:

- **📝 LOGS** - Agregação e análise com Loki
- **📈 MÉTRICAS** - Coleta e visualização com Prometheus
- **🔍 TRACES** - Rastreamento distribuído com Tempo

---

## 📚 Estrutura do Treinamento

### ✅ **MÓDULO 1: Fundamentos e Setup Inicial** (VOCÊ ESTÁ AQUI)
- Conceitos dos 3 pilares da Observabilidade
- Configuração da Stack: Grafana + Prometheus + Loki + Tempo
- Inicialização do ambiente via Docker

### 📝 **MÓDULO 2: Logs Estruturados**
- Configuração de Logback no Spring Boot
- Logs JSON estruturados
- Integração com Loki
- Queries e filtros no Grafana

### 📈 **MÓDULO 3: Métricas com Micrometer**
- Spring Boot Actuator
- Métricas customizadas de negócio
- Dashboards no Grafana
- Métricas de JVM, HTTP, DB

### 🔍 **MÓDULO 4: Distributed Tracing**
- Micrometer Tracing
- Correlação de requisições
- Análise de latência e gargalos
- Service Maps

### 🚨 **MÓDULO 5: Alertas e Monitoramento**
- Regras de alerta no Prometheus
- Notificações no Grafana
- SLO/SLI/SLA
- Dashboards executivos

### 🌐 **MÓDULO 6: Frontend Observability** (Opcional)
- Instrumentação do Node.js
- Métricas de frontend
- Correlação Frontend-Backend

---

## 🚀 MÓDULO 1: Setup Inicial

### 📋 Pré-requisitos

- Docker Desktop instalado
- Docker Compose instalado
- Java 21 (projeto backend)
- Node.js (projeto frontend)

### 🏗️ Arquitetura da Stack

```
┌─────────────────────────────────────────────────────────┐
│                       GRAFANA                            │
│              (Interface de Visualização)                 │
│                  http://localhost:3000                   │
└────────────┬──────────────┬──────────────┬──────────────┘
             │              │              │
    ┌────────▼───────┐ ┌───▼─────────┐ ┌──▼──────────┐
    │   PROMETHEUS   │ │    LOKI     │ │    TEMPO    │
    │   (Métricas)   │ │   (Logs)    │ │  (Traces)   │
    │   :9090        │ │   :3100     │ │   :3200     │
    └────────┬───────┘ └───┬─────────┘ └──┬──────────┘
             │             │               │
    ┌────────▼─────────────▼───────────────▼──────────┐
    │          APLICAÇÕES INSTRUMENTADAS               │
    │    Spring Boot Backend + Node.js Frontend        │
    └──────────────────────────────────────────────────┘
```

### 📦 Componentes Instalados

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| **Grafana** | 3000 | Interface de visualização e dashboards |
| **Prometheus** | 9090 | Coleta e armazenamento de métricas |
| **Loki** | 3100 | Agregação e query de logs |
| **Promtail** | 9080 | Coletor de logs para Loki |
| **Tempo** | 3200, 4317, 4318 | Distributed tracing (OTLP, Zipkin) |

---

## 🎬 Passo 1: Iniciar a Stack de Observabilidade

### 1.1 Navegue até a pasta infra

```bash
cd infra
```

### 1.2 Inicie todos os serviços

```bash
docker-compose up -d
```

### 1.3 Verifique se todos os containers estão rodando

```bash
docker-compose ps
```

Você deve ver 5 containers rodando:
- ✅ inovatech-grafana
- ✅ inovatech-prometheus
- ✅ inovatech-loki
- ✅ inovatech-promtail
- ✅ inovatech-tempo

---

## 🔍 Passo 2: Acessar as Interfaces

### 2.1 Grafana (Interface Principal)

- **URL:** http://localhost:3000
- **Usuário:** `admin`
- **Senha:** `admin`

> **Primeira vez:** O Grafana pedirá para trocar a senha. Você pode pular ou definir uma nova.

### 2.2 Prometheus (Métricas)

- **URL:** http://localhost:9090
- **Teste:** Vá em Status > Targets para ver os endpoints monitorados

### 2.3 Loki (Logs)

- **URL:** http://localhost:3100/ready
- Deve retornar: `ready`

---

## ✅ Passo 3: Validar Configuração no Grafana

### 3.1 Verificar Data Sources

1. No Grafana, vá em **☰ Menu → Connections → Data Sources**
2. Você deve ver 3 data sources já configurados:
   - ✅ **Prometheus** (default)
   - ✅ **Loki**
   - ✅ **Tempo**

### 3.2 Testar Conexões

Para cada data source:
1. Clique no nome
2. Role até o final e clique em **"Test"**
3. Deve aparecer: ✅ **"Data source is working"**

---

## 🧪 Passo 4: Primeiro Teste de Métricas

### 4.1 No Grafana, acesse: Explore (ícone de bússola)

### 4.2 Selecione o Data Source: **Prometheus**

### 4.3 Execute uma query de teste:

```promql
up
```

Você deve ver métricas dos próprios serviços de observabilidade:
- `prometheus`
- `loki`
- `tempo`

---

## 🎓 Conceitos Explicados

### 📊 O que é Observabilidade?

**Observabilidade** é a capacidade de entender o estado interno de um sistema baseado nos dados que ele expõe externamente.

### 🏛️ Os 3 Pilares

#### 1. **LOGS** 📝
- **O que:** Registros de eventos que ocorreram
- **Quando usar:** Debugging, auditoria, troubleshooting
- **Exemplo:** `"Erro ao salvar cliente no banco - ID: 123"`

#### 2. **MÉTRICAS** 📈
- **O que:** Valores numéricos agregados ao longo do tempo
- **Quando usar:** Performance, alertas, tendências
- **Exemplo:** `http_requests_total = 5000`, `cpu_usage = 75%`

#### 3. **TRACES** 🔍
- **O que:** Jornada completa de uma requisição
- **Quando usar:** Latência, dependências, gargalos
- **Exemplo:** Request percorreu: API → Service → Database (120ms total)

---

## 🎯 Exercícios Práticos

### Exercício 1: Explorar o Prometheus UI
1. Acesse http://localhost:9090
2. Vá em **Graph**
3. Digite: `prometheus_http_requests_total`
4. Clique em **Execute**
5. **Pergunta:** Quantas requisições HTTP o Prometheus recebeu?

### Exercício 2: Verificar Targets do Prometheus
1. Em http://localhost:9090 vá em **Status → Targets**
2. **Pergunta:** Quantos jobs estão configurados?
3. **Pergunta:** Por que o job `spring-boot-backend` está DOWN? (Resposta: a aplicação ainda não foi instrumentada)

### Exercício 3: Explorar Grafana
1. Acesse http://localhost:3000
2. Vá em **Explore**
3. Selecione **Loki** como data source
4. Use o label selector: `{application="loki"}`
5. **Pergunta:** Você consegue ver logs do próprio Loki?

---

## 🛠️ Comandos Úteis

### Ver logs de um container
```bash
docker-compose logs -f grafana
docker-compose logs -f prometheus
docker-compose logs -f loki
```

### Parar todos os serviços
```bash
docker-compose down
```

### Parar e remover volumes (CUIDADO: apaga dados)
```bash
docker-compose down -v
```

### Reiniciar um serviço específico
```bash
docker-compose restart grafana
```

### Ver consumo de recursos
```bash
docker stats
```

---

## 🔧 Troubleshooting

### Problema: Container não inicia

```bash
# Ver logs do container
docker-compose logs [nome-do-servico]

# Exemplo
docker-compose logs prometheus
```

### Problema: Porta já está em uso

Se alguma porta (3000, 9090, 3100) já estiver em uso, você pode alterar no `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Muda a porta externa para 3001
```

### Problema: Data Source não conecta no Grafana

1. Verifique se o serviço está rodando: `docker-compose ps`
2. Teste a conectividade: `docker exec inovatech-grafana ping prometheus`
3. Verifique os logs: `docker-compose logs prometheus`

---

## 📝 Checklist do Módulo 1

Antes de prosseguir para o Módulo 2, certifique-se:

- [ ] Docker Compose iniciou todos os 5 containers
- [ ] Grafana acessível em http://localhost:3000
- [ ] Login no Grafana funcionou (admin/admin)
- [ ] 3 Data Sources estão configurados e testados
- [ ] Prometheus UI acessível em http://localhost:9090
- [ ] Query `up` retorna métricas no Prometheus
- [ ] Entendeu os 3 pilares da Observabilidade

---

## 🎉 Próximos Passos

**PARABÉNS!** Você completou o **MÓDULO 1**.

A stack de observabilidade está rodando e pronta para receber dados.

No **MÓDULO 2**, vamos:
- ✨ Instrumentar o Spring Boot para gerar logs estruturados
- 🔗 Conectar os logs ao Loki
- 📊 Criar queries e visualizações no Grafana
- 🎨 Entender níveis de log (DEBUG, INFO, WARN, ERROR)

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [Grafana Docs](https://grafana.com/docs/)
- [Prometheus Docs](https://prometheus.io/docs/)
- [Loki Docs](https://grafana.com/docs/loki/)
- [Tempo Docs](https://grafana.com/docs/tempo/)

### Artigos Recomendados
- [The Three Pillars of Observability](https://www.oreilly.com/library/view/distributed-systems-observability/9781492033431/ch04.html)
- [Prometheus Best Practices](https://prometheus.io/docs/practices/)

---

## 👨‍🏫 Notas para o Instrutor

### Tempo Estimado: 45 minutos
- Apresentação teórica: 15 min
- Setup prático: 15 min
- Exploração e exercícios: 15 min

### Pontos de Atenção
1. **Docker no Windows:** Alguns alunos podem ter problemas com WSL2
2. **Portas ocupadas:** Tenha alternativas de portas preparadas
3. **Recursos:** Grafana + Prometheus + Loki consomem ~2GB RAM

### Sugestões de Demonstração
1. Mostrar o Grafana com dashboards de exemplo
2. Executar queries simples no Prometheus
3. Mostrar a diferença visual entre logs, métricas e traces
4. Fazer um paralelo com "instrumentos de um carro": velocímetro (métrica), luz de check engine (alerta), gravação da viagem (logs)

---

**Criado por:** Treinamento InovaTech - Observabilidade
**Versão:** 1.0
**Data:** 03/02/2026
