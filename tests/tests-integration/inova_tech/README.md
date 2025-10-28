# InovaTech - Projeto de Testes de Integração

Este é um projeto exclusivo de testes de integração Java usando JUnit 5 e RestAssured.

## 🚀 Como Usar o VS Code para Executar os Testes

### 1. Executar Testes via Command Palette (Ctrl+Shift+P)

1. Abra o Command Palette (`Ctrl+Shift+P`)
2. Digite "Tasks: Run Task"
3. Escolha uma das opções:
   - **Run All Tests** - Executa todos os testes
   - **Run Integration Tests** - Executa apenas testes de integração
   - **Run Single Test** - Executa um teste específico
   - **Compile Tests** - Apenas compila os testes
   - **Clean and Test** - Limpa e executa todos os testes

### 2. Executar Testes via Test Explorer

1. Abra a aba **Testing** no painel lateral (ícone de béquer)
2. Clique no botão **Refresh Tests** se necessário
3. Expanda a árvore de testes e clique em:
   - ▶️ para executar um teste específico
   - 🐞 para debuggar um teste

### 3. Executar Testes via Shortcuts

- **Ctrl+Shift+P** → "Java: Run Tests" para executar todos os testes
- **F5** para debuggar (com breakpoints)

### 4. Executar Testes no Arquivo Atual

1. Abra o arquivo de teste (ex: `Cadastro_test.java`)
2. Clique com o botão direito no editor
3. Selecione "Run Test" ou "Debug Test"
4. Ou use os CodeLens (botões "Run | Debug" que aparecem acima dos métodos de teste)

## 🔧 Comandos Maven Disponíveis

No terminal integrado do VS Code (`Ctrl+`` ` ou `Terminal > New Terminal`):

```bash
# Compilar testes
mvn test-compile

# Executar todos os testes
mvn test

# Executar teste específico
mvn test -Dtest=Cadastro_test

# Limpar e executar testes
mvn clean test

# Executar com verbose
mvn test -X
```

## 📁 Estrutura do Projeto

```
├── src/test/integration/     ← Seus testes estão aqui
│   └── br/com/inova_tech/
│       └── integration/
│           └── Cadastro_test.java
├── .vscode/                  ← Configurações do VS Code
│   ├── tasks.json           ← Tasks para executar testes
│   ├── launch.json          ← Configurações de debug
│   └── settings.json        ← Configurações Java
├── pom.xml                   ← Configuração Maven
└── README.md                ← Este arquivo
```

## 🎯 Dicas Importantes

1. **Extensões Necessárias**: As seguintes extensões já estão instaladas:
   - Language Support for Java by Red Hat
   - Debugger for Java
   - Test Runner for Java
   - Maven for Java

2. **Debug**: Coloque breakpoints clicando na margem esquerda do editor e pressione F5

3. **Output**: Os resultados dos testes aparecem em:
   - Terminal integrado
   - Test Results (painel de testes)
   - Output → Java Test Runner

4. **Problemas**: Se houver erros de compilação, eles aparecerão em:
   - Problems (Ctrl+Shift+M)
   - Editor (sublinhado em vermelho)

## 🔄 Workflow Recomendado

1. Escreva seu teste em `src/test/integration/`
2. Salve o arquivo (Ctrl+S)
3. Execute via Test Explorer ou Command Palette
4. Veja os resultados no painel de testes
5. Debug conforme necessário com breakpoints

## ⚙️ Configurações Personalizadas

- **Java 21**: O projeto está configurado para usar Java 21
- **JUnit 5**: Framework de testes configurado
- **RestAssured**: Para testes de API REST
- **Maven**: Build tool configurado com plugins necessários