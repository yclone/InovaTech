import './style.css';

// Configuração da API
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://localhost:5000';

// Estado global da aplicação
const AppState = {
  currentUser: null,
  isAuthenticated: false
};

// Classe para gerenciar as rotas
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    
    // Escuta mudanças na URL
    window.addEventListener('popstate', () => this.handleRoute());
    
    // Intercepta cliques em links
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        this.navigateTo(e.target.getAttribute('href') || e.target.getAttribute('data-route'));
      }
    });
  }

  // Adiciona uma rota
  addRoute(path, component) {
    this.routes[path] = component;
  }

  // Navega para uma rota
  navigateTo(path) {
    window.history.pushState({}, '', path);
    this.handleRoute();
  }

  // Processa a rota atual
  handleRoute() {
    const path = window.location.pathname;
    const route = this.routes[path] || this.routes['/'];
    
    if (route) {
      this.currentRoute = path;
      route();
    }
  }

  // Inicia o roteador
  start() {
    this.handleRoute();
  }
}

// Função para fazer requisições HTTP
async function apiRequest(endpoint, options = {}) {
  try {
    console.log('Fazendo requisição para:', `${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    // Verifica se a resposta é JSON válido
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textData = await response.text();
      console.log('Resposta não-JSON recebida:', textData);
      throw new Error('Servidor retornou resposta inválida. Verifique se o backend está rodando.');
    }
    
    if (!response.ok) {
      throw new Error(data.errors ? data.errors.join(', ') : `Erro HTTP ${response.status}: ${data.message || 'Erro na requisição'}`);
    }

    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    
    // Tratamento específico para erros de CORS/rede
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:5000 e configurado para aceitar CORS.');
    }
    
    throw error;
  }
}

// Função para salvar dados no localStorage
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Função para carregar dados do localStorage
function loadFromStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Função para limpar o localStorage
function clearStorage() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isAuthenticated');
}

// Função para verificar se o usuário está autenticado
function checkAuth() {
  const user = loadFromStorage('currentUser');
  const isAuth = loadFromStorage('isAuthenticated');
  
  if (user && isAuth) {
    AppState.currentUser = user;
    AppState.isAuthenticated = true;
    return true;
  }
  
  return false;
}

// Função para fazer logout
function logout() {
  AppState.currentUser = null;
  AppState.isAuthenticated = false;
  clearStorage();
  router.navigateTo('/login');
}

// Função para mostrar alertas
function showAlert(message, type = 'error') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  const form = document.querySelector('form');
  if (form) {
    form.insertBefore(alertDiv, form.firstChild);
    
    // Remove o alerta após 5 segundos
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.parentNode.removeChild(alertDiv);
      }
    }, 5000);
  }
}

// Componente da tela de cadastro
function renderRegister() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="page">
      <div class="card">
        <h1>Cadastro</h1>
        <p class="text-center mb-1">Crie sua conta</p>
        
        <form id="register-form">
          <div class="form-group">
            <label for="primeiroNome">Primeiro Nome</label>
            <input type="text" id="primeiroNome" name="primeiroNome" required>
          </div>
          
          <div class="form-group">
            <label for="ultimoNome">Último Nome</label>
            <input type="text" id="ultimoNome" name="ultimoNome" required>
          </div>
          
          <div class="form-group">
            <label for="usuario">E-mail</label>
            <input type="email" id="usuario" name="usuario" required>
          </div>
          
          <div class="form-group">
            <label for="senha">Senha</label>
            <input type="password" id="senha" name="senha" required>
          </div>
          
          <div class="form-group">
            <label for="cidade">Cidade</label>
            <input type="text" id="cidade" name="cidade" required>
          </div>
          
          <div class="form-group">
            <label for="estado">Estado</label>
            <select id="estado" name="estado" required>
              <option value="">Selecione o estado</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
            </select>
          </div>
          
          <button type="submit" class="btn btn-primary" id="register-btn">
            Cadastrar
          </button>
        </form>
        
        <div class="text-center mt-1">
          <a href="/login" class="link" data-link>Já tem uma conta? Entre aqui</a>
        </div>
      </div>
    </div>
  `;

  // Adiciona o event listener do formulário
  const form = document.getElementById('register-form');
  const button = document.getElementById('register-btn');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Desabilita o botão e mostra loading
    button.disabled = true;
    button.innerHTML = '<span class="loading"></span> Cadastrando...';
    
    // Remove alertas anteriores
    const existingAlert = form.querySelector('.alert');
    if (existingAlert) {
      existingAlert.remove();
    }
    
    try {
      const formData = new FormData(form);
      const data = {
        PrimeiroNome: formData.get('primeiroNome'),
        UltimoNome: formData.get('ultimoNome'),
        Usuario: formData.get('usuario'),
        Senha: formData.get('senha'),
        Cidade: formData.get('cidade'),
        Estado: formData.get('estado')
      };

      await apiRequest('/clientes', {
        method: 'POST',
        body: JSON.stringify(data)
      });

      showAlert('Cadastro realizado com sucesso! Redirecionando...', 'success');
      
      // Redireciona para o login após 2 segundos
      setTimeout(() => {
        router.navigateTo('/login');
      }, 2000);
      
    } catch (error) {
      showAlert(error.message);
    } finally {
      // Reabilita o botão
      button.disabled = false;
      button.innerHTML = 'Cadastrar';
    }
  });
}

