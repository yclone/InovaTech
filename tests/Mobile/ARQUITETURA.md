# 🏗️ Arquitetura do Projeto Mobile - InovaTech

## 📐 Visão Geral

Este projeto segue o padrão **Page Object Model (POM)** com WebdriverIO e Appium, promovendo:
- ✅ Reusabilidade de código
- ✅ Manutenibilidade
- ✅ Separação de responsabilidades
- ✅ Testes legíveis e escaláveis

## 📁 Estrutura Completa

```
tests/Mobile/
│
├── 📦 APK/                           # Aplicativos para teste
│   ├── app-release.apk              # APK do aplicativo
│   └── README.md                    # Instruções
│
├── 🎯 app/                           # Código de automação
│   ├── android/                     # Configurações Android
│   │   └── wdio.conf.android.js    # Config WebdriverIO
│   ├── data/                        # Dados de teste
│   │   └── testData.js              # Dados centralizados
│   ├── helpers/                     # Utilitários
│   │   └── TestHelpers.js           # Funções auxiliares
│   └── pageObjects/                 # Page Objects
│       ├── BasePage.js              # Classe base
│       ├── LoginPage.js             # PO da tela de login
│       └── HomePage.js              # PO da tela home
│
├── 🧪 specs/                         # Arquivos de teste
│   ├── smoke.spec.js                # Smoke tests
│   ├── login.spec.js                # Testes de login
│   └── home.spec.js                 # Testes da home
│
├── 📊 reports/                       # Relatórios gerados
│   ├── html-reports/                # HTML reports
│   ├── screenshots/                 # Screenshots de falhas
│   └── README.md                    # Instruções
│
├── 📝 logs/                          # Logs de execução
│   ├── appium.log                   # Logs do Appium
│   └── README.md                    # Instruções
│
├── 📈 reportManager/                 # Gerenciamento de reports
│   └── index.js                     # Gerador de relatórios
│
├── ⚙️ Arquivos de Configuração
│   ├── .env.example                 # Exemplo de variáveis
│   ├── .eslintrc.json               # Configuração ESLint
│   ├── .prettierrc                  # Configuração Prettier
│   ├── .gitignore                   # Arquivos ignorados
│   └── package.json                 # Dependências NPM
│
├── 🚀 Scripts de Setup
│   ├── setup.ps1                    # Setup Windows
│   └── setup.sh                     # Setup Linux/Mac
│
└── 📚 Documentação
    ├── README.md                    # Documentação principal
    ├── QUICKSTART.md                # Guia rápido
    ├── GUIA_SELETORES.md            # Guia de seletores
    └── appium-inspector-config.md   # Config do Inspector
```

## 🎨 Padrões de Design

### 1. Page Object Model (POM)

Cada tela do app tem um Page Object correspondente:

```javascript
// pageObjects/LoginPage.js
class LoginPage extends BasePage {
  // Elementos (getters)
  get usernameField() { return $('~username'); }
  get passwordField() { return $('~password'); }
  get loginButton() { return $('~login-button'); }

  // Ações
  async login(username, password) {
    await this.setText(this.usernameField, username);
    await this.setText(this.passwordField, password);
    await this.click(this.loginButton);
  }

  // Validações
  async isLoginScreenDisplayed() {
    return await this.isDisplayed(this.loginButton);
  }
}
```

### 2. Base Page

Centraliza métodos comuns a todas as páginas:

```javascript
// pageObjects/BasePage.js
class BasePage {
  async click(element) { /* ... */ }
  async setText(element, text) { /* ... */ }
  async getText(element) { /* ... */ }
  async waitForElement(element) { /* ... */ }
  async swipe(direction) { /* ... */ }
  // ... outros métodos comuns
}
```

### 3. Test Helpers

Funções utilitárias reutilizáveis:

```javascript
// helpers/TestHelpers.js
class TestHelpers {
  static generateRandomEmail() { /* ... */ }
  static restartApp() { /* ... */ }
  static backgroundApp(seconds) { /* ... */ }
  // ... outros helpers
}
```

### 4. Dados de Teste Centralizados

```javascript
// data/testData.js
module.exports = {
  validUsers: { /* ... */ },
  invalidUsers: { /* ... */ },
  messages: { /* ... */ },
  // ...
};
```

## 🔄 Fluxo de Execução

```
┌─────────────────┐
│  npm test       │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  wdio.conf.android.js       │
│  - Carrega configurações    │
│  - Inicia Appium Service    │
│  - Define capabilities      │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Appium Server              │
│  - Conecta ao dispositivo   │
│  - Instala/Inicia app       │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Specs (Testes)             │
│  - Importa Page Objects     │
│  - Executa cenários         │
│  - Faz asserções            │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Page Objects               │
│  - Interage com elementos   │
│  - Usa BasePage methods     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  WebdriverIO + Appium       │
│  - Envia comandos UiAuto2   │
│  - Recebe respostas         │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Reporters                  │
│  - Gera relatórios HTML     │
│  - Salva screenshots        │
│  - Cria logs                │
└─────────────────────────────┘
```

