# 🚀 InovaTech - Frontend

Aplicação frontend moderna e responsiva para o sistema de gestão de clientes InovaTech.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior) - [Download aqui](https://nodejs.org/)
- **npm** (versão 8 ou superior) - Vem junto com o Node.js
- **Git** - [Download aqui](https://git-scm.com/)

## ⚡ Instalação Rápida

```bash
# 1. Clone o repositório
git clone https://github.com/yclone/InovaTech.git

# 2. Entre na pasta do frontend
cd InovaTech/FrontEnd

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev

# 5. Acesse http://localhost:5173
```

## 🛠 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm start           # Alias para npm run dev

# Build e Deploy
npm run build       # Gera build de produção
npm run preview     # Visualiza build de produção

# Utilidades
npm run setup       # Instala dependências
npm run clean       # Limpa cache e builds
```

## 🔧 Configuração de Ambiente

### 1. Variáveis de Ambiente (Opcional)

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite conforme necessário
VITE_API_BASE_URL=http://localhost:5000
```

### 2. Backend (Obrigatório)

O frontend precisa do backend rodando em `http://localhost:5000`

## 📁 Estrutura do Projeto

```
FrontEnd/
├── .vscode/                 # Configurações do VS Code
│   ├── extensions.json     # Extensões recomendadas
│   └── settings.json       # Configurações do projeto
├── src/
│   ├── main.js             # Aplicação principal
│   └── style.css           # Estilos globais
├── .env.example            # Exemplo de variáveis de ambiente
├── .gitignore              # Arquivos ignorados pelo Git
├── .prettierrc             # Configuração do Prettier
├── index.html              # HTML principal
├── package.json            # Dependências e scripts
├── README.md               # Este arquivo
├── vite.config.js          # Configuração do Vite
└── ...                     # Documentações adicionais
```

## 🎯 Tecnologias Utilizadas

- **Vite** - Build tool rápido e moderno
- **Vanilla JavaScript** - JavaScript puro para máxima simplicidade
- **CSS3** - Estilos modernos com variáveis CSS
- **HTML5** - Estrutura semântica

## ✨ Funcionalidades

### 🔐 Autenticação

- **Cadastro de usuários** com validação completa
- **Login seguro** com persistência de sessão
- **Logout** com confirmação

### 📱 Interface

- **Design responsivo** para desktop e mobile
- **Feedback visual** com loading e alertas
- **Navegação SPA** (Single Page Application)
- **Experiência moderna** com animações suaves

### 🎯 Telas

1. **Cadastro** (`/register`)

   - Formulário completo com todos os campos obrigatórios
   - Validação de e-mail
   - Seleção de estados brasileiros
   - Integração com API de criação de clientes

2. **Login** (`/login`)

   - Autenticação por e-mail e senha
   - Redirecionamento automático após login
   - Links para cadastro

3. **Dashboard** (`/dashboard`)
   - Área restrita para usuários logados
   - Exibição dos dados do usuário cadastrado
   - Header com nome da aplicação e botão de logout

## Como Executar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- Backend da InovaTech rodando em `http://localhost:5000`

### Instalação

```bash
# Clone o projeto (se necessário)
git clone <seu-repositorio>

# Entre na pasta do frontend
cd FrontEnd

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção

## Estrutura do Projeto

```
FrontEnd/
├── public/
├── src/
│   ├── main.js      # Arquivo principal da aplicação
│   └── style.css    # Estilos globais
├── index.html       # HTML principal
├── package.json     # Configuração do projeto
└── README.md        # Este arquivo
```

## Integração com Backend

A aplicação consome os seguintes endpoints da API:

### Cadastro de Cliente

- **POST** `/clientes`
- Campos obrigatórios: PrimeiroNome, UltimoNome, Usuario, Senha, Cidade, Estado

### Login

- **POST** `/login`
- Campos obrigatórios: Usuario (email), Senha
- Retorna: Sucesso, Mensagem, Cliente (se bem-sucedido)

## Funcionalidades Técnicas

### Roteamento

- Sistema de roteamento SPA personalizado
- Suporte a navegação por history API
- Interceptação de cliques em links

### Estado da Aplicação

- Gerenciamento de estado global simples
- Persistência no localStorage
- Verificação automática de autenticação

### Comunicação com API

- Função genérica para requisições HTTP
- Tratamento centralizado de erros
- Headers automáticos para JSON

### Interface do Usuário

- Sistema de alertas para feedback
- Loading states em botões
- Validação de formulários HTML5
- Design system com variáveis CSS

## Navegação

- `/` - Redireciona para login ou dashboard (conforme autenticação)
- `/register` - Tela de cadastro
- `/login` - Tela de login
- `/dashboard` - Área logada (protegida)

## Características de Segurança

- Rotas protegidas por autenticação
- Limpeza automática de sessão no logout
- Validação client-side e server-side
- Confirmação de logout

## Responsividade

A aplicação é totalmente responsiva e se adapta a:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Browser Support

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Desenvolvimento

Para contribuir com o projeto:

1. Mantenha a simplicidade do código
2. Use Vanilla JavaScript (sem frameworks)
3. Siga os padrões de CSS com variáveis
4. Teste em diferentes resoluções
5. Mantenha a integração com a API atualizada

## Próximas Funcionalidades

- [ ] Edição de perfil do usuário
- [ ] Recuperação de senha
- [ ] Tema escuro/claro
- [ ] Notificações push
- [ ] Validação de CPF/CNPJ
- [ ] Upload de foto de perfil
