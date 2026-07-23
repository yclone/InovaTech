# 🎯 Guia de Treinamento: Seletores no Cypress

## Fase 1: O Laboratório de Seletores (20 min)

### 📋 Objetivo
Entender na prática como localizar elementos difíceis usando diferentes estratégias de seletores no Cypress.

### 🌐 Página Alvo
**URL:** http://localhost:5173/register

Esta é a página de cadastro de usuário da aplicação InovaTech, que contém:
- 4 campos de texto (Primeiro Nome, Último Nome, E-mail, Cidade)
- 1 campo de senha
- 1 campo select (Estado)
- 1 botão de submit
- 1 link para login

---

## 🔍 Estrutura da Página de Registro

```html
<form id="register-form">
  <input type="text" id="primeiroNome" name="primeiroNome" required>
  <input type="text" id="ultimoNome" name="ultimoNome" required>
  <input type="email" id="usuario" name="usuario" required>
  <input type="password" id="senha" name="senha" required>
  <input type="text" id="cidade" name="cidade" required>
  <select id="estado" name="estado" required>
    <option value="">Selecione o estado</option>
    <option value="SP">São Paulo</option>
    <!-- ... outros estados -->
  </select>
  <button type="submit" id="register-btn">Cadastrar</button>
</form>
```

---

## 📚 Teoria: 8 Formas de Localizar Elementos no Cypress

### 1. **Por ID** ⭐ (Mais Confiável)
```javascript
cy.get('#elemento')
```
✅ Único e específico  
✅ Performance excelente  
❌ Pode não estar disponível

### 2. **Por Atributo `name`**
```javascript
cy.get('[name="campo"]')
```
✅ Comum em formulários  
✅ Fácil de identificar  
❌ Pode não ser único

### 3. **Por Classe CSS**
```javascript
cy.get('.classe')
cy.get('.classe1.classe2') // múltiplas classes
```
❌ Pode mudar com estilização  
❌ Geralmente não é único  
✅ Útil para elementos visuais

### 4. **Por Tipo de Input**
```javascript
cy.get('input[type="email"]')
cy.get('input[type="password"]')
```
✅ Semântico e claro  
❌ Pode ter múltiplos do mesmo tipo

### 5. **Por Texto Visível** (Label)
```javascript
cy.contains('Texto do elemento')
cy.contains('label', 'Nome do Campo')
```
✅ Próximo à visão do usuário  
❌ Pode mudar com internacionalização  
✅ Ótimo para validações

### 6. **Por Relacionamento (Parent/Child)**
```javascript
cy.get('form').find('input')
cy.get('label').siblings('input')
cy.contains('Primeiro Nome').parent().find('input')
```
✅ Navegação contextual  
✅ Útil quando IDs não existem  
❌ Pode quebrar com mudanças estruturais

### 7. **Por data-testid** ⭐⭐⭐ (Melhor Prática)
```javascript
cy.get('[data-testid="campo-nome"]')
```
✅ **IDEAL para testes**  
✅ Não afeta produção  
✅ Independente de estilização  
❌ Requer adicionar no HTML

### 8. **Por Atributos Combinados**
```javascript
cy.get('input[type="text"][name="primeiroNome"]')
cy.get('form#register-form input[type="email"]')
```
✅ Mais específico  
✅ Reduz ambiguidade  
❌ Seletor mais complexo

---

## 🎯 DESAFIO PRÁTICO: Automatizar o Cadastro

### 📝 Instruções para o Treinamento

**Cenário:** Você precisa criar uma automação que preencha o formulário de cadastro da página http://localhost:5173/register usando **diferentes estratégias de seletores** para cada campo.

**Regras:**
1. Cada campo DEVE usar uma estratégia diferente de seletor
2. Documente QUAL estratégia usou e POR QUÊ
3. Execute o teste e verifique se funciona
4. Discuta com o time qual foi a melhor/pior estratégia

---

