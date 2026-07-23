# 🎓 Treinamento: Seu Primeiro Teste Mobile com Appium

> **Público-alvo:** Testadores júnior com experiência em automação web que desejam iniciar em automação mobile.

## 📋 Pré-requisitos

- Conhecimento básico de automação de testes
- JavaScript/Node.js
- Linha de comando (PowerShell/CMD)
- Computador com Windows

---

## 📚 Índice

1. [Parte 1: Configuração do Ambiente Android](#parte-1-configuração-do-ambiente-android)
2. [Parte 2: Preparando o APK](#parte-2-preparando-o-apk)
3. [Parte 3: Configurando o Emulador](#parte-3-configurando-o-emulador)
4. [Parte 4: Instalando e Configurando Appium](#parte-4-instalando-e-configurando-appium)
5. [Parte 5: Explorando Elementos com Appium Inspector](#parte-5-explorando-elementos-com-appium-inspector)
6. [Parte 6: Configurando o Projeto de Testes do Zero](#parte-6-configurando-o-projeto-de-testes-do-zero)
7. [Parte 7: Criando Seu Primeiro Teste](#parte-7-criando-seu-primeiro-teste)
8. [Parte 8: Executando os Testes](#parte-8-executando-os-testes)
9. [Comandos Úteis de Referência](#comandos-úteis-de-referência)

---

## Parte 1: Configuração do Ambiente Android

### 1.1 Instalar o Android Studio

1. Baixe o Android Studio: https://developer.android.com/studio
2. Execute o instalador
3. Durante a instalação, certifique-se de incluir:
   - ✅ Android SDK
   - ✅ Android SDK Platform
   - ✅ Android Virtual Device

### 1.2 Instalar Command Line Tools

1. Abra o Android Studio
2. Vá em: **Tools > SDK Manager**
3. Na aba **SDK Tools**, marque:
   - ✅ Android SDK Command-line Tools (latest)
   - ✅ Android SDK Platform-Tools
   - ✅ Android Emulator
4. Clique em **Apply** e aguarde a instalação

### 1.3 Configurar Variáveis de Ambiente

#### Passo 1: Definir ANDROID_HOME

1. Pressione `Win + X` → Selecione **Sistema**
2. Clique em **Configurações Avançadas do Sistema**
3. Clique em **Variáveis de Ambiente**
4. Em **Variáveis do Sistema**, clique em **Novo**:
   - **Nome:** `ANDROID_HOME`
   - **Valor:** `C:\Users\SEU_USUARIO\AppData\Local\Android\Sdk`

    - **Nome:** `ANDROID_SDK_ROOT`
   - **Valor:** `C:\Users\SEU_USUARIO\AppData\Local\Android\Sdk`

> ⚠️ **Importante:** Substitua `SEU_USUARIO` pelo seu nome de usuário do Windows!

#### Passo 2: Adicionar ao PATH

1. Nas **Variáveis de Ambiente**, localize a variável **Path** em **Variáveis do Sistema**
2. Clique em **Editar**
3. Clique em **Novo** e adicione as seguintes linhas (uma por vez):
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\cmdline-tools\latest\bin
   %ANDROID_HOME%\emulator
   ```
4. Clique em **OK** em todas as janelas

#### Passo 3: Verificar a Configuração

Abra um **novo terminal PowerShell** e execute:

```powershell
adb version
```

✅ **Resultado esperado:** Deve exibir a versão do ADB
```
Android Debug Bridge version 1.x.x
```

---

## Parte 2: Preparando o APK

### 2.1 Gerar o APK do Aplicativo

Se você estiver desenvolvendo o app ou tiver acesso ao código-fonte:

#### Passo 1: Validar o código (Lint)

```powershell
cd C:\Users\vinic\AndroidStudioProjects\InovatechMob
./gradlew lintDebug
```

#### Passo 2: Gerar o APK de Debug

```powershell
cd C:\Users\vinic\AndroidStudioProjects\InovatechMob
./gradlew assembleDebug
```

✅ **APK gerado em:** `app\build\outputs\apk\debug\app-debug.apk`

### 2.2 Instalar o APK no Dispositivo

Com o emulador rodando (veremos no próximo passo):

```powershell
adb install -r <CAMINHO DO APK>\app-debug.apk
```

> 💡 **Dica:** O parâmetro `-r` reinstala o app se ele já estiver instalado.

✅ **Resultado esperado:** `Success` ou `Performing Streamed Install`

---

## Parte 3: Configurando o Emulador

### 3.1 Criar um Dispositivo Virtual (AVD)

1. Abra o Android Studio
2. Clique em **Tools > Device Manager**
3. Clique em **Create Device**
4. Selecione um dispositivo (ex: **Pixel 5**)
5. Selecione uma imagem do sistema (recomendado: **Android 13** ou superior)
6. Dê um nome ao AVD (ex: `Pixel_5`)
7. Clique em **Finish**

### 3.2 Listar Dispositivos Disponíveis

```powershell
avdmanager list avd
```

✅ **Resultado esperado:**
```
Available Android Virtual Devices:
    Name: Pixel_5
  Device: pixel_5 (Google)
    Path: C:\Users\vinic\.android\avd\Pixel_5.avd
```

Ou de forma simplificada:

```powershell
emulator -list-avds
```

✅ **Resultado esperado:**
```
Pixel_5
```

### 3.3 Iniciar o Emulador

```powershell
emulator -avd Pixel_5
```

> 💡 **Dica:** Deixe esse terminal aberto. O emulador está rodando nesse processo.

### 3.4 Verificar se o Dispositivo Está Conectado

Abra um **novo terminal** e execute:

```powershell
adb devices
```

✅ **Resultado esperado:**
```
List of devices attached
emulator-5554   device
```

### 3.5 Iniciar o Aplicativo via Linha de Comando

```powershell
adb shell am start -n com.example.inovatechmob/.MainActivity
```

✅ **Resultado esperado:** O app deve abrir no emulador.

---

## Parte 4: Instalando e Configurando Appium

### 4.1 Instalar o Appium Globalmente

```powershell
npm install --location=global appium
```

### 4.2 Instalar o Driver UiAutomator2

O UiAutomator2 é o driver que permite ao Appium se comunicar com dispositivos Android:

```powershell
appium driver install uiautomator2
```

### 4.3 Verificar a Instalação

```powershell
appium
```

✅ **Resultado esperado:**
```
[Appium] Welcome to Appium v3.2.0
```

Pressione `Ctrl + C` para sair.

### 4.4 Iniciar o Servidor Appium

```powershell
appium server --address 127.0.0.1 --port 4723
```

✅ **Resultado esperado:**
```
[Appium] Appium REST http interface listener started on http://127.0.0.1:4723
```

> 💡 **Dica:** Mantenha esse terminal aberto enquanto estiver testando.

---

## Parte 5: Explorando Elementos com Appium Inspector

O Appium Inspector é uma ferramenta visual para explorar e capturar elementos do seu aplicativo.

### 5.1 Acesse o Appium Inspector

1. Acesse: https://inspector.appiumpro.com/


### 5.2 Configurar a Conexão

Na tela do Appium Inspector:

**Host:**
```
127.0.0.1 (ou deixe em branco para local)
```

**Port:**
```
4723 (ou deixe em branco se a não tiver alterado a porta padrão)
```

**Desired Capabilities** (clique em JSON Representation):

```json
{
  "platformName": "Android",
  "appium:deviceName": "Pixel_5",
  "appium:appPackage": "com.example.inovatechmob",
  "appium:appActivity": ".MainActivity",
  "appium:automationName": "UiAutomator2"
}
```

**Na GetNet é esse:**
```json
{
  "platformName": "android",
  "appim:uiautomator2ServerInstallTimeout": 120000,
  "appium:deviceName": "PAX A920Pro",
  "appium:platformVersion": "10",
  "appium:orientation": "PORTRAIT",
  "appium:automationName": "uiautomator2",
  "appium:app": "com.android.launcher3"
}
```

### 5.3 Conectar ao Dispositivo

1. Certifique-se de que:
   - ✅ O emulador está rodando
   - ✅ O servidor Appium está ativo
   - ✅ O app está instalado no emulador

2. Clique em **Start Session**

✅ **Resultado esperado:** Você verá a tela do seu app no Inspector!

### 5.4 Explorando Elementos

- **Clique em elementos** na tela para ver suas propriedades
- **Copie seletores** (resource-id, text, xpath) para usar nos testes
- **Teste ações** diretamente no Inspector (tap, send keys, etc.)

#### 📝 Exemplo: Capturando um botão

1. Clique no botão "Entrar" na tela
2. No painel direito, você verá propriedades como:
   - `resource-id`: `com.example.inovatechmob:id/loginButton`
   - `text`: `Entrar`
   - `class`: `android.widget.Button`

3. Você pode usar qualquer uma dessas para criar seletores:
   ```javascript
   // Por resource-id
   $('~com.example.inovatechmob:id/loginButton')
   
   // Por text
   $('android=new UiSelector().text("Entrar")')
   
   // Por class
   $('android.widget.Button')
   ```

---

## Parte 6: Configurando o Projeto de Testes do Zero

Agora vamos criar um projeto de testes do zero e entender cada biblioteca que utilizaremos.

### 6.1 Criar a Estrutura do Projeto

#### Passo 1: Criar o diretório do projeto

```powershell
mkdir C:\Tests\MobileAutomation
cd C:\Tests\MobileAutomation
```

#### Passo 2: Inicializar o projeto Node.js

```powershell
npm init -y
```

Isso cria um arquivo `package.json` com as configurações padrão do projeto.

### 6.2 Entendendo e Instalando as Bibliotecas

Vamos instalar cada biblioteca entendendo sua função no projeto:

#### 📦 WebDriverIO - Framework de Automação

**O que é:** Framework de automação de testes que implementa o protocolo WebDriver e facilita a criação de testes.

**Para que serve:**
- Gerencia a comunicação com o Appium
- Fornece APIs simplificadas para interagir com elementos
- Gerencia a execução dos testes
- Gera relatórios

**Instalação:**
```powershell
npm install --save-dev @wdio/cli
```

#### 🤖 Appium - Driver Mobile

**O que é:** Servidor que implementa o protocolo WebDriver para dispositivos móveis.

**Para que serve:**
- Ponte entre seus testes e o dispositivo/emulador
- Traduz comandos WebDriver em ações nativas do Android/iOS
- Gerencia sessões de teste

**Instalação:**
```powershell
npm install --save-dev appium
```

#### 📱 UiAutomator2 Driver - Driver Android

**O que é:** Driver específico para automação Android que usa o framework UiAutomator2 do Google.

**Para que serve:**
- Executa ações no Android (clicks, swipes, input de texto)
- Captura elementos da interface
- Gerencia o aplicativo no dispositivo

**Instalação:**
```powershell
npm install --save-dev appium-uiautomator2-driver
```

#### 🧪 Mocha - Test Runner

**O que é:** Framework de testes JavaScript que organiza e executa seus casos de teste.

**Para que serve:**
- Define a estrutura dos testes (`describe`, `it`)
- Executa hooks (`before`, `beforeEach`, `after`, `afterEach`)
- Gerencia timeouts e assincronicidade
- Gera output dos resultados

**Instalação:**
```powershell
npm install --save-dev @wdio/mocha-framework
```

#### ✅ Chai - Biblioteca de Asserções

**O que é:** Biblioteca de asserções que permite escrever validações de forma legível.

**Para que serve:**
- Validar resultados esperados vs obtidos
- Fornece sintaxe expressiva (BDD/TDD)
- Exemplos: `expect(value).to.be.true`, `expect(text).to.equal('Login')`

**Instalação:**
```powershell
npm install --save-dev chai
```

#### 📊 Spec Reporter - Relatórios

**O que é:** Reporter que exibe os resultados dos testes no console de forma organizada.

**Para que serve:**
- Mostra quais testes passaram/falharam
- Exibe tempo de execução
- Formata logs de forma legível

**Instalação:**
```powershell
npm install --save-dev @wdio/spec-reporter
```

#### 🔧 Appium Service - Gerenciador do Servidor Appium

**O que é:** Plugin do WebDriverIO que inicia/para o servidor Appium automaticamente.

**Para que serve:**
- Evita iniciar o Appium manualmente
- Gerencia o lifecycle do servidor durante os testes
- Configura porta e host automaticamente

**Instalação:**
```powershell
npm install --save-dev @wdio/appium-service
```

### 6.3 Instalação Completa - Comando Único

Se preferir instalar todas as dependências de uma vez:

```powershell
npm install --save-dev @wdio/cli @wdio/local-runner @wdio/mocha-framework @wdio/spec-reporter @wdio/appium-service appium appium-uiautomator2-driver chai
```

### 6.4 Verificar as Dependências Instaladas

Após a instalação, seu `package.json` deve conter algo similar a:

```json
{
  "name": "mobileautomation",
  "version": "1.0.0",
  "devDependencies": {
    "@wdio/appium-service": "^8.x.x",
    "@wdio/cli": "^8.x.x",
    "@wdio/local-runner": "^8.x.x",
    "@wdio/mocha-framework": "^8.x.x",
    "@wdio/spec-reporter": "^8.x.x",
    "appium": "^2.x.x",
    "appium-uiautomator2-driver": "^2.x.x",
    "chai": "^4.x.x"
  }
}
```

### 6.5 Configurar o WebDriverIO

#### Passo 1: Gerar configuração inicial

```powershell
npx wdio config
```

Durante a configuração interativa, selecione:

1. **Where is your automation backend located?** → `On my local machine`
2. **Which framework do you want to use?** → `Mocha`
3. **Do you want to use a compiler?** → `No`
4. **Where are your test specs located?** → `./test/specs/**/*.js` (padrão)
5. **Do you want WebdriverIO to autogenerate some test files?** → `Yes`
6. **Which reporter do you want to use?** → `spec`
7. **Do you want to add a plugin to your test setup?** → Selecione `appium`
8. **Do you want to add a service to your test setup?** → `appium`

Isso criará um arquivo `wdio.conf.js` com toda configuração base.

### 6.6 Configurar para Android

Edite o arquivo `wdio.conf.js` e configure as capabilities para Android:

```javascript
exports.config = {
    runner: 'local',
    port: 4723,
    
    specs: [
        './test/specs/**/*.js'
    ],
    
    maxInstances: 1,
    
    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': 'Pixel_5',
        'appium:platformVersion': '13',
        'appium:automationName': 'UiAutomator2',
        'appium:appPackage': 'com.example.inovatechmob',
        'appium:appActivity': '.MainActivity',
        'appium:noReset': true,
        'appium:fullReset': false
    }],
    
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    
    framework: 'mocha',
    reporters: ['spec'],
    
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
    
    services: ['appium'],
    
    before: function () {
        const chai = require('chai');
        global.expect = chai.expect;
        global.assert = chai.assert;
    }
}
```

### 6.7 Estrutura de Pastas Recomendada

Crie a seguinte estrutura:

```
MobileAutomation/
├── test/
│   ├── specs/              # Seus arquivos de teste
│   │   └── login.spec.js
│   ├── pageObjects/        # Page Objects
│   │   └── LoginPage.js
│   ├── helpers/            # Funções auxiliares
│   │   └── TestHelpers.js
│   └── data/               # Dados de teste
│       └── testData.js
├── node_modules/           # Dependências (gerado automaticamente)
├── package.json            # Configuração do projeto
├── package-lock.json       # Lock de versões
└── wdio.conf.js           # Configuração WebDriverIO
```

Crie as pastas:

```powershell
mkdir test\specs
mkdir test\pageObjects
mkdir test\helpers
mkdir test\data
```

### 6.8 Resumo das Bibliotecas

| Biblioteca | Função Principal | Necessária? |
|------------|------------------|-------------|
| **@wdio/cli** | Linha de comando do WebDriverIO | ✅ Sim |
| **@wdio/local-runner** | Executa testes localmente | ✅ Sim |
| **@wdio/mocha-framework** | Framework de testes | ✅ Sim |
| **@wdio/spec-reporter** | Exibe resultados no console | ✅ Sim |
| **@wdio/appium-service** | Gerencia servidor Appium | ⚡ Recomendado |
| **appium** | Servidor de automação mobile | ✅ Sim |
| **appium-uiautomator2-driver** | Driver Android | ✅ Sim (Android) |
| **chai** | Biblioteca de asserções | ✅ Sim |

### 6.9 Scripts Úteis no package.json

Adicione scripts para facilitar a execução:

```json
{
  "scripts": {
    "test": "npx wdio wdio.conf.js",
    "test:android": "npx wdio wdio.conf.js",
    "test:spec": "npx wdio wdio.conf.js --spec"
  }
}
```

Agora você pode executar:

```powershell
npm test                           # Roda todos os testes
npm run test:spec ./test/specs/login.spec.js  # Roda teste específico
```

---

## Parte 7: Criando Seu Primeiro Teste

Agora que temos o projeto configurado (Parte 6), vamos criar nosso primeiro teste mobile!

### 7.1 Criar a Estrutura Base

#### Passo 1: Criar o arquivo BasePage

Este arquivo contém métodos comuns que serão usados por todos os Page Objects.

Crie o arquivo `test/pageObjects/BasePage.js`:

```javascript
class BasePage {
  /**
   * Clica em um elemento
   */
  async click(element) {
    await element.waitForDisplayed({ timeout: 10000 });
    await element.click();
  }

  /**
   * Define valor em um campo
   */
  async setValue(element, value) {
    await element.waitForDisplayed({ timeout: 10000 });
    await element.setValue(value);
  }

  /**
   * Verifica se elemento está visível
   */
  async isDisplayed(element) {
    try {
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtém texto de um elemento
   */
  async getText(element) {
    await element.waitForDisplayed({ timeout: 10000 });
    return await element.getText();
  }

  /**
   * Esconde o teclado
   */
  async hideKeyboard() {
    try {
      if (driver.isKeyboardShown()) {
        await driver.hideKeyboard();
      }
    } catch (error) {
      // Ignora erro se teclado não estiver visível
    }
  }

  /**
   * Aguarda um tempo
   */
  async pause(milliseconds) {
    await driver.pause(milliseconds);
  }
}

module.exports = BasePage;
```

#### Passo 2: Criar o LoginPage (Page Object)

Crie o arquivo `test/pageObjects/LoginPage.js`:

```javascript
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  // ==================== SELETORES ====================
  
  /**
   * Campo de email
   */
  get emailField() {
    return $('android=new UiSelector().resourceId("com.example.inovatechmob:id/emailInput")');
  }

  /**
   * Campo de senha
   */
  get passwordField() {
    return $('android=new UiSelector().resourceId("com.example.inovatechmob:id/passwordInput")');
  }

  /**
   * Botão de login
   */
  get loginButton() {
    return $('android=new UiSelector().text("Entrar")');
  }

  /**
   * Link criar conta
   */
  get createAccountLink() {
    return $('android=new UiSelector().text("Criar conta")');
  }

  /**
   * Título da tela
   */
  get titleText() {
    return $('android=new UiSelector().text("InovaTech")');
  }

  // ==================== AÇÕES ====================

  /**
   * Preenche o campo de email
   */
  async fillEmail(email) {
    await this.setValue(this.emailField, email);
  }

  /**
   * Preenche o campo de senha
   */
  async fillPassword(password) {
    await this.setValue(this.passwordField, password);
  }

  /**
   * Clica no botão de login
   */
  async clickLoginButton() {
    await this.click(this.loginButton);
  }

  /**
   * Faz o login completo
   */
  async login(email, password) {
    await this.fillEmail(email);
    await this.hideKeyboard();
    await this.pause(500);
    await this.fillPassword(password);
    await this.hideKeyboard();
    await this.pause(500);
    await this.clickLoginButton();
  }

  /**
   * Clica em criar conta
   */
  async clickCreateAccount() {
    await this.click(this.createAccountLink);
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Verifica se está na tela de login
   */
  async isLoginScreenDisplayed() {
    return await this.isDisplayed(this.loginButton);
  }

  /**
   * Verifica se o título está visível
   */
  async isTitleDisplayed() {
    return await this.isDisplayed(this.titleText);
  }

  /**
   * Obtém o texto do título
   */
  async getTitleText() {
    return await this.getText(this.titleText);
  }
}

module.exports = new LoginPage();
```

> 💡 **Dica:** Use o Appium Inspector (Parte 5) para capturar os seletores corretos do seu app!

#### Passo 3: Criar arquivo de dados de teste

Crie o arquivo `test/data/testData.js`:

```javascript
module.exports = {
  validUsers: {
    mainTest: {
      email: 'teste@teste.com',
      password: '123'
    },
    adminUser: {
      email: 'admin@teste.com',
      password: 'admin123'
    }
  },
  
  invalidUsers: {
    wrongPassword: {
      email: 'teste@teste.com',
      password: 'senhaErrada'
    },
    wrongEmail: {
      email: 'naoexiste@teste.com',
      password: '123'
    }
  }
};
```

### 7.2 Criar Seu Primeiro Teste

Agora vamos criar o arquivo de teste! Crie o arquivo `test/specs/primeiro-teste.spec.js`:

```javascript
const LoginPage = require('../pageObjects/LoginPage');
const testData = require('../data/testData');

describe('Meu Primeiro Teste Mobile', () => {
  
  it('Teste 01 - Deve verificar que a tela de login carregou', async () => {
    // Aguarda a tela carregar
    await driver.pause(3000);
    
    // Verifica se está na tela de login
    const isLoginScreen = await LoginPage.isLoginScreenDisplayed();
    
    // Valida
    expect(isLoginScreen).to.be.true;
    
    console.log('✅ Teste 01 passou - Tela de login carregada!');
  });

  it('Teste 02 - Deve validar que os elementos estão visíveis', async () => {
    // Verifica visibilidade dos elementos
    const emailVisible = await LoginPage.emailField.isDisplayed();
    const passwordVisible = await LoginPage.passwordField.isDisplayed();
    const buttonVisible = await LoginPage.loginButton.isDisplayed();
    const titleVisible = await LoginPage.isTitleDisplayed();
    
    // Valida cada elemento
    expect(emailVisible).to.be.true;
    expect(passwordVisible).to.be.true;
    expect(buttonVisible).to.be.true;
    expect(titleVisible).to.be.true;
    
    console.log('✅ Teste 02 passou - Todos os elementos estão visíveis!');
  });

  it('Teste 03 - Deve preencher o campo de email', async () => {
    const { email } = testData.validUsers.mainTest;
    
    // Preenche o email
    await LoginPage.fillEmail(email);
    await driver.pause(1000);
    
    // Valida que o campo foi preenchido
    const emailValue = await LoginPage.emailField.getText();
    expect(emailValue).to.include(email);
    
    console.log('✅ Teste 03 passou - Email preenchido!');
  });

  it('Teste 04 - Deve preencher o campo de senha', async () => {
    const { password } = testData.validUsers.mainTest;
    
    // Preenche a senha
    await LoginPage.fillPassword(password);
    await driver.pause(1000);
    
    // Valida que o campo existe e está preenchido
    const passwordFieldExists = await LoginPage.passwordField.isDisplayed();
    expect(passwordFieldExists).to.be.true;
    
    console.log('✅ Teste 04 passou - Senha preenchida!');
  });

  it('Teste 05 - Deve realizar login completo', async () => {
    const { email, password } = testData.validUsers.mainTest;
    
    // Realiza login
    await LoginPage.login(email, password);
    await driver.pause(3000);
    
    // Verifica se saiu da tela de login
    const stillOnLogin = await LoginPage.isLoginScreenDisplayed();
    expect(stillOnLogin).to.be.false;
    
    console.log('✅ Teste 05 passou - Login realizado com sucesso!');
  });
});
```

### 7.3 Entendendo a Estrutura do Teste

#### 📝 Anatomia de um Teste

```javascript
describe('Nome da Suite de Testes', () => {
  // Executa UMA VEZ antes de todos os testes
  before(async () => {
    // Setup inicial
  });

  // Executa ANTES DE CADA teste
  beforeEach(async () => {
    // Preparação para cada teste
  });

  // Um caso de teste
  it('Descrição do que o teste faz', async () => {
    // Arrange - Preparar dados
    const email = 'teste@teste.com';
    
    // Act - Executar ação
    await LoginPage.fillEmail(email);
    
    // Assert - Validar resultado
    expect(resultado).to.be.true;
  });

  // Executa DEPOIS DE CADA teste
  afterEach(async () => {
    // Limpeza após cada teste
  });

  // Executa UMA VEZ depois de todos os testes
  after(async () => {
    // Limpeza final
  });
});
```

#### 🎯 Pattern AAA (Arrange, Act, Assert)

Organize seus testes seguindo este padrão:

1. **Arrange (Preparar)** - Configure os dados e pré-condições
2. **Act (Agir)** - Execute a ação que está sendo testada
3. **Assert (Verificar)** - Valide que o resultado é o esperado

```javascript
it('Exemplo usando AAA', async () => {
  // Arrange - Preparar
  const email = 'teste@teste.com';
  const password = '123';
  
  // Act - Agir
  await LoginPage.login(email, password);
  await driver.pause(2000);
  
  // Assert - Verificar
  const stillOnLogin = await LoginPage.isLoginScreenDisplayed();
  expect(stillOnLogin).to.be.false;
});
```

#### ✅ Asserções com Chai

Exemplos de asserções mais comuns:

```javascript
// Igualdade
expect(valor).to.equal('esperado');
expect(valor).to.not.equal('naoEsperado');

// Booleanos
expect(valor).to.be.true;
expect(valor).to.be.false;

// Conter texto
expect(texto).to.include('pedaço');
expect(array).to.include(item);

// Existência
expect(valor).to.exist;
expect(valor).to.not.be.null;
expect(valor).to.not.be.undefined;

// Comparações
expect(numero).to.be.greaterThan(5);
expect(numero).to.be.lessThan(10);
```

### 7.4 Dicas de Boas Práticas

#### ✨ Use Page Objects
```javascript
// ❌ Ruim - Seletor direto no teste
it('teste ruim', async () => {
  const campo = await $('android=new UiSelector().resourceId("emailInput")');
  await campo.setValue('teste@teste.com');
});

// ✅ Bom - Usando Page Object
it('teste bom', async () => {
  await LoginPage.fillEmail('teste@teste.com');
});
```

#### ⏱️ Use Waits Apropriados
```javascript
// ❌ Ruim - Pause fixo
await driver.pause(5000);

// ✅ Bom - Wait condicional
await element.waitForDisplayed({ timeout: 10000 });
```

#### 📝 Escreva Testes Descritivos
```javascript
// ❌ Ruim - Descrição vaga
it('teste 1', async () => { ... });

// ✅ Bom - Descrição clara
it('Deve exibir mensagem de erro ao fazer login com senha incorreta', async () => { ... });
```

#### 🔍 Um Assert por Teste (quando possível)
```javascript
// ✅ Bom - Teste focado
it('Campo de email deve estar visível', async () => {
  const visible = await LoginPage.emailField.isDisplayed();
  expect(visible).to.be.true;
});

it('Campo de senha deve estar visível', async () => {
  const visible = await LoginPage.passwordField.isDisplayed();
  expect(visible).to.be.true;
});
```

### 7.5 Estrutura Final do Projeto

Após criar todos os arquivos, seu projeto deve estar assim:

```
MobileAutomation/
├── test/
│   ├── specs/
│   │   └── primeiro-teste.spec.js    ✅ CRIADO
│   ├── pageObjects/
│   │   ├── BasePage.js               ✅ CRIADO
│   │   └── LoginPage.js              ✅ CRIADO
│   ├── helpers/
│   └── data/
│       └── testData.js               ✅ CRIADO
├── node_modules/
├── package.json
├── package-lock.json
└── wdio.conf.js
```

---

## Parte 8: Executando os Testes

### 8.1 Preparação

Antes de rodar os testes, certifique-se de que:

- ✅ **Emulador está rodando**
  ```powershell
  emulator -avd Pixel_5
  ```

- ✅ **Servidor Appium está ativo**
  ```powershell
  appium server --address 127.0.0.1 --port 4723
  ```

- ✅ **App está instalado**
  ```powershell
  adb install -r app-debug.apk
  ```

### 8.2 Executar Teste Específico

Para rodar apenas os testes de login:

```powershell
cd C:\Users\vinic\dev\InovaTech\tests\Mobile
npx wdio ./app/android/wdio.conf.android.js --spec ./specs/login.spec.js
```

### 8.3 Executar Todos os Testes

```powershell
npx wdio ./app/android/wdio.conf.android.js
```

### 8.4 Executar Testes Individuais

```powershell
npx wdio ./app/android/wdio.conf.android.js --spec ./specs/individual/test-elementos-visiveis.spec.js
```

### 8.5 Analisando os Resultados

Os testes exibirão no console:

- ✅ **Verde:** Teste passou
- ❌ **Vermelho:** Teste falhou
- **Tempo de execução**
- **Logs de console**

---

## Comandos Úteis de Referência

### 🔧 Comandos ADB

| Comando | Descrição |
|---------|-----------|
| `adb devices` | Lista dispositivos conectados |
| `adb install -r <caminho-apk>` | Instala/reinstala um APK |
| `adb uninstall <package-name>` | Desinstala um app |
| `adb shell am start -n <package>/<activity>` | Inicia um app |
| `adb shell am force-stop <package>` | Fecha um app |
| `adb logcat` | Visualiza logs do dispositivo |
| `adb logcat -c` | Limpa os logs |
| `adb shell ls /sdcard/Pictures/Screenshots` | Lista screenshots no dispositivo |
| `adb pull /sdcard/Pictures/Screenshots C:\Downloads` | Baixa screenshots para o PC |

### 📱 Comandos do Emulador

| Comando | Descrição |
|---------|-----------|
| `emulator -list-avds` | Lista AVDs disponíveis |
| `emulator -avd <nome>` | Inicia um emulador |
| `avdmanager list avd` | Lista AVDs com detalhes |

### 🧪 Comandos WebDriverIO

| Comando | Descrição |
|---------|-----------|
| `npx wdio --help` | Ajuda do WebDriverIO |
| `npx wdio <config> --spec <spec>` | Roda um teste específico |
| `npx wdio <config> --suite <suite>` | Roda uma suite de testes |

### 🚀 Comandos Appium

| Comando | Descrição |
|---------|-----------|
| `appium` | Inicia o Appium (versão padrão) |
| `appium server --address 127.0.0.1 --port 4723` | Inicia server com config |
| `appium driver list` | Lista drivers instalados |
| `appium driver install uiautomator2` | Instala driver Android |

---

## 📝 Checklist de Troubleshooting

### ❌ Erro: "Cannot find AVD"
- Verifique se o AVD foi criado: `emulator -list-avds`
- Recrie o AVD no Android Studio

### ❌ Erro: "ADB not found"
- Verifique as variáveis de ambiente
- Reinicie o terminal após configurar o PATH

### ❌ Erro: "Connection refused 4723"
- Certifique-se de que o servidor Appium está rodando
- Verifique se a porta 4723 não está em uso

### ❌ Erro: "Element not found"
- Use o Appium Inspector para validar o seletor
- Adicione `await driver.pause(2000)` antes de buscar elementos
- Verifique se está na tela correta

### ❌ App não instala no emulador
- Tente desinstalar primeiro: `adb uninstall com.example.inovatechmob`
- Verifique se o APK é compatível com a arquitetura do emulador

---

## 🎯 Próximos Passos

Agora que você criou seu primeiro teste mobile, você pode:

1. **Explorar mais seletores** com o Appium Inspector
2. **Criar novos Page Objects** para outras telas do app
3. **Adicionar mais cenários de teste** (fluxos negativos, validações, etc.)
4. **Implementar data-driven tests** usando arquivos JSON
5. **Integrar com CI/CD** (GitHub Actions, Jenkins, etc.)
6. **Testar em dispositivos reais** (não apenas emuladores)

---

## 📚 Recursos Adicionais

- **Documentação Oficial Appium:** https://appium.io/docs/en/latest/
- **WebDriverIO Docs:** https://webdriver.io/
- **Android ADB Docs:** https://developer.android.com/tools/adb
- **Appium Inspector:** https://github.com/appium/appium-inspector

---

## ✅ Conclusão

Parabéns! 🎉 Você concluiu o treinamento de testes mobile e agora é capaz de:

- ✅ Configurar o ambiente Android completo
- ✅ Criar e gerenciar emuladores
- ✅ Instalar e configurar o Appium
- ✅ Explorar elementos com Appium Inspector
- ✅ Criar testes automatizados usando Page Objects
- ✅ Executar e analisar resultados de testes

**Continue praticando e explorando novas funcionalidades!** 🚀
