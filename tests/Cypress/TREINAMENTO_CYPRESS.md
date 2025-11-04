# 🧪 Treinamento Cypress - Testes E2E CRUD

## 🚀 Visão Geral

Este treinamento aborda como criar testes End-to-End (E2E) completos usando Cypress para operações CRUD (Create, Read, Update, Delete) na aplicação InovaTech, combinando testes de UI com validações diretas na API.

**Duração Total:** 90 minutos  
**Pré-requisito:** Aplicação InovaTech rodando em `http://localhost:5000`

---

## 📋 Estrutura do Treinamento

```
📁 Cypress CRUD Tests
├── 🏗️ Módulo 1: Setup do Projeto (20 min)
├── ➕ Módulo 2: Testando Criação de Usuário (35 min)
├── 🔄 Módulo 3: Testando Leitura, Atualização e Deleção (30 min)
└── 🎯 Módulo 4: Executando e Concluindo (5 min)
```

---

## 🏗️ Módulo 1: Setup do Projeto Cypress (20 minutos)

### 1.1 Instalação e Configuração (10 min)

#### **Passo 1:** Criar pasta do projeto
```bash
mkdir cypress-crud-tests
cd cypress-crud-tests
```

#### **Passo 2:** Inicializar npm
```bash
npm init -y
```

#### **Passo 3:** Instalar Cypress
```bash
npm install cypress --save-dev
```

#### **Passo 4:** Abrir Cypress pela primeira vez
```bash
npx cypress open
```
> Isso criará a estrutura de pastas: `cypress/e2e`, `cypress/support`, `cypress.config.js`

#### **Passo 5:** Configurar baseUrl no `cypress.config.js`
```javascript
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    env: {
      apiUrl: 'http://localhost:5000'
    }
  }
})
```

### 1.2 Criando o Primeiro Teste Básico (10 min)

#### **Passo 1:** Criar arquivo de teste
Crie: `cypress/e2e/user_crud.cy.js`

#### **Passo 2:** Escrever teste simples
```javascript
describe('User CRUD Tests', () => {
  
  beforeEach(() => {
    // Visitar a página base antes de cada teste
    cy.visit('/');
  });

  it('should display the application', () => {
    // Validar que a aplicação está rodando
    cy.visit('/');
    
    // Como não temos interface gráfica, vamos testar se a API responde
    cy.request('GET', Cypress.env('apiUrl') + '/clientes')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });
});
```

#### **Passo 3:** Rodar o teste
```bash
npx cypress open
```
Selecione o arquivo `user_crud.cy.js` e execute.

---

## ➕ Módulo 2: Testando a Criação de Usuário (35 minutos)

### 2.1 Cenário: Criar Novo Usuário via API (20 min)

Como a aplicação InovaTech é uma API REST (sem interface gráfica), vamos focar nos testes de API com validações robustas.

#### **Adicionar teste de criação:**
```javascript
describe('User CRUD Tests', () => {
  
  let createdUserId; // Variável para armazenar o ID do usuário criado
  const testUser = {
    PrimeiroNome: 'Cypress',
    UltimoNome: 'Teste',
    Usuario: `cypress.test.${Date.now()}@email.com`, // Email único
    Estado: 'SP',
    Cidade: 'São Paulo',
    Senha: 'teste123'
  };

  beforeEach(() => {
    // Limpar dados ou preparar ambiente se necessário
    cy.log('Preparando ambiente para teste');
  });

  it('should create a new user successfully', () => {
    // Criar usuário via API
    cy.request({
      method: 'POST',
      url: Cypress.env('apiUrl') + '/clientes',
      headers: {
        'Content-Type': 'application/json'
      },
      body: testUser
    }).then((response) => {
      // Validações da resposta
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      expect(response.body.PrimeiroNome).to.eq(testUser.PrimeiroNome);
      expect(response.body.UltimoNome).to.eq(testUser.UltimoNome);
      expect(response.body.Usuario).to.eq(testUser.Usuario);
      expect(response.body.Estado).to.eq(testUser.Estado);
      expect(response.body.Cidade).to.eq(testUser.Cidade);
      
      // Validar que senha não é retornada
      expect(response.body.Senha).to.be.null;
      
      // Salvar ID para uso em outros testes
      createdUserId = response.body.id;
      
      // Salvar em alias para uso posterior
      cy.wrap(createdUserId).as('userId');
    });
  });

  it('should fail to create user with invalid email', () => {
    const invalidUser = { ...testUser, Usuario: 'email-invalido' };
    
    cy.request({
      method: 'POST',
      url: Cypress.env('apiUrl') + '/clientes',
      headers: {
        'Content-Type': 'application/json'
      },
      body: invalidUser,
      failOnStatusCode: false // Não falhar se status for 4xx ou 5xx
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('should fail to create user with missing required fields', () => {
    const incompleteUser = {
      PrimeiroNome: 'Teste'
      // Campos obrigatórios faltando
    };
    
    cy.request({
      method: 'POST',
      url: Cypress.env('apiUrl') + '/clientes',
      headers: {
        'Content-Type': 'application/json'
      },
      body: incompleteUser,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});
```