## 🧪 Template do Teste

Crie o arquivo: `cypress/e2e/features/treinamento-seletores.feature`

```gherkin
# language: pt
Funcionalidade: Treinamento de Seletores
  Como um QA em treinamento
  Eu quero praticar diferentes formas de localizar elementos
  Para dominar o uso de seletores no Cypress

  @treinamento @seletores
  Cenário: Preencher formulário usando diferentes seletores
    Dado que estou na página de cadastro
    Quando eu preencho o primeiro nome usando ID
    E eu preencho o último nome usando atributo name
    E eu preencho o email usando tipo de input
    E eu preencho a senha usando relacionamento com label
    E eu preencho a cidade usando contains
    E eu seleciono o estado usando select com value
    E eu clico no botão de cadastrar
    Então o cadastro deve ser processado
```

---

## 💡 Solução Comentada (Não Mostre Antes do Exercício!)

<details>
<summary>Clique para ver a solução</summary>

Crie: `cypress/support/step_definitions/treinamentoSeletoresSteps.js`

```javascript
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// CONTEXTO
Given('que estou na página de cadastro', () => {
  cy.visit('/register');
  cy.url().should('include', '/register');
  cy.contains('h1', 'Cadastro').should('be.visible');
});

// AÇÕES - Cada uma usa uma estratégia diferente!

When('eu preencho o primeiro nome usando ID', () => {
  // ✅ Estratégia 1: Por ID
  // Por quê? É único, rápido e confiável
  cy.get('#primeiroNome').clear().type('João');
});

When('eu preencho o último nome usando atributo name', () => {
  // ✅ Estratégia 2: Por atributo name
  // Por quê? Comum em formulários e semântico
  cy.get('[name="ultimoNome"]').clear().type('Silva');
});

When('eu preencho o email usando tipo de input', () => {
  // ✅ Estratégia 3: Por tipo de input
  // Por quê? Semântico e garante que é um campo de email
  cy.get('input[type="email"]').clear().type('joao.silva@example.com');
});

When('eu preencho a senha usando relacionamento com label', () => {
  // ✅ Estratégia 4: Por relacionamento (Label → Input)
  // Por quê? Útil quando não há ID/name, simula comportamento do usuário
  cy.contains('label', 'Senha')
    .parent('.form-group')
    .find('input[type="password"]')
    .clear()
    .type('Senha@123');
});

When('eu preencho a cidade usando contains', () => {
  // ✅ Estratégia 5: Por texto visível
  // Por quê? Próximo à experiência do usuário
  cy.contains('Cidade')
    .parent()
    .find('input')
    .clear()
    .type('São Paulo');
});

When('eu seleciono o estado usando select com value', () => {
  // ✅ Estratégia 6: Select por ID + value
  // Por quê? Específico para dropdowns
  cy.get('#estado').select('SP');
  
  // Alternativa usando name:
  // cy.get('select[name="estado"]').select('SP');
});

When('eu clico no botão de cadastrar', () => {
  // ✅ Estratégia 7: Por ID do botão
  // Por quê? É o elemento de ação principal
  cy.get('#register-btn').click();
  
  // Alternativas que também funcionam:
  // cy.get('button[type="submit"]').click();
  // cy.contains('button', 'Cadastrar').click();
});

// VALIDAÇÕES
Then('o cadastro deve ser processado', () => {
  // Aguarda o processamento (loading)
  cy.get('#register-btn').should('be.disabled');
  cy.contains('Cadastrando...').should('be.visible');
  
  // Aguarda redirecionamento ou mensagem de sucesso
  cy.url().should('not.include', '/register', { timeout: 10000 });
  
  // OU verifica mensagem de sucesso se existir
  // cy.contains('Cadastro realizado com sucesso').should('be.visible');
});
```

</details>

---

## 🎓 Atividade em Grupo (15 min)

