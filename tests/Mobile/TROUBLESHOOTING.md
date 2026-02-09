# 🔧 Troubleshooting Guide - Mobile Tests

## 🚨 Problemas Comuns e Soluções

### 1. Appium Server não Inicia

#### Sintoma:
```
Error: Appium server is not running
```

#### Soluções:

**A. Porta 4723 já está em uso**
```powershell
# Windows - Verificar porta
netstat -ano | findstr :4723

# Matar processo
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4723 | xargs kill -9
```

**B. Reinstalar Appium**
```bash
npm uninstall -g appium
npm install -g appium@latest
appium driver install uiautomator2
```

**C. Verificar instalação**
```bash
appium --version
appium driver list
```

---

### 2. Dispositivo/Emulador Não Detectado

#### Sintoma:
```
Error: Could not find a connected Android device
```

#### Soluções:

**A. Reiniciar ADB**
```bash
adb kill-server
adb start-server
adb devices
```

**B. Verificar USB Debugging (Dispositivo Real)**
```
1. Configurações > Sobre o telefone
2. Tocar 7x em "Número da versão"
3. Opções do desenvolvedor > Ativar "Depuração USB"
4. Conectar USB e aceitar no dispositivo
```

**C. Emulador não inicia**
```bash
# Listar AVDs
emulator -list-avds

# Iniciar específico
emulator -avd Pixel_5_API_33

# Se falhar, criar novo AVD no Android Studio
```

**D. Cold Boot do Emulador**
```bash
emulator -avd <nome> -no-snapshot-load
```

---

### 3. App Não Instala

#### Sintoma:
```
Error: Failed to install app
```

#### Soluções:

**A. Desinstalar versão anterior**
```bash
adb uninstall com.seu.app.package
```

**B. Verificar APK**
```bash
# Ver informações do APK
aapt dump badging APK/app-release.apk

# Se AAPT não encontrado, adicione ao PATH:
# %ANDROID_HOME%\build-tools\<version>\
```

**C. Espaço insuficiente**
```bash
# Verificar espaço no dispositivo
adb shell df

# Limpar cache de apps
adb shell pm trim-caches 500M
```

**D. Incompatibilidade de arquitetura**
```bash
# Verificar arquitetura do dispositivo
adb shell getprop ro.product.cpu.abi

# Garantir que APK suporta essa arquitetura
```

---

### 4. Elementos Não Encontrados

#### Sintoma:
```
Error: Element could not be located
```

#### Soluções:

**A. Aumentar timeout**
```javascript
// No Page Object
await element.waitForDisplayed({ timeout: 15000 });

// No wdio.conf
waitforTimeout: 20000,
```

**B. Usar Appium Inspector**
```bash
# Baixar: https://github.com/appium/appium-inspector/releases
# Inspecionar elementos para obter seletores corretos
```

**C. Tentar diferentes seletores**
```javascript
// Accessibility ID
$('~login-button')

// Resource ID
$('id=com.app:id/login_button')

// XPath
$('//android.widget.Button[@text="Login"]')

// UIAutomator
$('android=new UiSelector().text("Login")')
```

**D. Verificar página correta**
```javascript
// Antes de buscar elemento
const source = await driver.getPageSource();
console.log(source); // Ver hierarquia atual
```

---

### 5. Testes Lentos ou Timeout

#### Sintoma:
```
Error: Timeout of 60000ms exceeded
```

#### Soluções:

**A. Aumentar timeouts no Mocha**
```javascript
// wdio.conf.android.js
mochaOpts: {
  timeout: 120000, // 2 minutos
}

// Ou no teste específico
it('Test', async function() {
  this.timeout(180000); // 3 minutos
});
```

**B. Otimizar emulador**
- Alocar mais RAM no AVD Manager
- Habilitar aceleração de hardware (Intel HAXM/AMD)
- Desabilitar animações no dispositivo:
```bash
adb shell settings put global window_animation_scale 0
adb shell settings put global transition_animation_scale 0
adb shell settings put global animator_duration_scale 0
```

**C. Usar dispositivo real**
- Geralmente mais rápido que emuladores

---

### 6. Variáveis de Ambiente Não Reconhecidas

#### Sintoma:
```
ANDROID_HOME is not set
JAVA_HOME is not set
```

#### Soluções:

**Windows:**
```powershell
# Verificar
$env:ANDROID_HOME
$env:JAVA_HOME

# Configurar permanentemente
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\User\AppData\Local\Android\Sdk', 'User')
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Java\jdk-11', 'User')

# Adicionar ao PATH
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
```

**Linux/Mac:**
```bash
# Adicionar ao ~/.bashrc ou ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools

# Recarregar
source ~/.bashrc  # ou ~/.zshrc
```

---

### 7. Erro de Certificado/SSL

#### Sintoma:
```
Error: unable to get local issuer certificate
```

#### Soluções:

```bash
# Configurar NPM
npm config set strict-ssl false
npm config set registry http://registry.npmjs.org/

# Ou temporariamente
npm install --strict-ssl=false
```

