const LoginPage = require('../app/pageObjects/LoginPage');
const HomePage = require('../app/pageObjects/HomePage');
const TestHelpers = require('../app/helpers/TestHelpers');

describe('Home Tests', () => {
  before(async () => {
    // Setup: realizar login antes dos testes
    const isLoginScreen = await LoginPage.isLoginScreenDisplayed();
    if (isLoginScreen) {
      await LoginPage.login('testuser', 'Test@123');
      await driver.pause(2000);
    }
  });

  beforeEach(async () => {
    // Garante que está na tela home
    const isHomeScreen = await HomePage.isHomeScreenDisplayed();
    if (!isHomeScreen) {
      await TestHelpers.restartApp();
      await LoginPage.login('testuser', 'Test@123');
      await driver.pause(2000);
    }
  });

  it('Deve exibir mensagem de boas-vindas na home', async () => {
    // Assert
    const isDisplayed = await HomePage.isHomeScreenDisplayed();
    expect(isDisplayed).to.be.true;

    const welcomeMessage = await HomePage.getWelcomeMessage();
    expect(welcomeMessage).to.not.be.empty;
  });

  it('Deve abrir o menu lateral', async () => {
    // Act
    await HomePage.openMenu();
    await driver.pause(1000);

    // Assert
    // Adicione validações específicas do menu lateral
    const menuIsDisplayed = await HomePage.isDisplayed(HomePage.logoutButton);
    expect(menuIsDisplayed).to.be.true;
  });

  it('Deve abrir o perfil do usuário', async () => {
    // Act
    await HomePage.openProfile();
    await driver.pause(1000);

    // Assert
    // Adicione validações específicas da tela de perfil
  });

  it('Deve realizar busca', async () => {
    // Arrange
    const searchText = 'teste';

    // Act
    await HomePage.search(searchText);
    await driver.pause(2000);

    // Assert
    // Adicione validações dos resultados da busca
  });

  it('Deve abrir notificações', async () => {
    // Act
    await HomePage.openNotifications();
    await driver.pause(1000);

    // Assert
    // Adicione validações da tela de notificações
  });

  it('Deve realizar logout com sucesso', async () => {
    // Act
    await HomePage.logout();
    await driver.pause(2000);

    // Assert
    const isLoginScreen = await LoginPage.isLoginScreenDisplayed();
    expect(isLoginScreen).to.be.true;
  });
});
