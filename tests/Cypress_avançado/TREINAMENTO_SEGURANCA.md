# 🔐 Guia de Treinamento: Segurança de Dados no Cypress

## Fase 2: Configuração de Segurança (Environment) (10 min)

### 📋 Objetivo
Tirar dados sensíveis do código e gerenciar credenciais de forma segura usando variáveis de ambiente.

### 🌐 Página Alvo
**URL:** http://localhost:5173/login

Esta é a página de login da aplicação InovaTech, que contém:
- 1 campo de e-mail (usuario)
- 1 campo de senha
- 1 botão de login

---

## ⚠️ O Problema: Credenciais no Código

### ❌ Código INSEGURO (Não faça isso!)

```javascript
// ❌ MAL - Credenciais hardcoded no código
When('eu faço login como administrador', () => {
  cy.get('#usuario').type('admin@inovatech.com');
  cy.get('#senha').type('Admin@123');
  cy.get('#login-btn').click();
});

// ❌ MAL - Dados sensíveis expostos
Given('que estou logado', () => {
  cy.visit('/login');
  cy.get('#usuario').type('joao.silva@example.com');
  cy.get('#senha').type('MinhaS3nh@Super$ecreta');
  cy.get('#login-btn').click();
});
```

### 🚨 Riscos:
- ❌ Senhas visíveis no código-fonte
- ❌ Credenciais commitadas no Git
- ❌ Exposição em logs e screenshots
- ❌ Dificuldade de mudança entre ambientes
- ❌ Violação de políticas de segurança

---

## ✅ A Solução: Variáveis de Ambiente

### 📁 Estrutura de Arquivos

```
cypress-avancado/
├── cypress.config.js
├── cypress.env.json          ⭐ NOVO - Dados sensíveis
├── cypress.env.example.json  ⭐ NOVO - Template (sem dados reais)
├── .gitignore                ⭐ Atualizar
└── cypress/
    └── support/
        └── step_definitions/
```

---

## 🔧 Passo 1: Criar cypress.env.json

Crie o arquivo na raiz do projeto: `cypress.env.json`

```json
{
  "users": {
    "admin": {
      "email": "admin@inovatech.com",
      "password": "Admin@123"
    },
    "user": {
      "email": "user@inovatech.com",
      "password": "User@123"
    },
    "qa_tester": {
      "email": "qa.tester@inovatech.com",
      "password": "QA@Test2024"
    }
  },
  "api": {
    "baseUrl": "http://localhost:5000",
    "timeout": 10000
  },
  "frontend": {
    "baseUrl": "http://localhost:5173"
  }
}
```

### 📝 Explicação:
- **users**: Diferentes perfis de usuário para testes
- **admin**: Usuário com privilégios administrativos
- **user**: Usuário comum
- **qa_tester**: Usuário específico para testes

---

## 🔧 Passo 2: Criar cypress.env.example.json (Template)

Crie o arquivo: `cypress.env.example.json` (Este SIM vai para o Git!)

```json
{
  "users": {
    "admin": {
      "email": "seu-email-admin@example.com",
      "password": "sua-senha-segura"
    },
    "user": {
      "email": "seu-email-user@example.com",
      "password": "sua-senha-segura"
    },
    "qa_tester": {
      "email": "qa@example.com",
      "password": "senha-qa"
    }
  },
  "api": {
    "baseUrl": "http://localhost:5000",
    "timeout": 10000
  },
  "frontend": {
    "baseUrl": "http://localhost:5173"
  }
}
```

---

## 🔧 Passo 3: Atualizar .gitignore

Adicione ao `.gitignore`:

```gitignore
# Ignorar dados sensíveis
cypress.env.json

# Ignorar screenshots e vídeos (podem conter dados sensíveis)
cypress/screenshots/
cypress/videos/

# Ignorar relatórios
cypress/reports/
```

---

## 🔍 Estrutura da Página de Login

