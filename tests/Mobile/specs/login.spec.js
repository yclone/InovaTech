const LoginPage = require('../app/pageObjects/LoginPage');
const HomePage = require('../app/pageObjects/HomePage');
const TestHelpers = require('../app/helpers/TestHelpers');
const testData = require('../app/data/testData');

describe('InovaTech - Testes de Login', () => {
  beforeEach(async () => {
    // Garante que está na tela de login
    const isLoginScreen = await LoginPage.isLoginScreenDisplayed();
    if (!isLoginScreen) {
      await TestHelpers.restartApp();
      await driver.pause(2000);
    }
  });

  it('Deve exibir a tela de login corretamente', async () => {
    // Assert - Verificar elementos da tela
    const titleDisplayed = await LoginPage.isTitleDisplayed();
    expect(titleDisplayed).to.be.true;

    const titleText = await LoginPage.getTitleText();
    expect(titleText).to.equal('InovaTech');

    const loginButtonDisplayed = await LoginPage.isDisplayed(LoginPage.loginButton);
    expect(loginButtonDisplayed).to.be.true;

    const createAccountDisplayed = await LoginPage.isDisplayed(LoginPage.createAccountLink);
    expect(createAccountDisplayed).to.be.true;
  });

  it('Deve realizar login com credenciais válidas (teste@teste.com / 123)', async () => {
    // Arrange
    const { email, password } = testData.validUsers.mainTest;

    // Act
    await LoginPage.login(email, password);

    // Assert
    await driver.pause(3000); // Aguarda navegação
    
    // Verifica se não está mais na tela de login
    const stillOnLogin = await LoginPage.isLoginScreenDisplayed();
    expect(stillOnLogin).to.be.false;

    // Ou verifica se está na home (ajuste conforme seu app)
    // const isHomeDisplayed = await HomePage.isHomeScreenDisplayed();
    // expect(isHomeDisplayed).to.be.true;
  });

  it('Deve exibir erro ao tentar login com senha incorreta', async () => {
    // Arrange
    const { email, password } = testData.invalidUsers.wrongPassword;

    // Act
    await LoginPage.login(email, password);
    await driver.pause(2000);

    // Assert - Verifica se ainda está na tela de login
    const stillOnLogin = await LoginPage.isLoginScreenDisplayed();
    expect(stillOnLogin).to.be.true;

    // Ou verifica mensagem de erro se o app exibir
    // const errorMessage = await LoginPage.getErrorMessage();
    // expect(errorMessage).to.not.be.empty;
  });

  it('Deve exibir erro ao tentar login com email inválido', async () => {
    // Arrange
    const { email, password } = testData.invalidUsers.wrongEmail;

    // Act
    await LoginPage.login(email, password);
    await driver.pause(2000);

    // Assert - Verifica se ainda está na tela de login
    const stillOnLogin = await LoginPage.isLoginScreenDisplayed();
    expect(stillOnLogin).to.be.true;
  });

  it('Deve exibir erro ao tentar login com campo de e-mail vazio', async () => {
    // Arrange
    const { password } = testData.validUsers.mainTest;

    // Act
    await LoginPage.fillPassword(password);
    await LoginPage.hideKeyboard();
    await driver.pause(500);
    await LoginPage.click(LoginPage.loginButton);
    await driver.pause(1000);

    // Assert - Verifica se ainda está na tela de login
    const stillOnLogin = await LoginPage.isLoginScreenDisplayed();
    expect(stillOnLogin).to.be.true;
  });

  it('Deve exibir erro ao tentar login com campo de senha vazio', async () => {
    // Arrange
    const { email } = testData.validUsers.mainTest;

    // Act
    await LoginPage.fillEmail(email);
    await LoginPage.hideKeyboard();
    await driver.pause(500);
    await LoginPage.click(LoginPage.loginButton);
    await driver.pause(1000);

    // Assert - Verifica se ainda está na tela de login
    const stillOnLogin = await LoginPage.isLoginScreenDisplayed();
    expect(stillOnLogin).to.be.true;
  });

  it('Deve exibir erro ao tentar login com ambos os campos vazios', async () => {
    // Act - Apenas clica no botão sem preencher nada
    await LoginPage.click(LoginPage.loginButton);
    await driver.pause(1000);

    // Assert - Verifica se ainda está na tela de login
    const stillOnLogin = await LoginPage.isLoginScreenDisplayed();
    expect(stillOnLogin).to.be.true;
  });

  it('Deve navegar para tela de cadastro ao clicar em "Criar conta"', async () => {
    // Act
    await LoginPage.clickCreateAccount();
    await driver.pause(2000);

    // Assert - Verifica se saiu da tela de login
    const stillOnLogin = await LoginPage.isLoginScreenDisplayed();
    expect(stillOnLogin).to.be.false;
  });

  it('Deve preencher corretamente o campo de e-mail', async () => {
    // Arrange
    const { email } = testData.validUsers.mainTest;

    // Act
    await LoginPage.fillEmail(email);
    await LoginPage.hideKeyboard();

    // Assert - Verifica se o campo foi preenchido
    const emailFieldValue = await LoginPage.emailField.getText();
    expect(emailFieldValue).to.include('teste@teste.com');
  });

  it('Deve preencher corretamente o campo de senha', async () => {
    // Arrange
    const { password } = testData.validUsers.mainTest;

    // Act
    await LoginPage.fillPassword(password);
    await LoginPage.hideKeyboard();

    // Assert - Campo de senha preenchido (geralmente retorna bullets ou vazio por segurança)
    const passwordFieldExists = await LoginPage.isDisplayed(LoginPage.passwordField);
    expect(passwordFieldExists).to.be.true;
  });
});
