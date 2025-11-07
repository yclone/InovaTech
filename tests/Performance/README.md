# 🚀 Treinamento K6 - Testes de Performance Completos

## 🌟 Visão Geral

Este treinamento aborda como criar testes de performance completos usando K6 para a aplicação InovaTech, cobrindo tanto a **API (Backend)** quanto a **interface web (Frontend)**. Você aprenderá diferentes tipos de testes de carga e como analisar métricas de performance.

**Duração Total:** 180 minutos  
**Pré-requisitos:**
- 🚀 **Backend:** Aplicação API rodando em `http://localhost:5000`
- 🌐 **Frontend:** Interface web rodando em `http://localhost:5173`
- 📦 **K6:** Ferramenta de teste instalada

---

## 📋 Estrutura do Treinamento

```
📁 K6 Performance Tests - InovaTech
├── 🏗️ Módulo 1: Setup e Instalação K6 (20 min)
├── 📊 Módulo 2: Testes Básicos de API (30 min)
├── ⚡ Módulo 3: Tipos de Testes de Carga (60 min)
├── 🌐 Módulo 4: Testes de Frontend (40 min)
├── 📈 Módulo 5: Análise de Métricas (20 min)
└── 🎯 Módulo 6: Executando e Relatórios (10 min)
```

---

## 🏗️ Módulo 1: Setup e Instalação K6 (20 minutos)

### 1.1 Instalação do K6 (10 min)

#### **Windows (PowerShell):**
```powershell
# Usando Chocolatey
choco install k6

# Ou usando Scoop
scoop install k6

# Ou baixar direto do site
# https://k6.io/docs/get-started/installation/
```

#### **Verificar instalação:**
```bash
k6 version
```

### 1.2 Estrutura do Projeto (10 min)

```
tests/Performance/
├── package.json
├── README.md
├── config/
│   └── environments.js
├── tests/
│   ├── health-check.js
│   ├── load-test.js
│   ├── stress-test.js
│   ├── spike-test.js
│   ├── volume-test.js
│   ├── soak-test.js
│   ├── breakpoint-test.js
│   ├── api-crud-test.js
│   └── frontend-test.js
├── utils/
│   ├── data-generator.js
│   ├── helpers.js
│   └── thresholds.js
└── reports/
    └── (relatórios serão gerados aqui)
```

---

## 📊 Módulo 2: Testes Básicos de API (30 minutos)

### 2.1 Health Check - Verificação Básica (10 min)

Primeiro teste para verificar se a API está respondendo.

### 2.2 CRUD Operations - Operações Básicas (20 min)

Testes das operações de Create, Read, Update, Delete na API.

---

## ⚡ Módulo 3: Tipos de Testes de Carga (60 minutos)

### 3.1 Load Test - Teste de Carga Normal (15 min)
Simula condições normais de uso.

### 3.2 Stress Test - Teste de Estresse (15 min)
Testa os limites da aplicação.

### 3.3 Spike Test - Teste de Pico (10 min)
Simula picos súbitos de tráfego.

### 3.4 Volume Test - Teste de Volume (10 min)
Testa com grande quantidade de dados.

### 3.5 Soak Test - Teste de Resistência (10 min)
Testa estabilidade por período prolongado.

---

## 🌐 Módulo 4: Testes de Frontend (40 minutos)

### 4.1 Browser Testing com K6 (20 min)
Testes de performance da interface web.

### 4.2 Fluxos de Usuário Completos (20 min)
Cadastro, login e navegação.

---

## 📈 Módulo 5: Análise de Métricas (20 minutos)

### 5.1 Métricas Padrão do K6 (10 min)
- Response time
- Throughput
- Error rate
- Virtual users

### 5.2 Métricas Customizadas (10 min)
- Counters
- Gauges
- Rates
- Trends

---

## 🎯 Módulo 6: Executando e Relatórios (10 minutos)

### 6.1 Executando Testes (5 min)
Comandos para rodar os diferentes tipos de teste.

### 6.2 Gerando Relatórios (5 min)
HTML reports e integração com ferramentas de monitoramento.

---

## 🚀 Comandos Principais

```bash
# Executar teste específico
k6 run tests/health-check.js

# Executar com parâmetros
k6 run tests/load-test.js --vus 50 --duration 2m

# Gerar relatório HTML
k6 run --out json=reports/results.json tests/load-test.js

# Executar todos os testes
npm run test:all
```

---

## 🎓 Objetivos de Aprendizagem

Ao final deste treinamento, você será capaz de:

- ✅ Configurar e executar testes de performance com K6
- ✅ Implementar diferentes tipos de testes de carga
- ✅ Analisar métricas de performance
- ✅ Testar tanto API quanto Frontend
- ✅ Gerar relatórios detalhados
- ✅ Identificar gargalos de performance
- ✅ Estabelecer thresholds de qualidade
- ✅ Integrar testes de performance em CI/CD

---

## 📚 Recursos Adicionais

- [K6 Documentation](https://k6.io/docs/)
- [Performance Testing Types](https://k6.io/docs/test-types/)
- [K6 Examples](https://k6.io/docs/examples/)
- [Grafana Integration](https://k6.io/docs/results-visualization/grafana-dashboard/)