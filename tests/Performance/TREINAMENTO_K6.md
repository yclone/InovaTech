# 🚀 TREINAMENTO K6 - GUIA PRÁTICO COMPLETO

## 📚 Índice
1. [Estrutura do Projeto de Testes de Performance](#estrutura-do-projeto-de-testes-de-performance)
2. [Introdução ao K6](#introdução-ao-k6)
3. [Instalação e Setup](#instalação-e-setup)
4. [Testes Básicos - InovaTech API](#testes-básicos---inovatech-api)
5. [Conceitos Fundamentais](#conceitos-fundamentais)
6. [Tipos de Testes de Performance Avançados](#tipos-de-testes-de-performance-avançados)
7. [Exercícios Práticos Avançados](#exercícios-práticos-avançados)
8. [Análise de Resultados](#análise-de-resultados)
9. [Boas Práticas](#boas-práticas)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Introdução ao K6

### O que é K6?
K6 é uma ferramenta de teste de carga moderna, focada em **developer experience** e **cloud-native**. Criada pela Grafana Labs, é:

- ✅ **Open Source** - Gratuita e com código aberto
- ✅ **JavaScript/ES6** - Scripts familiares para desenvolvedores
- ✅ **Alto Performance** - Escrita em Go, baixo consumo de recursos
- ✅ **Cloud Ready** - Integração nativa com cloud providers
- ✅ **Métricas Ricas** - Métricas detalhadas out-of-the-box

### Por que usar K6 vs outras ferramentas?

| Ferramenta | Linguagem | Curva de Aprendizado | Performance | Cloud Native |
|------------|-----------|----------------------|-------------|--------------|
| **K6** | JavaScript | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| JMeter | GUI/XML | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Gatling | Scala | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Artillery | JavaScript | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🛠️ Instalação e Setup

### Passo 1: Instalar K6

#### **Windows (PowerShell):**
```powershell
# Opção 1: Chocolatey (Recomendado)
choco install k6

# Opção 2: Scoop
scoop install k6

# Opção 3: Download direto
# https://github.com/grafana/k6/releases
```

#### **macOS:**
```bash
# Homebrew
brew install k6
```

### Passo 2: Verificar Instalação
```bash
k6 version
```

### Passo 3: Verificar Instalação e Primeiro Teste
```bash
# Verificar se K6 foi instalado corretamente
k6 version

---


#### **Passo 4:** Inicializar npm
```bash
npm init -y
```

## 🚀 Testes Básicos - InovaTech API

Antes de mergulharmos nos conceitos avançados, vamos começar com testes simples e práticos dos endpoints da API InovaTech. Certifique-se de que a API está rodando em `http://localhost:5000`.

### **Pré-requisitos:**
```powershell
# Iniciar a API (em outro terminal)
cd APP
mvn spring-boot:run

# Verificar se API está respondendo
curl http://localhost:5000/clientes
```

### **Criando seu Primeiro Teste de Performance (Passo a Passo)**

Antes de testarmos todos os endpoints da nossa API, vamos criar um teste do zero para entender a estrutura básica de um script K6. Nosso objetivo será fazer um teste de carga simples no endpoint que lista os clientes.

**Passo 1: Crie um novo arquivo**

Crie um arquivo chamado `meu-primeiro-teste.js` na pasta `tests/Performance`.

**Passo 2: Escreva o código do teste**

Copie e cole o seguinte código no seu arquivo:

```javascript
// 1. Importar os módulos necessários do K6
import http from 'k6/http';
import { check, sleep } from 'k6';

// 2. Configurar as opções do teste
export const options = {
  vus: 3,        // Número de usuários virtuais (Virtual Users)
  duration: '30s' // Duração total do teste
};

// 3. Definir a função principal (o que cada VU vai executar)
export default function() {
  // 4. Fazer uma requisição GET para o endpoint de clientes
  const response = http.get('http://localhost:5000/clientes');
  
  // 5. Verificar se a resposta está correta (Checks)
  check(response, {
    'Status da requisição é 200 (OK)': (r) => r.status === 200,
    'Tempo de resposta é menor que 800ms': (r) => r.timings.duration < 800,
  });
  
  // 6. Pausar por 1 segundo antes da próxima iteração
  sleep(1);
}
```

**Passo 3: Entendendo cada linha do script**

1.  **`import http from 'k6/http';`**: Importa o cliente HTTP do K6, que nos permite fazer requisições web (GET, POST, etc.).
2.  **`import { check, sleep } from 'k6';`**:
    *   `check`: É como um `assert` em testes unitários. Ele verifica se uma condição é verdadeira, mas **não para o teste** se a verificação falhar. Apenas registra o sucesso ou a falha.
    *   `sleep`: Pausa a execução do VU por um determinado tempo (em segundos). Isso é crucial para simular o comportamento de um usuário real, que não clica em tudo instantaneamente.
3.  **`export const options = { ... };`**: Aqui definimos a configuração do nosso teste.
    *   `vus: 3`: Simula **3 usuários virtuais** acessando a aplicação simultaneamente.
    *   `duration: '30s'`: O teste irá rodar por um total de **30 segundos**. Durante esse tempo, os 3 VUs executarão a função `default` repetidamente.
4.  **`export default function() { ... }`**: Este é o coração do seu teste. É o código que cada VU executará em um loop contínuo durante os 30 segundos de teste.
5.  **`const response = http.get(...)`**: Executa uma requisição do tipo GET para a URL `http://localhost:5000/clientes` e armazena a resposta na variável `response`.
6.  **`check(response, { ... });`**: Realiza nossas validações.
    *   `'Status da requisição é 200 (OK)': (r) => r.status === 200`: Verifica se o código de status da resposta HTTP é 200, o que indica sucesso.
    *   `'Tempo de resposta é menor que 800ms': (r) => r.timings.duration < 800`: Verifica se a requisição demorou menos de 800 milissegundos para ser concluída.
7.  **`sleep(1);`**: Faz com que o VU espere por **1 segundo** antes de iniciar a próxima iteração do loop. Isso é chamado de "think time" (tempo de pensamento) e ajuda a criar uma carga mais realista.

**Passo 4: Execute o teste**

Abra o terminal na pasta `tests/Performance` e execute o comando:

```bash
k6 run meu-primeiro-teste.js
```

Ao final da execução, você verá um resumo dos resultados, incluindo os tempos de resposta e se suas verificações (`checks`) passaram.

Agora que você entendeu a anatomia de um teste básico, vamos explorar os endpoints da API InovaTech com mais detalhes.

### **Teste 1: GET /clientes - Listar Usuários**

Este é o teste mais simples - buscar a lista de usuários existentes.

```javascript
// Arquivo: test-get-clientes.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,        // 5 usuários virtuais
  duration: '30s' // Por 30 segundos
};

export default function() {
  // Fazer requisição GET para listar clientes
  let response = http.get('http://localhost:5000/clientes');
  
  // Verificações básicas
  check(response, {
    'Status é 200': (r) => r.status === 200,
    'Tempo de resposta < 1000ms': (r) => r.timings.duration < 1000,
    'Retorna array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body);
      } catch (e) {
        return false;
      }
    },
    'Content-Type é JSON': (r) => r.headers['Content-Type'].includes('application/json')
  });
  
  // Pausa entre requisições
  sleep(1);
}
```

**Como executar:**
```bash
k6 run test-get-clientes.js
```

**Métricas esperadas:**
- ✅ http_req_duration: ~100-500ms
- ✅ http_req_failed: 0%
- ✅ http_reqs: ~150-200 total (5 VUs × 30s ÷ 1s sleep)

### **Teste 2: POST /clientes - Criar Usuário**

Teste de criação de novos usuários com dados válidos.

```javascript
// Arquivo: test-post-clientes.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 3,        // 3 usuários criando simultaneamente
  duration: '1m'  // Por 1 minuto
};

// Função para gerar dados únicos
function gerarUsuario() {
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 10000);
  
  return {
    PrimeiroNome: `Usuario${randomId}`,
    UltimoNome: `Teste${randomId}`,
    Usuario: `teste.${timestamp}.${randomId}@email.com`,
    Senha: `senha${randomId}`,
    Cidade: 'São Paulo',
    Estado: 'SP'
  };
}

export default function() {
  // Gerar dados únicos para cada usuário
  const novoUsuario = gerarUsuario();
  
  // Fazer requisição POST para criar cliente
  let response = http.post(
    'http://localhost:5000/clientes',
    JSON.stringify(novoUsuario),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  
  // Verificações
  check(response, {
    'Status é 201': (r) => r.status === 201,
    'Tempo de resposta < 2000ms': (r) => r.timings.duration < 2000,
    'Retorna ID do usuário': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body && body.id;
      } catch (e) {
        return false;
      }
    },
    'Nome está correto': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.PrimeiroNome === novoUsuario.PrimeiroNome;
      } catch (e) {
        return false;
      }
    }
  });
  
  // Log do resultado
  if (response.status === 201) {
    console.log(`✅ Usuário criado: ${novoUsuario.Usuario}`);
  } else {
    console.log(`❌ Falha ao criar usuário: ${response.status} - ${response.body}`);
  }
  
  sleep(2); // Pausa maior para criação
}
```

**Como executar:**
```bash
k6 run test-post-clientes.js
```

**Métricas esperadas:**
- ✅ http_req_duration: ~200-1000ms (POST é mais lento que GET)
- ✅ http_req_failed: 0-2%
- ✅ http_reqs: ~90 total (3 VUs × 60s ÷ 2s sleep)

### **Teste 3: GET /clientes/{id} - Buscar Usuário Específico**

Teste de busca por ID específico, incluindo cenários de sucesso e erro.

```javascript
// Arquivo: test-get-cliente-id.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 4,        // 4 usuários fazendo buscas
  duration: '45s' // Por 45 segundos
};

// Lista de IDs para testar (mistura IDs válidos e inválidos)
const idsParaTestar = [1, 2, 3, 4, 5, 999, 1000, 9999];

export default function() {
  // Selecionar ID aleatório da lista
  const userId = idsParaTestar[Math.floor(Math.random() * idsParaTestar.length)];
  
  // Fazer requisição GET para buscar cliente específico
  let response = http.get(`http://localhost:5000/clientes/${userId}`);
  
  // Verificações baseadas no status esperado
  if (response.status === 200) {
    // Usuário encontrado
    check(response, {
      'Status é 200 (usuário encontrado)': (r) => r.status === 200,
      'Tempo de resposta < 800ms': (r) => r.timings.duration < 800,
      'Retorna dados do usuário': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body && body.id === userId;
        } catch (e) {
          return false;
        }
      },
      'Senha não é exposta': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.Senha === null || body.Senha === undefined;
        } catch (e) {
          return false;
        }
      }
    });
    
    console.log(`✅ Usuário ${userId} encontrado`);
    
  } else if (response.status === 404) {
    // Usuário não encontrado (esperado para IDs altos)
    check(response, {
      'Status é 404 (usuário não encontrado)': (r) => r.status === 404,
      'Tempo de resposta < 500ms': (r) => r.timings.duration < 500
    });
    
    console.log(`ℹ️ Usuário ${userId} não encontrado (esperado)`);
    
  } else {
    // Status inesperado
    check(response, {
      'Status inesperado': () => false
    });
    
    console.log(`❌ Status inesperado para usuário ${userId}: ${response.status}`);
  }
  
  sleep(1);
}
```

**Como executar:**
```bash
k6 run test-get-cliente-id.js
```

**Métricas esperadas:**
- ✅ http_req_duration: ~50-300ms
- ✅ Mix de status 200 e 404 (ambos são válidos)
- ✅ http_reqs: ~180 total (4 VUs × 45s ÷ 1s sleep)

### **Teste 4: POST /login - Autenticação**

Teste do sistema de login com credenciais válidas e inválidas.

```javascript
// Arquivo: test-post-login.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 2,        // 2 usuários fazendo login
  duration: '1m'  // Por 1 minuto
};

// Primeiro, vamos criar alguns usuários para testar login
function criarUsuarioParaTeste() {
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 10000);
  
  return {
    PrimeiroNome: `LoginUser${randomId}`,
    UltimoNome: `Test${randomId}`,
    Usuario: `login.test.${timestamp}.${randomId}@email.com`,
    Senha: `minhasenha${randomId}`,
    Cidade: 'Rio de Janeiro',
    Estado: 'RJ'
  };
}

export function setup() {
  // Criar alguns usuários para usar nos testes de login
  const usuarios = [];
  
  for (let i = 0; i < 3; i++) {
    const novoUsuario = criarUsuarioParaTeste();
    
    let response = http.post(
      'http://localhost:5000/clientes',
      JSON.stringify(novoUsuario),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (response.status === 201) {
      usuarios.push({
        Usuario: novoUsuario.Usuario,
        Senha: novoUsuario.Senha
      });
      console.log(`✅ Usuário criado para teste: ${novoUsuario.Usuario}`);
    }
  }
  
  return { usuarios: usuarios };
}

export default function(data) {
  // Alternar entre login válido e inválido
  const testeCenario = Math.random();
  
  if (testeCenario < 0.7 && data.usuarios.length > 0) {
    // 70% das vezes: Login com credenciais válidas
    const usuarioValido = data.usuarios[Math.floor(Math.random() * data.usuarios.length)];
    testarLoginValido(usuarioValido);
    
  } else {
    // 30% das vezes: Login com credenciais inválidas
    testarLoginInvalido();
  }
  
  sleep(2);
}

function testarLoginValido(credenciais) {
  let response = http.post(
    'http://localhost:5000/login',
    JSON.stringify(credenciais),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
  
  check(response, {
    'Login válido - Status 200': (r) => r.status === 200,
    'Login válido - Tempo < 1500ms': (r) => r.timings.duration < 1500,
    'Login válido - Sucesso true': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Sucesso === true;
      } catch (e) {
        return false;
      }
    },
    'Login válido - Retorna dados do cliente': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Cliente && body.Cliente.Usuario === credenciais.Usuario;
      } catch (e) {
        return false;
      }
    },
    'Login válido - Mensagem de sucesso': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Mensagem === 'Login realizado com sucesso';
      } catch (e) {
        return false;
      }
    }
  });
  
  console.log(`✅ Login válido testado: ${credenciais.Usuario}`);
}

