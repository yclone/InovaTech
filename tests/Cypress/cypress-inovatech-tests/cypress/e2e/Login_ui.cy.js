
describe('InovaTech - teste de login com IA', () => {

    beforeEach(() => {
        cy.visit('/login');
    });

    it('deve realizar login com credenciais validas', () => {
        cy.get('input[name="usuario"]').type("teste@teste.com");
        cy.get('input[name="senha"]').type("senha123");
        // cy.get('button[type="submit"]').click();
        cy.smartClick('#login-btn').should('be.visible');

        // Verificar redirecionamento para dashboard
        cy.url().should('include', '/dashboard');
    });

});

