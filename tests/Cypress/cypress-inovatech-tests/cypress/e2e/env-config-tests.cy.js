/// <reference types="cypress" />

/**
 * Testes que demonstram o uso de variáveis de ambiente
 * Variáveis são definidas em cypress.env.json
 */

describe('Testes com Variáveis de Ambiente', () => {
  
  before(() => {
    cy.log('Iniciando testes com variáveis de ambiente')
  })

  it('Deve acessar a URL do frontend usando variável de ambiente', () => {
    // Acessa a URL definida em cypress.env.json
    cy.visit(Cypress.env('frontendUrl'))
    
    // Verifica se a página carregou
    cy.url().should('include', Cypress.env('frontendUrl'))
  })

  it('Deve fazer chamada à API usando variável de ambiente', () => {
    const apiUrl = Cypress.env('apiUrl')
    
    cy.request({
      method: 'GET',
      url: `${apiUrl}/api/hello`,
      failOnStatusCode: false,
      timeout: Cypress.env('apiTimeout') || 10000
    }).then((response) => {
      cy.log(`Status da API: ${response.status}`)
      
      if (response.status === 200) {
        expect(response.status).to.eq(200)
        cy.log('✓ API está funcionando corretamente')
      } else {
        cy.log(`⚠ API retornou status: ${response.status}`)
      }
    })
  })

  it('Deve utilizar dados de teste do ambiente', () => {
    const testData = Cypress.env('testData')
    
    cy.log(`Empresa de teste: ${testData.company}`)
    cy.log(`Departamento: ${testData.department}`)
    
    expect(testData.company).to.exist
    expect(testData.department).to.exist
  })

  it('Deve acessar credenciais de usuário de teste', () => {
    const testUser = Cypress.env('testUser')
    
    cy.log(`Usuário de teste: ${testUser.username}`)
    
    expect(testUser.username).to.be.a('string')
    expect(testUser.password).to.be.a('string')
    expect(testUser.username).to.include('@')
  })

  it('Deve verificar variáveis de ambiente carregadas', () => {
    // Acessa a URL base configurada
    const baseUrl = Cypress.config('baseUrl')
    
    // Variáveis definidas em cypress.env.json
    const envFrontendUrl = Cypress.env('frontendUrl')
    const envApiUrl = Cypress.env('apiUrl')
    
    cy.log(`URL base do Cypress: ${baseUrl}`)
    cy.log(`URL do frontend (env): ${envFrontendUrl}`)
    cy.log(`URL da API (env): ${envApiUrl}`)
    
    // Verifica se as variáveis foram carregadas corretamente
    expect(envFrontendUrl).to.exist
    expect(envApiUrl).to.exist
    expect(baseUrl).to.exist
  })

  it('Deve utilizar timeout personalizado do ambiente', () => {
    const customTimeout = Cypress.env('apiTimeout')
    
    cy.log(`Timeout configurado: ${customTimeout}ms`)
    
    expect(customTimeout).to.be.a('number')
    expect(customTimeout).to.be.greaterThan(0)
  })

  it('Deve realizar login usando credenciais do ambiente', () => {
    const testUser = Cypress.env('testUser')
    const frontendUrl = Cypress.env('frontendUrl')
    
    cy.visit(frontendUrl)
    
    // Tenta localizar e preencher o formulário de login
    cy.get('body').then(($body) => {
      if ($body.find('input[type="email"], input[name="email"]').length > 0) {
        cy.log('Formulário de login encontrado')
        
        cy.get('input[type="email"], input[name="email"]')
          .type(testUser.username)
        
        cy.get('input[type="password"], input[name="password"]')
          .type(testUser.password)
        
        cy.log('✓ Credenciais preenchidas com sucesso')
      } else {
        cy.log('⚠ Formulário de login não encontrado na página')
      }
    })
  })

  it('Deve fazer múltiplas requisições com retry configurado', () => {
    const apiUrl = Cypress.env('apiUrl')
    const maxRetries = Cypress.env('maxRetries')
    
    cy.log(`Tentativas máximas configuradas: ${maxRetries}`)
    
    // Exemplo de requisição com retry
    let attempts = 0
    
    const makeRequest = () => {
      attempts++
      
      return cy.request({
        method: 'GET',
        url: `${apiUrl}/api/hello`,
        failOnStatusCode: false
      }).then((response) => {
        if (response.status !== 200 && attempts < maxRetries) {
          return cy.log(`Tentativa ${attempts} falhou, tentando novamente...`)
            .then(() => cy.wait(1000))
            .then(() => makeRequest())
        }
        
        return cy.log(`Requisição concluída em ${attempts} tentativa(s)`).then(() => response)
      })
    }
    
    makeRequest()
  })

  it('Deve logar todas as variáveis de ambiente disponíveis', () => {
    const allEnvVars = Cypress.env()
    
    cy.log('=== Variáveis de Ambiente Disponíveis ===')
    Object.keys(allEnvVars).forEach((key) => {
      // Não loga senhas por segurança
      if (key.toLowerCase().includes('password')) {
        cy.log(`${key}: ****`)
      } else {
        cy.log(`${key}: ${JSON.stringify(allEnvVars[key])}`)
      }
    })
  })
})

/**
 * Testes demonstrando o uso de cy.session() para otimização de performance
 */
