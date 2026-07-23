const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // URL base para testes de UI (Frontend)
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    env: {
      // URLs para diferentes tipos de teste
      frontendUrl: 'http://localhost:5173',
      apiUrl: 'http://localhost:5000'
    },
    // Timeout configurações
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 30000
  }
})