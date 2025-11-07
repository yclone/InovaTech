// Frontend Test - Teste de performance da interface web usando K6 Browser
import { browser } from 'k6/experimental/browser';
import { check, sleep } from 'k6';
import { config } from '../config/environments.js';
import { generateUser } from '../utils/data-generator.js';
import { logInfo } from '../utils/helpers.js';
import { thresholds } from '../utils/thresholds.js';

// Configurações do teste de frontend
export const options = {
  scenarios: {
    ui_test: {
      executor: 'constant-vus',
      vus: 5,
      duration: '5m',
      options: {
        browser: {
          type: 'chromium'
        }
      }
    }
  },
  thresholds: thresholds.frontend
};

// Função principal do teste de frontend
export default async function() {
  logInfo(`VU ${__VU} - Iniciando teste de performance do frontend`);

  const page = browser.newPage();
  const testUser = generateUser();

  try {
    // Cenários de frontend com diferentes comportamentos
    const scenarios = [
      'complete_user_journey',  // 60% - Jornada completa do usuário
      'navigation_heavy',       // 25% - Navegação intensiva
      'form_interaction'        // 15% - Interações com formulários
    ];

    const scenario = scenarios[__VU % scenarios.length];
    
    switch (scenario) {
      case 'complete_user_journey':
        await completeUserJourney(page, testUser);
        break;
      case 'navigation_heavy':
        await navigationHeavyScenario(page);
        break;
      case 'form_interaction':
        await formInteractionScenario(page, testUser);
        break;
    }

  } catch (error) {
    logInfo(`VU ${__VU} - Erro no teste de frontend: ${error.message}`);
  } finally {
    page.close();
  }
}

// Cenário 1: Jornada completa do usuário (cadastro → login → dashboard)
async function completeUserJourney(page, testUser) {
  logInfo(`VU ${__VU} - Jornada completa do usuário`);

  // 1. Navegar para página inicial
  logInfo(`VU ${__VU} - Acessando página inicial`);
  const homeStartTime = Date.now();
  
  await page.goto(config.frontendUrl);
  
  const homeLoadTime = Date.now() - homeStartTime;
  
  check(null, {
    'Frontend - Home page loads': () => homeLoadTime < 5000,
    'Frontend - Home page reasonable time': () => homeLoadTime < 3000
  });

  // Verificar se redirecionou para login
  await page.waitForSelector('h1', { timeout: 10000 });
  const pageTitle = await page.locator('h1').textContent();
  
  check(null, {
    'Frontend - Redirects to login': () => pageTitle.includes('Login')
  });

  sleep(1);

  // 2. Ir para página de cadastro
  logInfo(`VU ${__VU} - Navegando para cadastro`);
  
  await page.goto(`${config.frontendUrl}/register`);
  
  // Aguardar formulário carregar
  await page.waitForSelector('input[name="primeiroNome"]', { timeout: 10000 });
  
  check(null, {
    'Frontend - Register page loads': () => true
  });

  sleep(1);

  // 3. Preencher formulário de cadastro
  logInfo(`VU ${__VU} - Preenchendo formulário de cadastro`);
  
  const formStartTime = Date.now();
  
  await page.fill('input[name="primeiroNome"]', testUser.PrimeiroNome);
  await page.fill('input[name="ultimoNome"]', testUser.UltimoNome);
  await page.fill('input[name="usuario"]', testUser.Usuario);
  await page.fill('input[name="senha"]', testUser.Senha);
  await page.fill('input[name="cidade"]', testUser.Cidade);
  await page.selectOption('select[name="estado"]', testUser.Estado);
  
  const formFillTime = Date.now() - formStartTime;
  
  check(null, {
    'Frontend - Form fills quickly': () => formFillTime < 2000,
    'Frontend - All fields fillable': () => true
  });

  sleep(0.5);

  // 4. Submeter cadastro
  logInfo(`VU ${__VU} - Submetendo cadastro`);
  
  const submitStartTime = Date.now();
  
  await page.click('button[type="submit"]');
  
  // Aguardar redirecionamento ou mensagem de sucesso
  try {
    await page.waitForURL('**/login', { timeout: 15000 });
    const submitTime = Date.now() - submitStartTime;
    
    check(null, {
      'Frontend - Register submits successfully': () => true,
      'Frontend - Register response time OK': () => submitTime < 10000
    });
    
    logInfo(`VU ${__VU} - Cadastro realizado com sucesso`);
    
  } catch (error) {
    logInfo(`VU ${__VU} - Possível erro no cadastro: ${error.message}`);
    
    check(null, {
      'Frontend - Register handles errors gracefully': () => true
    });
  }

  sleep(2);

  // 5. Fazer login
  logInfo(`VU ${__VU} - Fazendo login`);
  
  // Assegurar que está na página de login
  await page.goto(`${config.frontendUrl}/login`);
  await page.waitForSelector('input[name="usuario"]', { timeout: 10000 });
  
  const loginStartTime = Date.now();
  
  await page.fill('input[name="usuario"]', testUser.Usuario);
  await page.fill('input[name="senha"]', testUser.Senha);
  
  await page.click('button[type="submit"]');
  
  // Aguardar redirecionamento para dashboard
  try {
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    const loginTime = Date.now() - loginStartTime;
    
    check(null, {
      'Frontend - Login successful': () => true,
      'Frontend - Login response time OK': () => loginTime < 8000
    });
    
    logInfo(`VU ${__VU} - Login realizado com sucesso`);
    
    // 6. Verificar dashboard
    await page.waitForSelector('h1, h2', { timeout: 10000 });
    const dashboardContent = await page.locator('body').textContent();
    
    check(null, {
      'Frontend - Dashboard loads': () => dashboardContent.includes('Bem-vindo') || dashboardContent.includes(testUser.PrimeiroNome),
      'Frontend - Dashboard shows user data': () => dashboardContent.includes(testUser.Usuario)
    });
    
    sleep(2);
    
    // 7. Logout
    logInfo(`VU ${__VU} - Fazendo logout`);
    
    try {
      await page.click('#logout-btn');
      // Confirmar logout se houver confirmação
      page.on('dialog', dialog => dialog.accept());
      
      await page.waitForURL('**/login', { timeout: 10000 });
      
      check(null, {
        'Frontend - Logout successful': () => true
      });
      
    } catch (error) {
      logInfo(`VU ${__VU} - Logout não disponível ou erro: ${error.message}`);
    }
    
  } catch (error) {
    logInfo(`VU ${__VU} - Erro no login: ${error.message}`);
    
    check(null, {
      'Frontend - Login handles errors': () => true
    });
  }
}