```html
<form id="login-form">
  <div class="form-group">
    <label for="usuario">E-mail</label>
    <input type="email" id="usuario" name="usuario" required>
  </div>
  
  <div class="form-group">
    <label for="senha">Senha</label>
    <input type="password" id="senha" name="senha" required>
  </div>
  
  <button type="submit" class="btn btn-primary" id="login-btn">
    Entrar
  </button>
</form>
```

---

## 📚 Como Usar Variáveis de Ambiente

### Sintaxe Básica:
```javascript
// Acessar variável
Cypress.env('nomeDaVariavel')

// Acessar objeto aninhado
Cypress.env('users').admin.email
Cypress.env('users').admin.password

// Verificar se existe
if (Cypress.env('users')) {
  // ...
}
```

### ✅ Código SEGURO (Faça assim!)

```javascript
When('eu faço login como administrador', () => {
  const admin = Cypress.env('users').admin;
  
  cy.get('#usuario').type(admin.email);
  cy.get('#senha').type(admin.password);
  cy.get('#login-btn').click();
});

When('eu faço login como usuário comum', () => {
  const user = Cypress.env('users').user;
  
  cy.get('#usuario').type(user.email);
  cy.get('#senha').type(user.password);
  cy.get('#login-btn').click();
});
```

---

## 🎯 DESAFIO PRÁTICO: Refatorar Login com Segurança

### 📝 Instruções para o Treinamento

**Cenário:** Você precisa refatorar os testes de login para usar variáveis de ambiente ao invés de credenciais hardcoded.

**Regras:**
1. NENHUMA credencial pode ficar visível no código
2. Deve funcionar para diferentes perfis (admin, user, qa_tester)
3. Deve ser fácil adicionar novos usuários
4. O `cypress.env.json` NÃO pode ir para o Git

---

## 🧪 Template do Teste

Crie o arquivo: `cypress/e2e/features/treinamento-seguranca.feature`

```gherkin
# language: pt
Funcionalidade: Treinamento de Segurança
  Como um QA preocupado com segurança
  Eu quero usar variáveis de ambiente
  Para proteger dados sensíveis nos testes

  Contexto:
    Dado que estou na página de login

  @treinamento @seguranca @smoke
  Cenário: Login com administrador usando variáveis de ambiente
    Quando eu faço login como administrador
    Então devo ser redirecionado para a dashboard
    E devo ver o nome do usuário logado

  @treinamento @seguranca
  Cenário: Login com usuário comum usando variáveis de ambiente
    Quando eu faço login como usuário comum
    Então devo ser redirecionado para a dashboard

  @treinamento @seguranca
  Cenário: Login com usuário QA usando variáveis de ambiente
    Quando eu faço login como usuário QA
    Então devo ser redirecionado para a dashboard

  @treinamento @seguranca @negative
  Cenário: Tentar login com credenciais inválidas
    Quando eu tento fazer login com credenciais inválidas
    Então devo ver uma mensagem de erro
    E devo permanecer na página de login
```

---

## 💡 Solução Comentada (Não Mostre Antes do Exercício!)

<details>
<summary>Clique para ver a solução</summary>

### Arquivo: `cypress/support/step_definitions/treinamentoSegurancaSteps.js`

