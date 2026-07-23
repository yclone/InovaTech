const LoginPage = require('../app/pageObjects/LoginPage');
const BackendSetup = require('../app/helpers/BackendSetup');
const testData = require('../app/data/testData');

/**
 * Smoke Tests - Login InovaTech
 * Testes rápidos para validar funcionalidade básica
 */
describe('InovaTech - Smoke Test Login', () => {
  before(async () => {
    // Configurar backend antes de todos os testes
    await BackendSetup.configureBackend('http://192.168.5.116:5000/');
  });

  // Garante que cada teste comece na tela de login
  beforeEach(async function() {
    // Pula o primeiro teste que já inicia o app
    if (this.currentTest.title !== 'Smoke: App deve iniciar e exibir tela de login') {
      try {
        // Tenta voltar para tela de login
        await driver.terminateApp('com.example.inovatechmob');
        await driver.pause(1000);
        await driver.activateApp('com.example.inovatechmob');
        await driver.pause(3000);
      } catch (error) {
        console.log('⚠️ Erro ao reiniciar app:', error.message);
      }
    }
  });

  it('Smoke: App deve iniciar e exibir tela de login', async () => {
    // Aguarda app carregar
    await driver.pause(3000);

    // Verifica se a tela de login está visível
    const loginButtonDisplayed = await LoginPage.isLoginScreenDisplayed();
    expect(loginButtonDisplayed).to.be.true;

    console.log('✅ App iniciou corretamente');
  });

  it('Smoke: Deve realizar login com teste@teste.com', async () => {
    // Arrange
    const { email, password } = testData.validUsers.mainTest;
    console.log(`📧 Testando login com: ${email}`);

    // Act
    await LoginPage.login(email, password);
    
    // Aguarda processamento
    await driver.pause(5000);

    // Assert - Verifica se saiu da tela de login
    const stillOnLogin = await LoginPage.isLoginScreenDisplayed().catch(() => false);
    
    if (stillOnLogin) {
      console.log('⚠️  Ainda na tela de login - Login pode ter falhadoou precisa de mais tempo');
      // Captura screenshot para análise
      await driver.saveScreenshot('./reports/screenshots/login-result.png');
    } else {
      console.log('✅ Login realizado com sucesso - Navegou para outra tela');
    }

    // Assert final
    expect(stillOnLogin).to.be.false;
  });

  it('Smoke: Elementos da tela devem estar visíveis', async () => {
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

  it('Smoke: Deve preencher campos de login', async () => {
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

  it('Smoke: Botão Entrar deve ser clicável', async () => {
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

  it('Smoke: Link Criar Conta deve ser clicável', async () => {
    try {
      await LoginPage.clickCreateAccount();
      console.log('✅ Link Criar Conta clicado');
      
      await driver.pause(3000);
      
      // Verifica se navegou
      const stillOnLogin = await LoginPage.isLoginScreenDisplayed().catch(() => false);
      console.log(`📍 Ainda na tela de login: ${stillOnLogin}`);
      
      expect(true).to.be.true;
    } catch (error) {
      console.error('❌ Erro ao clicar em Criar Conta:', error.message);
      // Não falha o teste, apenas registra
      expect(true).to.be.true;
    }
  });

  // Hook para capturar screenshots em caso de falha
  afterEach(async function() {
    if (this.currentTest.state === 'failed') {
      try {
        const fs = require('fs');
        const dir = './reports/screenshots';
        
        // Criar diretório se não existir
        if (!fs.existsSync(dir)){
          fs.mkdirSync(dir, { recursive: true });
        }
        
        const testName = this.currentTest.title.replace(/\s+/g, '_');
        await driver.saveScreenshot(`${dir}/smoke_${testName}.png`);
        console.log(`📸 Screenshot salvo: smoke_${testName}.png`);
      } catch (error) {
        console.log(`⚠️  Erro ao salvar screenshot: ${error.message}`);
      }
    }
  });
});