function testarLoginInvalido() {
  const credenciaisInvalidas = {
    Usuario: 'usuario.inexistente@email.com',
    Senha: 'senhaerrada123'
  };
  
  let response = http.post(
    'http://localhost:5000/login',
    JSON.stringify(credenciaisInvalidas),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
  
  check(response, {
    'Login inválido - Status 200': (r) => r.status === 200, // API retorna 200 mesmo para falha
    'Login inválido - Tempo < 1500ms': (r) => r.timings.duration < 1500,
    'Login inválido - Sucesso false': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Sucesso === false;
      } catch (e) {
        return false;
      }
    },
    'Login inválido - Cliente null': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Cliente === null;
      } catch (e) {
        return false;
      }
    },
    'Login inválido - Mensagem de erro': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Mensagem === 'Usuário ou senha incorretos';
      } catch (e) {
        return false;
      }
    }
  });
  
  console.log(`ℹ️ Login inválido testado (esperado falhar)`);
}
```

**Como executar:**
```bash
k6 run test-post-login.js
```

**Métricas esperadas:**
- ✅ http_req_duration: ~200-800ms
- ✅ http_req_failed: 0% (mesmo logins inválidos retornam 200)
- ✅ Mix de sucessos e falhas de login (ambos esperados)

### **Teste 5: Cenário Completo - Jornada do Usuário**

Teste que combina todos os endpoints em uma jornada realista.

```javascript
// Arquivo: test-jornada-completa.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 3,        // 3 usuários fazendo jornada completa
  duration: '2m'  // Por 2 minutos
};

