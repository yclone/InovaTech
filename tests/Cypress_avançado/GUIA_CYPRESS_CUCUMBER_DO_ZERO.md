# 🥒 Guia Completo: Criando Projeto Cypress + Cucumber do Zero

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- ✅ Node.js (versão 18 ou superior)
- ✅ npm ou yarn
- ✅ Editor de código (VS Code recomendado)

Verificar versões:
```bash
node --version  # v18.0.0 ou superior
npm --version   # 9.0.0 ou superior
```

---

## 🚀 Passo 1: Criar Estrutura do Projeto

### 1.1 Criar pasta do projeto
```bash
# Crie uma nova pasta para o projeto
mkdir cypress-cucumber-login
cd cypress-cucumber-login
```

### 1.2 Inicializar projeto Node.js
```bash
# Inicializa package.json
npm init -y
```

Isso cria o arquivo `package.json` básico.

---

## 📦 Passo 2: Instalar Dependências

### 2.1 Instalar Cypress
```bash
npm install --save-dev cypress
```

### 2.2 Instalar Cucumber para Cypress
```bash
npm install --save-dev @badeball/cypress-cucumber-preprocessor
```

### 2.3 Instalar plugin bundler (necessário para Cucumber)
```bash
# Para Webpack (opção 1 - mais comum):
npm install --save-dev @cypress/webpack-preprocessor webpack@5

# OU para Browserify (opção 2):
npm install --save-dev @cypress/browserify-preprocessor
```

**Recomendação:** Use Webpack por ser mais moderno e ter melhor suporte.

---

## ⚙️ Passo 3: Configurar Cypress

### 3.1 Abrir Cypress pela primeira vez
```bash
npx cypress open
```

Isso cria a estrutura básica:
```
cypress-cucumber-login/
├── cypress/
│   ├── fixtures/
│   ├── support/
│   └── e2e/
├── cypress.config.js
└── package.json
```

**Feche o Cypress** após a estrutura ser criada.

### 3.2 Configurar cypress.config.js

Substitua o conteúdo do arquivo `cypress.config.js`:

```javascript
const { defineConfig } = require('cypress')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor')
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild')

module.exports = defineConfig({
  e2e: {
    // URL base da aplicação
    baseUrl: 'http://localhost:5173',
    
    // Configuração do Cucumber
    specPattern: 'cypress/e2e/features/**/*.feature',
    
    async setupNodeEvents(on, config) {
      // Plugin do Cucumber
      await addCucumberPreprocessorPlugin(on, config)
      
      // Preprocessor com esbuild (mais rápido que webpack)
      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      )
      
      return config
    },
    
    // Outras configurações úteis
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
  },
})
```

**Alternativa com Webpack** (se preferir):
```javascript
const { defineConfig } = require('cypress')
const webpack = require('@cypress/webpack-preprocessor')
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/features/**/*.feature',
    
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config)
      
      on('file:preprocessor', webpack({
        webpackOptions: {
          resolve: {
            extensions: ['.ts', '.js'],
          },
          module: {
            rules: [
              {
                test: /\.feature$/,
                use: [
                  {
                    loader: '@badeball/cypress-cucumber-preprocessor/webpack',
                    options: config,
                  },
                ],
              },
            ],
          },
        },
      }))
      
      return config
    },
  },
})
```

### 3.3 Configurar package.json

Adicione configuração do Cucumber no `package.json`:

```json
{
  "name": "cypress-cucumber-login",
  "version": "1.0.0",
  "description": "Projeto Cypress com Cucumber para testes de login",
  "scripts": {
    "test": "cypress run",
    "test:open": "cypress open",
    "test:headed": "cypress run --headed",
    "test:chrome": "cypress run --browser chrome"
  },
  "cypress-cucumber-preprocessor": {
    "stepDefinitions": "cypress/e2e/step_definitions/**/*.js",
    "html": {
      "enabled": true,
      "output": "cypress/reports/cucumber-html/index.html"
    },
    "json": {
      "enabled": true,
      "output": "cypress/reports/cucumber-json/cucumber-report.json"
    }
  },
  "devDependencies": {
    "@badeball/cypress-cucumber-preprocessor": "^20.0.0",
    "@bahmutov/cypress-esbuild-preprocessor": "^2.2.0",
    "cypress": "^13.6.0"
  }
}
```