### Parte 1: Implementação Individual (8 min)
1. Cada pessoa implementa os steps usando as estratégias sugeridas
2. Execute o teste: `npm run open` ou `npm test`
3. Anote qual seletor deu mais trabalho

### Parte 2: Discussão em Grupo (7 min)
Discuta com o time:

**Perguntas para reflexão:**
1. Qual seletor foi mais fácil de escrever?
2. Qual seletor é mais frágil (pode quebrar facilmente)?
3. Se você fosse refatorar o HTML, qual atributo adicionaria?
4. Por que `data-testid` é considerado melhor prática?

---

## 🏆 Desafio Extra: Melhorando a Aplicação

### Missão: Adicionar data-testid aos elementos

**Antes:**
```html
<input type="text" id="primeiroNome" name="primeiroNome" required>
```

**Depois:**
```html
<input 
  type="text" 
  id="primeiroNome" 
  name="primeiroNome" 
  data-testid="input-primeiro-nome"
  required
>
```

### Tarefa:
1. Identifique no código (`FrontEnd/src/main.js` linha ~158) onde está o HTML
2. Adicione `data-testid` em todos os inputs e no botão
3. Reescreva os steps usando apenas `data-testid`
4. Compare: qual versão ficou mais limpa?

**Exemplo com data-testid:**
```javascript
When('eu preencho o primeiro nome', () => {
  cy.get('[data-testid="input-primeiro-nome"]').type('João');
});

When('eu preencho o email', () => {
  cy.get('[data-testid="input-email"]').type('joao@example.com');
});
```

---

## 📊 Comparativo de Estratégias

| Estratégia | Confiabilidade | Manutenibilidade | Performance | Recomendado? |
|------------|----------------|------------------|-------------|--------------|
| ID | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Sim |
| name | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ Sim |
| class | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ❌ Não |
| type | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⚠️ Ocasional |
| contains | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⚠️ Validações |
| relacionamento | ⭐⭐ | ⭐⭐ | ⭐⭐ | ⚠️ Último recurso |
| **data-testid** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅✅✅ **IDEAL** |
| atributos combinados | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ✅ Sim |

---

## 🎯 Checklist de Boas Práticas

Após o exercício, verifique se vocês:

- [ ] Usaram pelo menos 5 estratégias diferentes
- [ ] Documentaram o motivo de cada escolha
- [ ] Executaram o teste com sucesso
- [ ] Identificaram seletores frágeis
- [ ] Discutiram alternativas com o time
- [ ] Entenderam quando usar cada estratégia
- [ ] Conhecem a importância do `data-testid`

---

## 🔗 Comandos Úteis do Cypress

```javascript
// Encontrar elemento
cy.get(selector)

// Limpar e digitar
cy.get(selector).clear().type('texto')

// Selecionar dropdown
cy.get('select').select('valor')

// Clicar
cy.get(selector).click()

// Verificar visibilidade
cy.get(selector).should('be.visible')

// Verificar URL
cy.url().should('include', '/caminho')

// Aguardar elemento
cy.get(selector, { timeout: 10000 })

// Navegar pela árvore DOM
cy.get(selector).parent()
cy.get(selector).find('child')
cy.get(selector).siblings()

// Múltiplas asserções
cy.get(selector)
  .should('be.visible')
  .and('contain', 'texto')
```

---

## 📚 Recursos Adicionais

- [Cypress Best Practices - Selecting Elements](https://docs.cypress.io/guides/references/best-practices#Selecting-Elements)
- [Cypress Selectors Playground](https://docs.cypress.io/guides/core-concepts/cypress-app#Selector-Playground)
- [CSS Selectors Reference](https://www.w3schools.com/cssref/css_selectors.asp)

---

## 🎉 Próximos Passos

Após dominar os seletores, você estará pronto para:
- Fase 2: Page Objects avançados
- Fase 3: Comandos customizados
- Fase 4: Testes E2E completos
- Fase 5: Cucumber e BDD

**Boa sorte no treinamento! 🚀**
