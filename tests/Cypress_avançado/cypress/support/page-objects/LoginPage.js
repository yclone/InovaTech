import BasePage from './BasePage';

/**
 * Page Object para a página de Login
 */
class LoginPage extends BasePage {
  // Seletores
  selectors = {
    usernameInput: '[data-testid="usuario"]',
    passwordInput: '[data-testid="senha"]',
    loginButton: '[data-testid="login-button"]',
    errorMessage: '.error-message, .alert-danger',
    // forgotPasswordLink: '[data-testid="forgot-password"]',
    registerLink: '[data-testid="register-link"]'
  };

  /**
   * Visita a página de login
   */
  visitLoginPage() {
    this.visit('/login');
  }

  /**
   * Preenche o campo de usuário
   * @param {string} username - Nome de usuário
   */
  fillUsername(username) {
    this.type(this.selectors.usernameInput, username);
  }

  /**
   * Preenche o campo de senha
   * @param {string} password - Senha
   */
  fillPassword(password) {
    this.type(this.selectors.passwordInput, password);
  }

  /**
   * Clica no botão de login
   */
  clickLoginButton() {
    this.click(this.selectors.loginButton);
  }

  /**
   * Realiza o login completo
   * @param {string} username - Nome de usuário
   * @param {string} password - Senha
   */
  doLogin(username, password) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickLoginButton();
  }

  /**
   * Verifica se a mensagem de erro está visível
   */
  shouldShowErrorMessage() {
    this.shouldBeVisible(this.selectors.errorMessage);
  }

  /**
   * Verifica o texto da mensagem de erro
   * @param {string} message - Texto esperado
   */
  shouldHaveErrorMessage(message) {
    this.shouldContainText(this.selectors.errorMessage, message);
  }

  // /**
  //  * Clica no link "Esqueci minha senha"
  //  */
  // clickForgotPassword() {
  //   this.click(this.selectors.forgotPasswordLink);
  // }

  /**
   * Clica no link de registro
   */
  clickRegisterLink() {
    this.click(this.selectors.registerLink);
  }
}

export default new LoginPage();