// Componente da tela de login
function renderLogin() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="page">
      <div class="card">
        <h1>Login</h1>
        <p class="text-center mb-1">Entre na sua conta</p>
        
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
        
        <div class="text-center mt-1">
          <a href="/register" class="link" data-link>Não tem uma conta? Cadastre-se</a>
        </div>
      </div>
    </div>
  `;

  // Adiciona o event listener do formulário
  const form = document.getElementById('login-form');
  const button = document.getElementById('login-btn');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Desabilita o botão e mostra loading
    button.disabled = true;
    button.innerHTML = '<span class="loading"></span> Entrando...';
    
    // Remove alertas anteriores
    const existingAlert = form.querySelector('.alert');
    if (existingAlert) {
      existingAlert.remove();
    }
    
    try {
      const formData = new FormData(form);
      const data = {
        Usuario: formData.get('usuario'),
        Senha: formData.get('senha')
      };

      const response = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify(data)
      });

      if (response.Sucesso && response.Cliente) {
        // Salva os dados do usuário
        AppState.currentUser = response.Cliente;
        AppState.isAuthenticated = true;
        
        saveToStorage('currentUser', response.Cliente);
        saveToStorage('isAuthenticated', true);
        
        showAlert('Login realizado com sucesso! Redirecionando...', 'success');
        
        // Redireciona para o dashboard após 1 segundo
        setTimeout(() => {
          router.navigateTo('/dashboard');
        }, 1000);
      } else {
        showAlert(response.Mensagem || 'Erro no login');
      }
      
    } catch (error) {
      showAlert(error.message);
    } finally {
      // Reabilita o botão
      button.disabled = false;
      button.innerHTML = 'Entrar';
    }
  });
}

// Componente da área logada (dashboard)
function renderDashboard() {
  // Verifica se o usuário está autenticado
  if (!AppState.isAuthenticated) {
    router.navigateTo('/login');
    return;
  }

  const user = AppState.currentUser;
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <a href="/dashboard" class="logo" data-link>InovaTech</a>
          <button class="btn btn-secondary" id="logout-btn" style="width: auto;">
            Sair
          </button>
        </div>
      </div>
    </header>
    
    <main class="dashboard">
      <div class="container">
        <div class="user-info">
          <h3>Bem-vindo, ${user.PrimeiroNome} ${user.UltimoNome}!</h3>
          
          <div class="user-details">
            <div class="detail-item">
              <div class="detail-label">Nome Completo</div>
              <div class="detail-value">${user.PrimeiroNome} ${user.UltimoNome}</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">E-mail</div>
              <div class="detail-value">${user.Usuario}</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">Cidade</div>
              <div class="detail-value">${user.Cidade}</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">Estado</div>
              <div class="detail-value">${user.Estado}</div>
            </div>
            
            ${user.id ? `
            <div class="detail-item">
              <div class="detail-label">ID do Cliente</div>
              <div class="detail-value">#${user.id}</div>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    </main>
  `;

  // Adiciona o event listener do botão de logout
  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  });
}

// Função para redirecionar para login (rota raiz)
function redirectToLogin() {
  router.navigateTo('/login');
}

// Inicialização da aplicação
const router = new Router();

// Configura as rotas
router.addRoute('/', redirectToLogin);
router.addRoute('/register', renderRegister);
router.addRoute('/login', renderLogin);
router.addRoute('/dashboard', renderDashboard);

// Verifica se o usuário já está logado
checkAuth();

// Inicia a aplicação
router.start();

// Se estiver na raiz e o usuário já estiver logado, vai para o dashboard
if (window.location.pathname === '/' && AppState.isAuthenticated) {
  router.navigateTo('/dashboard');
}
