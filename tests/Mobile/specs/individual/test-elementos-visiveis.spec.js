const LoginPage = require('../../app/pageObjects/LoginPage');
const BackendSetup = require('../../app/helpers/BackendSetup');

describe('InovaTech - Elementos Visíveis', () => {
  before(async () => {
    // Configurar backend antes de todos os testes
    await BackendSetup.configureBackend('http://192.168.5.116:5000/');
  });

  it('Elementos da tela devem estar visíveis', async () => {
    // Aguarda app carregar completamente
    await driver.pause(3000);

    // Verifica elementos principais
    const elements = {
      'Botão Entrar': await LoginPage.loginButton.isDisplayed().catch(() => false),
      'Link Criar Conta': await LoginPage.createAccountLink.isDisplayed().catch(() => false),
      'Campo Email': await LoginPage.emailField.isDisplayed().catch(() => false),
      'Campo Senha': await LoginPage.passwordField.isDisplayed().catch(() => false),
    };

    console.log('📊 Status dos elementos:');
    Object.entries(elements).forEach(([name, visible]) => {
      console.log(`  ${visible ? '✅' : '❌'} ${name}: ${visible}`);
    });

    // Pelo menos os campos e botão devem estar visíveis
    expect(elements['Botão Entrar']).to.be.true;
    expect(elements['Campo Email']).to.be.true;
    expect(elements['Campo Senha']).to.be.true;
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