```javascript
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// ========================================
// CONTEXTO
// ========================================

Given('que estou na página de login', () => {
  // Usa variável de ambiente para a URL base
  const baseUrl = Cypress.env('frontend')?.baseUrl || 'http://localhost:5173';
  cy.visit(`${baseUrl}/login`);
  
  cy.url().should('include', '/login');
  cy.contains('h1', 'Login').should('be.visible');
});

// ========================================
// AÇÕES - Login com diferentes perfis
// ========================================

When('eu faço login como administrador', () => {
  // ✅ Busca credenciais do arquivo cypress.env.json
  const admin = Cypress.env('users').admin;
  
  // Validação de segurança: verifica se as credenciais existem
  if (!admin || !admin.email || !admin.password) {
    throw new Error('Credenciais do admin não encontradas no cypress.env.json');
  }
  
  cy.get('#usuario').clear().type(admin.email);
  cy.get('#senha').clear().type(admin.password);
  cy.get('#login-btn').click();
});

When('eu faço login como usuário comum', () => {
  // ✅ Busca credenciais do usuário comum
  const user = Cypress.env('users').user;
  
  if (!user || !user.email || !user.password) {
    throw new Error('Credenciais do usuário não encontradas no cypress.env.json');
  }
  
  cy.get('#usuario').clear().type(user.email);
  cy.get('#senha').clear().type(user.password);
  cy.get('#login-btn').click();
});

When('eu faço login como usuário QA', () => {
  // ✅ Busca credenciais do usuário QA
  const qaTester = Cypress.env('users').qa_tester;
  
  if (!qaTester || !qaTester.email || !qaTester.password) {
    throw new Error('Credenciais do QA não encontradas no cypress.env.json');
  }
  
  cy.get('#usuario').clear().type(qaTester.email);
  cy.get('#senha').clear().type(qaTester.password);
  cy.get('#login-btn').click();
});

When('eu tento fazer login com credenciais inválidas', () => {
  // ✅ Credenciais inválidas podem ser hardcoded (não são sensíveis)
  cy.get('#usuario').clear().type('usuario.invalido@test.com');
  cy.get('#senha').clear().type('senhaErrada123');
  cy.get('#login-btn').click();
});

// ========================================
// FUNÇÃO HELPER - Reutilizável
// ========================================

/**
 * Função genérica para login com qualquer perfil
 * @param {string} userType - Tipo de usuário (admin, user, qa_tester)
 */
function loginAsUser(userType) {
  const users = Cypress.env('users');
  
  if (!users || !users[userType]) {
    throw new Error(`Usuário '${userType}' não encontrado no cypress.env.json`);
  }
  
  const user = users[userType];
  
  cy.get('#usuario').clear().type(user.email);
  cy.get('#senha').clear().type(user.password);
  cy.get('#login-btn').click();
}

// Exemplo de uso da função helper:
// When('eu faço login como {string}', (userType) => {
//   loginAsUser(userType);
// });

// ========================================
// VALIDAÇÕES
// ========================================

Then('devo ser redirecionado para a dashboard', () => {
  // Aguarda redirecionamento
  cy.url().should('not.include', '/login', { timeout: 10000 });
  
  // Pode ser / ou /dashboard dependendo da aplicação
  cy.url().should('match', /\/(dashboard)?$/);
});

Then('devo ver o nome do usuário logado', () => {
  // Verifica se existe algum elemento indicando usuário logado
  // Adapte o seletor conforme sua aplicação
  cy.get('[data-testid="user-menu"]', { timeout: 10000 })
    .should('be.visible')
    .or('exist');
});

Then('devo ver uma mensagem de erro', () => {
  cy.get('.alert-error, .alert-danger, .error-message')
    .should('be.visible')
    .and('contain.text', /erro|inválid|falhou/i);
});

Then('devo permanecer na página de login', () => {
  cy.url().should('include', '/login');
  cy.contains('h1', 'Login').should('be.visible');
});
```

### Arquivo: `cypress/support/commands.js` (Adicionar comando customizado)

