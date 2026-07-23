// Volume Test - Teste com grande quantidade de dados
import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from '../config/environments.js';
import { generateUser, generateLargePayload, generateUsers } from '../utils/data-generator.js';
import { logInfo, defaultHeaders } from '../utils/helpers.js';
import { thresholds } from '../utils/thresholds.js';

// Configurações do teste de volume - testa processamento de grandes volumes de dados
export const options = {
  stages: [
    { duration: '2m', target: 50 },    // Ramp-up gradual
    { duration: '8m', target: 100 },   // Manter carga com volume alto
    { duration: '2m', target: 0 }      // Ramp-down
  ],
  thresholds: thresholds.volume
};

// Função principal do teste
export default function() {
  const vuId = __VU;
  
  logInfo(`VU ${vuId} - Iniciando teste de volume`);

  // Alternar entre diferentes cenários de volume
  const volumeScenarios = [
    'bulk_creation',      // 40% - Criação em massa
    'large_payloads',     // 30% - Payloads grandes
    'batch_operations',   // 20% - Operações em lote
    'data_intensive'      // 10% - Operações intensivas de dados
  ];

  const scenario = volumeScenarios[vuId % volumeScenarios.length];
  
  switch (scenario) {
    case 'bulk_creation':
      bulkCreationScenario();
      break;
    case 'large_payloads':
      largePayloadsScenario();
      break;
    case 'batch_operations':
      batchOperationsScenario();
      break;
    case 'data_intensive':
      dataIntensiveScenario();
      break;
  }

  sleep(1);
}

// Cenário 1: Criação em massa de usuários
function bulkCreationScenario() {
  logInfo(`VU ${__VU} - Cenário: Criação em massa`);

  // Gerar múltiplos usuários para criação rápida
  const usersToCreate = 10; // 10 usuários por VU
  const users = generateUsers(usersToCreate);
  const createdUsers = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    
    logInfo(`VU ${__VU} - Criando usuário ${i + 1}/${usersToCreate}`);
    
    let createResponse = http.post(
      `${config.apiUrl}/clientes`,
      JSON.stringify(user),
      { 
        headers: defaultHeaders,
        tags: { 
          name: 'bulk_create', 
          scenario: 'bulk_creation',
          batch_position: i 
        }
      }
    );

    let success = check(createResponse, {
      [`Bulk Create ${i + 1} - Success`]: (r) => r.status === 201,
      [`Bulk Create ${i + 1} - Reasonable time`]: (r) => r.timings.duration < 5000,
      [`Bulk Create ${i + 1} - Valid response`]: (r) => {
        try {
          const body = JSON.parse(r.body);
          return body && body.id;
        } catch (e) {
          return false;
        }
      }
    });

    if (success && createResponse.status === 201) {
      try {
        const userId = JSON.parse(createResponse.body).id;
        createdUsers.push(userId);
      } catch (e) {
        logInfo(`VU ${__VU} - Erro ao extrair ID do usuário ${i + 1}`);
      }
    }

    // Sleep mínimo entre criações para simular processamento em lote
    sleep(0.2);
  }

  logInfo(`VU ${__VU} - Criação em massa concluída. Sucessos: ${createdUsers.length}/${usersToCreate}`);

  // Verificar se todos os usuários foram realmente criados
  sleep(2);
  
  let listResponse = http.get(`${config.apiUrl}/clientes`, {
    tags: { name: 'bulk_verify', scenario: 'bulk_creation' }
  });

  check(listResponse, {
    'Bulk Verify - List still works': (r) => r.status === 200,
    'Bulk Verify - Contains data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body) && body.length >= createdUsers.length;
      } catch (e) {
        return false;
      }
    }
  });
}

