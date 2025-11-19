# 🎓 Exercício 4: Git Flow Completo

## Objetivo
Praticar o fluxo completo do Git Flow, incluindo features, releases e hotfixes.

## Pré-requisitos
- Git instalado e configurado
- Acesso ao repositório do InovaTech no Bitbucket
- Conhecimento dos exercícios 1, 2 e 3

---

## 📋 Parte 1: Setup Inicial (5 min)

### Passo 1: Criar repositório de teste

```powershell
# Criar e entrar no diretório
mkdir git-flow-teste
cd git-flow-teste

# Inicializar repositório
git init
git branch -M main

# Criar arquivo inicial
echo "# Projeto Git Flow Teste" > README.md
git add README.md
git commit -m "chore: commit inicial"

# Criar branch develop
git checkout -b develop
echo "Versão em desenvolvimento" >> README.md
git add README.md
git commit -m "chore: inicializa branch develop"
```

### Passo 2: Conectar com remoto (Bitbucket)

```powershell
# Criar repositório no Bitbucket primeiro, depois:
git remote add origin https://bitbucket.org/seu-usuario/git-flow-teste.git
git push -u origin main
git push -u origin develop
```

---

## 🎨 Parte 2: Desenvolvimento de Features (15 min)

### Feature 1: Sistema de Login

```powershell
# 1. Criar feature a partir de develop
git checkout develop
git pull origin develop
git checkout -b feature/sistema-login

# 2. Desenvolver funcionalidade
mkdir -p src/auth
echo "function login(user, pass) { /* TODO */ }" > src/auth/login.js
git add src/auth/login.js
git commit -m "feat: adiciona função de login"

# 3. Adicionar testes
mkdir -p tests
echo "// Testes de login" > tests/login.test.js
git add tests/login.test.js
git commit -m "test: adiciona testes de login"

# 4. Documentar
echo -e "\n## Features\n- Sistema de login" >> README.md
git add README.md
git commit -m "docs: documenta sistema de login"

# 5. Subir feature
git push -u origin feature/sistema-login
```

**📝 Ação no Bitbucket:**
1. Criar Pull Request: `feature/sistema-login` → `develop`
2. Título: `[Feature] Implementa sistema de login`
3. Adicionar descrição detalhada
4. Solicitar revisão de um colega
5. Após aprovação, fazer merge
6. Deletar branch remota

### Feature 2: Dashboard (Paralela)

```powershell
# 1. Começar de develop atualizado
git checkout develop
git pull origin develop
git checkout -b feature/dashboard

# 2. Desenvolver
mkdir -p src/dashboard
echo "function renderDashboard() { /* TODO */ }" > src/dashboard/index.js
git add src/dashboard/index.js
git commit -m "feat: adiciona dashboard básico"

# 3. Widget de estatísticas
echo "function statsWidget() { /* TODO */ }" > src/dashboard/stats.js
git add src/dashboard/stats.js
git commit -m "feat: adiciona widget de estatísticas"

# 4. Documentar
echo "- Dashboard administrativo" >> README.md
git add README.md
git commit -m "docs: documenta dashboard"

# 5. Subir
git push -u origin feature/dashboard
```

**📝 Ação no Bitbucket:**
- Criar PR similar ao anterior
- Após merge da primeira feature, atualizar esta:

```powershell
git checkout feature/dashboard
git fetch origin
git merge origin/develop
# Resolver conflitos se houver (provável no README.md)
git push origin feature/dashboard
```

---

## 📦 Parte 3: Release (10 min)

### Preparar Release 1.0.0

```powershell
# 1. Criar release a partir de develop
git checkout develop
git pull origin develop
git checkout -b release/1.0.0

# 2. Atualizar versão
echo '{"version": "1.0.0"}' > package.json
git add package.json
git commit -m "chore: bump version to 1.0.0"

# 3. Criar changelog
cat > CHANGELOG.md << 'EOF'
# Changelog

## [1.0.0] - 2024-XX-XX

### Added
- Sistema de autenticação de usuários
- Dashboard administrativo com estatísticas
- Testes automatizados

### Changed
- Estrutura inicial do projeto

### Fixed
- N/A
EOF

git add CHANGELOG.md
git commit -m "docs: adiciona changelog 1.0.0"

# 4. Bug fix de última hora (se encontrado)
echo "// Fix: validação de senha" >> src/auth/login.js
git add src/auth/login.js
git commit -m "fix: adiciona validação de senha mínima"

# 5. Subir release
git push -u origin release/1.0.0
```

### Finalizar Release

**📝 Ações no Bitbucket:**

1. **PR para main:** `release/1.0.0` → `main`
   - Título: `Release 1.0.0`
   - Descrição: Copiar conteúdo do CHANGELOG.md
   - Após aprovação, fazer merge

2. **Criar tag:**
```powershell
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release 1.0.0 - Primeira versão com login e dashboard"
git push origin v1.0.0
```

3. **Merge de volta para develop:**
```powershell
git checkout develop
git pull origin develop
git merge main
git push origin develop
```

4. **Limpar:**
```powershell
git branch -d release/1.0.0
git push origin --delete release/1.0.0
```

---

## 🚨 Parte 4: Hotfix (10 min)

### Simular Bug Crítico em Produção

**Cenário:** Usuários reportam que não conseguem fazer login - a validação de senha está muito restritiva.