## 🔧 Componentes Principais

### WebdriverIO
- **Função**: Test runner e client do Appium
- **Features**: 
  - Gerenciamento de sessões
  - Assertions com Chai
  - Reporters integrados
  - Service providers

### Appium
- **Função**: Servidor de automação mobile
- **Driver**: UiAutomator2 (Android)
- **Features**:
  - Multiplataforma (Android/iOS)
  - Suporte a gestos
  - Inspeção de elementos

### Mocha
- **Função**: Framework de testes BDD
- **Features**:
  - describe/it syntax
  - Hooks (before, after, beforeEach, afterEach)
  - Async/await support

### Chai
- **Função**: Biblioteca de asserções
- **Estilos**:
  - expect: `expect(value).to.be.true`
  - assert: `assert.equal(a, b)`
  - should: `value.should.be.true`

## 📊 Capabilities Explicadas

```javascript
capabilities: [{
  // Platform
  platformName: 'Android',              // SO do dispositivo
  'appium:platformVersion': '13.0',     // Versão do Android
  'appium:deviceName': 'emulator-5554', // Nome/ID do device

  // Automation
  'appium:automationName': 'UiAutomator2', // Driver usado
  
  // App
  'appium:app': '/path/to/app.apk',     // Caminho do APK
  'appium:appPackage': 'com.app',       // Package name
  'appium:appActivity': '.MainActivity', // Activity inicial

  // Behavior
  'appium:noReset': false,              // Não reseta app
  'appium:fullReset': false,            // Não desinstala
  'appium:autoGrantPermissions': true,  // Aceita permissões
  'appium:newCommandTimeout': 240,      // Timeout de comandos
}]
```

## 🎯 Seletores - Hierarquia de Preferência

1. **Accessibility ID** (`~id`) - Mais confiável
2. **Resource ID** (`id=...`) - Comum em Android
3. **UIAutomator** (`android=...`) - Específico Android
4. **XPath** (`//elemento`) - Último recurso

## 🧪 Estrutura de um Teste

```javascript
describe('Feature Name', () => {
  // Setup - Executado uma vez antes de todos os testes
  before(async () => {
    // Preparação inicial
  });

  // Setup - Executado antes de cada teste
  beforeEach(async () => {
    // Preparação individual
  });

  // Teste
  it('Should do something', async () => {
    // Arrange - Preparar dados
    const username = 'test';
    const password = 'test123';

    // Act - Executar ação
    await LoginPage.login(username, password);

    // Assert - Verificar resultado
    expect(await HomePage.isDisplayed()).to.be.true;
  });

  // Cleanup - Executado após cada teste
  afterEach(async () => {
    if (testFailed) {
      await driver.takeScreenshot();
    }
  });

  // Cleanup - Executado uma vez após todos os testes
  after(async () => {
    // Limpeza final
  });
});
```

## 🔐 Boas Práticas Implementadas

### 1. DRY (Don't Repeat Yourself)
- Métodos comuns na BasePage
- Helpers reutilizáveis
- Dados centralizados

### 2. Single Responsibility
- Cada Page Object gerencia uma tela
- Helpers têm funções específicas
- Separação de concerns

### 3. Explicit Waits
```javascript
await element.waitForDisplayed({ timeout: 10000 });
```

### 4. Error Handling
```javascript
try {
  await element.click();
} catch (error) {
  await driver.takeScreenshot();
  throw error;
}
```

### 5. Configuração Externalizada
- Variáveis em `.env`
- Capabilities configuráveis
- Dados de teste separados

## 📈 Escalabilidade

### Adicionar Nova Tela

1. Criar Page Object em `app/pageObjects/NewPage.js`
2. Estender `BasePage`
3. Definir seletores e métodos
4. Criar spec em `specs/new-feature.spec.js`

### Adicionar Novo Teste

1. Importar Page Objects necessários
2. Usar describe/it structure
3. Seguir padrão Arrange-Act-Assert
4. Adicionar dados em `testData.js` se necessário

### Suporte Multi-dispositivo

```javascript
// wdio.conf.android.js
capabilities: [
  { deviceName: 'emulator-5554', ... },
  { deviceName: 'emulator-5556', ... },
]
```

## 🚀 Integração CI/CD

### GitHub Actions
```yaml
- name: Run Mobile Tests
  run: |
    npm install
    npm run uiautomator2:install
    npm test
```

### GitLab CI
```yaml
mobile-tests:
  script:
    - npm install
    - npm run uiautomator2:install
    - npm test
  artifacts:
    paths:
      - reports/
```

## 📚 Recursos de Aprendizado

- [WebdriverIO Docs](https://webdriver.io/)
- [Appium Docs](https://appium.io/docs/en/latest/)
- [Page Object Pattern](https://webdriver.io/docs/pageobjects/)
- [Mocha Docs](https://mochajs.org/)
- [Chai Assertions](https://www.chaijs.com/)

---

**Arquitetura projetada para escalabilidade e manutenibilidade** 🏗️