function gerarUsuario() {
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 10000);
  
  return {
    PrimeiroNome: `JornadaUser${randomId}`,
    UltimoNome: `Test${randomId}`,
    Usuario: `jornada.${timestamp}.${randomId}@email.com`,
    Senha: `jornada${randomId}`,
    Cidade: 'Belo Horizonte',
    Estado: 'MG'
  };
}

export default function() {
  console.log(`🚀 Iniciando jornada completa - VU ${__VU}`);
  
  // Passo 1: Listar usuários existentes (navegação inicial)
  console.log(`   1️⃣ Listando usuários existentes...`);
  let listaResponse = http.get('http://localhost:5000/clientes');
  
  check(listaResponse, {
    'Passo 1 - Lista carregada': (r) => r.status === 200
  });
  
  sleep(1);
  
  // Passo 2: Criar novo usuário (cadastro)
  console.log(`   2️⃣ Criando novo usuário...`);
  const novoUsuario = gerarUsuario();
  
  let criarResponse = http.post(
    'http://localhost:5000/clientes',
    JSON.stringify(novoUsuario),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
  
  let usuarioId = null;
  let criacaoSucesso = check(criarResponse, {
    'Passo 2 - Usuário criado': (r) => r.status === 201
  });
  
  if (criacaoSucesso) {
    try {
      usuarioId = JSON.parse(criarResponse.body).id;
      console.log(`   ✅ Usuário criado com ID: ${usuarioId}`);
    } catch (e) {
      console.log(`   ❌ Erro ao extrair ID do usuário`);
    }
  }
  
  sleep(1);
  
  // Passo 3: Verificar se usuário foi criado (busca por ID)
  if (usuarioId) {
    console.log(`   3️⃣ Verificando usuário criado (ID: ${usuarioId})...`);
    let verificarResponse = http.get(`http://localhost:5000/clientes/${usuarioId}`);
    
    check(verificarResponse, {
      'Passo 3 - Usuário encontrado': (r) => r.status === 200,
      'Passo 3 - Dados corretos': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.Usuario === novoUsuario.Usuario;
        } catch (e) {
          return false;
        }
      }
    });
  }
  
  sleep(1);
  
  // Passo 4: Fazer login com usuário criado
  console.log(`   4️⃣ Fazendo login...`);
  let loginResponse = http.post(
    'http://localhost:5000/login',
    JSON.stringify({
      Usuario: novoUsuario.Usuario,
      Senha: novoUsuario.Senha
    }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
  
  check(loginResponse, {
    'Passo 4 - Login realizado': (r) => r.status === 200,
    'Passo 4 - Login bem-sucedido': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Sucesso === true;
      } catch (e) {
        return false;
      }
    }
  });
  
  console.log(`   🎉 Jornada completa finalizada - VU ${__VU}`);
  sleep(3); // Pausa maior entre jornadas
}
```

**Como executar:**
```bash
k6 run test-jornada-completa.js
```

**Métricas esperadas:**
- ✅ 4 requisições por jornada completa
- ✅ http_req_duration variado (GET rápido, POST mais lento)
- ✅ Todas as verificações devem passar

---

## 📂 Estrutura do Projeto de Testes de Performance

Antes de mergulharmos no K6, é crucial entender como nosso projeto de testes está organizado. Uma estrutura bem definida promove a reutilização de código, facilita a manutenção e torna os testes mais legíveis e eficientes.

A pasta `tests/Performance` segue a seguinte organização:

```
tests/Performance/
├── config/
│   └── environments.js      # URLs, configurações de ambiente e thresholds
├── utils/
│   ├── data-generator.js   # Funções para gerar dados de teste dinâmicos
│   ├── helpers.js          # Funções utilitárias para validações e reuso
│   └── thresholds.js       # Limites de qualidade (passa/falha) específicos
├── tests/
│   ├── api-crud-test.js    # Testes de operações CRUD na API
│   ├── stress-test.js      # Teste de estresse
│   └── ...                 # Outros arquivos de teste
└── TREINAMENTO_K6.md       # Este guia que você está lendo
```

### **Pasta `config`**

Esta pasta centraliza as configurações que podem variar entre diferentes ambientes (local, desenvolvimento, produção).

#### `environments.js`
- **Propósito**: Define as URLs base da API e do frontend para cada ambiente.
- **Como funciona**: Ele exporta um objeto `environments` com as configurações de `local`, `dev`, `staging`, e `production`. O script seleciona o ambiente correto com base na variável de ambiente `ENVIRONMENT` passada na execução do K6. Se nenhuma for passada, `local` é usado como padrão.
- **Vantagem**: Permite executar os mesmos scripts de teste em diferentes ambientes sem modificar o código, apenas mudando a variável de ambiente. Ex: `k6 run -e ENVIRONMENT=staging tests/health-check.js`.

### **Pasta `utils`**

Esta pasta contém módulos com código reutilizável para auxiliar na criação dos testes, seguindo o princípio DRY (Don't Repeat Yourself).

#### `data-generator.js`
- **Propósito**: Criar dados de teste realistas e dinâmicos.
- **O que faz**: Exporta funções como `generateUser()`, `generateLoginData()`, e `generateInvalidUser()`. Isso garante que cada execução do teste utilize dados novos, evitando conflitos como a tentativa de cadastrar um email que já existe.

#### `helpers.js`
- **Propósito**: Agrupar funções de apoio que são usadas em múltiplos scripts.
- **O que faz**: Contém funções como `checkResponse()` para padronizar as validações de status e tempo de resposta, `randomSleep()` para simular pausas mais realistas entre as ações do usuário, e `logInfo()` e `logError()` para um logging mais estruturado.

#### `thresholds.js`
- **Propósito**: Centralizar os critérios de sucesso (passa/falha) dos testes.
- **O que faz**: Define thresholds (limites) para diferentes tipos de teste (`load`, `stress`, `spike`, etc.) e para operações específicas (`create`, `read`, `update`, `delete`). Por exemplo, define que 95% das requisições de `read` devem ser mais rápidas que 1 segundo.
- **Vantagem**: Facilita a manutenção dos critérios de qualidade e permite a criação de políticas de performance consistentes em toda a suíte de testes.

Usar essa estrutura organizada desde o início é uma boa prática que economiza tempo e melhora a qualidade dos seus testes de performance.


---


### **Executando Todos os Testes Básicos**

```powershell
# Executar todos os testes básicos em sequência
Write-Host "🧪 Executando testes básicos da API InovaTech..." -ForegroundColor Green

