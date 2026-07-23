// Performance tests para API InovaTech
describe('InovaTech - Performance Tests (Desempenho da API)', () => {

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

    describe('Performance e Stress Tests', () => {
    
    it('should handle multiple simultaneous requests', () => {
      const requests = [];
      
      // Criar 5 requisições simultâneas
      for (let i = 0; i < 50; i++) {
        requests.push(
          cy.request('GET', `${apiUrl}/clientes`)
        );
      }
      
      // Verificar que todas retornaram sucesso
      Promise.all(requests).then((responses) => {
        responses.forEach(response => {
          expect(response.status).to.eq(200);
        });
      });
    });

    it('should respond within acceptable time limit', () => {
      const startTime = Date.now();
      
      cy.request('GET', `${apiUrl}/clientes`)
        .then((response) => {
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          
          expect(response.status).to.eq(200);
          expect(responseTime).to.be.lessThan(2000); // Menos de 2 segundos
        });
    });
  });
});