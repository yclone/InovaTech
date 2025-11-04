#!/bin/bash

# Script de setup para InovaTech Frontend
# Execute com: ./setup.sh ou bash setup.sh

echo "🚀 InovaTech Frontend - Setup Automatizado"
echo "=========================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verifica Node.js
echo -e "\n${BLUE}1. Verificando Node.js...${NC}"
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js encontrado: $NODE_VERSION${NC}"
    
    # Verifica versão mínima
    NODE_MAJOR=$(echo $NODE_VERSION | sed 's/v//' | cut -d. -f1)
    if [ "$NODE_MAJOR" -lt 16 ]; then
        echo -e "${RED}✗ Node.js versão 16+ é necessário${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ Node.js não encontrado${NC}"
    echo -e "${YELLOW}Instale Node.js 16+ em: https://nodejs.org/${NC}"
    exit 1
fi

# Verifica npm
echo -e "\n${BLUE}2. Verificando npm...${NC}"
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm encontrado: v$NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm não encontrado${NC}"
    exit 1
fi

# Instala dependências
echo -e "\n${BLUE}3. Instalando dependências...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependências instaladas com sucesso${NC}"
else
    echo -e "${RED}✗ Erro ao instalar dependências${NC}"
    exit 1
fi

# Cria arquivo .env.local se não existir
echo -e "\n${BLUE}4. Configurando ambiente...${NC}"
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo -e "${GREEN}✓ Arquivo .env.local criado${NC}"
    echo -e "${YELLOW}→ Edite .env.local se necessário${NC}"
else
    echo -e "${YELLOW}→ .env.local já existe${NC}"
fi

# Verifica se backend está rodando (opcional)
echo -e "\n${BLUE}5. Verificando backend...${NC}"
if command_exists curl; then
    if curl -s http://localhost:5000/api/hello >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend encontrado em http://localhost:5000${NC}"
    else
        echo -e "${YELLOW}⚠ Backend não encontrado em http://localhost:5000${NC}"
        echo -e "${YELLOW}→ Certifique-se de iniciar o backend antes de usar o frontend${NC}"
    fi
else
    echo -e "${YELLOW}→ curl não disponível, pulando verificação do backend${NC}"
fi

echo -e "\n${GREEN}🎉 Setup concluído com sucesso!${NC}"
echo -e "\n${BLUE}Próximos passos:${NC}"
echo -e "1. ${YELLOW}npm run dev${NC} - Inicia o servidor de desenvolvimento"
echo -e "2. Acesse ${YELLOW}http://localhost:5173${NC} no navegador"
echo -e "3. Certifique-se que o backend está rodando em ${YELLOW}http://localhost:5000${NC}"
echo -e "\n${BLUE}Comandos úteis:${NC}"
echo -e "• ${YELLOW}npm run build${NC} - Build de produção"
echo -e "• ${YELLOW}npm run preview${NC} - Visualiza build de produção"
echo -e "• ${YELLOW}npm run clean${NC} - Limpa cache"