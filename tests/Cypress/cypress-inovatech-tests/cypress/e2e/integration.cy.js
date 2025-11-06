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

  describe('Sistema de Mailing', () => {
    
    it('should send email to existing user', () => {
      const emailData = {
        Email: testUser.Usuario
      };
      
      cy.request('POST', `${apiUrl}/mailing`, emailData)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('Sucesso', true);
          expect(response.body).to.have.property('Mensagem', 'Email enviado com sucesso!');
        });
    });

    it('should fail to send email to non-existing user', () => {
      const emailData = {
        Email: 'usuario.nao.existe@test.com'
      };
      
      cy.request('POST', `${apiUrl}/mailing`, emailData)
        .then((response) => {
          expect(response.status).to.eq(200); // API retorna 200 mesmo para falha
          expect(response.body).to.have.property('Sucesso', false);
          expect(response.body).to.have.property('Mensagem', 'Falha ao enviar o Email');
        });
    });

    it('should validate email format in mailing', () => {
      const emailData = {
        Email: 'email-formato-invalido'
      };
      
      cy.request({
        method: 'POST',
        url: `${apiUrl}/mailing`,
        body: emailData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should handle empty email field', () => {
      const emailData = {
        Email: ''
      };
      
      cy.request({
        method: 'POST',
        url: `${apiUrl}/mailing`,
        body: emailData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });
});