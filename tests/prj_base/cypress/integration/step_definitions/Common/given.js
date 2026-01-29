import { Given } from "cypress-cucumber-preprocessor/steps";
import ConfiguracaoPage from '../../page_objects/ConfiguracaoPage';

// Dado que quero testar o "endpoint"
Given(/^Que quero testar o "([^"]*)"$/, (endpoint) => {
  ConfiguracaoPage.definirEndpoint(endpoint);
});

// Dado que defino a URL como "url" para o caso de teste "testCase"
Given(/^Que defino a URL como "([^"]*)" para o caso de teste "([^"]*)"$/, (url, testCase) => {
  ConfiguracaoPage.definirURLParaTeste(url, testCase);
  cy.wrap('').as('endpoint'); // Inicializa endpoint vazio para evitar erro de alias não encontrado
});