Write-Host "`n1️⃣ Teste GET /clientes" -ForegroundColor Cyan
k6 run test-get-clientes.js

Write-Host "`n2️⃣ Teste POST /clientes" -ForegroundColor Cyan
k6 run test-post-clientes.js

Write-Host "`n3️⃣ Teste GET /clientes/{id}" -ForegroundColor Cyan
k6 run test-get-cliente-id.js

Write-Host "`n4️⃣ Teste POST /login" -ForegroundColor Cyan
k6 run test-post-login.js

Write-Host "`n5️⃣ Teste jornada completa" -ForegroundColor Cyan
k6 run test-jornada-completa.js

Write-Host "`n✅ Todos os testes básicos executados!" -ForegroundColor Green
```

---

## 🧠 Conceitos Fundamentais

### 1. **Virtual Users (VUs)**
- **Usuários virtuais** que executam seu script
- Cada VU executa o script de forma independente
- Simula usuários reais fazendo requisições

```javascript
export const options = {
  vus: 50, // 50 usuários virtuais
  duration: '5m' // Por 5 minutos
};
```

### 2. **Stages (Estágios)**
- Controla como a carga aumenta/diminui ao longo do tempo
- Permite simular cenários realistas

```javascript
export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp-up
    { duration: '5m', target: 100 }, // Estável
    { duration: '2m', target: 0 }    // Ramp-down
  ]
};
```

### 3. **Thresholds (Limites)**
- Define critérios de passa/falha para o teste
- Automatiza análise de qualidade

```javascript
export const options = {
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% < 2s
    http_req_failed: ['rate<0.1']      // Erro < 10%
  }
};
```

### 4. **Checks (Verificações)**
- Validações dentro do script
- Não para execução, apenas reporta

```javascript
check(response, {
  'status is 200': (r) => r.status === 200,
  'response time < 500ms': (r) => r.timings.duration < 500
});
```

### 5. **Tags**
- Organizam e filtram métricas
- Facilitam análise de resultados

```javascript
let response = http.get('http://api.com/users', {
  tags: { name: 'list_users', type: 'api_call' }
});
```

---

## 📊 Tipos de Testes de Performance

### 1. **Load Test (Teste de Carga)**
**Objetivo:** Verificar performance sob carga normal esperada

```javascript
export const options = {
  stages: [
    { duration: '5m', target: 100 }, // Carga normal
    { duration: '10m', target: 100 }, // Manter
    { duration: '5m', target: 0 }     // Finalizar
  ]
};
```

**Quando usar:**
- ✅ Validar performance antes de deploy
- ✅ Verificar se SLA é atendido
- ✅ Teste de regressão de performance

### 2. **Stress Test (Teste de Estresse)**
**Objetivo:** Encontrar limites do sistema

```javascript
export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 400 },  // Aumentar até quebrar
    { duration: '2m', target: 0 }
  ]
};
```

**Quando usar:**
- ✅ Encontrar ponto de ruptura
- ✅ Validar comportamento sob stress
- ✅ Planejar capacidade

### 3. **Spike Test (Teste de Pico)**
**Objetivo:** Verificar comportamento com picos súbitos

```javascript
export const options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '20s', target: 1400 }, // PICO!
    { duration: '3m', target: 1400 },
    { duration: '20s', target: 100 },
    { duration: '10s', target: 0 }
  ]
};
```

**Quando usar:**
- ✅ Simular tráfego viral
- ✅ Testar auto-scaling
- ✅ Validar circuit breakers

### 4. **Volume Test (Teste de Volume)**
**Objetivo:** Testar com grandes quantidades de dados

```javascript
export default function() {
  // Criar muitos registros
  for (let i = 0; i < 100; i++) {
    http.post('/api/users', largePayload);
  }
}
```

**Quando usar:**
- ✅ Testar importação de dados
- ✅ Validar performance de queries
- ✅ Testar limites de storage

### 5. **Soak Test (Teste de Resistência)**
**Objetivo:** Verificar estabilidade por período prolongado

```javascript
export const options = {
  stages: [
    { duration: '2m', target: 400 },
    { duration: '3h56m', target: 400 }, // 4 HORAS!
    { duration: '2m', target: 0 }
  ]
};
```

**Quando usar:**
- ✅ Detectar memory leaks
- ✅ Testar conexões de longa duração
- ✅ Validar estabilidade

### 6. **Breakpoint Test (Teste de Ponto de Ruptura)**
**Objetivo:** Encontrar capacidade máxima absoluta

```javascript
export const options = {
  executor: 'ramping-arrival-rate',
  startRate: 1,
  timeUnit: '1s',
  preAllocatedVUs: 50,
  maxVUs: 500,
  stages: [
    { duration: '5m', target: 100 },  // Aumentar até
    { duration: '5m', target: 200 },  // sistema
    { duration: '5m', target: 500 },  // quebrar!
  ]
};
```

**Quando usar:**
- ✅ Planejamento de capacidade
- ✅ Encontrar limite absoluto
- ✅ Dimensionar infraestrutura

---

## 🎯 Exercícios Práticos

### **Exercício 1: Primeiro Teste (5 min)**

**Objetivo:** Criar seu primeiro teste K6

1. **Criar arquivo `meu-primeiro-teste.js`:**

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '30s'
};

export default function() {
  let response = http.get('https://httpbin.org/get');
  
  check(response, {
    'status é 200': (r) => r.status === 200,
    'tempo < 1000ms': (r) => r.timings.duration < 1000
  });
  
  sleep(1);
}
```

