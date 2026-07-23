import { When, And } from "cypress-cucumber-preprocessor/steps";
import RequisicaoPage from '../../page_objects/RequisicaoPage';

// Quando defino o content type do header como "contentType"
When(/^Defino o content type do header como "([^"]*)"$/, (contentType) => {
  RequisicaoPage.definirContentType(contentType);
});

// Quando defino os headers
When('Defino os headers como', (dataTable) => {
  const headers = {};
  dataTable.rawTable.forEach(([key, value]) => {
    headers[key] = value;
  });
  RequisicaoPage.definirHeaders(headers);
});

// E Faço a requisição na API com o método de solicitação "method" e o body abaixo:
And(/^Faco a requisicao na API com o metodo de solicitacao "([^"]*)" e o body abaixo:$/, (method, docString) => {
  const body = typeof docString === 'string' ? JSON.parse(docString) : docString;
  RequisicaoPage.fazerRequisicaoComBody(method, body);
});

// E Faço a requisição na API com o método de solicitação "method"
And(/^Faco a requisicao na API com o metodo de solicitacao "([^"]*)"$/, (method) => {
  RequisicaoPage.fazerRequisicao(method);
});
