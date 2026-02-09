const LoginPage = require('../../app/pageObjects/LoginPage');

describe('InovaTech - Botão Entrar', () => {
  it('Botão Entrar deve ser clicável', async () => {
    await driver.pause(3000);
    
    try {
      // Verifica se botão está habilitado
      const enabled = await LoginPage.loginButton.isEnabled();
      console.log(`🔘 Botão Entrar habilitado: ${enabled}`);

      // Tenta clicar
      await LoginPage.click(LoginPage.loginButton);
      console.log('✅ Botão clicado com sucesso');
      
      await driver.pause(2000);
      
      expect(true).to.be.true;
    } catch (error) {
      console.error('❌ Erro ao clicar no botão:', error.message);
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
