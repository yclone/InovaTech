#!/bin/bash

# 🚀 Script de Setup - InovaTech Mobile Tests
# Para Linux e macOS

echo "🚀 Configurando projeto InovaTech Mobile Tests..."

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 1. Verificar Node.js
echo -e "\n${YELLOW}📦 Verificando Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js instalado: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js não encontrado! Instale em: https://nodejs.org/${NC}"
    exit 1
fi

# 2. Verificar Java
echo -e "\n${YELLOW}☕ Verificando Java...${NC}"
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo -e "${GREEN}✅ Java instalado: $JAVA_VERSION${NC}"
else
    echo -e "${RED}❌ Java não encontrado! Configure JAVA_HOME${NC}"
    exit 1
fi

# 3. Verificar ANDROID_HOME
echo -e "\n${YELLOW}📱 Verificando Android SDK...${NC}"
if [ -n "$ANDROID_HOME" ]; then
    echo -e "${GREEN}✅ ANDROID_HOME: $ANDROID_HOME${NC}"
else
    echo -e "${YELLOW}⚠️  ANDROID_HOME não configurado!${NC}"
    echo -e "${YELLOW}Configure no ~/.bashrc ou ~/.zshrc:${NC}"
    echo -e "${YELLOW}export ANDROID_HOME=\$HOME/Android/Sdk${NC}"
fi

# 4. Criar arquivo .env se não existir
echo -e "\n${YELLOW}⚙️  Configurando arquivo .env...${NC}"
if [ ! -f ".env" ]; then
    cp ".env.example" ".env"
    echo -e "${GREEN}✅ Arquivo .env criado! Edite com suas configurações.${NC}"
else
    echo -e "${GREEN}✅ Arquivo .env já existe${NC}"
fi

# 5. Instalar dependências
echo -e "\n${YELLOW}📦 Instalando dependências...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependências instaladas com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao instalar dependências${NC}"
    exit 1
fi

# 6. Instalar driver UiAutomator2
echo -e "\n${YELLOW}🔧 Instalando driver UiAutomator2...${NC}"
npm run uiautomator2:install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Driver instalado com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao instalar driver${NC}"
    exit 1
fi

# 7. Criar estrutura de diretórios
echo -e "\n${YELLOW}📁 Criando estrutura de diretórios...${NC}"
DIRECTORIES=("reports" "reports/html-reports" "reports/screenshots" "logs")
for dir in "${DIRECTORIES[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        echo -e "${GREEN}  ✅ Criado: $dir${NC}"
    fi
done

# 8. Verificar dispositivos Android
echo -e "\n${YELLOW}📱 Verificando dispositivos Android...${NC}"
if command -v adb &> /dev/null; then
    DEVICES=$(adb devices | grep -w "device" | wc -l)
    if [ $DEVICES -gt 0 ]; then
        echo -e "${GREEN}✅ Dispositivos conectados:${NC}"
        adb devices
    else
        echo -e "${YELLOW}⚠️  Nenhum dispositivo conectado${NC}"
        echo -e "${YELLOW}   Inicie um emulador ou conecte um dispositivo${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  ADB não encontrado! Verifique ANDROID_HOME/platform-tools${NC}"
fi

# 9. Verificar APK
echo -e "\n${YELLOW}📦 Verificando APK...${NC}"
APK_COUNT=$(find APK -name "*.apk" 2>/dev/null | wc -l)
if [ $APK_COUNT -gt 0 ]; then
    APK_FILE=$(find APK -name "*.apk" -print -quit)
    echo -e "${GREEN}✅ APK encontrado: $(basename $APK_FILE)${NC}"
else
    echo -e "${YELLOW}⚠️  Nenhum APK encontrado na pasta APK/${NC}"
    echo -e "${YELLOW}   Adicione o arquivo APK do aplicativo${NC}"
fi

# 10. Tornar scripts executáveis
chmod +x setup.sh 2>/dev/null

# 11. Resumo
echo -e "\n${CYAN}============================================================${NC}"
echo -e "${GREEN}✅ Setup concluído!${NC}"
echo -e "${CYAN}============================================================${NC}"
echo -e "\n${YELLOW}Próximos passos:${NC}"
echo -e "${NC}1. Edite o arquivo .env com suas configurações${NC}"
echo -e "${NC}2. Coloque o APK na pasta APK/${NC}"
echo -e "${NC}3. Inicie um emulador: emulator -avd <nome_avd>${NC}"
echo -e "${NC}4. Execute os testes: npm test${NC}"
echo -e "\n${YELLOW}Comandos úteis:${NC}"
echo -e "${NC}  npm test              - Executar todos os testes${NC}"
echo -e "${NC}  npm run appium        - Iniciar Appium server${NC}"
echo -e "${NC}  npm run report:generate - Gerar relatório HTML${NC}"
echo -e "\n${YELLOW}Documentação:${NC}"
echo -e "${NC}  README.md            - Documentação completa${NC}"
echo -e "${NC}  QUICKSTART.md        - Guia rápido${NC}"
echo -e "${NC}  GUIA_SELETORES.md    - Guia de seletores${NC}"
echo ""
