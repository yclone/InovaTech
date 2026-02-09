const BasePage = require('./BasePage');

/**
 * Page Object para a tela Home
 */
class HomePage extends BasePage {
  // Seletores
  get welcomeMessage() {
    return $('~welcome-message');
  }

  get userProfile() {
    return $('~user-profile');
  }

  get logoutButton() {
    return $('~logout-button');
  }

  get menuButton() {
    return $('~menu-button');
  }

  get searchField() {
    return $('~search-field');
  }

  get notificationIcon() {
    return $('~notification-icon');
  }

  // Métodos de ação
  /**
   * Verifica se está na tela home
   * @returns {Promise<boolean>}
   */
  async isHomeScreenDisplayed() {
    return await this.isDisplayed(this.welcomeMessage);
  }

  /**
   * Obtém mensagem de boas-vindas
   * @returns {Promise<string>}
   */
  async getWelcomeMessage() {
    return await this.getText(this.welcomeMessage);
  }

  /**
   * Realiza logout
   */
  async logout() {
    await this.click(this.menuButton);
    await this.wait(500);
    await this.click(this.logoutButton);
  }

  /**
   * Abre o perfil do usuário
   */
  async openProfile() {
    await this.click(this.userProfile);
  }

  /**
   * Realiza busca
   * @param {string} searchText - Texto a buscar
   */
  async search(searchText) {
    await this.setText(this.searchField, searchText);
    await driver.pressKeyCode(66); // Enter key
  }

  /**
   * Abre notificações
   */
  async openNotifications() {
    await this.click(this.notificationIcon);
  }

  /**
   * Abre menu lateral
   */
  async openMenu() {
    await this.click(this.menuButton);
  }
}

module.exports = new HomePage();
