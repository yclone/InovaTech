# ⚡ Guia Rápido - Stack de Observabilidade InovaTech

## 🚀 Início Rápido

### Iniciar Stack de Observabilidade
```bash
cd infra
docker-compose up -d
```

### Verificar Status
```bash
docker-compose ps
```

### Parar Stack
```bash
docker-compose down
```

---

## 🌐 URLs de Acesso

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| **Grafana** | http://localhost:3000 | admin / admin |
| **Prometheus** | http://localhost:9090 | - |
| **Loki** | http://localhost:3100 | - |
| **Tempo** | http://localhost:3200 | - |
| **Spring Boot** | http://localhost:5000 | - |
| **Swagger** | http://localhost:5000/swagger-ui.html | - |
| **Actuator** | http://localhost:5000/actuator | - |
| **H2 Console** | http://localhost:5000/h2-console | sa / 123 |

---

## 📊 Comandos Docker Úteis

```bash
# Ver logs de um container
docker logs inovatech-grafana
docker logs -f inovatech-prometheus  # Follow (tempo real)

# Reiniciar um serviço
docker-compose restart grafana

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (APAGA DADOS!)
docker-compose down -v

# Ver consumo de recursos
docker stats

# Entrar em um container
docker exec -it inovatech-grafana /bin/bash
```

---

## 🔍 Queries Rápidas

### LogQL (Loki)

```logql
# Todos os logs da aplicação
{application="inovatech-backend"}

# Apenas erros
{application="inovatech-backend"} |= "ERROR"

# Filtrar por logger
{application="inovatech-backend"} | json | logger=~".*Service"

# Contar logs por nível
sum by (level) (count_over_time({application="inovatech-backend"} | json [5m]))
```

### PromQL (Prometheus)

```promql
# Taxa de requisições HTTP
rate(http_server_requests_seconds_count[1m])

# Latência P95
histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m]))

# Uso de memória heap
jvm_memory_used_bytes{area="heap"}

# Taxa de erro HTTP
sum(rate(http_server_requests_seconds_count{status=~"5.."}[1m]))
```

---

## 🛠️ Troubleshooting Rápido

### Container não inicia
```bash
docker-compose logs [nome-do-servico]
docker-compose up --force-recreate [nome-do-servico]
```

### Prometheus target DOWN
```bash
# Verificar se Spring Boot está rodando
curl http://localhost:5000/actuator/health

# Verificar endpoint de métricas
curl http://localhost:5000/actuator/prometheus
```

### Logs não aparecem no Grafana
```bash
# Verificar Promtail
docker logs inovatech-promtail

# Verificar se arquivos de log existem
ls -la ../infra/logs/spring-boot/

# Reiniciar Promtail
docker-compose restart promtail
```

### Resetar tudo
```bash
docker-compose down -v
docker-compose up -d
```

---

## 📁 Estrutura de Arquivos Importantes

```
infra/
├── docker-compose.yml           # Orquestração
├── prometheus/
│   └── prometheus.yml          # Targets e jobs
├── loki/
│   ├── loki-config.yml        # Configuração Loki
│   └── promtail-config.yml    # Coletor de logs
├── tempo/
│   └── tempo.yml              # Configuração tracing
├── grafana/
│   └── provisioning/
│       └── datasources/       # Data sources
└── logs/                      # Logs da aplicação
    └── spring-boot/
```

---

## 🎓 Módulos do Treinamento

| Módulo | Tópico | Tempo | Arquivo |
|--------|--------|-------|---------|
| 1 | Setup e Fundamentos | 45 min | [README.md](README.md) |
| 2 | Logs Estruturados | 1h30 | [MODULO-02-LOGS.md](MODULO-02-LOGS.md) |
| 3 | Métricas com Micrometer | 2h | [MODULO-03-METRICAS.md](MODULO-03-METRICAS.md) |
| 4 | Distributed Tracing | 1h30 | Em breve |
| 5 | Alertas e Monitoramento | 1h | Em breve |
| 6 | Frontend Observability | 1h | Em breve |

---

## 📝 Checklist de Validação

### Stack de Observabilidade
- [ ] 5 containers rodando (`docker-compose ps`)
- [ ] Grafana acessível (http://localhost:3000)
- [ ] Prometheus acessível (http://localhost:9090)
- [ ] Data sources configurados no Grafana

### Backend (Spring Boot)
- [ ] Aplicação rodando na porta 5000
- [ ] Swagger acessível
- [ ] `/actuator/prometheus` retorna métricas
- [ ] Logs sendo gerados em `infra/logs/spring-boot/`

### Grafana
- [ ] 3 data sources testados (Prometheus, Loki, Tempo)
- [ ] Dashboard de logs criado
- [ ] Dashboard de métricas criado

---

## 🔑 Comandos Maven

```bash
# Compilar
mvn clean package

# Rodar aplicação
mvn spring-boot:run

# Rodar testes
mvn test

# Limpar target
mvn clean
```

---

## 📚 Links Úteis

- [Grafana Docs](https://grafana.com/docs/)
- [Prometheus Docs](https://prometheus.io/docs/)
- [LogQL](https://grafana.com/docs/loki/latest/logql/)
- [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Micrometer](https://micrometer.io/docs)

---

## 🆘 Suporte

Se algo não estiver funcionando:

1. ✅ Verifique se todos os containers estão UP
2. ✅ Consulte os logs: `docker-compose logs [servico]`
3. ✅ Verifique a documentação específica do módulo
4. ✅ Revise o README.md principal

---

**Versão:** 1.0  
**Data:** 03/02/2026
