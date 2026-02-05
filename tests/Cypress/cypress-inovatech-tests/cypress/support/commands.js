// ***********************************************
// Custom Commands para InovaTech
// ***********************************************

import { getSelectorFromGemini } from '../utils/gemini_service';

/**
 * Comando customizado para login genérico
 * @example cy.loginAs('admin')
 * @example cy.loginAs('user')
 */
Cypress.Commands.add('loginAs', (userType) => {
  const users = Cypress.env('users');
  
  if (!users || !users[userType]) {
    throw new Error(`Usuário '${userType}' não encontrado no cypress.env.json`);
  }
  
  const user = users[userType];
  
  // Validação adicional para garantir que email e password existem
  if (!user.email || !user.password) {
    throw new Error(`Credenciais incompletas para '${userType}'. Email: ${user.email}, Password: ${user.password ? '***' : 'undefined'}`);
  }
  
  const frontendUrl = Cypress.env('frontendUrl');
  
  cy.visit(`${frontendUrl}/login`);
  cy.get('#usuario, input[type="email"], input[name="email"]').clear().type(user.email);
  cy.get('#senha, input[type="password"], input[name="password"]').clear().type(user.password, { log: false }); // { log: false } esconde a senha dos logs
  cy.get('#login-btn, button[type="submit"]').click();
  
  // Aguarda redirecionamento indicando sucesso
  cy.url().should('not.include', '/login', { timeout: 10000 });
});

/**
 * Comando para login via API (mais rápido)
 * @example cy.loginViaAPI('admin')
 */
Cypress.Commands.add('loginViaAPI', (userType) => {
  const users = Cypress.env('users');
  const apiUrl = Cypress.env('apiUrl');
  
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
    // Salva token ou dados de sessão
    if (response.body && response.body.token) {
      window.localStorage.setItem('token', response.body.token);
    }
    if (response.body && response.body.user) {
      window.localStorage.setItem('user', JSON.stringify(response.body.user));
    }
  });
});

/**
 * ⭐ COMANDO COM cy.session() - MELHOR PERFORMANCE! ⭐
 * Mantém a sessão entre testes, evitando logins repetidos
 * @example cy.loginWithSession('admin')
 * @example cy.loginWithSession('user')
 */
Cypress.Commands.add('loginWithSession', (userType) => {
  const users = Cypress.env('users');
  
  if (!users || !users[userType]) {
    throw new Error(`Usuário '${userType}' não encontrado no cypress.env.json`);
  }
  
  const user = users[userType];
  const frontendUrl = Cypress.env('frontendUrl');
  
  // cy.session cria e restaura sessões automaticamente
  cy.session(
    // ID único da sessão (baseado no tipo de usuário)
    `user-session-${userType}`,
    
    // Função que executa o login (executada apenas uma vez)
    () => {
      cy.log(`🔐 Fazendo login como: ${userType}`);
      
      cy.visit(`${frontendUrl}/login`);
      cy.get('#usuario, input[type="email"], input[name="email"]').clear().type(user.email);
      cy.get('#senha, input[type="password"], input[name="password"]').clear().type(user.password, { log: false });
      cy.get('#login-btn, button[type="submit"]').click();
      
      // Aguarda o login ser concluído
      cy.url().should('not.include', '/login', { timeout: 10000 });
      
      cy.log(`✅ Login bem-sucedido como: ${userType}`);
    },
    
    // Opções de validação e configuração
    {
      // Valida se a sessão ainda é válida
      validate() {
        cy.log(`🔍 Validando sessão de: ${userType}`);
        
        // ⭐ NOVA VALIDAÇÃO: Usa endpoint /session do backend
        const apiUrl = Cypress.env('apiUrl');
        
        cy.request({
          method: 'GET',
          url: `${apiUrl}/session`,
          failOnStatusCode: false
        }).then((response) => {
          if (response.status !== 200) {
            cy.log(`❌ Sessão inválida - backend retornou ${response.status}`);
            throw new Error('Sessão inválida - backend retornou erro');
          }
          cy.log(`✅ Sessão válida para: ${response.body.usuario?.Usuario || userType}`);
        });
      },
      
      // Cache da sessão (acelera ainda mais)
      cacheAcrossSpecs: true
    }
  );
});

/**
 * ⭐ COMANDO COM cy.session() + API - SUPER RÁPIDO! ⭐
 * Usa API para login e mantém sessão
 * @example cy.loginWithSessionAPI('admin')
 */
Cypress.Commands.add('loginWithSessionAPI', (userType) => {
  const users = Cypress.env('users');
  const apiUrl = Cypress.env('apiUrl');
  
  if (!users || !users[userType]) {
    throw new Error(`Usuário '${userType}' não encontrado no cypress.env.json`);
  }
  
  const user = users[userType];
  
  cy.session(
    `api-user-session-${userType}`,
    () => {
      cy.log(`🔐 Fazendo login via API como: ${userType}`);
      
      cy.request({
        method: 'POST',
        url: `${apiUrl}/login`,
        body: {
          Usuario: user.email,
          Senha: user.password
        },
        failOnStatusCode: false
      }).then((response) => {
        // Salva os dados no localStorage
        if (response.body && response.body.token) {
          window.localStorage.setItem('token', response.body.token);
        }
        if (response.body && response.body.Cliente) {
          window.localStorage.setItem('user', JSON.stringify(response.body.Cliente));
        }
        
        cy.log(`✅ Login via API bem-sucedido como: ${userType}`);
      });
    },
    {
      validate() {
        cy.log(`🔍 Validando sessão API de: ${userType}`);
        
        // ⭐ VALIDAÇÃO: Usa endpoint /session do backend
        cy.request({
          method: 'GET',
          url: `${apiUrl}/session`,
          failOnStatusCode: false
        }).then((response) => {
          if (response.status !== 200) {
            cy.log(`❌ Sessão inválida - status ${response.status}`);
            throw new Error('Sessão inválida');
          }
          cy.log(`✅ Sessão válida: ${response.body.sessionId}`);
        });
      },
      cacheAcrossSpecs: true
    }
  );
});


Cypress.Commands.add('smartClick', (selector) => {
  const geminiApiKey = Cypress.env('GEMINI_API_KEY');
  cy.get('body', { timeout: 20000 }).then($body => {
    console.log($body.html());
    if ($body.find(selector).length > 0) {
      cy.get(selector).click();
    } else {
      Cypress.log({
        name: 'smartClick',
        message: `O Seletor '${selector}' não encontrado. Tentando Self-Healing...`
      });

      cy.document().then((doc) => {
        const pageHtml = doc.documentElement.outerHTML;
        console.log('HTML da página para Gemini:', pageHtml);
        // Retorne a promise para o Cypress encadear corretamente
        return getSelectorFromGemini(geminiApiKey, pageHtml, `o elemento com seletor "${selector}"`);
      }).then((newSelector) => {
        console.log('Novo seletor sugerido pelo Gemini:', newSelector);
        if (newSelector) {
          Cypress.log({
            name: 'smartClick',
            message: `Gemini encontrou um novo seletor: '${newSelector}'. Tentando novamente...`
          });
          cy.get(newSelector).click();
        } else {
          Cypress.log({
            name: 'smartClick',
            message: 'Gemini não encontrou um seletor alternativo. A falha continuará.'
          });
          throw new Error(`Falha no smartClick: Seletor '${selector}' e alternativa não encontrados.`);
        }
      });
    }
  });
});