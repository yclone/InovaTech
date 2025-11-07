// Breakpoint Test - Teste de ponto de ruptura do sistema
import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from '../config/environments.js';
import { generateUser } from '../utils/data-generator.js';
import { logInfo, defaultHeaders } from '../utils/helpers.js';
import { thresholds } from '../utils/thresholds.js';

// Configurações do teste de breakpoint - aumenta carga até sistema quebrar
export const options = {
  executor: 'ramping-arrival-rate',
  startRate: 10,      // Começar com 10 requisições/segundo
  timeUnit: '1s',
  preAllocatedVUs: 50,
  maxVUs: 2000,       // Máximo de 2000 VUs
  stages: [
    { duration: '5m', target: 50 },    // 50 req/s
    { duration: '5m', target: 100 },   // 100 req/s
    { duration: '5m', target: 200 },   // 200 req/s
    { duration: '5m', target: 400 },   // 400 req/s
    { duration: '5m', target: 800 },   // 800 req/s
    { duration: '5m', target: 1600 },  // 1600 req/s
    { duration: '10m', target: 3200 }, // 3200 req/s - BREAKPOINT!
    { duration: '5m', target: 0 }      // Recovery
  ],
  thresholds: thresholds.breakpoint
};

// Métricas globais para detectar ponto de ruptura
let breakpointMetrics = {
  startTime: null,
  requestsPerSecond: [],
  errorRates: [],
  responseTimes: [],
  breakpointDetected: false,
  breakpointTime: null,
  lastSuccessfulRPS: 0
};

// Função principal do teste
export default function() {
  if (!breakpointMetrics.startTime) {
    breakpointMetrics.startTime = Date.now();
  }

  const elapsedMinutes = (Date.now() - breakpointMetrics.startTime) / (1000 * 60);
  const estimatedRPS = getCurrentEstimatedRPS(elapsedMinutes);
  
  logInfo(`VU ${__VU} - Breakpoint Test (${elapsedMinutes.toFixed(1)}min) - RPS estimado: ${estimatedRPS}`);

  // Executar cenário baseado na carga atual
  if (estimatedRPS < 100) {
    normalLoadScenario();
  } else if (estimatedRPS < 500) {
    mediumLoadScenario();
  } else if (estimatedRPS < 1000) {
    highLoadScenario();
  } else {
    extremeLoadScenario();
  }

  // Coletar métricas para detecção de breakpoint
  collectBreakpointMetrics(estimatedRPS);
}

// Calcular RPS estimado baseado no tempo decorrido
function getCurrentEstimatedRPS(elapsedMinutes) {
  if (elapsedMinutes < 5) return 10 + (elapsedMinutes * 8);      // 10-50
  if (elapsedMinutes < 10) return 50 + ((elapsedMinutes - 5) * 10);   // 50-100
  if (elapsedMinutes < 15) return 100 + ((elapsedMinutes - 10) * 20);  // 100-200
  if (elapsedMinutes < 20) return 200 + ((elapsedMinutes - 15) * 40);  // 200-400
  if (elapsedMinutes < 25) return 400 + ((elapsedMinutes - 20) * 80);  // 400-800
  if (elapsedMinutes < 30) return 800 + ((elapsedMinutes - 25) * 160); // 800-1600
  if (elapsedMinutes < 40) return 1600 + ((elapsedMinutes - 30) * 160); // 1600-3200
  return 3200; // Máximo
}

// Cenário de carga normal (< 100 RPS)
function normalLoadScenario() {
  const testUser = generateUser();

  // Operações completas e detalhadas
  let listResponse = http.get(`${config.apiUrl}/clientes`, {
    tags: { name: 'breakpoint_normal_list', load_level: 'normal' }
  });

  let listOk = check(listResponse, {
    'Normal Load - List works': (r) => r.status === 200,
    'Normal Load - List fast': (r) => r.timings.duration < 2000
  });

  recordBreakpointMetric('list', listResponse, listOk);
  sleep(1);

  let createResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(testUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'breakpoint_normal_create', load_level: 'normal' }
    }
  );

  let createOk = check(createResponse, {
    'Normal Load - Create works': (r) => r.status === 201,
    'Normal Load - Create reasonable': (r) => r.timings.duration < 3000
  });

  recordBreakpointMetric('create', createResponse, createOk);
  sleep(0.5);
}

