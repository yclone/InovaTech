# Guia de Início Rápido - Cypress Avançado

## 🎯 Objetivo
Este guia ajudará você a começar a usar o projeto de testes Cypress com Cucumber e Page Objects.

## 📋 Pré-requisitos
- Node.js 16 ou superior
- NPM ou Yarn
- Frontend e Backend da aplicação InovaTech rodando

## 🚀 Passo a Passo

### 1. Instalar Dependências
```powershell
cd c:\Users\vmarrasa\DEV\InovaTech\tests\Cypress_avançado
npm install
```

### 2. Verificar URLs
Certifique-se de que as aplicações estão rodando:
- Frontend: http://localhost:5173
- API: http://localhost:5000

### 3. Executar Testes

#### Modo Interativo (recomendado para desenvolvimento)
```powershell
npm run open
```
Isso abrirá a interface do Cypress onde você pode:
- Selecionar e executar testes individuais
- Ver a execução em tempo real
- Inspecionar elementos

#### Modo Headless (para CI/CD)
```powershell
# Todos os testes
npm test

# Apenas testes smoke
npm run test:smoke

# Apenas testes de regressão
npm run test:regression
```

## 📁 Estrutura Básica

### Features (BDD)
Localizadas em `cypress/e2e/features/`
- `login.feature` - Testes de autenticação
- `products.feature` - Testes de CRUD de produtos

### Step Definitions
Localizadas em `cypress/e2e/step_definitions/`
- `loginSteps.js` - Implementação dos steps de login
- `productsSteps.js` - Implementação dos steps de produtos

### Page Objects
Localizadas em `cypress/support/page-objects/`
- `BasePage.js` - Classe base com métodos comuns
- `LoginPage.js` - Página de login
- `HomePage.js` - Página inicial
- `ProductsPage.js` - Listagem de produtos
- `ProductFormPage.js` - Formulário de produtos

## 🔧 Criando Novos Testes

### 1. Criar Feature File
```gherkin
# cypress/e2e/features/nova-funcionalidade.feature
# language: pt
Funcionalidade: Nome da Funcionalidade
  Como um usuário
  Eu quero fazer algo
  Para alcançar um objetivo

  @tag
  Cenário: Descrição do cenário
    Dado uma pré-condição
    Quando eu faço uma ação
    Então eu vejo um resultado
```

### 2. Criar Step Definitions
```javascript
// cypress/e2e/step_definitions/novaFuncionalidadeSteps.js
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('uma pré-condição', () => {
  // Implementação
});

When('eu faço uma ação', () => {
  // Implementação
});

Then('eu vejo um resultado', () => {
  // Implementação
});
```

### 3. Criar Page Object (se necessário)
```javascript
// cypress/support/page-objects/NovaPage.js
import BasePage from './BasePage';

class NovaPage extends BasePage {
  selectors = {
    elemento: '[data-testid="elemento"]'
  };

  metodoDeAcao() {
    this.click(this.selectors.elemento);
  }
}

export default new NovaPage();
```

## 🏷️ Tags Disponíveis

Use tags para organizar e executar testes específicos:
- `@smoke` - Testes críticos de funcionalidade básica
- `@regression` - Suite completa de regressão
- `@login` - Testes de autenticação
- `@products` - Testes de produtos
- `@crud` - Testes de operações CRUD
- `@negative` - Testes de casos negativos
- `@search` - Testes de busca
- `@filter` - Testes de filtros

Executar por tag:
```powershell
npm run test:tags "@smoke"
npm run test:tags "@products and @crud"
```

## 🎨 Boas Práticas

### Features
✅ Escreva em linguagem de negócio
✅ Foque no comportamento, não na implementação
✅ Use exemplos concretos
❌ Evite detalhes técnicos

### Steps
✅ Mantenha steps simples e reutilizáveis
✅ Use Page Objects para interações
✅ Um step = uma ação ou verificação
❌ Evite lógica complexa nos steps

### Page Objects
✅ Centralize seletores
✅ Crie métodos descritivos
✅ Separe ações de validações
✅ Herde de BasePage
❌ Evite lógica de negócio

## 🐛 Troubleshooting

### Erro: Cypress não encontra elementos
- Verifique se os seletores estão corretos
- Adicione waits se necessário: `cy.wait(1000)`
- Use `cy.get(selector, {timeout: 10000})`

### Erro: Módulo não encontrado
```powershell
npm install
```

### Erro: Porta em uso
- Verifique se frontend/backend estão rodando
- Ajuste as portas em `cypress.config.js`

### Testes falhando intermitentemente
- Adicione waits apropriados
- Use `cy.intercept()` para controlar requests
- Verifique timeouts no config

## 📊 Relatórios

Após executar os testes, os relatórios ficam em:
- HTML: `cypress/reports/cucumber-html/index.html`
- JSON: `cypress/reports/cucumber-json/`
- Screenshots: `cypress/screenshots/`
- Vídeos: `cypress/videos/`

## 🔗 Links Úteis

- [Cypress Docs](https://docs.cypress.io/)
- [Cucumber Syntax](https://cucumber.io/docs/gherkin/)
- [Page Object Pattern](https://martinfowler.com/bliki/PageObject.html)

## 💡 Dicas

1. **Desenvolvimento**: Use `npm run open` para ver testes em tempo real
2. **Debug**: Adicione `cy.pause()` para pausar execução
3. **Seletores**: Prefira `data-testid` a classes CSS
4. **Organização**: Um arquivo de feature por funcionalidade
5. **Commits**: Execute `npm run test:smoke` antes de commitar

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação no README.md
2. Consulte os exemplos existentes
3. Revise os logs de erro do Cypress
