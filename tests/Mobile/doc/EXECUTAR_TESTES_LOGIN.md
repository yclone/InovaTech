# 🚀 Guia Rápido - Executar Testes de Login InovaTech

## ✅ Pré-requisitos

1. **APK do InovaTech** na pasta `APK/`
2. **Emulador ou dispositivo** Android conectado
3. **Dependências** instaladas: `npm install`
4. **Driver UiAutomator2**: `npm run uiautomator2:install`

## 🎯 Configuração Rápida

### 1. Configure o arquivo .env

```bash
# Copie o exemplo
cp .env.example .env
```

Edite o `.env` com suas informações:
```env
# Obtenha com: adb devices
ANDROID_DEVICE_NAME=emulator-5554

# Versão do Android do seu dispositivo
ANDROID_PLATFORM_VERSION=13.0

# Configurações do App (ajuste conforme necessário)
APP_PACKAGE=com.inovatech.app
APP_ACTIVITY=.MainActivity
```

### 2. Inicie o Emulador

```bash
# Listar emuladores disponíveis
emulator -list-avds

# Iniciar emulador
emulator -avd Pixel_5_API_33

# Verificar se conectou
adb devices
```

## 🧪 Executar Testes de Login

### Opção 1: Smoke Tests (Recomendado para começar)

```bash
# Testes rápidos de validação
npx wdio ./app/android/wdio.conf.android.js --spec ./specs/login-smoke.spec.js
```

**O que testa:**
- ✅ App inicia corretamente
- ✅ Tela de login aparece
- ✅ Campos estão visíveis
- ✅ Login com teste@teste.com funciona
- ✅ Botões são clicáveis

### Opção 2: Testes Completos de Login

```bash
# Suite completa de testes
npx wdio ./app/android/wdio.conf.android.js --spec ./specs/login.spec.js
```

**O que testa:**
- ✅ Login com credenciais válidas (teste@teste.com / 123)
- ✅ Login com senha incorreta
- ✅ Login com email inválido
- ✅ Campos vazios
- ✅ Navegação para "Criar conta"
- ✅ Preenchimento de campos

### Opção 3: Todos os Testes

```bash
npm test
```

## 📊 Dados de Teste Configurados

```javascript
// Já configurados em app/data/testData.js

// ✅ VÁLIDO
Email: teste@teste.com
Senha: 123

// ❌ INVÁLIDOS
Email inválido: emailinvalido@teste.com
Senha errada: senhaerrada
```

## 🔍 Verificar Seletores

Se os testes falharem com "Element not found":

### 1. Capturar Hierarquia da Tela

```bash
# Enquanto o app está aberto na tela de login
adb shell uiautomator dump
adb pull /sdcard/window_dump.xml
# Abra o XML e procure os elementos
```

### 2. Usar Appium Inspector

```bash
# Em um terminal
npm run appium

# Em outro terminal ou no Inspector GUI
# Configure as capabilities (ver appium-inspector-config.md)
# Conecte e inspecione os elementos
```

### 3. Ajustar Seletores

Veja o guia completo em: [COMO_AJUSTAR_SELETORES.md](COMO_AJUSTAR_SELETORES.md)

Edite [`app/pageObjects/LoginPage.js`](app/pageObjects/LoginPage.js):

```javascript
// Exemplo: Se o ID real for "input_email"
get emailField() {
  return $('id=com.inovatech:id/input_email');
}
```

## 📸 Screenshots e Relatórios

### Onde encontrar:

```
reports/
├── html-reports/
│   └── report.html          # Relatório visual completo
└── screenshots/
    ├── login-result.png     # Screenshots automáticos
    └── smoke_*.png          # Screenshots de falhas
```

### Abrir relatório:

```bash
# Windows
start reports/html-reports/report.html

# Gerar relatório se não existir
npm run report:generate
```

## 🐛 Troubleshooting Rápido

### Teste falha: "Element not found"

**Solução 1**: Aumentar timeout
```javascript
// Edite wdio.conf.android.js
waitforTimeout: 20000, // Era 10000
```

**Solução 2**: Verificar se app abriu
```bash
adb shell dumpsys window | findstr mCurrentFocus
# Deve mostrar o package do InovaTech
```

**Solução 3**: Ver hierarquia real
```javascript
// Adicione no teste
const source = await driver.getPageSource();
console.log(source);
```

### App não instala

```bash
# Desinstalar versão antiga
adb uninstall com.inovatech.app

# Instalar manualmente
adb install -r APK/app-release.apk

# Verificar instalação
adb shell pm list packages | grep inovatech
```

### Teclado não esconde

```javascript
// No teste, após preencher campos
await driver.hideKeyboard();
await driver.pause(1000);
```

### Login muito lento

```javascript
// Desabilitar animações do dispositivo
adb shell settings put global window_animation_scale 0
adb shell settings put global transition_animation_scale 0
adb shell settings put global animator_duration_scale 0

# Reiniciar app
adb shell am force-stop com.inovatech.app
```

## 🎯 Fluxo Recomendado

```bash
# 1. Verificar setup
adb devices
# Deve mostrar seu dispositivo

# 2. Executar smoke test primeiro
npx wdio ./app/android/wdio.conf.android.js --spec ./specs/login-smoke.spec.js

# 3. Se passar, executar testes completos
npx wdio ./app/android/wdio.conf.android.js --spec ./specs/login.spec.js

# 4. Ver relatório
npm run report:generate
start reports/html-reports/report.html
```

## 📋 Checklist de Execução

Antes de executar os testes:

- [ ] APK na pasta APK/
- [ ] Arquivo .env configurado
- [ ] Emulador iniciado e conectado (`adb devices`)
- [ ] Dependências instaladas (`npm install`)
- [ ] Driver UiAutomator2 instalado
- [ ] ANDROID_HOME configurado
- [ ] JAVA_HOME configurado

## 🎨 Customizar Testes

### Adicionar novo teste:

```javascript
// Em specs/login.spec.js
it('Meu novo teste', async () => {
  // Arrange
  const email = 'novo@teste.com';
  const password = 'senha123';

  // Act
  await LoginPage.login(email, password);

  // Assert
  const resultado = await LoginPage.isLoginScreenDisplayed();
  expect(resultado).to.be.false; // Login bem-sucedido
});
```

### Usar outros dados:

```javascript
// Em app/data/testData.js, adicione:
validUsers: {
  mainTest: { email: 'teste@teste.com', password: '123' },
  meuUsuario: { email: 'meu@email.com', password: 'minhasenha' },
}

// No teste:
const { email, password } = testData.validUsers.meuUsuario;
await LoginPage.login(email, password);
```

## 📞 Comandos Úteis

```bash
# Ver logs do Android em tempo real
adb logcat | grep -i inovatech

# Ver logs do Appium (se rodando separadamente)
# No terminal onde o Appium está rodando

# Reiniciar o app manualmente
adb shell am force-stop com.inovatech.app
adb shell am start -n com.inovatech.app/.MainActivity

# Tirar screenshot manualmente
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png

# Ver info do package
adb shell dumpsys package com.inovatech.app | grep -E 'Activity|version'
```

## 🎉 Executar Agora!

```bash
# TESTE RÁPIDO - Comece por aqui! 
npx wdio ./app/android/wdio.conf.android.js --spec ./specs/login-smoke.spec.js
```

---

**Dúvidas?** Consulte:
- [README.md](README.md) - Documentação completa
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Solução de problemas
- [COMO_AJUSTAR_SELETORES.md](COMO_AJUSTAR_SELETORES.md) - Ajustar elementos

**Boa sorte com seus testes! 🚀**