2. **Executar:**
```bash
k6 run meu-primeiro-teste.js
```

3. **Analisar resultados:**
- ✅ Todas as verificações passaram?
- ✅ Tempo médio de resposta?
- ✅ Taxa de requisições por segundo?

### **Exercício 2: Testando API InovaTech (15 min)**

**Objetivo:** Testar operações CRUD na API real

1. **Verificar se API está rodando:**
```bash
curl http://localhost:5000/clientes
```

2. **Executar teste de CRUD:**
```bash
k6 run tests/api-crud-test.js
```

3. **Analisar:**
- ✅ Quais operações são mais lentas?
- ✅ Alguma falha inesperada?
- ✅ Performance está aceitável?

### **Exercício 3: Comparar Cenários (20 min)**

**Objetivo:** Comparar diferentes cargas

1. **Teste de carga baixa (10 VUs):**
```bash
k6 run --vus 10 --duration 2m tests/api-crud-test.js
```

2. **Teste de carga média (50 VUs):**
```bash
k6 run --vus 50 --duration 2m tests/api-crud-test.js
```

3. **Teste de carga alta (100 VUs):**
```bash
k6 run --vus 100 --duration 2m tests/api-crud-test.js
```

4. **Comparar resultados:**
- 📊 Como response time mudou?
- 📊 Taxa de erro aumentou?
- 📊 Sistema se manteve estável?

