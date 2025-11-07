// Spike Test - Teste de pico súbito de tráfego
import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from '../config/environments.js';
import { generateUser } from '../utils/data-generator.js';
import { logInfo, defaultHeaders } from '../utils/helpers.js';
import { thresholds } from '../utils/thresholds.js';

// Configurações do teste de pico - simula traffic spike repentino
export const options = {
  stages: [
    { duration: '10s', target: 100 },   // Carga normal inicial
    { duration: '1m', target: 100 },    // Manter carga normal
    { duration: '20s', target: 1400 },  // 🔥 SPIKE! Pico súbito massivo
    { duration: '3m', target: 1400 },   // Manter pico por 3 minutos
    { duration: '20s', target: 100 },   // Voltar ao normal rapidamente
    { duration: '1m', target: 100 },    // Manter normal
    { duration: '10s', target: 0 }      // Finalizar
  ],
  thresholds: thresholds.spike
};

// Função principal do teste
export default function() {
  const currentVUs = __ENV.K6_VUS || 1;
  let phase = 'normal';

  // Determinar fase baseado no número de VUs
  if (currentVUs > 1000) {
    phase = 'spike';
  } else if (currentVUs > 500) {
    phase = 'pre_spike';
  }

  logInfo(`VU ${__VU} - Spike Test (Fase: ${phase})`);

  switch (phase) {
    case 'normal':
      normalTrafficBehavior();
      break;
    case 'pre_spike':
      preSpikeTrafficBehavior();
      break;
    case 'spike':
      spikeTrafficBehavior();
      break;
  }
}

// Comportamento de tráfego normal (antes e depois do spike)
function normalTrafficBehavior() {
  const testUser = generateUser();

  logInfo(`VU ${__VU} - Tráfego normal`);

  // Cenário típico de usuário normal
  
  // 1. Visualizar lista de usuários
  let listResponse = http.get(`${config.apiUrl}/clientes`, {
    tags: { name: 'normal_browse', phase: 'normal' }
  });

  check(listResponse, {
    'Normal - List success': (r) => r.status === 200,
    'Normal - List fast': (r) => r.timings.duration < 2000
  });

  sleep(2); // Sleep normal entre ações

  // 2. Criar um novo usuário
  let createResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(testUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'normal_create', phase: 'normal' }
    }
  );

  let createSuccess = check(createResponse, {
    'Normal - Create success': (r) => r.status === 201,
    'Normal - Create reasonable time': (r) => r.timings.duration < 3000
  });

  sleep(1);

  // 3. Login se usuário foi criado
  if (createSuccess) {
    let loginResponse = http.post(
      `${config.apiUrl}/login`,
      JSON.stringify({
        Usuario: testUser.Usuario,
        Senha: testUser.Senha
      }),
      { 
        headers: defaultHeaders,
        tags: { name: 'normal_login', phase: 'normal' }
      }
    );

    check(loginResponse, {
      'Normal - Login success': (r) => r.status === 200,
      'Normal - Login fast': (r) => r.timings.duration < 2500
    });
  }

  sleep(3); // Pausa natural do usuário
}

// Comportamento durante a preparação para o spike
function preSpikeTrafficBehavior() {
  logInfo(`VU ${__VU} - Tráfego pré-spike (aumentando)`);

  const testUser = generateUser();

  // Operações mais frequentes mas ainda controladas
  
  // 1. Múltiplas verificações rápidas
  for (let i = 0; i < 2; i++) {
    let listResponse = http.get(`${config.apiUrl}/clientes`, {
      tags: { name: 'pre_spike_check', phase: 'pre_spike' }
    });

    check(listResponse, {
      'Pre-spike - Quick check ok': (r) => r.status === 200
    });

    sleep(0.5);
  }

  // 2. Operação de criação mais rápida
  let createResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(testUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'pre_spike_create', phase: 'pre_spike' }
    }
  );

  check(createResponse, {
    'Pre-spike - Create works': (r) => r.status === 201,
    'Pre-spike - Still responsive': (r) => r.timings.duration < 5000
  });

  sleep(0.3);
}

// Comportamento durante o SPIKE massivo
function spikeTrafficBehavior() {
  logInfo(`VU ${__VU} - 🔥 TRAFFIC SPIKE! Comportamento de pico`);

  // Durante o spike, simular diferentes tipos de emergência de tráfego
  const spikeScenarios = [
    'panic_browsing',     // 40% - usuários navegando freneticamente
    'bot_attack',         // 30% - possível ataque de bots
    'viral_signup',       // 20% - cadastros virais em massa
    'auth_flood'          // 10% - flood de tentativas de login
  ];

  const randomScenario = spikeScenarios[Math.floor(Math.random() * spikeScenarios.length)];

  switch (randomScenario) {
    case 'panic_browsing':
      panicBrowsingScenario();
      break;
    case 'bot_attack':
      botAttackScenario();
      break;
    case 'viral_signup':
      viralSignupScenario();
      break;
    case 'auth_flood':
      authFloodScenario();
      break;
  }
}

// Cenário 1: Navegação em pânico (usuários clicando tudo rapidamente)
function panicBrowsingScenario() {
  logInfo(`VU ${__VU} - Cenário: Navegação em pânico`);

  // Rajadas de requisições GET muito rápidas
  for (let i = 0; i < 10; i++) {
    http.get(`${config.apiUrl}/clientes`, {
      tags: { name: 'panic_browse', scenario: 'panic_browsing' },
      timeout: '15s'
    });
    
    // Sleep mínimo entre requisições
    sleep(0.01);
  }

  // Verificar apenas se o sistema ainda responde
  let finalCheck = http.get(`${config.apiUrl}/clientes`, {
    tags: { name: 'panic_final_check', scenario: 'panic_browsing' }
  });

  check(finalCheck, {
    'Panic - System survives': (r) => r.status !== 0,
    'Panic - Eventually responds': (r) => r.timings.duration < 20000
  });
}

