import { Then, And } from "cypress-cucumber-preprocessor/steps";
import ValidacaoPage from '../../page_objects/ValidacaoPage';

// Entao verifico se o status code é igual a "statusCode"
Then(/^Verifico se o status code e igual a "([^"]*)"$/, (statusCode) => {
  ValidacaoPage.verificarStatusCode(statusCode);
});

// E Verifico se o valor da resposta "field" é igual a "expectedValue"
And(/^Verifico se o valor da resposta "([^"]*)" e igual a "([^"]*)"$/, (field, expectedValue) => {
  ValidacaoPage.verificarValorIgual(field, expectedValue);
});

// Entao verifico se o valor da resposta "field" é diferente de "unexpectedValue"
Then(/^Verifico se o valor da resposta "([^"]*)" e diferente de "([^"]*)"$/, (field, unexpectedValue) => {
  ValidacaoPage.verificarValorDiferente(field, unexpectedValue);
});

// E Guardo no Environment a chave "key" do ResponseBody com o valor "field"
And(/^Guardo no Environment a chave "([^"]*)" do ResponseBody com o valor "([^"]*)"$/, (key, field) => {
  ValidacaoPage.armazenarValorNoEnvironment(key, field);
});

// Entao Guardo no Environment a chave do ResponseBody
Then(/^Guardo no Environment a chave "([^"]*)" do ResponseBody$/, (key) => {
  ValidacaoPage.armazenarResponseBodyCompleto(key);
});
