# 🚀 InovaTech - Spring Boot Application

## 📋 Descrição

Projeto para apresentação e teste InovaTech - Uma aplicação Spring Boot 3.5.6 com Java 21, utilizando Jakarta EE, JPA/Hibernate, validações e banco de dados H2 em memória.

## 🛠️ Tecnologias Utilizadas

- **Java**: 21.0.4
- **Spring Boot**: 3.5.6
- **Jakarta EE**: Validation e Persistence
- **JPA/Hibernate**: 6.6.29.Final
- **Banco de Dados**: H2 (em memória)
- **Build Tool**: Maven
- **Lombok**: Para redução de boilerplate
- **ModelMapper**: Para mapeamento de objetos

## ⚙️ Pré-requisitos

- Java 21 ou superior
- Maven 3.8+ (ou usar o Maven Wrapper incluído)
- IDE de sua preferência (IntelliJ IDEA, Eclipse, VS Code)

## 🚀 Como Executar o Projeto

> **⚠️ Importante**: Todos os comandos Maven devem ser executados a partir da pasta `src`, onde estão localizados o `pom.xml` e os arquivos Maven wrapper.

### 1. Clone o repositório
```bash
git clone https://github.com/yclone/InovaTech.git
cd InovaTech
```

### 2. Navegue para a pasta src
```bash
cd src
```

### 3. Execute a aplicação

**Usando Maven Wrapper (Recomendado):**
```bash
# Windows
.\mvnw.cmd spring-boot:run

# sem docker
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--spring.docker.compose.enabled=false"

# Linux/Mac
./mvnw spring-boot:run
```

**Usando Maven instalado:**
```bash
mvn spring-boot:run
```

### 4. Acesse a aplicação

A aplicação estará disponível em: **http://localhost:5000**

## 🌐 URLs Disponíveis

| Endpoint | URL | Descrição |
|----------|-----|-----------|
| **Aplicação Principal** | http://localhost:5000 | Página principal da aplicação |
| **Swagger UI** | http://localhost:5000/swagger-ui.html | Interface interativa da API (Swagger) |
| **OpenAPI Docs** | http://localhost:5000/v3/api-docs | Documentação OpenAPI 3 em JSON |
| **API de Teste** | http://localhost:5000/api/hello | Endpoint de teste para verificar funcionamento |
| **Console H2** | http://localhost:5000/h2-console | Interface web do banco de dados H2 |

## 🗃️ Configuração do Banco de Dados H2

Para acessar o console do banco H2:

1. Acesse: http://localhost:5000/h2-console
2. Use as seguintes configurações:
   - **JDBC URL**: `jdbc:h2:mem:testdb`
   - **Username**: `sa`
   - **Password**: `123`
   - **Driver Class**: `org.h2.Driver`

## 📁 Estrutura do Projeto

> **🔄 Estrutura Reorganizada**: O projeto foi reorganizado para manter todo o conteúdo da aplicação Spring Boot dentro da pasta `src`, incluindo o `pom.xml` e arquivos Maven wrapper. A pasta `tests` na raiz foi preservada para testes separados.

```
InovaTech/
├── src/                              # 📁 Pasta principal da aplicação
│   ├── .mvn/                        # Configurações Maven wrapper
│   ├── main/
│   │   ├── java/
│   │   │   └── br/com/InovaTech/InovaTech/
│   │   │       ├── controller/          # Controllers REST
│   │   │       ├── model/
│   │   │       │   ├── dto/            # Data Transfer Objects
│   │   │       │   └── entity/         # Entidades JPA
│   │   │       ├── service/            # Camada de serviços
│   │   │       ├── repository/         # Repositórios JPA
│   │   │       ├── helpers/            # Classes auxiliares
│   │   │       └── InovaTechApplication.java
│   │   └── resources/
│   │       ├── application.properties  # Configurações da aplicação
│   │       └── static/                # Arquivos estáticos
│   ├── test/                          # Testes unitários
│   ├── pom.xml                       # 📋 Configurações do Maven
│   ├── mvnw                          # Maven wrapper (Unix/Linux)
│   └── mvnw.cmd                      # Maven wrapper (Windows)
├── tests/
│   └── tests-integration/             # Módulo de testes avançados
│       ├── pom.xml                   # Dependências para testes
│       └── src/test/java/
│           ├── dto/                  # DTOs para testes
│           ├── helpers/              # Utilitários para testes
│           └── tests/
│               ├── apiTest/          # Testes de API
│               ├── apiIntegration/   # Testes de integração
│               └── e2eTest/          # Testes End-to-End
├── target/                           # Build artifacts (gerado pelo Maven)
├── compose.yaml                      # Docker Compose
├── HELP.md                          # Ajuda do Spring Boot
└── README.md                        # Este arquivo
```

