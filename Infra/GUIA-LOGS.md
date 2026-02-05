# 📋 Guia: Como Identificar Logs de Frontend vs Backend

## 🗂️ 1. Separação por Arquivos

Os logs são salvos em arquivos **separados**:

```
Infra/logs/spring-boot/
├── 📄 backend.log    ← Logs do Spring Boot (Java)
└── 📄 frontend.log   ← Logs do navegador (JavaScript)
```

## 🔍 2. Diferenças na Estrutura JSON

### **BACKEND (backend.log)**
```json
{
  "@timestamp": "2026-02-04T16:58:43.897-03:00",
  "level": "INFO",
  "message": "Starting InovaTechApplication...",
  
  // 🎯 IDENTIFICADORES DO BACKEND
  "tier": "backend",                    ← Sempre "backend"
  "application": "InovaTech",
  "logger_name": "br.com.InovaTech...", ← Nome da classe Java
  "thread_name": "main",                ← Thread Java
  
  // Metadados técnicos
  "appName": "InovaTech",
  "environment": "dev"
}
```

### **FRONTEND (frontend.log)**
```json
{
  "@timestamp": "2026-02-04T18:30:15.123-03:00",
  "level": "INFO",
  "message": "FRONTEND_LOG: {...}",     ← Prefixo "FRONTEND_LOG:"
  
  // 🎯 IDENTIFICADORES DO FRONTEND
  "tier": "frontend",                   ← Sempre "frontend"
  
  // Dentro do FRONTEND_LOG (nested JSON):
  "context": "Auth",                    ← Contexto: Auth, API, UI
  "url": "http://localhost:5173/login", ← URL da página
  "userAgent": "Mozilla/5.0...",        ← Navegador do usuário
  "metadata": {
    "usuario": "teste@example.com",
    "action": "login"
  }
}
```

## 🏷️ 3. Campo "tier" - Principal Identificador

| Campo | Backend | Frontend |
|-------|---------|----------|
| `tier` | **"backend"** | **"frontend"** |
| `logger_name` | Classe Java completa | "FRONTEND" |
| `message` | Mensagem direta | "FRONTEND_LOG: {json}" |

## 📊 4. No Grafana/Loki

### **Filtrar APENAS Backend:**
```logql
{job="spring-boot", tier="backend"}
```

### **Filtrar APENAS Frontend:**
```logql
{job="frontend", tier="frontend"}
```

### **Ver ambos:**
```logql
{job=~"spring-boot|frontend"}
```

## 🎨 5. Contextos Específicos do Frontend

O frontend tem **loggers por contexto**:

| Logger | Uso | Exemplo de Log |
|--------|-----|----------------|
| `Auth` | Login, logout, registro | "Tentativa de login" |
| `API` | Requisições HTTP | "Iniciando requisição: POST /clientes" |
| `UI` | Interações do usuário | "Usuário solicitou carregamento" |
| `Frontend` | Logs gerais | "Aplicação frontend inicializada" |

**Exemplo no log:**
```json
{
  "context": "API",              ← Identifica que é log de requisição
  "message": "Requisição /login",
  "metadata": {
    "duration": 245,             ← Tempo de resposta em ms
    "status": 200
  }
}
```

## 🔎 6. Identificação Visual Rápida

### Backend - Exemplos de Mensagens:
```
✓ "Starting InovaTechApplication..."
✓ "Entrando no método save..."
✓ "Cliente persistido com sucesso..."
✓ Nomes de classes Java (br.com.InovaTech...)
```

### Frontend - Exemplos de Mensagens:
```
✓ "FRONTEND_LOG: {...}"
✓ "Tentativa de login"
✓ "Erro global capturado"
✓ "Performance: Requisição /login"
✓ URLs do navegador (http://localhost:5173)
```

## 🧪 7. Como Testar

### 1️⃣ **Inicie o backend:**
```powershell
cd APP
mvn spring-boot:run
```

### 2️⃣ **Inicie o frontend:**
```powershell
cd FrontEnd
npm run dev
```

### 3️⃣ **Acesse a aplicação:**
```
http://localhost:5173
```

### 4️⃣ **Faça ações (login, cadastro)**

### 5️⃣ **Verifique os logs:**

**Frontend:**
```powershell
# Windows PowerShell
Get-Content .\Infra\logs\spring-boot\frontend.log -Wait

# Ou abra no VS Code
code .\Infra\logs\spring-boot\frontend.log
```

**Backend:**
```powershell
Get-Content .\Infra\logs\spring-boot\backend.log -Wait
```

## 📈 8. Promtail - Como os Logs São Coletados

O Promtail lê os arquivos e adiciona labels:

```yaml
# Backend
- job_name: spring-boot-backend
  labels:
    job: spring-boot
    application: inovatech-backend
    tier: backend                    ← Label automático
    __path__: /logs/spring-boot/backend*.log

# Frontend  
- job_name: frontend-logs
  labels:
    job: frontend
    application: inovatech-frontend
    tier: frontend                   ← Label automático
    __path__: /logs/spring-boot/frontend*.log
```

## ✅ Resumo - Como Saber Qual é Qual

| Característica | Backend | Frontend |
|----------------|---------|----------|
| **Arquivo** | `backend.log` | `frontend.log` |
| **Campo `tier`** | `"backend"` | `"frontend"` |
| **Prefixo na mensagem** | — | `"FRONTEND_LOG:"` |
| **Logger name** | Classe Java | `"FRONTEND"` |
| **Tem `thread_name`?** | ✅ Sim | ❌ Não |
| **Tem `url` e `userAgent`?** | ❌ Não | ✅ Sim |
| **Tem `context`?** | ❌ Não | ✅ Sim (Auth, API, UI) |

---

## 🎯 Exemplo Completo

**Cenário:** Usuário faz login

### Frontend envia (frontend.log):
```json
{
  "timestamp": "2026-02-04T18:30:15.123Z",
  "level": "INFO",
  "context": "Auth",
  "message": "Tentativa de login",
  "tier": "frontend",
  "url": "http://localhost:5173/login",
  "userAgent": "Mozilla/5.0...",
  "metadata": {
    "usuario": "teste@example.com"
  }
}
```

### Backend processa (backend.log):
```json
{
  "@timestamp": "2026-02-04T18:30:15.234-03:00",
  "level": "INFO",
  "message": "Processando login para: teste@example.com",
  "logger_name": "br.com.InovaTech.service.impl.AuthServiceImpl",
  "tier": "backend",
  "thread_name": "http-nio-5000-exec-1"
}
```

**Ambos os logs têm `tier` diferente e aparecem em arquivos separados!** 🎉
