// ***********************************************
// Comandos customizados do Cypress
// ***********************************************

/**
 * Comando para login
 * @example cy.login('admin', 'senha123')
 */
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login');
  cy.get('[data-testid="username"]').type(username);
  cy.get('[data-testid="password"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

/**
 * Comando para verificar se o usuário está logado
 * @example cy.shouldBeLoggedIn()
 */
Cypress.Commands.add('shouldBeLoggedIn', () => {
  cy.url().should('not.include', '/login');
  cy.get('[data-testid="user-menu"]').should('be.visible');
});

/**
 * Comando para fazer logout
 * @example cy.logout()
 */
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-menu"]').click();
  cy.get('[data-testid="logout-button"]').click();
});

/**
 * Comando para preencher formulário de cadastro
 * @example cy.fillForm({name: 'Teste', email: 'teste@example.com'})
 */
Cypress.Commands.add('fillForm', (data) => {
  Object.keys(data).forEach((key) => {
    cy.get(`[name="${key}"]`).clear().type(data[key]);
  });
});

/**
 * Comando para esperar o carregamento da página
 * @example cy.waitForPageLoad()
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('.loading-spinner', { timeout: 10000 }).should('not.exist');
});

/**
 * Comando para verificar mensagem de sucesso
 * @example cy.shouldShowSuccessMessage('Operação realizada com sucesso')
 */
Cypress.Commands.add('shouldShowSuccessMessage', (message) => {
  cy.get('.success-message, .alert-success').should('be.visible').and('contain', message);
});

/**
 * Comando para verificar mensagem de erro
 * @example cy.shouldShowErrorMessage('Erro ao processar')
 */
Cypress.Commands.add('shouldShowErrorMessage', (message) => {
  cy.get('.error-message, .alert-error, .alert-danger').should('be.visible').and('contain', message);
});

// ***********************************************
// Comandos de Autenticação com Segurança
// ***********************************************

/**
 * Login básico usando variáveis de ambiente
 * @param {string} userType - Tipo de usuário (admin, user, qa_tester)
 * @example cy.loginAs('admin')
 */
Cypress.Commands.add('loginAs', (userType) => {
  const users = Cypress.env('users');
  
  if (!users || !users[userType]) {
    throw new Error(`Usuário '${userType}' não encontrado no cypress.env.json`);
  }
  
  const user = users[userType];
  
  cy.visit('/login');
  cy.get('#usuario').clear().type(user.email);
  cy.get('#senha').clear().type(user.password, { log: false });
  cy.get('#login-btn').click();
  
  // Aguarda redirecionamento indicando sucesso
  cy.url().should('not.include', '/login', { timeout: 10000 });
});

/**
 * Login via API (mais rápido que UI)
 * @param {string} userType - Tipo de usuário
 * @example cy.loginViaAPI('admin')
 */
Cypress.Commands.add('loginViaAPI', (userType) => {
  const users = Cypress.env('users');
  const apiUrl = Cypress.env('api')?.baseUrl || 'http://localhost:5000';
  
  if (!users || !users[userType]) {
    throw new Error(`Usuário '${userType}' não encontrado no cypress.env.json`);
  }
  
  const user = users[userType];
  
  cy.request({
    method: 'POST',
    url: `${apiUrl}/login`,
    body: {
      Usuario: user.email,
      Senha: user.password
    },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status !== 200 || !response.body.Sucesso) {
      throw new Error(`Login falhou: ${response.body.Mensagem || 'Erro desconhecido'}`);
    }
    
    // Salva dados no localStorage
    const userData = response.body.Cliente;
    window.localStorage.setItem('currentUser', JSON.stringify(userData));
    window.localStorage.setItem('isAuthenticated', JSON.stringify(true));
  });
});

/**
 * ⭐ Login com cy.session() - Mantém sessão entre testes (RECOMENDADO)
 * @param {string} userType - Tipo de usuário (admin, user, qa_tester)
 * @example cy.loginWithSession('admin')
 */
