# 📋 Treinamento Postman - API InovaTech

## 🚀 Executar a Aplicação

Antes de começar os testes, execute a aplicação Spring Boot:

```bash
mvn spring-boot:run
```

A aplicação estará disponível em: `http://localhost:5000`

---

## 📚 Conceitos Básicos do Postman

### 1. **Request (Requisição)**
Uma requisição é uma chamada HTTP para um endpoint específico. Contém:
- **Método HTTP** (GET, POST, PUT, DELETE)
- **URL** do endpoint
- **Headers** (cabeçalhos)
- **Body** (corpo da requisição, quando aplicável)

### 2. **Collection (Coleção)**
Uma coleção é um grupo organizados de requisições relacionadas. Permite:
- Organizar testes por funcionalidade
- Executar múltiplas requisições em sequência
- Compartilhar testes com a equipe

### 3. **Environment (Ambiente)**
Ambiente permite definir variáveis reutilizáveis como:
- URLs base (localhost, staging, production)
- Tokens de autenticação
- IDs de recursos
- Dados de teste

### 4. **Test Scripts**
Scripts JavaScript executados após cada requisição para:
- Validar status codes
- Verificar conteúdo da resposta
- Extrair dados para uso posterior
- Salvar variáveis de ambiente

---

## 🏗️ Estrutura dos Testes

Organizaremos os testes em 3 níveis, seguindo a pirâmide de testes:

```
📁 InovaTech API Tests
├── 🔧 API Tests (Testes Unitários de API)
├── 🔗 Integration Tests (Testes de Integração)
└── 🎯 E2E Tests (Testes End-to-End)
```

---

## 🎯 1. API TESTS (Testes Unitários de API)

### 1.1 Criando a Collection

1. **Criar Nova Collection:**
   - Clique em "New" → "Collection"
   - Nome: `InovaTech - API Tests`
   - Descrição: `Testes unitários dos endpoints da API InovaTech`

2. **Criar Environment:**
   - Clique no ícone de "Settings" (⚙️) → "Manage Environments"
   - Clique "Add"
   - Nome: `InovaTech Local`
   - Adicione as variáveis:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `baseUrl` | `http://localhost:5000` | `http://localhost:5000` |
| `senhaPadrao` | `teste123` | `teste123` |
| `clienteId` | `` | `` |
| `clienteUsuario` | `` | `` |

### 1.2 Requisições da Collection API Tests

#### 📝 POST - Criar Cliente

- **Nome:** `POST - Criar Cliente`
- **Método:** `POST`
- **URL:** `{{baseUrl}}/clientes`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw - JSON):**
  ```json
  {
      "PrimeiroNome": "Paulo",
      "UltimoNome": "Jorge",
      "Usuario": "paulo.jorge@zPj9AtbSi08r1gij.com",
      "Estado": "RJ",
      "Cidade": "123",
      "Senha": "teste123"
  }
  ```

- **Tests (Post-response Script):**
  ```javascript
  // Teste simples de status code
  pm.test("Status code is 201", function () {
      pm.response.to.have.status(201);
  });
  
  // Teste de estrutura da resposta
  pm.test("Response has required fields", function () {
      var jsonData = pm.response.json();
      pm.expect(jsonData).to.have.property('id');
      pm.expect(jsonData).to.have.property('PrimeiroNome');
      pm.expect(jsonData).to.have.property('Usuario');
  });
  
  // Teste de valores específicos
  pm.test("Cliente created with correct data", function () {
      var jsonData = pm.response.json();
      pm.expect(jsonData.PrimeiroNome).to.eql("Paulo");
      pm.expect(jsonData.UltimoNome).to.eql("Jorge");
  });
  ```

#### 📖 GET - Listar Clientes

- **Nome:** `GET - Listar Clientes`
- **Método:** `GET`
- **URL:** `{{baseUrl}}/clientes`

- **Tests:**
  ```javascript
  pm.test("Status code is 200", function () {
      pm.response.to.have.status(200);
  });
  
  pm.test("Response is an array", function () {
      var jsonData = pm.response.json();
      pm.expect(jsonData).to.be.an('array');
  });
  ```

#### 🗑️ DELETE - Deletar Cliente (Simulado)

