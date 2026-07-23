# Pré-requisitos para Executar os Testes Mobile

Este documento descreve todos os requisitos necessários para executar os testes mobile em qualquer máquina.

## 🔧 Requisitos de Sistema

### 1. Software Obrigatório

- **Node.js**: versão 16.x ou superior
- **Java JDK**: versão 11 ou superior (para Appium)
- **Android Studio** ou **Android SDK** instalado
- **Appium**: instalado via npm
- **Maven**: versão 3.6 ou superior (para o backend)

### 2. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente:

```bash
# Android SDK
ANDROID_HOME=C:\Users\<SEU_USUARIO>\AppData\Local\Android\Sdk
PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools

# Java
JAVA_HOME=C:\Program Files\Java\jdk-21
PATH=%PATH%;%JAVA_HOME%\bin
```

### 3. Verificar Instalação

```powershell
# Verificar versões
node --version        # deve ser >= 16.x
java --version        # deve ser >= 11
mvn --version         # deve ser >= 3.6
adb --version         # deve retornar versão do ADB
appium --version      # deve retornar versão do Appium
```

---

## 🚀 Configuração do Projeto

### Passo 1: Backend (API REST)

O aplicativo mobile precisa do backend rodando para funcionar.

#### 1.1 Verificar Dependências do Backend

Certifique-se de que o arquivo `c:\Users\vinic\dev\InovaTech\APP\pom.xml` contém as dependências necessárias para serialização JSON:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

⚠️ **Importante**: `spring-boot-starter-web` já inclui o Jackson por padrão para conversão JSON.

#### 1.2 Iniciar o Backend

```powershell
# Navegar até o diretório do backend
cd c:\Users\vinic\dev\InovaTech\APP

# Compilar e iniciar o servidor
mvn clean install
mvn spring-boot:run
```

Aguarde até ver a mensagem:
```
Started InovaTechApplication in X.XXX seconds
```

#### 1.3 Verificar se o Backend está Respondendo

```powershell
# Testar endpoint de health check
curl http://localhost:8080/actuator/health

# OU testar endpoint de login
curl -X POST http://localhost:8080/api/clientes/login `
  -H "Content-Type: application/json" `
  -d '{"Usuario":"teste@teste.com","Senha":"123"}'
```

---

### Passo 2: Emulador Android

#### 2.1 Iniciar Emulador

```powershell
# Listar emuladores disponíveis
emulator -list-avds

# Iniciar emulador (substitua pelo nome do seu emulador)
emulator -avd <NOME_DO_EMULADOR>

# OU use: Android Studio > Device Manager > Play
```

#### 2.2 Verificar Dispositivo Conectado

```powershell
adb devices
```

Deve mostrar algo como:
```
List of devices attached
emulator-5554   device
```

---

### Passo 3: Configurar URL da API no Aplicativo

O aplicativo Android precisa saber onde está o backend. Existem duas opções:

#### Opção 1: URL no APK

Se o APK foi compilado com IP fixo, você precisa garantir que o backend está acessível nesse IP.

#### Opção 2: Recompilar APK (Se necessário)

Se o APK está apontando para um IP incorreto, você precisa:

1. Obter o código fonte do aplicativo Android
2. Atualizar a URL base da API no código
3. Recompilar o APK

**Para usar localhost no emulador**:
- Use `10.0.2.2` ao invés de `localhost` ou `127.0.0.1`
- Exemplo: `http://10.0.2.2:8080/api`

---

### Passo 4: Configurar Projeto de Testes

#### 4.1 Instalar Dependências

```powershell
cd c:\Users\vinic\dev\InovaTech\tests\Mobile
npm install
```

#### 4.2 Configurar Arquivo .env

Copie o arquivo de exemplo e configure:

```powershell
copy .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# URL base da API
API_BASE_URL=http://10.0.2.2:8080/api

# Configurações do emulador
ANDROID_DEVICE_NAME=emulator-5554
ANDROID_PLATFORM_VERSION=16.0

# Timeout dos testes
TEST_TIMEOUT=30000
```

---

## 🔍 Solução do Erro "Unable to create @Body converter"

Este erro ocorre quando:

### Causa 1: Backend não está rodando
**Solução**: Inicie o backend conforme Passo 1.2

### Causa 2: URL da API incorreta no aplicativo
**Solução**: 
- Verifique se o app está usando `http://10.0.2.2:8080` para acessar localhost do emulador
- Se necessário, recompile o APK com a URL correta

### Causa 3: Firewall bloqueando conexão
**Solução**:
```powershell
# Permitir Java no firewall
netsh advfirewall firewall add rule name="Spring Boot" dir=in action=allow protocol=TCP localport=8080
```

### Causa 4: Backend sem dependência Jackson
**Solução**: Já está incluído no `spring-boot-starter-web`, mas se necessário, adicione explicitamente:

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

---

## ✅ Checklist Antes de Rodar os Testes

- [ ] Node.js instalado e no PATH
- [ ] Java JDK instalado e JAVA_HOME configurado
- [ ] Android SDK instalado e ANDROID_HOME configurado
- [ ] Maven instalado e no PATH
- [ ] Backend compilado com sucesso (`mvn clean install`)
- [ ] Backend rodando em http://localhost:8080
- [ ] Endpoint de login respondendo corretamente
- [ ] Emulador Android iniciado
- [ ] Dispositivo visível no `adb devices`
- [ ] Dependências do projeto de testes instaladas (`npm install`)
- [ ] Arquivo `.env` configurado
- [ ] APK do aplicativo disponível em `./APK/app-debug.apk`
- [ ] Aplicativo configurado para usar `http://10.0.2.2:8080` (se usar localhost)

---

## 🏃 Executando os Testes

Após completar todos os pré-requisitos:

```powershell
# Executar teste de smoke
npm run test:smoke

# OU usar WebDriverIO diretamente
npx wdio ./app/android/wdio.conf.android.js --spec ./specs/login-smoke.spec.js
```

---

## 📝 Dicas de Troubleshooting

### 1. Erro de Conexão com Appium
```bash
# Verificar se Appium está instalado
npm install -g appium

# Instalar driver UiAutomator2
appium driver install uiautomator2
```

### 2. APK não Instala
```bash
# Desinstalar versão anterior
adb uninstall com.example.inovatechmob

# Instalar manualmente
adb install ./APK/app-debug.apk
```

### 3. Backend não Inicia
```bash
# Verificar se porta 8080 está em uso
netstat -ano | findstr :8080

# Matar processo (se necessário)
taskkill /PID <PID> /F
```

### 4. Logs do Backend
```bash
# Ver logs em tempo real
cd c:\Users\vinic\dev\InovaTech\APP
mvn spring-boot:run | tee backend.log
```

---

## 📦 Distribuição para Outra Máquina

Para rodar em outra máquina, compartilhe:

1. ✅ Este documento (`PRE-REQUISITOS.md`)
2. ✅ Código fonte completo do projeto
3. ✅ APK do aplicativo (`./APK/app-debug.apk`)
4. ✅ Arquivo `.env.example`
5. ✅ Instruções para configurar variáveis de ambiente

**Não inclua**:
- ❌ `node_modules/` (usar `npm install`)
- ❌ `reports/` (gerado pelos testes)
- ❌ `.env` (usar `.env.example` como base)
- ❌ `logs/` (gerado durante execução)

---

## 🆘 Suporte

Se os testes ainda não funcionarem após seguir este guia:

1. Verifique o checklist completo acima
2. Consulte os logs de erro detalhados
3. Verifique conectividade entre emulador e backend
4. Confirme que todas as variáveis de ambiente estão configuradas corretamente
