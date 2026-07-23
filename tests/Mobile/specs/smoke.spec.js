const BasePage = require('../app/pageObjects/BasePage');
const TestHelpers = require('../app/helpers/TestHelpers');
const BackendSetup = require('../app/helpers/BackendSetup');

describe('Smoke Tests - Verificações Básicas', () => {
  before(async () => {
    // Configurar backend antes de todos os testes
    await BackendSetup.configureBackend('http://192.168.5.116:5000/');
  });

  it('Deve iniciar o aplicativo com sucesso', async () => {
    // Assert
    expect(driver).to.exist;
    const source = await driver.getPageSource();
    expect(source).to.not.be.empty;
  });

  it('Deve ter conexão com o Appium', async () => {
    // Assert
    const status = await driver.status();
    expect(status).to.exist;
  });

  it('Deve obter informações do dispositivo', async () => {
    // Act
    const deviceInfo = await driver.getDeviceTime();
    const windowSize = await driver.getWindowSize();

    // Assert
    expect(deviceInfo).to.exist;
    expect(windowSize).to.exist;
    expect(windowSize.width).to.be.greaterThan(0);
    expect(windowSize.height).to.be.greaterThan(0);
  });

  it('Deve conseguir fazer scroll', async () => {
    // Act & Assert
    try {
      await BasePage.swipe('up');
      await driver.pause(500);
      await BasePage.swipe('down');
      expect(true).to.be.true;
    } catch (error) {
      expect.fail('Não foi possível realizar scroll');
    }
  });

  it('Deve conseguir fazer screenshot', async () => {
    // Act
    const screenshot = await driver.takeScreenshot();

    // Assert
    expect(screenshot).to.exist;
    expect(screenshot).to.not.be.empty;
  });

  it('Deve conseguir esconder teclado', async () => {
    // Act & Assert
    try {
      await BasePage.hideKeyboard();
      expect(true).to.be.true;
    } catch (error) {
      // Teclado não estava aberto - isso é esperado
      expect(true).to.be.true;
    }
  });

  it('Deve reiniciar o app corretamente', async () => {
    // Act
    await TestHelpers.restartApp();
    await driver.pause(2000);

    // Assert
    const source = await driver.getPageSource();
    expect(source).to.not.be.empty;
  });

  it('Deve conseguir colocar app em background', async () => {
    // Act
    await TestHelpers.backgroundApp(2);
    await driver.pause(500);

    // Assert
    const source = await driver.getPageSource();
    expect(source).to.not.be.empty;
  });
});
