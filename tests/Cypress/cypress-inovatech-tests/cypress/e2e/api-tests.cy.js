describe('InovaTech - API Tests (Testes Diretos na API)', () => {
  
  let createdUserId;
  const apiUrl = Cypress.env('apiUrl');
  const testUser = {
    PrimeiroNome: 'APITest',
    UltimoNome: 'Usuario',
    Usuario: `api.test.${Date.now()}@test.com`,
    Estado: 'SP',
    Cidade: 'São Paulo',
    Senha: 'api123test'
  };

  describe('Gerenciamento de Clientes', () => {
    
    it('should create a new user via API', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/clientes`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: testUser
      }).then((response) => {
        // Validações da resposta
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.PrimeiroNome).to.eq(testUser.PrimeiroNome);
        expect(response.body.UltimoNome).to.eq(testUser.UltimoNome);
        expect(response.body.Usuario).to.eq(testUser.Usuario);
        expect(response.body.Estado).to.eq(testUser.Estado);
        expect(response.body.Cidade).to.eq(testUser.Cidade);
        
        // Salvar ID para próximos testes
        createdUserId = response.body.id;
        cy.wrap(createdUserId).as('userId');
      });
    });

    it('should list all users', () => {
      cy.request('GET', `${apiUrl}/clientes`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
          expect(response.body.length).to.be.at.least(1);
          
          // Verificar se o usuário criado está na lista
          const createdUser = response.body.find(user => user.id === createdUserId);
          expect(createdUser).to.exist;
          expect(createdUser.Usuario).to.eq(testUser.Usuario);
        });
    });

    it('should fetch user by ID', function() {
      cy.request('GET', `${apiUrl}/clientes/${this.userId}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('id', this.userId);
          expect(response.body).to.have.property('PrimeiroNome', testUser.PrimeiroNome);
          expect(response.body).to.have.property('UltimoNome', testUser.UltimoNome);
          expect(response.body).to.have.property('Usuario', testUser.Usuario);
          expect(response.body.Senha).to.be.null;
        });
    });

    it('should handle user not found', () => {
      const nonExistentId = 99999;
      
      cy.request({
        method: 'GET',
        url: `${apiUrl}/clientes/${nonExistentId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should fail to create user with invalid data', () => {
      const invalidUser = { 
        ...testUser, 
        Usuario: 'email-invalido' // Email inválido
      };
      
      cy.request({
        method: 'POST',
        url: `${apiUrl}/clientes`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: invalidUser,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe('Sistema de Autenticação', () => {
    
    it('should login with valid credentials', () => {
      const loginData = {
        Usuario: testUser.Usuario,
        Senha: testUser.Senha
      };
      
      cy.request('POST', `${apiUrl}/login`, loginData)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('Sucesso', true);
          expect(response.body).to.have.property('Mensagem', 'Login realizado com sucesso');
          expect(response.body).to.have.property('Cliente');
          expect(response.body.Cliente.Usuario).to.eq(testUser.Usuario);
          
          // Verificar dados do cliente retornado
          expect(response.body.Cliente).to.have.property('PrimeiroNome');
          expect(response.body.Cliente).to.have.property('UltimoNome');
          expect(response.body.Cliente).to.have.property('id');
        });
    });

    it('should fail login with invalid credentials', () => {
      const invalidLoginData = {
        Usuario: testUser.Usuario,
        Senha: 'senhaerrada'
      };
      
      cy.request('POST', `${apiUrl}/login`, invalidLoginData)
        .then((response) => {
          expect(response.status).to.eq(200); // API retorna 200 mesmo para falha
          expect(response.body).to.have.property('Sucesso', false);
          expect(response.body).to.have.property('Mensagem', 'Usuário ou senha incorretos');
          expect(response.body.Cliente).to.be.null;
        });
    });

    it('should fail login with missing fields', () => {
      const incompleteData = {
        Usuario: testUser.Usuario
        // Senha faltando
      };
      
      cy.request({
        method: 'POST',
        url: `${apiUrl}/login`,
        body: incompleteData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });
});