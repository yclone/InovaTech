/// <reference types="cypress" />

class ValidacaoPage {
  /**
   * Verifica se o status code é igual ao esperado
   * @param {number|string} statusCode - O código de status esperado
   */
  verificarStatusCode(statusCode) {
    cy.get('@response').its('status').should('eq', parseInt(statusCode, 10));
    return this;
  }

  /**
   * Verifica se o valor de um campo da resposta é igual ao esperado
   * 
   * Suporta tanto objetos quanto arrays:
   * - Objeto: { "Usuario": "teste@email.com" }
   * - Array: [{ "Usuario": "teste@email.com" }] → Acessa automaticamente o primeiro item
   * 
   * @param {string} field - O caminho do campo (ex: 'data.id', 'name', ou 'Usuario')
   * @param {any} expectedValue - O valor esperado
   * 
   * @example
   * // Para objeto: { "Mensagem": "Login realizado" }
   * verificarValorIgual("Mensagem", "Login realizado");
   * 
   * // Para array: [{ "Usuario": "paulo@email.com" }]
   * verificarValorIgual("Usuario", "paulo@email.com"); // Acessa automaticamente [0].Usuario
   */
  verificarValorIgual(field, expectedValue) {
    cy.get('@response').its('body').then((body) => {
      // Se a resposta for um array, usa o primeiro elemento
      const targetObject = Array.isArray(body) ? body[0] : body;
      
      const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], targetObject);
      const parsedExpected = isNaN(expectedValue) ? expectedValue : Number(expectedValue);
      const parsedFieldValue = typeof fieldValue === 'string' && !isNaN(fieldValue) ? Number(fieldValue) : fieldValue;
      expect(parsedFieldValue).to.deep.equal(parsedExpected);
    });
    return this;
  }

  /**
   * Verifica se o valor de um campo da resposta é diferente do esperado
   * @param {string} field - O caminho do campo (ex: 'data.id' ou 'name')
   * @param {any} unexpectedValue - O valor que não deve ser igual
   */
  verificarValorDiferente(field, unexpectedValue) {
    cy.get('@response').its('body').then((body) => {
      const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], body);
      const parsedUnexpected = isNaN(unexpectedValue) ? unexpectedValue : Number(unexpectedValue);
      const parsedFieldValue = typeof fieldValue === 'string' && !isNaN(fieldValue) ? Number(fieldValue) : fieldValue;
      expect(parsedFieldValue).to.not.deep.equal(parsedUnexpected);
    });
    return this;
  }

  /**
   * Armazena um valor específico do ResponseBody no Environment
   * @param {string} key - A chave para armazenar
   * @param {string} field - O caminho do campo na resposta (ex: 'data.id')
   */
  armazenarValorNoEnvironment(key, field) {
    cy.get('@response').its('body').then((body) => {
      const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], body);
      cy.wrap(fieldValue).as(key);
      Cypress.env(key, fieldValue);
    });
    return this;
  }

  /**
   * Armazena todo o ResponseBody no Environment
   * @param {string} key - A chave para armazenar
   */
  armazenarResponseBodyCompleto(key) {
    cy.get('@response').its('body').then((body) => {
      cy.wrap(body).as(key);
      Cypress.env(key, JSON.stringify(body));
    });
    return this;
  }

  /**
   * Verifica se a resposta contém um campo específico
   * @param {string} field - O caminho do campo
   */
  verificarCampoExiste(field) {
    cy.get('@response').its('body').then((body) => {
      const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], body);
      expect(fieldValue).to.exist;
    });
    return this;
  }

  /**
   * Verifica se a resposta é um array com tamanho específico
   * @param {string} field - O caminho do campo array
   * @param {number} length - O tamanho esperado do array
   */
  verificarTamanhoArray(field, length) {
    cy.get('@response').its('body').then((body) => {
      const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], body);
      expect(fieldValue).to.be.an('array').and.have.length(parseInt(length, 10));
    });
    return this;
  }

  /**
   * Obtém a resposta completa
   */
  obterResponse() {
    return cy.get('@response');
  }

  /**
   * Obtém o body da resposta
   */
  obterResponseBody() {
    return cy.get('@response').its('body');
  }
}

export default new ValidacaoPage();
