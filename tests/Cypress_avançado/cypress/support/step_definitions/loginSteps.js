import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import LoginPage from '../page-objects/LoginPage';
import HomePage from '../page-objects/HomePage';

// Contexto
Given('que estou na página de login', () => {
  LoginPage.visitLoginPage();
});

Given('que estou logado com usuário {string} e senha {string}', (username, password) => {
  LoginPage.visitLoginPage();
  LoginPage.doLogin(username, password);
  cy.url().should('not.include', '/login');
});

Given('estou na página inicial', () => {
  HomePage.visitHomePage();
});

// Ações
When('eu preencho o campo usuário com {string}', (username) => {
  LoginPage.fillUsername(username);
});

When('eu preencho o campo senha com {string}', (password) => {
  LoginPage.fillPassword(password);
});

When('eu clico no botão de login', () => {
  LoginPage.clickLoginButton();
});

When('eu abro o menu do usuário', () => {
  HomePage.openUserMenu();
});

When('clico em logout', () => {
  cy.get(HomePage.selectors.logoutButton).click();
});

// Validações
Then('eu devo ser redirecionado para a página inicial', () => {
  cy.url().should('include', '/');
  cy.url().should('not.include', '/login');
});

Then('devo ver a mensagem de boas-vindas com {string}', (username) => {
  HomePage.shouldShowWelcomeMessage(username);
});

Then('eu devo ver uma mensagem de erro', () => {
  LoginPage.shouldShowErrorMessage();
});

Then('devo permanecer na página de login', () => {
  cy.url().should('include', '/login');
});

Then('o campo usuário deve estar destacado com erro', () => {
  cy.get(LoginPage.selectors.usernameInput).should('have.class', 'error')
    .or('have.attr', 'aria-invalid', 'true');
});

Then('o campo senha deve estar destacado com erro', () => {
  cy.get(LoginPage.selectors.passwordInput).should('have.class', 'error')
    .or('have.attr', 'aria-invalid', 'true');
});

Then('devo ser redirecionado para a página de login', () => {
  cy.url().should('include', '/login');
});