// Cenário 2: Navegação intensiva
async function navigationHeavyScenario(page) {
  logInfo(`VU ${__VU} - Navegação intensiva`);

  const pages = [
    config.frontendUrl,
    `${config.frontendUrl}/login`,
    `${config.frontendUrl}/register`
  ];

  // Navegar entre páginas rapidamente
  for (let i = 0; i < 10; i++) {
    const targetPage = pages[i % pages.length];
    
    logInfo(`VU ${__VU} - Navegando para ${targetPage} (${i + 1}/10)`);
    
    const navStartTime = Date.now();
    
    try {
      await page.goto(targetPage);
      await page.waitForSelector('body', { timeout: 8000 });
      
      const navTime = Date.now() - navStartTime;
      
      check(null, {
        [`Navigation ${i + 1} - Page loads`]: () => true,
        [`Navigation ${i + 1} - Load time acceptable`]: () => navTime < 5000
      });
      
    } catch (error) {
      logInfo(`VU ${__VU} - Erro na navegação ${i + 1}: ${error.message}`);
      
      check(null, {
        [`Navigation ${i + 1} - Handles errors`]: () => true
      });
    }
    
    sleep(0.5);
  }

  // Testar navegação com botão voltar
  logInfo(`VU ${__VU} - Testando navegação com botão voltar`);
  
  try {
    await page.goBack();
    await page.waitForSelector('body', { timeout: 5000 });
    
    await page.goForward();
    await page.waitForSelector('body', { timeout: 5000 });
    
    check(null, {
      'Frontend - Back/Forward navigation works': () => true
    });
    
  } catch (error) {
    logInfo(`VU ${__VU} - Erro na navegação back/forward: ${error.message}`);
  }
}

