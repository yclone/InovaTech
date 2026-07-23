# 🎯 Como Ajustar Seletores para o App InovaTech

## 📱 Tela de Login Identificada

Baseado na tela fornecida, os elementos são:
- **Título**: "InovaTech"
- **Campo 1**: "E-mail"
- **Campo 2**: "Senha"
- **Botão**: "Entrar"
- **Link**: "Criar conta"

## 🔍 Encontrando os Seletores Corretos

### Passo 1: Usar Appium Inspector

1. **Baixar e instalar**
   - [Appium Inspector](https://github.com/appium/appium-inspector/releases)

2. **Configurar capabilities** (veja `appium-inspector-config.md`)
   ```json
   {
     "platformName": "Android",
     "appium:platformVersion": "13.0",
     "appium:deviceName": "SEU_DEVICE_ID",
     "appium:app": "caminho/para/APK/app.apk",
     "appium:automationName": "UiAutomator2"
   }
   ```

3. **Obter device ID**
   ```bash
   adb devices
   # Use o ID retornado (ex: emulator-5554)
   ```

4. **Conectar e Inspecionar**
   - Inicie o Appium: `npm run appium`
   - Abra o Inspector
   - Clique em "Start Session"
   - Inspecione cada elemento clicando nele

### Passo 2: Identificar Atributos

Para cada elemento, anote:
- **resource-id**: ID único do elemento
- **content-desc**: Accessibility ID
- **text**: Texto visível
- **class**: Tipo do widget Android

Exemplo do que você verá:
```xml
<EditText
  resource-id="com.inovatech:id/email_input"
  content-desc="Campo de email"
  text="E-mail"
  class="android.widget.EditText"
/>
```

### Passo 3: Atualizar LoginPage.js

Abra [`app/pageObjects/LoginPage.js`](app/pageObjects/LoginPage.js) e ajuste os seletores:

#### Opção 1: Resource ID (Melhor opção)
```javascript
get emailField() {
  return $('id=com.inovatech:id/email_input');
}
```

#### Opção 2: Accessibility ID
```javascript
get emailField() {
  return $('~Campo de email');
}
```

#### Opção 3: XPath com texto
```javascript
get emailField() {
  return $('//android.widget.EditText[@text="E-mail"]');
}
```

#### Opção 4: UIAutomator (Android)
```javascript
get emailField() {
  return $('android=new UiSelector().resourceId("com.inovatech:id/email_input")');
}
```

## 📝 Seletores Atuais (Genéricos)

Os seletores atuais no projeto usam múltiplas estratégias:

```javascript
// LoginPage.js - Seletores atuais
get emailField() {
  return $('android=new UiSelector().text("E-mail")') ||
         $('//android.widget.EditText[contains(@text, "E-mail")]') ||
         $('//android.widget.EditText[1]');
}
```

**Estes devem funcionar, mas podem ser lentos!**

## ⚡ Otimizando Seletores

### Se você encontrar os IDs reais:

```javascript
class LoginPage extends BasePage {
  // ✅ USE ESTES se encontrar os IDs no Inspector
  get emailField() {
    return $('id=com.inovatech:id/input_email'); // Substitua pelo ID real
  }

  get passwordField() {
    return $('id=com.inovatech:id/input_password'); // Substitua pelo ID real
  }

  get loginButton() {
    return $('id=com.inovatech:id/btn_login'); // Substitua pelo ID real
  }

  get createAccountLink() {
    return $('id=com.inovatech:id/link_create_account'); // Substitua pelo ID real
  }

  get appTitle() {
    return $('id=com.inovatech:id/txt_title'); // Substitua pelo ID real
  }
}
```

## 🧪 Testando Seletores

### Método 1: Via Inspector
- Clique no elemento
- Copie o seletor sugerido
- Cole no código

### Método 2: Via Teste Rápido
Crie um teste simples para verificar:

```javascript
it('Teste de seletores', async () => {
  // Testar se encontra o campo de email
  const emailExists = await LoginPage.emailField.isExisting();
  console.log('Campo de email existe?', emailExists);

  // Testar se está visível
  const emailDisplayed = await LoginPage.emailField.isDisplayed();
  console.log('Campo de email visível?', emailDisplayed);

  // Capturar hierarquia para debug
  const source = await driver.getPageSource();
  console.log(source);
});
```

### Método 3: Via Terminal (mais rápido)
```bash
# Ver hierarquia da tela atual
adb shell uiautomator dump
adb pull /sdcard/window_dump.xml
# Abra o XML e procure os IDs
```

## 🔧 Problemas Comuns

### 1. "Element not found"
**Causa**: Seletor incorreto ou elemento não carregou

**Solução**:
```javascript
// Adicione wait explícito
await LoginPage.emailField.waitForDisplayed({ timeout: 10000 });
```

### 2. Elemento encontrado mas não clicável
**Causa**: Elemento coberto ou fora da tela

**Solução**:
```javascript
// Scroll até o elemento
await LoginPage.scrollToElement(LoginPage.loginButton);
// Ou aguarde um pouco mais
await driver.pause(2000);
```

### 3. Seletores muito lentos
**Causa**: XPath complexo ou UIAutomator genérico

**Solução**: Use resource-id quando possível

### 4. App em português mas seletores com texto fixo
**Causa**: Texto pode mudar com idioma

**Solução**: Prefira resource-id ou content-desc

## 📋 Checklist de Otimização

- [ ] Abrir Appium Inspector
- [ ] Conectar ao dispositivo/emulador
- [ ] Inspecionar cada elemento da tela
- [ ] Anotar resource-id de cada elemento
- [ ] Atualizar LoginPage.js com IDs reais
- [ ] Executar smoke tests para validar
- [ ] Executar testes de login completos

## 🎯 Exemplo Completo Otimizado

Após inspecionar no Appium Inspector, seu código ficaria:

```javascript
// app/pageObjects/LoginPage.js
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  // Seletores - IDs reais do app (EXEMPLO - ajuste conforme seu app)
  get emailField() {
    return $('id=com.inovatech.app:id/edittext_email');
  }

  get passwordField() {
    return $('id=com.inovatech.app:id/edittext_password');
  }

  get loginButton() {
    return $('id=com.inovatech.app:id/button_login');
  }

  get createAccountLink() {
    return $('id=com.inovatech.app:id/textview_create_account');
  }

  get appTitle() {
    return $('id=com.inovatech.app:id/textview_title');
  }

  // Métodos permanecem os mesmos
  async login(email, password) {
    await this.setText(this.emailField, email);
    await this.setText(this.passwordField, password);
    await this.hideKeyboard();
    await this.click(this.loginButton);
  }
}

module.exports = new LoginPage();
```

## 🚀 Próximos Passos

1. **Execute o setup**: `npm install`
2. **Inicie o emulador**: `emulator -avd <nome>`
3. **Inicie o Appium**: `npm run appium` (em outro terminal)
4. **Abra o Inspector**: Configure e conecte
5. **Encontre os IDs**: Clique em cada elemento
6. **Atualize o código**: Substitua seletores genéricos
7. **Execute os testes**: `npm test`

## 📞 Ajuda

Se os seletores ainda não funcionarem:
1. Capture a hierarquia: `const source = await driver.getPageSource(); console.log(source);`
2. Verifique se o app instalou: `adb shell pm list packages | grep inovatech`
3. Veja os logs: `adb logcat | grep inovatech`
4. Consulte [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

**Dica**: Comece com seletores genéricos e otimize depois! ⚡
