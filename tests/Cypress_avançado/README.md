# Projeto Cypress Avançado - Cucumber + Page Objects

## 📋 Descrição

Projeto de testes end-to-end utilizando Cypress com Cucumber (BDD) e o padrão Page Objects para organização e manutenibilidade do código.

## 🏗️ Arquitetura do Projeto

```
cypress-avancado/
├── cypress/
│   ├── e2e/
│   │   ├── features/              # Arquivos .feature (Gherkin/BDD)
│   │   │   ├── login.feature
│   │   │   └── products.feature
│   │   └── step_definitions/      # Implementação dos steps
│   │       ├── loginSteps.js
│   │       └── productsSteps.js
│   ├── fixtures/                  # Dados de teste
│   │   └── testData.json
│   ├── support/
│   │   ├── page-objects/          # Page Objects
│   │   │   ├── BasePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── HomePage.js
│   │   │   ├── ProductsPage.js
│   │   │   └── ProductFormPage.js
│   │   ├── commands.js            # Comandos customizados
│   │   └── e2e.js                 # Configurações globais
│   ├── screenshots/               # Capturas de tela dos testes
│   └── videos/                    # Vídeos dos testes
├── cypress.config.js              # Configuração do Cypress
├── .cypress-cucumber-preprocessorrc.json  # Configuração do Cucumber
├── package.json
└── README.md
```

## 🚀 Instalação

### Pré-requisitos
- Node.js 16+ instalado
- NPM ou Yarn

### Passos de Instalação

1. Navegue até a pasta do projeto:
```bash
cd tests/Cypress_avançado
```

2. Instale as dependências:
```bash
npm install
```

## 📝 Padrões Utilizados

### Cucumber (BDD)
- Arquivos `.feature` escritos em Gherkin (linguagem PT-BR)
- Steps definitions organizados por funcionalidade
- Suporte a tags para execução seletiva (@smoke, @regression, etc.)

### Page Objects
- Classe base `BasePage` com métodos comuns
- Page Objects específicos para cada página
- Encapsulamento de seletores e ações
- Reutilização de código

### Comandos Customizados
- Comandos reutilizáveis no arquivo `commands.js`
- Exemplos: `cy.login()`, `cy.fillForm()`, etc.

## 🧪 Executando os Testes

### Modo Interativo (Cypress UI)
```bash
npm run open
```

### Modo Headless (linha de comando)
```bash
# Todos os testes
npm test

# Testes específicos por tag
npm run test:smoke      # Apenas testes @smoke
npm run test:regression # Apenas testes @regression

# Navegadores específicos
npm run test:chrome
npm run test:firefox
npm run test:edge
```

### Executar com tags específicas
```bash
npm run test:tags "@login and @smoke"
npm run test:tags "@products"
```

## 📊 Relatórios

Os relatórios são gerados automaticamente após a execução:
- **JSON**: `cypress/reports/cucumber-json/`
- **HTML**: `cypress/reports/cucumber-html/`
- **Screenshots**: `cypress/screenshots/`
- **Vídeos**: `cypress/videos/`

## 🔧 Configurações

### URLs Base
Configuradas no `cypress.config.js`:
- Frontend: `http://localhost:5173`
- API: `http://localhost:5000`

### Timeouts
- Comando padrão: 10000ms
- Carregamento de página: 30000ms
- Request: 10000ms
- Response: 30000ms

## 📖 Exemplos de Uso

### Feature File Example (login.feature)
```gherkin
# language: pt
Funcionalidade: Login de Usuário
  Como um usuário do sistema
  Eu quero fazer login na aplicação
  Para acessar minhas funcionalidades

  @smoke @login
  Cenário: Login com credenciais válidas
    Dado que estou na página de login
    Quando eu preencho o campo usuário com "admin"
    E eu preencho o campo senha com "admin123"
    E eu clico no botão de login
    Então eu devo ser redirecionado para a página inicial
```

### Step Definition Example
```javascript
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import LoginPage from '../../support/page-objects/LoginPage';

Given('que estou na página de login', () => {
  LoginPage.visitLoginPage();
});

When('eu preencho o campo usuário com {string}', (username) => {
  LoginPage.fillUsername(username);
});
```

### Page Object Example
```javascript
import BasePage from './BasePage';

class LoginPage extends BasePage {
  selectors = {
    usernameInput: '[data-testid="username"]',
    passwordInput: '[data-testid="password"]',
    loginButton: '[data-testid="login-button"]'
  };

  doLogin(username, password) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickLoginButton();
  }
}

export default new LoginPage();
```

## 🎯 Boas Práticas

1. **Page Objects**
   - Mantenha os seletores centralizados
   - Use métodos descritivos
   - Separe ações de validações

2. **Features**
   - Escreva cenários claros e concisos
   - Use tags para organização
   - Mantenha o foco no comportamento, não na implementação

3. **Step Definitions**
   - Mantenha steps reutilizáveis
   - Evite lógica complexa nos steps
   - Use Page Objects para interações com a UI

4. **Comandos Customizados**
   - Crie comandos para ações frequentes
   - Documente os comandos com JSDoc
   - Mantenha comandos simples e focados

## 🐛 Debug

Para debugar testes:
- Use `cy.pause()` para pausar a execução
- Use `cy.debug()` para inspecionar elementos
- Execute em modo headed: `npm run test:headed`
- Verifique screenshots e vídeos após falhas

## 📚 Recursos Adicionais

- [Documentação Cypress](https://docs.cypress.io/)
- [Cucumber Preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor)
- [Gherkin Syntax](https://cucumber.io/docs/gherkin/)
- [Page Object Pattern](https://martinfowler.com/bliki/PageObject.html)

## 🤝 Contribuindo

1. Crie features seguindo o padrão BDD
2. Implemente Page Objects para novas páginas
3. Adicione comandos customizados quando necessário
4. Mantenha a documentação atualizada
5. Execute todos os testes antes de commitar

## 📄 Licença

ISC
