// Soak Test - Teste de resistência (long-running)
import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from '../config/environments.js';
import { generateUser } from '../utils/data-generator.js';
import { logInfo, defaultHeaders, randomSleep } from '../utils/helpers.js';
import { thresholds } from '../utils/thresholds.js';

// Configurações do teste de resistência - executa por período prolongado
export const options = {
  stages: [
    { duration: '5m', target: 50 },     // Ramp-up gradual
    { duration: '1h', target: 100 },    // 🕐 1 HORA de carga constante
    { duration: '5m', target: 0 }       // Ramp-down
  ],
  thresholds: thresholds.soak
};

// Variáveis para monitorar ao longo do tempo
let performanceMetrics = {
  startTime: null,
  responseTimes: [],
  errorCounts: { total: 0, by_endpoint: {} },
  operationCounts: { total: 0, by_type: {} },
  memoryLeakIndicators: []
};

// Função principal do teste
export default function() {
  if (!performanceMetrics.startTime) {
    performanceMetrics.startTime = Date.now();
  }

  const elapsedMinutes = (Date.now() - performanceMetrics.startTime) / (1000 * 60);
  const testPhase = getTestPhase(elapsedMinutes);
  
  logInfo(`VU ${__VU} - Soak Test (${elapsedMinutes.toFixed(1)}min) - Fase: ${testPhase}`);

  // Executar comportamento baseado na fase do teste
  switch (testPhase) {
    case 'warmup':
      warmupBehavior();
      break;
    case 'early':
      earlyBehavior();
      break;
    case 'middle':
      middleBehavior();
      break;
    case 'late':
      lateBehavior();
      break;
    case 'cooldown':
      cooldownBehavior();
      break;
  }

  // Coletar métricas para análise de degradação ao longo do tempo
  collectMetrics(testPhase);
}

// Determinar fase do teste baseado no tempo decorrido
function getTestPhase(elapsedMinutes) {
  if (elapsedMinutes < 5) return 'warmup';
  if (elapsedMinutes < 20) return 'early';
  if (elapsedMinutes < 40) return 'middle';
  if (elapsedMinutes < 60) return 'late';
  return 'cooldown';
}

// Comportamento durante aquecimento (0-5 min)
function warmupBehavior() {
  logInfo(`VU ${__VU} - Fase de aquecimento`);
  
  const testUser = generateUser();

  // Operações básicas para aquecer o sistema
  
  // 1. Verificação de conectividade
  let healthResponse = http.get(`${config.apiUrl}/clientes`, {
    tags: { name: 'soak_warmup_health', phase: 'warmup' }
  });

  let healthOk = check(healthResponse, {
    'Warmup - API responding': (r) => r.status === 200,
    'Warmup - Response time baseline': (r) => r.timings.duration < 3000
  });

  recordMetric('health_check', healthResponse.timings.duration, healthOk);
  
  sleep(2);

  // 2. Operação básica de criação
  let createResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(testUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'soak_warmup_create', phase: 'warmup' }
    }
  );

  let createOk = check(createResponse, {
    'Warmup - Create works': (r) => r.status === 201,
    'Warmup - Create time reasonable': (r) => r.timings.duration < 4000
  });

  recordMetric('create_user', createResponse.timings.duration, createOk);

  sleep(3);
}

