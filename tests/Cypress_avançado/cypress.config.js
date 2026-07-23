const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const preprocessor = require('@badeball/cypress-cucumber-preprocessor');
const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild');

module.exports = defineConfig({
  e2e: {
    // URL base para testes de UI (Frontend)
    baseUrl: 'http://localhost:5173',
    
    // Configuração do Cucumber
    specPattern: 'cypress/e2e/features/**/*.feature',
    
    // Suporte e configurações
    supportFile: 'cypress/support/e2e.js',
    
    // Viewport
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Vídeo e screenshots
    video: true,
    videosFolder: 'cypress/videos',
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    
    // Variáveis de ambiente
    env: {
      frontendUrl: 'http://localhost:5173',
      apiUrl: 'http://localhost:5000',
      // Configuração de tags do Cucumber
      omitFiltered: true,
      filterSpecs: true
    },
    
    // Timeout configurações
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    
    // Configuração do preprocessor
    async setupNodeEvents(on, config) {
      // Implementação do preprocessor do Cucumber
      await preprocessor.addCucumberPreprocessorPlugin(on, config);
      
      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin.default(config)],
        })
      );
      
      return config;
    },
  },
});
