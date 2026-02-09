/**
 * Test Data
 * Dados de teste centralizados
 */

module.exports = {
  // Usuários válidos - InovaTech
  validUsers: {
    mainTest: {
      email: 'teste@teste.com',
      password: '123',
      role: 'user',
    },
    admin: {
      email: 'admin@inovatech.com',
      password: 'Admin@123',
      role: 'admin',
    },
    testUser: {
      email: 'testuser@inovatech.com',
      password: 'Test@123',
      role: 'user',
    },
  },

  // Usuários inválidos - InovaTech
  invalidUsers: {
    wrongPassword: {
      email: 'teste@teste.com',
      password: 'senhaerrada',
    },
    wrongEmail: {
      email: 'emailinvalido@teste.com',
      password: '123',
    },
    nonExistent: {
      email: 'naoexiste@inovatech.com',
      password: 'Password@123',
    },
    emptyEmail: {
      email: '',
      password: '123',
    },
    emptyPassword: {
      email: 'teste@teste.com',
      password: '',
    },
    bothEmpty: {
      email: '',
      password: '',
    },
  },

  // Mensagens esperadas
  messages: {
    loginSuccess: 'Bem-vindo',
    loginError: 'Usuário ou senha inválidos',
    emptyFieldError: 'Campo obrigatório',
    networkError: 'Erro de conexão',
  },

  // Timeouts
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,
  },

  // Dados de teste genéricos
  testData: {
    searchTerm: 'produto teste',
    itemName: 'Item de Teste',
    quantity: 5,
    price: '99.90',
  },

  // Configurações de ambiente
  environment: {
    dev: {
      apiUrl: 'https://api-dev.inovatech.com',
      timeout: 10000,
    },
    staging: {
      apiUrl: 'https://api-staging.inovatech.com',
      timeout: 15000,
    },
    production: {
      apiUrl: 'https://api.inovatech.com',
      timeout: 20000,
    },
  },

  // Dados para cadastro
  registrationData: {
    valid: {
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao.silva@test.com',
      phone: '11999999999',
      password: 'Test@123',
      confirmPassword: 'Test@123',
    },
    invalid: {
      shortPassword: 'Test@123'.substring(0, 5),
      mismatchPassword: 'Different@123',
      invalidEmail: 'invalid-email',
    },
  },
};