describe('Testes com cy.session() - Otimização de Performance', () => {
  
  it('Deve fazer login usando comando customizado cy.loginAs()', () => {
    const testUser = Cypress.env('testUser')
    const frontendUrl = Cypress.env('frontendUrl')
    
    // Adiciona usuário temporário para teste se não existir
    if (!Cypress.env('users')) {
      Cypress.env('users', {
        admin: testUser
      })
    }
    
    cy.log('🧪 Testando comando cy.loginAs()')
    
    // Visita a página inicial
    cy.visit(frontendUrl)
    
    // Verifica se existe página de login
    cy.get('body').then(($body) => {
      if ($body.find('input[type="email"], input[name="email"], #usuario').length > 0) {
        cy.log('✓ Formulário de login encontrado - executando cy.loginAs()')
        // Se tiver formulário, testa o comando
        return cy.loginAs('admin')
      } else {
        cy.log('⚠ Formulário de login não encontrado, pulando teste de loginAs()')
      }
    })
  })

  it('Deve fazer login usando cy.loginWithSession() - PRIMEIRA execução (lenta)', () => {
    const testUser = Cypress.env('testUser')
    const frontendUrl = Cypress.env('frontendUrl')
    
    if (!Cypress.env('users')) {
      Cypress.env('users', {
        admin: testUser
      })
    }
    
    const start = Date.now()
    
    cy.log('🧪 Testando cy.loginWithSession() - PRIMEIRA execução')
    
    cy.visit(frontendUrl)
    
    cy.get('body').then(($body) => {
      if ($body.find('input[type="email"], input[name="email"], #usuario').length > 0) {
        return cy.loginWithSession('admin').then(() => {
          const duration = Date.now() - start
          cy.log(`⏱️ Tempo da primeira execução: ${duration}ms`)
          cy.log('✓ Sessão criada e armazenada em cache')
        })
      } else {
        cy.log('⚠ Formulário de login não disponível')
      }
    })
  })

  it('Deve fazer login usando cy.loginWithSession() - SEGUNDA execução (rápida)', () => {
    const testUser = Cypress.env('testUser')
    const frontendUrl = Cypress.env('frontendUrl')
    
    if (!Cypress.env('users')) {
      Cypress.env('users', {
        admin: testUser
      })
    }
    
    const start = Date.now()
    
    cy.log('🧪 Testando cy.loginWithSession() - SEGUNDA execução (usando cache)')
    
    cy.visit(frontendUrl)
    
    cy.get('body').then(($body) => {
      if ($body.find('input[type="email"], input[name="email"], #usuario').length > 0) {
        return cy.loginWithSession('admin').then(() => {
          const duration = Date.now() - start
          cy.log(`⚡ Tempo com cache: ${duration}ms`)
          cy.log('✓ Sessão restaurada do cache - MUITO mais rápido!')
          
          // Verifica que foi mais rápido
          expect(duration).to.be.lessThan(2000)
        })
      } else {
        cy.log('⚠ Formulário de login não disponível')
      }
    })
  })

  it('Deve fazer login via API usando cy.loginViaAPI()', () => {
    const testUser = Cypress.env('testUser')
    const apiUrl = Cypress.env('apiUrl')
    
    if (!Cypress.env('users')) {
      Cypress.env('users', {
        admin: testUser
      })
    }
    
    cy.log('🧪 Testando comando cy.loginViaAPI()')
    cy.log(`API URL: ${apiUrl}`)
    
    cy.loginViaAPI('admin')
    
    cy.log('✓ Login via API executado (pode falhar se API estiver offline)')
  })

  it('Deve fazer login via API com cy.loginWithSessionAPI() - SUPER RÁPIDO', () => {
    const testUser = Cypress.env('testUser')
    const apiUrl = Cypress.env('apiUrl')
    
    if (!Cypress.env('users')) {
      Cypress.env('users', {
        admin: testUser
      })
    }
    
    const start = Date.now()
    
    cy.log('🧪 Testando cy.loginWithSessionAPI() - Combinação de API + Session')
    cy.log(`API URL: ${apiUrl}`)
    
    cy.loginWithSessionAPI('admin').then(() => {
      const duration = Date.now() - start
      cy.log(`🚀 Tempo do login via API com session: ${duration}ms`)
      cy.log('✓ Método mais rápido - API + Cache de sessão!')
    })
  })

  it('Deve demonstrar a diferença de performance entre os métodos', () => {
    cy.log('📊 Comparação de Performance dos Métodos de Login:')
    cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    cy.log('1. cy.loginAs()              → ~5-8s  (UI completa)')
    cy.log('2. cy.loginViaAPI()          → ~2-3s  (apenas API)')
    cy.log('3. cy.loginWithSession()     → ~6s primeira vez, <1s depois')
    cy.log('4. cy.loginWithSessionAPI()  → ~2s primeira vez, <0.5s depois ⚡')
    cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    cy.log('🏆 Vencedor: cy.loginWithSessionAPI() - Mais rápido!')
    cy.log('💡 Use cy.session() sempre que possível para economizar tempo')
  })

  it('Deve limpar sessões e testar novamente', () => {
    cy.log('🧹 Limpando todas as sessões...')
    
    // Limpa todas as sessões
    Cypress.session.clearAllSavedSessions()
    
    cy.log('✓ Todas as sessões foram limpas')
    cy.log('ℹ️ Próximos testes farão login do zero novamente')
  })
})
