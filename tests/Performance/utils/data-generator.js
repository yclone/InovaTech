// Utilitários para geração de dados de teste
import { randomString, randomIntBetween } from 'k6/crypto';

// Gerar dados de usuário aleatórios
export function generateUser() {
  const timestamp = Date.now();
  const randomId = randomIntBetween(1000, 9999);
  
  return {
    PrimeiroNome: `K6User${randomId}`,
    UltimoNome: `Test${randomId}`,
    Usuario: `k6.test.${timestamp}.${randomId}@test.com`,
    Senha: `k6test${randomId}`,
    Cidade: getRandomCity(),
    Estado: getRandomState()
  };
}

// Gerar dados de login
export function generateLoginData() {
  const user = generateUser();
  return {
    Usuario: user.Usuario,
    Senha: user.Senha
  };
}

// Gerar dados de email para mailing
export function generateEmailData() {
  const timestamp = Date.now();
  const randomId = randomIntBetween(1000, 9999);
  
  return {
    Email: `k6.mailing.${timestamp}.${randomId}@test.com`
  };
}

// Lista de cidades brasileiras para testes
function getRandomCity() {
  const cities = [
    'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador',
    'Brasília', 'Fortaleza', 'Curitiba', 'Recife', 'Porto Alegre',
    'Manaus', 'Belém', 'Goiânia', 'Guarulhos', 'Campinas'
  ];
  return cities[randomIntBetween(0, cities.length - 1)];
}

// Lista de estados brasileiros para testes
function getRandomState() {
  const states = [
    'SP', 'RJ', 'MG', 'BA', 'DF', 'CE', 'PR', 'PE', 'RS',
    'AM', 'PA', 'GO', 'SC', 'ES', 'MT', 'MS', 'PB', 'AL'
  ];
  return states[randomIntBetween(0, states.length - 1)];
}

// Gerar múltiplos usuários
export function generateUsers(count) {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(generateUser());
  }
  return users;
}

// Gerar dados inválidos para testes negativos
export function generateInvalidUser() {
  return {
    PrimeiroNome: '', // Nome vazio
    UltimoNome: '', // Sobrenome vazio
    Usuario: 'email-invalido', // Email inválido
    Senha: '123', // Senha muito curta
    Cidade: '',
    Estado: ''
  };
}

// Gerar payload de diferentes tamanhos para testes de volume
export function generateLargePayload(sizeKB) {
  const baseUser = generateUser();
  const targetSize = sizeKB * 1024; // Converter KB para bytes
  const additionalData = 'X'.repeat(Math.max(0, targetSize - JSON.stringify(baseUser).length));
  
  return {
    ...baseUser,
    additionalData: additionalData
  };
}