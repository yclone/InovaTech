# 📖 Guia de Seletores Android - Appium

## 🎯 Tipos de Seletores

### 1. Accessibility ID (Recomendado) ⭐

O mais robusto e independente de idioma.

```javascript
// Formato
$('~accessibility-id')

// Exemplo
const loginButton = $('~login-button');
const usernameField = $('~username-input');

// No Android, corresponde ao atributo "content-desc"
```

**Vantagens:**
- Independente de idioma
- Mais estável
- Performance rápida

**Como definir no app:**
```xml
<Button
    android:id="@+id/login_button"
    android:contentDescription="login-button"
    android:text="Login" />
```

---

### 2. Resource ID (ID)

Usa o ID do recurso Android.

```javascript
// Formato completo
$('id=com.app.package:id/element_id')

// Formato curto (quando único)
$('id=element_id')

// Exemplo
const loginButton = $('id=com.inovatech:id/login_button');
const username = $('id=username');
```

**Vantagens:**
- Comum em apps Android
- Relativamente estável

**Desvantagens:**
- Pode mudar entre versões
- Depende do package name

---

### 3. XPath

Caminho completo ou relativo na hierarquia XML.

```javascript
// Por texto
$('//android.widget.Button[@text="Login"]')

// Por resource-id
$('//android.widget.EditText[@resource-id="username"]')

// Por classe e texto
$('//android.widget.TextView[@text="Bem-vindo"]')

// Caminho hierárquico
$('//android.view.ViewGroup/android.widget.Button[1]')

// Contém texto
$('//android.widget.TextView[contains(@text, "Olá")]')

// Múltiplos atributos
$('//android.widget.Button[@text="Login" and @enabled="true"]')
```

**Vantagens:**
- Muito flexível
- Permite consultas complexas

**Desvantagens:**
- Performance mais lenta
- Pode ser frágil com mudanças de layout

---

### 4. Class Name

Seleciona por classe do widget Android.

```javascript
// Formato
$('android.widget.Button')
$('android.widget.EditText')
$('android.widget.TextView')

// Exemplo - pega o primeiro da classe
const firstButton = $('android.widget.Button');

// Pegar todos da classe
const allButtons = $$('android.widget.Button');
```

**Classes comuns:**
- `android.widget.Button`
- `android.widget.EditText`
- `android.widget.TextView`
- `android.widget.ImageView`
- `android.view.ViewGroup`

---

### 5. UIAutomator (Android-Specific)

UsaUIAutomator selector do Android.

```javascript
// Por texto
$('android=new UiSelector().text("Login")')

// Por texto parcial
$('android=new UiSelector().textContains("Bem")')

// Por descrição
$('android=new UiSelector().description("login-button")')

// Por classe
$('android=new UiSelector().className("android.widget.Button")')

// Por resource-id
$('android=new UiSelector().resourceId("com.app:id/login")')

// Combinado
$('android=new UiSelector().className("android.widget.Button").text("Login")')

// Por índice
$('android=new UiSelector().className("android.widget.Button").instance(0)')
```

**Vantagens:**
- Muito poderoso
- Específico para Android
- Boa performance

---

## 🔍 Como Encontrar Seletores

### Método 1: Appium Inspector (Recomendado)