### **Exercício 4: Teste de Estresse Controlado (30 min)**

**Objetivo:** Encontrar limites de forma segura

1. **Executar:**
```bash
k6 run tests/stress-test.js
```

2. **Monitorar:**
- 💻 Task Manager (CPU, RAM)
- 📝 Logs da aplicação
- 📊 Métricas do K6

3. **Documentar:**
- 📝 Em que ponto a performance degradou?
- 📝 Qual foi a taxa de erro máxima?
- 📝 Sistema se recuperou após o teste?

---

## 📈 Análise de Resultados

### **Métricas Principais do K6**

#### **1. HTTP Metrics:**
```
http_req_duration........: avg=245ms  min=100ms med=200ms max=2s   p(95)=500ms
http_req_failed..........: 2.5%       ✓ 25    ✗ 975
http_reqs................: 1000       16.6/s
```

**Interpretação:**
- **avg:** Tempo médio de resposta
- **p(95):** 95% das requisições foram menores que este valor
- **http_req_failed:** Taxa de erro (requisições falhadas)
- **http_reqs:** Total de requisições e taxa por segundo

#### **2. VU Metrics:**
```
vus.....................: 50         min=0    max=100
vus_max.................: 100
```

**Interpretação:**
- **vus:** Usuários virtuais ativos no momento
- **vus_max:** Máximo de VUs configurado