```javascript
/**
 * Comando customizado para login genérico
 * @example cy.loginAs('admin')
 * @example cy.loginAs('user')
 */
Cypress.Commands.add('loginAs', (userType) => {
  const users = Cypress.env('users');
  
  if (!users || !users[userType]) {
    throw new Error(`Usuário '${userType}' não encontrado no cypress.env.json`);
  }
  
  const user = users[userType];
  
  cy.visit('/login');
  cy.get('#usuario').clear().type(user.email);
  cy.get('#senha').clear().type(user.password, { log: false }); // { log: false } esconde a senha dos logs
  cy.get('#login-btn').click();
  
  // Aguarda redirecionamento indicando sucesso
  cy.url().should('not.include', '/login', { timeout: 10000 });
});

/**
 * Comando para login via API (mais rápido)
 * @example cy.loginViaAPI('admin')
 */
Cypress.Commands.add('loginViaAPI', (userType) => {
  const users = Cypress.env('users');
  const apiUrl = Cypress.env('api').baseUrl;
  
  if (!users || !users[userType]) {
    throw new Error(`Usuário '${userType}' não encontrado no cypress.env.json`);
  }
  
  const user = users[userType];
  
  cy.request({
    method: 'POST',
    url: `${apiUrl}/login`,
    body: {
      Usuario: user.email,
      Senha: user.password
    }
  }).then((response) => {
    // Salva token ou dados de sessão
    if (response.body.token) {
      window.localStorage.setItem('token', response.body.token);
    }
    if (response.body.user) {
      window.localStorage.setItem('user', JSON.stringify(response.body.user));
    }
  });
});

/**
 * ⭐ COMANDO COM cy.session() - MELHOR PERFORMANCE! ⭐
 * Mantém a sessão entre testes, evitando logins repetidos
 * @example cy.loginWithSession('admin')
 * @example cy.loginWithSession('user')
 */
Cypress.Commands.add('loginWithSession', (userType) => {
  const users = Cypress.env('users');
  
  if (!users || !users[userType]) {
    throw new Error(`Usuário '${userType}' não encontrado no cypress.env.json`);
  }
  
  const user = users[userType];
  
  // cy.session cria e restaura sessões automaticamente
  cy.session(
    // ID único da sessão (baseado no tipo de usuário)
    `user-session-${userType}`,
    
    // Função que executa o login (executada apenas uma vez)
    () => {
      cy.visit('/login');
      cy.get('#usuario').clear().type(user.email);
      cy.get('#senha').clear().type(user.password, { log: false });
      cy.get('#login-btn').click();
      
      // Aguarda o login ser concluído
      cy.url().should('not.include', '/login', { timeout: 10000 });
    },
    
    // Opções de validação e configuração
    {
      // Valida se a sessão ainda é válida
      validate() {
        // Verifica se o usuário está autenticado
        cy.window().then((win) => {
          const user = win.localStorage.getItem('user');
          const token = win.localStorage.getItem('token');
          
          if (!user && !token) {
            throw new Error('Sessão inválida - usuário não encontrado');
          }
        });
      },
      
      // Cache da sessão (acelera ainda mais)
      cacheAcrossSpecs: true
    }
  );
});

/**
 * ⭐ COMANDO COM cy.session() + API - SUPER RÁPIDO! ⭐
 * Usa API para login e mantém sessão
 * @example cy.loginWithSessionAPI('admin')
 */
Cypress.Commands.add('loginWithSessionAPI', (userType) => {
  const users = Cypress.env('users');
  const apiUrl = Cypress.env('api').baseUrl;
  
  if (!users || !users[userType]) {
    throw new Error(`Usuário '${userType}' não encontrado no cypress.env.json`);
  }
  
  const user = users[userType];
  
  cy.session(
    `api-user-session-${userType}`,
    () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/login`,
        body: {
          Usuario: user.email,
          Senha: user.password
        }
      }).then((response) => {
        // Salva os dados no localStorage
        if (response.body.token) {
          window.localStorage.setItem('token', response.body.token);
        }
        if (response.body.Cliente) {
          window.localStorage.setItem('user', JSON.stringify(response.body.Cliente));
        }
      });
    },
    {
      validate() {
        cy.window().then((win) => {
          const token = win.localStorage.getItem('token');
          if (!token) {
            throw new Error('Token não encontrado - sessão inválida');
          }
        });
      },
      cacheAcrossSpecs: true
    }
  );
});
```

</details>

---

## 🚀 Otimização: cy.session() para Cache de Login

### ⚡ O Problema da Performance

Fazer login em **CADA teste** é lento e desnecessário:

```javascript
// ❌ LENTO - Login em cada teste (5-10 segundos por teste)
describe('Testes de Produtos', () => {
  beforeEach(() => {
    cy.loginAs('admin'); // Login completo: visita página, preenche, envia
  });
  
  it('Teste 1', () => { /* ... */ }); // +8s de login
  it('Teste 2', () => { /* ... */ }); // +8s de login
  it('Teste 3', () => { /* ... */ }); // +8s de login
  // Total: 24 segundos APENAS de login!
});
```

### ✅ A Solução: cy.session()

O `cy.session()` **guarda a sessão** e **reutiliza** entre testes:

```javascript
// ✅ RÁPIDO - Login uma vez, reutiliza em todos os testes
describe('Testes de Produtos', () => {
  beforeEach(() => {
    cy.loginWithSession('admin'); // Login apenas 1x, depois usa cache
  });
  
  it('Teste 1', () => { /* ... */ }); // 8s (primeiro login)
  it('Teste 2', () => { /* ... */ }); // 0.5s (usa cache)
  it('Teste 3', () => { /* ... */ }); // 0.5s (usa cache)
  // Total: 9 segundos - ECONOMIZOU 15 SEGUNDOS! ⚡
});
```

---

### 📚 Como Funciona o cy.session()

```javascript
cy.session(
  sessionId,      // 1. ID único da sessão
  setupFunction,  // 2. Função que cria a sessão (login)
  options         // 3. Opções de validação e cache
);
```

#### Fluxo de Execução:

1. **Primeira execução:**
   - Cypress executa `setupFunction()` (faz login)
   - Salva cookies, localStorage, sessionStorage
   - Cria snapshot da sessão

2. **Execuções seguintes:**
   - Cypress verifica se tem sessão com esse `sessionId`
   - Restaura cookies e storage automaticamente
   - Pula o login! ⚡

3. **Validação:**
   - Antes de usar a sessão, executa `validate()`
   - Se falhar, refaz o login

---

### 🔧 Implementação Completa do cy.session()

Adicione ao `cypress/support/commands.js`:

```javascript
/**
 * Login com cy.session() - Mantém sessão entre testes
 * @param {string} userType - Tipo de usuário (admin, user, qa_tester)
 * @example cy.loginWithSession('admin')
 */
