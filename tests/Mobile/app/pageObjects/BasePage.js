/**
 * Base Page Object
 * Contém métodos comuns para todas as páginas
 */
class BasePage {
  /**
   * Aguarda um elemento estar visível
   * @param {WebdriverIO.Element} element - Elemento a aguardar
   * @param {number} timeout - Tempo máximo de espera em ms
   */
  async waitForElement(element, timeout = 10000) {
    await element.waitForDisplayed({ timeout });
  }

  /**
   * Clica em um elemento
   * @param {WebdriverIO.Element} element - Elemento a clicar
   */
  async click(element) {
    await this.waitForElement(element);
    await element.click();
  }

  /**
   * Define valor em um campo de texto
   * @param {WebdriverIO.Element} element - Campo de texto
   * @param {string} text - Texto a inserir
   */
  async setText(element, text) {
    await this.waitForElement(element);
    await element.clearValue();
    await element.setValue(text);
  }

  /**
   * Obtém texto de um elemento
   * @param {WebdriverIO.Element} element - Elemento
   * @returns {Promise<string>} Texto do elemento
   */
  async getText(element) {
    await this.waitForElement(element);
    return await element.getText();
  }

  /**
   * Verifica se elemento está visível
   * @param {WebdriverIO.Element} element - Elemento
   * @returns {Promise<boolean>}
   */
  async isDisplayed(element) {
    try {
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Scroll até elemento ficar visível
   * @param {WebdriverIO.Element} element - Elemento
   */
  async scrollToElement(element) {
    await driver.execute('mobile: scroll', { element: element.elementId, toVisible: true });
  }

  /**
   * Esconde o teclado
   */
  async hideKeyboard() {
    try {
      await driver.hideKeyboard();
    } catch (error) {
      console.log('Keyboard already hidden or not available');
    }
  }

  /**
   * Realiza swipe na tela
   * @param {string} direction - Direção: 'up', 'down', 'left', 'right'
   */
  async swipe(direction = 'up') {
    const { width, height } = await driver.getWindowSize();
    const centerX = width / 2;
    const centerY = height / 2;

    const directions = {
      up: { startY: centerY + 200, endY: centerY - 200 },
      down: { startY: centerY - 200, endY: centerY + 200 },
      left: { startX: centerX + 200, endX: centerX - 200 },
      right: { startX: centerX - 200, endX: centerX + 200 },
    };

    const swipeConfig = directions[direction];

    await driver.touchPerform([
      { action: 'press', options: { x: swipeConfig.startX || centerX, y: swipeConfig.startY || centerY } },
      { action: 'wait', options: { ms: 500 } },
      { action: 'moveTo', options: { x: swipeConfig.endX || centerX, y: swipeConfig.endY || centerY } },
      { action: 'release' },
    ]);
  }

  /**
   * Aguarda um tempo específico
   * @param {number} ms - Milissegundos
   */
  async wait(ms = 1000) {
    await driver.pause(ms);
  }

  /**
   * Tira screenshot
   * @param {string} filename - Nome do arquivo
   */
  async takeScreenshot(filename) {
    await driver.saveScreenshot(`./reports/screenshots/${filename}.png`);
  }

  /**
   * Verifica se está na plataforma Android
   * @returns {boolean}
   */
  isAndroid() {
    return driver.isAndroid;
  }

  /**
   * Verifica se está na plataforma iOS
   * @returns {boolean}
   */
  isIOS() {
    return driver.isIOS;
  }
}

module.exports = BasePage;
