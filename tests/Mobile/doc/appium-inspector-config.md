# Appium Inspector - Capabilities

Copie e cole estas configurações no Appium Inspector para conectar ao seu dispositivo/emulador:

## Configuração para Android Emulador

```json
{
  "platformName": "Android",
  "appium:platformVersion": "13.0",
  "appium:deviceName": "emulator-5554",
  "appium:automationName": "UiAutomator2",
  "appium:app": "C:\\Users\\vinic\\dev\\InovaTech\\tests\\Mobile\\APK\\app-release.apk",
  "appium:noReset": false,
  "appium:fullReset": false,
  "appium:autoGrantPermissions": true,
  "appium:newCommandTimeout": 240
}
```

## Configuração para Android Device Real

```json
{
  "platformName": "Android",
  "appium:platformVersion": "13.0",
  "appium:deviceName": "YOUR_DEVICE_ID",
  "appium:automationName": "UiAutomator2",
  "appium:app": "C:\\Users\\vinic\\dev\\InovaTech\\tests\\Mobile\\APK\\app-release.apk",
  "appium:noReset": false,
  "appium:fullReset": false,
  "appium:autoGrantPermissions": true,
  "appium:udid": "YOUR_DEVICE_UDID"
}
```

## Como usar:

1. Obtenha o device ID: `adb devices`
2. Atualize `deviceName` com o ID do seu dispositivo
3. Cole no Appium Inspector
4. Clique em "Start Session"

## Remote Path

Se estiver usando Appium Server em execução separada:
- Host: `127.0.0.1`
- Port: `4723`
- Path: `/`
