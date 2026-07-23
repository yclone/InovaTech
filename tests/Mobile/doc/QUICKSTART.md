# 🚀 Guia Rápido - Setup e Execução

## ⚡ Setup Rápido

### 1. Instalação Básica

```bash
# 1. Instalar dependências
npm install

# 2. Instalar driver do Appium
npm run uiautomator2:install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações
```

### 2. Preparar Android

```bash
# Iniciar emulador (substitua pelo nome do seu AVD)
emulator -avd Pixel_5_API_33

# Verificar dispositivos conectados
adb devices
```

### 3. Executar Testes

```bash
# Opção 1: Appium será iniciado automaticamente
npm test

# Opção 2: Iniciar Appium manualmente em outro terminal
npm run appium
# Em outro terminal:
npm test
```

## 📱 Comandos Úteis

### ADB (Android Debug Bridge)

```bash
# Listar dispositivos conectados
adb devices

# Instalar APK manualmente
adb install -r APK/app-release.apk

# Desinstalar app
adb uninstall com.seu.app.package

# Ver logs do dispositivo
adb logcat

# Limpar dados do app
adb shell pm clear com.seu.app.package

# Obter o package name do app no foco
adb shell dumpsys window | findstr mCurrentFocus
```

### Emulador Android

```bash
# Listar emuladores disponíveis
emulator -list-avds

# Iniciar emulador específico
emulator -avd <nome_do_avd>

# Iniciar emulador sem animação (mais rápido para testes)
emulator -avd <nome_do_avd> -no-boot-anim -no-audio
```

### Appium

```bash
# Listar drivers instalados
npm run driver:list

# Iniciar Appium Server
npm run appium

# Instalar driver específico
npx appium driver install uiautomator2
```

### NPM Scripts Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes Android
npm run test:android

# Gerar relatório HTML
npm run report:generate

# Preparar estrutura de relatórios
npm run report:prepare

# Corrigir lint
npm run lint-fix

# Formatar código
npm run format

# Auditoria de segurança
npm run audit
```

## 🔍 Executar Testes Específicos

```bash
# Executar apenas testes de login
npx wdio ./app/android/wdio.conf.android.js --spec ./specs/login.spec.js

# Executar apenas testes de home
npx wdio ./app/android/wdio.conf.android.js --spec ./specs/home.spec.js

# Executar smoke tests
npx wdio ./app/android/wdio.conf.android.js --spec ./specs/smoke.spec.js
```

## 🔧 Configurações Essenciais

### Arquivo .env

```env
# Device
ANDROID_DEVICE_NAME=emulator-5554
ANDROID_PLATFORM_VERSION=13.0

# Appium Server
APPIUM_HOST=127.0.0.1
APPIUM_PORT=4723

# App
APP_PACKAGE=com.seu.app
APP_ACTIVITY=.MainActivity
```

### Obter Informações do App

```bash
# Package name e Activity do app em execução
adb shell dumpsys window | findstr mCurrentFocus

# Listar todas as atividades do app
adb shell dumpsys package com.seu.app | findstr Activity

# Informações completas do package
aapt dump badging APK/app-release.apk | findstr package
```

## 📊 Visualizar Relatórios

Após executar os testes:

```bash
# Gerar relatório
npm run report:generate

# Relatório estará em:
# reports/html-reports/report.html

# Abrir no navegador (Windows)
start reports/html-reports/report.html
```

## 🐛 Problemas Comuns

### 1. Porta 4723 em uso

```bash
# Windows
netstat -ano | findstr :4723
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4723 | xargs kill -9
```

### 2. Emulador não detectado

```bash
adb kill-server
adb start-server
adb devices
```

### 3. App não instala no emulador

```bash
# Desinstalar versão anterior
adb uninstall com.seu.app

# Instalar novamente
adb install -r APK/app-release.apk
```

### 4. Appium não encontra elementos

- Verifique os seletores usando Appium Inspector
- Aumente o `waitforTimeout` no wdio.conf.android.js
- Use `await element.waitForDisplayed()`

## 📝 Checklist Antes de Executar

- [ ] Node.js instalado (v14+)
- [ ] Java JDK instalado (v11+)
- [ ] Android SDK configurado
- [ ] ANDROID_HOME e JAVA_HOME configurados
- [ ] Emulador iniciado ou dispositivo conectado
- [ ] APK na pasta APK/
- [ ] Arquivo .env configurado
- [ ] Dependências instaladas (`npm install`)
- [ ] Driver UiAutomator2 instalado

## 🎯 Estrutura de um Teste

```javascript
const PageObject = require('../pageObjects/PageObject');

describe('Feature Name', () => {
  beforeEach(async () => {
    // Setup antes de cada teste
  });

  it('Should do something', async () => {
    // Arrange (preparar)
    const data = 'test';

    // Act (executar ação)
    await PageObject.performAction(data);

    // Assert (verificar)
    expect(result).to.be.true;
  });

  afterEach(async () => {
    // Cleanup após cada teste
  });
});
```

## 🚀 Próximos Passos

1. Ajuste os seletores nos Page Objects de acordo com seu app
2. Configure o .env com as informações corretas
3. Execute os smoke tests primeiro: `npx wdio ./app/android/wdio.conf.android.js --spec ./specs/smoke.spec.js`
4. Adapte os testes de login e home conforme necessário
5. Crie novos Page Objects e testes para outras funcionalidades

---

**Pronto para testar! 🎉**
