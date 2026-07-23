describe('Página de Login', () => {
    
    // Definir dados do usuário de teste
    const testUser = {
      primeiroNome: 'TestUser',
      ultimoNome: 'Login',
      email: `login.test.${Date.now()}@test.com`,
      senha: 'login123test',
      cidade: 'São Paulo',
      estado: 'SP'
    };
    
    // Criar usuário via API antes dos testes de login
    before(() => {
      cy.request('POST', Cypress.env('apiUrl') + '/clientes', {
        PrimeiroNome: testUser.primeiroNome,
        UltimoNome: testUser.ultimoNome,
        Usuario: testUser.email,
        Senha: testUser.senha,
        Cidade: testUser.cidade,
        Estado: testUser.estado
      }).then((response) => {
        cy.wrap(response.body.id).as('userId');
      });
    });

    it('should display login page correctly', () => {
      cy.visit('/login');
      
      // Verificar elementos da página
      cy.contains('h1', 'Login').should('be.visible');
      cy.contains('Entre na sua conta').should('be.visible');
      
      // Verificar campos
      cy.get('input[name="usuario"]').should('be.visible');
      cy.get('input[name="senha"]').should('be.visible');
      
      // Verificar botão e links
      cy.get('button[type="submit"]').should('contain', 'Entrar');
      cy.contains('Não tem uma conta? Cadastre-se').should('be.visible');
    });

    it('should login successfully and redirect to dashboard', () => {
      cy.visit('/login');
      
      // Preencher credenciais
      cy.get('input[name="usuario"]').type(testUser.email);
      cy.get('input[name="senha"]').type(testUser.senha);
      
      // Interceptar requisição de login
      cy.intercept('POST', '**/login').as('loginRequest');
      
      // Fazer login
      cy.get('button[type="submit"]').click();
      
      // Verificar requisição
      cy.wait('@loginRequest').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.have.property('Sucesso', true);
        expect(interception.response.body).to.have.property('Cliente');
      });
      
      // Verificar mensagem de sucesso
      cy.contains('Login realizado com sucesso').should('be.visible');
      
      // Verificar redirecionamento para dashboard
      cy.url().should('include', '/dashboard', { timeout: 10000 });
      
      // Verificar conteúdo do dashboard
      cy.contains(`Bem-vindo, ${testUser.primeiroNome}`).should('be.visible');
    });
  });