### 2.2 Criando Massa de Dados com cy.request() (15 min)

#### **Estratégia para gerenciar dados de teste:**
```javascript
describe('User CRUD Tests with Data Management', () => {
  
  let createdUserId;
  const apiUrl = Cypress.env('apiUrl');
  
  beforeEach(() => {
    // Criar um usuário base para testes de leitura, atualização e deleção
    const baseUser = {
      PrimeiroNome: 'TestUser',
      UltimoNome: 'Sobrenome',
      Usuario: `test.user.${Date.now()}@email.com`,
      Estado: 'MG',
      Cidade: 'Belo Horizonte',
      Senha: 'senha123'
    };
    
    cy.request('POST', `${apiUrl}/clientes`, baseUser)
      .then(response => {
        createdUserId = response.body.id;
        cy.wrap(createdUserId).as('baseUserId');
        cy.wrap(baseUser).as('baseUser');
      });
  });

  afterEach(() => {
    // Cleanup: Tentar limpar dados criados durante o teste
    // Nota: Como não há endpoint DELETE, este é um exemplo conceitual
    if (createdUserId) {
      cy.log(`Limpeza: usuário ${createdUserId} seria removido aqui`);
    }
  });
  
  // Testes continuam aqui...
});
```

---

## 🔄 Módulo 3: Testando Leitura, Atualização e Deleção (30 minutos)

### 3.1 Cenário: Buscar/Visualizar Usuário (10 min)

```javascript
it('should fetch user details directly via API', function() {
  // Usar o usuário criado no beforeEach
  cy.request('GET', `${apiUrl}/clientes/${this.baseUserId}`)
    .then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', this.baseUserId);
      expect(response.body).to.have.property('PrimeiroNome');
      expect(response.body).to.have.property('UltimoNome');
      expect(response.body).to.have.property('Usuario');
      expect(response.body.Senha).to.be.null; // Senha não deve ser retornada
    });
});

it('should list all users', () => {
  cy.request('GET', `${apiUrl}/clientes`)
    .then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.at.least(1);
      
      // Validar estrutura do primeiro usuário
      if (response.body.length > 0) {
        const firstUser = response.body[0];
        expect(firstUser).to.have.property('id');
        expect(firstUser).to.have.property('PrimeiroNome');
        expect(firstUser).to.have.property('Usuario');
      }
    });
});

it('should handle user not found', () => {
  const nonExistentId = 99999;
  
  cy.request({
    method: 'GET',
    url: `${apiUrl}/clientes/${nonExistentId}`,
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.eq(404);
  });
});
```

### 3.2 Cenário: Testar Sistema de Login (10 min)

```javascript
it('should login with valid credentials', function() {
  // Usar dados do usuário base criado no beforeEach
  const loginData = {
    Usuario: this.baseUser.Usuario,
    Senha: this.baseUser.Senha
  };
  
  cy.request('POST', `${apiUrl}/login`, loginData)
    .then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('Sucesso', true);
      expect(response.body).to.have.property('Mensagem', 'Login realizado com sucesso');
      expect(response.body).to.have.property('Cliente');
      expect(response.body.Cliente.id).to.eq(this.baseUserId);
    });
});

it('should fail login with invalid credentials', function() {
  const invalidLoginData = {
    Usuario: this.baseUser.Usuario,
    Senha: 'senhaerrada'
  };
  
  cy.request('POST', `${apiUrl}/login`, invalidLoginData)
    .then((response) => {
      expect(response.status).to.eq(200); // API retorna 200 mesmo para falha
      expect(response.body).to.have.property('Sucesso', false);
      expect(response.body).to.have.property('Mensagem', 'Usuário ou senha incorretos');
      expect(response.body.Cliente).to.be.null;
    });
});
```

### 3.3 Cenário: Testar Sistema de Mailing (10 min)

```javascript
it('should send email to existing user', function() {
  const emailData = {
    Email: this.baseUser.Usuario
  };
  
  cy.request('POST', `${apiUrl}/mailing`, emailData)
    .then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('Sucesso', true);
      expect(response.body).to.have.property('Mensagem', 'Email enviado com sucesso!');
    });
});

it('should fail to send email to non-existing user', () => {
  const emailData = {
    Email: 'usuario.nao.existe@email.com'
  };
  
  cy.request('POST', `${apiUrl}/mailing`, emailData)
    .then((response) => {
      expect(response.status).to.eq(200); // API retorna 200 mesmo para falha
      expect(response.body).to.have.property('Sucesso', false);
      expect(response.body).to.have.property('Mensagem', 'Falha ao enviar o Email');
    });
});

it('should validate email format', () => {
  const emailData = {
    Email: 'email-invalido'
  };
  
  cy.request({
    method: 'POST',
    url: `${apiUrl}/mailing`,
    body: emailData,
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.eq(400);
  });
});
```

