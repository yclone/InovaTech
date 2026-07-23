// Stress Test - Teste de estresse para encontrar limites do sistema
import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from '../config/environments.js';
import { generateUser } from '../utils/data-generator.js';
import { logInfo, defaultHeaders } from '../utils/helpers.js';
import { thresholds } from '../utils/thresholds.js';

// Configurações do teste de estresse - aumenta gradualmente até encontrar limite
export const options = {
  stages: [
    { duration: '2m', target: 100 },    // Ramp-up para 100 usuários
    { duration: '5m', target: 200 },    // Aumentar para 200 usuários
    { duration: '2m', target: 300 },    // Aumentar para 300 usuários
    { duration: '5m', target: 400 },    // Testar com 400 usuários
    { duration: '10m', target: 400 },   // Manter carga alta por 10min
    { duration: '5m', target: 0 }       // Ramp-down
  ],
  thresholds: thresholds.stress
};

// Função principal do teste
export default function() {
  // Determinar fase do teste baseado no VU atual
  const currentVUs = __ENV.K6_VUS || 1;
  let intensity = 'low';
  
  if (currentVUs > 300) {
    intensity = 'extreme';
  } else if (currentVUs > 200) {
    intensity = 'high';
  } else if (currentVUs > 100) {
    intensity = 'medium';
  }

  logInfo(`VU ${__VU} - Stress Test (Intensidade: ${intensity}, VUs atuais: ~${currentVUs})`);

  // Executar cenários diferentes baseados na intensidade
  switch (intensity) {
    case 'low':
      lowStressScenario();
      break;
    case 'medium':
      mediumStressScenario();
      break;
    case 'high':
      highStressScenario();
      break;
    case 'extreme':
      extremeStressScenario();
      break;
  }
}

// Cenário de estresse baixo (1-100 VUs)
function lowStressScenario() {
  const testUser = generateUser();

  // Operações normais com frequência aumentada
  
  // 1. Lista de usuários
  let listResponse = http.get(`${config.apiUrl}/clientes`, {
    tags: { name: 'stress_list', intensity: 'low' }
  });
  
  check(listResponse, {
    'Low Stress List - Success': (r) => r.status === 200,
    'Low Stress List - Time < 3s': (r) => r.timings.duration < 3000
  });

  sleep(0.5); // Sleep reduzido para aumentar carga

  // 2. Criar usuário
  let createResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(testUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'stress_create', intensity: 'low' }
    }
  );

  let userId;
  if (check(createResponse, {
    'Low Stress Create - Success': (r) => r.status === 201
  })) {
    try {
      userId = JSON.parse(createResponse.body).id;
    } catch (e) {
      // Ignore parsing errors under stress
    }
  }

  sleep(0.3);

  // 3. Login
  let loginResponse = http.post(
    `${config.apiUrl}/login`,
    JSON.stringify({
      Usuario: testUser.Usuario,
      Senha: testUser.Senha
    }),
    { 
      headers: defaultHeaders,
      tags: { name: 'stress_login', intensity: 'low' }
    }
  );

  check(loginResponse, {
    'Low Stress Login - Success': (r) => r.status === 200
  });

  sleep(0.2);
}

// Cenário de estresse médio (100-200 VUs)
function mediumStressScenario() {
  const testUser = generateUser();

  // Operações mais frequentes e concorrentes

  // 1. Múltiplas requisições rápidas
  for (let i = 0; i < 3; i++) {
    let listResponse = http.get(`${config.apiUrl}/clientes`, {
      tags: { name: 'stress_rapid_list', intensity: 'medium' }
    });
    
    check(listResponse, {
      'Medium Stress List - Responsive': (r) => r.status === 200 && r.timings.duration < 5000
    });

    sleep(0.1); // Sleep muito reduzido
  }

  // 2. Criar e fazer login rapidamente
  let createResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(testUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'stress_fast_create', intensity: 'medium' }
    }
  );

  if (createResponse.status === 201) {
    // Login imediatamente após criação
    let loginResponse = http.post(
      `${config.apiUrl}/login`,
      JSON.stringify({
        Usuario: testUser.Usuario,
        Senha: testUser.Senha
      }),
      { 
        headers: defaultHeaders,
        tags: { name: 'stress_immediate_login', intensity: 'medium' }
      }
    );

    check(loginResponse, {
      'Medium Stress Immediate Login - Works': (r) => r.status === 200
    });
  }

  sleep(0.1);
}

