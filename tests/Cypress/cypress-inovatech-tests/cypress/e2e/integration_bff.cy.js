describe('InovaTech - Integration Tests (UI + API)', () => {
  
  const testUser = {
    primeiroNome: 'Integration',
    ultimoNome: 'Test',
    email: `integration.${Date.now()}@test.com`,
    senha: 'integration123',
    cidade: 'Rio de Janeiro',
    estado: 'RJ'
  };

  describe('Fluxo Completo de Usuário', () => {
    
    // Variável para compartilhar o userId entre testes
    let createdUserId;
    
    it('should complete full user journey: register → login → dashboard → logout', () => {
      
      // ========== ETAPA 1: CADASTRO VIA UI ==========
      cy.visit('/register');
      
      // Preencher formulário de cadastro
      cy.get('input[name="primeiroNome"]').type(testUser.primeiroNome);
      cy.get('input[name="ultimoNome"]').type(testUser.ultimoNome);
      cy.get('input[name="usuario"]').type(testUser.email);
      cy.get('input[name="senha"]').type(testUser.senha);
      cy.get('input[name="cidade"]').type(testUser.cidade);
      cy.get('select[name="estado"]').select(testUser.estado);
      
      // Interceptar cadastro para capturar dados
      cy.intercept('POST', '**/clientes').as('registerUser');
      
      cy.get('button[type="submit"]').click();
      
      // Validar cadastro via API response
      cy.wait('@registerUser').then((interception) => {
        expect(interception.response.statusCode).to.eq(201);
        expect(interception.response.body).to.have.property('id');
        
        // Salvar ID do usuário criado
        const userId = interception.response.body.id;
        createdUserId = userId;
        cy.wrap(userId).as('createdUserId');
        
        // ========== ETAPA 2: VALIDAR VIA API DIRETA ==========
        // Verificar se usuário foi realmente criado na base
        cy.request('GET', `${Cypress.env('apiUrl')}/clientes/${userId}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.Usuario).to.eq(testUser.email);
            expect(response.body.PrimeiroNome).to.eq(testUser.primeiroNome);
          });
      });
      
      // Aguardar redirecionamento para login
      cy.url().should('include', '/login', { timeout: 10000 });
      
      // ========== ETAPA 3: LOGIN VIA UI ==========
      cy.get('input[name="usuario"]').type(testUser.email);
      cy.get('input[name="senha"]').type(testUser.senha);
      
      cy.intercept('POST', '**/login').as('loginUser');
      
      cy.get('button[type="submit"]').click();
      
      // Validar login
      cy.wait('@loginUser').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.have.property('Sucesso', true);
        expect(interception.response.body.Cliente).to.have.property('Usuario', testUser.email);
      });
      
      // ========== ETAPA 4: DASHBOARD ==========
      cy.url().should('include', '/dashboard', { timeout: 10000 });
      
      // Verificar dados no dashboard
      cy.contains(`Bem-vindo, ${testUser.primeiroNome}`).should('be.visible');
      cy.contains(testUser.email).should('be.visible');
      cy.contains(testUser.cidade).should('be.visible');
      cy.contains(testUser.estado).should('be.visible');
      
      // ========== ETAPA 5: TESTAR MAILING VIA API ==========
      // Testar se o email funciona via API (usuário está na base)
      cy.request('POST', `${Cypress.env('apiUrl')}/mailing`, {
        Email: testUser.email
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('Sucesso', true);
        expect(response.body).to.have.property('Mensagem', 'Email enviado com sucesso!');
      });
      
      // ========== ETAPA 6: LOGOUT ==========
      cy.get('#logout-btn').click();
      
      // Confirmar logout
      cy.on('window:confirm', () => true);
      
      // Verificar redirecionamento para login
      cy.url().should('include', '/login');
      
      // ========== ETAPA 7: VALIDAR LIMPEZA DE SESSÃO ==========
      // Tentar acessar dashboard diretamente (deve redirecionar)
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
    });

    it('should validate data consistency between UI and API', function() {
      // Verificar se o usuário foi criado no teste anterior
      expect(createdUserId).to.exist;
      
      // Buscar dados via API
      cy.request('GET', `${Cypress.env('apiUrl')}/clientes/${createdUserId}`)
        .then((apiResponse) => {
          
          // Fazer login via UI
          cy.visit('/login');
          cy.get('input[name="usuario"]').type(testUser.email);
          cy.get('input[name="senha"]').type(testUser.senha);
          cy.get('button[type="submit"]').click();
          
          // Ir para dashboard
          cy.url().should('include', '/dashboard', { timeout: 10000 });
          
          // Comparar dados da API com dados exibidos na UI
          cy.contains(apiResponse.body.PrimeiroNome).should('be.visible');
          cy.contains(apiResponse.body.UltimoNome).should('be.visible');
          cy.contains(apiResponse.body.Usuario).should('be.visible');
          cy.contains(apiResponse.body.Cidade).should('be.visible');
          cy.contains(apiResponse.body.Estado).should('be.visible');
        });
    });
  });

  describe('Cenários de Erro e Edge Cases', () => {
    
    it('should handle API errors gracefully in UI', () => {
      // Simular erro de API durante cadastro
      cy.intercept('POST', '**/clientes', {
        statusCode: 500,
        body: { message: 'Erro interno do servidor' }
      }).as('serverError');
      
      cy.visit('/register');
      
      cy.get('input[name="primeiroNome"]').type('Teste');
      cy.get('input[name="ultimoNome"]').type('Erro');
      cy.get('input[name="usuario"]').type('teste@erro.com');
      cy.get('input[name="senha"]').type('123456');
      cy.get('input[name="cidade"]').type('Cidade');
      cy.get('select[name="estado"]').select('SP');
      
      cy.get('button[type="submit"]').click();
      
      cy.wait('@serverError');
      
      // Verificar que erro é exibido na UI
      cy.contains('Erro').should('be.visible');
      
      // Verificar que permanece na página de cadastro
      cy.url().should('include', '/register');
    });

    it('should handle network timeout', () => {
      // Simular timeout na API
      cy.intercept('POST', '**/login', (req) => {
        req.reply((res) => {
          return new Promise((resolve) => {
            setTimeout(() => resolve(res), 30000); // 30 segundos
          });
        });
      }).as('timeoutLogin');
      
      cy.visit('/login');
      cy.get('input[name="usuario"]').type('test@timeout.com');
      cy.get('input[name="senha"]').type('123456');
      cy.get('button[type="submit"]').click();
      
      // Verificar que o botão fica em loading
      cy.get('button[type="submit"]').should('contain', 'Entrando...');
      cy.get('button[type="submit"]').should('be.disabled');
    });
  });
});