// Comportamento no início (5-20 min)
function earlyBehavior() {
  logInfo(`VU ${__VU} - Fase inicial do soak test`);
  
  const testUser = generateUser();

  // Cenário completo de usuário típico
  
  // 1. Listar usuários
  let listResponse = http.get(`${config.apiUrl}/clientes`, {
    tags: { name: 'soak_early_list', phase: 'early' }
  });

  let listOk = check(listResponse, {
    'Early - List works': (r) => r.status === 200,
    'Early - List performance good': (r) => r.timings.duration < 2000
  });

  recordMetric('list_users', listResponse.timings.duration, listOk);
  
  randomSleep(1, 3);

  // 2. Criar usuário
  let createResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(testUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'soak_early_create', phase: 'early' }
    }
  );

  let createOk = check(createResponse, {
    'Early - Create successful': (r) => r.status === 201,
    'Early - Create time stable': (r) => r.timings.duration < 3000
  });

  recordMetric('create_user', createResponse.timings.duration, createOk);

  randomSleep(1, 2);

  // 3. Login
  let loginResponse = http.post(
    `${config.apiUrl}/login`,
    JSON.stringify({
      Usuario: testUser.Usuario,
      Senha: testUser.Senha
    }),
    { 
      headers: defaultHeaders,
      tags: { name: 'soak_early_login', phase: 'early' }
    }
  );

  let loginOk = check(loginResponse, {
    'Early - Login works': (r) => r.status === 200,
    'Early - Login responsive': (r) => r.timings.duration < 2500
  });

  recordMetric('login', loginResponse.timings.duration, loginOk);

  randomSleep(2, 4);
}

// Comportamento no meio (20-40 min) - onde problemas podem começar a aparecer
function middleBehavior() {
  logInfo(`VU ${__VU} - Fase média - monitorando degradação`);
  
  const testUser = generateUser();

  // Operações mais intensas para detectar vazamentos de recursos
  
  // 1. Múltiplas operações de leitura
  for (let i = 0; i < 3; i++) {
    let listResponse = http.get(`${config.apiUrl}/clientes`, {
      tags: { name: 'soak_middle_intensive_list', phase: 'middle' }
    });

    let listOk = check(listResponse, {
      [`Middle List ${i} - Still working`]: (r) => r.status === 200,
      [`Middle List ${i} - No degradation`]: (r) => r.timings.duration < 4000 // Mais tolerante
    });

    recordMetric('intensive_list', listResponse.timings.duration, listOk);
    sleep(0.5);
  }

  sleep(1);

  // 2. Operação de criação com verificação imediata
  let createResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(testUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'soak_middle_create', phase: 'middle' }
    }
  );

  let createOk = check(createResponse, {
    'Middle - Create still stable': (r) => r.status === 201,
    'Middle - Create time not degraded': (r) => r.timings.duration < 5000 // Mais tolerante
  });

  recordMetric('create_user', createResponse.timings.duration, createOk);

  // Verificação imediata se usuário foi criado
  if (createResponse.status === 201) {
    let userId;
    try {
      userId = JSON.parse(createResponse.body).id;
    } catch (e) {
      logInfo(`VU ${__VU} - Erro ao extrair ID na fase média`);
    }

    if (userId) {
      let getResponse = http.get(`${config.apiUrl}/clientes/${userId}`, {
        tags: { name: 'soak_middle_immediate_read', phase: 'middle' }
      });

      let readOk = check(getResponse, {
        'Middle - Immediate read works': (r) => r.status === 200,
        'Middle - Read consistency maintained': (r) => r.timings.duration < 3000
      });

      recordMetric('immediate_read', getResponse.timings.duration, readOk);
    }
  }

  randomSleep(2, 4);

  // 3. Teste de mailing (operação mais pesada)
  let mailingResponse = http.post(
    `${config.apiUrl}/mailing`,
    JSON.stringify({
      Email: testUser.Usuario
    }),
    { 
      headers: defaultHeaders,
      tags: { name: 'soak_middle_mailing', phase: 'middle' }
    }
  );

  let mailingOk = check(mailingResponse, {
    'Middle - Mailing still works': (r) => r.status === 200,
    'Middle - Mailing not too slow': (r) => r.timings.duration < 8000
  });

  recordMetric('mailing', mailingResponse.timings.duration, mailingOk);

  randomSleep(1, 3);
}