Cypress.Commands.add('loginWithSession', (userType) => {
  const users = Cypress.env('users');
  
  if (!users || !users[userType]) {
    throw new Error(`Usuário '${userType}' não encontrado no cypress.env.json`);
  }
  
  const user = users[userType];
  
  cy.session(
    // 1️⃣ ID único da sessão
    `user-session-${userType}`,
    
    // 2️⃣ Função de setup (executada apenas 1x)
    () => {
      cy.log(`🔐 Fazendo login como: ${userType}`);
      
      cy.visit('/login');
      cy.get('#usuario').clear().type(user.email);
      cy.get('#senha').clear().type(user.password, { log: false });
      cy.get('#login-btn').click();
      
      // Aguarda o login completar
      cy.url().should('not.include', '/login', { timeout: 10000 });
      
      cy.log(`✅ Login bem-sucedido como: ${userType}`);
    },
    
    // 3️⃣ Opções
    {
      // Valida se a sessão ainda é válida antes de reutilizar
      validate() {
        cy.log(`🔍 Validando sessão de: ${userType}`);
        
        cy.window().then((win) => {
          const userData = win.localStorage.getItem('user');
          const token = win.localStorage.getItem('token');
          
          if (!userData && !token) {
            cy.log(`❌ Sessão inválida - refazendo login`);
            throw new Error('Sessão inválida');
          }
          
          cy.log(`✅ Sessão válida para: ${userType}`);
        });
      },
      
      // Cache entre arquivos .spec (super rápido!)
      cacheAcrossSpecs: true
    }
  );
  
  // Opcional: Visita a página inicial após restaurar sessão
  cy.visit('/');
});
```

---

### 🎯 Comparação de Performance

| Método | 1 Teste | 10 Testes | 100 Testes | Uso |
|--------|---------|-----------|------------|-----|
| `cy.loginAs()` | 8s | 80s | 800s (13min) | ❌ Lento |
| `cy.loginViaAPI()` | 2s | 20s | 200s (3min) | ⚠️ Médio |
| `cy.loginWithSession()` | 8s | 10s | 20s | ✅ **Rápido** |
| `cy.loginWithSessionAPI()` | 2s | 3s | 5s | ✅✅✅ **SUPER RÁPIDO** |

---

### 📖 Exemplos de Uso

#### Exemplo 1: Uso Básico no beforeEach

```javascript
describe('Testes de Dashboard', () => {
  beforeEach(() => {
    // Restaura sessão (ou faz login se não existir)
    cy.loginWithSession('admin');
  });

  it('deve mostrar estatísticas', () => {
    cy.visit('/dashboard');
    cy.get('[data-testid="stats"]').should('be.visible');
  });

  it('deve mostrar gráficos', () => {
    cy.visit('/dashboard');
    cy.get('[data-testid="charts"]').should('be.visible');
  });
});
```

#### Exemplo 2: Diferentes Usuários no Mesmo Arquivo

```javascript
describe('Testes Multi-usuário', () => {
  it('admin pode ver relatórios', () => {
    cy.loginWithSession('admin');
    cy.visit('/relatorios');
    cy.contains('Relatórios Administrativos').should('be.visible');
  });

  it('usuário comum NÃO pode ver relatórios', () => {
    cy.loginWithSession('user'); // Troca de sessão automaticamente
    cy.visit('/relatorios');
    cy.contains('Acesso negado').should('be.visible');
  });
});
```

#### Exemplo 3: Uso nos Step Definitions

```javascript
import { Given } from '@badeball/cypress-cucumber-preprocessor';

