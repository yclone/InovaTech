# 📦 Pasta APK

## Instruções

Coloque o arquivo APK do seu aplicativo Android nesta pasta.

### Formato esperado:
- `app-release.apk` (nome padrão)
- Ou qualquer arquivo `.apk`

### Como obter o APK:

#### 1. Build do Android Studio
```bash
# No diretório do projeto Android
./gradlew assembleRelease

# APK gerado em:
# app/build/outputs/apk/release/app-release.apk
```

#### 2. De um dispositivo Android
```bash
# Listar apps instalados
adb shell pm list packages

# Obter caminho do APK instalado
adb shell pm path com.seu.app.package

# Baixar APK do dispositivo
adb pull /data/app/~~hash~~/com.seu.app/base.apk ./app-release.apk
```

#### 3. Download direto
- Baixe o APK do Google Play Store (usando ferramentas como APK Extractor)
- Ou obtenha do repositório de build/CI

### Verificar APK:

```bash
# Ver informações do APK
aapt dump badging app-release.apk

# Obter package name
aapt dump badging app-release.apk | findstr package

# Obter atividade principal
aapt dump badging app-release.apk | findstr launchable-activity
```

### Configuração:

Após adicionar o APK, atualize o arquivo `.env`:

```env
APP_PACKAGE=com.seu.app.package
APP_ACTIVITY=.MainActivity
```

### ⚠️ Importante:

- APKs **não** devem ser commitados no Git (já incluído no .gitignore)
- Use APKs de desenvolvimento/debug para testes
- Para CI/CD, considere usar artifact storage