```powershell
# 1. Criar hotfix a partir de main
git checkout main
git pull origin main
git checkout -b hotfix/login-validation

# 2. Identificar problema
cat src/auth/login.js
# Encontrado: validação requer 20 caracteres (muito!)

# 3. Corrigir
echo "// Fix: validação de senha (mínimo 8 caracteres)" > src/auth/login.js
git add src/auth/login.js
git commit -m "fix: ajusta validação de senha para mínimo 8 caracteres"

# 4. Adicionar teste de regressão
echo "// Teste: senha com 8 caracteres deve ser aceita" >> tests/login.test.js
git add tests/login.test.js
git commit -m "test: adiciona teste para validação de senha"

# 5. Subir hotfix
git push -u origin hotfix/login-validation
```

### Finalizar Hotfix

**📝 Ações no Bitbucket:**

1. **PR urgente para main:** `hotfix/login-validation` → `main`
   - Marcar como URGENTE/HOTFIX
   - Revisão rápida mas cuidadosa

2. **Criar tag de patch:**
```powershell
git checkout main
git pull origin main
git tag -a v1.0.1 -m "Hotfix 1.0.1 - Corrige validação de login"
git push origin v1.0.1
```

3. **Merge para develop (IMPORTANTE!):**
```powershell
git checkout develop
git pull origin develop
git merge main
git push origin develop
```

4. **Atualizar CHANGELOG:**
```powershell
git checkout develop
cat >> CHANGELOG.md << 'EOF'

## [1.0.1] - 2024-XX-XX

### Fixed
- Validação de senha ajustada para mínimo 8 caracteres (era 20)
EOF

git add CHANGELOG.md
git commit -m "docs: atualiza changelog com hotfix 1.0.1"
git push origin develop
```

5. **Limpar:**
```powershell
git branch -d hotfix/login-validation
git push origin --delete hotfix/login-validation
```

---

## 🎯 Parte 5: Ciclo Completo - Feature Nova (10 min)

### Desenvolver Feature de Relatórios

```powershell
# 1. Começar de develop atualizado (já tem o hotfix!)
git checkout develop
git pull origin develop
git checkout -b feature/relatorios

# 2. Desenvolver
mkdir -p src/reports
echo "function generateReport(type) { /* TODO */ }" > src/reports/generator.js
git add src/reports/generator.js
git commit -m "feat: adiciona gerador de relatórios"

# 3. Integrar com dashboard
echo "import { generateReport } from '../reports/generator';" >> src/dashboard/index.js
git add src/dashboard/index.js
git commit -m "feat: integra relatórios ao dashboard"

# 4. Verificar se está atualizado
git fetch origin
git merge origin/develop
# Deve estar atualizado

# 5. Subir e criar PR
git push -u origin feature/relatorios
```

**📝 Criar PR e mergear após aprovação**

---

## 📊 Verificação Final

### Visualizar Histórico

```powershell
# Ver gráfico de branches
git log --all --decorate --oneline --graph

# Ver tags
git tag -l

# Ver branches
git branch -a

# Ver status das branches
git remote show origin
```

### Estrutura Esperada

```
├── main (v1.0.1)
│   └── hotfix/login-validation (merged, deleted)
├── develop (atualizada com main + feature/relatorios)
│   ├── feature/sistema-login (merged, deleted)
│   ├── feature/dashboard (merged, deleted)
│   └── feature/relatorios (merged, deleted)
└── release/1.0.0 (merged, deleted)
```

---

## ✅ Checklist de Aprendizado

Ao final deste exercício, você deve ser capaz de:

- [ ] Criar e configurar branches main e develop
- [ ] Desenvolver features em branches isoladas
- [ ] Criar e revisar Pull Requests no Bitbucket
- [ ] Preparar releases com changelog e versionamento
- [ ] Criar e aplicar tags de versão
- [ ] Realizar hotfixes em produção
- [ ] Propagar correções para todas as branches necessárias
- [ ] Manter histórico limpo e organizado
- [ ] Trabalhar com múltiplas features em paralelo
- [ ] Resolver conflitos entre branches

---

## 🏆 Desafio Extra (Opcional)

### Cenário Complexo

1. **Criar 3 features simultâneas:**
   - `feature/notificacoes`
   - `feature/perfil-usuario`
   - `feature/exportar-dados`

2. **Mergear 2 features em develop**

3. **Criar release/1.1.0 (com apenas 2 features)**

4. **Durante a release, surge um hotfix urgente:**
   - Criar `hotfix/security-patch`
   - Mergear em main → tag v1.0.2
   - Propagar para develop E release/1.1.0

5. **Finalizar release 1.1.0:**
   - Mergear em main → tag v1.1.0
   - Propagar para develop

6. **Mergear a 3ª feature (que ficou para trás)**

### Questões para Reflexão

1. O que acontece se esquecer de mergear hotfix para develop?
2. Como lidar com conflitos entre features paralelas?
3. Quando usar merge vs rebase?
4. Como reverter um merge acidental?

---

## 📚 Próximos Passos

- Pratique este fluxo em projetos reais do InovaTech
- Experimente com Git Flow extensions/tools
- Estude casos de conflitos complexos
- Aprenda sobre cherry-pick para casos especiais

---

*Exercício criado por: InovaTech Dev Team*  
*Tempo estimado: 50-60 minutos*  
*Dificuldade: Intermediário*
