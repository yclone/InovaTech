import BasePage from './BasePage';

/**
 * Page Object para a página Home/Dashboard
 */
class HomePage extends BasePage {
  // Seletores
  selectors = {
    userMenu: '[data-testid="user-menu"]',
    logoutButton: '[data-testid="logout-button"]',
    welcomeMessage: '[data-testid="welcome-message"]',
    navigationMenu: '[data-testid="navigation-menu"]',
    productsLink: '[data-testid="products-link"]',
    usersLink: '[data-testid="users-link"]',
    settingsLink: '[data-testid="settings-link"]',
    profileLink: '[data-testid="profile-link"]',
    notificationIcon: '[data-testid="notification-icon"]',
    searchInput: '[data-testid="search-input"]',
    searchButton: '[data-testid="search-button"]'
  };

  /**
   * Visita a página home
   */
  visitHomePage() {
    this.visit('/');
  }

  /**
   * Verifica se está na página home
   */
  shouldBeOnHomePage() {
    this.shouldHaveUrl('/');
    this.shouldBeVisible(this.selectors.welcomeMessage);
  }

  /**
   * Verifica a mensagem de boas-vindas
   * @param {string} username - Nome do usuário esperado
   */
  shouldShowWelcomeMessage(username) {
    this.shouldContainText(this.selectors.welcomeMessage, username);
  }

  /**
   * Abre o menu do usuário
   */
  openUserMenu() {
    this.click(this.selectors.userMenu);
  }

  /**
   * Realiza logout
   */
  doLogout() {
    this.openUserMenu();
    this.click(this.selectors.logoutButton);
  }

  /**
   * Navega para a página de produtos
   */
  navigateToProducts() {
    this.click(this.selectors.productsLink);
  }

  /**
   * Navega para a página de usuários
   */
  navigateToUsers() {
    this.click(this.selectors.usersLink);
  }

  /**
   * Navega para a página de configurações
   */
  navigateToSettings() {
    this.click(this.selectors.settingsLink);
  }

  /**
   * Navega para o perfil do usuário
   */
  navigateToProfile() {
    this.openUserMenu();
    this.click(this.selectors.profileLink);
  }

  /**
   * Realiza uma busca
   * @param {string} searchTerm - Termo de busca
   */
  search(searchTerm) {
    this.type(this.selectors.searchInput, searchTerm);
    this.click(this.selectors.searchButton);
  }

  /**
   * Verifica se o menu de navegação está visível
   */
  shouldShowNavigationMenu() {
    this.shouldBeVisible(this.selectors.navigationMenu);
  }
}

export default new HomePage();