#### **3. Data Metrics:**
```
data_received...........: 15 MB      250 kB/s
data_sent...............: 2.5 MB     41 kB/s
```

**Interpretação:**
- **data_received/sent:** Volume de dados transferidos

### **Como Interpretar Resultados**

#### **✅ Teste Passou (Bom):**
- Response time p(95) < threshold
- Taxa de erro < 5%
- CPU/RAM do servidor < 80%
- Sem crashes ou timeouts

#### **⚠️ Teste com Alertas:**
- Response time aumentando
- Taxa de erro entre 5-10%
- Recursos do servidor altos
- Alguns timeouts ocasionais

#### **❌ Teste Falhou:**
- Response time > threshold
- Taxa de erro > 10%
- Servidor sobrecarregado
- Muitos crashes/timeouts

### **Exemplo de Análise Completa:**

```
Teste: Load Test - 50 VUs por 5 minutos
✅ PASSOU - Critérios atendidos

📊 Métricas Principais:
   Response Time (p95): 1.2s < 2s ✅
   Taxa de Erro: 1.5% < 5% ✅
   Throughput: 45 req/s ✅
   
💻 Recursos do Sistema:
   CPU: 65% (pico 78%) ✅
   RAM: 45% ✅
   Disk I/O: Normal ✅
   
🎯 Conclusões:
   - Sistema suporta carga esperada
   - Performance dentro do SLA
   - Capacidade para crescimento de ~30%
   
🔧 Recomendações:
   - Monitorar em produção
   - Testar com 75 VUs na próxima iteração
   - Implementar alertas em 70% de CPU
```

---

## 🏆 Boas Práticas

### **1. Estrutura de Projeto**
```
tests/
├── config/
│   └── environments.js      # URLs e configurações
├── utils/
│   ├── helpers.js          # Funções utilitárias
│   ├── data-generator.js   # Geração de dados
│   └── thresholds.js       # Limites de qualidade
├── tests/
│   ├── health-check.js     # Teste de conectividade
│   ├── load-test.js        # Teste de carga
│   └── stress-test.js      # Teste de estresse
└── reports/                # Relatórios gerados
```

### **2. Nomenclatura Consistente**
```javascript
// ✅ Bom - nomes descritivos
export const options = {
  thresholds: {
    'http_req_duration{name:create_user}': ['p(95)<3000'],
    'http_req_duration{name:list_users}': ['p(95)<1000']
  }
};

// ❌ Ruim - genérico
let response1 = http.get('/api/users');
let response2 = http.post('/api/users', data);
```

### **3. Parametrização**
```javascript
// ✅ Bom - parametrizado
const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';
const VUS = __ENV.VUS || 50;
const DURATION = __ENV.DURATION || '5m';

export const options = {
  vus: VUS,
  duration: DURATION
};
```

### **4. Tratamento de Erros**
```javascript
// ✅ Bom - trata erros
export default function() {
  try {
    let response = http.post('/api/users', JSON.stringify(userData), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.status >= 200 && response.status < 300) {
      // Sucesso
      check(response, {
        'criação bem-sucedida': (r) => r.status === 201
      });
    } else {
      console.error(`Erro HTTP ${response.status}: ${response.body}`);
    }
    
  } catch (error) {
    console.error(`Erro na requisição: ${error.message}`);
  }
  
  sleep(1);
}
```

### **5. Dados Realistas**
```javascript
// ✅ Bom - dados realistas
function generateUser() {
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 10000);
  
  return {
    firstName: `User${randomId}`,
    lastName: `Test${randomId}`,
    email: `test.${timestamp}.${randomId}@example.com`,
    age: Math.floor(Math.random() * 50) + 18
  };
}

// ❌ Ruim - dados estáticos
const userData = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@test.com' // Vai causar conflitos!
};
```

### **6. Graduação de Testes**
```javascript
// ✅ Bom - aumenta gradualmente
export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Aquecimento
    { duration: '2m', target: 50 },   // Carga normal
    { duration: '5m', target: 50 },   // Manter
    { duration: '1m', target: 0 }     // Cooldown
  ]
};

// ❌ Ruim - carga súbita sem preparação
export const options = {
  vus: 100,
  duration: '5m' // 0 → 100 VUs imediatamente
};
```

---

## 🚨 Troubleshooting

### **Problema 1: "Connection Refused"**
```
ERRO: dial tcp 127.0.0.1:5000: connect: connection refused
```

