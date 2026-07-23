// Configurações de ambiente para testes K6
export const environments = {
  local: {
    apiUrl: 'http://localhost:5000',
    frontendUrl: 'http://localhost:5173'
  },
  dev: {
    apiUrl: 'https://dev-api.inovatech.com',
    frontendUrl: 'https://dev.inovatech.com'
  },
  staging: {
    apiUrl: 'https://staging-api.inovatech.com',
    frontendUrl: 'https://staging.inovatech.com'
  },
  production: {
    apiUrl: 'https://api.inovatech.com',
    frontendUrl: 'https://inovatech.com'
  }
};

// Configuração padrão (local)
export const config = environments[__ENV.ENVIRONMENT || 'local'];

// Thresholds padrão para todos os testes
export const defaultThresholds = {
  http_req_duration: ['p(95)<2000'], // 95% das requisições devem ser < 2s
  http_req_failed: ['rate<0.1'],     // Taxa de erro < 10%
};

// Configurações de teste por tipo
export const testConfigs = {
  healthCheck: {
    vus: 1,
    duration: '30s'
  },
  load: {
    vus: 50,
    duration: '5m'
  },
  stress: {
    stages: [
      { duration: '2m', target: 100 },
      { duration: '5m', target: 200 },
      { duration: '2m', target: 300 },
      { duration: '5m', target: 400 },
      { duration: '10m', target: 400 },
      { duration: '5m', target: 0 }
    ]
  },
  spike: {
    stages: [
      { duration: '10s', target: 100 },
      { duration: '1m', target: 100 },
      { duration: '20s', target: 1400 },
      { duration: '3m', target: 1400 },
      { duration: '20s', target: 100 },
      { duration: '1m', target: 100 },
      { duration: '10s', target: 0 }
    ]
  },
  volume: {
    vus: 100,
    duration: '10m'
  },
  soak: {
    stages: [
      { duration: '2m', target: 400 },
      { duration: '3h56m', target: 400 },
      { duration: '2m', target: 0 }
    ]
  }
};