---

## 📁 Passo 4: Criar Estrutura de Pastas

Crie a seguinte estrutura:

```bash
# No terminal (PowerShell)
New-Item -ItemType Directory -Force -Path "cypress/e2e/features"
New-Item -ItemType Directory -Force -Path "cypress/e2e/step_definitions"
New-Item -ItemType Directory -Force -Path "cypress/reports"
```

Estrutura final:
```
cypress-cucumber-login/
├── cypress/
│   ├── e2e/
│   │   ├── features/              ← Arquivos .feature (Gherkin)
│   │   └── step_definitions/      ← Implementação dos steps
│   ├── fixtures/                  ← Dados de teste (JSON)
│   └── support/
│       ├── commands.js            ← Comandos customizados
│       └── e2e.js                 ← Configurações globais
├── cypress.config.js
└── package.json
```

---

## 🥒 Passo 5: Criar Feature de Login

### 5.1 Criar arquivo login.feature

Crie: `cypress/e2e/features/login.feature`

```gherkin
# language: pt
Funcionalidade: Login na aplicação InovaTech
  Como um usuário cadastrado
  Eu quero fazer login na aplicação
  Para acessar funcionalidades protegidas

  Contexto:
    Dado que estou na página de login

  @smoke @login
  Cenário: Login com sucesso
    Quando eu preencho o campo email com "admin@inovatech.com"
    E eu preencho o campo senha com "Admin@123"
    E eu clico no botão de login
    Então devo ser redirecionado para a dashboard
    E devo ver mensagem de boas-vindas

  @login @negative
  Cenário: Login com credenciais inválidas
    Quando eu preencho o campo email com "invalido@test.com"
    E eu preencho o campo senha com "senhaErrada"
    E eu clico no botão de login
    Então devo ver uma mensagem de erro
    E devo permanecer na página de login

  @login @validation
  Esquema do Cenário: Validação de campos obrigatórios
    Quando eu preencho o campo email com "<email>"
    E eu preencho o campo senha com "<senha>"
    E eu clico no botão de login
    Então devo ver a mensagem "<mensagem_erro>"

    Exemplos:
      | email                  | senha      | mensagem_erro              |
      |                        | Admin@123  | E-mail é obrigatório       |
      | admin@inovatech.com    |            | Senha é obrigatória        |
      |                        |            | Preencha todos os campos   |
```

---

## 🔧 Passo 6: Implementar Step Definitions

### 6.1 Criar arquivo loginSteps.js

Crie: `cypress/e2e/step_definitions/loginSteps.js`

```javascript
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

// ========================================
// CONTEXTO (Given)
// ========================================

Given('que estou na página de login', () => {
  cy.visit('/login')
  
  // Valida que estamos na página correta
  cy.url().should('include', '/login')
  cy.contains('h1', /login|entrar/i).should('be.visible')
})

// ========================================
// AÇÕES (When)
// ========================================

When('eu preencho o campo email com {string}', (email) => {
  if (email) {
    cy.get('#usuario, input[type="email"], input[name="email"]')
      .clear()
      .type(email)
  }
})

When('eu preencho o campo senha com {string}', (senha) => {
  if (senha) {
    cy.get('#senha, input[type="password"], input[name="password"]')
      .clear()
      .type(senha)
  }
})

When('eu clico no botão de login', () => {
  cy.get('#login-btn, button[type="submit"]').click()
})

// ========================================
// VALIDAÇÕES (Then)
// ========================================

Then('devo ser redirecionado para a dashboard', () => {
  // Aguarda redirecionamento (até 10 segundos)
  cy.url().should('not.include', '/login', { timeout: 10000 })
  
  // Pode ser / ou /dashboard dependendo da aplicação
  cy.url().should('match', /\/(dashboard|home)?$/)
})

Then('devo ver mensagem de boas-vindas', () => {
  cy.contains(/bem-vindo|olá|dashboard/i, { timeout: 5000 })
    .should('be.visible')
})

Then('devo ver uma mensagem de erro', () => {
  cy.get('.alert-error, .alert-danger, .error-message, [role="alert"]', { timeout: 5000 })
    .should('be.visible')
    .and('contain.text', /erro|inválid|falhou|incorret/i)
})

Then('devo permanecer na página de login', () => {
  cy.url().should('include', '/login')
})

Then('devo ver a mensagem {string}', (mensagem) => {
  cy.contains(mensagem, { matchCase: false })
    .should('be.visible')
})
```

