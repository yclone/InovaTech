import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import LoginPage from '../page-objects/LoginPage';
import HomePage from '../page-objects/HomePage';
import ProductsPage from '../page-objects/ProductsPage';
import ProductFormPage from '../page-objects/ProductFormPage';

// Contexto
Given('que estou logado como administrador', () => {
  LoginPage.visitLoginPage();
  LoginPage.doLogin('admin', 'admin123');
  cy.url().should('not.include', '/login');
});

Given('estou na página de produtos', () => {
  ProductsPage.visitProductsPage();
});

Given('que existe um produto {string} na lista', (productName) => {
  // Mock ou criação do produto se necessário
  // Para o exemplo, assumimos que o produto já existe
  ProductsPage.shouldHaveProduct(productName);
});

Given('que existem os seguintes produtos cadastrados:', (dataTable) => {
  // Cria produtos a partir da tabela de dados
  const products = dataTable.hashes();
  products.forEach((product) => {
    // Aqui você pode criar os produtos via API ou UI
    // Para o exemplo, vamos apenas verificar
    cy.log(`Produto: ${product.nome} - Preço: ${product.preço}`);
  });
});

Given('que existem produtos de diferentes categorias', () => {
  // Setup de produtos de diferentes categorias
  cy.log('Produtos de diferentes categorias existem');
});

// Ações
When('eu clico no botão de adicionar produto', () => {
  ProductsPage.clickAddProduct();
});

When('eu preencho o formulário com os seguintes dados:', (dataTable) => {
  const data = {};
  dataTable.hashes().forEach((row) => {
    const field = row.campo.toLowerCase();
    const value = row.valor;
    
    switch(field) {
      case 'nome':
        data.name = value;
        break;
      case 'descrição':
        data.description = value;
        break;
      case 'preço':
        data.price = value;
        break;
      case 'categoria':
        data.category = value;
        break;
      case 'estoque':
        data.stock = value;
        break;
    }
  });
  
  ProductFormPage.fillProductForm(data);
});

When('eu clico no botão salvar', () => {
  ProductFormPage.clickSave();
});

When('eu clico no botão editar do produto {string}', (productName) => {
  // Encontra e clica no botão editar do produto específico
  cy.contains(ProductsPage.selectors.productName, productName)
    .parents(ProductsPage.selectors.productItem)
    .find(ProductsPage.selectors.editButton)
    .click();
});

When('eu altero o preço para {string}', (price) => {
  ProductFormPage.fillPrice(price);
});

When('eu clico no botão excluir do produto {string}', (productName) => {
  cy.contains(ProductsPage.selectors.productName, productName)
    .parents(ProductsPage.selectors.productItem)
    .find(ProductsPage.selectors.deleteButton)
    .click();
});

When('eu confirmo a exclusão', () => {
  ProductsPage.confirmDelete();
});

When('eu preencho apenas a descrição com {string}', (description) => {
  ProductFormPage.fillDescription(description);
});

When('eu busco por {string}', (searchTerm) => {
  ProductsPage.searchProduct(searchTerm);
});

When('eu seleciono a categoria {string}', (category) => {
  ProductsPage.applyFilter(category);
});

When('eu preencho o campo {string} com {string}', (field, value) => {
  const fieldMap = {
    'nome': () => ProductFormPage.fillName(value),
    'preço': () => ProductFormPage.fillPrice(value),
    'descrição': () => ProductFormPage.fillDescription(value)
  };
  
  if (value && fieldMap[field]) {
    fieldMap[field]();
  }
});

// Validações
Then('devo ver uma mensagem de sucesso', () => {
  ProductFormPage.shouldShowSuccessMessage();
});

Then('o produto {string} deve aparecer na lista', (productName) => {
  ProductsPage.shouldHaveProduct(productName);
});

Then('o produto {string} deve ter o preço {string}', (productName, price) => {
  cy.contains(ProductsPage.selectors.productName, productName)
    .parents(ProductsPage.selectors.productItem)
    .find(ProductsPage.selectors.productPrice)
    .should('contain', price);
});

Then('o produto {string} não deve aparecer na lista', (productName) => {
  cy.contains(ProductsPage.selectors.productName, productName).should('not.exist');
});

Then('devo ver um erro no campo nome', () => {
  ProductFormPage.shouldShowNameError();
});

Then('o produto não deve ser salvo', () => {
  // Verifica que ainda está na página do formulário
  cy.url().should('include', '/products/add');
});

Then('devo ver apenas {int} produto na lista', (count) => {
  ProductsPage.shouldHaveProductCount(count);
});

Then('devo ver apenas produtos da categoria {string}', (category) => {
  // Verifica que todos os produtos visíveis são da categoria especificada
  cy.get(ProductsPage.selectors.productItem).each(($el) => {
    cy.wrap($el).should('contain', category);
  });
});

Then('devo ver um erro indicando campo obrigatório', () => {
  ProductFormPage.shouldShowErrorMessage();
});
