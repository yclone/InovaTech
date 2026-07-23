# Testando a Aplicação InovaTech Frontend

## Como Testar

### 1. Inicie o Backend
Certifique-se que seu backend Java está rodando em `http://localhost:5000`

### 2. Inicie o Frontend
```bash
npm run dev
```

### 3. Acesse a Aplicação
Abra seu navegador em: `http://localhost:5173`

## Fluxo de Teste

### Teste 1: Cadastro de Usuário
1. Acesse `/register` ou clique em "Cadastre-se"
2. Preencha todos os campos:
   ```
   Primeiro Nome: João
   Último Nome: Silva
   E-mail: joao.silva@email.com
   Senha: minhasenha123
   Cidade: São Paulo
   Estado: SP
   ```
3. Clique em "Cadastrar"
4. Deve mostrar sucesso e redirecionar para login

### Teste 2: Login
1. Na tela de login, use:
   ```
   E-mail: joao.silva@email.com
   Senha: minhasenha123
   ```
2. Clique em "Entrar"
3. Deve redirecionar para o dashboard

### Teste 3: Área Logada
1. No dashboard, você deve ver:
   - Header com logo "InovaTech" e botão "Sair"
   - Mensagem de boas-vindas com seu nome
   - Seus dados cadastrados organizados em cards
2. Teste o botão "Sair" - deve pedir confirmação e fazer logout

### Teste 4: Navegação
1. Teste navegar entre as URLs diretamente:
   - `/` (redireciona conforme autenticação)
   - `/register` (cadastro)
   - `/login` (login)
   - `/dashboard` (área logada - protegida)

### Teste 5: Persistência
1. Faça login
2. Recarregue a página (F5)
3. Deve manter o usuário logado
4. Feche e reabra o navegador
5. Deve manter o usuário logado

### Teste 6: Responsividade
1. Redimensione a janela do navegador
2. Teste em diferentes tamanhos de tela
3. Use as ferramentas de desenvolvedor (F12) para simular dispositivos móveis

## Dados de Teste Sugeridos

```javascript
// Usuário 1
{
  "PrimeiroNome": "Maria",
  "UltimoNome": "Santos",
  "Usuario": "maria.santos@teste.com",
  "Senha": "senha123",
  "Cidade": "Rio de Janeiro",
  "Estado": "RJ"
}

// Usuário 2
{
  "PrimeiroNome": "Carlos",
  "UltimoNome": "Oliveira",
  "Usuario": "carlos.oliveira@teste.com", 
  "Senha": "minhaSenha456",
  "Cidade": "Belo Horizonte",
  "Estado": "MG"
}

// Usuário 3
{
  "PrimeiroNome": "Ana",
  "UltimoNome": "Costa",
  "Usuario": "ana.costa@teste.com",
  "Senha": "senha789",
  "Cidade": "Porto Alegre", 
  "Estado": "RS"
}
```

## Possíveis Erros e Soluções

### Erro de CORS
Se aparecer erro de CORS, certifique-se que:
1. O backend está configurado para aceitar requisições de `http://localhost:5173`
2. O backend está rodando na porta 5000

### Erro 404 na API
1. Verifique se o backend está rodando
2. Confirme a URL da API no arquivo `main.js` (linha 6)
3. Teste os endpoints manualmente com Postman/Insomnia

### Problemas de Autenticação
1. Limpe o localStorage do navegador (F12 > Application/Storage > Local Storage)
2. Tente fazer um novo cadastro
3. Verifique se os dados estão sendo enviados corretamente (Network tab no F12)

### Interface Quebrada
1. Force refresh (Ctrl+F5 ou Cmd+Shift+R)
2. Verifique se não há erros no console (F12)
3. Confirme que o CSS está carregando corretamente

## Validações Implementadas

### Client-side
- Campos obrigatórios (HTML5 required)
- Formato de email (HTML5 email type)
- Estados brasileiros (select com opções válidas)

### UX/UI
- Loading states nos botões
- Alertas de sucesso/erro
- Confirmação de logout
- Redirecionamentos automáticos
- Persistência de sessão

## Performance

A aplicação é otimizada para:
- Carregamento rápido (Vite)
- Tamanho mínimo do bundle
- Roteamento SPA sem recarregar página
- Requisições HTTP eficientes