Given('que estou logado como {string}', (userType) => {
  cy.loginWithSession(userType);
  cy.visit('/');
});

// Feature:
// Dado que estou logado como "admin"
// Dado que estou logado como "user"
```

---

### 🧪 Testando a Sessão

Crie um teste para verificar o cache:

```javascript
describe('Teste de Performance - cy.session()', () => {
  it('primeiro login (deve ser lento)', () => {
    const start = Date.now();
    
    cy.loginWithSession('admin').then(() => {
      const duration = Date.now() - start;
      cy.log(`⏱️ Tempo do primeiro login: ${duration}ms`);
      expect(duration).to.be.greaterThan(3000); // Deve demorar
    });
  });

  it('segundo login (deve ser RÁPIDO)', () => {
    const start = Date.now();
    
    cy.loginWithSession('admin').then(() => {
      const duration = Date.now() - start;
      cy.log(`⚡ Tempo do login com cache: ${duration}ms`);
      expect(duration).to.be.lessThan(1000); // Deve ser rápido!
    });
  });
});
```

---

### 🔍 Debug e Troubleshooting

#### Ver sessões ativas:

```javascript
// No teste
cy.session('user-session-admin').then((session) => {
  console.log('Sessão:', session);
});
```

#### Limpar sessão específica:

```javascript
// Força novo login
cy.session('user-session-admin', null, { cacheAcrossSpecs: false });
```

#### Limpar TODAS as sessões:

```javascript
beforeEach(() => {
  // Limpa todas as sessões antes do teste
  Cypress.session.clearAllSavedSessions();
  
  cy.loginWithSession('admin'); // Vai fazer login do zero
});
```

---

### ⚠️ Quando NÃO usar cy.session()

❌ **NÃO use** quando:
- Testar o próprio fluxo de login
- Testar expiração de sessão
- Testar logout
- Cada teste precisa de estado "limpo"

```javascript
// ❌ NÃO use cy.session() para testar login
describe('Testes de Login', () => {
  it('deve fazer login com sucesso', () => {
    // Use login normal aqui
    cy.visit('/login');
    cy.get('#usuario').type('admin@test.com');
    cy.get('#senha').type('senha123');
    cy.get('#login-btn').click();
  });
});
```

---

### 📊 Ganhos de Performance Reais

**Exemplo de suite com 50 testes:**

| Método | Tempo Total | Economia |
|--------|-------------|----------|
| Sem cache | 400s (6min 40s) | - |
| Com cy.session() | 45s | **88% mais rápido!** ⚡ |
| Com cy.session() + API | 15s | **96% mais rápido!** 🚀 |

---

### 🎯 Boas Práticas com cy.session()

✅ **FAÇA:**
- ✅ Use em `beforeEach()` para testes que precisam de login
- ✅ Use IDs únicos por tipo de usuário
- ✅ Implemente validação robusta
- ✅ Use `cacheAcrossSpecs: true` para melhor performance
- ✅ Combine com login via API para máxima velocidade
- ✅ Adicione logs para debug

❌ **NÃO FAÇA:**
- ❌ Usar para testar o próprio login
- ❌ Compartilhar sessão entre tipos de usuário diferentes
- ❌ Esquecer de validar a sessão
- ❌ Usar em testes de logout/expiração

---

## 🎓 Atividade Prática: Otimização com cy.session()

### Desafio: Refatore seus testes para usar cy.session()

**Tarefa:**
1. Adicione os comandos `loginWithSession` e `loginWithSessionAPI` ao `commands.js`
2. Refatore os steps de login para usar `cy.loginWithSession()`
3. Execute a suite completa e compare os tempos
4. Adicione um teste para verificar o cache funcionando

**Medição de Performance:**

```javascript
// cypress/e2e/features/performance-test.feature
Funcionalidade: Teste de Performance com cy.session()
  
  @performance
  Cenário: Medir tempo de login com cache
    Dado que limpo todas as sessões
    Quando eu faço login pela primeira vez como "admin"
    Então o tempo deve ser maior que 3 segundos
    
    Quando eu faço login pela segunda vez como "admin"
    Então o tempo deve ser menor que 1 segundo
