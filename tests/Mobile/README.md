# InovaTech Mobile Tests

## 📱 Projeto de Testes Automatizados Mobile com Appium

Este projeto contém testes automatizados para aplicativos mobile Android usando Appium e WebdriverIO.

## 🛠️ Tecnologias Utilizadas

- **Appium**: Framework de automação mobile
- **WebdriverIO**: Test runner e framework de testes
- **Mocha**: Framework de testes BDD
- **Chai**: Biblioteca de asserções
- **UiAutomator2**: Driver para automação Android

## 📋 Pré-requisitos

### Software Necessário

1. **Node.js** (versão 14 ou superior)
   ```bash
   node --version
   ```

2. **Java JDK** (versão 11 ou superior)
   ```bash
   java -version
   ```

3. **Android SDK**
   - Android Studio instalado ou
   - Android command line tools

4. **Variáveis de Ambiente**
   ```bash
   JAVA_HOME=C:\Program Files\Java\jdk-11
   ANDROID_HOME=C:\Users\{user}\AppData\Local\Android\Sdk
   ```

5. **Emulador Android ou Dispositivo Real**
   - Emulador configurado via Android Studio
   - Ou dispositivo físico com USB debugging habilitado

## 🚀 Configuração Inicial

### 1. Instalar Dependências

```bash
npm install
```

### 2. Instalar Driver do Appium

```bash
npm run uiautomator2:install
```

### 3. Verificar Drivers Instalados

```bash
npm run driver:list
```

### 4. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e ajuste as configurações:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
ANDROID_DEVICE_NAME=emulator-5554
ANDROID_PLATFORM_VERSION=13.0
APP_PACKAGE=com.seuapp.pacote
APP_ACTIVITY=.MainActivity
```

### 5. Configurar o APK

Coloque o arquivo APK do aplicativo na pasta `APK/` e atualize o nome no arquivo de configuração se necessário.

## 📱 Preparando o Ambiente Android

### Iniciando o Emulador

```bash
# Listar emuladores disponíveis
emulator -list-avds

# Iniciar emulador específico
emulator -avd Pixel_5_API_33
```

### Verificando Dispositivos Conectados

```bash
adb devices
```

### Obtendo Informações do Dispositivo

```bash
# Nome do dispositivo
adb devices

# Versão do Android
adb shell getprop ro.build.version.release

# Package e Activity do app
adb shell dumpsys window | grep -E 'mCurrentFocus|mFocusedApp'
```

## 🎯 Executando os Testes

### Iniciar Appium Server (opcional)

```bash
npm run appium
```

### Executar Todos os Testes

```bash
npm test
```

### Executar Testes Específicos do Android

```bash
npm run test:android
```

### Executar Teste Específico

```bash
npx wdio ./app/android/wdio.conf.android.js --spec ./specs/login.spec.js
```

## 📊 Relatórios

### Gerar Relatório HTML

Após a execução dos testes, gere o relatório:

```bash
npm run report:generate
```

Os relatórios serão gerados em: `reports/html-reports/report.html`

### Preparar Estrutura de Relatórios

```bash
npm run report:prepare
```

## 📁 Estrutura do Projeto

```
tests/Mobile/
├── APK/                        # Arquivos APK para instalação
├── app/
│   ├── android/
│   │   └── wdio.conf.android.js  # Configuração WebdriverIO Android
│   ├── pageObjects/            # Page Objects
│   │   ├── BasePage.js
│   │   ├── LoginPage.js
│   │   └── HomePage.js
│   └── helpers/                # Utilitários e helpers
│       └── TestHelpers.js
├── specs/                      # Arquivos de teste
│   ├── login.spec.js
│   ├── home.spec.js
│   └── smoke.spec.js
├── reportManager/              # Gerenciador de relatórios
│   └── index.js
├── reports/                    # Relatórios gerados
│   ├── html-reports/
│   └── screenshots/
├── logs/                       # Logs do Appium
├── .env                        # Variáveis de ambiente
├── .env.example                # Exemplo de variáveis
├── package.json
└── README.md
```

## 🔍 Encontrando Seletores

### Usando Appium Inspector

1. Baixe o [Appium Inspector](https://github.com/appium/appium-inspector/releases)
2. Configure as capabilities:
   ```json
   {
     "platformName": "Android",
     "platformVersion": "13.0",
     "deviceName": "emulator-5554",
     "app": "caminho/para/app.apk",
     "automationName": "UiAutomator2"
   }
   ```
3. Inspecione os elementos e obtenha os seletores

### Tipos de Seletores

```javascript
// Accessibility ID (recomendado)
$('~login-button')

// Resource ID
$('id=com.app:id/login_button')

// XPath
$('//android.widget.Button[@text="Login"]')

// Class Name
$('android.widget.EditText')

// UIAutomator
$('android=new UiSelector().text("Login")')
```

## 📝 Escrevendo Novos Testes

### 1. Criar Page Object

```javascript
// app/pageObjects/NewPage.js
const BasePage = require('./BasePage');

class NewPage extends BasePage {
  get elementSelector() {
    return $('~element-id');
  }

  async performAction() {
    await this.click(this.elementSelector);
  }
}

module.exports = new NewPage();
```

### 2. Criar Spec de Teste

```javascript
// specs/newtest.spec.js
const NewPage = require('../pageObjects/NewPage');

describe('New Feature Tests', () => {
  it('Should perform action', async () => {
    await NewPage.performAction();
    expect(true).to.be.true;
  });
});
```

## 🐛 Troubleshooting

### Appium não inicia

```bash
# Verifique se a porta está em uso
netstat -ano | findstr :4723

# Mate o processo se necessário
taskkill /PID <PID> /F
```

### Emulador não conecta

```bash
# Reinicie o ADB
adb kill-server
adb start-server
adb devices
```

### App não instala

```bash
# Desinstale manualmente
adb uninstall com.seu.app.package

# Limpe o cache do emulador
adb shell pm clear com.seu.app.package
```

### Timeout nos testes

- Aumente o `waitforTimeout` em `wdio.conf.android.js`
- Verifique se o emulador está com performance adequada
- Considere usar um dispositivo real

## 🔧 Configurações Avançadas

### Executar em Múltiplos Dispositivos

Edite `wdio.conf.android.js`:

```javascript
capabilities: [
  {
    platformName: 'Android',
    'appium:deviceName': 'emulator-5554',
    // ... outras configs
  },
  {
    platformName: 'Android',
    'appium:deviceName': 'emulator-5556',
    // ... outras configs
  }
]
```

### Integração com CI/CD

```yaml
# exemplo .gitlab-ci.yml ou .github/workflows
test:
  script:
    - npm install
    - npm run uiautomator2:install
    - npm test
  artifacts:
    paths:
      - reports/
```

## 📚 Recursos Úteis

- [Appium Documentation](https://appium.io/docs/en/latest/)
- [WebdriverIO Documentation](https://webdriver.io/)
- [Appium Inspector](https://github.com/appium/appium-inspector)
- [Android UI Automator](https://developer.android.com/training/testing/other-components/ui-automator)

## 🤝 Contribuindo

1. Mantenha o padrão de Page Objects
2. Escreva testes claros e descritivos
3. Use os helpers disponíveis
4. Documente funcionalidades complexas
5. Execute `npm run lint-fix` antes de commitar

## 📄 Licença

ISC

---

**InovaTech Team** - Testes Mobile Automatizados
