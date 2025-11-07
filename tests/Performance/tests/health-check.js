// Health Check - Verificação básica de conectividade
import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from '../config/environments.js';
import { checkResponse, logInfo } from '../utils/helpers.js';
import { thresholds } from '../utils/thresholds.js';

// Configurações do teste
export const options = {
  vus: 1, // 1 usuário virtual
  duration: '30s', // Duração de 30 segundos
  thresholds: thresholds.healthCheck
};

// Função principal do teste
export default function() {
  // Informações do teste
  logInfo('Iniciando Health Check', {
    apiUrl: config.apiUrl,
    frontendUrl: config.frontendUrl,
    timestamp: new Date().toISOString()
  });

  // Teste 1: Verificar se API está respondendo
  logInfo('Verificando API Health...');
  
  let apiResponse = http.get(`${config.apiUrl}/clientes`);
  
  check(apiResponse, {
    'API - Status 200': (r) => r.status === 200,
    'API - Response time < 1000ms': (r) => r.timings.duration < 1000,
    'API - Body is array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body);
      } catch (e) {
        return false;
      }
    },
    'API - Content-Type is JSON': (r) => r.headers['Content-Type'].includes('application/json')
  });

  sleep(1);

  // Teste 2: Verificar se Frontend está respondendo
  logInfo('Verificando Frontend Health...');
  
  let frontendResponse = http.get(config.frontendUrl);
  
  check(frontendResponse, {
    'Frontend - Status 200': (r) => r.status === 200,
    'Frontend - Response time < 2000ms': (r) => r.timings.duration < 2000,
    'Frontend - Body contains HTML': (r) => r.body.includes('<html>') || r.body.includes('<!DOCTYPE html>'),
    'Frontend - Body size > 0': (r) => r.body.length > 0
  });

  sleep(1);

  // Teste 3: Verificar endpoints específicos da API
  logInfo('Verificando endpoints específicos...');

  // Health check endpoint (se existir)
  let healthResponse = http.get(`${config.apiUrl}/health`, {
    tags: { name: 'health_endpoint' }
  });

  // Não falhar se endpoint não existir (404 é aceitável)
  check(healthResponse, {
    'Health endpoint - Response received': (r) => r.status === 200 || r.status === 404,
    'Health endpoint - Response time < 500ms': (r) => r.timings.duration < 500
  });

  sleep(1);

  // Teste 4: Verificar se é possível fazer uma requisição POST simples
  logInfo('Testando conectividade POST...');

  let postTestResponse = http.post(`${config.apiUrl}/clientes`, 
    JSON.stringify({
      // Dados inválidos propositalmente para não criar registro
      PrimeiroNome: '',
      UltimoNome: '',
      Usuario: 'invalid-email',
      Senha: '',
      Cidade: '',
      Estado: ''
    }), 
    {
      headers: {
        'Content-Type': 'application/json'
      },
      tags: { name: 'post_connectivity_test' }
    }
  );

  // Esperamos erro 400 (Bad Request) - isso confirma que API está processando
  check(postTestResponse, {
    'POST connectivity - API processing requests': (r) => r.status === 400 || r.status === 422,
    'POST connectivity - Response time < 2000ms': (r) => r.timings.duration < 2000
  });

  sleep(1);

  logInfo('Health Check concluído');
}

// Função de setup (executada uma vez no início)
export function setup() {
  logInfo('=== INICIANDO HEALTH CHECK DO SISTEMA INOVATECH ===');
  logInfo('Verificando conectividade básica dos serviços...');
  
  return {
    startTime: Date.now(),
    testInfo: {
      type: 'Health Check',
      description: 'Verificação básica de conectividade API e Frontend',
      expectedDuration: '30s'
    }
  };
}

// Função de teardown (executada uma vez no final)
export function teardown(data) {
  const endTime = Date.now();
  const duration = (endTime - data.startTime) / 1000;
  
  logInfo('=== HEALTH CHECK CONCLUÍDO ===');
  logInfo(`Duração total: ${duration.toFixed(2)} segundos`);
  logInfo('Verifique as métricas acima para confirmar saúde do sistema');
}