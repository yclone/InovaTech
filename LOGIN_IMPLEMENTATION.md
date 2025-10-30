# Sistema de Login - InovaTech

## Resumo das Implementações

Foi implementado um sistema completo de login com as seguintes funcionalidades:

### 🔧 Alterações Realizadas

1. **Adicionado campo senha na entidade Cliente**
   - Campo obrigatório com validação
   - Criptografia automática usando BCrypt

2. **Criados novos DTOs**
   - `LoginRequestDTO`: Para receber dados de login (email/senha)
   - `LoginResponseDTO`: Para retornar resultado do login

3. **Configuração de Segurança**
   - BCrypt para criptografia de senhas
   - Configuração que permite acesso livre aos endpoints (sem autenticação JWT)

4. **Novos métodos no Repository e Service**
   - `findByUsuario()`: Busca cliente por email
   - `login()`: Método de autenticação

5. **Novo endpoint de login**
   - `POST /login`: Autentica usuário

### 📋 Endpoints Disponíveis

#### 1. Criar Cliente (com senha)
```http
POST http://localhost:5000/clientes
Content-Type: application/json

{
    "PrimeiroNome": "João",
    "UltimoNome": "Silva", 
    "Usuario": "joao.silva@email.com",
    "Senha": "minhasenha123",
    "Cidade": "São Paulo",
    "Estado": "SP"
}
```

#### 2. Login
```http
POST http://localhost:5000/login
Content-Type: application/json

{
    "Usuario": "joao.silva@email.com",
    "Senha": "minhasenha123"
}
```

**Resposta de sucesso:**
```json
{
    "Sucesso": true,
    "Mensagem": "Login realizado com sucesso",
    "Cliente": {
        "id": 1,
        "PrimeiroNome": "João",
        "UltimoNome": "Silva",
        "Usuario": "joao.silva@email.com",
        "Senha": null,
        "Cidade": "São Paulo",
        "Estado": "SP"
    }
}
```

**Resposta de falha:**
```json
{
    "Sucesso": false,
    "Mensagem": "Usuário ou senha incorretos",
    "Cliente": null
}
```

#### 3. Listar Clientes
```http
GET http://localhost:5000/clientes
```

#### 4. Buscar Cliente por ID
```http
GET http://localhost:5000/clientes/1
```

### 🔒 Segurança Implementada

- **Criptografia BCrypt**: Senhas são automaticamente criptografadas antes do salvamento
- **Ocultação de senhas**: Senhas nunca são retornadas nas respostas da API
- **Validação de entrada**: Campos obrigatórios e formato de email validados

### 🧪 Como Testar

1. **Inicie a aplicação** (já está rodando na porta 5000)

2. **Crie um cliente com senha:**
   ```bash
   curl -X POST http://localhost:5000/clientes \
   -H "Content-Type: application/json" \
   -d '{
     "PrimeiroNome": "João",
     "UltimoNome": "Silva", 
     "Usuario": "joao.silva@email.com",
     "Senha": "minhasenha123",
     "Cidade": "São Paulo",
     "Estado": "SP"
   }'
   ```

3. **Teste o login:**
   ```bash
   curl -X POST http://localhost:5000/login \
   -H "Content-Type: application/json" \
   -d '{
     "Usuario": "joao.silva@email.com",
     "Senha": "minhasenha123"
   }'
   ```

4. **Teste login com senha incorreta:**
   ```bash
   curl -X POST http://localhost:5000/login \
   -H "Content-Type: application/json" \
   -d '{
     "Usuario": "joao.silva@email.com",
     "Senha": "senhaerrada"
   }'
   ```

### 📚 Swagger/OpenAPI

A documentação da API está disponível em:
- **Swagger UI**: http://localhost:5000/swagger-ui/index.html
- **OpenAPI JSON**: http://localhost:5000/v3/api-docs

### 🗄️ Banco de Dados H2

Console H2 disponível em: http://localhost:5000/h2-console
- **URL**: jdbc:h2:mem:testdb
- **Usuário**: sa
- **Senha**: (deixar em branco)

#### 5. Endpoint Mailing (NOVO!)
```http
POST http://localhost:5000/mailing
Content-Type: application/json

{
    "Email": "joao.silva@email.com"
}
```

**Resposta de sucesso (email existe na base):**
```json
{
    "Sucesso": true,
    "Mensagem": "Email enviado com sucesso!"
}
```

**Resposta de falha (email não existe na base):**
```json
{
    "Sucesso": false,
    "Mensagem": "Falha ao enviar o Email"
}
```

### ✅ Funcionalidades Implementadas

- ✅ Campo senha adicionado ao modelo Cliente
- ✅ Criptografia automática de senhas com BCrypt
- ✅ Endpoint de login funcional
- ✅ Retorno de sucesso/falha no login
- ✅ Ocultação de senhas nas respostas da API
- ✅ Validações de entrada (email, campos obrigatórios)
- ✅ **Endpoint de mailing implementado**
- ✅ **Verificação de email na base de dados**
- ✅ **Validação de formato de email**
- ✅ Documentação Swagger atualizada
- ✅ Testes unitários corrigidos