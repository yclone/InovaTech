# 📖 Índice de Documentação - Testes Mobile InovaTech

## 🚀 Para Começar

Se você é novo no projeto ou está configurando uma nova máquina, comece por aqui:

1. **[CHECKLIST-NOVA-MAQUINA.md](./CHECKLIST-NOVA-MAQUINA.md)** ⭐
   - Checklist passo a passo para nova configuração
   - Ideal para imprimir e seguir durante a instalação

2. **[PRE-REQUISITOS.md](./PRE-REQUISITOS.md)**
   - Guia completo de pré-requisitos
   - Detalhamento de software necessário
   - Instruções de instalação e configuração

3. **[QUICKSTART.md](./QUICKSTART.md)**
   - Início rápido após configuração básica
   - Primeiros passos para executar testes

---

## 🔧 Configuração e Setup

### Scripts Automatizados

#### `setup-inicial.ps1`
Execute para configuração automática inicial:
```powershell
.\setup-inicial.ps1
# OU
npm run setup
```
**Faz**: Instala dependências, cria .env, verifica APK e ferramentas

#### `verificar-pre-requisitos.ps1`
Execute para verificar se tudo está configurado:
```powershell
.\verificar-pre-requisitos.ps1
# OU
npm run verify
```
**Faz**: Verifica Node, Java, Maven, Android SDK, ADB, Appium, dispositivos, backend

### Arquivos de Configuração

#### `.env`
Arquivo de configuração local (não versionado)
```env
ANDROID_DEVICE_NAME=emulator-5554
ANDROID_PLATFORM_VERSION=16.0
API_BASE_URL=http://10.0.2.2:8080/api
```

#### `.env.example`
Template para criar seu `.env`
- Copie e customize: `copy .env.example .env`
- Contém todas as variáveis com valores padrão

#### `package.json`
Scripts npm disponíveis:
- `npm run setup` - Configuração inicial
- `npm run verify` - Verificar pré-requisitos
- `npm run test:smoke` - Testes básicos
- `npm run test:login` - Testes de login
- Veja arquivo completo para mais scripts

---

## 🐛 Troubleshooting

### Guias de Solução de Problemas

#### **[TROUBLESHOOTING-API.md](./TROUBLESHOOTING-API.md)** ⭐
Dedicado ao erro: **"Unable to create @Body converter"**

**Resolva problemas de**:
- Backend não respondendo
- App não conectando à API
- Erro de serialização JSON
- Conectividade emulador → backend
- Configuração de rede e firewall

#### **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**
Guia geral de problemas comuns

**Resolva problemas de**:
- Appium não iniciando
- Dispositivo não conectando
- Elementos não encontrados
- Timeouts
- Instalação de dependências

---

## 📚 Guias Técnicos

### **[ARQUITETURA.md](./ARQUITETURA.md)**
Arquitetura do projeto de testes
- Estrutura de pastas
- Page Object Model
- Helpers e utilitários
- Fluxo de execução

### **[GUIA_SELETORES.md](./GUIA_SELETORES.md)**
Guia de seletores para elementos mobile
- Estratégias de localização
- Boas práticas
- Exemplos práticos

### **[COMO_AJUSTAR_SELETORES.md](./COMO_AJUSTAR_SELETORES.md)**
Como ajustar seletores quando elementos mudam
- Uso do Appium Inspector
- Debug de elementos
- Atualizações de seletores

### **[EXECUTAR_TESTES_LOGIN.md](./EXECUTAR_TESTES_LOGIN.md)**
Específico para testes de login
- Como executar
- Casos de teste
- Validações

---

## 📱 Appium Inspector

### **[appium-inspector-config.md](./appium-inspector-config.md)**
Configuração do Appium Inspector
- Instalação
- Configuração de capabilities
- Como inspecionar elementos

---

## 📂 Estrutura de Arquivos

```
tests/Mobile/
├── 📖 Documentação
│   ├── INDEX.md (você está aqui)
│   ├── README.md (visão geral)
│   ├── CHECKLIST-NOVA-MAQUINA.md ⭐
│   ├── PRE-REQUISITOS.md
│   ├── TROUBLESHOOTING-API.md ⭐
│   ├── TROUBLESHOOTING.md
│   ├── QUICKSTART.md
│   ├── ARQUITETURA.md
│   ├── GUIA_SELETORES.md
│   ├── COMO_AJUSTAR_SELETORES.md
│   ├── EXECUTAR_TESTES_LOGIN.md
│   └── appium-inspector-config.md
│
├── 🔧 Scripts de Setup
│   ├── setup-inicial.ps1 (configuração automática)
│   ├── verificar-pre-requisitos.ps1 (verificação)
│   └── run-individual-tests.ps1 (executar testes)
│
├── ⚙️ Configuração
│   ├── .env.example (template)
│   ├── .env (seu arquivo local)
│   ├── .gitignore (arquivos ignorados)
│   ├── package.json (dependências e scripts)
│   └── .eslintrc.json (regras de linting)
│
├── 📱 App e Configurações
│   ├── APK/ (arquivos .apk)
│   ├── app/ (configurações do app)
│   │   ├── android/
│   │   │   └── wdio.conf.android.js
│   │   ├── helpers/ (funções auxiliares)
│   │   ├── pageObjects/ (Page Objects)
│   │   └── data/ (dados de teste)
│   │
│   └── specs/ (arquivos de teste)
│       ├── login-smoke.spec.js
│       └── login*.spec.js
│
└── 📊 Reports
    ├── reports/ (relatórios gerados)
    ├── logs/ (logs de execução)
    └── reportManager/ (geração de reports)
```

---

## 🎯 Casos de Uso

### "Estou configurando pela primeira vez"
1. 📋 [CHECKLIST-NOVA-MAQUINA.md](./CHECKLIST-NOVA-MAQUINA.md)
2. 📖 [PRE-REQUISITOS.md](./PRE-REQUISITOS.md)
3. 🚀 Execute `.\setup-inicial.ps1`
4. ✅ Execute `.\verificar-pre-requisitos.ps1`
5. ⚡ [QUICKSTART.md](./QUICKSTART.md)

### "Erro: Unable to create @Body converter"
➡️ [TROUBLESHOOTING-API.md](./TROUBLESHOOTING-API.md)

### "Testes não encontram elementos"
➡️ [GUIA_SELETORES.md](./GUIA_SELETORES.md)
➡️ [COMO_AJUSTAR_SELETORES.md](./COMO_AJUSTAR_SELETORES.md)

### "Quero entender o projeto"
➡️ [README.md](./README.md)
➡️ [ARQUITETURA.md](./ARQUITETURA.md)

### "Preciso configurar em outra máquina"
➡️ [CHECKLIST-NOVA-MAQUINA.md](./CHECKLIST-NOVA-MAQUINA.md)
➡️ Copie: código, APK, .env.example

### "Problemas gerais"
➡️ [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 📞 Suporte

### Ordem de Consulta

1. **Consulte este índice** para encontrar o documento relevante
2. **Leia o documento específico** do seu problema
3. **Execute scripts de verificação**: `.\verificar-pre-requisitos.ps1`
4. **Consulte logs**: backend.log, appium.log, android.log
5. **Contate a equipe** com os logs e detalhes do problema

---

## 🔄 Atualização de Documentação

Para adicionar novo documento:
1. Crie o arquivo `.md` na raiz do projeto Mobile
2. Adicione entrada neste INDEX.md
3. Atualize README.md se relevante
4. Commit: `docs: adiciona guia de <tópico>`

---

**Última atualização**: Fevereiro 2026
**Versão**: 1.0
**Mantido por**: InovaTech Team