---

## 🎯 Módulo 4: Executando e Concluindo (5 minutos)

### 4.1 Executando Todos os Testes (5 min)

#### **Via Interface Gráfica:**
```bash
npx cypress open
```

#### **Via Linha de Comando (Headless):**
```bash
# Executar todos os testes
npx cypress run

# Executar arquivo específico
npx cypress run --spec "cypress/e2e/user_crud.cy.js"

# Executar com browser específico
npx cypress run --browser chrome

# Gerar relatórios
npx cypress run --reporter json --reporter-options output=results.json
```

### 4.2 Exemplo Completo do Arquivo de Teste

```javascript
describe('InovaTech - User CRUD E2E Tests', () => {
  
  let createdUserId;
  const apiUrl = Cypress.env('apiUrl');
  
  beforeEach(() => {
    // Criar usuário base para testes
    const baseUser = {
      PrimeiroNome: 'CypressUser',
      UltimoNome: 'TestSuite',
      Usuario: `cypress.${Date.now()}@test.com`,
      Estado: 'RJ',
      Cidade: 'Rio de Janeiro',
      Senha: 'cypress123'
    };
    
    cy.request('POST', `${apiUrl}/clientes`, baseUser)
      .then(response => {
        createdUserId = response.body.id;
        cy.wrap(createdUserId).as('userId');
        cy.wrap(baseUser).as('userDetails');
      });
  });

  describe('User Creation', () => {
    it('should create user successfully', function() {
      expect(this.userId).to.be.a('number');
      expect(this.userId).to.be.greaterThan(0);
    });
  });

  describe('User Reading', () => {
    it('should fetch user by ID', function() {
      cy.request('GET', `${apiUrl}/clientes/${this.userId}`)
        .then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.Usuario).to.eq(this.userDetails.Usuario);
        });
    });
  });

  describe('Authentication', () => {
    it('should login successfully', function() {
      cy.request('POST', `${apiUrl}/login`, {
        Usuario: this.userDetails.Usuario,
        Senha: this.userDetails.Senha
      }).then(response => {
        expect(response.body.Sucesso).to.be.true;
      });
    });
  });

  describe('Mailing System', () => {
    it('should send email to existing user', function() {
      cy.request('POST', `${apiUrl}/mailing`, {
        Email: this.userDetails.Usuario
      }).then(response => {
        expect(response.body.Sucesso).to.be.true;
      });
    });
  });
});
```

### 4.3 Configuração de CI/CD

#### **GitHub Actions exemplo:**
```yaml
name: Cypress E2E Tests

on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Start Application
        run: |
          cd APP
          mvn spring-boot:run &
          sleep 30
          
      - name: Run Cypress Tests
        uses: cypress-io/github-action@v2
        with:
          working-directory: cypress-crud-tests
          wait-on: 'http://localhost:5000'
          wait-on-timeout: 120
          
      - name: Upload Screenshots
        uses: actions/upload-artifact@v2
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress-crud-tests/cypress/screenshots
```

---

## 🎓 Encerramento e Próximos Passos

### **O que aprendemos:**
- ✅ Setup completo do Cypress para APIs REST
- ✅ Testes de criação, leitura e validação via API
- ✅ Gerenciamento de dados de teste
- ✅ Validações robustas e tratamento de erros
- ✅ Integração com CI/CD

### **Vantagens dos testes Cypress + API:**
- **Rapidez:** Testes diretos na API são mais rápidos
- **Confiabilidade:** Menos flaky que testes de UI
- **Cobertura:** Testam a lógica de negócio diretamente
- **Manutenção:** Mais fáceis de manter

### **Próximos Passos:**
1. **Fixtures:** Usar `cypress/fixtures` para dados de teste
2. **Comandos Customizados:** Criar comandos reutilizáveis
3. **Plugins:** Explorar plugins do Cypress
4. **Relatórios:** Integrar ferramentas de relatório
5. **Paralelização:** Executar testes em paralelo

### **Recursos Úteis:**
- **Documentação Cypress:** https://docs.cypress.io
- **Best Practices:** https://docs.cypress.io/guides/references/best-practices
- **Plugins:** https://docs.cypress.io/plugins/directory
- **Community:** https://gitter.im/cypress-io/cypress