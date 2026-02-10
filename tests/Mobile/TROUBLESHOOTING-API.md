# 🔧 Guia de Troubleshooting

## Erro: "Unable to create @Body converter for class... for method inovaTechapi.login"

Este erro ocorre quando o aplicativo Android tenta fazer uma requisição HTTP para o backend mas não consegue serializar/desserializar os dados.

### 🔍 Diagnóstico

Execute os seguintes passos para identificar a causa:

#### 1. Verificar se o Backend está rodando

```powershell
# Testar se o backend responde
curl http://localhost:8080/actuator/health

# OU
Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing
```

**Resposta esperada**: `{"status":"UP"}`

**Se falhar**: O backend não está rodando.

**Solução**:
```powershell
cd ..\APP
mvn clean install
mvn spring-boot:run
```

---

#### 2. Verificar endpoint de login

```powershell
# Testar endpoint de login diretamente
curl -X POST http://localhost:8080/api/clientes/login `
  -H "Content-Type: application/json" `
  -d '{"Usuario":"teste@teste.com","Senha":"123"}'
```

**Resposta esperada**:
```json
{
  "Sucesso": true,
  "Mensagem": "Login realizado com sucesso",
  "Cliente": { ... },
  "SessionId": "..."
}
```

**Se retornar erro 400/500**: Problema no backend.

---

#### 3. Verificar conectividade do emulador

O aplicativo rodando no emulador **NÃO PODE** usar `localhost` ou `127.0.0.1`.

**Endereços corretos para emulador Android**:
- ✅ `http://10.0.2.2:8080` - mapeamento do localhost do host
- ❌ `http://localhost:8080` - NÃO FUNCIONA no emulador
- ❌ `http://127.0.0.1:8080` - NÃO FUNCIONA no emulador

**Teste a conexão do emulador**:
```powershell
# 1. Conectar ao shell do emulador
adb shell

# 2. Dentro do emulador, testar conexão
curl http://10.0.2.2:8080/actuator/health

# 3. Sair do shell
exit
```

---

#### 4. Verificar se o app está configurado com a URL correta

O aplicativo Android precisa estar configurado para usar `http://10.0.2.2:8080` ao invés de `localhost`.

**Localização da configuração no app**:
- Geralmente em: `app/src/main/java/.../network/ApiClient.kt` (ou `.java`)
- Ou em: `app/src/main/res/values/strings.xml`

**Exemplo de configuração correta (Kotlin)**:
```kotlin
object ApiClient {
    private const val BASE_URL = "http://10.0.2.2:8080/api/"
    
    val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(GsonConverterFactory.create()) // ✅ IMPORTANTE!
        .build()
}
```

---

### ⚠️ Causas Comuns e Soluções

#### Causa 1: Backend não está rodando
**Sintomas**: Timeout ou Connection Refused
**Solução**:
```powershell
cd c:\Users\vinic\dev\InovaTech\APP
mvn spring-boot:run
```

#### Causa 2: URL incorreta no aplicativo
**Sintomas**: Connection refused ou timeout
**Solução**: 
- Recompilar o APK com URL correta: `http://10.0.2.2:8080`
- Ou use o IP da máquina na rede local: `http://192.168.x.x:8080`

#### Causa 3: Firewall bloqueando porta 8080
**Sintomas**: Timeout nas requisições
**Solução**:
```powershell
# Adicionar regra de firewall (executar como Administrador)
netsh advfirewall firewall add rule name="Spring Boot API" dir=in action=allow protocol=TCP localport=8080
```

#### Causa 4: Falta conversor Gson no app Android
**Sintomas**: "Unable to create @Body converter"
**Solução**: Verificar se o `build.gradle` do app contém:
```gradle
dependencies {
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0' // ✅ IMPORTANTE!
}
```

#### Causa 5: Backend sem dependência Jackson
**Sintomas**: Erro 500 no backend ao receber requisição
**Solução**: Verificar `pom.xml` contém:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```
(Jackson já está incluído no starter-web)

---

### 🧪 Teste Completo Passo a Passo

Execute este checklist completo:

```powershell
# 1. Verificar backend
cd c:\Users\vinic\dev\InovaTech\APP
mvn spring-boot:run
# Aguardar mensagem: "Started InovaTechApplication"

# 2. Em outro terminal, testar API
curl http://localhost:8080/actuator/health

# 3. Testar login
curl -X POST http://localhost:8080/api/clientes/login `
  -H "Content-Type: application/json" `
  -d '{"Usuario":"teste@teste.com","Senha":"123"}'

# 4. Verificar emulador
adb devices
# Deve listar: emulator-5554   device

# 5. Testar conexão do emulador ao backend
adb shell "curl http://10.0.2.2:8080/actuator/health"

# 6. Se tudo estiver OK, rodar os testes
cd c:\Users\vinic\dev\InovaTech\tests\Mobile
npm run test:smoke
```

---

### 📱 Para Dispositivo Físico (não emulador)

Se estiver usando dispositivo real conectado via USB:

```powershell
# 1. Descobrir IP da máquina na rede local
ipconfig
# Procurar por "IPv4 Address" na interface de rede ativa
# Exemplo: 192.168.1.100

# 2. Conectar dispositivo e PC na mesma rede Wi-Fi

# 3. O app deve usar o IP da máquina
# Exemplo: http://192.168.1.100:8080/api

# 4. Testar do dispositivo
adb shell "curl http://192.168.1.100:8080/actuator/health"
```

---

### 🔐 Verificar Permissões de Rede no App

O `AndroidManifest.xml` do app deve ter:

```xml
<manifest ...>
    <!-- Permissão de internet -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Para Android 9+ (Permitir tráfego HTTP) -->
    <application
        android:usesCleartextTraffic="true"
        ...>
    </application>
</manifest>
```

---

### 📊 Logs Úteis para Debug

#### Logs do Backend
```powershell
cd c:\Users\vinic\dev\InovaTech\APP
mvn spring-boot:run | Tee-Object -FilePath backend.log
```

#### Logs do Appium
```powershell
appium server --log appium.log --log-level debug
```

#### Logs do Android (Logcat)
```powershell
adb logcat | Select-String "Retrofit|HTTP|API"
```

---

### 🆘 Ainda não Funciona?

Se após seguir todos os passos o erro persistir:

1. **Compartilhe os logs**:
   - Log do backend (`backend.log`)
   - Log do Appium
   - Log do Android via `adb logcat`

2. **Informações adicionais**:
   - Versão do Android no emulador
   - Resultado de `adb devices`
   - Resultado de `curl http://10.0.2.2:8080/actuator/health` dentro do emulador

3. **Última alternativa**: Recompilar o APK
   - Atualize a URL base para `http://10.0.2.2:8080`
   - Verifique as dependências do Retrofit + Gson
   - Recompile e reinstale: `adb install -r APK/app-debug.apk`