---

## 🎨 Passo 7: Configurar Suporte Global

### 7.1 Atualizar cypress/support/e2e.js

Edite: `cypress/support/e2e.js`

```javascript
// Importa comandos customizados
import './commands'

// Configurações globais do Cucumber
beforeEach(() => {
  // Limpa cookies e localStorage antes de cada cenário
  cy.clearCookies()
  cy.clearLocalStorage()
})

// Configuração de timeout padrão
Cypress.config('defaultCommandTimeout', 10000)
Cypress.config('pageLoadTimeout', 30000)

// Prevenir erros de aplicação de quebrar os testes
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retornar false previne o Cypress de falhar o teste
  // Útil para erros de terceiros que não afetam o teste
  console.log('Erro capturado:', err.message)
  return false
})
```

### 7.2 Criar comandos customizados (opcional)

Edite: `cypress/support/commands.js`

```javascript
// Comando customizado para login
Cypress.Commands.add('login', (email, senha) => {
  cy.visit('/login')
  cy.get('#usuario, input[type="email"]').type(email)
  cy.get('#senha, input[type="password"]').type(senha)
  cy.get('#login-btn, button[type="submit"]').click()
  cy.url().should('not.include', '/login', { timeout: 10000 })
})

// Comando customizado para login via API (mais rápido)
Cypress.Commands.add('loginViaAPI', (email, senha) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:5000/login',
    body: {
      Usuario: email,
      Senha: senha
    }
  }).then((response) => {
    // Salva token ou dados de sessão se necessário
    if (response.body.token) {
      window.localStorage.setItem('token', response.body.token)
    }
  })
})
```

---

## 🧪 Passo 8: Executar os Testes

### 8.1 Executar em modo interativo
```bash
npm run test:open
```

Ou diretamente:
```bash
npx cypress open
```

1. Selecione **E2E Testing**
2. Escolha o browser (Chrome recomendado)
3. Clique no arquivo **login.feature**
4. Veja os testes executarem! 🎉

### 8.2 Executar em modo headless (CI/CD)
```bash
npm test
```

Ou:
```bash
npx cypress run
```

### 8.3 Executar com tags específicas
```bash
# Apenas testes smoke
npx cypress run --env tags="@smoke"

# Apenas testes de login
npx cypress run --env tags="@login"

# Excluir testes negativos
npx cypress run --env tags="not @negative"
```

---

## 📊 Passo 9: Gerar Relatórios (Opcional)

### 9.1 Instalar gerador de relatórios
```bash
npm install --save-dev multiple-cucumber-html-reporter
```

### 9.2 Criar script de relatório

Crie: `generate-report.js`

```javascript
const report = require('multiple-cucumber-html-reporter')

report.generate({
  jsonDir: 'cypress/reports/cucumber-json',
  reportPath: 'cypress/reports/cucumber-html',
  metadata: {
    browser: {
      name: 'chrome',
      version: '120'
    },
    device: 'Local Machine',
    platform: {
      name: 'windows',
      version: '11'
    }
  },
  customData: {
    title: 'Relatório de Testes - InovaTech',
    data: [
      { label: 'Projeto', value: 'Login InovaTech' },
      { label: 'Ambiente', value: 'Desenvolvimento' },
      { label: 'Data', value: new Date().toLocaleDateString() }
    ]
  }
})
```

### 9.3 Adicionar script no package.json
```json
{
  "scripts": {
    "test": "cypress run",
    "test:open": "cypress open",
    "report": "node generate-report.js",
    "test:report": "cypress run && npm run report"
  }
}
```