// Comportamento no final (40-60 min) - detectar fadiga do sistema
function lateBehavior() {
  logInfo(`VU ${__VU} - Fase final - verificando fadiga do sistema`);
  
  const testUser = generateUser();

  // Operações críticas para detectar falhas de resistência
  
  // 1. Teste de conectividade básica
  let healthResponse = http.get(`${config.apiUrl}/clientes`, {
    tags: { name: 'soak_late_health', phase: 'late' }
  });

  let healthOk = check(healthResponse, {
    'Late - System still alive': (r) => r.status === 200,
    'Late - Not completely degraded': (r) => r.timings.duration < 10000 // Muito tolerante
  });

  recordMetric('health_check', healthResponse.timings.duration, healthOk);

  if (!healthOk) {
    logInfo(`VU ${__VU} - ⚠️ ALERTA: Sistema mostrando sinais de fadiga!`);
  }

  sleep(2);

  // 2. Operação crítica de criação
  let createResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(testUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'soak_late_create', phase: 'late' },
      timeout: '30s' // Timeout maior para sistemas fatigados
    }
  );

  let createOk = check(createResponse, {
    'Late - Can still create users': (r) => r.status === 201,
    'Late - Create eventually works': (r) => r.timings.duration < 15000,
    'Late - No system errors': (r) => r.status !== 500 && r.status !== 0
  });

  recordMetric('create_user', createResponse.timings.duration, createOk);

  if (!createOk) {
    logInfo(`VU ${__VU} - ⚠️ ALERTA: Criação de usuários falhando após longo período!`);
  }

  randomSleep(3, 6);

  // 3. Login crítico
  let loginResponse = http.post(
    `${config.apiUrl}/login`,
    JSON.stringify({
      Usuario: testUser.Usuario,
      Senha: testUser.Senha
    }),
    { 
      headers: defaultHeaders,
      tags: { name: 'soak_late_login', phase: 'late' },
      timeout: '20s'
    }
  );

  let loginOk = check(loginResponse, {
    'Late - Auth still functioning': (r) => r.status === 200,
    'Late - Auth responsive enough': (r) => r.timings.duration < 10000
  });

  recordMetric('login', loginResponse.timings.duration, loginOk);

  randomSleep(2, 5);
}

// Comportamento durante cooldown (60+ min)
function cooldownBehavior() {
  logInfo(`VU ${__VU} - Fase de cooldown - verificando recuperação`);
  
  // Operações leves para permitir recuperação do sistema
  let gentleResponse = http.get(`${config.apiUrl}/clientes`, {
    tags: { name: 'soak_cooldown', phase: 'cooldown' }
  });

  check(gentleResponse, {
    'Cooldown - System recovering': (r) => r.status === 200,
    'Cooldown - Performance improving': (r) => r.timings.duration < 5000
  });

  recordMetric('cooldown_check', gentleResponse.timings.duration, true);

  sleep(5); // Sleep maior para permitir recuperação
}

// Função para registrar métricas para análise posterior
function recordMetric(operation, duration, success) {
  performanceMetrics.operationCounts.total++;
  
  if (!performanceMetrics.operationCounts.by_type[operation]) {
    performanceMetrics.operationCounts.by_type[operation] = 0;
  }
  performanceMetrics.operationCounts.by_type[operation]++;

  if (!success) {
    performanceMetrics.errorCounts.total++;
    if (!performanceMetrics.errorCounts.by_endpoint[operation]) {
      performanceMetrics.errorCounts.by_endpoint[operation] = 0;
    }
    performanceMetrics.errorCounts.by_endpoint[operation]++;
  }

  // Detectar possíveis vazamentos de memória (tempos crescentes consistentemente)
  performanceMetrics.responseTimes.push({
    operation: operation,
    duration: duration,
    timestamp: Date.now(),
    success: success
  });

  // Manter apenas últimas 100 métricas para evitar uso excessivo de memória
  if (performanceMetrics.responseTimes.length > 100) {
    performanceMetrics.responseTimes.shift();
  }
}

// Função para coletar métricas adicionais
function collectMetrics(phase) {
  // A cada 5 minutos, log estatísticas
  if (performanceMetrics.operationCounts.total % 50 === 0) {
    logInfo(`📊 Métricas até agora (${phase}):`);
    logInfo(`   Total de operações: ${performanceMetrics.operationCounts.total}`);
    logInfo(`   Total de erros: ${performanceMetrics.errorCounts.total}`);
    logInfo(`   Taxa de erro: ${((performanceMetrics.errorCounts.total / performanceMetrics.operationCounts.total) * 100).toFixed(2)}%`);
  }
}

