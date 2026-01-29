import BasePage from './BasePage';

/**
 * Page Object para a página de Produtos
 */
class ProductsPage extends BasePage {
  // Seletores
  selectors = {
    addProductButton: '[data-testid="add-product-button"]',
    productsList: '[data-testid="products-list"]',
    productItem: '[data-testid="product-item"]',
    productName: '[data-testid="product-name"]',
    productPrice: '[data-testid="product-price"]',
    productDescription: '[data-testid="product-description"]',
    editButton: '[data-testid="edit-product-button"]',
    deleteButton: '[data-testid="delete-product-button"]',
    searchInput: '[data-testid="search-products"]',
    filterSelect: '[data-testid="filter-products"]',
    confirmDeleteModal: '[data-testid="confirm-delete-modal"]',
    confirmDeleteButton: '[data-testid="confirm-delete-yes"]',
    cancelDeleteButton: '[data-testid="confirm-delete-no"]',
    noProductsMessage: '[data-testid="no-products-message"]'
  };

  /**
   * Visita a página de produtos
   */
  visitProductsPage() {
    this.visit('/products');
  }

  /**
   * Clica no botão de adicionar produto
   */
  clickAddProduct() {
    this.click(this.selectors.addProductButton);
  }

  /**
   * Verifica se a lista de produtos está visível
   */
  shouldShowProductsList() {
    this.shouldBeVisible(this.selectors.productsList);
  }

  /**
   * Obtém todos os produtos da lista
   * @returns {Cypress.Chainable}
   */
  getProducts() {
    return this.getElement(this.selectors.productItem);
  }

  /**
   * Verifica o número de produtos
   * @param {number} count - Número esperado de produtos
   */
  shouldHaveProductCount(count) {
    this.getProducts().should('have.length', count);
  }

  /**
   * Busca um produto por nome
   * @param {string} productName - Nome do produto
   */
  searchProduct(productName) {
    this.type(this.selectors.searchInput, productName);
  }

  /**
   * Edita um produto específico
   * @param {number} index - Índice do produto (0-based)
   */
  editProduct(index) {
    this.getProducts().eq(index).find(this.selectors.editButton).click();
  }

  /**
   * Deleta um produto específico
   * @param {number} index - Índice do produto (0-based)
   */
  deleteProduct(index) {
    this.getProducts().eq(index).find(this.selectors.deleteButton).click();
  }

  /**
   * Confirma a exclusão de um produto
   */
  confirmDelete() {
    this.shouldBeVisible(this.selectors.confirmDeleteModal);
    this.click(this.selectors.confirmDeleteButton);
  }

  /**
   * Cancela a exclusão de um produto
   */
  cancelDelete() {
    this.shouldBeVisible(this.selectors.confirmDeleteModal);
    this.click(this.selectors.cancelDeleteButton);
  }

  /**
   * Verifica se um produto específico existe
   * @param {string} productName - Nome do produto
   */
  shouldHaveProduct(productName) {
    this.getElement(this.selectors.productName).should('contain', productName);
  }

  /**
   * Verifica se a mensagem "Nenhum produto encontrado" está visível
   */
  shouldShowNoProductsMessage() {
    this.shouldBeVisible(this.selectors.noProductsMessage);
  }

  /**
   * Aplica filtro de produtos
   * @param {string} filterValue - Valor do filtro
   */
  applyFilter(filterValue) {
    this.getElement(this.selectors.filterSelect).select(filterValue);
  }
}

export default new ProductsPage();
