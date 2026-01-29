// 🧪 Teste de Validação da Sessão do Backend

describe('Teste de Sessão - Backend', () => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000'
  
  // Cria usuários de teste antes de todos os testes
  before(() => {
    // Cria usuário admin para testes
    cy.request({
      method: 'POST',
      url: `http://localhost:5000/clientes`,
      body: {
        PrimeiroNome: "Admin",
        UltimoNome: "Silva",
        Usuario: "admin@inovatech.com",
        Senha: "Admin@123",
        Cidade: "São Paulo",
        Estado: "SP"
      },
      failOnStatusCode: false // Não falha se usuário já existir
    }).then((response) => {
      if (response.status === 201) {
        cy.log('✅ Usuário admin criado')
      } else {
        cy.log('ℹ️  Usuário admin já existe')
      }
    })
    
    // Cria usuário comum para testes
    cy.request({
      method: 'POST',
      url: `${apiUrl}/clientes`,
      body: {
        PrimeiroNome: "User",
        UltimoNome: "Comum",
        Usuario: "user@inovatech.com",
        Senha: "User@123",
        Cidade: "Rio de Janeiro",
        Estado: "RJ"
      },
      failOnStatusCode: false // Não falha se usuário já existir
    }).then((response) => {
      if (response.status === 201) {
        cy.log('✅ Usuário comum criado')
      } else {
        cy.log('ℹ️  Usuário comum já existe')
      }
    })
  })
  
  beforeEach(() => {
    // Limpa cookies antes de cada teste
    cy.clearCookies()
  })

  it('✅ Deve criar sessão no login e retornar SessionId', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        Usuario: 'admin@inovatech.com',
        Senha: 'Admin@123'
      }
    }).then((response) => {
      // Valida resposta
      expect(response.status).to.eq(200)
      expect(response.body.Sucesso).to.be.true
      expect(response.body.Mensagem).to.include('sucesso')
      expect(response.body.Cliente).to.exist
      expect(response.body.SessionId).to.exist  // ⭐ NOVO campo
      
      cy.log(`✅ SessionId recebido: ${response.body.SessionId}`)
      
      // Valida que o cookie foi setado
      cy.getCookie('JSESSIONID').should('exist')
    })
  })

  it('✅ Deve manter sessão entre requisições', () => {
    // 1. Faz login
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        Usuario: 'admin@inovatech.com',
        Senha: 'Admin@123'
      }
    }).then((loginResponse) => {
      expect(loginResponse.body.Sucesso).to.be.true
      const sessionId = loginResponse.body.SessionId
      cy.log(`✅ Login realizado - SessionId: ${sessionId}`)
      
      // 2. Verifica sessão (usando o cookie automaticamente)
      cy.request({
        method: 'GET',
        url: `${apiUrl}/session`
      }).then((sessionResponse) => {
        expect(sessionResponse.status).to.eq(200)
        expect(sessionResponse.body.sessaoAtiva).to.be.true
        expect(sessionResponse.body.usuario).to.exist
        expect(sessionResponse.body.sessionId).to.eq(sessionId)
        
        cy.log(`✅ Sessão válida: ${sessionResponse.body.usuario.Usuario}`)
      })
    })
  })

  it('✅ Deve invalidar sessão no logout', () => {
    // 1. Faz login
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        Usuario: 'admin@inovatech.com',
        Senha: 'Admin@123'
      }
    }).then(() => {
      cy.log('✅ Login realizado')
      
      // 2. Faz logout
      cy.request({
        method: 'POST',
        url: `${apiUrl}/logout`
      }).then((logoutResponse) => {
        expect(logoutResponse.status).to.eq(200)
        expect(logoutResponse.body.mensagem).to.include('sucesso')
        cy.log('✅ Logout realizado')
        
        // 3. Tenta acessar sessão (deve falhar)
        cy.request({
          method: 'GET',
          url: `${apiUrl}/session`,
          failOnStatusCode: false
        }).then((sessionResponse) => {
          expect(sessionResponse.status).to.eq(401)
          cy.log('✅ Sessão invalidada corretamente')
        })
      })
    })
  })

  it('✅ Deve retornar 401 quando não há sessão', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/session`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      cy.log('✅ Endpoint /session retorna 401 sem autenticação')
    })
  })

  it('❌ Deve falhar login com credenciais inválidas', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        Usuario: 'invalido@test.com',
        Senha: 'senhaErrada'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)  // Backend retorna 200 mesmo com falha
      expect(response.body.Sucesso).to.be.false
      expect(response.body.Mensagem).to.include('incorretos')
      expect(response.body.SessionId).to.not.exist
      
      cy.log('✅ Login falhou corretamente')
    })
  })
})

describe('Teste dos Comandos Cypress com Sessão', () => {
  it('✅ loginWithSessionAPI deve funcionar com validação de backend', () => {
    cy.loginWithSessionAPI('admin')
    
    // Verifica que a página carregou
    cy.url().should('not.include', '/login')
    
    cy.log('✅ Login com sessão via API funcionou!')
  })

  it('✅ Segunda chamada deve usar cache (rápido)', () => {
    const start = Date.now()
    
    cy.loginWithSessionAPI('admin').then(() => {
      const duration = Date.now() - start
      cy.log(`⚡ Tempo com cache: ${duration}ms`)
      
      // Deve ser rápido (menos de 1 segundo)
      expect(duration).to.be.lessThan(1000)
    })
  })

  it('✅ Diferentes usuários devem ter sessões separadas', () => {
    // Login como admin
    cy.loginWithSessionAPI('admin')
    cy.visit('/')
    cy.log('✅ Logado como admin')
    
    // Limpa sessão
    cy.clearAllSessionStorage()
    cy.clearCookies()
    
    // Login como user
    cy.loginWithSessionAPI('user')
    cy.visit('/')
    cy.log('✅ Logado como user')
  })
})

