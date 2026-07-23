class BackendSetup {
  /**
   * Configura a URL do backend no aplicativo
   * @param {string} backendUrl - URL do backend a ser configurada
   */
  static async configureBackend(backendUrl = 'http://192.168.5.116:5000/') {
    try {
      console.log(`Configurando backend: ${backendUrl}`);
      await driver.pause(2000);
      
      // Clicar no botão "Configurar backend"
      const configButton = await $('android=new UiSelector().text("Configurar backend")');
      await configButton.waitForDisplayed({ timeout: 10000 });
      await configButton.click();
      
      await driver.pause(1000);
      
      // Inserir a URL no popup
      const urlField = await $('android=new UiSelector().className("android.widget.EditText")');
      await urlField.waitForDisplayed({ timeout: 5000 });
      await urlField.clearValue();
      await urlField.setValue(backendUrl);
      
      await driver.pause(500);
      
      // Clicar no botão "Salvar"
      const saveButton = await $('android=new UiSelector().text("Salvar")');
      await saveButton.waitForDisplayed({ timeout: 5000 });
      await saveButton.click();
      
      await driver.pause(2000);
      console.log('Backend configurado com sucesso!');
    } catch (error) {
      console.error('Erro ao configurar backend:', error.message);
      throw error;
    }
  }

  /**
   * Verifica se o botão de configurar backend está disponível
   */
  static async isConfigButtonAvailable() {
    try {
      const configButton = await $('android=new UiSelector().text("Configurar backend")');
      return await configButton.isDisplayed();
    } catch (error) {
      return false;
    }
  }
}

module.exports = BackendSetup;
