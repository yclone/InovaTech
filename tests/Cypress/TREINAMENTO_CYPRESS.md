# 🧪 Treinamento Cypress - Testes E2E Completos

## 🚀 Visão Geral

Este treinamento aborda como criar testes End-to-End (E2E) completos usando Cypress para a aplicação InovaTech, cobrindo tanto a **interface web (Frontend)** quanto **testes diretos na API (Backend)**. Você aprenderá a testar fluxos completos de usuário através da interface e validações específicas da API.

**Duração Total:** 120 minutos  
**Pré-requisitos:**
- 🚀 **Backend:** Aplicação API rodando em `http://localhost:5000`
- 🌐 **Frontend:** Interface web rodando em `http://localhost:5173`

---

## 📋 Estrutura do Treinamento

```
📁 Cypress E2E Tests - InovaTech
├── 🏗️ Módulo 1: Setup do Projeto (20 min)
├── 🌐 Módulo 2: Testando Interface Web - UI Tests (40 min)
├── � Módulo 3: Testando API Diretamente - API Tests (40 min)
├── 🔄 Módulo 4: Testes Híbridos - UI + API (15 min)
└── 🎯 Módulo 5: Executando e Concluindo (5 min)
```

---

## 🏗️ Módulo 1: Setup do Projeto Cypress (20 minutos)

### 1.1 Preparação do Ambiente (5 min)

#### **Verificar se os serviços estão rodando:**

1. **Backend (API):**
   ```bash
   # Na pasta APP/
   mvn spring-boot:run
   # Deve estar rodando em: http://localhost:5000
   ```

2. **Frontend (Interface):**
   ```bash
   # Na pasta FrontEnd/
   npm install
   npm run dev
   # Deve estar rodando em: http://localhost:5173
   ```

### 1.2 Instalação e Configuração do Cypress (10 min)