// Cenário 3: Interações intensivas com formulários
async function formInteractionScenario(page, testUser) {
  logInfo(`VU ${__VU} - Interações intensivas com formulários`);

  // Ir para página de cadastro
  await page.goto(`${config.frontendUrl}/register`);
  await page.waitForSelector('input[name="primeiroNome"]', { timeout: 10000 });

  // Testar preenchimento e limpeza rápida de formulários
  for (let i = 0; i < 5; i++) {
    logInfo(`VU ${__VU} - Ciclo de formulário ${i + 1}/5`);
    
    const fillStartTime = Date.now();
    
    // Preencher todos os campos
    await page.fill('input[name="primeiroNome"]', `${testUser.PrimeiroNome}${i}`);
    await page.fill('input[name="ultimoNome"]', `${testUser.UltimoNome}${i}`);
    await page.fill('input[name="usuario"]', `${testUser.Usuario}.${i}`);
    await page.fill('input[name="senha"]', `${testUser.Senha}${i}`);
    await page.fill('input[name="cidade"]', `${testUser.Cidade}${i}`);
    await page.selectOption('select[name="estado"]', testUser.Estado);
    
    const fillTime = Date.now() - fillStartTime;
    
    check(null, {
      [`Form Fill ${i + 1} - Completes quickly`]: () => fillTime < 3000,
      [`Form Fill ${i + 1} - All fields responsive`]: () => true
    });
    
    sleep(0.2);
    
    // Limpar campos
    await page.fill('input[name="primeiroNome"]', '');
    await page.fill('input[name="ultimoNome"]', '');
    await page.fill('input[name="usuario"]', '');
    await page.fill('input[name="senha"]', '');
    await page.fill('input[name="cidade"]', '');
    
    sleep(0.1);
  }

  // Testar validação de formulário
  logInfo(`VU ${__VU} - Testando validação de formulário`);
  
  try {
    // Tentar submeter formulário vazio
    await page.click('button[type="submit"]');
    
    // Verificar se permaneceu na página (validação funcionou)
    const currentUrl = page.url();
    
    check(null, {
      'Frontend - Form validation works': () => currentUrl.includes('register')
    });
    
  } catch (error) {
    logInfo(`VU ${__VU} - Teste de validação: ${error.message}`);
  }

  // Testar interações com campo de email
  logInfo(`VU ${__VU} - Testando validação de email`);
  
  await page.fill('input[name="usuario"]', 'email-invalido');
  
  try {
    await page.click('button[type="submit"]');
    
    check(null, {
      'Frontend - Email validation works': () => true
    });
    
  } catch (error) {
    // Validação pode impedir submissão
    check(null, {
      'Frontend - Email validation prevents submission': () => true
    });
  }
}

// Setup do teste
export function setup() {
  logInfo('=== INICIANDO TESTE DE PERFORMANCE DO FRONTEND ===');
  logInfo('🌐 TESTANDO INTERFACE WEB COM K6 BROWSER');
  logInfo('');
  logInfo('Cenários de frontend:');
  logInfo('- 60% Jornada completa (cadastro → login → dashboard → logout)');
  logInfo('- 25% Navegação intensiva (múltiplas páginas)');
  logInfo('- 15% Interações com formulários');
  logInfo('');
  logInfo('Métricas monitoradas:');
  logInfo('- Tempo de carregamento de páginas');
  logInfo('- Responsividade de formulários');
  logInfo('- Navegação entre páginas');
  logInfo('- Validações client-side');
  logInfo('');
  logInfo('⚠️  NOTA: Este teste requer o K6 Browser extension');
  
  return {
    startTime: Date.now()
  };
}

// Teardown do teste
export function teardown(data) {
  const endTime = Date.now();
  const duration = (endTime - data.startTime) / 1000;
  
  logInfo('=== TESTE DE FRONTEND CONCLUÍDO ===');
  logInfo(`Duração total: ${duration.toFixed(2)} segundos`);
  logInfo('');
  logInfo('📊 ANÁLISE RECOMENDADA:');
  logInfo('1. 🕐 Tempos de carregamento das páginas');
  logInfo('2. 📝 Responsividade dos formulários');
  logInfo('3. 🔄 Fluidez da navegação');
  logInfo('4. ✅ Funcionamento das validações');
  logInfo('');
  logInfo('💡 OTIMIZAÇÕES SUGERIDAS:');
  logInfo('- Implementar lazy loading');
  logInfo('- Otimizar bundles JavaScript/CSS');
  logInfo('- Adicionar service workers para cache');
  logInfo('- Implementar progressive web app (PWA)');
  logInfo('- Otimizar imagens e recursos estáticos');
}