- **Nome:** `DELETE - Deletar Cliente`
- **Método:** `GET`
- **URL:** `{{baseUrl}}/clientes/1`
- **Descrição:** `Nota: Como não há endpoint DELETE implementado, usamos GET por ID para simular`

- **Tests:**
  ```javascript
  pm.test("Status code is 200 or 404", function () {
      pm.expect(pm.response.code).to.be.oneOf([200, 404]);
  });
  ```

### 1.3 Usando IA para Documentação

1. **Selecione a Collection** → clique em "⋯" → "Edit"
2. **Na aba "Documentation":**
   - Clique em "Generate with AI" (se disponível)
   - Ou adicione manualmente:

```markdown
# InovaTech API Tests

Esta collection contém testes unitários para validar os endpoints individuais da API InovaTech.

## Endpoints Testados:
- POST /clientes - Criação de novos clientes
- GET /clientes - Listagem de clientes
- GET /clientes/{id} - Busca cliente por ID

## Como Executar:
1. Certifique-se que a aplicação está rodando
2. Selecione o environment "InovaTech Local"
3. Execute a collection completa ou requests individuais
```

---

## 🔗 2. INTEGRATION TESTS (Testes de Integração)

### 2.1 Criando a Collection

- **Nome:** `InovaTech - Integration Tests`
- **Descrição:** `Testes de integração entre múltiplos endpoints`

### 2.2 Requisições da Collection Integration Tests

#### 📝 POST - Criar Cliente (Integração)

- **Nome:** `POST - Criar Cliente`
- **Configuração:** Copie da collection anterior
- **Body:** Use o mesmo JSON

- **Tests (Post-response Script Atualizado):**
  ```javascript
  // Teste básico de status
  pm.test("Status code is 201", function () {
      pm.response.to.have.status(201);
  });
  
  // Extrai 'id' e 'Usuario' do corpo da resposta JSON e salva como variáveis de ambiente
  pm.test("Extrair id e Usuario e salvar como variáveis de ambiente", function () {
      // Garante que a resposta é JSON
      pm.response.to.have.status(201);
  
      var jsonData = pm.response.json();
      if (jsonData && jsonData.id !== undefined && jsonData.Usuario) {
          pm.environment.set("clienteId", jsonData.id);
          pm.environment.set("clienteUsuario", jsonData.Usuario);
      } else {
          pm.test("Campos 'id' e 'Usuario' presentes na resposta", function () {
              pm.expect(jsonData.id, "Campo 'id' ausente").to.not.be.undefined;
              pm.expect(jsonData.Usuario, "Campo 'Usuario' ausente").to.not.be.undefined;
          });
      }
  });
  ```

#### 📧 POST - Enviar Email

- **Nome:** `POST - Enviar Email`
- **Método:** `POST`
- **URL:** `{{baseUrl}}/mailing`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw - JSON):**
  ```json
  {
    "Email": "{{clienteUsuario}}"
  }
  ```

- **Tests:**
  ```javascript
  pm.test("Status code is 200", function () {
      pm.response.to.have.status(200);
      
      var jsonData = pm.response.json();
      pm.expect(jsonData.Mensagem).to.eql("Email enviado com sucesso!");
  });
  
  pm.test("Response has success field", function () {
      var jsonData = pm.response.json();
      pm.expect(jsonData.Sucesso).to.be.true;
  });
  ```

---

## 🎯 3. E2E TESTS (Testes End-to-End)

### 3.1 Criando a Collection

- **Nome:** `InovaTech - E2E Tests`
- **Descrição:** `Testes completos simulando fluxo real do usuário`

### 3.2 Requisições da Collection E2E Tests

#### 📝 POST - Criar Cliente (E2E)

- **Configuração:** Copie da collection Integration Tests
- **Mesmo conteúdo do POST - Criar Cliente da integração**

#### 📧 POST - Enviar Email (E2E)

- **Configuração:** Copie da collection Integration Tests
- **Mesmo conteúdo do POST - Enviar Email da integração**

#### 🔐 POST - Login