#### **Passo 1:** Criar pasta do projeto
```bash
mkdir cypress-inovatech-tests
cd cypress-inovatech-tests
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
> Selecione a opção de E2E Testing, selecione continue no final da pagina para criar os arquivos do Cypress

> Isso criará a estrutura de pastas: `cypress/e2e`, `cypress/support`, `cypress.config.js`

#### **Passo 5:** Configurar URLs no `cypress.config.js`
```javascript
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // URL base para testes de UI (Frontend)
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    env: {
      // URLs para diferentes tipos de teste
      frontendUrl: 'http://localhost:5173',
      apiUrl: 'http://localhost:5000'
    },
    // Timeout configurações
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 30000
  }
})
```

### 1.3 Criando o Primeiro Teste Básico (5 min)

#### **Passo 1:** Criar estrutura de arquivos
```bash
# Criar arquivos de teste
cypress/e2e/ui-tests.cy.js          # Testes de interface
cypress/e2e/api-tests.cy.js         # Testes de API
cypress/e2e/integration.cy.js       # Testes de integração com envio de email
cypress/e2e/health-check.cy.js      # Testes para validar se aplicação rodou
cypress/e2e/integration_bff.cy.js   # Testes de integração Back e Front end
cypress/e2e/performance.cy.js       # Testes de Performance
```

#### **Passo 2:** Teste inicial de conectividade
Crie: `cypress/e2e/health-check.cy.js`

```javascript
describe('InovaTech - Health Check', () => {
  
  it('should verify frontend is running', () => {
    cy.visit('/');
    cy.url().should('include', 'localhost:5173');
    
    // Deve redirecionar para /login automaticamente
    cy.url().should('include', '/login');
    cy.contains('Login').should('be.visible');
  });

  it('should verify API is running', () => {
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
Selecione o arquivo `health-check.cy.js` e execute para verificar conectividade.

---

## 🌐 Módulo 2: Testando Interface Web - UI Tests (40 minutos)

### 2.1 Cenário: Cadastro de Usuário via Interface (20 min)

A aplicação InovaTech possui uma interface web completa. Vamos testar o fluxo de cadastro através da UI.

#### **Criar arquivo:** `cypress/e2e/ui-tests.cy.js`

```javascript
describe('InovaTech - UI Tests (Interface Web)', () => {
  
  const testUser = {
    primeiroNome: 'Cypress',
    ultimoNome: 'Usuario',
    email: `cypress.ui.${Date.now()}@test.com`,
    senha: 'cypress123',
    cidade: 'São Paulo',
    estado: 'SP'
  };

  beforeEach(() => {
    // Visitar a página inicial
    cy.visit('/');
  });

  describe('Página de Cadastro', () => {
    
    it('should display register page correctly', () => {
      // Navegar para cadastro
      cy.visit('/register');
      
      // Verificar elementos da página
      cy.contains('h1', 'Cadastro').should('be.visible');
      cy.contains('Crie sua conta').should('be.visible');
      
      // Verificar campos do formulário
      cy.get('input[name="primeiroNome"]').should('be.visible');
      cy.get('input[name="ultimoNome"]').should('be.visible');
      cy.get('input[name="usuario"]').should('be.visible');
      cy.get('input[name="senha"]').should('be.visible');
      cy.get('input[name="cidade"]').should('be.visible');
      cy.get('select[name="estado"]').should('be.visible');
      
      // Verificar botão de submit
      cy.get('button[type="submit"]').should('contain', 'Cadastrar');
      
      // Verificar link para login
      cy.contains('Já tem uma conta? Entre aqui').should('be.visible');
    });

    it('should create user successfully via UI', () => {
      // Navegar para cadastro
      cy.visit('/register');
      
      // Preencher formulário
      cy.get('input[name="primeiroNome"]').type(testUser.primeiroNome);
      cy.get('input[name="ultimoNome"]').type(testUser.ultimoNome);
      cy.get('input[name="usuario"]').type(testUser.email);
      cy.get('input[name="senha"]').type(testUser.senha);
      cy.get('input[name="cidade"]').type(testUser.cidade);
      cy.get('select[name="estado"]').select(testUser.estado);
      
      // Interceptar a requisição de cadastro
      cy.intercept('POST', '**/clientes').as('createUser');
      
      // Submeter formulário
      cy.get('button[type="submit"]').click();
      
      // Verificar que a requisição foi feita
      cy.wait('@createUser').then((interception) => {
        expect(interception.response.statusCode).to.eq(201);
        expect(interception.response.body).to.have.property('id');
        expect(interception.response.body.PrimeiroNome).to.eq(testUser.primeiroNome);
      });
      
      // Verificar mensagem de sucesso
      cy.contains('Cadastro realizado com sucesso').should('be.visible');
      
      // Verificar redirecionamento para login
      cy.url().should('include', '/login', { timeout: 10000 });
    });

    it('should show validation errors for empty fields', () => {
      cy.visit('/register');
      
      // Tentar submeter formulário vazio
      cy.get('button[type="submit"]').click();
      
      // HTML5 validation deve impedir submissão
      // Verificar que ainda está na página de cadastro
      cy.url().should('include', '/register');
      
      // Verificar que campos obrigatórios são destacados
      cy.get('input[name="primeiroNome"]:invalid').should('exist');
    });

    it('should show error for invalid email format', () => {
      cy.visit('/register');
      
      // Preencher com email inválido
      cy.get('input[name="primeiroNome"]').type('Teste');
      cy.get('input[name="ultimoNome"]').type('Usuario');
      cy.get('input[name="usuario"]').type('email-invalido');
      cy.get('input[name="senha"]').type('123');
      cy.get('input[name="cidade"]').type('Cidade');
      cy.get('select[name="estado"]').select('SP');
      
      // Verificar validação HTML5 de email
      cy.get('input[name="usuario"]:invalid').should('exist');
    });
  });
});
```

### 2.2 ATIVIDADE: Login via Interface

#### **Criar arquivo:** `cypress/e2e/exercicio.cy.js`

#### **Adicionar teste para fazer Login em um novo arquivo:**

```javascript
describe('Página de Login', () => {
    
    // Definir dados do usuário de teste
    const testUser = {
      primeiroNome: 'TestUser',
      ultimoNome: 'Login',
      email: `login.test.${Date.now()}@test.com`,
      senha: 'login123test',
      cidade: 'São Paulo',
      estado: 'SP'
    };
    
    // Criar usuário via API antes dos testes de login
    before(() => {
      cy.request('POST', Cypress.env('apiUrl') + '/clientes', {
        PrimeiroNome: testUser.primeiroNome,
        UltimoNome: testUser.ultimoNome,
        Usuario: testUser.email,
        Senha: testUser.senha,
        Cidade: testUser.cidade,
        Estado: testUser.estado
      }).then((response) => {
        cy.wrap(response.body.id).as('userId');
      });
    });

    it('should display login page correctly', () => {
      cy.visit('/login');
      
      // Verificar elementos da página
      cy.contains('h1', 'Login').should('be.visible');
      cy.contains('Entre na sua conta').should('be.visible');
      
      // Verificar campos
      cy.get('input[name="usuario"]').should('be.visible');
      cy.get('input[name="senha"]').should('be.visible');
      
      // Verificar botão e links
      cy.get('button[type="submit"]').should('contain', 'Entrar');
      cy.contains('Não tem uma conta? Cadastre-se').should('be.visible');
    });

    it('should login successfully and redirect to dashboard', () => {
      cy.visit('/login');
      
      // Preencher credenciais
      cy.get('input[name="usuario"]').type(testUser.email);
      cy.get('input[name="senha"]').type(testUser.senha);
      
      // Interceptar requisição de login
      cy.intercept('POST', '**/login').as('loginRequest');
      
      // Fazer login
      cy.get('button[type="submit"]').click();
      
      // Verificar requisição
      cy.wait('@loginRequest').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.have.property('Sucesso', true);
        expect(interception.response.body).to.have.property('Cliente');
      });
      
      // Verificar mensagem de sucesso
      cy.contains('Login realizado com sucesso').should('be.visible');
      
      // Verificar redirecionamento para dashboard
      cy.url().should('include', '/dashboard', { timeout: 10000 });
      
      // Verificar conteúdo do dashboard
      cy.contains(`Bem-vindo, ${testUser.primeiroNome}`).should('be.visible');
    });
  });

```

#### **Testes extras, caso tenha tempo, aplicar o teste negativo com usuario e senha invalido:**

```javascript
  
    it('should show error for invalid credentials', () => {
      cy.visit('/login');
      
      cy.get('input[name="usuario"]').type('usuario@inexistente.com');
      cy.get('input[name="senha"]').type('senhaerrada');
      
      cy.intercept('POST', '**/login').as('loginRequest');
      
      cy.get('button[type="submit"]').click();
      
      cy.wait('@loginRequest');
      
      // Verificar mensagem de erro
      cy.contains('Usuário ou senha incorretos').should('be.visible');
      
      // Deve permanecer na página de login
      cy.url().should('include', '/login');
    });
  });
```

---

## � Módulo 3: Testando API Diretamente - API Tests (40 minutos)

### 3.1 Cenário: CRUD Operations via API (25 min)

Agora vamos testar a API diretamente, sem usar a interface web. Isso é útil para validações específicas e testes mais rápidos.

#### **Criar arquivo:** `cypress/e2e/api-tests.cy.js`

```javascript
describe('InovaTech - API Tests (Testes Diretos na API)', () => {
  
  let createdUserId;
  const apiUrl = Cypress.env('apiUrl');
  const testUser = {
    PrimeiroNome: 'APITest',
    UltimoNome: 'Usuario',
    Usuario: `api.test.${Date.now()}@test.com`,
    Estado: 'SP',
    Cidade: 'São Paulo',
    Senha: 'api123test'
  };

  describe('Gerenciamento de Clientes', () => {
    
    it('should create a new user via API', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/clientes`,
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
        
        // Salvar ID para próximos testes
        createdUserId = response.body.id;
        cy.wrap(createdUserId).as('userId');
      });
    });

    it('should list all users', () => {
      cy.request('GET', `${apiUrl}/clientes`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
          expect(response.body.length).to.be.at.least(1);
          
          // Verificar se o usuário criado está na lista
          const createdUser = response.body.find(user => user.id === createdUserId);
          expect(createdUser).to.exist;
          expect(createdUser.Usuario).to.eq(testUser.Usuario);
        });
    });

    it('should fetch user by ID', function() {
      cy.request('GET', `${apiUrl}/clientes/${this.userId}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('id', this.userId);
          expect(response.body).to.have.property('PrimeiroNome', testUser.PrimeiroNome);
          expect(response.body).to.have.property('UltimoNome', testUser.UltimoNome);
          expect(response.body).to.have.property('Usuario', testUser.Usuario);
          expect(response.body.Senha).to.be.null;
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

    it('should fail to create user with invalid data', () => {
      const invalidUser = { 
        ...testUser, 
        Usuario: 'email-invalido' // Email inválido
      };
      
      cy.request({
        method: 'POST',
        url: `${apiUrl}/clientes`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: invalidUser,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe('Sistema de Autenticação', () => {
    
    it('should login with valid credentials', () => {
      const loginData = {
        Usuario: testUser.Usuario,
        Senha: testUser.Senha
      };
      
      cy.request('POST', `${apiUrl}/login`, loginData)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('Sucesso', true);
          expect(response.body).to.have.property('Mensagem', 'Login realizado com sucesso');
          expect(response.body).to.have.property('Cliente');
          expect(response.body.Cliente.Usuario).to.eq(testUser.Usuario);
          
          // Verificar dados do cliente retornado
          expect(response.body.Cliente).to.have.property('PrimeiroNome');
          expect(response.body.Cliente).to.have.property('UltimoNome');
          expect(response.body.Cliente).to.have.property('id');
        });
    });

    it('should fail login with invalid credentials', () => {
      const invalidLoginData = {
        Usuario: testUser.Usuario,
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

    it('should fail login with missing fields', () => {
      const incompleteData = {
        Usuario: testUser.Usuario
        // Senha faltando
      };
      
      cy.request({
        method: 'POST',
        url: `${apiUrl}/login`,
        body: incompleteData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });
});
```

### 3.2 Cenário: Sistema de Mailing via API (15 min)

#### **Adicionar testes de mailing no arquivo integration.cy.js:**

```javascript
describe('InovaTech - API Tests (Testes Diretos na API)', () => {
  
  let createdUserId;
  const apiUrl = Cypress.env('apiUrl');
  const testUser = {
    PrimeiroNome: 'APITest',
    UltimoNome: 'Usuario',
    Usuario: `api.test.${Date.now()}@test.com`,
    Estado: 'SP',
    Cidade: 'São Paulo',
    Senha: 'api123test'
  };

   it('should create a new user via API', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/clientes`,
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
        
        // Salvar ID para próximos testes
        createdUserId = response.body.id;
        cy.wrap(createdUserId).as('userId');
      });
    });

  describe('Sistema de Mailing', () => {
    
    it('should send email to existing user', () => {
      const emailData = {
        Email: testUser.Usuario
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
        Email: 'usuario.nao.existe@test.com'
      };
      
      cy.request('POST', `${apiUrl}/mailing`, emailData)
        .then((response) => {
          expect(response.status).to.eq(200); // API retorna 200 mesmo para falha
          expect(response.body).to.have.property('Sucesso', false);
          expect(response.body).to.have.property('Mensagem', 'Falha ao enviar o Email');
        });
    });

    it('should validate email format in mailing', () => {
      const emailData = {
        Email: 'email-formato-invalido'
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

    it('should handle empty email field', () => {
      const emailData = {
        Email: ''
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
  });
});

```
#### *EXTRA: CASO DE TEMPO: *Adicionar testes de performance no arquivo performance.cy.js:**


```javascript

// Performance tests para API InovaTech
describe('InovaTech - Performance Tests (Desempenho da API)', () => {

    let createdUserId;
    const apiUrl = Cypress.env('apiUrl');
    const testUser = {
    PrimeiroNome: 'APITest',
    UltimoNome: 'Usuario',
    Usuario: `api.test.${Date.now()}@test.com`,
    Estado: 'SP',
    Cidade: 'São Paulo',
    Senha: 'api123test'
  };

    describe('Performance e Stress Tests', () => {
    
    it('should handle multiple simultaneous requests', () => {
      const requests = [];
      
      // Criar 5 requisições simultâneas
      for (let i = 0; i < 5; i++) {
        requests.push(
          cy.request('GET', `${apiUrl}/clientes`)
        );
      }
      
      // Verificar que todas retornaram sucesso
      Promise.all(requests).then((responses) => {
        responses.forEach(response => {
          expect(response.status).to.eq(200);
        });
      });
    });

    it('should respond within acceptable time limit', () => {
      const startTime = Date.now();
      
      cy.request('GET', `${apiUrl}/clientes`)
        .then((response) => {
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          
          expect(response.status).to.eq(200);
          expect(responseTime).to.be.lessThan(2000); // Menos de 2 segundos
        });
    });
  });
});
```

---

## 🔄 Módulo 4: Testes Híbridos - UI + API (15 minutos)

### 4.1 Cenário: Fluxo Completo End-to-End (15 min)

Os testes híbridos combinam interações de UI com validações diretas na API, oferecendo cobertura completa.

#### **Criar arquivo:** `cypress/e2e/integration_bff.cy.js`

```javascript
describe('InovaTech - Integration Tests (UI + API)', () => {
  
  const testUser = {
    primeiroNome: 'Integration',
    ultimoNome: 'Test',
    email: `integration.${Date.now()}@test.com`,
    senha: 'integration123',
    cidade: 'Rio de Janeiro',
    estado: 'RJ'
  };

  describe('Fluxo Completo de Usuário', () => {
    
    // Variável para compartilhar o userId entre testes
    let createdUserId;
    
    it('should complete full user journey: register → login → dashboard → logout', () => {
      
      // ========== ETAPA 1: CADASTRO VIA UI ==========
      cy.visit('/register');
      
      // Preencher formulário de cadastro
      cy.get('input[name="primeiroNome"]').type(testUser.primeiroNome);
      cy.get('input[name="ultimoNome"]').type(testUser.ultimoNome);
      cy.get('input[name="usuario"]').type(testUser.email);
      cy.get('input[name="senha"]').type(testUser.senha);
      cy.get('input[name="cidade"]').type(testUser.cidade);
      cy.get('select[name="estado"]').select(testUser.estado);
      
      // Interceptar cadastro para capturar dados
      cy.intercept('POST', '**/clientes').as('registerUser');
      
      cy.get('button[type="submit"]').click();
      
      // Validar cadastro via API response
      cy.wait('@registerUser').then((interception) => {
        expect(interception.response.statusCode).to.eq(201);
        expect(interception.response.body).to.have.property('id');
        
        // Salvar ID do usuário criado
        const userId = interception.response.body.id;
        createdUserId = userId;
        cy.wrap(userId).as('createdUserId');
        
        // ========== ETAPA 2: VALIDAR VIA API DIRETA ==========
        // Verificar se usuário foi realmente criado na base
        cy.request('GET', `${Cypress.env('apiUrl')}/clientes/${userId}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.Usuario).to.eq(testUser.email);
            expect(response.body.PrimeiroNome).to.eq(testUser.primeiroNome);
          });
      });
      
      // Aguardar redirecionamento para login
      cy.url().should('include', '/login', { timeout: 10000 });
      
      // ========== ETAPA 3: LOGIN VIA UI ==========
      cy.get('input[name="usuario"]').type(testUser.email);
      cy.get('input[name="senha"]').type(testUser.senha);
      
      cy.intercept('POST', '**/login').as('loginUser');
      
      cy.get('button[type="submit"]').click();
      
      // Validar login
      cy.wait('@loginUser').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.have.property('Sucesso', true);
        expect(interception.response.body.Cliente).to.have.property('Usuario', testUser.email);
      });
      
      // ========== ETAPA 4: DASHBOARD ==========
      cy.url().should('include', '/dashboard', { timeout: 10000 });
      
      // Verificar dados no dashboard
      cy.contains(`Bem-vindo, ${testUser.primeiroNome}`).should('be.visible');
      cy.contains(testUser.email).should('be.visible');
      cy.contains(testUser.cidade).should('be.visible');
      cy.contains(testUser.estado).should('be.visible');
      
      // ========== ETAPA 5: TESTAR MAILING VIA API ==========
      // Testar se o email funciona via API (usuário está na base)
      cy.request('POST', `${Cypress.env('apiUrl')}/mailing`, {
        Email: testUser.email
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('Sucesso', true);
        expect(response.body).to.have.property('Mensagem', 'Email enviado com sucesso!');
      });
      
      // ========== ETAPA 6: LOGOUT ==========
      cy.get('#logout-btn').click();
      
      // Confirmar logout
      cy.on('window:confirm', () => true);
      
      // Verificar redirecionamento para login
      cy.url().should('include', '/login');
      
      // ========== ETAPA 7: VALIDAR LIMPEZA DE SESSÃO ==========
      // Tentar acessar dashboard diretamente (deve redirecionar)
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
    });

    it('should validate data consistency between UI and API', function() {
      // Verificar se o usuário foi criado no teste anterior
      expect(createdUserId).to.exist;
      
      // Buscar dados via API
      cy.request('GET', `${Cypress.env('apiUrl')}/clientes/${createdUserId}`)
        .then((apiResponse) => {
          
          // Fazer login via UI
          cy.visit('/login');
          cy.get('input[name="usuario"]').type(testUser.email);
          cy.get('input[name="senha"]').type(testUser.senha);
          cy.get('button[type="submit"]').click();
          
          // Ir para dashboard
          cy.url().should('include', '/dashboard', { timeout: 10000 });
          
          // Comparar dados da API com dados exibidos na UI
          cy.contains(apiResponse.body.PrimeiroNome).should('be.visible');
          cy.contains(apiResponse.body.UltimoNome).should('be.visible');
          cy.contains(apiResponse.body.Usuario).should('be.visible');
          cy.contains(apiResponse.body.Cidade).should('be.visible');
          cy.contains(apiResponse.body.Estado).should('be.visible');
        });
    });
  });

  describe('Cenários de Erro e Edge Cases', () => {
    
    it('should handle API errors gracefully in UI', () => {
      // Simular erro de API durante cadastro
      cy.intercept('POST', '**/clientes', {
        statusCode: 500,
        body: { message: 'Erro interno do servidor' }
      }).as('serverError');
      
      cy.visit('/register');
      
      cy.get('input[name="primeiroNome"]').type('Teste');
      cy.get('input[name="ultimoNome"]').type('Erro');
      cy.get('input[name="usuario"]').type('teste@erro.com');
      cy.get('input[name="senha"]').type('123456');
      cy.get('input[name="cidade"]').type('Cidade');
      cy.get('select[name="estado"]').select('SP');
      
      cy.get('button[type="submit"]').click();
      
      cy.wait('@serverError');
      
      // Verificar que erro é exibido na UI
      cy.contains('Erro').should('be.visible');
      
      // Verificar que permanece na página de cadastro
      cy.url().should('include', '/register');
    });

    it('should handle network timeout', () => {
      // Simular timeout na API
      cy.intercept('POST', '**/login', (req) => {
        req.reply((res) => {
          return new Promise((resolve) => {
            setTimeout(() => resolve(res), 30000); // 30 segundos
          });
        });
      }).as('timeoutLogin');
      
      cy.visit('/login');
      cy.get('input[name="usuario"]').type('test@timeout.com');
      cy.get('input[name="senha"]').type('123456');
      cy.get('button[type="submit"]').click();
      
      // Verificar que o botão fica em loading
      cy.get('button[type="submit"]').should('contain', 'Entrando...');
      cy.get('button[type="submit"]').should('be.disabled');
    });
  });
});
```

---

## 🎯 Módulo 5: Executando e Concluindo (5 minutos)

### 5.1 Executando Todos os Testes (5 min)

#### **Via Interface Gráfica (Recomendado para desenvolvimento):**
```bash
npx cypress open
```

#### **Via Linha de Comando (Headless - CI/CD):**
```bash
# Executar todos os testes
npx cypress run

# Executar por categoria
npx cypress run --spec "cypress/e2e/ui-tests.cy.js"      # Apenas UI
npx cypress run --spec "cypress/e2e/api-tests.cy.js"    # Apenas API
npx cypress run --spec "cypress/e2e/integration.cy.js"  # Integração

# Executar com browser específico
npx cypress run --browser chrome

# Executar em paralelo (se configurado)
npx cypress run --record --parallel

#instale o mochawesome para poder gerar relatorios
npm install --save-dev mochawesome

# Gerar relatórios detalhados
npx cypress run --reporter mochawesome --reporter-options reportDir=reports,overwrite=false,html=false,json=true
```

#### **Scripts de package.json sugeridos:**
```json
{
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "cy:ui": "cypress run --spec 'cypress/e2e/ui-tests.cy.js'",
    "cy:api": "cypress run --spec 'cypress/e2e/api-tests.cy.js'",
    "cy:integration": "cypress run --spec 'cypress/e2e/integration.cy.js'",
    "cy:all": "cypress run --spec 'cypress/e2e/*.cy.js'"
  }
}
```

### 5.2 Estrutura Final dos Arquivos de Teste

```
cypress-inovatech-tests/
├── cypress/
│   ├── e2e/
│   │   ├── health-check.cy.js    # ✅ Verificação de conectividade
│   │   ├── ui-tests.cy.js        # 🌐 Testes de interface web
│   │   ├── api-tests.cy.js       # 🔌 Testes diretos na API
│   │   └── integration.cy.js     # 🔄 Testes híbridos UI+API
│   ├── support/
│   │   ├── commands.js           # Comandos customizados
│   │   └── e2e.js               # Configurações globais
│   └── fixtures/
│       └── users.json           # Dados de teste
├── cypress.config.js             # Configuração principal
└── package.json                  # Dependências
```

### 5.3 Comandos Customizados Úteis

#### **Adicionar em `cypress/support/commands.js`:**

```javascript
// Comando para fazer login via UI
Cypress.Commands.add('loginUI', (email, password) => {
  cy.visit('/login');
  cy.get('input[name="usuario"]').type(email);
  cy.get('input[name="senha"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Comando para criar usuário via API
Cypress.Commands.add('createUserAPI', (userData) => {
  return cy.request('POST', `${Cypress.env('apiUrl')}/clientes`, userData);
});

// Comando para limpar dados de teste
Cypress.Commands.add('cleanupTestData', () => {
  // Implementar limpeza se necessário
  cy.log('Limpeza de dados de teste realizada');
});
```

### 5.4 Configuração de CI/CD Atualizada

#### **GitHub Actions para ambos Frontend e Backend:**
```yaml
name: InovaTech E2E Tests

on: [push, pull_request]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
          
      - name: Start Backend
        run: |
          cd APP
          mvn spring-boot:run &
          echo "Backend started on port 5000"
          
      - name: Setup Frontend
        run: |
          cd FrontEnd
          npm install
          npm run build
          npm run preview &
          echo "Frontend started on port 5173"
          
      - name: Wait for services
        run: |
          npx wait-on http://localhost:5000/clientes
          npx wait-on http://localhost:5173
          
      - name: Run Cypress Tests
        uses: cypress-io/github-action@v6
        with:
          working-directory: cypress-inovatech-tests
          browser: chrome
          
      - name: Upload Screenshots
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress-inovatech-tests/cypress/screenshots
          
      - name: Upload Videos
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-videos
          path: cypress-inovatech-tests/cypress/videos
```

---

## 🎓 Encerramento e Próximos Passos

### **O que aprendemos:**
- ✅ Setup completo do Cypress para aplicações full-stack
- ✅ **Testes de UI:** Interações com interface web (cadastro, login, dashboard)
- ✅ **Testes de API:** Validações diretas nos endpoints REST
- ✅ **Testes Híbridos:** Combinação UI + API para cobertura completa
- ✅ Interceptação e mocking de requisições HTTP
- ✅ Gerenciamento de dados de teste e cleanup
- ✅ Validações robustas e tratamento de erros
- ✅ Configuração de CI/CD para ambientes completos

### **Vantagens da abordagem multi-camada:**

#### **🌐 Testes de UI:**
- **Experiência Real:** Testam como o usuário final usa a aplicação
- **Validação Visual:** Verificam interface, layout e fluxos
- **Integração Completa:** Frontend + Backend + Banco de dados

#### **🔌 Testes de API:**
- **Rapidez:** Execução mais rápida que testes de UI
- **Confiabilidade:** Menos sujeitos a flakiness
- **Cobertura de Lógica:** Testam regras de negócio diretamente
- **Debug Simplificado:** Mais fáceis de debugar e manter

#### **🔄 Testes Híbridos:**
- **Melhor dos Mundos:** UI para fluxo + API para validação
- **Detecção de Inconsistências:** Garantem sincronia entre camadas
- **Otimização:** Usam API onde UI não é necessária

### **Matriz de Cobertura Alcançada:**

| Funcionalidade | UI Tests | API Tests | Integration |
|----------------|----------|-----------|-------------|
| 👤 Cadastro de usuário | ✅ | ✅ | ✅ |
| 🔐 Login/Autenticação | ✅ | ✅ | ✅ |
| 📊 Dashboard/Perfil | ✅ | ➖ | ✅ |
| 📧 Sistema de mailing | ➖ | ✅ | ✅ |
| 🚪 Logout/Sessão | ✅ | ➖ | ✅ |
| ❌ Tratamento de erros | ✅ | ✅ | ✅ |
| 🔄 Validação de dados | ✅ | ✅ | ✅ |

### **Estratégias de Teste por Cenário:**

#### **Use Testes de UI quando:**
- 🎯 Testar fluxos críticos do usuário
- 🖥️ Validar interface e usabilidade  
- 🔗 Testar integrações complexas
- 📱 Verificar responsividade

#### **Use Testes de API quando:**
- ⚡ Precisar de execução rápida
- 🧪 Testar lógica de negócio isolada
- 📊 Validar contratos de API
- 🔄 Executar testes de carga/stress

#### **Use Testes Híbridos quando:**
- 🎭 Simular cenários reais completos
- 🔍 Detectar problemas de integração
- 📈 Maximizar cobertura com eficiência
- 🐛 Debugar problemas complexos

### **Próximos Passos - Roadmap Avançado:**

#### **📋 Nível Iniciante (já alcançado):**
- ✅ Setup básico e testes funcionais
- ✅ Validações de CRUD
- ✅ Tratamento básico de erros

#### **🚀 Nível Intermediário:**
1. **Fixtures Avançadas:** Usar `cypress/fixtures` para cenários complexos
2. **Comandos Customizados:** Biblioteca de comandos reutilizáveis
3. **Page Objects:** Organizar testes com padrão Page Object
4. **Dados Dinâmicos:** Geração automática de dados de teste
5. **Relatórios:** Integrar Mochawesome ou Allure

#### **⚡ Nível Avançado:**
1. **Testes Visuais:** Cypress Visual Testing para regressão visual
2. **Accessibility:** Integração com cypress-axe para testes A11Y
3. **Performance:** Monitoramento de performance com cypress-audit
4. **Mobile:** Testes em diferentes viewports e dispositivos
5. **Paralelização:** Execução distribuída com Cypress Dashboard

#### **🏭 Nível Enterprise:**
1. **Multi-ambiente:** Testes em DEV, QA, STAGING
2. **Cross-browser:** Chrome, Firefox, Edge, Safari
3. **Dados Sensíveis:** Gestão segura de credenciais
4. **Monitoramento:** Integração com ferramentas de observabilidade
5. **Kubernetes:** Deploy de testes em clusters

### **📚 Recursos para Continuidade:**

#### **Documentação Essencial:**
- 📖 [Cypress Docs](https://docs.cypress.io) - Documentação oficial
- 🔧 [Best Practices](https://docs.cypress.io/guides/references/best-practices) - Melhores práticas
- 🧩 [Plugin Directory](https://docs.cypress.io/plugins/directory) - Plugins da comunidade
- 🎥 [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app) - Exemplo avançado

#### **Comunidade e Suporte:**
- 💬 [Discord Cypress](https://discord.gg/cypress) - Comunidade ativa
- 🐙 [GitHub Issues](https://github.com/cypress-io/cypress/issues) - Reportar bugs
- 📚 [Cypress Blog](https://cypress.io/blog) - Artigos e novidades
- 🎓 [Cypress University](https://learn.cypress.io/) - Cursos oficiais

### **🏆 Certificação da Conclusão:**

**Parabéns! 🎉** Você completou o treinamento completo de Cypress para InovaTech e agora domina:

- ✅ **Testes End-to-End completos** (UI + API + Integration)
- ✅ **Estratégias de teste para aplicações full-stack**
- ✅ **Configuração profissional** de ambientes de teste
- ✅ **Boas práticas** de automação de qualidade
- ✅ **Pipeline de CI/CD** com testes automatizados

**Próximo nível:** Aplique esses conhecimentos em projetos reais e explore os recursos avançados sugeridos! 🚀