// Setup do teste
export function setup() {
  logInfo('=== INICIANDO SOAK TEST INOVATECH ===');
  logInfo('🕐 TESTE DE RESISTÊNCIA DE LONGA DURAÇÃO (1 HORA)');
  logInfo('');
  logInfo('Cronograma do teste:');
  logInfo('- 00:00-05:00 → Aquecimento (ramp-up gradual)');
  logInfo('- 05:00-20:00 → Fase inicial (performance baseline)');
  logInfo('- 20:00-40:00 → Fase média (detectar degradação)');
  logInfo('- 40:00-60:00 → Fase final (verificar fadiga)');
  logInfo('- 60:00-65:00 → Cooldown (recuperação)');
  logInfo('');
  logInfo('🎯 OBJETIVOS:');
  logInfo('- Detectar memory leaks');
  logInfo('- Identificar degradação de performance');
  logInfo('- Verificar estabilidade de conexões DB');
  logInfo('- Monitorar consumo de recursos');
  logInfo('');
  logInfo('⚠️  MONITORE CONTINUAMENTE:');
  logInfo('- Uso de memória (heap/stack)');
  logInfo('- Conexões de banco ativas');
  logInfo('- Handles/file descriptors');
  logInfo('- Logs de erro do sistema');
  
  performanceMetrics.startTime = Date.now();
  
  return {
    testStartTime: Date.now()
  };
}

// Teardown do teste
export function teardown(data) {
  const endTime = Date.now();
  const duration = (endTime - data.testStartTime) / (1000 * 60); // em minutos
  
  logInfo('=== SOAK TEST CONCLUÍDO ===');
  logInfo(`Duração total: ${duration.toFixed(1)} minutos`);
  logInfo('');
  
  // Relatório final de métricas
  logInfo('📊 RELATÓRIO FINAL:');
  logInfo(`   Total de operações: ${performanceMetrics.operationCounts.total}`);
  logInfo(`   Total de erros: ${performanceMetrics.errorCounts.total}`);
  logInfo(`   Taxa de erro final: ${((performanceMetrics.errorCounts.total / performanceMetrics.operationCounts.total) * 100).toFixed(2)}%`);
  
  // Análise de degradação de performance
  if (performanceMetrics.responseTimes.length > 10) {
    const firstHalf = performanceMetrics.responseTimes.slice(0, Math.floor(performanceMetrics.responseTimes.length / 2));
    const secondHalf = performanceMetrics.responseTimes.slice(Math.floor(performanceMetrics.responseTimes.length / 2));
    
    const avgFirst = firstHalf.reduce((sum, m) => sum + m.duration, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((sum, m) => sum + m.duration, 0) / secondHalf.length;
    
    const degradationPercent = ((avgSecond - avgFirst) / avgFirst * 100);
    
    logInfo(`   Performance - Primeira metade: ${avgFirst.toFixed(0)}ms`);
    logInfo(`   Performance - Segunda metade: ${avgSecond.toFixed(0)}ms`);
    logInfo(`   Degradação de performance: ${degradationPercent.toFixed(1)}%`);
    
    if (degradationPercent > 50) {
      logInfo('   ⚠️ ALERTA: Degradação significativa detectada!');
    } else if (degradationPercent > 20) {
      logInfo('   ⚠️ ATENÇÃO: Degradação moderada detectada');
    } else {
      logInfo('   ✅ Performance mantida estável');
    }
  }
  
  logInfo('');
  logInfo('🔍 PRÓXIMOS PASSOS:');
  logInfo('1. Analisar logs do sistema durante o período do teste');
  logInfo('2. Verificar se recursos foram liberados corretamente');
  logInfo('3. Monitorar sistema nas próximas horas para recuperação');
  logInfo('4. Identificar pontos de melhoria baseados nas métricas');
}