- **Nome:** `POST - Login`
- **Método:** `POST`
- **URL:** `{{baseUrl}}/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw - JSON):**
  ```json
  {
      "Usuario": "{{clienteUsuario}}",
      "Senha": "{{senhaPadrao}}"
  }
  ```

- **Tests:**
  ```javascript
  // Valida status 200
  pm.test("Status code is 200", function () {
      pm.response.to.have.status(200);
  });

  // Valida que o campo 'Mensagem' é igual a "Login realizado com sucesso"
  pm.test("Mensagem é 'Login realizado com sucesso'", function () {
      var jsonData = pm.response.json();
      pm.expect(jsonData.Mensagem).to.eql("Login realizado com sucesso");
  });

  // Extrai 'id' e 'Usuario' de Cliente, se presentes, e salva como variáveis de ambiente
  pm.test("Extrair Cliente.id e Cliente.Usuario e salvar como variáveis de ambiente", function () {
      var jsonData = pm.response.json();
      if (jsonData.Cliente && jsonData.Cliente.id !== undefined && jsonData.Cliente.Usuario) {
          pm.environment.set("clienteId", jsonData.Cliente.id);
          pm.environment.set("clienteUsuario", jsonData.Cliente.Usuario);
      } else {
          pm.test("Campos 'Cliente.id' e 'Cliente.Usuario' presentes na resposta", function () {
              pm.expect(jsonData.Cliente && jsonData.Cliente.id, "Campo 'Cliente.id' ausente").to.not.be.undefined;
              pm.expect(jsonData.Cliente && jsonData.Cliente.Usuario, "Campo 'Cliente.Usuario' ausente").to.not.be.undefined;
          });
      }
  });
  
  // Valida estrutura completa da resposta
  pm.test("Login response has correct structure", function () {
      var jsonData = pm.response.json();
      pm.expect(jsonData).to.have.property('Sucesso');
      pm.expect(jsonData).to.have.property('Mensagem');
      pm.expect(jsonData).to.have.property('Cliente');
      pm.expect(jsonData.Sucesso).to.be.true;
  });
  ```

---

## 🎮 Como Executar os Testes

### Execução Individual
1. Selecione o environment "InovaTech Local"
2. Clique em uma requisição
3. Clique "Send"
4. Veja os resultados na aba "Test Results"

### Execução da Collection Completa
1. Clique na collection
2. Clique "Run" ou "▶️"
3. Selecione as requisições desejadas
4. Clique "Run InovaTech..."
5. Veja o relatório detalhado

### Ordem de Execução Recomendada

**Para E2E Tests:**
1. POST - Criar Cliente (salva variáveis)
2. POST - Enviar Email (usa email do cliente criado)
3. POST - Login (usa credenciais do cliente criado)

---

## 📊 Interpretando os Resultados

### ✅ Testes Passando
- **Verde:** Todos os testes passaram
- **Tempo de resposta:** Deve ser < 1000ms para boa performance

### ❌ Testes Falhando
- **Vermelho:** Teste falhou
- **Verifique:** Status code, estrutura da resposta, valores específicos
- **Debug:** Use `console.log()` nos scripts de teste

### 📈 Métricas Importantes
- **Status Code:** 200/201 para sucesso
- **Response Time:** < 1000ms
- **Test Pass Rate:** 100%

---

## 🔧 Dicas Avançadas

### Variáveis Dinâmicas
```javascript
// Gerar email único
pm.environment.set("randomEmail", `test${Date.now()}@test.com`);
```

### Validações Robustas
```javascript
// Verificar se campo existe antes de acessar
pm.test("Safe property access", function () {
    var jsonData = pm.response.json();
    if (jsonData && jsonData.Cliente) {
        pm.expect(jsonData.Cliente.id).to.exist;
    }
});
```

### Cleanup após Testes
```javascript
// Limpar variáveis após uso
pm.environment.unset("clienteId");
```

---

## �️ Execução via Newman (Command Line)

O Newman é a ferramenta de linha de comando do Postman que permite executar collections diretamente no terminal, ideal para integração em pipelines de CI/CD.

### 📦 Instalação do Newman

Primeiro, você precisa instalar o Newman globalmente usando npm:

```bash
npm install -g newman
```

**Pré-requisitos:**
- Node.js instalado (versão 12 ou superior)
- NPM (vem com Node.js)

### 📤 Exportando Collections e Environments

#### 1. Exportar Collection
1. No Postman, clique na collection desejada
2. Clique nos "⋯" (três pontos) → "Export"
3. Escolha "Collection v2.1" (recomendado)
4. Clique "Export" e salve o arquivo (ex: `InovaTech-API-Tests.postman_collection.json`)

#### 2. Exportar Environment
1. Clique no ícone de "Settings" (⚙️) → "Manage Environments"
2. Clique nos "⋯" ao lado do environment → "Export"
3. Salve o arquivo (ex: `InovaTech-Local.postman_environment.json`)

### 🚀 Executando Collections com Newman

#### Execução Básica
```bash
# Executar collection sem environment
newman run InovaTech-API-Tests.postman_collection.json