// Cenário 2: Payloads grandes (simulando uploads ou dados complexos)
function largePayloadsScenario() {
  logInfo(`VU ${__VU} - Cenário: Payloads grandes`);

  // Testar diferentes tamanhos de payload
  const payloadSizes = [1, 5, 10, 25]; // KB

  for (let size of payloadSizes) {
    logInfo(`VU ${__VU} - Testando payload de ${size}KB`);
    
    const largeUser = generateLargePayload(size);
    
    let largeCreateResponse = http.post(
      `${config.apiUrl}/clientes`,
      JSON.stringify(largeUser),
      { 
        headers: defaultHeaders,
        tags: { 
          name: 'large_payload', 
          scenario: 'large_payloads',
          payload_size_kb: size
        }
      }
    );

    check(largeCreateResponse, {
      [`Large Payload ${size}KB - Accepts`]: (r) => r.status === 201 || r.status === 413, // 413 = Payload Too Large
      [`Large Payload ${size}KB - Processes`]: (r) => r.timings.duration < 15000,
      [`Large Payload ${size}KB - No timeout`]: (r) => r.status !== 0
    });

    sleep(1);
  }

  // Testar comportamento com payload extremamente grande (pode falhar - isso é esperado)
  logInfo(`VU ${__VU} - Testando payload extremo (100KB)`);
  
  const extremeUser = generateLargePayload(100);
  
  let extremeResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(extremeUser),
    { 
      headers: defaultHeaders,
      tags: { 
        name: 'extreme_payload', 
        scenario: 'large_payloads',
        payload_size_kb: 100
      },
      timeout: '30s'
    }
  );

  check(extremeResponse, {
    'Extreme Payload - Handles gracefully': (r) => r.status !== 0, // Qualquer resposta é boa
    'Extreme Payload - Not 500 error': (r) => r.status !== 500 // Rejeição controlada é OK
  });
}

// Cenário 3: Operações em lote (batch operations)
function batchOperationsScenario() {
  logInfo(`VU ${__VU} - Cenário: Operações em lote`);

  // Primeiro criar alguns usuários para trabalhar com eles
  const batchUsers = generateUsers(5);
  const createdUserIds = [];

  // Fase 1: Criar lote de usuários
  logInfo(`VU ${__VU} - Fase 1: Criando lote de usuários`);
  
  for (let i = 0; i < batchUsers.length; i++) {
    let createResponse = http.post(
      `${config.apiUrl}/clientes`,
      JSON.stringify(batchUsers[i]),
      { 
        headers: defaultHeaders,
        tags: { name: 'batch_create', scenario: 'batch_operations' }
      }
    );

    if (createResponse.status === 201) {
      try {
        const userId = JSON.parse(createResponse.body).id;
        createdUserIds.push(userId);
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    sleep(0.1);
  }

  sleep(1);

  // Fase 2: Operações de leitura em lote
  logInfo(`VU ${__VU} - Fase 2: Leitura em lote`);
  
  for (let userId of createdUserIds) {
    let getResponse = http.get(`${config.apiUrl}/clientes/${userId}`, {
      tags: { name: 'batch_read', scenario: 'batch_operations' }
    });

    check(getResponse, {
      'Batch Read - Success': (r) => r.status === 200,
      'Batch Read - Fast': (r) => r.timings.duration < 3000
    });

    sleep(0.05);
  }

  sleep(1);

  // Fase 3: Operações de autenticação em lote
  logInfo(`VU ${__VU} - Fase 3: Autenticação em lote`);
  
  for (let i = 0; i < batchUsers.length; i++) {
    const user = batchUsers[i];
    
    let loginResponse = http.post(
      `${config.apiUrl}/login`,
      JSON.stringify({
        Usuario: user.Usuario,
        Senha: user.Senha
      }),
      { 
        headers: defaultHeaders,
        tags: { name: 'batch_login', scenario: 'batch_operations' }
      }
    );

    check(loginResponse, {
      'Batch Login - Processes': (r) => r.status === 200,
      'Batch Login - Responsive': (r) => r.timings.duration < 4000
    });

    sleep(0.1);
  }
}

// Cenário 4: Operações intensivas de dados
function dataIntensiveScenario() {
  logInfo(`VU ${__VU} - Cenário: Operações intensivas de dados`);

  // Operações que exigem muito processamento do servidor
  
  // 1. Múltiplas consultas de listagem (simulando relatórios)
  logInfo(`VU ${__VU} - Gerando carga de consultas intensivas`);
  
  for (let i = 0; i < 20; i++) {
    let listResponse = http.get(`${config.apiUrl}/clientes`, {
      tags: { 
        name: 'intensive_query', 
        scenario: 'data_intensive',
        query_number: i
      }
    });

    check(listResponse, {
      [`Intensive Query ${i} - Works`]: (r) => r.status === 200,
      [`Intensive Query ${i} - Eventually responds`]: (r) => r.timings.duration < 10000
    });

    sleep(0.1);
  }

  sleep(2);

  // 2. Operações complexas intercaladas
  logInfo(`VU ${__VU} - Operações complexas intercaladas`);
  
  const complexUser = generateUser();
  
  // Criar usuário
  let complexCreate = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(complexUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'intensive_create', scenario: 'data_intensive' }
    }
  );

  // Imediatamente listar para forçar consulta no banco recém modificado
  let immediateList = http.get(`${config.apiUrl}/clientes`, {
    tags: { name: 'intensive_immediate_read', scenario: 'data_intensive' }
  });

  // Login imediato
  let immediateLogin = http.post(
    `${config.apiUrl}/login`,
    JSON.stringify({
      Usuario: complexUser.Usuario,
      Senha: complexUser.Senha
    }),
    { 
      headers: defaultHeaders,
      tags: { name: 'intensive_immediate_login', scenario: 'data_intensive' }
    }
  );

  // Envio de email imediato
  let immediateEmail = http.post(
    `${config.apiUrl}/mailing`,
    JSON.stringify({
      Email: complexUser.Usuario
    }),
    { 
      headers: defaultHeaders,
      tags: { name: 'intensive_immediate_email', scenario: 'data_intensive' }
    }
  );

  // Verificar se todas as operações complexas funcionaram
  check(immediateList, {
    'Intensive - Immediate read works': (r) => r.status === 200
  });

  check(immediateLogin, {
    'Intensive - Immediate login works': (r) => r.status === 200
  });

  check(immediateEmail, {
    'Intensive - Immediate email works': (r) => r.status === 200
  });
}

