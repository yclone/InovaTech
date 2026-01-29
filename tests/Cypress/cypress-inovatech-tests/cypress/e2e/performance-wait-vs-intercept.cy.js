// 🚀 Comparação de Performance: cy.wait() vs cy.intercept()

describe('Performance: cy.wait() vs cy.intercept()', () => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000'
  
  // Cria usuário de teste antes dos testes
  before(() => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/clientes`,
      body: {
        PrimeiroNome: "Test",
        UltimoNome: "Performance",
        Usuario: "test@performance.com",
        Senha: "Test@123",
        Cidade: "Curitiba",
        Estado: "PR"
      },
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 201) {
        cy.log('✅ Usuário de teste criado')
      } else {
        cy.log('ℹ️  Usuário de teste já existe')
      }
    })
  })
  
  beforeEach(() => {
    cy.clearCookies()
    cy.clearAllSessionStorage()
  })

  it('❌ LENTO - Login usando cy.wait() com tempo fixo', () => {
    const startTime = Date.now()
    
    cy.log('🐌 Método ANTIGO: cy.wait() com tempo fixo')
    
    // Faz requisição de login
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        Usuario: 'test@performance.com',
        Senha: 'Test@123'
      }
    }).then((response) => {
      cy.log('✅ Login realizado')
      expect(response.body.Sucesso).to.be.true
    })
    
    // ❌ PROBLEMA: Espera fixa de 2 segundos (mesmo que a resposta chegue em 100ms)
    cy.wait(2000).then(() => {
      cy.log('⏳ Esperou 2 segundos fixos...')
    })
    
    // Verifica sessão
    cy.request({
      method: 'GET',
      url: `${apiUrl}/session`
    }).then((response) => {
      expect(response.body.sessaoAtiva).to.be.true
      cy.log('✅ Sessão validada')
    })
    
    // ❌ Mais uma espera desnecessária
    cy.wait(1500).then(() => {
      cy.log('⏳ Esperou mais 1.5 segundos...')
    })
    
    // Calcula tempo total
    cy.then(() => {
      const duration = Date.now() - startTime
      cy.log(`⏱️ Tempo total com cy.wait(): ${duration}ms`)
      cy.log(`❌ Desperdiçou 3.5 segundos em esperas fixas!`)
      
      // Armazena para comparação
      cy.wrap(duration).as('tempoComWait')
    })
  })

  it('✅ RÁPIDO - Login sem esperas desnecessárias', () => {
    const startTime = Date.now()
    
    cy.log('⚡ Método MODERNO: Sem esperas desnecessárias')
    
    // Faz requisição de login
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        Usuario: 'test@performance.com',
        Senha: 'Test@123'
      }
    }).then((response) => {
      cy.log('✅ Login realizado')
      expect(response.body.Sucesso).to.be.true
    })
    
    // ✅ SOLUÇÃO: Sem cy.wait() desnecessário!
    // Cypress já espera automaticamente as requisições completarem
    
    // Verifica sessão
    cy.request({
      method: 'GET',
      url: `${apiUrl}/session`
    }).then((response) => {
      expect(response.body.sessaoAtiva).to.be.true
      cy.log('✅ Sessão validada')
    })
    
    // ✅ Sem esperas adicionais!
    
    // Calcula tempo total
    cy.then(() => {
      const duration = Date.now() - startTime
      cy.log(`⏱️ Tempo total sem cy.wait(): ${duration}ms`)
      cy.log(`✅ Esperou APENAS o tempo das requisições!`)
      
      // Compara com o teste anterior
      cy.get('@tempoComWait').then((tempoWait) => {
        const economia = tempoWait - duration
        const porcentagem = ((economia / tempoWait) * 100).toFixed(1)
        
        cy.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
        cy.log(`📊 COMPARAÇÃO DE PERFORMANCE:`)
        cy.log(`  Com cy.wait():    ${tempoWait}ms`)
        cy.log(`  Sem cy.wait():    ${duration}ms`)
        cy.log(`  `)
        cy.log(`💰 ECONOMIA: ${economia}ms (${porcentagem}% mais rápido!)`)
        cy.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
        
        // Valida que é mais rápido
        expect(duration).to.be.lessThan(tempoWait)
      })
    })
  })
})

describe('Exemplo Prático: Login com UI - cy.wait() vs cy.intercept()', () => {
  const frontendUrl = Cypress.env('frontendUrl') || 'http://localhost:5173'
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000'
  
  before(() => {
    // Cria usuário para testes de UI
    cy.request({
      method: 'POST',
      url: `${apiUrl}/clientes`,
      body: {
        PrimeiroNome: "UI",
        UltimoNome: "Test",
        Usuario: "uitest@performance.com",
        Senha: "UITest@123",
        Cidade: "Belo Horizonte",
        Estado: "MG"
      },
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 201) {
        cy.log('✅ Usuário UI Test criado')
      } else {
        cy.log('ℹ️  Usuário UI Test já existe')
      }
    })
  })
  
  beforeEach(() => {
    cy.clearCookies()
    cy.clearAllSessionStorage()
  })

  it('❌ Login UI com cy.wait() - Lento e frágil', () => {
    const startTime = Date.now()
    
    cy.log('🐌 Teste com cy.wait() - Pode quebrar!')
    
    cy.visit(`${frontendUrl}/login`)
    
    // ❌ Espera arbitrária para página carregar
    cy.wait(1000)
    
    cy.get('#usuario, input[type="email"]').type('uitest@performance.com')
    
    // ❌ Mais uma espera desnecessária
    cy.wait(500)
    
    cy.get('#senha, input[type="password"]').type('UITest@123')
    
    // ❌ Espera antes de clicar
    cy.wait(500)
    
    cy.get('#login-btn, button[type="submit"]').click()
    
    // ❌ Espera MUITO tempo para garantir que login complete
    cy.wait(3000)
    
    cy.url().should('not.include', '/login')
    
    cy.then(() => {
      const duration = Date.now() - startTime
      cy.log(`⏱️ Tempo com cy.wait(): ${duration}ms`)
      cy.log(`❌ Total de esperas fixas: 5 segundos!`)
      
      cy.wrap(duration).as('tempoUIComWait')
    })
  })

  it('✅ Login UI com cy.intercept() - Rápido e confiável', () => {
    const startTime = Date.now()
    
    cy.log('⚡ Teste com cy.intercept() - Robusto!')
    
    // ⭐ Intercepta a requisição de login ANTES de visitar a página
    cy.intercept('POST', '**/login').as('loginAPI')
    
    cy.visit(`${frontendUrl}/login`)
    
    // ✅ Cypress já espera automaticamente elementos aparecerem!
    cy.get('#usuario, input[type="email"]').type('uitest@performance.com')
    cy.get('#senha, input[type="password"]').type('UITest@123')
    cy.get('#login-btn, button[type="submit"]').click()
    
    // ⭐ Espera APENAS até a API responder (pode ser 200ms!)
    cy.wait('@loginAPI').then((interception) => {
      cy.log(`⚡ Login API completou: ${interception.response.statusCode}`)
      expect(interception.response.body.Sucesso).to.be.true
    })
    
    // Valida redirecionamento (Cypress já espera automaticamente!)
    cy.url().should('not.include', '/login')
    
    cy.then(() => {
      const duration = Date.now() - startTime
      cy.log(`⏱️ Tempo com cy.intercept(): ${duration}ms`)
      cy.log(`✅ Zero esperas desnecessárias!`)
      
      // Compara com o teste anterior
      cy.get('@tempoUIComWait').then((tempoWait) => {
        const economia = tempoWait - duration
        const porcentagem = ((economia / tempoWait) * 100).toFixed(1)
        
        cy.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
        cy.log(`📊 COMPARAÇÃO DE PERFORMANCE (UI):`)
        cy.log(`  cy.wait():      ${tempoWait}ms`)
        cy.log(`  cy.intercept(): ${duration}ms`)
        cy.log(`  `)
        cy.log(`💰 ECONOMIA: ${economia}ms (${porcentagem}% mais rápido!)`)
        cy.log(`✅ Teste também mais CONFIÁVEL e menos FLAKY!`)
        cy.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
        
        expect(duration).to.be.lessThan(tempoWait)
      })
    })
  })
})

describe('📚 Boas Práticas: Quando usar cada um', () => {
  it('✅ cy.intercept() - SEMPRE que possível', () => {
    cy.log('✅ USE cy.intercept() para:')
    cy.log('  • Esperar requisições HTTP completarem')
    cy.log('  • Validar payloads de requisição/resposta')
    cy.log('  • Mock de respostas de API')
    cy.log('  • Testes de comportamento de rede')
    cy.log('  • Debugging de problemas de integração')
    cy.log('  ')
    cy.log('💡 Vantagens:')
    cy.log('  ⚡ Mais rápido (espera só o necessário)')
    cy.log('  🎯 Mais preciso (sabe exatamente o que esperar)')
    cy.log('  🛡️  Menos flaky (não depende de tempo arbitrário)')
    cy.log('  🔍 Melhor debugging (vê request/response)')
  })

  it('⚠️  cy.wait() - APENAS em casos específicos', () => {
    cy.log('⚠️  Use cy.wait() APENAS para:')
    cy.log('  • Animações/transições CSS (rare)')
    cy.log('  • Delays intencionais para demonstração')
    cy.log('  • Throttling de requisições')
    cy.log('  • Debugging temporário')
    cy.log('  ')
    cy.log('❌ NÃO use cy.wait() para:')
    cy.log('  • Esperar requisições (use cy.intercept)')
    cy.log('  • Esperar elementos (Cypress já faz isso!)')
    cy.log('  • "Dar tempo" para coisas carregarem')
    cy.log('  • Corrigir testes flaky')
  })

  it('📖 Exemplo completo com múltiplas requisições usando cy.intercept()', () => {
    const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000'
    const frontendUrl = Cypress.env('frontendUrl') || 'http://localhost:5173'
    
    cy.log('⭐ Interceptando múltiplas requisições ao mesmo tempo')
    
    // Setup de todos os intercepts ANTES de visitar a página
    cy.intercept('POST', '**/login').as('login')
    cy.intercept('GET', '**/session').as('session')
    cy.intercept('GET', '**/clientes').as('clientes')
    
    // Visita a página de login
    cy.visit(`${frontendUrl}/login`)
    
    // Faz login pela UI
    cy.get('#usuario, input[type="email"]').type('uitest@performance.com')
    cy.get('#senha, input[type="password"]').type('UITest@123')
    cy.get('#login-btn, button[type="submit"]').click()
    
    // Espera apenas a requisição de login
    cy.wait('@login').its('response.statusCode').should('eq', 200)
    cy.log('✅ Login interceptado e validado')
    
    // Se houver navegação que faz outras requisições, elas também serão interceptadas
    cy.url().should('not.include', '/login')
    
    cy.log('✅ Todas as requisições podem ser validadas de forma eficiente!')
  })
})