// Cenário de carga média (100-500 RPS)
function mediumLoadScenario() {
  const testUser = generateUser();

  // Operações mais focadas
  let createResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(testUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'breakpoint_medium_create', load_level: 'medium' }
    }
  );

  let createOk = check(createResponse, {
    'Medium Load - Create still works': (r) => r.status === 201,
    'Medium Load - Create acceptable': (r) => r.timings.duration < 5000
  });

  recordBreakpointMetric('create', createResponse, createOk);
  sleep(0.2);

  // Login rápido
  let loginResponse = http.post(
    `${config.apiUrl}/login`,
    JSON.stringify({
      Usuario: testUser.Usuario,
      Senha: testUser.Senha
    }),
    { 
      headers: defaultHeaders,
      tags: { name: 'breakpoint_medium_login', load_level: 'medium' }
    }
  );

  let loginOk = check(loginResponse, {
    'Medium Load - Login functional': (r) => r.status === 200,
    'Medium Load - Login responsive': (r) => r.timings.duration < 4000
  });

  recordBreakpointMetric('login', loginResponse, loginOk);
  sleep(0.1);
}

// Cenário de carga alta (500-1000 RPS)
function highLoadScenario() {
  // Operações críticas apenas

  let healthResponse = http.get(`${config.apiUrl}/clientes`, {
    tags: { name: 'breakpoint_high_health', load_level: 'high' },
    timeout: '15s'
  });

  let healthOk = check(healthResponse, {
    'High Load - System responding': (r) => r.status === 200,
    'High Load - Not completely slow': (r) => r.timings.duration < 10000
  });

  recordBreakpointMetric('health', healthResponse, healthOk);

  if (!healthOk) {
    logInfo(`VU ${__VU} - ⚠️ Sistema começando a mostrar sinais de stress na carga alta`);
  }

  sleep(0.05);
}

// Cenário de carga extrema (1000+ RPS) - procurando o breakpoint
function extremeLoadScenario() {
  logInfo(`VU ${__VU} - 🔥 CARGA EXTREMA - Procurando ponto de ruptura`);

  // Requisição mais simples possível
  let extremeResponse = http.get(`${config.apiUrl}/clientes`, {
    tags: { name: 'breakpoint_extreme', load_level: 'extreme' },
    timeout: '30s'
  });

  let surviving = check(extremeResponse, {
    'Extreme Load - System alive': (r) => r.status !== 0,
    'Extreme Load - Eventually responds': (r) => r.timings.duration < 30000,
    'Extreme Load - Not dead (5xx ok)': (r) => r.status < 600
  });

  recordBreakpointMetric('extreme', extremeResponse, surviving);

  if (!surviving) {
    logInfo(`VU ${__VU} - 🚨 POSSÍVEL BREAKPOINT DETECTADO! Sistema não respondendo`);
    
    if (!breakpointMetrics.breakpointDetected) {
      breakpointMetrics.breakpointDetected = true;
      breakpointMetrics.breakpointTime = Date.now();
      logInfo(`🚨 BREAKPOINT CONFIRMADO! Tempo: ${((breakpointMetrics.breakpointTime - breakpointMetrics.startTime) / 60000).toFixed(1)} minutos`);
    }
  }

  // Sem sleep para máxima pressão
}