**Soluções:**
```bash
# 1. Verificar se serviço está rodando
curl http://localhost:5000/health

# 2. Verificar porta correta
netstat -an | grep 5000

# 3. Verificar firewall/antivírus
# 4. Tentar IP específico ao invés de localhost
```

### **Problema 2: "Too Many Open Files"**
```
ERRO: dial tcp: too many open files
```

**Soluções:**
```bash
# Linux/macOS - aumentar limites
ulimit -n 65536

# Windows - reduzir VUs ou adicionar delays
export const options = {
  vus: 50, // Reduzir de 100 para 50
  duration: '5m'
};

export default function() {
  // Adicionar sleep maior
  sleep(2);
}
```

### **Problema 3: Memory Issues**
```
ERRO: runtime: out of memory
```

**Soluções:**
```javascript
// 1. Reduzir VUs
export const options = {
  vus: 25 // Reduzir pela metade
};

// 2. Usar executor apropriado
export const options = {
  executor: 'constant-arrival-rate',
  rate: 100,
  timeUnit: '1s',
  duration: '5m',
  preAllocatedVUs: 50,
  maxVUs: 100 // Limitar máximo
};

// 3. Limpar dados grandes
export default function() {
  let response = http.get('/api/data');
  // Não armazenar response.body se for muito grande
  check(response, { 'status ok': (r) => r.status === 200 });
  response = null; // Liberar memória
  sleep(1);
}
```

### **Problema 4: Rate Limiting**
```
HTTP 429: Too Many Requests
```

**Soluções:**
```javascript
// 1. Adicionar delays maiores
export default function() {
  http.get('/api/users');
  sleep(5); // Aumentar de 1s para 5s
}

// 2. Usar arrival rate ao invés de VUs
export const options = {
  executor: 'constant-arrival-rate',
  rate: 10, // 10 req/s ao invés de 100 VUs
  timeUnit: '1s',
  duration: '5m'
};

// 3. Implementar backoff
export default function() {
  let response = http.get('/api/users');
  
  if (response.status === 429) {
    console.log('Rate limited, aguardando...');
    sleep(10);
  } else {
    sleep(1);
  }
}
```

### **Problema 5: SSL/TLS Issues**
```
ERRO: x509: certificate signed by unknown authority
```

**Soluções:**
```javascript
// 1. Desabilitar verificação SSL (só para testes!)
export const options = {
  insecureSkipTLSVerify: true
};

// 2. Usar HTTP ao invés de HTTPS para testes locais
const BASE_URL = 'http://localhost:5000'; // não https://
```

---

## 🎓 Certificação de Conclusão

**Parabéns! 🎉** Você completou o treinamento de K6 para InovaTech e agora domina:

### **✅ Conhecimentos Adquiridos:**
- Instalação e configuração do K6
- Diferentes tipos de testes de performance  
- Criação de scripts robustos e reutilizáveis
- Análise e interpretação de métricas
- Boas práticas de estruturação de testes
- Troubleshooting de problemas comuns
- Integração com pipelines de CI/CD

### **🛠️ Ferramentas Dominadas:**
- K6 CLI e opções avançadas
- JavaScript ES6 para testes de performance
- Configuração de thresholds e checks
- Geração de dados de teste realistas
- Monitoramento e debugging de testes

### **🎯 Próximos Passos Sugeridos:**

#### **Nível Intermediário:**
1. **Integração com Grafana/InfluxDB** para dashboards em tempo real
2. **K6 Cloud** para execução distribuída
3. **Performance Budgets** integrados ao CI/CD
4. **Testes de Regressão** automatizados

#### **Nível Avançado:**
1. **K6 Extensions** para protocolos específicos
2. **Custom Metrics** para métricas de negócio
3. **Distributed Testing** em múltiplos nós
4. **Performance Engineering** completo

### **📚 Recursos para Continuidade:**
- 📖 [K6 Documentation](https://k6.io/docs/) - Documentação oficial
- 🎥 [K6 YouTube Channel](https://www.youtube.com/c/k6test) - Vídeos e webinars
- 💬 [K6 Community Forum](https://community.k6.io/) - Comunidade ativa
- 🐙 [K6 Examples Repository](https://github.com/grafana/k6-examples) - Exemplos avançados

### **🏅 Certificado Digital:**
```
=================================================
    CERTIFICADO DE CONCLUSÃO - TREINAMENTO K6
=================================================

Certificamos que o participante concluiu com 
sucesso o treinamento completo de Performance 
Testing com K6 para a aplicação InovaTech.

Competências validadas:
✅ Criação e execução de testes de performance
✅ Análise de métricas e interpretação de resultados  
✅ Implementação de boas práticas
✅ Troubleshooting e otimização

Data: $(Get-Date -Format "dd/MM/yyyy")
Projeto: InovaTech Performance Testing
Ferramenta: K6 (Grafana Labs)

=================================================
```

**🚀 Continue aplicando esses conhecimentos em projetos reais e explorando os recursos avançados do K6!**