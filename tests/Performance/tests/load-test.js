// Load Test - Teste de carga normal
import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from '../config/environments.js';
import { generateUser } from '../utils/data-generator.js';
import { checkResponse, logInfo, defaultHeaders, randomSleep } from '../utils/helpers.js';
import { thresholds } from '../utils/thresholds.js';

// Configurações do teste de carga
export const options = {
  stages: [
    { duration: '1m', target: 20 },   // Ramp-up para 20 usuários em 1min
    { duration: '3m', target: 50 },   // Manter 50 usuários por 3min
    { duration: '1m', target: 0 }     // Ramp-down para 0 usuários em 1min
  ],
  thresholds: thresholds.load
};

// Função principal do teste
export default function() {
  // Simular diferentes tipos de usuário com pesos diferentes
  const userBehaviors = [
    { name: 'browser', weight: 40 },      // 40% dos usuários navegam
    { name: 'api_user', weight: 30 },     // 30% fazem operações CRUD
    { name: 'auth_user', weight: 20 },    // 20% fazem login/logout
    { name: 'email_user', weight: 10 }    // 10% enviam emails
  ];

  // Selecionar comportamento baseado no peso
  const randomValue = Math.random() * 100;
  let cumulativeWeight = 0;
  let selectedBehavior = 'browser';

  for (const behavior of userBehaviors) {
    cumulativeWeight += behavior.weight;
    if (randomValue <= cumulativeWeight) {
      selectedBehavior = behavior.name;
      break;
    }
  }

  // Executar comportamento selecionado
  switch (selectedBehavior) {
    case 'browser':
      browserUserBehavior();
      break;
    case 'api_user':
      apiUserBehavior();
      break;
    case 'auth_user':
      authUserBehavior();
      break;
    case 'email_user':
      emailUserBehavior();
      break;
  }
}

// Comportamento 1: Usuário navegando (40% dos usuários)
function browserUserBehavior() {
  logInfo(`VU ${__VU} - Comportamento: Navegação no site`);

  // 1. Acessar página inicial
  let homeResponse = http.get(config.frontendUrl, {
    tags: { name: 'home_page', behavior: 'browser' }
  });
  
  check(homeResponse, {
    'Home - Status 200': (r) => r.status === 200,
    'Home - Load time acceptable': (r) => r.timings.duration < 3000
  });

  randomSleep(1, 3);

  // 2. Ir para página de cadastro
  let registerResponse = http.get(`${config.frontendUrl}/register`, {
    tags: { name: 'register_page', behavior: 'browser' }
  });
  
  check(registerResponse, {
    'Register page - Status 200': (r) => r.status === 200,
    'Register page - Load time acceptable': (r) => r.timings.duration < 2000
  });

  randomSleep(2, 4);

  // 3. Ir para página de login
  let loginPageResponse = http.get(`${config.frontendUrl}/login`, {
    tags: { name: 'login_page', behavior: 'browser' }
  });
  
  check(loginPageResponse, {
    'Login page - Status 200': (r) => r.status === 200,
    'Login page - Load time acceptable': (r) => r.timings.duration < 2000
  });

  randomSleep(1, 2);

  // 4. Simular algumas requisições para recursos estáticos (CSS, JS)
  let staticResponse = http.get(`${config.frontendUrl}/assets/index.js`, {
    tags: { name: 'static_assets', behavior: 'browser' }
  });
  // Não verificar erro aqui pois pode não existir
}

// Comportamento 2: Usuário da API fazendo CRUD (30% dos usuários)
function apiUserBehavior() {
  logInfo(`VU ${__VU} - Comportamento: Operações CRUD na API`);

  const testUser = generateUser();

  // 1. Listar usuários existentes
  let listResponse = http.get(`${config.apiUrl}/clientes`, {
    tags: { name: 'api_list', behavior: 'api_user' }
  });
  
  check(listResponse, {
    'API List - Status 200': (r) => r.status === 200,
    'API List - Response time OK': (r) => r.timings.duration < 2000
  });

  randomSleep(0.5, 1.5);

  // 2. Criar novo usuário
  let createResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(testUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'api_create', behavior: 'api_user' }
    }
  );

  let userId;
  let createSuccess = check(createResponse, {
    'API Create - Status 201': (r) => r.status === 201,
    'API Create - Response time OK': (r) => r.timings.duration < 3000
  });

  if (createSuccess) {
    try {
      userId = JSON.parse(createResponse.body).id;
    } catch (e) {
      logInfo(`VU ${__VU} - Erro ao extrair ID do usuário`);
    }
  }

  randomSleep(1, 2);

  // 3. Buscar usuário criado (se criado com sucesso)
  if (userId) {
    let getResponse = http.get(`${config.apiUrl}/clientes/${userId}`, {
      tags: { name: 'api_get', behavior: 'api_user' }
    });
    
    check(getResponse, {
      'API Get - Status 200': (r) => r.status === 200,
      'API Get - Response time OK': (r) => r.timings.duration < 1500
    });
  }

  randomSleep(0.5, 1);
}

