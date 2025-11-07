// Definições de thresholds para diferentes tipos de teste
export const thresholds = {
  
  // Thresholds para testes de saúde (health check)
  healthCheck: {
    http_req_duration: ['p(95)<1000'], // 95% < 1s
    http_req_failed: ['rate<0.01'],    // Taxa de erro < 1%
    http_reqs: ['count>0']             // Pelo menos 1 requisição
  },

  // Thresholds para testes de carga normal (load test)
  load: {
    http_req_duration: ['p(95)<2000'], // 95% < 2s
    http_req_failed: ['rate<0.05'],    // Taxa de erro < 5%
    http_reqs: ['rate>10'],            // Pelo menos 10 req/s
    vus: ['value>0']                   // VUs ativo > 0
  },

  // Thresholds para testes de estresse (stress test)
  stress: {
    http_req_duration: ['p(95)<5000'], // 95% < 5s (mais tolerante)
    http_req_failed: ['rate<0.10'],    // Taxa de erro < 10%
    http_reqs: ['rate>5']              // Pelo menos 5 req/s
  },

  // Thresholds para testes de pico (spike test)
  spike: {
    http_req_duration: ['p(95)<10000'], // 95% < 10s (muito tolerante)
    http_req_failed: ['rate<0.15'],     // Taxa de erro < 15%
    http_reqs: ['rate>1']               // Pelo menos 1 req/s
  },

  // Thresholds para testes de volume (volume test)
  volume: {
    http_req_duration: ['p(95)<3000'], // 95% < 3s
    http_req_failed: ['rate<0.08'],    // Taxa de erro < 8%
    http_reqs: ['rate>8']              // Pelo menos 8 req/s
  },

  // Thresholds para testes de resistência (soak test)
  soak: {
    http_req_duration: ['p(95)<2500'], // 95% < 2.5s
    http_req_failed: ['rate<0.06'],    // Taxa de erro < 6%
    http_reqs: ['rate>7'],             // Pelo menos 7 req/s
    // Verificar se não há vazamentos de memória
    'custom_memory_usage': ['value<100'] // Customizado conforme aplicação
  },

  // Thresholds para testes de ponto de ruptura (breakpoint test)
  breakpoint: {
    http_req_duration: ['p(95)<15000'], // 95% < 15s (extremamente tolerante)
    http_req_failed: ['rate<0.50'],     // Taxa de erro < 50%
    http_reqs: ['rate>0.5']             // Pelo menos 0.5 req/s
  },

  // Thresholds específicos para operações CRUD
  crud: {
    create: {
      http_req_duration: ['p(95)<3000'], // CREATE pode ser mais lento
      http_req_failed: ['rate<0.02']     // Baixa tolerância a erro
    },
    read: {
      http_req_duration: ['p(95)<1000'], // READ deve ser rápido
      http_req_failed: ['rate<0.01']     // Muito baixa tolerância
    },
    update: {
      http_req_duration: ['p(95)<2500'], // UPDATE moderadamente rápido
      http_req_failed: ['rate<0.03']     // Baixa tolerância
    },
    delete: {
      http_req_duration: ['p(95)<2000'], // DELETE moderadamente rápido
      http_req_failed: ['rate<0.02']     // Baixa tolerância
    }
  },

  // Thresholds para testes de frontend/browser
  frontend: {
    browser_web_vital_lcp: ['p(95)<2500'],    // Largest Contentful Paint
    browser_web_vital_fid: ['p(95)<100'],     // First Input Delay
    browser_web_vital_cls: ['p(95)<0.1'],     // Cumulative Layout Shift
    browser_http_req_duration: ['p(95)<3000'] // Requisições do browser
  },

  // Thresholds para APIs específicas
  api: {
    login: {
      http_req_duration: ['p(95)<2000'], // Login deve ser rápido
      http_req_failed: ['rate<0.01']     // Baixíssima tolerância a falha
    },
    mailing: {
      http_req_duration: ['p(95)<5000'], // Email pode ser mais lento
      http_req_failed: ['rate<0.05']     // Tolerância moderada
    },
    clientes: {
      list: {
        http_req_duration: ['p(95)<1500'], // Listar deve ser rápido
        http_req_failed: ['rate<0.02']
      },
      create: {
        http_req_duration: ['p(95)<3000'], // Criar pode ser mais lento
        http_req_failed: ['rate<0.01']
      },
      update: {
        http_req_duration: ['p(95)<2500'],
        http_req_failed: ['rate<0.02']
      },
      delete: {
        http_req_duration: ['p(95)<2000'],
        http_req_failed: ['rate<0.01']
      }
    }
  }
};

// Função para obter thresholds baseado no tipo de teste
export function getThresholds(testType) {
  return thresholds[testType] || thresholds.load;
}

// Função para combinar thresholds
export function combineThresholds(...thresholdObjects) {
  return Object.assign({}, ...thresholdObjects);
}

// Thresholds padrão para desenvolvimento/debug
export const developmentThresholds = {
  http_req_duration: ['p(95)<10000'], // Muito tolerante para dev
  http_req_failed: ['rate<0.20']      // 20% de erro OK para dev
};

// Thresholds para produção (mais rigorosos)
export const productionThresholds = {
  http_req_duration: ['p(95)<1000'],  // Muito rigoroso
  http_req_failed: ['rate<0.01'],     // 1% de erro máximo
  http_reqs: ['rate>20']              // Alta taxa de requisições
};