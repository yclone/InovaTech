/// <reference types="cypress" />

/**
 * ConfiguracaoPage - Page Object para configuração de testes de API
 * 
 * Esta classe encapsula toda a lógica de configuração inicial dos testes,
 * incluindo definição de URLs, endpoints e headers.
 * 
 * Como funciona a comunicação com Step Definitions:
 * 
 * 1. Arquivo .feature (Gherkin):
 *    Dado Que defino a URL como "https://api.com" para o caso de teste "Login"
 * 
 * 2. Step Definition (given.js):
 *    Given(/^Que defino a URL.../, (url, testCase) => {
 *      ConfiguracaoPage.definirURLParaTeste(url, testCase); // ← Chama este Page Object
 *    });
 * 
 * 3. Page Object (este arquivo):
 *    definirURLParaTeste(url, testCase) {
 *      cy.wrap(url).as('baseUrl');        // ← Armazena URL como alias do Cypress
 *      cy.wrap(testCase).as('testCase');  // ← Armazena nome do teste
 *      cy.wrap({}).as('headers');         // ← Inicializa headers vazio
 *      return this;                       // ← Permite encadeamento de métodos
 *    }
 * 
 * Benefícios desta abordagem:
 * - ✅ Reutilização: Mesma lógica usada por múltiplos steps
 * - ✅ Manutenção: Mudanças centralizadas em um único lugar
 * - ✅ Legibilidade: Steps ficam limpos, apenas chamam métodos
 * - ✅ Testabilidade: Page Objects podem ser testados isoladamente
 */
class ConfiguracaoPage {
  /**
   * Define o endpoint a ser testado
   * 
   * Uso no Step Definition:
   * Given(/^Que quero testar o "([^"]*)"$/, (endpoint) => {
   *   ConfiguracaoPage.definirEndpoint(endpoint);
   * });
   * 
   * @param {string} endpoint - O endpoint da API (ex: '/auth/login', '/produtos')
   * @returns {ConfiguracaoPage} Retorna this para permitir encadeamento de métodos
   * 
   * @example
   * ConfiguracaoPage.definirEndpoint('/auth/login');
   * // Armazena '/auth/login' no alias @endpoint do Cypress
   */
  definirEndpoint(endpoint) {
    cy.wrap(endpoint).as('endpoint');
    cy.wrap({}).as('headers');
    return this;
  }

  /**
   * Define a URL base e o caso de teste
   * 
   * Uso no Step Definition:
   * Given(/^Que defino a URL como "([^"]*)" para o caso de teste "([^"]*)"$/, (url, testCase) => {
   *   ConfiguracaoPage.definirURLParaTeste(url, testCase);
   * });
   * 
   * Fluxo de comunicação:
   * Feature → Step Definition → Page Object → Cypress Aliases
   * 
   * @param {string} url - A URL base da API (ex: 'https://api.inovatech.com.br')
   * @param {string} testCase - O nome do caso de teste para rastreamento
   * @returns {ConfiguracaoPage} Retorna this para permitir encadeamento
   * 
   * @example
   * ConfiguracaoPage.definirURLParaTeste('https://api.inovatech.com.br', 'Login Teste');
   * // Armazena no Cypress:
   * //   @baseUrl = 'https://api.inovatech.com.br'
   * //   @testCase = 'Login Teste'
   * //   @headers = {}
   */
  definirURLParaTeste(url, testCase) {
    cy.wrap(url).as('baseUrl');
    cy.wrap(testCase).as('testCase');
    cy.wrap({}).as('headers');
    return this;
  }

  /**
   * Define apenas a URL base (sem caso de teste)
   * 
   * Uso no Step Definition:
   * Given(/^Que defino a URL como "([^"]*)"$/, (url) => {
   *   ConfiguracaoPage.definirURL(url);
   * });
   * 
   * @param {string} url - A URL base da API
   * @returns {ConfiguracaoPage} Retorna this para permitir encadeamento
   * 
   * @example
   * ConfiguracaoPage.definirURL('https://api.inovatech.com.br');
   * // Armazena @baseUrl e @headers no Cypress
   */
  definirURL(url) {
    cy.wrap(url).as('baseUrl');
    cy.wrap({}).as('headers');
    return this;
  }
}

export default new ConfiguracaoPage();