```

---

## 🎓 Atividade em Grupo (10 min)

### Parte 1: Configuração (3 min)
1. Crie o arquivo `cypress.env.json` com suas credenciais de teste
2. Crie o arquivo `cypress.env.example.json` (template)
3. Adicione `cypress.env.json` ao `.gitignore`
4. Verifique que o arquivo NÃO aparece no Git

### Parte 2: Implementação (5 min)
1. Implemente os steps usando `Cypress.env()`
2. Teste com diferentes perfis de usuário
3. Execute: `npm run open` ou `npm test`

### Parte 3: Discussão em Grupo (2 min)

**Perguntas para reflexão:**
1. Por que não podemos commitar `cypress.env.json`?
2. Como um novo membro do time obtém as credenciais?
3. Como funciona em diferentes ambientes (dev, staging, prod)?
4. O que fazer se as senhas mudarem?

---

## 🏆 Desafio Extra: Múltiplos Ambientes

### Missão: Configurar diferentes ambientes

Crie arquivos específicos por ambiente:

```
cypress.env.json           # Desenvolvimento (local)
cypress.env.staging.json   # Staging
cypress.env.prod.json      # Produção
```

**cypress.env.staging.json:**
```json
{
  "users": {
    "admin": {
      "email": "admin@staging.inovatech.com",
      "password": "StagingAdmin@123"
    }
  },
  "api": {
    "baseUrl": "https://api-staging.inovatech.com"
  },
  "frontend": {
    "baseUrl": "https://staging.inovatech.com"
  }
}
```

**Executar em ambientes específicos:**
```bash
# Desenvolvimento (padrão)
npm test

# Staging
npx cypress run --env configFile=staging

