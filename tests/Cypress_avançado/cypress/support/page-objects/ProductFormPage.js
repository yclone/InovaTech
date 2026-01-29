import BasePage from './BasePage';

/**
 * Page Object para o formulário de Produto
 */
class ProductFormPage extends BasePage {
  // Seletores
  selectors = {
    nameInput: '[data-testid="product-name-input"]',
    descriptionInput: '[data-testid="product-description-input"]',
    priceInput: '[data-testid="product-price-input"]',
    categorySelect: '[data-testid="product-category-select"]',
    stockInput: '[data-testid="product-stock-input"]',
    imageInput: '[data-testid="product-image-input"]',
    activeCheckbox: '[data-testid="product-active-checkbox"]',
    saveButton: '[data-testid="save-product-button"]',
    cancelButton: '[data-testid="cancel-button"]',
    formTitle: '[data-testid="form-title"]',
    successMessage: '.success-message, .alert-success',
    errorMessage: '.error-message, .alert-danger',
    nameError: '[data-testid="name-error"]',
    priceError: '[data-testid="price-error"]'
  };

  /**
   * Visita a página de adicionar produto
   */
  visitAddProductPage() {
    this.visit('/products/add');
  }

  /**
   * Visita a página de editar produto
   * @param {number} productId - ID do produto
   */
  visitEditProductPage(productId) {
    this.visit(`/products/edit/${productId}`);
  }

  /**
   * Preenche o nome do produto
   * @param {string} name - Nome do produto
   */
  fillName(name) {
    this.type(this.selectors.nameInput, name);
  }

  /**
   * Preenche a descrição do produto
   * @param {string} description - Descrição do produto
   */
  fillDescription(description) {
    this.type(this.selectors.descriptionInput, description);
  }

  /**
   * Preenche o preço do produto
   * @param {string|number} price - Preço do produto
   */
  fillPrice(price) {
    this.type(this.selectors.priceInput, price.toString());
  }

  /**
   * Seleciona a categoria do produto
   * @param {string} category - Categoria
   */
  selectCategory(category) {
    this.getElement(this.selectors.categorySelect).select(category);
  }

  /**
   * Preenche o estoque do produto
   * @param {string|number} stock - Quantidade em estoque
   */
  fillStock(stock) {
    this.type(this.selectors.stockInput, stock.toString());
  }

  /**
   * Marca/desmarca o produto como ativo
   * @param {boolean} active - Se deve estar ativo
   */
  setActive(active) {
    if (active) {
      this.getElement(this.selectors.activeCheckbox).check();
    } else {
      this.getElement(this.selectors.activeCheckbox).uncheck();
    }
  }

  /**
   * Preenche o formulário completo do produto
   * @param {Object} productData - Dados do produto
   */
  fillProductForm(productData) {
    if (productData.name) this.fillName(productData.name);
    if (productData.description) this.fillDescription(productData.description);
    if (productData.price) this.fillPrice(productData.price);
    if (productData.category) this.selectCategory(productData.category);
    if (productData.stock) this.fillStock(productData.stock);
    if (productData.active !== undefined) this.setActive(productData.active);
  }

  /**
   * Clica no botão salvar
   */
  clickSave() {
    this.click(this.selectors.saveButton);
  }

  /**
   * Clica no botão cancelar
   */
  clickCancel() {
    this.click(this.selectors.cancelButton);
  }

  /**
   * Salva o produto (preenche e clica em salvar)
   * @param {Object} productData - Dados do produto
   */
  saveProduct(productData) {
    this.fillProductForm(productData);
    this.clickSave();
  }

  /**
   * Verifica se a mensagem de sucesso está visível
   */
  shouldShowSuccessMessage() {
    this.shouldBeVisible(this.selectors.successMessage);
  }

  /**
   * Verifica se a mensagem de erro está visível
   */
  shouldShowErrorMessage() {
    this.shouldBeVisible(this.selectors.errorMessage);
  }

  /**
   * Verifica erro no campo nome
   */
  shouldShowNameError() {
    this.shouldBeVisible(this.selectors.nameError);
  }

  /**
   * Verifica erro no campo preço
   */
  shouldShowPriceError() {
    this.shouldBeVisible(this.selectors.priceError);
  }

  /**
   * Verifica o título do formulário
   * @param {string} title - Título esperado
   */
  shouldHaveTitle(title) {
    this.shouldContainText(this.selectors.formTitle, title);
  }
}

export default new ProductFormPage();