Cypress.Commands.add('loginWithSession', (userType) => {
  const users = Cypress.env('users');
  
  if (!users || !users[userType]) {
    throw new Error(`Usuário '${userType}' não encontrado no cypress.env.json`);
  }
  
  const user = users[userType];
  
  cy.session(
    `inovatech-session-${userType}`,
    () => {
      cy.log(`🔐 Fazendo login como: ${userType}`);
      
      cy.visit('/login');
      cy.get('#usuario').clear().type(user.email);
      cy.get('#senha').clear().type(user.password, { log: false });
      cy.get('#login-btn').click();
      
      // Aguarda o redirecionamento para dashboard
      cy.url().should('include', '/dashboard', { timeout: 10000 });
      
      cy.log(`✅ Login bem-sucedido: ${userType}`);
    },
    {
      validate() {
        cy.log(`🔍 Validando sessão de: ${userType}`);
        
        cy.window().then((win) => {
          const currentUser = win.localStorage.getItem('currentUser');
          const isAuthenticated = win.localStorage.getItem('isAuthenticated');
          
          if (!currentUser || !isAuthenticated) {
            cy.log(`❌ Sessão inválida - dados faltando no localStorage`);
            throw new Error('Sessão inválida - refazendo login');
          }
          
          try {
            const userData = JSON.parse(currentUser);
            const authStatus = JSON.parse(isAuthenticated);
            
            if (!userData || authStatus !== true) {
              throw new Error('Dados de sessão inválidos');
            }
            
            cy.log(`✅ Sessão válida: ${userData.Email || userData.Usuario || userType}`);
          } catch (e) {
            cy.log(`❌ Erro ao validar sessão: ${e.message}`);
            throw new Error('Sessão corrompida');
          }
        });
      },
      cacheAcrossSpecs: true
    }
  );
});

/**
 * ⭐ Login via API com cy.session() - SUPER RÁPIDO! (RECOMENDADO)
 * @param {string} userType - Tipo de usuário
 * @example cy.loginWithSessionAPI('admin')
 */
Cypress.Commands.add('loginWithSessionAPI', (userType) => {
  const users = Cypress.env('users');
  const apiUrl = Cypress.env('api')?.baseUrl || 'http://localhost:5000';
  
  if (!users || !users[userType]) {
    throw new Error(`Usuário '${userType}' não encontrado no cypress.env.json`);
  }
  
  const user = users[userType];
  
  cy.session(
    `inovatech-api-session-${userType}`,
    () => {
      cy.log(`🚀 Login via API como: ${userType}`);
      
      cy.request({
        method: 'POST',
        url: `${apiUrl}/login`,
        body: {
          Usuario: user.email,
          Senha: user.password
        },
        failOnStatusCode: false
      }).then((response) => {
        if (response.status !== 200 || !response.body.Sucesso) {
          throw new Error(`Login falhou: ${response.body.Mensagem || 'Erro desconhecido'}`);
        }
        
        const userData = response.body.Cliente;
        
        cy.window().then((win) => {
          win.localStorage.setItem('currentUser', JSON.stringify(userData));
          win.localStorage.setItem('isAuthenticated', JSON.stringify(true));
        });
        
        cy.log(`✅ Login API bem-sucedido: ${userData.Email || user.email}`);
      });
    },
    {
      validate() {
        cy.window().then((win) => {
          const currentUser = win.localStorage.getItem('currentUser');
          const isAuthenticated = win.localStorage.getItem('isAuthenticated');
          
          if (!currentUser || !isAuthenticated) {
            throw new Error('Sessão API inválida');
          }
          
          const userData = JSON.parse(currentUser);
          const authStatus = JSON.parse(isAuthenticated);
          
          if (!userData || authStatus !== true) {
            throw new Error('Dados de sessão API inválidos');
          }
        });
      },
      cacheAcrossSpecs: true
    }
  );
});
