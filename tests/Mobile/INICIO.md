# ✅ Testes de Login - InovaTech Mobile

## 🎯 Status do Projeto

### ✨ Configurado para Tela de Login InovaTech

Baseado na tela fornecida com:
- Campo "E-mail"
- Campo "Senha"  
- Botão "Entrar"
- Link "Criar conta"

### 👤 Credenciais de Teste

```
Email: teste@teste.com
Senha: 123
```

## 📂 Arquivos Criados

### 🧪 Testes

| Arquivo | Descrição | Como Executar |
|---------|-----------|---------------|
| [`specs/login-smoke.spec.js`](specs/login-smoke.spec.js) | Smoke tests rápidos | `npx wdio ./app/android/wdio.conf.android.js --spec ./specs/login-smoke.spec.js` |
| [`specs/login.spec.js`](specs/login.spec.js) | Suite completa de login | `npx wdio ./app/android/wdio.conf.android.js --spec ./specs/login.spec.js` |

### 🎨 Page Objects

| Arquivo | Descrição |
|---------|-----------|
| [`app/pageObjects/LoginPage.js`](app/pageObjects/LoginPage.js) | Page Object da tela de login com seletores otimizados |
| [`app/pageObjects/BasePage.js`](app/pageObjects/BasePage.js) | Classe base com métodos comuns |

### 📊 Dados

| Arquivo | Descrição |
|---------|-----------|
| [`app/data/testData.js`](app/data/testData.js) | Dados de teste centralizados (teste@teste.com) |

### 📚 Documentação

| Arquivo | Conteúdo |
|---------|----------|
| [`EXECUTAR_TESTES_LOGIN.md`](EXECUTAR_TESTES_LOGIN.md) | 🚀 **COMECE AQUI!** Guia rápido de execução |
| [`COMO_AJUSTAR_SELETORES.md`](COMO_AJUSTAR_SELETORES.md) | Como otimizar seletores para seu app |
| [`README.md`](README.md) | Documentação completa do projeto |
| [`QUICKSTART.md`](QUICKSTART.md) | Setup e comandos essenciais |
| [`GUIA_SELETORES.md`](GUIA_SELETORES.md) | Tipos de seletores Android |
| [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) | Solução de problemas comuns |
| [`ARQUITETURA.md`](ARQUITETURA.md) | Arquitetura e padrões do projeto |

## 🚀 Início Rápido

### 1️⃣ Instalar Dependências

```bash
cd tests/Mobile
npm install
npm run uiautomator2:install
```

### 2️⃣ Configurar Ambiente

```bash
# Copiar e editar .env
cp .env.example .env

# Editar com device ID e versão Android
# Obter device ID: adb devices
```

### 3️⃣ Adicionar APK

Coloque o APK do InovaTech na pasta `APK/`

### 4️⃣ Iniciar Emulador

```bash
# Listar emuladores
emulator -list-avds

# Iniciar
emulator -avd Pixel_5_API_33
```

### 5️⃣ Executar Smoke Tests

```bash
npx wdio ./app/android/wdio.conf.android.js --spec ./specs/login-smoke.spec.js
```

## 📋 Cenários de Teste Implementados

### ✅ Smoke Tests (login-smoke.spec.js)

1. ☑️ App inicia e exibe tela de login
2. ☑️ Login com teste@teste.com funciona
3. ☑️ Elementos da tela estão visíveis
4. ☑️ Campos podem ser preenchidos
5. ☑️ Botão Entrar é clicável
6. ☑️ Link Criar Conta é clicável

### ✅ Testes Completos (login.spec.js)

1. ☑️ Exibe tela de login corretamente
2. ☑️ Login com credenciais válidas (teste@teste.com / 123)
3. ☑️ Erro com senha incorreta
4. ☑️ Erro com email inválido
5. ☑️ Erro com campo de e-mail vazio
6. ☑️ Erro com campo de senha vazio
7. ☑️ Erro com ambos os campos vazios
8. ☑️ Navegação para tela de cadastro
9. ☑️ Preenchimento do campo de e-mail
10. ☑️ Preenchimento do campo de senha

## 🎨 Arquitetura

```
LoginPage (Page Object)
    ↓
BasePage (Métodos comuns)
    ↓
Specs (Testes)
    ↓
TestData (Dados)
```

## 🔧 Seletores Implementados

