// Funções utilitárias para testes K6
import { check, sleep } from 'k6';

// Verificações padrão para respostas HTTP
export function checkResponse(response, expectedStatus = 200) {
  return check(response, {
    [`status is ${expectedStatus}`]: (r) => r.status === expectedStatus,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
    'response body exists': (r) => r.body && r.body.length > 0
  });
}

// Verificações específicas para API de clientes
export function checkClienteResponse(response, expectedStatus = 200) {
  const checks = {
    [`status is ${expectedStatus}`]: (r) => r.status === expectedStatus,
    'response time < 2000ms': (r) => r.timings.duration < 2000
  };

  if (expectedStatus === 200 || expectedStatus === 201) {
    checks['has valid JSON body'] = (r) => {
      try {
        const body = JSON.parse(r.body);
        return body !== null;
      } catch (e) {
        return false;
      }
    };
  }

  return check(response, checks);
}

// Verificações para login
export function checkLoginResponse(response) {
  return check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 3000ms': (r) => r.timings.duration < 3000,
    'has success property': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.hasOwnProperty('Sucesso');
      } catch (e) {
        return false;
      }
    }
  });
}

// Verificações para mailing
export function checkMailingResponse(response) {
  return check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 5000ms': (r) => r.timings.duration < 5000,
    'has success property': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.hasOwnProperty('Sucesso');
      } catch (e) {
        return false;
      }
    },
    'has message property': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.hasOwnProperty('Mensagem');
      } catch (e) {
        return false;
      }
    }
  });
}

// Sleep com variação aleatória para simular comportamento humano
export function randomSleep(min = 1, max = 3) {
  const sleepTime = Math.random() * (max - min) + min;
  sleep(sleepTime);
}

// Função para logging estruturado
export function logInfo(message, data = {}) {
  console.log(`[INFO] ${message}`, data);
}

export function logError(message, error = {}) {
  console.error(`[ERROR] ${message}`, error);
}

// Função para retry de requisições com falha
export function retryRequest(requestFunc, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = requestFunc();
      if (response.status >= 200 && response.status < 400) {
        return response;
      }
      if (attempt === maxRetries) {
        return response;
      }
      logInfo(`Request failed, retrying... Attempt ${attempt}/${maxRetries}`);
      sleep(1);
    } catch (error) {
      if (attempt === maxRetries) {
        logError('Max retries reached', error);
        throw error;
      }
      logInfo(`Request error, retrying... Attempt ${attempt}/${maxRetries}`);
      sleep(1);
    }
  }
}

// Função para calcular percentis
export function calculatePercentile(values, percentile) {
  const sorted = values.sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index];
}

// Headers padrão para requisições JSON
export const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Configurações de timeout padrão
export const defaultTimeout = {
  timeout: '30s'
};