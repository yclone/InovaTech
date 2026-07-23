// Importar comandos customizados
import './commands';

// Configuração global antes de cada teste
beforeEach(() => {
  // Limpar cookies e local storage
  cy.clearCookies();
  cy.clearLocalStorage();
});

// Tratamento de exceções não capturadas
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retornar false para prevenir que o Cypress falhe o teste
  // em caso de exceções não tratadas da aplicação
  return false;
});