// Cenário de estresse alto (200-300 VUs)
function highStressScenario() {
  // Operações intensivas sem muito sleep

  // 1. Bombardeio de requisições GET
  for (let i = 0; i < 5; i++) {
    http.get(`${config.apiUrl}/clientes`, {
      tags: { name: 'stress_bombardment', intensity: 'high' },
      timeout: '10s' // Timeout aumentado para condições extremas
    });
  }

  // 2. Tentar criar usuário mesmo sob stress
  const testUser = generateUser();
  let createResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(testUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'stress_heavy_create', intensity: 'high' },
      timeout: '15s'
    }
  );

  check(createResponse, {
    'High Stress Create - Survives': (r) => r.status < 500, // Aceitar 4xx mas não 5xx
    'High Stress Create - Eventually responds': (r) => r.timings.duration < 15000
  });

  // Sleep mínimo
  sleep(0.05);
}

// Cenário de estresse extremo (300+ VUs)
function extremeStressScenario() {
  logInfo(`VU ${__VU} - Executando cenário de estresse EXTREMO`);

  // 1. Requisições com timeout estendido
  let response = http.get(`${config.apiUrl}/clientes`, {
    tags: { name: 'stress_extreme', intensity: 'extreme' },
    timeout: '30s' // Timeout muito alto para condições extremas
  });

  // Verificações mais tolerantes para condições extremas
  check(response, {
    'Extreme Stress - System still alive': (r) => r.status !== 0, // Qualquer resposta é boa
    'Extreme Stress - Not completely dead': (r) => r.timings.duration < 30000,
    'Extreme Stress - No 5xx errors': (r) => r.status < 500 || r.status >= 600
  });

  // 2. Tentar uma operação POST complexa
  const testUser = generateUser();
  let createResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(testUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'stress_extreme_create', intensity: 'extreme' },
      timeout: '30s'
    }
  );

  check(createResponse, {
    'Extreme Create - Attempts to respond': (r) => r.status !== 0,
    'Extreme Create - No complete failure': (r) => r.status !== 500
  });

  // Praticamente sem sleep para máxima pressão
  sleep(0.01);
}

// Setup do teste
export function setup() {
  logInfo('=== INICIANDO TESTE DE ESTRESSE INOVATECH ===');
  logInfo('⚠️  ATENÇÃO: Este teste vai push o sistema aos seus limites!');
  logInfo('Fases do teste:');
  logInfo('- Fase 1 (1-100 VUs): Estresse baixo com operações normais');
  logInfo('- Fase 2 (100-200 VUs): Estresse médio com operações frequentes');
  logInfo('- Fase 3 (200-300 VUs): Estresse alto com bombardeio de requisições');
  logInfo('- Fase 4 (300+ VUs): Estresse extremo - testando sobrevivência');
  logInfo('');
  logInfo('Monitore: CPU, memória, conexões de banco, response times');
  
  return {
    startTime: Date.now()
  };
}

// Teardown do teste
export function teardown(data) {
  const endTime = Date.now();
  const duration = (endTime - data.startTime) / 1000;
  
  logInfo('=== TESTE DE ESTRESSE CONCLUÍDO ===');
  logInfo(`Duração total: ${duration.toFixed(2)} segundos`);
  logInfo('');
  logInfo('📊 ANÁLISE RECOMENDADA:');
  logInfo('1. Verifique em qual ponto as métricas começaram a degradar');
  logInfo('2. Identifique o ponto de ruptura (quando errors > 10%)');
  logInfo('3. Analise logs do servidor para identificar gargalos');
  logInfo('4. Monitore recovery após o fim do teste');
  logInfo('');
  logInfo('⚠️  Se o sistema não se recuperou, verifique:');
  logInfo('- Conexões de banco não fechadas');
  logInfo('- Memory leaks');
  logInfo('- Processos zumbis');
}