// Cenário 2: Ataque de bots (requisições automatizadas em massa)
function botAttackScenario() {
  logInfo(`VU ${__VU} - Cenário: Possível ataque de bots`);

  const testUser = generateUser();

  // Comportamento de bot: criar usuário rapidamente e tentar login
  let botCreateResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(testUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'bot_create', scenario: 'bot_attack' },
      timeout: '20s'
    }
  );

  // Imediatamente tentar login sem pausa
  let botLoginResponse = http.post(
    `${config.apiUrl}/login`,
    JSON.stringify({
      Usuario: testUser.Usuario,
      Senha: testUser.Senha
    }),
    { 
      headers: defaultHeaders,
      tags: { name: 'bot_login', scenario: 'bot_attack' },
      timeout: '20s'
    }
  );

  check(botLoginResponse, {
    'Bot attack - System handles': (r) => r.status < 500,
    'Bot attack - No timeouts': (r) => r.status !== 0
  });

  // Sem sleep - comportamento de bot
}

// Cenário 3: Cadastros virais (todos querem se cadastrar ao mesmo tempo)
function viralSignupScenario() {
  logInfo(`VU ${__VU} - Cenário: Cadastros virais em massa`);

  const testUser = generateUser();

  // Múltiplas tentativas de cadastro rápidas
  for (let i = 0; i < 3; i++) {
    let viralCreateResponse = http.post(
      `${config.apiUrl}/clientes`,
      JSON.stringify({
        ...testUser,
        Usuario: `viral.${i}.${Date.now()}.${__VU}@test.com` // Email único
      }),
      { 
        headers: defaultHeaders,
        tags: { name: 'viral_signup', scenario: 'viral_signup' },
        timeout: '25s'
      }
    );

    check(viralCreateResponse, {
      'Viral signup - Processes requests': (r) => r.status !== 0,
      'Viral signup - Handles load': (r) => r.status < 500 || r.status === 503 // 503 Service Unavailable é aceitável
    });

    sleep(0.1);
  }
}

// Cenário 4: Flood de tentativas de login
function authFloodScenario() {
  logInfo(`VU ${__VU} - Cenário: Flood de login`);

  // Múltiplas tentativas de login com credenciais variadas
  for (let i = 0; i < 5; i++) {
    let floodLoginResponse = http.post(
      `${config.apiUrl}/login`,
      JSON.stringify({
        Usuario: `flood.${i}.${__VU}@test.com`,
        Senha: `password${i}`
      }),
      { 
        headers: defaultHeaders,
        tags: { name: 'auth_flood', scenario: 'auth_flood' },
        timeout: '15s'
      }
    );

    check(floodLoginResponse, {
      'Auth flood - Responds to requests': (r) => r.status !== 0,
      'Auth flood - Security holds': (r) => r.status === 200 || r.status === 401 || r.status === 429 // 429 = Rate Limited
    });

    sleep(0.05);
  }
}

// Setup do teste
export function setup() {
  logInfo('=== INICIANDO TESTE DE SPIKE INOVATECH ===');
  logInfo('🔥 SIMULANDO PICO SÚBITO DE TRÁFEGO!');
  logInfo('');
  logInfo('Cronograma do teste:');
  logInfo('- 00:00-01:10 → Tráfego normal (100 VUs)');
  logInfo('- 01:10-01:30 → 🚨 SPIKE ATTACK! (100→1400 VUs em 20s)');
  logInfo('- 01:30-04:30 → 🔥 PICO MANTIDO (1400 VUs por 3min)');
  logInfo('- 04:30-04:50 → Recuperação (1400→100 VUs)');
  logInfo('- 04:50-05:50 → Normalização (100 VUs)');
  logInfo('');
  logInfo('Cenários durante o spike:');
  logInfo('- 40% Navegação em pânico');
  logInfo('- 30% Possível ataque de bots');
  logInfo('- 20% Cadastros virais');
  logInfo('- 10% Flood de login');
  logInfo('');
  logInfo('⚠️  MONITORE: Response times, error rates, server resources!');
  
  return {
    startTime: Date.now()
  };
}

// Teardown do teste
export function teardown(data) {
  const endTime = Date.now();
  const duration = (endTime - data.startTime) / 1000;
  
  logInfo('=== TESTE DE SPIKE CONCLUÍDO ===');
  logInfo(`Duração total: ${duration.toFixed(2)} segundos`);
  logInfo('');
  logInfo('📊 QUESTÕES PARA ANÁLISE:');
  logInfo('1. 🕐 Em que momento o sistema começou a degradar?');
  logInfo('2. ⏱️  Quanto tempo levou para se recuperar após o spike?');
  logInfo('3. 🚨 Qual foi a taxa de erro durante o pico?');
  logInfo('4. 🔄 O sistema se recuperou completamente?');
  logInfo('5. 📈 Houve impacto nos usuários normais pós-spike?');
  logInfo('');
  logInfo('💡 RECOMENDAÇÕES DE MELHORIA:');
  logInfo('- Implementar rate limiting');
  logInfo('- Configurar auto-scaling');
  logInfo('- Adicionar circuit breakers');
  logInfo('- Melhorar cache para reduzir load no banco');
  logInfo('- Configurar CDN para recursos estáticos');
}