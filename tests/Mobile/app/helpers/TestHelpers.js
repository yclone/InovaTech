/**
 * Helpers e utilitários para os testes
 */
class TestHelpers {
  /**
   * Gera um email aleatório
   * @returns {string}
   */
  static generateRandomEmail() {
    const timestamp = Date.now();
    return `user${timestamp}@test.com`;
  }

  /**
   * Gera um username aleatório
   * @returns {string}
   */
  static generateRandomUsername() {
    const timestamp = Date.now();
    return `user${timestamp}`;
  }

  /**
   * Formata uma data
   * @param {Date} date - Data a formatar
   * @returns {string}
   */
  static formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  /**
   * Aguarda um tempo aleatório entre min e max
   * @param {number} min - Tempo mínimo em ms
   * @param {number} max - Tempo máximo em ms
   */
  static async randomWait(min = 1000, max = 3000) {
    const waitTime = Math.floor(Math.random() * (max - min + 1)) + min;
    await driver.pause(waitTime);
  }

  /**
   * Reinicia o app
   */
  static async restartApp() {
    await driver.reset();
  }

  /**
   * Coloca o app em background
   * @param {number} seconds - Segundos em background
   */
  static async backgroundApp(seconds = 5) {
    await driver.background(seconds);
  }

  /**
   * Verifica se elemento existe no DOM
   * @param {string} selector - Seletor do elemento
   * @returns {Promise<boolean>}
   */
  static async elementExists(selector) {
    try {
      const element = await $(selector);
      return await element.isExisting();
    } catch (error) {
      return false;
    }
  }

  /**
   * Aguarda até que um elemento desapareça
   * @param {WebdriverIO.Element} element - Elemento
   * @param {number} timeout - Timeout em ms
   */
  static async waitForElementToDisappear(element, timeout = 10000) {
    await element.waitForDisplayed({ timeout, reverse: true });
  }

  /**
   * Obtém atributo de um elemento
   * @param {WebdriverIO.Element} element - Elemento
   * @param {string} attribute - Nome do atributo
   * @returns {Promise<string>}
   */
  static async getAttribute(element, attribute) {
    return await element.getAttribute(attribute);
  }

  /**
   * Verifica se elemento está habilitado
   * @param {WebdriverIO.Element} element - Elemento
   * @returns {Promise<boolean>}
   */
  static async isEnabled(element) {
    return await element.isEnabled();
  }

  /**
   * Faz scroll até o final da página
   */
  static async scrollToBottom() {
    await driver.execute('mobile: scrollGesture', {
      direction: 'down',
      percent: 3.0,
    });
  }

  /**
   * Faz scroll até o topo da página
   */
  static async scrollToTop() {
    await driver.execute('mobile: scrollGesture', {
      direction: 'up',
      percent: 3.0,
    });
  }
}

module.exports = TestHelpers;
