const BasePage = require('./BasePage');

/**
 * Page Object para a tela de Login
 */
class LoginPage extends BasePage {
  // Seletores - Tela de Login InovaTech (encontrados via Appium Inspector)
  
  /**
   * Encontra elemento do campo de e-mail
   * Tenta UiSelector primeiro, depois XPath
   */
  get emailField() {
    const uiSelector = $('android=new UiSelector().text("E-mail")');
    const xpath = $('//android.widget.TextView[@text="E-mail"]');
    return uiSelector.error ? xpath : uiSelector;
  }

  /**
   * Encontra campo de e-mail editável (input)
   * No Compose, procura o EditText que aparece após clicar
   */
  get emailInput() {
    // Após clicar, busca o EditText no ComposeView
    return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.widget.EditText[1]') ||
           $('android=new UiSelector().className("android.widget.EditText").instance(0)') ||
           $('//android.widget.EditText[1]');
  }

  /**
   * Encontra elemento do campo de senha
   * Tenta UiSelector primeiro, depois XPath
   */
  get passwordField() {
    const uiSelector = $('android=new UiSelector().text("Senha")');
    const xpath = $('//android.widget.TextView[@text="Senha"]');
    return uiSelector.error ? xpath : uiSelector;
  }

  /**
   * Encontra campo de senha editável (input)
   * No Compose, procura o EditText que aparece após clicar
   */
  get passwordInput() {
    // Após clicar, busca o segundo EditText no ComposeView
    return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.widget.EditText[2]') ||
           $('android=new UiSelector().className("android.widget.EditText").instance(1)') ||
           $('//android.widget.EditText[2]');
  }

  /**
   * Encontra botão Entrar
   * Tenta UiSelector primeiro, depois XPath
   */
  get loginButton() {
    const uiSelector = $('android=new UiSelector().text("Entrar")');
    const xpath = $('//android.widget.TextView[@text="Entrar"]');
    return uiSelector.error ? xpath : uiSelector;
  }

  /**
   * Encontra link Criar conta
   * Tenta UiSelector primeiro, depois XPath
   */
  get createAccountLink() {
    const uiSelector = $('android=new UiSelector().text("Criar conta")');
    const xpath = $('//android.widget.TextView[@text="Criar conta"]');
    return uiSelector.error ? xpath : uiSelector;
  }

  /**
   * Encontra título InovaTech
   * Tenta UiSelector primeiro, depois XPath
   */
  get appTitle() {
    const uiSelector = $('android=new UiSelector().text("InovaTech")');
    const xpath = $('//android.widget.TextView[@text="InovaTech"]');
    return uiSelector.error ? xpath : uiSelector;
  }

  get errorMessage() {
    // Mensagem de erro (pode aparecer em toast ou dialog)
    return $('android=new UiSelector().textContains("erro")');
  }

  // Alias para compatibilidade
  get usernameField() {
    return this.emailField;
  }
  
  get usernameInput() {
    return this.emailInput;
  }

  get signUpLink() {
    return this.createAccountLink;
  }

  // Métodos de ação
  /**
   * Realiza login com e-mail e senha
   * @param {string} email - E-mail do usuário
   * @param {string} password - Senha
   */
  async login(email, password) {
    // Clica no label para focar o input
    await this.click(this.emailField);
    await this.wait(500); // Aguarda o EditText aparecer no Compose
    
    // Agora o EditText está disponível
    await this.setText(this.emailInput, email);
    
    // Clica no campo de senha
    await this.click(this.passwordField);
    await this.wait(500); // Aguarda o EditText aparecer no Compose
    
    // Digita a senha
    await this.setText(this.passwordInput, password);
    
    await this.hideKeyboard();
    await this.wait(500); // Pequena pausa antes de clicar
    await this.click(this.loginButton);
    await this.wait(2000); // Aguarda processamento do login
  }

  /**
   * Preenche apenas o campo de e-mail
   * @param {string} email - E-mail
   */
  async fillEmail(email) {
    await this.click(this.emailField);
    await this.wait(500); // Aguarda Compose renderizar
    await this.setText(this.emailInput, email);
  }

  /**
   * Preenche apenas o campo de senha
   * @param {string} password - Senha
   */
  async fillPassword(password) {
    await this.click(this.passwordField);
    await this.wait(500); // Aguarda Compose renderizar
    await this.setText(this.passwordInput, password);
  }

  /**
   * Verifica se está na tela de login
   * @returns {Promise<boolean>}
   */
  async isLoginScreenDisplayed() {
    return await this.isDisplayed(this.loginButton);
  }

  /**
   * Obtém mensagem de erro
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    return await this.getText(this.errorMessage);
  }

  /**
   * Clica no link "Esqueci minha senha"
   */
  async clickForgotPassword() {
    await this.click(this.forgotPasswordLink);
  }

  /**
   * Clica no link "Criar conta"
   */
  async clickCreateAccount() {
    await this.click(this.createAccountLink);
  }

  /**
   * Alias para compatibilidade
   */
  async clickSignUp() {
    await this.clickCreateAccount();
  }

  /**
   * Limpa o campo de e-mail
   */
  async clearEmail() {
    await this.emailInput.clearValue();
  }

  /**
   * Limpa o campo de usuário (alias)
   */
  async clearUsername() {
    await this.clearEmail();
  }

  /**
   * Verifica se o título do app está visível
   * @returns {Promise<boolean>}
   */
  async isTitleDisplayed() {
    return await this.isDisplayed(this.appTitle);
  }

  /**
   * Obtém o texto do título
   * @returns {Promise<string>}
   */
  async getTitleText() {
    return await this.getText(this.appTitle);
  }

  /**
   * Limpa o campo de senha
   */
  async clearPassword() {
    await this.passwordField.clearValue();
  }
}

module.exports = new LoginPage();