1. **Baixar Appium Inspector**
   - [GitHub Releases](https://github.com/appium/appium-inspector/releases)

2. **Configurar Desired Capabilities**
   ```json
   {
     "platformName": "Android",
     "appium:platformVersion": "13.0",
     "appium:deviceName": "emulator-5554",
     "appium:app": "C:/path/to/app.apk",
     "appium:automationName": "UiAutomator2"
   }
   ```

3. **Conectar e Inspecionar**
   - Clique em elementos para ver todos os seletores disponíveis

---

### Método 2: ADB e UIAutomator

```bash
# Capturar hierarquia de UI
adb shell uiautomator dump

# Ver o XML gerado
adb shell cat /sdcard/window_dump.xml

# Ou baixar e abrir localmente
adb pull /sdcard/window_dump.xml
```

---

### Método 3: Layout Inspector (Android Studio)

1. Abra Android Studio
2. **Tools** > **Layout Inspector**
3. Selecione o dispositivo/emulador
4. Inspecione elementos

---

## 💡 Boas Práticas

### 1. Ordem de Preferência

```
1. Accessibility ID (content-desc)
2. Resource ID
3. UIAutomator selector
4. XPath (último recurso)
```

### 2. Evite XPath Absoluto

❌ **Ruim:**
```javascript
const element = $('/hierarchy/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/...');
```

✅ **Bom:**
```javascript
const element = $('//android.widget.Button[@text="Login"]');
```

### 3. Use Waits

```javascript
// Sempre aguarde elementos
await element.waitForDisplayed({ timeout: 10000 });

// Ou use no Page Object
async click(element) {
  await element.waitForDisplayed({ timeout: 10000 });
  await element.click();
}
```

### 4. Crie Page Objects

```javascript
class LoginPage {
  // Getters para elementos
  get usernameField() {
    return $('~username-input');
  }

  get passwordField() {
    return $('~password-input');
  }

  get loginButton() {
    return $('~login-button');
  }

  // Métodos de ação
  async login(username, password) {
    await this.usernameField.setValue(username);
    await this.passwordField.setValue(password);
    await this.loginButton.click();
  }
}
```

### 5. Use Seletores Dinâmicos

```javascript
// Função helper para seletores dinâmicos
getButtonByText(text) {
  return $(`//android.widget.Button[@text="${text}"]`);
}

// Uso
await this.getButtonByText('Confirmar').click();
```

---

## 🎨 Exemplos Práticos

### Login Screen

```javascript
class LoginPage {
  // Por Accessibility ID
  get usernameField() { return $('~username-input'); }
  get passwordField() { return $('~password-input'); }
  get loginButton() { return $('~login-button'); }

  // Por Resource ID
  get usernameById() { return $('id=com.app:id/username'); }
  get passwordById() { return $('id=com.app:id/password'); }

  // Por XPath com texto
  get loginByText() { return $('//android.widget.Button[@text="Login"]'); }

  // Por UIAutomator
  get loginBySelector() {
    return $('android=new UiSelector().text("Login")');
  }
}
```

### Lista de Itens

```javascript
class ListPage {
  // Todos os itens da lista
  get allListItems() {
    return $$('android.widget.TextView');
  }

  // Item específico por texto
  getItemByText(text) {
    return $(`//android.widget.TextView[@text="${text}"]`);
  }

  // Item por posição
  getItemByIndex(index) {
    return $(`(//android.widget.TextView)[${index}]`);
  }

  // Usando UIAutomator
  getItemByTextSelector(text) {
    return $(`android=new UiSelector().text("${text}")`);
  }
}
```

### Scroll e Busca

```javascript
async scrollToElementByText(text) {
  return await $(
    `android=new UiScrollable(new UiSelector().scrollable(true))` +
    `.scrollIntoView(new UiSelector().text("${text}"))`
  );
}

// Uso
await this.scrollToElementByText('Configurações');
```

---

## 🧪 Testando Seletores

### No REPL do Appium

```javascript
// Iniciar sessão e testar seletores
await $('~login-button').isDisplayed(); // true/false
await $('~login-button').getText(); // texto do elemento
await $('~login-button').getAttribute('enabled'); // atributos
```

### Script de Teste Rápido

```javascript
describe('Teste de Seletores', () => {
  it('Deve encontrar elemento de várias formas', async () => {
    // Teste cada tipo de seletor
    const byAccessibility = await $('~login-button').isDisplayed();
    const byId = await $('id=login_button').isDisplayed();
    const byXPath = await $('//android.widget.Button[@text="Login"]').isDisplayed();

    console.log('Accessibility ID:', byAccessibility);
    console.log('Resource ID:', byId);
    console.log('XPath:', byXPath);
  });
});
```

---

## 🚨 Troubleshooting

### Elemento não encontrado

```javascript
// Adicione waits explícitos
await element.waitForDisplayed({ timeout: 15000 });

// Verifique se existe
const exists = await element.isExisting();
console.log('Elemento existe?', exists);

// Capture a hierarquia
const source = await driver.getPageSource();
console.log(source);
```

### Múltiplos elementos encontrados

```javascript
// Use $$ para pegar todos
const elements = await $$('android.widget.Button');
console.log('Total de botões:', elements.length);

// Especifique qual quer
const firstButton = elements[0];
```

### Seletor muito lento

```javascript
// Evite XPath complexo
// Prefira Accessibility ID ou Resource ID
// Se precisar de XPath, seja o mais específico possível
```

---

**Boa sorte com seus testes! 🚀**
