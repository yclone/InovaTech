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

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd InovaTech
```

### 2. Execute a aplicação

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

### 3. Acesse a aplicação

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

```
InovaTech/
├── src/
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
│   └── test/                          # Testes unitários
├── pom.xml                           # Configurações do Maven
└── README.md                         # Este arquivo
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

Para executar os testes:

```bash
# Maven Wrapper
.\mvnw.cmd test

# Maven instalado
mvn test
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
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

### Build da aplicação
```bash
.\mvnw.cmd clean package
```

### Executar JAR gerado
```bash
java -jar target/InovaTech-0.0.1-SNAPSHOT.jar
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