## ⚙️ Configurações Principais

### Porta da Aplicação
- **Porta padrão**: 5000
- Para alterar, modifique no `application.properties`: `server.port=NOVA_PORTA`

### Banco de Dados
- **Tipo**: H2 Database (em memória)
- **URL**: `jdbc:h2:mem:testdb`
- **Console**: Habilitado em `/h2-console`
- **DDL**: `create-drop` (recria tabelas a cada inicialização)

### JPA/Hibernate
- **Show SQL**: Habilitado (logs das queries)
- **Open in View**: Desabilitado (melhores práticas)

## 🧪 Testes

O projeto possui uma estrutura completa de testes em múltiplas camadas:

### 📋 **Tipos de Testes Disponíveis**

#### 🔹 **Testes Unitários** (`src/test/`)
Testes básicos das funcionalidades isoladas:
```bash
# Navegue para a pasta src primeiro
cd src

# Executar testes unitários
.\mvnw.cmd test

# Maven instalado
mvn test
```

#### 🔹 **Testes de Integração e E2E** (`tests/tests-integration/`)
Módulo separado com testes avançados utilizando RestAssured:

**🏗️ Estrutura dos Testes Avançados:**
- **API Tests** - Testes básicos de endpoints
- **Integration Tests** - Testes de integração entre componentes
- **End-to-End Tests** - Testes completos de fluxo de usuário

**🛠️ Tecnologias utilizadas:**
- **JUnit 5** - Framework de testes
- **RestAssured** - Testes de API REST
- **AssertJ** - Assertions fluentes
- **Jackson** - Serialização JSON
- **Tags JUnit** - Organização por categorias (`@Tag("integration")`, `@Tag("e2e")`, `@Tag("api")`)

### 🚀 **Executando os Testes Avançados**

#### **Todos os testes avançados:**
```bash
cd tests/tests-integration
mvn test
```

#### **Por categoria específica:**
```bash
# Apenas testes de integração
mvn test -Dgroups=integration

# Apenas testes end-to-end
mvn test -Dgroups=e2e

# Apenas testes de API
mvn test -Dgroups=api
```

#### **Executar testes específicos:**
```bash
# Classe específica
mvn test -Dtest=ApiIntegrationTests

# Método específico
mvn test -Dtest=EndToEndTests#testCompleteUserFlow
```

### 📊 **Relatórios de Teste**

Os relatórios são gerados em:
- **Unitários**: `target/surefire-reports/`
- **Integração**: `tests/tests-integration/target/surefire-reports/`

### 🔧 **Configuração dos Testes**

**Pré-requisitos para testes de integração:**
1. Aplicação principal rodando em `http://localhost:5000`
2. Banco H2 disponível
3. Endpoints da API funcionais

**Helpers disponíveis:**
- `ClienteRequests` - Requisições para API de clientes
- `LoadProperties` - Carregamento de configurações
- `PropertiesUtils` - Utilitários de propriedades
- `StsToken` - Gerenciamento de tokens de segurança

### 📊 **Atualizações Realizadas no Módulo de Testes**

#### ☕ **Compatibilidade com Java:**
- **Antes**: Java 11
- **Agora**: Java 21 (compatível com o projeto principal)

#### 🏗️ **Dependências Atualizadas:**