---

### 8. Dependências Não Instaladas

#### Sintoma:
```
Error: Cannot find module '@wdio/cli'
```

#### Soluções:

```bash
# Limpar cache
npm cache clean --force

# Deletar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Ou use npm ci para instalação limpa
npm ci
```

---

### 9. Driver UiAutomator2 não Encontrado

#### Sintoma:
```
Error: Could not find a driver for automationName 'UiAutomator2'
```

#### Soluções:

```bash
# Instalar driver
npx appium driver install uiautomator2

# Verificar
npx appium driver list

# Se continuar erro, reinstalar Appium
npm uninstall -g appium
npm install -g appium@latest
npx appium driver install uiautomator2
```

---

### 10. Permissões Android Não Concedidas

#### Sintoma:
App abre mas não funciona por falta de permissões

#### Soluções:

**A. Auto-grant no capability**
```javascript
'appium:autoGrantPermissions': true,
```

**B. Manualmente via ADB**
```bash
# Listar permissões do app
adb shell dumpsys package com.seu.app | grep permission

# Conceder permissão específica
adb shell pm grant com.seu.app android.permission.CAMERA
adb shell pm grant com.seu.app android.permission.READ_EXTERNAL_STORAGE
```

---

### 11. Appium Inspector Não Conecta

#### Sintoma:
"Could not start session" no Inspector

#### Soluções:

**A. Verificar Appium Server**
```bash
# Deve estar rodando
appium
```

**B. Verificar Capabilities**
- Confirmar deviceName com `adb devices`
- Caminho absoluto para APK
- Platform version correta

**C. Remote Path correto**
```
Host: 127.0.0.1
Port: 4723
Path: /
```

---

### 12. Screenshot Não Salva

#### Sintoma:
```
Error: Failed to save screenshot
```

#### Soluções:

```javascript
// Criar diretório se não existir
const fs = require('fs');
const dir = './reports/screenshots';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

// Ou usar reportManager
npm run report:prepare
```

---

### 13. Teclado Android Não Esconde

#### Sintoma:
Teclado fica aberto e cobre elementos

#### Soluções:

```javascript
// Forçar esconder
await driver.hideKeyboard();

// Ou pressionar Back
await driver.back();

// Ou usar pressKeyCode
await driver.pressKeyCode(4); // Back button
```

---

### 14. Gestos Não Funcionam

#### Sintoma:
Swipe, scroll não têm efeito

#### Soluções:

```javascript
// Usar mobile: scroll moderno
await driver.execute('mobile: scroll', {
  direction: 'down',
  percent: 1.0
});

// Ou touchPerform
await driver.touchPerform([
  { action: 'press', options: { x: 500, y: 1000 } },
  { action: 'wait', options: { ms: 500 } },
  { action: 'moveTo', options: { x: 500, y: 300 } },
  { action: 'release' }
]);
```

---

### 15. Relatórios HTML Não Geram

#### Sintoma:
`npm run report:generate` falha

#### Soluções:

```bash
# Verificar se wdio-html-nice-reporter está instalado
npm list wdio-html-nice-reporter

# Reinstalar se necessário
npm install wdio-html-nice-reporter@8.1.3-beta --save

# Criar diretórios manualmente
mkdir -p reports/html-reports

# Executar geração
npm run report:generate
```

---

## 🔍 Comandos de Diagnóstico

### Informações do Sistema

```bash
# Node.js
node --version
npm --version

# Java
java -version

# Android SDK
adb version
$env:ANDROID_HOME  # Windows
echo $ANDROID_HOME  # Linux/Mac

# Appium
appium --version
appium driver list
```

### Informações do Dispositivo

```bash
# Dispositivos conectados
adb devices -l

# Informações detalhadas
adb shell getprop | grep -E 'model|version|manufacturer'

# Versão Android
adb shell getprop ro.build.version.release

# Arquitetura
adb shell getprop ro.product.cpu.abi

# Espaço disponível
adb shell df -h
```

### Debug em Tempo Real

```bash
# Logs do Android
adb logcat

# Filtrar logs do app
adb logcat | grep "com.seu.app"

# Logs do Appium (se rodando separadamente)
appium --log-level debug

# Monitorar performance
adb shell top
```

---

## 📞 Suporte Adicional

### Comunidades
- [Appium Discuss](https://discuss.appium.io/)
- [WebdriverIO Discord](https://discord.webdriver.io/)
- [Stack Overflow - appium tag](https://stackoverflow.com/questions/tagged/appium)

### Documentação Oficial
- [Appium Docs](https://appium.io/docs/en/latest/)
- [WebdriverIO Docs](https://webdriver.io/)
- [Android Debug Bridge (ADB)](https://developer.android.com/studio/command-line/adb)

### Logs Detalhados

Para debug avançado, habilite logs detalhados:

```javascript
// wdio.conf.android.js
logLevel: 'debug',  // ou 'trace' para máximo detalhe
```

---

**Mantenha este guia à mão durante o desenvolvimento! 🛠️**
