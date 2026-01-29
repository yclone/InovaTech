# 🚀 Guia Completo - Cypress + Cucumber para Testes de API

## 📋 Índice
1. [Preparação do Ambiente](#1-preparação-do-ambiente)
2. [Instalação e Configuração](#2-instalação-e-configuração)
3. [Arquitetura de Referência](#3-arquitetura-de-referência)
4. [Exemplos de Uso](#4-exemplos-de-uso)
5. [Troubleshooting](#5-troubleshooting)

---

## 1. Preparação do Ambiente

### ⚙️ 1.1 Verificar Serviços

Antes de começar, certifique-se de que os serviços estão rodando:

**🔧 Backend (API):**
```bash
# Na pasta APP/
mvn spring-boot:run
# ✅ Deve estar rodando em: http://localhost:5000
```

**🖥️ Frontend (Interface):**
```bash
# Na pasta FrontEnd/
npm install
npm run dev
# ✅ Deve estar rodando em: http://localhost:5173
```

---

## 2. Instalação e Configuração

### 📦 2.1 Criar Projeto do Zero

**Passo 1: Criar pasta do projeto**
```bash
mkdir cypress-inovatech-tests
cd cypress-inovatech-tests
```

**Passo 2: Inicializar npm**
```bash
npm init -y
```

**Passo 3: Instalar Cypress**
```bash
npm install cypress --save-dev
```

**Passo 4: Abrir Cypress pela primeira vez**
```bash
npx cypress open
```

> 💡 **Dica:** Selecione a opção "E2E Testing" e clique em "Continue" para criar a estrutura inicial.  
> Serão criadas as pastas: `cypress/e2e`, `cypress/support`, `cypress.config.js`

---

### 📚 2.2 Instalar Dependências

**Cucumber para Cypress:**
```bash
npm i cypress-cucumber-preprocessor@4.3.1
```

**JSON Schema (validação de JSON):**
```bash
npm i jsonschema@^1.5.0
```

**Mocha e Reports:**
```bash
npm i mocha@^11.2.2
npm i mochawesome@7.1.3
npm i mochawesome-merge@^5.0.0
```

---

### ⚙️ 2.3 Configurar Cypress Config

Edite o arquivo **`cypress.config.js`**:

```javascript
const { defineConfig } = require("cypress");
const cucumber = require('cypress-cucumber-preprocessor').default;

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber());
    },
    specPattern: 'cypress/integration/specs/**/*.feature'
  },
});
```

> ⚠️ **Importante:** Crie manualmente as pastas:  
> - `cypress/integration/specs/` (para arquivos `.feature`)  
> - `cypress/integration/step_definitions/` (para os steps)

---

### 📝 2.4 Configurar Package.json

Adicione a configuração do Cucumber no **`package.json`**:

```json
{
  "name": "prj_base",
  "version": "1.0.0",
  "description": "Testes automatizados com Cypress + Cucumber",
  "main": "index.js",
  "scripts": {
    "test": "cypress run",
    "test:chrome": "cypress run --browser chrome",
    "test:headed": "cypress run --headed",
    "cypress:open": "cypress open"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "devDependencies": {
    "cypress": "^15.9.0"
  },
  "dependencies": {
    "cypress-cucumber-preprocessor": "^4.3.1",
    "jsonschema": "^1.5.0",
    "mocha": "^11.7.5",
    "mochawesome": "^7.1.3",
    "mochawesome-merge": "^5.1.0"
  },
  "cypress-cucumber-preprocessor": {
    "nonGlobalStepDefinitions": false,
    "integrationFolder": "cypress/integration/specs/",
    "step_definitions": "cypress/integration/step_definitions/"
  }
}
```

---

### 🎯 2.5 Configuração Avançada (Opcional)

Para projetos mais complexos com múltiplos ambientes:

**cypress.config.js avançado:****cypress.config.js avançado:**
```javascript
const { defineConfig } = require('cypress');
const cucumber = require('cypress-cucumber-preprocessor').default;
const fs = require('fs-extra');
const path = require('path');

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('.', 'cypress', 'config', `${file}.json`);
  return fs.readJson(pathToConfigFile);
}

module.exports = defineConfig({
  projectId: 'seu-projeto-id',
  video: false,
  viewportWidth: 1520,
  viewportHeight: 880,
  chromeWebSecurity: false,
  numTestsKeptInMemory: 1,
  screenshotsFolder: 'reports/mochawesome-report/assets',
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'reports/mochawesome-report',
    overwrite: false,
    html: false,
    json: true,
    timestamp: 'mmddyyyy_HHMMss'
  },
  e2e: {
    specPattern: 'cypress/integration/specs/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    excludeSpecPattern: '*.js',
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber());
      const file = config.env.configFile || 'prod';
      return getConfigurationByFile(file);
    }
  }
});
```

**package.json com Cucumber JSON Reports:**
```json
{
  "cypress-cucumber-preprocessor": {
    "nonGlobalStepDefinitions": false,
    "integrationFolder": "cypress/integration/specs/",
    "step_definitions": "cypress/integration/step_definitions/",
    "cucumberJson": {
      "generate": true,
      "outputFolder": "cypress/cucumber-json",
      "filePrefix": "",
      "fileSuffix": ".cucumber"
    }
  }
}
```

---

## 3. Arquitetura de Referência

### 📁 3.1 Estrutura de Pastas Completa

```
cypress-inovatech-tests/
├── 📂 cypress/
│   ├── 📂 config/
│   │   ├── dev.json                     # Configurações de desenvolvimento
│   │   ├── staging.json                 # Configurações de staging
│   │   └── prod.json                    # Configurações de produção
│   │
│   ├── 📂 cucumber-json/                # Reports Cucumber (JSON)
│   │   └── .gitkeep
│   │
│   ├── 📂 fixtures/                     # Dados estáticos para testes
│   │   ├── usuarios.json
│   │   ├── produtos.json
│   │   └── example.json
│   │
│   ├── 📂 integration/
│   │   ├── 📂 specs/                    # Arquivos .feature (Gherkin/BDD)
│   │   │   ├── login.feature
│   │   │   ├── produtos.feature
│   │   │   └── usuarios.feature
│   │   │
│   │   ├── 📂 step_definitions/         # Implementação dos steps
│   │   │   └── 📂 Common/
│   │   │       ├── given.js             # Steps de configuração (Dado)
│   │   │       ├── when.js              # Steps de ações (Quando)
│   │   │       └── then.js              # Steps de validação (Então)
│   │   │
│   │   └── 📂 page_objects/             # Classes Page Object (POM)
│   │       ├── ConfiguracaoPage.js      # Configurações de testes
│   │       ├── RequisicaoPage.js        # Métodos de requisições HTTP
│   │       └── ValidacaoPage.js         # Métodos de validação
│   │
│   ├── 📂 support/
│   │   ├── commands.js                  # Comandos customizados
│   │   └── e2e.js                       # Configurações globais
│   │
│   └── 📂 reports/                      # Reports gerados
│       └── mochawesome-report/
│
├── cypress.config.js                    # Configuração principal
├── package.json                         # Dependências e scripts
└── README.md                            # Documentação
```

---

### 🏗️ 3.2 Componentes Principais

#### **🔧 Config (Configurações por Ambiente)**

Crie arquivos de configuração para cada ambiente:

**`cypress/config/prod.json`:**
```json
{
  "baseUrl": "https://api.inovatech.com.br",
  "apiKey": "your-api-key",
  "timeout": 30000,
  "retries": 2
}
```

**`cypress/config/dev.json`:**
```json
{
  "baseUrl": "http://localhost:5000",
  "apiKey": "dev-api-key",
  "timeout": 10000,
  "retries": 0
}
```

**Como usar:**
```bash
# Ambiente de produção
cypress run --env configFile=prod

# Ambiente de desenvolvimento
cypress run --env configFile=dev
```

---

#### **📦 Fixtures (Dados de Teste)**

Armazene dados reutilizáveis em JSON:

**`cypress/fixtures/usuarios.json`:**
```json
{
  "admin": {
    "email": "admin@inovatech.com.br",
    "senha": "Admin@123"
  },
  "usuario_comum": {
    "email": "usuario@inovatech.com.br",
    "senha": "User@123"
  }
}
```

**Uso nos testes:**
```javascript
cy.fixture('usuarios').then((dados) => {
  cy.wrap(dados.admin.email).as('email');
});
```

---

#### **🎭 Features (Specs - Gherkin/BDD)**

Escreva cenários de teste em linguagem natural:

**`cypress/integration/specs/login.feature`:**
```gherkin
# language: pt
Funcionalidade: Autenticação na API
  Como um usuário do sistema
  Quero fazer login na API
  Para acessar recursos protegidos

  Cenário: Login com credenciais válidas
    Dado Que defino a URL como "https://api.inovatech.com.br" para o caso de teste "Login Sucesso"
    E Que quero testar o "/auth/login"
    Quando Defino o content type do header como "application/json"
    E Faco a requisicao na API com o metodo de solicitacao "POST" e o body abaixo:
      """
      {
        "email": "usuario@teste.com",
        "password": "senha123"
      }
      """
    Entao Verifico se o status code e igual a "200"
    E Verifico se o valor da resposta "token" e diferente de ""
    E Guardo no Environment a chave "authToken" do ResponseBody com o valor "token"

  Cenário: Login com credenciais inválidas
    Dado Que defino a URL como "https://api.inovatech.com.br" para o caso de teste "Login Falha"
    E Que quero testar o "/auth/login"
    Quando Defino o content type do header como "application/json"
    E Faco a requisicao na API com o metodo de solicitacao "POST" e o body abaixo:
      """
      {
        "email": "usuario@teste.com",
        "password": "senha_errada"
      }
      """
    Entao Verifico se o status code e igual a "401"
    E Verifico se o valor da resposta "message" e igual a "Credenciais inválidas"
```

---

#### **📝 Step Definitions (Implementação dos Steps)**

##### **`given.js` - Configurações Iniciais**
```javascript
import { Given } from "cypress-cucumber-preprocessor/steps";

// Define o endpoint a ser testado
Given(/^Que quero testar o "([^"]*)"$/, (endpoint) => {
  cy.wrap(endpoint).as('endpoint');
  cy.wrap({}).as('headers');
});

// Define URL completa + caso de teste
Given(/^Que defino a URL como "([^"]*)" para o caso de teste "([^"]*)"$/, (url, testCase) => {
  cy.wrap(url).as('baseUrl');
  cy.wrap(testCase).as('testCase');
  cy.wrap('').as('endpoint');
  cy.wrap({}).as('headers');
});
```

##### **when.js - Ações e Requisições**
```javascript
import { When, And } from "cypress-cucumber-preprocessor/steps";

// Define content type do header
When(/^Defino o content type do header como "([^"]*)"$/, (contentType) => {
  cy.get('@headers').then((headers) => {
    const updatedHeaders = { ...headers, 'Content-Type': contentType };
    cy.wrap(updatedHeaders).as('headers');
  });
});

// Faz requisição com body
And(/^Faco a requisicao na API com o metodo de solicitacao "([^"]*)" e o body abaixo:$/, (method, docString) => {
  cy.get('@baseUrl').then((baseUrl) => {
    cy.wrap(null).then(() => {
      return cy.state('aliases')?.endpoint ? cy.get('@endpoint') : cy.wrap('');
    }).then((endpoint) => {
      cy.get('@headers').then((headers) => {
        const body = typeof docString === 'string' ? JSON.parse(docString) : docString;
        cy.request({
          method: method.toUpperCase(),
          url: `${baseUrl}${endpoint || ''}`,
          headers: headers,
          body: body,
          failOnStatusCode: false
        }).as('response');
      });
    });
  });
});
```

##### **then.js - Validações**
```javascript
import { Then, And } from "cypress-cucumber-preprocessor/steps";

// Valida status code
Then(/^Verifico se o status code e igual a "([^"]*)"$/, (statusCode) => {
  cy.get('@response').its('status').should('eq', parseInt(statusCode, 10));
});

// Valida valor de campo
And(/^Verifico se o valor da resposta "([^"]*)" e igual a "([^"]*)"$/, (field, expectedValue) => {
  cy.get('@response').its('body').then((body) => {
    const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], body);
    const parsedExpected = isNaN(expectedValue) ? expectedValue : Number(expectedValue);
    const parsedFieldValue = typeof fieldValue === 'string' && !isNaN(fieldValue) ? Number(fieldValue) : fieldValue;
    expect(parsedFieldValue).to.deep.equal(parsedExpected);
  });
});

// Armazena valor no Environment
And(/^Guardo no Environment a chave "([^"]*)" do ResponseBody com o valor "([^"]*)"$/, (key, field) => {
  cy.get('@response').its('body').then((body) => {
    const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], body);
    cy.wrap(fieldValue).as(key);
    Cypress.env(key, fieldValue);
  });
});
```

---

#### **🎨 Page Objects (Padrão POM)**

O padrão Page Object Model encapsula a lógica de interação:

##### **ConfiguracaoPage.js**
```javascript
class ConfiguracaoPage {
  definirEndpoint(endpoint) {
    cy.wrap(endpoint).as('endpoint');
    cy.wrap({}).as('headers');
    return this;
  }

  definirURLParaTeste(url, testCase) {
    cy.wrap(url).as('baseUrl');
    cy.wrap(testCase).as('testCase');
    cy.wrap({}).as('headers');
    return this;
  }
}

export default new ConfiguracaoPage();
```

##### **RequisicaoPage.js**
```javascript
class RequisicaoPage {
  definirContentType(contentType) {
    cy.get('@headers').then((headers) => {
      const updatedHeaders = { ...headers, 'Content-Type': contentType };
      cy.wrap(updatedHeaders).as('headers');
    });
    return this;
  }

  fazerRequisicaoComBody(method, body) {
    cy.get('@baseUrl').then((baseUrl) => {
      cy.get('@endpoint').then((endpoint) => {
        cy.get('@headers').then((headers) => {
          const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
          cy.request({
            method: method.toUpperCase(),
            url: `${baseUrl}${endpoint}`,
            headers: headers,
            body: parsedBody,
            failOnStatusCode: false
          }).as('response');
        });
      });
    });
    return this;
  }
}

export default new RequisicaoPage();
```

##### **ValidacaoPage.js**
```javascript
class ValidacaoPage {
  verificarStatusCode(statusCode) {
    cy.get('@response').its('status').should('eq', parseInt(statusCode, 10));
    return this;
  }

  verificarValorIgual(field, expectedValue) {
    cy.get('@response').its('body').then((body) => {
      const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], body);
      const parsedExpected = isNaN(expectedValue) ? expectedValue : Number(expectedValue);
      const parsedFieldValue = typeof fieldValue === 'string' && !isNaN(fieldValue) ? Number(fieldValue) : fieldValue;
      expect(parsedFieldValue).to.deep.equal(parsedExpected);
    });
    return this;
  }

  armazenarValorNoEnvironment(key, field) {
    cy.get('@response').its('body').then((body) => {
      const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], body);
      cy.wrap(fieldValue).as(key);
      Cypress.env(key, fieldValue);
    });
    return this;
  }
}

export default new ValidacaoPage();
``🎯 Vantagens do Page Object Model:**
- ✅ **Reutilização:** Código compartilhado entre testes
- ✅ **Manutenção:** Mudanças em um só lugar
- ✅ **Legibilidade:** Métodos fluentes e encadeamento
- ✅ **Organização:** Separação clara de responsabilidades
- ✅ **Testabilidade:** Facilita testes unitários

---

### 🔄 3estes mais legíveis

### 2.3 Fluxo de Execução dos Testes

```
1. Arquivo .feature (Gherkin)
   ↓
2. Step Definitions (Given/When/Then)
   ↓
3. Page Objects (Métodos reutilizáveis)
   ↓
4. Cypress Commands (Ações do Cypress)
   ↓
5. API/Aplicação
   ↓
6. Assertions e Relatórios
---

### 📊 3

### 2.4 Configuração de Reports

#### **Mochawesome (Reports HTML)**

No `cypress.config.js`:
```javascript
reporter: 'mochawesome',
reporterOptions: {
  reportDir: 'reports/mochawesome-report',
  overwrite: false,
  html: false,
  json: true,
  timestamp: 'mmddyyyy_HHMMss'
}
```

#### **Cucumber JSON Reports**

No `package.json`:
```json
"cypress-cucumber-preprocessor": {
  "nonGlobalStepDefinitions": false,
  "integrationFolder": "cypress/integration/specs/",
  "step_definitions": "cypress/integration/step_definitions/",
  "cucumberJson": {
    "generate": true,
    "outputFolder": "cypress/cucumber-json",
    "filePrefix": "",
    "fileSuffix": ".cucumber"
---

### 🛠️ 3.5 Scripts NPM Úteis

Adicione estes scripts

### 2.5 Scripts NPM Úteis

Adicione ao `package.json`:
```json
"scripts": {
  "test": "cypress run",
  "test:chrome": "cypress run --browser chrome",
  "test:headed": "cypress run --headed",
  "test:spec": "cypress run --spec \"cypress/integration/specs/**/*.feature\"",
  "cypress:open": "cypress open",
  "report:merge": "mochawesome-merge cypress/reports/mochawesome-report/*.json > cypress/reports/mochawesome-report/report.json",
  "report:generate": "marge cypress/reports/mochawesome-report/report.json -f report -o cypress/reports/mochawesome-report",
  "test:full": "npm run test && npm run report:merge && npm run report:generate"
}
```

**Uso:**
```bash
# Abrir interface do Cypress
npm run cypress:open

# Executar todos os testes
npm test

# Executar com Chrome em modo headed
npm run test:headed

---

### ✨ 3cutar e gerar relatório completo
npm run test:full
```

### 2.6 Boas Práticas Implementadas

#### **✅ Separação de Responsabilidades**
- **Features:** Cenários de teste em linguagem natural
- **Step Definitions:** Implementação dos steps
- **Page Objects:** Lógica de interação encapsulada
- **Fixtures:** Dados de teste isolados

#### **✅ Reutilização de Código**
```javascript
// Ao invés de repetir código em cada teste:
cy.request({...}).then(...)

// Use Page Objects:
RequisicaoPage.fazerRequisicao('GET');
ValidacaoPage.verificarStatusCode('200');
```

#### **✅ Configuração por Ambiente**
```bash
# Desenvolvimento
cypress run --env configFile=dev

# Produção
cypress run --env configFile=prod
```

#### **✅ Aliases e Environment Variables**
```javascript
// Armazenar valores entre steps
cy.wrap(token).as('authToken');
Cypress.env('token', token);

// Usar em steps seguintes
cy.get('@authToken').then((token) => {...});
```

### 2.7 Exemplo Completo de Teste

```gherkin
# cypress/integration/specs/crud-produtos.feature
Funcionalidade: CRUD de Produtos

  Cenário: Criar, listar, atualizar e deletar produto
    # Configuração inicial
    Dado Que defino a URL como "https://api.inovatech.com.br" para o caso de teste "CRUD Produtos"
    
    # Criar produto
    E Que quero testar o "/produtos"
    Quando Defino o content type do header como "application/json"
    E Faco a requisicao na API com o metodo de solicitacao "POST" e o body abaixo:
      """
      {
        "nome": "Notebook Dell",
        "preco": 3500.00,
        "estoque": 10
      }
      """
    Entao Verifico se o status code e igual a "201"
    E Guardo no Environment a chave "produtoId" do ResponseBody com o valor "id"
    
    # Listar produto criado
    E Que quero testar o "/produtos/{produtoId}"
    E Faco a requisicao na API com o metodo de solicitacao "GET"
    Entao Verifico se o status code e igual a "200"
    E Verifico se o valor da resposta "nome" e igual a "Notebook Dell"
    
    # Atualizar produto
    E Faco a requisicao na API com o metodo de solicitacao "PUT" e o body abaixo:
      """
      {
        "preco": 3200.00
      }
      """
    Entao Verifico se o status code e igual a "200"
    E Verifico se o valor da resposta "preco" e igual a "3200.00"
    
    # Deletar produto
    E Faco a requisicao na API com o metodo de solicitacao "DELETE"
    Entao Verifico se o status code e igual a "204"
```

### 2.8 Troubleshooting Comum

#### **Problema: Alias não encontrado**
```
cy.get() could not find a registered alias for: @endpoint
```
**Solução:** Sempre inicialize aliases no Given:
```javascript
cy.wrap('').as('endpoint');
cy.wrap({}).as('headers');
```

#### **Problema: Body JSON inválido**
**Solução:** Use template strings corretamente no docString:
```javascript
const body = typeof docString === 'string' ? JSON.parse(docString) : docString;
```

#### **Problema: Status code errado**
**Solução:** Use `failOnStatusCode: false` para capturar todos os status:
```javascript
cy.request({
  method: 'GET',
  url: url,
  failOnStatusCode: false
}).as('response');
```

---

## 3. Próximos Passos

1. **Criar seus primeiros testes** seguindo os exemplos
2. **Implementar autenticação** com tokens JWT
3. **Adicionar testes de validação de schema** com jsonschema
4. **Configurar CI/CD** com Azure DevOps ou GitHub Actions
5. **Expandir Page Objects** com mais métodos reutilizáveis
6. **Implementar data-driven testing** usando múltiplos fixtures

---

**Documentação criada com base na arquitetura de referência para testes automatizados de API com Cypress + Cucumber (BDD)**

