const LoginPage = require('../../app/pageObjects/LoginPage');
const BackendSetup = require('../../app/helpers/BackendSetup');
const testData = require('../../app/data/testData');

describe('InovaTech - Preencher Campos', () => {
  before(async () => {
    // Configurar backend antes de todos os testes
    await BackendSetup.configureBackend('http://192.168.5.116:5000/');
  });

  it('Deve preencher campos de login', async () => {
    await driver.pause(3000);
    
    const { email, password } = testData.validUsers.mainTest;

    // Tenta preencher campos
    try {
      await LoginPage.fillEmail(email);
      console.log('✅ Campo de email preenchido');
      
      await LoginPage.hideKeyboard();
      await driver.pause(500);
      
      await LoginPage.fillPassword(password);
      console.log('✅ Campo de senha preenchido');
      
      await LoginPage.hideKeyboard();
      
      expect(true).to.be.true;
    } catch (error) {
      console.error('❌ Erro ao preencher campos:', error.message);
      
      // Debug: Captura hierarquia
      const source = await driver.getPageSource();
      console.log('🔍 Hierarquia da tela (primeiros 500 caracteres):');
      console.log(source.substring(0, 500));
      
      throw error;
    }
  });

  afterEach(async function() {
    if (this.currentTest.state === 'failed') {
      try {
        const fs = require('fs');
        const dir = './reports/screenshots';
        if (!fs.existsSync(dir)){
          fs.mkdirSync(dir, { recursive: true });
        }
        const testName = this.currentTest.title.replace(/\s+/g, '_');
        await driver.saveScreenshot(`${dir}/${testName}.png`);
        console.log(`📸 Screenshot salvo: ${testName}.png`);
      } catch (error) {
        console.log(`⚠️ Erro ao salvar screenshot: ${error.message}`);
      }
    }
  });
});
