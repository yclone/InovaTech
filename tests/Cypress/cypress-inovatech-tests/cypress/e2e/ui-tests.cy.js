describe('InovaTech - UI Tests (Interface Web)', () => {
  
  const testUser = {
    primeiroNome: 'Cypress',
    ultimoNome: 'Usuario',
    email: `cypress.ui.${Date.now()}@test.com`,
    senha: 'cypress123',
    cidade: 'São Paulo',
    estado: 'SP'
  };

  beforeEach(() => {
    // Visitar a página de registro
    cy.visit('/register');
  });

  describe('Página de Cadastro', () => {
    
    it('should display register page correctly', () => {
      // Navegar para cadastro
    //   cy.visit('/register');
      
      // Verificar elementos da página
      cy.contains('h1', 'Cadastro').should('be.visible');
      cy.contains('Crie sua conta').should('be.visible');
      
      // Verificar campos do formulário
      cy.get('input[name="primeiroNome"]').should('be.visible');
      cy.get('input[name="ultimoNome"]').should('be.visible');
      cy.get('input[name="usuario"]').should('be.visible');
      cy.get('input[name="senha"]').should('be.visible');
      cy.get('input[name="cidade"]').should('be.visible');
      cy.get('select[name="estado"]').should('be.visible');
      
      // Verificar botão de submit
      cy.get('button[type="submit"]').should('contain', 'Cadastrar');
      
      // Verificar link para login
      cy.contains('Já tem uma conta? Entre aqui').should('be.visible');
    });

    it('should create user successfully via UI', () => {
      // Navegar para cadastro
      cy.visit('/register');
      
      // Preencher formulário
      cy.get('input[name="primeiroNome"]').type(testUser.primeiroNome);
      cy.get('input[name="ultimoNome"]').type(testUser.ultimoNome);
      cy.get('input[name="usuario"]').type(testUser.email);
      cy.get('input[name="senha"]').type(testUser.senha);
      cy.get('input[name="cidade"]').type(testUser.cidade);
      cy.get('select[name="estado"]').select(testUser.estado);
      
      // Interceptar a requisição de cadastro
      cy.intercept('POST', '**/clientes').as('createUser');
      
      // Submeter formulário
      cy.get('button[type="submit"]').click();
      
      // Verificar que a requisição foi feita
      cy.wait('@createUser').then((interception) => {
        expect(interception.response.statusCode).to.eq(201);
        expect(interception.response.body).to.have.property('id');
        expect(interception.response.body.PrimeiroNome).to.eq(testUser.primeiroNome);
      });
      
      // Verificar mensagem de sucesso
      cy.contains('Cadastro realizado com sucesso').should('be.visible');
      
      // Verificar redirecionamento para login
      cy.url().should('include', '/login', { timeout: 10000 });
    });

    it('should show validation errors for empty fields', () => {
      cy.visit('/register');
      
      // Tentar submeter formulário vazio
      cy.get('button[type="submit"]').click();
      
      // HTML5 validation deve impedir submissão
      // Verificar que ainda está na página de cadastro
      cy.url().should('include', '/register');
      
      // Verificar que campos obrigatórios são destacados
      cy.get('input[name="primeiroNome"]:invalid').should('exist');
    });

    it('should show error for invalid email format', () => {
      cy.visit('/register');
      
      // Preencher com email inválido
      cy.get('input[name="primeiroNome"]').type('Teste');
      cy.get('input[name="ultimoNome"]').type('Usuario');
      cy.get('input[name="usuario"]').type('email-invalido');
      cy.get('input[name="senha"]').type('123');
      cy.get('input[name="cidade"]').type('Cidade');
      cy.get('select[name="estado"]').select('São Paulo');
      
      // Verificar validação HTML5 de email
      cy.get('input[name="usuario"]:invalid').should('exist');
    });
  });  
});
