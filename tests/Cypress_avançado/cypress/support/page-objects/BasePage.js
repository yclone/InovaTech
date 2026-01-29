/**
 * Classe Base para Page Objects
 * Contém métodos comuns a todas as páginas
 */
class BasePage {
  /**
   * Visita uma URL específica
   * @param {string} path - Caminho da URL
   */
  visit(path = '') {
    cy.visit(path);
  }

  /**
   * Obtém um elemento por seletor
   * @param {string} selector - Seletor CSS ou data-testid
   * @returns {Cypress.Chainable}
   */
  getElement(selector) {
    return cy.get(selector);
  }

  /**
   * Obtém um elemento por data-testid
   * @param {string} testId - Valor do data-testid
   * @returns {Cypress.Chainable}
   */
  getByTestId(testId) {
    return cy.get(`[data-testid="${testId}"]`);
  }

  /**
   * Clica em um elemento
   * @param {string} selector - Seletor do elemento
   */
  click(selector) {
    this.getElement(selector).click();
  }

  /**
   * Digita texto em um campo
   * @param {string} selector - Seletor do campo
   * @param {string} text - Texto a ser digitado
   */
  type(selector, text) {
    this.getElement(selector).clear().type(text);
  }

  /**
   * Verifica se um elemento está visível
   * @param {string} selector - Seletor do elemento
   */
  shouldBeVisible(selector) {
    this.getElement(selector).should('be.visible');
  }

  /**
   * Verifica se um elemento contém determinado texto
   * @param {string} selector - Seletor do elemento
   * @param {string} text - Texto esperado
   */
  shouldContainText(selector, text) {
    this.getElement(selector).should('contain', text);
  }

  /**
   * Verifica a URL atual
   * @param {string} url - URL esperada
   */
  shouldHaveUrl(url) {
    cy.url().should('include', url);
  }

  /**
   * Espera por um elemento estar visível
   * @param {string} selector - Seletor do elemento
   * @param {number} timeout - Timeout em ms
   */
  waitForElement(selector, timeout = 10000) {
    this.getElement(selector).should('be.visible', { timeout });
  }

  /**
   * Recarrega a página
   */
  reload() {
    cy.reload();
  }

  /**
   * Volta para a página anterior
   */
  goBack() {
    cy.go('back');
  }
}

export default BasePage;
