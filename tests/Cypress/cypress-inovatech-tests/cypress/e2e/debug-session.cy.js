/// <reference types="cypress" />

/**
 * Teste de debug para verificar o que é salvo no localStorage após login
 */

describe('Debug de Sessão - Verificar localStorage', () => {
  
  it('Deve mostrar o que é salvo no localStorage após login', () => {
    const frontendUrl = Cypress.env('frontendUrl')
    const testUser = Cypress.env('testUser')
    
    cy.log('🔍 Iniciando teste de debug de sessão')
    
    // Visita a página de login
    cy.visit(`${frontendUrl}/login`)
    
    // Limpa o localStorage antes do login
    cy.clearLocalStorage()
    cy.log('🗑️ localStorage limpo')
    
    // Faz login
    cy.get('body').then(($body) => {
      if ($body.find('input[type="email"], input[name="email"], #usuario').length > 0) {
        cy.log('📝 Preenchendo formulário de login')
        
        cy.get('#usuario, input[type="email"], input[name="email"]')
          .type(testUser.username)
        
        cy.get('#senha, input[type="password"], input[name="password"]')
          .type(testUser.password)
        
        cy.get('#login-btn, button[type="submit"]').click()
        
        // Aguarda redirecionamento
        cy.url().should('not.include', '/login', { timeout: 10000 })
        
        cy.log('✅ Login realizado com sucesso')
        
        // Verifica o localStorage
        cy.window().then((win) => {
          const storage = win.localStorage
          const keys = Object.keys(storage)
          
          // Mostra no console do Node.js (visível no terminal)
          console.log('\n📊 ============ INSPEÇÃO DE SESSÃO ============')
          console.log('📊 Inspecionando localStorage após login...')
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          
          if (keys.length === 0) {
            console.log('⚠️  NENHUM dado encontrado no localStorage!')
            console.log('')
            console.log('Sua aplicação pode estar usando:')
            console.log('  • Cookies em vez de localStorage')
            console.log('  • sessionStorage em vez de localStorage')
            console.log('  • Sessões no servidor apenas')
            
            cy.log('⚠️ NENHUM dado no localStorage')
          } else {
            console.log(`✓ ${keys.length} item(ns) encontrado(s) no localStorage:`)
            console.log('')
            
            keys.forEach(key => {
              const value = storage.getItem(key)
              console.log(`  📦 ${key}:`)
              console.log(`     ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`)
              console.log('')
              
              cy.log(`${key}: ${value}`)
            })
          }
          
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          
          // Verifica sessionStorage também
          const sessionStorage = win.sessionStorage
          const sessionKeys = Object.keys(sessionStorage)
          
          if (sessionKeys.length > 0) {
            console.log('\n📊 Dados em sessionStorage:')
            sessionKeys.forEach(key => {
              const value = sessionStorage.getItem(key)
              console.log(`  📦 ${key}: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`)
              cy.log(`sessionStorage.${key}: ${value}`)
            })
            console.log('')
          }
          
          // Verifica cookies
          cy.getCookies().then((cookies) => {
            if (cookies.length > 0) {
              console.log('🍪 Cookies encontrados:')
              cookies.forEach(cookie => {
                console.log(`  🍪 ${cookie.name}: ${cookie.value.substring(0, 50)}${cookie.value.length > 50 ? '...' : ''}`)
                cy.log(`Cookie: ${cookie.name}`)
              })
              console.log('')
            } else {
              console.log('⚠️  Nenhum cookie encontrado')
              console.log('')
            }
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
          })
        })
      } else {
        cy.log('⚠️ Formulário de login não encontrado')
      }
    })
  })

  it('Deve mostrar informações sobre a sessão atual', () => {
    const frontendUrl = Cypress.env('frontendUrl')
    
    cy.log('🔍 Verificando estado atual da aplicação')
    
    cy.visit(frontendUrl)
    
    cy.window().then((win) => {
      cy.log('📊 Estado Atual da Aplicação:')
      cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      
      // URL atual
      cy.url().then((url) => {
        cy.log(`URL: ${url}`)
      })
      
      // Verifica se está logado
      cy.get('body').then(($body) => {
        const hasLoginButton = $body.find('#login-btn, button[type="submit"]').length > 0
        const hasUserMenu = $body.find('[data-testid="user-menu"], .user-menu, #user-menu').length > 0
        
        cy.log(`Tem botão de login: ${hasLoginButton}`)
        cy.log(`Tem menu de usuário: ${hasUserMenu}`)
        
        if (hasLoginButton) {
          cy.log('❌ Aparentemente NÃO está logado')
        } else if (hasUserMenu) {
          cy.log('✅ Aparentemente está logado')
        } else {
          cy.log('⚠️ Estado indeterminado')
        }
      })
      
      cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    })
  })
})
