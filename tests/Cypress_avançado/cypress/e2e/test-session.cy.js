describe('Validação cy.session() - InovaTech', () => {
  
  describe('Teste de Login com Sessão', () => {
    
    it('deve fazer login pela primeira vez (criando sessão)', () => {
      cy.log('🧪 Teste 1: Primeiro login - cria sessão');
      
      cy.loginWithSession('admin');
      
      // Verifica que os dados estão no localStorage
      cy.window().then((win) => {
        const currentUser = win.localStorage.getItem('currentUser');
        const isAuthenticated = win.localStorage.getItem('isAuthenticated');
        
        expect(currentUser).to.not.be.null;
        expect(isAuthenticated).to.equal('true');
        
        const userData = JSON.parse(currentUser);
        cy.log(`✅ Dados salvos: ${userData.Email || userData.Usuario}`);
      });
      
      // Verifica que está logado
      cy.visit('/dashboard');
      cy.url().should('include', '/dashboard');
    });

    it('deve reutilizar sessão (deve ser RÁPIDO)', () => {
      cy.log('🧪 Teste 2: Segundo login - reutiliza sessão');
      
      const start = Date.now();
      
      cy.loginWithSession('admin');
      
      const duration = Date.now() - start;
      cy.log(`⚡ Tempo com cache: ${duration}ms`);
      
      // Deve ser muito rápido (< 1 segundo)
      expect(duration).to.be.lessThan(1000);
      
      // Verifica que continua logado
      cy.visit('/dashboard');
      cy.url().should('include', '/dashboard');
    });

    it('deve funcionar com diferentes usuários', () => {
      cy.log('🧪 Teste 3: Trocar entre usuários');
      
      // Login como admin
      cy.loginWithSession('admin');
      cy.visit('/dashboard');
      cy.window().then((win) => {
        const user = JSON.parse(win.localStorage.getItem('currentUser'));
        cy.log(`Usuario atual: ${user.Email}`);
        expect(user.Email).to.include('admin');
      });
      
      // Login como usuário comum (troca automaticamente)
      cy.loginWithSession('user');
      cy.visit('/dashboard');
      cy.window().then((win) => {
        const user = JSON.parse(win.localStorage.getItem('currentUser'));
        cy.log(`Usuario atual: ${user.Email}`);
        expect(user.Email).to.include('user');
      });
    });
  });

  describe('Teste de Login via API com Sessão', () => {
    
    it('deve fazer login via API (super rápido)', () => {
      cy.log('🧪 Teste 4: Login via API');
      
      const start = Date.now();
      
      cy.loginWithSessionAPI('admin');
      
      const duration = Date.now() - start;
      cy.log(`🚀 Tempo login API: ${duration}ms`);
      
      // Verifica dados no localStorage
      cy.window().then((win) => {
        const currentUser = win.localStorage.getItem('currentUser');
        const isAuthenticated = win.localStorage.getItem('isAuthenticated');
        
        expect(currentUser).to.not.be.null;
        expect(isAuthenticated).to.equal('true');
      });
      
      // Verifica acesso à dashboard
      cy.visit('/dashboard');
      cy.url().should('include', '/dashboard');
    });

    it('deve reutilizar sessão API (deve ser MUITO rápido)', () => {
      cy.log('🧪 Teste 5: Segundo login API - cache');
      
      const start = Date.now();
      
      cy.loginWithSessionAPI('admin');
      
      const duration = Date.now() - start;
      cy.log(`⚡⚡ Tempo com cache API: ${duration}ms`);
      
      // API com cache deve ser < 500ms
      expect(duration).to.be.lessThan(500);
    });
  });

  describe('Comparação de Performance', () => {
    
    it('LOGIN SEM CACHE - cy.loginAs() (benchmark)', () => {
      cy.log('🧪 Teste 6: Login SEM cache (baseline)');
      
      // Limpa todas as sessões para forçar login completo
      Cypress.session.clearAllSavedSessions();
      
      const start = Date.now();
      
      cy.loginAs('admin');
      
      const duration = Date.now() - start;
      cy.log(`🐢 Login SEM cache: ${duration}ms`);
      
      // Login normal deve demorar mais
      expect(duration).to.be.greaterThan(2000);
    });

    it('LOGIN COM CACHE - cy.loginWithSession() (otimizado)', () => {
      cy.log('🧪 Teste 7: Login COM cache');
      
      const start = Date.now();
      
      cy.loginWithSession('admin');
      
      const duration = Date.now() - start;
      cy.log(`🚀 Login COM cache: ${duration}ms`);
      
      // Com cache deve ser muito mais rápido
      expect(duration).to.be.lessThan(1000);
    });
  });

  describe('Validação de Segurança', () => {
    
    it('deve validar credenciais do cypress.env.json', () => {
      cy.log('🧪 Teste 8: Validação de variáveis de ambiente');
      
      const users = Cypress.env('users');
      
      expect(users).to.not.be.undefined;
      expect(users.admin).to.have.property('email');
      expect(users.admin).to.have.property('password');
      expect(users.user).to.have.property('email');
      expect(users.user).to.have.property('password');
      
      cy.log('✅ Todas as credenciais estão configuradas');
    });

    it('deve falhar com usuário inexistente', () => {
      cy.log('🧪 Teste 9: Validação de erro');
      
      cy.on('fail', (error) => {
        expect(error.message).to.include('não encontrado no cypress.env.json');
        cy.log('✅ Erro capturado corretamente');
        return false; // Previne que o teste falhe
      });
      
      cy.loginWithSession('usuario_invalido');
    });
  });

  describe('Limpeza e Reset de Sessão', () => {
    
    it('deve limpar sessão e forçar novo login', () => {
      cy.log('🧪 Teste 10: Limpeza de sessão');
      
      // Faz login inicial
      cy.loginWithSession('admin');
      cy.log('✅ Primeira sessão criada');
      
      // Limpa todas as sessões
      Cypress.session.clearAllSavedSessions();
      cy.log('🗑️ Sessões limpas');
      
      // Deve fazer login novamente (não usar cache)
      const start = Date.now();
      cy.loginWithSession('admin');
      const duration = Date.now() - start;
      
      cy.log(`🔄 Login após limpeza: ${duration}ms`);
      
      // Deve demorar mais porque refez o login
      expect(duration).to.be.greaterThan(2000);
    });
  });

  describe('Teste de Múltiplas Sessões Simultâneas', () => {
    
    const userTypes = ['admin', 'user', 'qa_tester'];
    
    userTypes.forEach((userType) => {
      it(`deve criar e manter sessão para ${userType}`, () => {
        cy.log(`🧪 Teste sessão: ${userType}`);
        
        cy.loginWithSession(userType);
        
        cy.window().then((win) => {
          const currentUser = win.localStorage.getItem('currentUser');
          expect(currentUser).to.not.be.null;
          
          const userData = JSON.parse(currentUser);
          cy.log(`✅ ${userType} logado: ${userData.Email}`);
        });
        
        cy.visit('/dashboard');
        cy.url().should('include', '/dashboard');
      });
    });
  });
});