### 9.4 Executar testes com relatório
```bash
npm run test:report
```

Abre o relatório em: `cypress/reports/cucumber-html/index.html`

---

## 📝 Passo 10: Boas Práticas

### 10.1 Criar .gitignore

Crie: `.gitignore`

```
# Dependências
node_modules/

# Cypress
cypress/videos/
cypress/screenshots/
cypress/reports/
cypress/downloads/

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
```

### 10.2 Organização de arquivos

**Boas práticas:**
- ✅ Um arquivo `.feature` por funcionalidade
- ✅ Steps reutilizáveis entre cenários
- ✅ Usar `Contexto` (Background) para steps repetidos
- ✅ Nomear steps de forma clara e descritiva
- ✅ Usar tags para organizar e filtrar testes
- ✅ Manter steps simples e atômicos

**Evitar:**
- ❌ Steps muito complexos ou com muita lógica
- ❌ Duplicação de código nos step definitions
- ❌ Steps muito específicos (dificulta reutilização)
- ❌ Misturar lógica de negócio com implementação técnica

---

## 🎯 Resumo dos Comandos

```bash
# 1. Criar projeto
mkdir cypress-cucumber-login && cd cypress-cucumber-login
npm init -y

# 2. Instalar dependências
npm install --save-dev cypress @badeball/cypress-cucumber-preprocessor @bahmutov/cypress-esbuild-preprocessor

# 3. Inicializar Cypress
npx cypress open

# 4. Criar estrutura de pastas
New-Item -ItemType Directory -Force -Path "cypress/e2e/features"
New-Item -ItemType Directory -Force -Path "cypress/e2e/step_definitions"

# 5. Executar testes
npm run test:open   # Modo interativo
npm test            # Modo headless
```

---

## 🎓 Checklist do Hands-On

Use este checklist durante a apresentação:

- [ ] ✅ Node.js e npm instalados
- [ ] ✅ Projeto criado e inicializado
- [ ] ✅ Cypress instalado
- [ ] ✅ Plugin Cucumber instalado
- [ ] ✅ cypress.config.js configurado
- [ ] ✅ package.json com configurações do Cucumber
- [ ] ✅ Estrutura de pastas criada
- [ ] ✅ Arquivo .feature criado
- [ ] ✅ Step definitions implementados
- [ ] ✅ Cypress executado com sucesso
- [ ] ✅ Testes passando! 🎉

---

## 🐛 Troubleshooting

### Erro: "preprocessor is not a function"
**Solução:** Verifique se instalou o preprocessor correto:
```bash
npm install --save-dev @bahmutov/cypress-esbuild-preprocessor
```

### Erro: "Cannot find module '@badeball/cypress-cucumber-preprocessor'"
**Solução:** Reinstale as dependências:
```bash
npm install
```

### Steps não são reconhecidos
**Solução:** Verifique no `package.json` se o caminho está correto:
```json
"cypress-cucumber-preprocessor": {
  "stepDefinitions": "cypress/e2e/step_definitions/**/*.js"
}
```

### Testes não aparecem no Cypress
**Solução:** Verifique o `specPattern` no `cypress.config.js`:
```javascript
specPattern: 'cypress/e2e/features/**/*.feature'
```

---

## 📚 Recursos Adicionais

- 📖 [Documentação Cypress](https://docs.cypress.io)
- 🥒 [Documentação Cucumber](https://cucumber.io/docs/cucumber/)
- 🔧 [Plugin Cucumber Preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor)
- 🎥 [Vídeos Cypress](https://www.youtube.com/c/Cypress-io)
- 💬 [Discord Cypress](https://discord.gg/cypress)

---

## 🎉 Conclusão

Você agora tem um projeto Cypress + Cucumber completo e funcional!

**Próximos passos:**
1. Adicionar mais cenários de teste
2. Criar Page Objects para organizar seletores
3. Implementar comandos customizados
4. Configurar CI/CD (GitHub Actions, GitLab CI, etc.)
5. Adicionar testes de API
6. Integrar com ferramentas de relatório

**Bom teste! 🚀**
