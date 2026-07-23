# 🤝 Contribuindo para o InovaTech Frontend

Obrigado por seu interesse em contribuir! Este guia ajudará você a configurar o ambiente de desenvolvimento e seguir nossas convenções.

## 🚀 Configuração do Ambiente

### 1. Pré-requisitos

- Node.js 16+
- npm 8+
- Git

### 2. Setup do Projeto

```bash
# Clone o repositório
git clone https://github.com/yclone/InovaTech.git
cd InovaTech/FrontEnd

# Execute o script de setup automático
# Linux/Mac:
bash setup.sh

# Windows:
.\setup.ps1

# Ou manualmente:
npm install
cp .env.example .env.local
npm run dev
```

## 📋 Padrões de Código

### JavaScript

- Use **ES6+** features
- Prefira **const/let** ao invés de **var**
- Use **arrow functions** quando apropriado
- Mantenha funções **pequenas e focadas**
- Adicione **comentários** em lógicas complexas

```javascript
// ✅ Bom
const handleSubmit = async (formData) => {
  try {
    const response = await apiRequest('/endpoint', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    return response;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

// ❌ Evite
function handleSubmit(formData) {
  var self = this;
  // lógica complexa sem comentários
}
```

### CSS

- Use **variáveis CSS** (custom properties)
- Prefira **classes** ao invés de IDs
- Mantenha **especificidade baixa**
- Use **mobile-first** approach

```css
/* ✅ Bom */
.btn {
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

/* ❌ Evite */
#specific-button {
  padding: 12px !important;
  background: #2563eb;
}
```

### HTML

- Use **HTML5** semântico
- Adicione **atributos de acessibilidade**
- Mantenha **estrutura limpa**

```html
<!-- ✅ Bom -->
<form role="form" aria-label="Formulário de login">
  <div class="form-group">
    <label for="email">E-mail</label>
    <input type="email" id="email" required aria-describedby="email-help" />
    <small id="email-help">Digite seu e-mail cadastrado</small>
  </div>
</form>

<!-- ❌ Evite -->
<div>
  <div>E-mail</div>
  <input type="text" />
</div>
```

## 🔀 Fluxo de Trabalho Git

### 1. Branches

```bash
# Feature
git checkout -b feature/nome-da-feature

# Bugfix
git checkout -b bugfix/nome-do-bug

# Hotfix
git checkout -b hotfix/nome-do-hotfix
```

### 2. Commits

Use [Conventional Commits](https://conventionalcommits.org/):

```bash
# Features
git commit -m "feat: adiciona validação de CPF no cadastro"

# Bugfixes
git commit -m "fix: corrige erro de CORS na API"

# Documentação
git commit -m "docs: atualiza README com instruções de deploy"

# Refatoração
git commit -m "refactor: melhora função de validação de formulários"

# Estilo/Formatação
git commit -m "style: corrige indentação no main.js"
```

### 3. Pull Requests

- Crie **PRs pequenos** e focados
- Adicione **descrição clara** do que foi alterado
- Inclua **screenshots** se relevante
- Teste **localmente** antes de criar o PR

## 🧪 Testes

### Manual Testing

Antes de fazer commit:

```bash
# 1. Teste o build
npm run build

# 2. Teste o servidor de produção
npm run preview

# 3. Teste em diferentes navegadores
# - Chrome
# - Firefox
# - Safari (se Mac)
# - Edge

# 4. Teste responsividade
# - Desktop (1200px+)
# - Tablet (768px-1199px)
# - Mobile (<768px)
```

### Checklist de Funcionalidades

- [ ] Cadastro de usuário funciona
- [ ] Login funciona
- [ ] Dashboard carrega dados corretos
- [ ] Logout funciona
- [ ] Navegação entre páginas funciona
- [ ] Formulários validam corretamente
- [ ] Alertas aparecem quando esperado
- [ ] Design responsivo funciona
- [ ] Sem erros no console
- [ ] Performance aceitável

## 📝 Documentação

### Comentários no Código

```javascript
/**
 * Faz requisição para a API com tratamento de erros
 * @param {string} endpoint - Endpoint da API (ex: '/clientes')
 * @param {Object} options - Opções da requisição (headers, method, body)
 * @returns {Promise} Promise com a resposta da API
 */
async function apiRequest(endpoint, options = {}) {
  // implementação...
}
```

### README Updates

Se adicionar funcionalidades:

- Atualize o README.md
- Adicione exemplos de uso
- Documente novas configurações

## 🐛 Reportando Bugs

### Template de Issue

```markdown
## 🐛 Bug Report

**Descrição:**
Breve descrição do problema

**Passos para Reproduzir:**

1. Vá para...
2. Clique em...
3. Veja o erro

**Comportamento Esperado:**
O que deveria acontecer

**Comportamento Atual:**
O que está acontecendo

**Screenshots:**
Se aplicável

**Ambiente:**

- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari
- Versão do Node:
- Versão do npm:
```

## ✨ Sugerindo Features

### Template de Feature Request

```markdown
## 💡 Feature Request

**Problema:**
Que problema esta feature resolve?

**Solução Proposta:**
Descrição da solução

**Alternativas Consideradas:**
Outras soluções pensadas

**Contexto Adicional:**
Informações extras, mockups, etc.
```

## 📚 Recursos Úteis

### Documentação

- [Vite Docs](https://vitejs.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

### Ferramentas

- [VS Code](https://code.visualstudio.com/) - Editor recomendado
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [Git](https://git-scm.com/)

## 🎯 Próximas Features (Roadmap)

- [ ] Edição de perfil
- [ ] Recuperação de senha
- [ ] Tema escuro/claro
- [ ] PWA (Progressive Web App)
- [ ] Notificações
- [ ] Upload de avatar
- [ ] Internacionalização (i18n)

## 📞 Contato

- **Issues**: Use GitHub Issues para bugs e features
- **Discussões**: Use GitHub Discussions para dúvidas
- **Email**: contato@inovatech.com.br

---

**Obrigado por contribuir! 🙏**