# Produção
npx cypress run --env configFile=prod
```

---

## 📊 Comparativo: Antes vs Depois

| Aspecto | ❌ Antes (Hardcoded) | ✅ Depois (Env) |
|---------|---------------------|----------------|
| **Segurança** | Senhas no código | Senhas em arquivo separado |
| **Git** | Credenciais expostas | Arquivo ignorado |
| **Manutenção** | Mudar em vários lugares | Mudar em um só lugar |
| **Ambientes** | Difícil trocar | Fácil configurar |
| **Logs** | Senhas aparecem | Pode ocultar com `{ log: false }` |
| **Onboarding** | Enviar senhas por chat | Compartilhar template |

---

## 🛡️ Boas Práticas de Segurança

### ✅ FAÇA:
- ✅ Use `cypress.env.json` para dados sensíveis
- ✅ Adicione ao `.gitignore`
- ✅ Crie template `.example.json`
- ✅ Use `{ log: false }` ao digitar senhas
- ✅ Valide se as variáveis existem antes de usar
- ✅ Documente como obter credenciais
- ✅ Rotacione senhas regularmente
- ✅ Use senhas diferentes por ambiente

### ❌ NÃO FAÇA:
- ❌ Commitar `cypress.env.json`
- ❌ Compartilhar senhas de produção
- ❌ Usar senhas reais em exemplos
- ❌ Logar senhas no console
- ❌ Usar mesma senha em todos ambientes
- ❌ Ignorar validação de variáveis
- ❌ Hardcodar credenciais "só por enquanto"

---

## 🔍 Validação de Variáveis de Ambiente

### Função Helper para Validação:

```javascript
// cypress/support/e2e.js

/**
 * Valida se todas as variáveis de ambiente necessárias existem
 */
function validateEnvironmentVariables() {
  const requiredVars = [
    'users.admin.email',
    'users.admin.password',
    'users.user.email',
    'users.user.password',
    'api.baseUrl',
    'frontend.baseUrl'
  ];

  const missing = [];

  requiredVars.forEach(varPath => {
    const parts = varPath.split('.');
    let value = Cypress.env(parts[0]);
    
    for (let i = 1; i < parts.length; i++) {
      value = value?.[parts[i]];
    }
    
    if (!value) {
      missing.push(varPath);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente faltando no cypress.env.json:\n` +
      `- ${missing.join('\n- ')}\n\n` +
      `Por favor, copie cypress.env.example.json para cypress.env.json ` +
      `e preencha com as credenciais corretas.`
    );
  }
}

// Executa validação antes de todos os testes
before(() => {
  validateEnvironmentVariables();
});
```

---

## 🎯 Checklist de Segurança

Após o exercício, verifique se você:

- [ ] Criou `cypress.env.json` com credenciais
- [ ] Criou `cypress.env.example.json` (template)
- [ ] Adicionou `cypress.env.json` ao `.gitignore`
- [ ] Verificou que o arquivo não está no Git
- [ ] Usou `Cypress.env()` em todos os steps
- [ ] Validou se as variáveis existem
- [ ] Testou com diferentes perfis
- [ ] Usou `{ log: false }` nas senhas
- [ ] Documentou como obter credenciais
- [ ] Entendeu os riscos de hardcoding

---

## 📚 Recursos Adicionais

- [Cypress Environment Variables](https://docs.cypress.io/guides/guides/environment-variables)
- [Cypress Configuration](https://docs.cypress.io/guides/references/configuration)
- [Security Best Practices](https://docs.cypress.io/guides/references/best-practices#Organizing-Tests-Logging-In-Controlling-State)

---

## 🎉 Próximos Passos

Agora que você domina seletores, segurança e otimização com cy.session(), está pronto para:
- Fase 3: Page Objects avançados com dados seguros
- Fase 4: Comandos customizados reutilizáveis
- Fase 5: Integração com CI/CD
- Fase 6: Testes de API com autenticação
- Fase 7: Paralelização de testes

**Mantenha seus dados seguros e seus testes rápidos! 🔐⚡**