// Registrar métricas para análise de breakpoint
function recordBreakpointMetric(operation, response, success) {
  const now = Date.now();
  const elapsedMinutes = (now - breakpointMetrics.startTime) / (1000 * 60);
  
  breakpointMetrics.responseTimes.push({
    time: elapsedMinutes,
    operation: operation,
    duration: response.timings.duration,
    status: response.status,
    success: success
  });

  // Manter apenas últimas 50 métricas
  if (breakpointMetrics.responseTimes.length > 50) {
    breakpointMetrics.responseTimes.shift();
  }

  // Calcular taxa de erro atual
  const recentMetrics = breakpointMetrics.responseTimes.slice(-10);
  const errorRate = (recentMetrics.filter(m => !m.success).length / recentMetrics.length) * 100;
  
  breakpointMetrics.errorRates.push({
    time: elapsedMinutes,
    errorRate: errorRate
  });

  // Detectar breakpoint baseado na taxa de erro
  if (errorRate > 50 && !breakpointMetrics.breakpointDetected) {
    logInfo(`🚨 BREAKPOINT DETECTADO por alta taxa de erro: ${errorRate.toFixed(1)}%`);
    breakpointMetrics.breakpointDetected = true;
    breakpointMetrics.breakpointTime = now;
  }

  // Log periódico
  if (breakpointMetrics.responseTimes.length % 20 === 0) {
    const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length;
    logInfo(`📊 Status (${elapsedMinutes.toFixed(1)}min): Erro ${errorRate.toFixed(1)}%, RT médio ${avgResponseTime.toFixed(0)}ms`);
  }
}

// Coletar métricas globais de breakpoint
function collectBreakpointMetrics(currentRPS) {
  const elapsedMinutes = (Date.now() - breakpointMetrics.startTime) / (1000 * 60);
  
  breakpointMetrics.requestsPerSecond.push({
    time: elapsedMinutes,
    rps: currentRPS
  });

  // Atualizar último RPS bem-sucedido
  if (!breakpointMetrics.breakpointDetected) {
    breakpointMetrics.lastSuccessfulRPS = currentRPS;
  }
}

// Setup do teste
export function setup() {
  logInfo('=== INICIANDO BREAKPOINT TEST INOVATECH ===');
  logInfo('💥 TESTE DE PONTO DE RUPTURA - ENCONTRAR LIMITE MÁXIMO');
  logInfo('');
  logInfo('🎯 OBJETIVO: Encontrar o ponto exato onde o sistema quebra');
  logInfo('');
  logInfo('Escalada de carga:');
  logInfo('- 00:00-05:00 → 10-50 RPS (baseline)');
  logInfo('- 05:00-10:00 → 50-100 RPS (aquecimento)');
  logInfo('- 10:00-15:00 → 100-200 RPS (carga normal)');
  logInfo('- 15:00-20:00 → 200-400 RPS (carga alta)');
  logInfo('- 20:00-25:00 → 400-800 RPS (stress)');
  logInfo('- 25:00-30:00 → 800-1600 RPS (stress extremo)');
  logInfo('- 30:00-40:00 → 1600-3200 RPS (🔥 ZONA DE RUPTURA)');
  logInfo('- 40:00-45:00 → Recovery');
  logInfo('');
  logInfo('🚨 SINAIS DE BREAKPOINT:');
  logInfo('- Taxa de erro > 50%');
  logInfo('- Timeouts frequentes');
  logInfo('- Response times > 30s');
  logInfo('- Status 0 (connection failed)');
  logInfo('');
  logInfo('⚠️  MONITORE SISTEMA: CPU, memória, conexões, I/O');
  
  breakpointMetrics.startTime = Date.now();
  
  return {
    testStartTime: Date.now()
  };
}

