# ✅ Checklist Rápido - Nova Máquina

Use este checklist ao configurar o ambiente de testes mobile em uma nova máquina.

---

## 📋 Pré-Instalação

### Software Obrigatório
- [ ] Node.js (v16+) instalado → https://nodejs.org/
- [ ] Java JDK (v11+) instalado
- [ ] Maven (v3.6+) instalado → https://maven.apache.org/
- [ ] Android Studio OU Android SDK instalado
- [ ] Git instalado (para clonar o projeto)

### Variáveis de Ambiente Windows
```powershell
# Executar como Administrador
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-21", "Machine")
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "Machine")

# Adicionar ao PATH
$path = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
$path += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
[System.Environment]::SetEnvironmentVariable("Path", $path, "Machine")

# Reiniciar o terminal após configurar
```

---

## 🔧 Configuração do Projeto

### 1. Clonar/Copiar Projeto
- [ ] Projeto copiado para: `c:\Users\<USUARIO>\dev\InovaTech`
- [ ] Estrutura de pastas verificada (APP, FrontEnd, Infra, tests)

### 2. Backend (API)
```powershell
cd c:\Users\<USUARIO>\dev\InovaTech\APP
```
- [ ] Executar: `mvn clean install`
- [ ] Sem erros de compilação
- [ ] Executar: `mvn spring-boot:run`
- [ ] Aguardar: "Started InovaTechApplication"
- [ ] Testar: `curl http://localhost:8080/actuator/health`
- [ ] Resposta: `{"status":"UP"}`

### 3. Testes Mobile
```powershell
cd c:\Users\<USUARIO>\dev\InovaTech\tests\Mobile
```
- [ ] Executar: `npm install`
- [ ] Executar: `.\setup-inicial.ps1`
- [ ] Arquivo `.env` criado e configurado
- [ ] APK presente em: `./APK/app-debug.apk`

### 4. Appium
- [ ] Executar: `npm install -g appium`
- [ ] Executar: `appium driver install uiautomator2`
- [ ] Verificar: `appium --version`
- [ ] Verificar: `npm run driver:list`

### 5. Emulador Android
- [ ] Android Studio → Device Manager
- [ ] Criar emulador (se não existir):
  - Nome: Pixel_5_API_33 (ou similar)
  - Android: 13.0 ou superior
  - RAM: 4GB mínimo
  - Storage: 8GB mínimo
- [ ] Iniciar emulador
- [ ] Aguardar boot completo
- [ ] Verificar: `adb devices`
- [ ] Aparece: `emulator-5554   device`

---

## ✅ Verificação Final

### Backend
- [ ] Backend rodando em `http://localhost:8080`
- [ ] Endpoint health respondendo
- [ ] Endpoint login respondendo:
```powershell
curl -X POST http://localhost:8080/api/clientes/login `
  -H "Content-Type: application/json" `
  -d '{"Usuario":"teste@teste.com","Senha":"123"}'
```

### Conectividade Emulador → Backend
- [ ] Testar do emulador:
```powershell
adb shell "curl http://10.0.2.2:8080/actuator/health"
```
- [ ] Resposta: `{"status":"UP"}`

### Firewall (se necessário)
- [ ] Porta 8080 liberada:
```powershell
# Executar como Administrador
netsh advfirewall firewall add rule name="Spring Boot API" dir=in action=allow protocol=TCP localport=8080
```

### Pré-requisitos Automático
```powershell
cd c:\Users\<USUARIO>\dev\InovaTech\tests\Mobile
.\verificar-pre-requisitos.ps1
```
- [ ] Todos os checks com ✅
- [ ] Máximo de avisos ⚠️ (não erros ❌)

---

## 🏃 Primeiro Teste

### Executar Smoke Test
```powershell
cd c:\Users\<USUARIO>\dev\InovaTech\tests\Mobile
npm run test:smoke
```

### Resultados Esperados
- [ ] Appium inicia sem erros
- [ ] App instala no emulador
- [ ] App abre automaticamente
- [ ] Tela de login aparece
- [ ] Teste de login executa
- [ ] Teste passa (✅)
- [ ] Report gerado em: `./reports/`

---

## 📝 Configurações Personalizadas

### Se usar dispositivo físico (não emulador)

1. Descobrir IP da máquina:
```powershell
ipconfig
# Anotar IPv4: _________________
```

2. Atualizar `.env`:
```env
API_BASE_URL=http://<SEU_IP>:8080/api
```

3. Conectar USB e ativar Debug mode no dispositivo
```powershell
adb devices
# Deve aparecer device
```

### Se usar porta diferente de 8080

Atualizar `.env` e recompilar APK com nova URL.

---

## 🆘 Troubleshooting

Se encontrar problemas:

1. **Erro de API**: Consulte [TROUBLESHOOTING-API.md](./TROUBLESHOOTING-API.md)
2. **Erro geral**: Consulte [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. **Guia completo**: Consulte [PRE-REQUISITOS.md](./PRE-REQUISITOS.md)

### Logs de Debug

Backend:
```powershell
cd ..\APP
mvn spring-boot:run | Tee-Object backend.log
```

Appium:
```powershell
appium server --log appium.log --log-level debug
```

Android Logcat:
```powershell
adb logcat | Select-String "Retrofit|HTTP|API" > android.log
```

---

## ✅ Checklist Concluído!

- [ ] Todos os itens verificados
- [ ] Primeiro teste executado com sucesso
- [ ] Ambiente pronto para desenvolvimento

**Data da configuração**: ___/___/______

**Versões instaladas**:
- Node.js: __________
- Java: __________
- Maven: __________
- Appium: __________
- Android (emulador): __________

**Observações**:
_______________________________________________
_______________________________________________
_______________________________________________