| Dependência | Versão Anterior | Nova Versão | Status |
|-------------|----------------|-------------|---------|
| **Lombok** | 1.18.22 | 1.18.36 | ✅ Atualizada |
| **JUnit Jupiter** | 5.7.2 | 5.11.3 | ✅ Atualizada |
| **RestAssured** | 4.3.3 | 5.5.0 | ✅ Atualizada |
| **Jackson** | 2.12.3 | 2.18.1 | ✅ Atualizada |
| **AssertJ** | 3.19.0 | 3.26.3 | ✅ Atualizada |
| **Spring Boot** | 2.5.2 | 3.5.6 | ✅ Atualizada |
| **Spring Framework** | 5.3.8 | 6.2.1 | ✅ Atualizada |
| **JSON** | 20220320 | 20240303 | ✅ Atualizada |

#### 🔧 **Melhorias no Build:**

**Maven Compiler Plugin:**
- Versão atualizada para 3.13.0
- Configuração explícita para Java 21
- Encoding UTF-8 definido

**Maven Surefire Plugin:**
- Versão atualizada para 3.5.2
- Melhor configuração de relatórios
- Suporte aprimorado para tags JUnit

#### 📋 **Organização das Propriedades:**
- Centralização de versões via properties
- Facilita futuras atualizações
- Melhor manutenção do código

**Properties configuradas:**
```xml
<properties>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <junit.version>5.11.3</junit.version>
    <rest-assured.version>5.5.0</rest-assured.version>
    <jackson.version>2.18.1</jackson.version>
    <spring-boot.version>3.5.6</spring-boot.version>
    <assertj.version>3.26.3</assertj.version>
</properties>
```

## 📝 APIs Disponíveis

### 🎯 Swagger UI
Acesse **http://localhost:5001/swagger-ui.html** para:
- ✅ **Testar todos os endpoints** interativamente
- ✅ **Ver documentação completa** da API
- ✅ **Validar schemas** de request/response
- ✅ **Executar requisições** direto no navegador

### Cliente API
- **POST** `/clientes` - Criar novo cliente
- **GET** `/clientes` - Listar todos os clientes
- **GET** `/clientes/{id}` - Buscar cliente por ID

### Hello API
- **GET** `/api/hello` - Retorna mensagem de teste
- **GET** `/api/validation-test` - Testa validações Jakarta

## 🔧 Desenvolvimento

### Executar em modo de desenvolvimento
```bash
# Navegue para a pasta src primeiro
cd src
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

### Build da aplicação
```bash
# Navegue para a pasta src primeiro
cd src
.\mvnw.cmd clean package
```

### Executar JAR gerado
```bash
# A partir da pasta src
java -jar target/InovaTech-0.0.1-SNAPSHOT.jar

# Ou da pasta raiz
java -jar src/target/InovaTech-0.0.1-SNAPSHOT.jar
```

## 📋 Funcionalidades Implementadas

- ✅ **Configuração Spring Boot 3.5.6**
- ✅ **Migração completa javax → jakarta**
- ✅ **Validações Jakarta Validation**
- ✅ **JPA/Hibernate com H2**
- ✅ **Console H2 habilitado**
- ✅ **Swagger/OpenAPI 3 configurado**
- ✅ **Documentação interativa da API**
- ✅ **Lombok para redução de código**
- ✅ **ModelMapper para conversões**
- ✅ **Testes unitários estruturados**
- ✅ **Testes de integração com RestAssured**
- ✅ **Testes End-to-End automatizados**
- ✅ **Módulo separado para testes avançados**
- ✅ **Organização por tags (@Tag)**
- ✅ **Docker Compose configurado**

## 🐛 Resolução de Problemas

### Problema: Porta já em uso
**Solução**: Altere a porta no `application.properties` ou pare o processo que está usando a porta.

### Problema: Erro de banco de dados
**Solução**: Verifique se a configuração do H2 está correta no `application.properties`.

### Problema: Erro de compilação javax/jakarta
**Solução**: Certifique-se de que todos os imports estão usando `jakarta.*` em vez de `javax.*`.

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

## 📞 Contato

- **Projeto**: InovaTech
- **Desenvolvedor**: [Seu Nome]
- **Email**: [seu.email@exemplo.com]

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela!** ⭐