// Teardown do teste
export function teardown(data) {
  const endTime = Date.now();
  const duration = (endTime - data.testStartTime) / (1000 * 60);
  
  logInfo('=== BREAKPOINT TEST CONCLUÍDO ===');
  logInfo(`Duração total: ${duration.toFixed(1)} minutos`);
  logInfo('');
  
  if (breakpointMetrics.breakpointDetected) {
    const breakpointMinutes = (breakpointMetrics.breakpointTime - breakpointMetrics.startTime) / (1000 * 60);
    
    logInfo('💥 BREAKPOINT ENCONTRADO!');
    logInfo(`   Tempo até ruptura: ${breakpointMinutes.toFixed(1)} minutos`);
    logInfo(`   Último RPS bem-sucedido: ~${breakpointMetrics.lastSuccessfulRPS}`);
    logInfo(`   RPS de ruptura: ~${getCurrentEstimatedRPS(breakpointMinutes)}`);
    logInfo('');
    logInfo('🔍 ANÁLISE DO BREAKPOINT:');
    
    // Analisar últimas métricas antes do breakpoint
    const preBreakpointMetrics = breakpointMetrics.responseTimes.filter(
      m => (m.time * 60 * 1000 + breakpointMetrics.startTime) < breakpointMetrics.breakpointTime
    );
    
    if (preBreakpointMetrics.length > 0) {
      const avgResponseTime = preBreakpointMetrics.slice(-5).reduce((sum, m) => sum + m.duration, 0) / 5;
      const finalErrorRate = breakpointMetrics.errorRates.slice(-1)[0]?.errorRate || 0;
      
      logInfo(`   Response time antes da ruptura: ${avgResponseTime.toFixed(0)}ms`);
      logInfo(`   Taxa de erro final: ${finalErrorRate.toFixed(1)}%`);
    }
    
  } else {
    logInfo('✅ BREAKPOINT NÃO ENCONTRADO');
    logInfo(`   Sistema sobreviveu até: ~${breakpointMetrics.lastSuccessfulRPS} RPS`);
    logInfo('   Considere aumentar a carga máxima no próximo teste');
  }
  
  logInfo('');
  logInfo('📊 ESTATÍSTICAS FINAIS:');
  logInfo(`   Total de requisições monitoradas: ${breakpointMetrics.responseTimes.length}`);
  
  if (breakpointMetrics.errorRates.length > 0) {
    const finalErrorRate = breakpointMetrics.errorRates.slice(-1)[0].errorRate;
    const maxErrorRate = Math.max(...breakpointMetrics.errorRates.map(e => e.errorRate));
    logInfo(`   Taxa de erro final: ${finalErrorRate.toFixed(1)}%`);
    logInfo(`   Pico de erro: ${maxErrorRate.toFixed(1)}%`);
  }
  
  if (breakpointMetrics.responseTimes.length > 0) {
    const avgRT = breakpointMetrics.responseTimes.reduce((sum, m) => sum + m.duration, 0) / breakpointMetrics.responseTimes.length;
    const maxRT = Math.max(...breakpointMetrics.responseTimes.map(m => m.duration));
    logInfo(`   Response time médio: ${avgRT.toFixed(0)}ms`);
    logInfo(`   Response time máximo: ${maxRT.toFixed(0)}ms`);
  }
  
  logInfo('');
  logInfo('💡 RECOMENDAÇÕES:');
  
  if (breakpointMetrics.breakpointDetected) {
    logInfo('1. 🛠️ Otimizar gargalos identificados');
    logInfo('2. 📈 Implementar auto-scaling antes do ponto de ruptura');
    logInfo('3. 🚨 Configurar alertas em 70% da capacidade máxima');
    logInfo('4. 🔄 Implementar circuit breakers');
    logInfo('5. 💾 Revisar configurações de conexão/pool de banco');
  } else {
    logInfo('1. ✅ Sistema demonstrou boa resistência');
    logInfo('2. 📊 Documentar capacidade máxima testada');
    logInfo('3. 🔍 Considerar testes com carga ainda maior');
    logInfo('4. 📈 Planejar crescimento baseado na capacidade atual');
  }
  
  logInfo('');
  logInfo('⚠️  IMPORTANTE: Verifique se o sistema se recuperou completamente após o teste!');
}