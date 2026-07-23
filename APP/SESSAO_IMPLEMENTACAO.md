# 🔐 Gerenciamento de Sessão - InovaTech

## 📋 O que foi implementado?

Adicionamos gerenciamento de sessão simples e eficiente usando **HttpSession** do Spring Boot.

### ✅ Mudanças Realizadas:

1. **SecurityConfig.java** - Habilitada gestão de sessões
2. **LoginResponseDTO.java** - Adicionado campo `SessionId`
3. **ClienteController.java** - Adicionados 3 novos endpoints
4. **CorsConfig.java** - Configurado CORS para aceitar credenciais

---

## 🚀 Como Funciona?

### 1. Login cria sessão automaticamente
Quando o usuário faz login com sucesso:
- ✅ Backend cria uma sessão HTTP
- ✅ Armazena dados do usuário na sessão
- ✅ Retorna `SessionId` no response
- ✅ Browser recebe cookie `JSESSIONID` automaticamente

### 2. Requisições subsequentes usam a sessão
- Browser envia cookie `JSESSIONID` automaticamente
- Backend valida a sessão
- Usuário permanece autenticado

---

## 📡 Novos Endpoints

### 🔑 POST /login
Faz login e cria sessão.

**Request:**
```json
{
  "Usuario": "admin@inovatech.com",
  "Senha": "Admin@123"
}
```

**Response (sucesso):**
```json
{
  "Sucesso": true,
  "Mensagem": "Login realizado com sucesso",
  "Cliente": {
    "Id": 1,
    "Nome": "Admin",
    "Usuario": "admin@inovatech.com",
    "Senha": null
  },
  "SessionId": "8F3D7A1B2C4E5F6A7B8C9D0E1F2A3B4C"
}
```

### ✅ GET /session
Verifica se existe sessão ativa.

**Response (autenticado):**
```json
{
  "sessaoAtiva": true,
  "usuario": {
    "Id": 1,
    "Nome": "Admin",
    "Usuario": "admin@inovatech.com"
  },
  "sessionId": "8F3D7A1B2C4E5F6A7B8C9D0E1F2A3B4C"
}
```

**Response (não autenticado):**
```
Status: 401 Unauthorized
{
  "error": "Sessão inválida ou expirada"
}
```

### 🚪 POST /logout
Invalida a sessão atual.

**Response:**
```json
{
  "mensagem": "Logout realizado com sucesso"
}
```

---

## 🧪 Como Testar

### Opção 1: Via Postman/Insomnia

1. **Fazer Login:**
```
POST http://localhost:5000/login
Content-Type: application/json

{
  "Usuario": "admin@inovatech.com",
  "Senha": "Admin@123"
}
```

2. **Verificar Sessão (vai funcionar automaticamente):**
```
GET http://localhost:5000/session
```
⚠️ **Importante:** O Postman/Insomnia gerencia cookies automaticamente.

3. **Fazer Logout:**
```
POST http://localhost:5000/logout
```

4. **Tentar verificar sessão novamente (deve falhar):**
```
GET http://localhost:5000/session
→ Retorna 401
```

---

### Opção 2: Via cURL (Terminal)

```bash
# 1. Login (salva cookies em arquivo)
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"Usuario":"admin@inovatech.com","Senha":"Admin@123"}' \
  -c cookies.txt \
  -v

# 2. Verificar sessão (usa cookies salvos)
curl -X GET http://localhost:5000/session \
  -b cookies.txt \
  -v

# 3. Logout
curl -X POST http://localhost:5000/logout \
  -b cookies.txt \
  -v

# 4. Tentar acessar novamente (deve falhar)
curl -X GET http://localhost:5000/session \
  -b cookies.txt \
  -v
```

---

### Opção 3: Via Frontend (JavaScript/Cypress)

**⚠️ IMPORTANTE:** Configure Axios para enviar cookies:

```javascript
// No seu código do frontend
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true  // ⭐ ESSENCIAL para sessões
});

// Fazer login
const loginResponse = await api.post('/login', {
  Usuario: 'admin@inovatech.com',
  Senha: 'Admin@123'
});

console.log('SessionId:', loginResponse.data.SessionId);

// Verificar sessão (usa cookie automaticamente)
const sessionResponse = await api.get('/session');
console.log('Sessão ativa:', sessionResponse.data);

// Logout
await api.post('/logout');
```

---

### Opção 4: No Cypress

Atualize os testes para enviar credenciais:

```javascript
// cypress/support/commands.js

// ⭐ Comando de login via API com sessão
Cypress.Commands.add('loginViaAPI', (userType) => {
  const users = Cypress.env('users');
  const apiUrl = Cypress.env('api').baseUrl;
  const user = users[userType];
  
  cy.request({
    method: 'POST',
    url: `${apiUrl}/login`,
    body: {
      Usuario: user.email,
      Senha: user.password
    },
    // ⭐ IMPORTANTE: Cypress aceita cookies automaticamente
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.Sucesso).to.be.true;
    expect(response.body.SessionId).to.exist;
    
    cy.log(`✅ Login via API - SessionId: ${response.body.SessionId}`);
  });
});

// Verificar sessão
Cypress.Commands.add('verificarSessao', () => {
  const apiUrl = Cypress.env('api').baseUrl;
  
  cy.request({
    method: 'GET',
    url: `${apiUrl}/session`,
    failOnStatusCode: false  // Não falha se retornar 401
  }).then((response) => {
    if (response.status === 200) {
      cy.log(`✅ Sessão ativa: ${response.body.usuario.Usuario}`);
      return response.body;
    } else {
      cy.log('❌ Sessão inválida');
      return null;
    }
  });
});
```

