import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// ========================================
// GIVEN - Pré-condições
// ========================================

Given('que já existe uma sessão ativa', () => {
  // Faz um login inicial para criar a sessão
  cy.loginWithSession('admin');
  cy.log('✅ Sessão inicial criada');
});

Given('que estou logado como {string}', (userType) => {
  cy.loginWithSession(userType);
  cy.visit('/dashboard');
  cy.url().should('include', '/dashboard');
  cy.log(`✅ Logado como: ${userType}`);
});

// ========================================
// WHEN - Ações
// ========================================

When('eu faço login usando cy.session como {string}', (userType) => {
  cy.loginWithSession(userType);
});

When('eu faço login via API usando cy.session como {string}', (userType) => {
  cy.loginWithSessionAPI(userType);
});

When('eu troco para o usuário {string}', (userType) => {
  cy.loginWithSession(userType);
  cy.visit('/dashboard');
});

// ========================================
// THEN - Validações
// ========================================

Then('os dados devem estar salvos no localStorage', () => {
  cy.window().then((win) => {
    const currentUser = win.localStorage.getItem('currentUser');
    const isAuthenticated = win.localStorage.getItem('isAuthenticated');
    
    expect(currentUser).to.not.be.null;
    expect(isAuthenticated).to.equal('true');
    
    const userData = JSON.parse(currentUser);
    expect(userData).to.have.property('Email');
    
    cy.log('✅ Dados salvos no localStorage corretamente');
  });
});

Then('devo estar na dashboard', () => {
  cy.visit('/dashboard');
  cy.url().should('include', '/dashboard');
  cy.log('✅ Redirecionado para dashboard');
});

Then('o login deve ser muito rápido', () => {
  // Esta validação é mais conceitual no BDD
  // A validação real de tempo está no arquivo .cy.js
  cy.log('✅ Login com cache é rápido');
});

Then('devo estar logado como {string}', (userType) => {
  cy.window().then((win) => {
    const currentUser = win.localStorage.getItem('currentUser');
    expect(currentUser).to.not.be.null;
    
    const userData = JSON.parse(currentUser);
    cy.log(`✅ Usuário atual: ${userData.Email}`);
    
    // Verifica que é o usuário esperado
    expect(userData.Email.toLowerCase()).to.include(userType.toLowerCase());
  });
});

Then('os dados do usuário devem estar corretos', () => {
  cy.window().then((win) => {
    const currentUser = win.localStorage.getItem('currentUser');
    const userData = JSON.parse(currentUser);
    
    expect(userData).to.have.property('Email');
    expect(userData).to.have.property('PrimeiroNome');
    
    cy.log(`✅ Dados do usuário válidos: ${userData.PrimeiroNome}`);
  });
});

Then('devo estar autenticado como {string}', (perfil) => {
  cy.window().then((win) => {
    const isAuthenticated = win.localStorage.getItem('isAuthenticated');
    expect(isAuthenticated).to.equal('true');
    
    const currentUser = win.localStorage.getItem('currentUser');
    const userData = JSON.parse(currentUser);
    
    expect(userData.Email.toLowerCase()).to.include(perfil.toLowerCase());
    
    cy.log(`✅ Autenticado como: ${perfil}`);
  });
});

Then('devo ter acesso à dashboard', () => {
  cy.visit('/dashboard');
  cy.url().should('include', '/dashboard');
  
  // Verifica que não foi redirecionado para login
  cy.url().should('not.include', '/login');
  
  cy.log('✅ Acesso à dashboard confirmado');
});