// Setup do teste
export function setup() {
  logInfo('=== INICIANDO TESTE DE VOLUME INOVATECH ===');
  logInfo('🗄️  TESTANDO PROCESSAMENTO DE GRANDES VOLUMES DE DADOS');
  logInfo('');
  logInfo('Cenários de volume:');
  logInfo('- 40% Criação em massa (10 usuários por VU)');
  logInfo('- 30% Payloads grandes (1KB até 100KB)');
  logInfo('- 20% Operações em lote (CRUD sequencial)');
  logInfo('- 10% Operações intensivas de dados');
  logInfo('');
  logInfo('⚠️  MONITORE: Uso de memória, I/O de disco, conexões DB');
  
  return {
    startTime: Date.now()
  };
}

// Teardown do teste
export function teardown(data) {
  const endTime = Date.now();
  const duration = (endTime - data.startTime) / 1000;
  
  logInfo('=== TESTE DE VOLUME CONCLUÍDO ===');
  logInfo(`Duração total: ${duration.toFixed(2)} segundos`);
  logInfo('');
  logInfo('📊 ANÁLISE DE VOLUME:');
  logInfo('1. 💾 Como o banco de dados lidou com múltiplas inserções?');
  logInfo('2. 📝 Houve degradação com payloads maiores?');
  logInfo('3. 🔄 As operações em lote mantiveram performance?');
  logInfo('4. 📈 Operações intensivas causaram bloqueios?');
  logInfo('');
  logInfo('💡 OTIMIZAÇÕES RECOMENDADAS:');
  logInfo('- Implementar paginação nas listagens');
  logInfo('- Configurar limites de payload');
  logInfo('- Otimizar queries do banco');
  logInfo('- Implementar cache para dados frequentes');
  logInfo('- Configurar connection pooling');
}