// Comportamento 3: Usuário fazendo autenticação (20% dos usuários)
function authUserBehavior() {
  logInfo(`VU ${__VU} - Comportamento: Fluxo de autenticação`);

  const testUser = generateUser();

  // 1. Primeiro criar usuário
  let createResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(testUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'auth_create', behavior: 'auth_user' }
    }
  );

  randomSleep(1, 2);

  // 2. Fazer login com usuário criado
  let loginData = {
    Usuario: testUser.Usuario,
    Senha: testUser.Senha
  };

  let loginResponse = http.post(
    `${config.apiUrl}/login`,
    JSON.stringify(loginData),
    { 
      headers: defaultHeaders,
      tags: { name: 'auth_login', behavior: 'auth_user' }
    }
  );

  check(loginResponse, {
    'Auth Login - Status 200': (r) => r.status === 200,
    'Auth Login - Response time OK': (r) => r.timings.duration < 2500,
    'Auth Login - Success': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Sucesso === true;
      } catch (e) {
        return false;
      }
    }
  });

  randomSleep(2, 4);

  // 3. Simular algumas atividades pós-login (listar dados)
  let profileResponse = http.get(`${config.apiUrl}/clientes`, {
    tags: { name: 'auth_profile', behavior: 'auth_user' }
  });

  check(profileResponse, {
    'Auth Profile - Status 200': (r) => r.status === 200
  });

  randomSleep(1, 2);
}

// Comportamento 4: Usuário enviando emails (10% dos usuários)
function emailUserBehavior() {
  logInfo(`VU ${__VU} - Comportamento: Envio de emails`);

  const testUser = generateUser();

  // 1. Criar usuário primeiro
  let createResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(testUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'email_create', behavior: 'email_user' }
    }
  );

  randomSleep(1, 2);

  // 2. Enviar email para usuário criado
  if (createResponse.status === 201) {
    let emailData = {
      Email: testUser.Usuario
    };

    let mailingResponse = http.post(
      `${config.apiUrl}/mailing`,
      JSON.stringify(emailData),
      { 
        headers: defaultHeaders,
        tags: { name: 'email_send', behavior: 'email_user' }
      }
    );

    check(mailingResponse, {
      'Email Send - Status 200': (r) => r.status === 200,
      'Email Send - Response time OK': (r) => r.timings.duration < 5000,
      'Email Send - Success': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.Sucesso === true;
        } catch (e) {
          return false;
        }
      }
    });
  }

  randomSleep(2, 3);

  // 3. Tentar enviar para email inexistente (cenário real)
  let invalidEmailData = {
    Email: `inexistente.${Date.now()}@test.com`
  };

  let invalidMailingResponse = http.post(
    `${config.apiUrl}/mailing`,
    JSON.stringify(invalidEmailData),
    { 
      headers: defaultHeaders,
      tags: { name: 'email_invalid', behavior: 'email_user' }
    }
  );

  check(invalidMailingResponse, {
    'Email Invalid - Status 200': (r) => r.status === 200,
    'Email Invalid - Failure expected': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Sucesso === false;
      } catch (e) {
        return false;
      }
    }
  });

  randomSleep(1, 2);
}

// Setup do teste
export function setup() {
  logInfo('=== INICIANDO TESTE DE CARGA INOVATECH ===');
  logInfo('Simulando carga normal de usuários com diferentes comportamentos:');
  logInfo('- 40% Navegação no site');
  logInfo('- 30% Operações CRUD na API');
  logInfo('- 20% Fluxos de autenticação');
  logInfo('- 10% Envio de emails');
  
  return {
    startTime: Date.now()
  };
}

// Teardown do teste
export function teardown(data) {
  const endTime = Date.now();
  const duration = (endTime - data.startTime) / 1000;
  
  logInfo('=== TESTE DE CARGA CONCLUÍDO ===');
  logInfo(`Duração total: ${duration.toFixed(2)} segundos`);
  logInfo('Verifique as métricas para análise de performance sob carga normal');
}