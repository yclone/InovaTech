/// <reference types="cypress" />

class RequisicaoPage {
  /**
   * Define o content type do header
   * @param {string} contentType - O tipo de conteúdo (ex: application/json)
   */
  definirContentType(contentType) {
    cy.get('@headers').then((headers) => {
      const updatedHeaders = { ...headers, 'Content-Type': contentType };
      cy.wrap(updatedHeaders).as('headers');
    });
    return this;
  }

  /**
   * Define múltiplos headers
   * @param {object} headers - Objeto com os headers
   */
  definirHeaders(headers) {
    cy.get('@headers').then((existingHeaders) => {
      const updatedHeaders = { ...existingHeaders, ...headers };
      cy.wrap(updatedHeaders).as('headers');
    });
    return this;
  }

  /**
   * Faz uma requisição à API com body
   * @param {string} method - O método HTTP (GET, POST, PUT, DELETE, etc)
   * @param {object} body - O corpo da requisição
   */
  fazerRequisicaoComBody(method, body) {
    cy.get('@baseUrl').then((baseUrl) => {
      cy.wrap(null).then(() => {
        return cy.state('aliases')?.endpoint ? cy.get('@endpoint') : cy.wrap('');
      }).then((endpoint) => {
        cy.get('@headers').then((headers) => {
          const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
          cy.request({
            method: method.toUpperCase(),
            url: `${baseUrl}${endpoint || ''}`,
            headers: headers,
            body: parsedBody,
            failOnStatusCode: false
          }).as('response');
        });
      });
    });
    return this;
  }

  /**
   * Faz uma requisição à API sem body
   * @param {string} method - O método HTTP (GET, DELETE, etc)
   */
  fazerRequisicao(method) {
    cy.get('@baseUrl').then((baseUrl) => {
      cy.wrap(null).then(() => {
        return cy.state('aliases')?.endpoint ? cy.get('@endpoint') : cy.wrap('');
      }).then((endpoint) => {
        cy.get('@headers').then((headers) => {
          cy.request({
            method: method.toUpperCase(),
            url: `${baseUrl}${endpoint || ''}`,
            headers: headers,
            failOnStatusCode: false
          }).as('response');
        });
      });
    });
    return this;
  }

  /**
   * Faz uma requisição customizada com todas as opções
   * @param {object} options - Opções da requisição (method, url, headers, body, etc)
   */
  fazerRequisicaoCustomizada(options) {
    cy.request({
      ...options,
      failOnStatusCode: false
    }).as('response');
    return this;
  }
}

export default new RequisicaoPage();
