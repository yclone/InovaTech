// API CRUD Test - Testes completos das operações da API
import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from '../config/environments.js';
import { generateUser, generateLoginData, generateEmailData } from '../utils/data-generator.js';
import { checkClienteResponse, checkLoginResponse, checkMailingResponse, logInfo, defaultHeaders } from '../utils/helpers.js';
import { thresholds } from '../utils/thresholds.js';

// Configurações do teste
export const options = {
  vus: 10, // 10 usuários virtuais
  duration: '3m', // 3 minutos
  thresholds: thresholds.crud.create
};

// Dados compartilhados entre VUs
let createdUsers = [];

// Função principal do teste
export default function() {
  const testUser = generateUser();
  let userId;

  logInfo(`VU ${__VU} - Iniciando testes CRUD`, { user: testUser.Usuario });

  // ========== TESTE 1: CREATE - Criar usuário ==========
  logInfo(`VU ${__VU} - Testando CREATE (cadastro)`);
  
  let createResponse = http.post(
    `${config.apiUrl}/clientes`,
    JSON.stringify(testUser),
    { 
      headers: defaultHeaders,
      tags: { name: 'create_user' }
    }
  );

  let createSuccess = check(createResponse, {
    'CREATE - Status 201': (r) => r.status === 201,
    'CREATE - Response time < 3000ms': (r) => r.timings.duration < 3000,
    'CREATE - Has user ID': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body && body.id;
      } catch (e) {
        return false;
      }
    },
    'CREATE - Returns correct data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.PrimeiroNome === testUser.PrimeiroNome && 
               body.UltimoNome === testUser.UltimoNome &&
               body.Usuario === testUser.Usuario;
      } catch (e) {
        return false;
      }
    }
  });

  if (createSuccess && createResponse.status === 201) {
    try {
      userId = JSON.parse(createResponse.body).id;
      createdUsers.push(userId);
      logInfo(`VU ${__VU} - Usuário criado com ID: ${userId}`);
    } catch (e) {
      logInfo(`VU ${__VU} - Erro ao extrair ID do usuário criado`);
    }
  }

  sleep(1);

  // ========== TESTE 2: READ - Listar todos os usuários ==========
  logInfo(`VU ${__VU} - Testando READ (listar todos)`);
  
  let listResponse = http.get(`${config.apiUrl}/clientes`, {
    tags: { name: 'list_users' }
  });

  check(listResponse, {
    'LIST - Status 200': (r) => r.status === 200,
    'LIST - Response time < 1500ms': (r) => r.timings.duration < 1500,
    'LIST - Returns array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body);
      } catch (e) {
        return false;
      }
    },
    'LIST - Array not empty': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body) && body.length > 0;
      } catch (e) {
        return false;
      }
    }
  });

  sleep(1);

  // ========== TESTE 3: READ BY ID - Buscar usuário específico ==========
  if (userId) {
    logInfo(`VU ${__VU} - Testando READ BY ID (buscar por ID: ${userId})`);
    
    let getByIdResponse = http.get(`${config.apiUrl}/clientes/${userId}`, {
      tags: { name: 'get_user_by_id' }
    });

    check(getByIdResponse, {
      'GET BY ID - Status 200': (r) => r.status === 200,
      'GET BY ID - Response time < 1000ms': (r) => r.timings.duration < 1000,
      'GET BY ID - Returns correct user': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.id === userId && body.Usuario === testUser.Usuario;
        } catch (e) {
          return false;
        }
      },
      'GET BY ID - Password not exposed': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.Senha === null || body.Senha === undefined;
        } catch (e) {
          return false;
        }
      }
    });

    sleep(1);
  }

  // ========== TESTE 4: LOGIN - Testar autenticação ==========
  logInfo(`VU ${__VU} - Testando LOGIN`);
  
  let loginData = {
    Usuario: testUser.Usuario,
    Senha: testUser.Senha
  };

  let loginResponse = http.post(
    `${config.apiUrl}/login`,
    JSON.stringify(loginData),
    { 
      headers: defaultHeaders,
      tags: { name: 'login_user' }
    }
  );

  check(loginResponse, {
    'LOGIN - Status 200': (r) => r.status === 200,
    'LOGIN - Response time < 2000ms': (r) => r.timings.duration < 2000,
    'LOGIN - Success true': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Sucesso === true;
      } catch (e) {
        return false;
      }
    },
    'LOGIN - Returns client data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Cliente && body.Cliente.Usuario === testUser.Usuario;
      } catch (e) {
        return false;
      }
    },
    'LOGIN - Has success message': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Mensagem === 'Login realizado com sucesso';
      } catch (e) {
        return false;
      }
    }
  });

  sleep(1);

  // ========== TESTE 5: MAILING - Testar envio de email ==========
  logInfo(`VU ${__VU} - Testando MAILING`);
  
  let emailData = {
    Email: testUser.Usuario // Usar email do usuário criado
  };

  let mailingResponse = http.post(
    `${config.apiUrl}/mailing`,
    JSON.stringify(emailData),
    { 
      headers: defaultHeaders,
      tags: { name: 'send_email' }
    }
  );

  check(mailingResponse, {
    'MAILING - Status 200': (r) => r.status === 200,
    'MAILING - Response time < 5000ms': (r) => r.timings.duration < 5000,
    'MAILING - Success true': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Sucesso === true;
      } catch (e) {
        return false;
      }
    },
    'MAILING - Success message': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Mensagem === 'Email enviado com sucesso!';
      } catch (e) {
        return false;
      }
    }
  });

  sleep(1);

  // ========== TESTES NEGATIVOS ==========
  logInfo(`VU ${__VU} - Testando cenários negativos`);

  // Teste: GET usuário inexistente
  let notFoundResponse = http.get(`${config.apiUrl}/clientes/999999`, {
    tags: { name: 'get_nonexistent_user' }
  });

  check(notFoundResponse, {
    'NOT FOUND - Status 404': (r) => r.status === 404,
    'NOT FOUND - Response time < 1000ms': (r) => r.timings.duration < 1000
  });

  sleep(0.5);

  // Teste: LOGIN com credenciais inválidas
  let invalidLoginData = {
    Usuario: testUser.Usuario,
    Senha: 'senhaerrada123'
  };

  let invalidLoginResponse = http.post(
    `${config.apiUrl}/login`,
    JSON.stringify(invalidLoginData),
    { 
      headers: defaultHeaders,
      tags: { name: 'invalid_login' }
    }
  );

  check(invalidLoginResponse, {
    'INVALID LOGIN - Status 200': (r) => r.status === 200, // API retorna 200 mesmo para falha
    'INVALID LOGIN - Success false': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Sucesso === false;
      } catch (e) {
        return false;
      }
    },
    'INVALID LOGIN - Error message': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Mensagem === 'Usuário ou senha incorretos';
      } catch (e) {
        return false;
      }
    }
  });

  sleep(0.5);

  // Teste: MAILING com email inexistente
  let invalidEmailData = {
    Email: 'usuario.inexistente@test.com'
  };

  let invalidMailingResponse = http.post(
    `${config.apiUrl}/mailing`,
    JSON.stringify(invalidEmailData),
    { 
      headers: defaultHeaders,
      tags: { name: 'invalid_email' }
    }
  );

  check(invalidMailingResponse, {
    'INVALID MAILING - Status 200': (r) => r.status === 200,
    'INVALID MAILING - Success false': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Sucesso === false;
      } catch (e) {
        return false;
      }
    },
    'INVALID MAILING - Error message': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.Mensagem === 'Falha ao enviar o Email';
      } catch (e) {
        return false;
      }
    }
  });

  logInfo(`VU ${__VU} - Testes CRUD concluídos`);
  sleep(1);
}

// Setup do teste
export function setup() {
  logInfo('=== INICIANDO TESTES CRUD DA API INOVATECH ===');
  logInfo('Testando operações: CREATE, READ, LOGIN, MAILING + Cenários Negativos');
  
  return {
    startTime: Date.now()
  };
}

// Teardown do teste
export function teardown(data) {
  const endTime = Date.now();
  const duration = (endTime - data.startTime) / 1000;
  
  logInfo('=== TESTES CRUD CONCLUÍDOS ===');
  logInfo(`Duração total: ${duration.toFixed(2)} segundos`);
  logInfo(`Usuários criados durante o teste: ${createdUsers.length}`);
  
  // Nota: Em um cenário real, você poderia implementar limpeza dos dados de teste aqui
  // Por exemplo, deletar os usuários criados durante o teste
}