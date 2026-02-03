# ✅ Validação da Stack de Observabilidade

## 🎯 Objetivo

Este documento serve para validar que toda a stack está funcionando corretamente antes de prosseguir com o treinamento.

---

## 📋 Checklist de Validação

### 1. Containers Docker

Execute:
```bash
docker ps --filter "name=inovatech"
```

**Resultado Esperado:** 5 containers rodando

- [ ] ✅ inovatech-grafana (porta 3000)
- [ ] ✅ inovatech-prometheus (porta 9090)
- [ ] ✅ inovatech-loki (porta 3100)
- [ ] ✅ inovatech-promtail
- [ ] ✅ inovatech-tempo (portas 3200, 4317, 4318, 9411)

**Se algum container não estiver UP:**
```bash
docker-compose logs [nome-do-container]
docker-compose restart [nome-do-container]
```

---

### 2. Grafana

#### 2.1 Acesso à Interface

- [ ] ✅ Abrir http://localhost:3000
- [ ] ✅ Login com `admin` / `admin`
- [ ] ✅ Interface carrega sem erros

#### 2.2 Data Sources

No Grafana: **☰ Menu → Connections → Data Sources**

**Prometheus:**
- [ ] ✅ Data source "Prometheus" existe
- [ ] ✅ URL: `http://prometheus:9090`
- [ ] ✅ Teste: "Data source is working"

**Loki:**
- [ ] ✅ Data source "Loki" existe
- [ ] ✅ URL: `http://loki:3100`
- [ ] ✅ Teste: "Data source is working"

**Tempo:**
- [ ] ✅ Data source "Tempo" existe
- [ ] ✅ URL: `http://tempo:3200`
- [ ] ✅ Teste: "Data source is working"

#### 2.3 Explore

No Grafana: **Explore** (ícone de bússola)

**Teste Prometheus:**
```promql
up
```
- [ ] ✅ Retorna métricas de `prometheus`, `loki`, `tempo`

**Teste Loki:**
```logql
{application="loki"}
```
- [ ] ✅ Retorna logs do próprio Loki

---

### 3. Prometheus

#### 3.1 Acesso à Interface

- [ ] ✅ Abrir http://localhost:9090
- [ ] ✅ Interface carrega sem erros

#### 3.2 Targets

No Prometheus: **Status → Targets**

**Esperado ver:**
- [ ] ✅ `prometheus` - State: **UP**
- [ ] ✅ `loki` - State: **UP**
- [ ] ✅ `tempo` - State: **UP**
- [ ] ⚠️ `spring-boot-backend` - State: **DOWN** (normal, aplicação ainda não instrumentada)

#### 3.3 Query

Execute no Prometheus:
```promql
prometheus_http_requests_total
```
- [ ] ✅ Retorna resultados

---

### 4. Loki

#### 4.1 Health Check

Execute no terminal:
```bash
curl http://localhost:3100/ready
```

**Resultado Esperado:**
```
ready
```

- [ ] ✅ Retorna "ready"

#### 4.2 Metrics

```bash
curl http://localhost:3100/metrics
```

- [ ] ✅ Retorna métricas do Loki

---

### 5. Tempo

#### 5.1 Health Check

```bash
curl http://localhost:3200/ready
```

**Resultado Esperado:**
```
ready
```

- [ ] ✅ Retorna "ready"

---

### 6. Promtail

#### 6.1 Logs do Container

```bash
docker logs inovatech-promtail
```

**Não deve ter erros críticos como:**
- ❌ "failed to create target"
- ❌ "connection refused"

- [ ] ✅ Sem erros críticos
- [ ] ✅ Mensagens de "Successfully created target"

---

### 7. Volumes e Persistência

```bash
docker volume ls | grep inovatech
```

**Esperado ver 4 volumes:**
- [ ] ✅ infra_grafana-data
- [ ] ✅ infra_prometheus-data
- [ ] ✅ infra_loki-data
- [ ] ✅ infra_tempo-data

---

### 8. Logs da Aplicação (Preparação)

Verifique se as pastas existem:

```bash
# Windows PowerShell
Test-Path "C:\Users\vmarrasa\DEV\InovaTech\infra\logs\spring-boot"
Test-Path "C:\Users\vmarrasa\DEV\InovaTech\infra\logs\nodejs"

# Linux/Mac
ls -la ../infra/logs/
```

- [ ] ✅ Pasta `spring-boot` existe
- [ ] ✅ Pasta `nodejs` existe

---

## 🎯 Teste de Integração Completo

### Cenário: Validar pipeline completo

#### Passo 1: Gerar métricas
No Grafana, navegue entre páginas e execute queries.

#### Passo 2: Verificar no Prometheus
```promql
grafana_http_request_duration_seconds_count
```
- [ ] ✅ Métricas do Grafana aparecem

#### Passo 3: Verificar logs no Loki via Grafana
No Grafana Explore (Loki):
```logql
{application="loki"}
```
- [ ] ✅ Logs aparecem

---

## 🚨 Troubleshooting

### Problema: Container reiniciando constantemente

```bash
docker-compose logs [container]
```

**Soluções comuns:**
- Porta já em uso → Alterar porta no `docker-compose.yml`
- Memória insuficiente → Aumentar memória do Docker
- Arquivo de config inválido → Validar sintaxe YAML

### Problema: Data source não conecta

```bash
# Testar conectividade de dentro do Grafana
docker exec inovatech-grafana ping prometheus
docker exec inovatech-grafana ping loki
docker exec inovatech-grafana ping tempo
```

**Esperado:** Resposta positiva do ping

### Problema: Prometheus target DOWN

Verifique se o serviço está rodando:
```bash
curl http://localhost:9090/metrics  # Prometheus
curl http://localhost:3100/metrics  # Loki
curl http://localhost:3200/metrics  # Tempo
```

---

## ✅ Validação Final

**Antes de prosseguir para o Módulo 2, certifique-se:**

- [ ] ✅ Todos os 5 containers estão UP
- [ ] ✅ Grafana acessível e 3 data sources OK
- [ ] ✅ Prometheus acessível e 3 targets UP
- [ ] ✅ Loki respondendo /ready
- [ ] ✅ Tempo respondendo /ready
- [ ] ✅ Pastas de logs existem

**Total de checks:** 35

**Se todos os checks estão ✅, você está pronto para o Módulo 2!**

---

## 📊 Status Visual

Crie esta dashboard no Grafana para monitorar a própria stack:

```promql
# Status dos serviços
up{job=~"prometheus|loki|tempo"}

# Uso de memória dos containers
container_memory_usage_bytes{name=~"inovatech-.*"}

# Requisições por serviço
rate(http_requests_total[1m])
```

---

## 🔄 Reset Completo (se necessário)

Se algo der muito errado e você quiser recomeçar do zero:

```bash
# Parar tudo
docker-compose down

# Remover volumes (APAGA TODOS OS DADOS!)
docker-compose down -v

# Limpar imagens órfãs
docker system prune

# Recriar tudo
docker-compose up -d

# Verificar
docker-compose ps
```

---

## 📞 Próximos Passos

Se todos os checks passaram:

1. ✅ **Módulo 1 completo!**
2. ➡️ Prossiga para [MODULO-02-LOGS.md](MODULO-02-LOGS.md)
3. 📚 Ou consulte o [GUIA-RAPIDO.md](GUIA-RAPIDO.md) para referência

---

**Autor:** Treinamento InovaTech  
**Versão:** 1.0  
**Data:** 03/02/2026