Os seletores usam **múltiplas estratégias** para maior compatibilidade:

```javascript
// Exemplo do campo de e-mail
get emailField() {
  return $('android=new UiSelector().text("E-mail")') ||
         $('//android.widget.EditText[contains(@text, "E-mail")]') ||
         $('//android.widget.EditText[1]');
}
```

### 🎯 Para Melhor Performance

Após executar os testes inicialmente, use o **Appium Inspector** para encontrar os **resource-ids** reais e atualize os seletores em `LoginPage.js`.

👉 Ver guia completo: [`COMO_AJUSTAR_SELETORES.md`](COMO_AJUSTAR_SELETORES.md)

## 📊 Relatórios

Após executar os testes:

```bash
# Gerar relatório HTML
npm run report:generate

# Abrir no navegador (Windows)
start reports/html-reports/report.html
```

### Onde encontrar:

- **Relatórios HTML**: `reports/html-reports/report.html`
- **Screenshots**: `reports/screenshots/`
- **Logs**: `logs/appium.log`

## 🐛 Problemas Comuns

| Problema | Solução Rápida |
|----------|----------------|
| Element not found | Ver [`COMO_AJUSTAR_SELETORES.md`](COMO_AJUSTAR_SELETORES.md) |
| Timeout | Aumentar `waitforTimeout` em `wdio.conf.android.js` |
| App não instala | `adb uninstall com.inovatech.app` |
| Emulador não conecta | `adb kill-server && adb start-server` |

👉 Guia completo: [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md)

## 🎓 Próximos Passos

### Otimização

1. [ ] Usar Appium Inspector para encontrar IDs reais
2. [ ] Atualizar seletores em `LoginPage.js`
3. [ ] Ajustar timeouts conforme necessário
4. [ ] Testar em dispositivos reais

### Expansão

1. [ ] Adicionar testes para HomePage
2. [ ] Criar testes para fluxo completo
3. [ ] Adicionar testes de criação de conta
4. [ ] Implementar testes de recuperação de senha

### CI/CD

1. [ ] Configurar pipeline CI/CD
2. [ ] Integrar com relatórios automáticos
3. [ ] Configurar execução agendada

## 📞 Comandos Essenciais

```bash
# Executar smoke test (mais rápido)
npx wdio ./app/android/wdio.conf.android.js --spec ./specs/login-smoke.spec.js

# Executar testes completos de login
npx wdio ./app/android/wdio.conf.android.js --spec ./specs/login.spec.js

# Executar todos os testes
npm test

# Ver dispositivos
adb devices

# Listar drivers Appium
npm run driver:list

# Gerar relatório
npm run report:generate
```

## 📖 Documentação Recomendada

**Para começar:**
1. 🚀 [`EXECUTAR_TESTES_LOGIN.md`](EXECUTAR_TESTES_LOGIN.md) - Guia passo a passo

**Para configurar:**
2. ⚡ [`QUICKSTART.md`](QUICKSTART.md) - Setup rápido
3. 🔍 [`COMO_AJUSTAR_SELETORES.md`](COMO_AJUSTAR_SELETORES.md) - Otimizar seletores

**Para aprender:**
4. 📚 [`README.md`](README.md) - Documentação completa
5. 🏗️ [`ARQUITETURA.md`](ARQUITETURA.md) - Como funciona
6. 📝 [`GUIA_SELETORES.md`](GUIA_SELETORES.md) - Tipos de seletores

**Para resolver problemas:**
7. 🛠️ [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) - Solução de problemas

## ✨ Recursos Implementados

- ✅ Page Object Model
- ✅ Múltiplas estratégias de seletor
- ✅ Dados de teste centralizados
- ✅ Test helpers reutilizáveis
- ✅ Smoke tests otimizados
- ✅ Suite completa de testes de login
- ✅ Relatórios HTML detalhados
- ✅ Screenshots automáticos em falhas
- ✅ Logging estruturado
- ✅ Documentação completa

## 🎉 Pronto para Uso!

```bash
# Execute agora mesmo:
npx wdio ./app/android/wdio.conf.android.js --spec ./specs/login-smoke.spec.js
```

---

**InovaTech Mobile Tests** - Testes automatizados para aplicativo mobile Android  
**Framework**: WebdriverIO + Appium + Mocha + Chai  
**Padrão**: Page Object Model  
**Credenciais de Teste**: teste@teste.com / 123
