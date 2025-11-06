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