# Executar collection com environment
newman run InovaTech-API-Tests.postman_collection.json -e InovaTech-Local.postman_environment.json
```

#### Execução com Relatórios Detalhados
```bash
# Relatório HTML
newman run InovaTech-API-Tests.postman_collection.json \
  -e InovaTech-Local.postman_environment.json \
  -r html --reporter-html-export results.html

# Relatório JSON
newman run InovaTech-API-Tests.postman_collection.json \
  -e InovaTech-Local.postman_environment.json \
  -r json --reporter-json-export results.json

# Múltiplos relatórios
newman run InovaTech-API-Tests.postman_collection.json \
  -e InovaTech-Local.postman_environment.json \
  -r html,json,cli \
  --reporter-html-export results.html \
  --reporter-json-export results.json
```

#### Execução com Configurações Avançadas
```bash
# Com timeout personalizado e iterações múltiplas
newman run InovaTech-E2E-Tests.postman_collection.json \
  -e InovaTech-Local.postman_environment.json \
  --timeout 10000 \
  --iteration-count 3 \
  --delay-request 1000 \
  -r html --reporter-html-export e2e-results.html

# Executar apenas requisições específicas
newman run InovaTech-API-Tests.postman_collection.json \
  -e InovaTech-Local.postman_environment.json \
  --folder "API Tests"
```

### 📊 Interpretando Resultados do Newman

#### Saída no Terminal
```bash
newman

InovaTech - API Tests

→ POST - Criar Cliente
  POST http://localhost:5000/clientes [201 Created, 523B, 145ms]
  ✓ Status code is 201
  ✓ Response has required fields
  ✓ Cliente created with correct data

→ GET - Listar Clientes  
  GET http://localhost:5000/clientes [200 OK, 298B, 23ms]
  ✓ Status code is 200
  ✓ Response is an array

┌─────────────────────────┬──────────────────┬──────────────────┐
│                         │         executed │           failed │
├─────────────────────────┼──────────────────┼──────────────────┤
│              iterations │                1 │                0 │
├─────────────────────────┼──────────────────┼──────────────────┤
│                requests │                2 │                0 │
├─────────────────────────┼──────────────────┼──────────────────┤
│            test-scripts │                4 │                0 │
├─────────────────────────┼──────────────────┼──────────────────┤
│      prerequest-scripts │                0 │                0 │
├─────────────────────────┼──────────────────┼──────────────────┤
│              assertions │                5 │                0 │
├─────────────────────────┼──────────────────┼──────────────────┤
│ total run duration: 234ms                                     │
├─────────────────────────┼──────────────────┼──────────────────┤
│ total data received: 821B (approx)                            │
├─────────────────────────┼──────────────────┼──────────────────┤
│ average response time: 84ms                                   │
└─────────────────────────┴──────────────────┴──────────────────┘
```

### 🔄 Integração com CI/CD

#### Exemplo para GitHub Actions
```yaml
# .github/workflows/api-tests.yml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install Newman
      run: npm install -g newman
      
    - name: Start Application
      run: |
        cd APP
        mvn spring-boot:run &
        sleep 30  # Aguarda aplicação iniciar
        
    - name: Run API Tests
      run: |
        newman run tests/postman/InovaTech-API-Tests.postman_collection.json \
          -e tests/postman/InovaTech-Local.postman_environment.json \
          -r html --reporter-html-export api-test-results.html
          
    - name: Upload Test Results
      uses: actions/upload-artifact@v2
      with:
        name: test-results
        path: api-test-results.html