---

## 🔍 Atualizar Validação do cy.session()

Agora você pode usar o endpoint `/session` para validar:

```javascript
// cypress/support/commands.js

Cypress.Commands.add('loginWithSessionAPI', (userType) => {
  const users = Cypress.env('users');
  const apiUrl = Cypress.env('api').baseUrl;
  const user = users[userType];
  
  cy.session(
    `api-user-session-${userType}`,
    () => {
      // Faz login via API
      cy.request({
        method: 'POST',
        url: `${apiUrl}/login`,
        body: {
          Usuario: user.email,
          Senha: user.password
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.Sucesso).to.be.true;
        cy.log(`✅ Login: ${response.body.SessionId}`);
      });
    },
    {
      // ⭐ NOVA VALIDAÇÃO: Usa endpoint /session
      validate() {
        cy.request({
          method: 'GET',
          url: `${apiUrl}/session`,
          failOnStatusCode: false
        }).then((response) => {
          if (response.status !== 200) {
            throw new Error('Sessão inválida');
          }
          cy.log(`✅ Sessão válida: ${response.body.sessionId}`);
        });
      },
      cacheAcrossSpecs: true
    }
  );
});
```

---

## 🎯 Teste Completo

Execute este teste para verificar tudo:

```javascript
// cypress/e2e/test-session-backend.cy.js

describe('Teste de Sessão do Backend', () => {
  const apiUrl = Cypress.env('api').baseUrl;
  
  it('deve criar, validar e destruir sessão', () => {
    // 1. Login
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        Usuario: 'admin@inovatech.com',
        Senha: 'Admin@123'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.Sucesso).to.be.true;
      expect(response.body.SessionId).to.exist;
      
      cy.log(`✅ SessionId: ${response.body.SessionId}`);
    });
    
    // 2. Verificar sessão (deve estar ativa)
    cy.request({
      method: 'GET',
      url: `${apiUrl}/session`
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.sessaoAtiva).to.be.true;
      expect(response.body.usuario).to.exist;
      
      cy.log(`✅ Sessão válida para: ${response.body.usuario.Usuario}`);
    });
    
    // 3. Logout
    cy.request({
      method: 'POST',
      url: `${apiUrl}/logout`
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log('✅ Logout realizado');
    });
    
    // 4. Verificar sessão (deve estar inválida)
    cy.request({
      method: 'GET',
      url: `${apiUrl}/session`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
      cy.log('✅ Sessão invalidada corretamente');
    });
  });
});
```

---

## 📦 O que Cypress Recebe Agora?

Após o login, o backend retorna:

```javascript
{
  Sucesso: true,
  Mensagem: "Login realizado com sucesso",
  Cliente: {
    Id: 1,
    Nome: "Admin",
    Usuario: "admin@inovatech.com",
    Senha: null
  },
  SessionId: "8F3D7A1B2C4E5F6A7B8C9D0E1F2A3B4C"  // ⭐ NOVO
}
```

E o **browser recebe automaticamente** o cookie:
```
Set-Cookie: JSESSIONID=8F3D7A1B2C4E5F6A7B8C9D0E1F2A3B4C; Path=/; HttpOnly
```

---

## 🔧 Configurações da Sessão

**Tempo de expiração padrão:** 30 minutos de inatividade

**Para alterar**, adicione ao `application.properties`:

```properties
# Tempo de expiração da sessão (em segundos)
server.servlet.session.timeout=1800

# 30 minutos = 1800 segundos
# 1 hora = 3600 segundos
# 2 horas = 7200 segundos
```

---

## ✅ Checklist de Implementação

- [x] SecurityConfig atualizado com sessionManagement
- [x] LoginResponseDTO com campo SessionId
- [x] ClienteController com endpoints de sessão
- [x] CorsConfig configurado com allowCredentials
- [x] Endpoint /session para validação
- [x] Endpoint /logout para invalidar sessão

---

## 🚀 Próximos Passos

1. **Reinicie o backend:**
```bash
cd APP
mvn spring-boot:run
```

2. **Teste os endpoints** com Postman ou cURL

3. **Atualize os comandos Cypress** para usar validação com `/session`

4. **Execute os testes** e veja a mágica acontecer! ✨

---

## 💡 Dicas

✅ **Cypress gerencia cookies automaticamente** - você não precisa fazer nada especial!

✅ **cy.session() + cy.request()** funcionam perfeitamente juntos

✅ Use **validate()** com endpoint `/session` para garantir que a sessão está ativa

✅ O cookie `JSESSIONID` é **HttpOnly** (mais seguro)

---

## 🐛 Troubleshooting

### Problema: "Sessão não persiste entre requisições"
**Solução:** Verifique se está enviando `withCredentials: true` no Axios ou se o CORS está configurado corretamente.

### Problema: "CORS error"
**Solução:** Verifique se o frontend está na lista `allowedOrigins` do CorsConfig.

### Problema: "Sessão expira muito rápido"
**Solução:** Aumente o timeout no `application.properties`.

---

**Pronto! Agora sua aplicação tem gerenciamento de sessão completo! 🎉**