```

#### Exemplo para Pipeline Jenkins
```groovy
pipeline {
    agent any
    
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install -g newman'
            }
        }
        
        stage('Start Application') {
            steps {
                sh 'cd APP && mvn spring-boot:run &'
                sh 'sleep 30'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh '''
                    newman run tests/postman/InovaTech-E2E-Tests.postman_collection.json \
                      -e tests/postman/InovaTech-Local.postman_environment.json \
                      -r html,json \
                      --reporter-html-export e2e-results.html \
                      --reporter-json-export e2e-results.json
                '''
            }
        }
        
        stage('Publish Results') {
            steps {
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: '.',
                    reportFiles: 'e2e-results.html',
                    reportName: 'API Test Report'
                ])
            }
        }
    }
}
```

### 📝 Scripts Úteis

#### Script de Automação Completa
```bash
#!/bin/bash
# run-tests.sh

echo "🚀 Iniciando testes automatizados..."

# Inicia aplicação em background
cd APP
mvn spring-boot:run > app.log 2>&1 &
APP_PID=$!

# Aguarda aplicação inicializar
echo "⏳ Aguardando aplicação inicializar..."
sleep 30

# Executa testes
echo "🧪 Executando testes..."
cd ../tests/postman

# API Tests
newman run InovaTech-API-Tests.postman_collection.json \
  -e InovaTech-Local.postman_environment.json \
  -r html --reporter-html-export api-results.html

# Integration Tests  
newman run InovaTech-Integration-Tests.postman_collection.json \
  -e InovaTech-Local.postman_environment.json \
  -r html --reporter-html-export integration-results.html

# E2E Tests
newman run InovaTech-E2E-Tests.postman_collection.json \
  -e InovaTech-Local.postman_environment.json \
  -r html --reporter-html-export e2e-results.html

echo "✅ Testes concluídos!"
echo "📊 Relatórios gerados:"
echo "  - api-results.html"
echo "  - integration-results.html" 
echo "  - e2e-results.html"

# Finaliza aplicação
kill $APP_PID
```

#### Script PowerShell (Windows)
```powershell
# run-tests.ps1
Write-Host "🚀 Iniciando testes automatizados..." -ForegroundColor Green

# Inicia aplicação
Set-Location APP
Start-Process -FilePath "mvn" -ArgumentList "spring-boot:run" -WindowStyle Hidden
Start-Sleep 30

# Executa testes
Set-Location ..\tests\postman

Write-Host "🧪 Executando API Tests..." -ForegroundColor Yellow
newman run InovaTech-API-Tests.postman_collection.json `
  -e InovaTech-Local.postman_environment.json `
  -r html --reporter-html-export api-results.html

Write-Host "🔗 Executando Integration Tests..." -ForegroundColor Yellow  
newman run InovaTech-Integration-Tests.postman_collection.json `
  -e InovaTech-Local.postman_environment.json `
  -r html --reporter-html-export integration-results.html

Write-Host "🎯 Executando E2E Tests..." -ForegroundColor Yellow
newman run InovaTech-E2E-Tests.postman_collection.json `
  -e InovaTech-Local.postman_environment.json `
  -r html --reporter-html-export e2e-results.html

Write-Host "✅ Testes concluídos!" -ForegroundColor Green
Write-Host "📊 Relatórios disponíveis em tests/postman/" -ForegroundColor Cyan
```

### 🎯 Vantagens do Newman

- **Automação:** Execução automática em pipelines
- **Relatórios:** Geração de relatórios detalhados
- **CI/CD:** Integração fácil com ferramentas de CI/CD
- **Scripting:** Possibilidade de criar scripts personalizados
- **Monitoramento:** Execução agendada de testes
- **Escalabilidade:** Execução paralela de múltiplas collections

---

## �📚 Recursos Adicionais

- **Documentação Postman:** https://learning.postman.com/
- **Newman (CLI):** Para executar collections via linha de comando
- **Postman Monitors:** Para execução agendada dos testes
- **API Documentation:** Gerar documentação automática da API
- **Newman Documentação:** https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/