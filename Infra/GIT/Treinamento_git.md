# 🚀 TREINAMENTO GIT & BITBUCKET - GUIA PRÁTICO

## 📚 Índice
1. [Agenda (60 min)](#agenda-60-minutos)
2. [Setup: Configurando seu Git](#setup-configurando-seu-git)
3. [Fundamentos Essenciais](#fundamentos-essenciais)
4. [Fluxo 1: Clonar e o Primeiro Commit](#fluxo-1-clonar-e-o-primeiro-commit)
5. [Fluxo 2: Trabalho em Equipe (Branches e Pull Requests)](#fluxo-2-trabalho-em-equipe-branches-e-pull-requests)
6. [Fluxo 3: Mantendo-se Atualizado (pull) e Conflitos](#fluxo-3-mantendo-se-atualizado-pull-e-conflitos)
7. [Git Flow: Features, Releases e Hotfixes](#git-flow-features-releases-e-hotfixes)
8. [Exercícios Práticos](#exercicios-praticos)
9. [Exemplos de Conflitos](#exemplos-de-conflitos)
10. [Cheat Sheet Rápido](#cheat-sheet-rapido)
11. [Discussão: Nosso Padrão no Dia a Dia](#discussao-nosso-padrao-no-dia-a-dia)

---

## ⏱️ Agenda (60 minutos)

- **05 min** — Objetivo do treino + visão geral do Git/Bitbucket
- **10 min** — Setup, configuração, .gitignore e boas práticas de commit
- **10 min** — Fluxo básico: clone, add, commit, push (demo guiada)
- **10 min** — Branches, PRs no Bitbucket, políticas e revisões
- **10 min** — Atualização com pull, merge vs rebase, resolução de conflitos
- **10 min** — Git Flow (features, release, hotfix) + tagging e releases
- **05 min** — Q&A e próximos passos

> 💡 **Notas para instrutor:** Mantenha o terminal em foco, use exemplos pequenos, e provoque um conflito simples para resolver ao vivo.

---

## 🛠️ Setup: Configurando seu Git

### Instalação

1. Faça o download: [Download Git](https://git-scm.com/downloads)
2. Configure seu Git:

```powershell
# Configurar nome e email
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Verificar configuração
git config --list
```

### Conectando ao Bitbucket

- Crie uma conta no [Bitbucket](https://bitbucket.org/)
- Gere um token de acesso ou configure SSH (opcional)

---

## 🧠 Fundamentos Essenciais

### Conceitos Básicos

#### 📁 Working Directory, Staging Area e Repository

```
Working Directory  →  Staging Area  →  Local Repository  →  Remote Repository
    (modificado)        (git add)         (git commit)         (git push)
```

- **Working Directory:** Seus arquivos atuais no disco
  - `git status` mostra arquivos modificados
  - `git diff` mostra as alterações exatas

- **Staging Area (Index):** Área de preparação para commit
  - `git add <arquivo>` adiciona arquivo específico
  - `git add .` adiciona todos os arquivos modificados
  - `git reset <arquivo>` remove do staging (mantém modificações)
  - `git restore --staged <arquivo>` (alternativa moderna ao reset)

- **Local Repository:** Histórico de commits local
  - `git commit -m "mensagem"` grava snapshot
  - `git log` visualiza histórico
  - Funciona offline

- **Remote Repository:** Repositório compartilhado (Bitbucket, GitHub)
  - `git push` envia commits locais
  - `git pull` baixa e integra commits remotos
  - Requer conexão com internet

---

#### 🎯 HEAD e Branches

- **HEAD:** Ponteiro para o commit atual onde você está trabalhando
  ```powershell
  git log --oneline  # HEAD -> branch-atual
  HEAD~1             # Commit anterior ao HEAD
  HEAD~2             # 2 commits atrás
  HEAD^              # Primeiro pai do HEAD (em merges)
  ```

- **Branch:** Ponteiro móvel para um commit
  ```powershell
  git branch                    # Lista branches locais
  git branch -a                 # Lista todas (incluindo remotas)
  git branch nome-branch        # Cria nova branch
  git branch -d nome-branch     # Deleta branch (safe)
  git branch -D nome-branch     # Força deleção
  ```

---

#### 🌐 Remotos (Remotes)

- **origin:** Nome padrão do repositório remoto principal
  ```powershell
  git remote -v                 # Lista remotos configurados
  git remote add origin <url>   # Adiciona remoto
  git remote remove origin      # Remove remoto
  git remote rename origin novo # Renomeia remoto
  ```

- **upstream:** Convenção para o repositório original (em forks)
  ```powershell
  git remote add upstream <url-repo-original>
  git fetch upstream
  git merge upstream/main
  ```

- **Tracking branches:** Conexão entre branch local e remota
  ```powershell
  git push -u origin minha-branch    # -u define tracking
  git branch -vv                     # Mostra tracking configurado
  ```

---

#### 🔄 Fetch vs Pull vs Push

**`git fetch`** - Baixa dados sem integrar
```powershell
git fetch origin              # Baixa todas as branches
git fetch origin main         # Baixa apenas main
git fetch --all               # Baixa de todos os remotos
```
- ✅ Seguro: não modifica seu código
- ✅ Permite revisar antes de integrar
- ✅ Atualiza referências remotas (origin/main, origin/develop)

**`git pull`** - Baixa e integra automaticamente (fetch + merge)
```powershell
git pull origin main          # fetch + merge
git pull --rebase origin main # fetch + rebase
git pull --ff-only            # Só aceita fast-forward
```
- ⚠️ Pode criar merge commits
- ⚠️ Pode causar conflitos
- 💡 Use `--rebase` para histórico linear

**`git push`** - Envia commits locais para remoto
```powershell
git push origin branch-name           # Push normal
git push -u origin branch-name        # Define tracking
git push --force                      # Força push (PERIGOSO!)
git push --force-with-lease           # Força mais seguro
git push --tags                       # Envia tags
```

---

#### 🔀 Merge vs Rebase vs Cherry-pick

**`git merge`** - Junta históricos criando commit de merge
```powershell
git checkout main
git merge feature-branch

# Resultado:
#     A---B---C feature-branch
#    /         \
# ---D---E---F---G main (commit G é o merge)
```
- ✅ Preserva histórico completo
- ✅ Não reescreve commits
- ✅ Seguro para branches públicas
- ❌ Pode deixar histórico confuso com muitos merges

**Tipos de merge:**
```powershell
git merge --ff feature           # Fast-forward (padrão quando possível)
git merge --no-ff feature        # Sempre cria commit de merge
git merge --squash feature       # Junta todos commits em 1
```

**`git rebase`** - Reaplica commits em nova base (histórico linear)
```powershell
git checkout feature-branch
git rebase main

# Antes:                    Depois:
#     A---B---C feature          A'--B'--C' feature
#    /                          /
# ---D---E---F main          ---D---E---F main
```
- ✅ Histórico linear e limpo
- ✅ Facilita leitura do log
- ❌ Reescreve histórico (altera hashes dos commits)
- ⚠️ NUNCA use em branches públicas/compartilhadas

**Interactive rebase:** Editar histórico
```powershell
git rebase -i HEAD~3    # Edita últimos 3 commits

# Opções:
# pick   - manter commit
# reword - alterar mensagem
# edit   - pausar para editar
# squash - juntar com anterior
# fixup  - juntar sem mensagem
# drop   - remover commit
```

**`git cherry-pick`** - Copia commit específico para branch atual
```powershell
git cherry-pick <commit-hash>      # Aplica 1 commit
git cherry-pick abc123 def456      # Aplica múltiplos
git cherry-pick abc123..def456     # Aplica range
```
- 💡 Útil para aplicar hotfix em múltiplas branches
- ⚠️ Cria novos commits (hashes diferentes)

---

#### ↩️ Reset vs Revert vs Restore

**`git reset`** - Move HEAD e branch (altera histórico)
```powershell
git reset --soft HEAD~1     # Desfaz commit, mantém staging
git reset --mixed HEAD~1    # Desfaz commit e staging (padrão)
git reset --hard HEAD~1     # Desfaz tudo (CUIDADO: perde alterações!)

# Casos de uso:
git reset --soft HEAD~1     # Refazer último commit
git reset HEAD arquivo.txt  # Remove do staging
git reset --hard origin/main # Descarta tudo e fica igual ao remoto
```

**Modos do reset:**
- `--soft`: Move HEAD, mantém staging e working directory
- `--mixed`: Move HEAD, limpa staging, mantém working directory
- `--hard`: Move HEAD, limpa staging E working directory

**`git revert`** - Cria novo commit que desfaz outro (preserva histórico)
```powershell
git revert <commit-hash>       # Desfaz 1 commit
git revert HEAD~3..HEAD        # Desfaz range de commits
git revert -m 1 <merge-hash>   # Desfaz merge commit
```
- ✅ Seguro para branches públicas
- ✅ Preserva histórico
- ✅ Auditável (fica registrado)

**`git restore`** - Restaura arquivos (comando moderno)
```powershell
git restore arquivo.txt              # Descarta alterações locais
git restore --staged arquivo.txt     # Remove do staging
git restore --source=HEAD~1 arquivo  # Restaura de commit específico
```

**Quando usar cada um:**
- `reset`: Desfazer commits locais (não enviados ainda)
- `revert`: Desfazer commits públicos (já enviados)
- `restore`: Descartar alterações em arquivos

---

#### 💾 Stash - Guardar Trabalho Temporariamente

```powershell
git stash                      # Guarda alterações
git stash save "mensagem"      # Guarda com descrição
git stash -u                   # Inclui arquivos untracked
git stash list                 # Lista stashes
git stash show                 # Mostra conteúdo
git stash pop                  # Recupera e remove
git stash apply                # Recupera mas mantém
git stash drop                 # Remove stash
git stash clear                # Remove todos
git stash branch nova-branch   # Cria branch do stash
```

**Caso de uso:**
```powershell
# Trabalhando em feature, precisa trocar para hotfix urgente
git stash save "WIP: implementando login"
git checkout main
git checkout -b hotfix/bug-critico
# ... corrige bug ...
git checkout feature/login
git stash pop  # Volta ao trabalho
```

---

#### 🏷️ Tags - Marcando Versões

```powershell
# Tags leves (apenas ponteiro)
git tag v1.0.0

# Tags anotadas (recomendado - têm metadata)
git tag -a v1.0.0 -m "Release 1.0.0"

# Listar tags
git tag
git tag -l "v1.*"

# Ver informações da tag
git show v1.0.0

# Enviar tags
git push origin v1.0.0        # Tag específica
git push origin --tags        # Todas as tags

# Deletar tags
git tag -d v1.0.0            # Local
git push origin --delete v1.0.0  # Remoto

# Checkout de tag
git checkout v1.0.0          # Detached HEAD
git checkout -b branch-v1.0.0 v1.0.0  # Criar branch da tag
```

---

#### 🔍 Diff - Visualizar Diferenças

```powershell
git diff                      # Working vs Staging
git diff --staged             # Staging vs Repository
git diff HEAD                 # Working vs último commit
git diff branch1..branch2     # Entre branches
git diff commit1 commit2      # Entre commits
git diff --stat               # Resumo estatístico
git diff arquivo.txt          # Diff de arquivo específico
```

---

#### 📝 Log - Histórico de Commits

```powershell
git log                                    # Log completo
git log --oneline                          # Compacto (1 linha)
git log --graph                            # Mostra branches
git log --all --decorate --oneline --graph # Completo visual (atalho: dog)
git log -n 5                               # Últimos 5 commits
git log --author="Nome"                    # Por autor
git log --since="2024-01-01"               # Por data
git log --grep="fix"                       # Por mensagem
git log -- arquivo.txt                     # Histórico de arquivo
git log -p                                 # Mostra diff de cada commit
```

**Criar alias útil:**
```powershell
git config --global alias.lg "log --oneline --graph --all --decorate"
git lg  # Usar o alias
```

---

#### 🔧 Clean - Remover Arquivos Não Rastreados

```powershell
git clean -n              # Dry-run (mostra o que seria removido)
git clean -f              # Remove arquivos
git clean -fd             # Remove arquivos e diretórios
git clean -fX             # Remove apenas ignored files
git clean -fx             # Remove tudo (ignored + untracked)
```

---

#### 🔎 Blame - Quem Modificou Cada Linha

```powershell
git blame arquivo.txt           # Mostra autor de cada linha
git blame -L 10,20 arquivo.txt  # Linhas específicas
git blame -e arquivo.txt        # Mostra email
```

---

### 📊 Resumo Visual dos Comandos

```
┌─────────────────┐  add   ┌─────────────┐  commit  ┌──────────────┐  push  ┌────────────┐
│ Working         │───────→│  Staging    │─────────→│    Local     │───────→│   Remote   │
│ Directory       │        │   Area      │          │  Repository  │        │ Repository │
└─────────────────┘        └─────────────┘          └──────────────┘        └────────────┘
       ↑                          ↑                         ↑                       │
       │ restore                  │ reset                   │ reset --hard          │
       │                          │                         │                       │
       └──────────────────────────┴─────────────────────────┴───────────────────────┘
                                                                          fetch/pull
```

---

## 🔄 Fluxo 1: Clonar e o Primeiro Commit

### 1. Clonar repositório

```powershell
git clone https://bitbucket.org/seu-usuario/seu-repo.git
cd seu-repo
```

### 2. Adicionar arquivo e fazer commit

```powershell
echo "Hello Git" > hello.txt
git add hello.txt
git commit -m "Primeiro commit"
git push
```

---

## 🤝 Fluxo 2: Trabalho em Equipe (Branches e Pull Requests)

### 1. Criar branch

```powershell
git checkout -b feature/nova-funcionalidade
```

### 2. Trabalhar e subir branch

```powershell
# Fazer alterações nos arquivos
git add .
git commit -m "Implementa nova funcionalidade"
git push --set-upstream origin feature/nova-funcionalidade
```

### 3. Abrir Pull Request no Bitbucket

- Acesse o repositório no Bitbucket
- Clique em **"Create pull request"**
- Escolha a branch de origem e destino
- Descreva a mudança
- Adicione revisores

---

## 🔄 Fluxo 3: Mantendo-se Atualizado (pull) e Conflitos

### 1. Atualizar sua branch

```powershell
git pull origin main
```

### 2. Resolver conflitos

Quando houver conflitos:

```powershell
# O Git irá pausar e mostrar os arquivos em conflito
# Edite os arquivos conflitantes manualmente
# Após resolver:
git add arquivo-conflito.txt
git commit -m "Resolve conflito"
git push
```

---

## 🗺️ Git Flow: Features, Releases e Hotfixes

Estratégia clássica com ramos dedicados para diferentes fases do desenvolvimento.

### Branches Principais

- **`main`:** Código em produção (sempre estável)
- **`develop`:** Integração contínua das features (próxima versão em desenvolvimento)

### Branches de Suporte

- **`feature/*`:** Desenvolvimento de funcionalidades
- **`release/*`:** Preparação de versão
- **`hotfix/*`:** Correções críticas em produção

### 📋 Convenção de Nomenclatura

#### Exemplos de Nomenclatura

**Features (Novas Funcionalidades):**

```
feature/IVT-123-login-authentication
```
- **Prefixo:** `feature/` - Indica desenvolvimento de nova funcionalidade
- **Ticket:** `IVT-123` - Referência ao ticket/issue no sistema de gestão (Jira, Bitbucket Issues, etc.)
- **Descrição:** `login-authentication` - Descreve brevemente a funcionalidade
- **Quando usar:** Sempre que desenvolver uma nova feature rastreada por ticket

```
feature/adiciona-carrinho-compras
```
- **Prefixo:** `feature/` - Indica nova funcionalidade
- **Sem ticket:** Usado quando não há ticket formal associado (ex: melhorias menores, refatorações)
- **Descrição:** `adiciona-carrinho-compras` - Nome auto-explicativo da feature
- **Quando usar:** Para features pequenas ou em projetos sem sistema de tickets

**Releases (Preparação de Versão):**

```
release/1.2.0
```
- **Prefixo:** `release/` - Indica preparação de versão para produção
- **Versionamento:** `1.2.0` - Segue [Semantic Versioning](https://semver.org/)
  - **1** = MAJOR (mudanças incompatíveis)
  - **2** = MINOR (novas funcionalidades compatíveis)
  - **0** = PATCH (correções de bugs)
- **Quando usar:** Sempre que preparar código de develop para ir para produção

```
release/2024-q1
```
- **Prefixo:** `release/` - Preparação de versão
- **Calendário:** `2024-q1` - Baseado em período de tempo (Q1 = primeiro trimestre)
- **Quando usar:** Em projetos com releases programadas por calendário (ex: releases trimestrais, mensais)
- **Alternativas:** `release/2024-11`, `release/novembro-2024`, `release/sprint-45`

**Hotfixes (Correções Urgentes):**

```
hotfix/corrige-vazamento-memoria
```
- **Prefixo:** `hotfix/` - Indica correção crítica e urgente em produção
- **Sem ticket:** Correção identificada internamente
- **Descrição:** `corrige-vazamento-memoria` - Descreve o problema sendo corrigido
- **Quando usar:** Bugs críticos encontrados em produção que não podem esperar próxima release

```
hotfix/IVT-456-fix-payment-error
```
- **Prefixo:** `hotfix/` - Correção urgente
- **Ticket:** `IVT-456` - Referência ao bug report no sistema
- **Descrição:** `fix-payment-error` - Descreve a correção
- **Quando usar:** Bugs críticos rastreados formalmente, geralmente reportados por clientes/usuários

---

#### 📐 Boas Práticas de Nomenclatura

**Estrutura Geral:**
```
<tipo>/<ticket-opcional>-<descrição-kebab-case>
```

**Regras:**
- ✅ Use **kebab-case** (minúsculas com hífens): `adiciona-nova-feature`
- ✅ Seja **descritivo mas conciso**: máximo 50 caracteres
- ✅ Use **verbos no infinitivo** para features: `adiciona`, `implementa`, `cria`
- ✅ Use **verbos no presente** para hotfix: `corrige`, `resolve`, `ajusta`
- ✅ Inclua **número do ticket** quando disponível: `IVT-123-`
- ❌ Evite **nomes genéricos**: `feature/nova-feature`, `hotfix/bug-fix`
- ❌ Evite **caracteres especiais**: `@`, `#`, `$`, espaços
- ❌ Evite **nomes muito longos**: `feature/implementa-sistema-completo-de-autenticacao-com-oauth-e-jwt`

**Exemplos Bons vs Ruins:**

| ❌ Ruim | ✅ Bom | 💡 Motivo |
|---------|--------|-----------|
| `feature/login` | `feature/IVT-100-login-authentication` | Mais específico e rastreável |
| `hotfix/bug` | `hotfix/corrige-timeout-api` | Descreve o problema |
| `release/nova` | `release/1.5.0` | Versionamento claro |
| `feature/Adiciona_Carrinho` | `feature/adiciona-carrinho` | Kebab-case correto |
| `fix/payment` | `hotfix/IVT-200-fix-payment-gateway` | Prefixo e contexto corretos |
| `feature/feature-123` | `feature/IVT-123-notificacoes-email` | Descrição significativa |

**Prefixos Alternativos (Opcional):**
```
bugfix/    - Correções não urgentes (vão para develop, não main)
chore/     - Tarefas de manutenção, configuração
docs/      - Apenas documentação
refactor/  - Refatoração de código
test/      - Adição/correção de testes
perf/      - Melhorias de performance
```

**Exemplo Completo de Nomenclatura em Projeto:**
```
main
├── develop
│   ├── feature/IVT-100-oauth-integration
│   ├── feature/IVT-101-user-profile
│   ├── feature/adiciona-dark-mode
│   ├── bugfix/IVT-105-corrige-validacao-email
│   ├── refactor/otimiza-queries-database
│   └── docs/atualiza-readme-setup
├── release/2.0.0
├── hotfix/IVT-500-critical-sql-injection
└── hotfix/corrige-login-timeout
```

---

### 🚀 Setup Inicial do Git Flow

```powershell
# 1. Criar develop a partir da main
git checkout -b develop main
git push -u origin develop

# 2. Configurar proteção de branches no Bitbucket
# - main: requer PR + 2 aprovações + build passando
# - develop: requer PR + 1 aprovação
```

---

### 🎨 Fluxo de Feature (Desenvolvimento de Funcionalidade)

#### Cenário: Adicionar autenticação de usuário

```powershell
# 1. Sempre começar com develop atualizado
git checkout develop
git pull origin develop

# 2. Criar feature a partir da develop
git checkout -b feature/IVT-100-user-authentication

# 3. Desenvolver a funcionalidade (commits frequentes)
# ... fazer alterações nos arquivos ...
git add src/auth/login.js
git commit -m "feat: adiciona tela de login"

# ... mais desenvolvimento ...
git add src/auth/validation.js
git commit -m "feat: adiciona validação de credenciais"

# ... testes ...
git add tests/auth.test.js
git commit -m "test: adiciona testes de autenticação"

# 4. Manter feature atualizada com develop (recomendado)
git fetch origin
git rebase origin/develop
# ou: git merge origin/develop

# 5. Subir feature para revisão
git push -u origin feature/IVT-100-user-authentication
```

#### Abrir Pull Request no Bitbucket

1. Acesse o repositório no Bitbucket
2. Clique em **"Create pull request"**
3. **Source:** `feature/IVT-100-user-authentication` → **Destination:** `develop`
4. Preencha:
   - **Título:** `[IVT-100] Implementa autenticação de usuário`
   - **Descrição:** 
     ```markdown
     ## Resumo
     Implementa sistema de autenticação com login/senha
     
     ## Alterações
     - Tela de login responsiva
     - Validação de credenciais
     - Integração com API de autenticação
     - Testes unitários e de integração
     
     ## Checklist
     - [x] Código testado localmente
     - [x] Testes automatizados incluídos
     - [x] Documentação atualizada
     - [x] Sem conflitos com develop
     ```
5. Adicione revisores e aguarde aprovação

#### Finalizar Feature após aprovação

```powershell
# Após merge do PR, limpar branch local
git checkout develop
git pull origin develop
git branch -d feature/IVT-100-user-authentication

# Remover branch remota (opcional, pode ser feito no Bitbucket)
git push origin --delete feature/IVT-100-user-authentication
```

---

### 📦 Fluxo de Release (Preparação para Produção)

#### Cenário: Preparar versão 1.2.0 para produção

```powershell
# 1. Criar branch de release a partir da develop
git checkout develop
git pull origin develop
git checkout -b release/1.2.0

# 2. Atualizar versão nos arquivos de configuração
# Editar package.json, pom.xml, etc.
echo '{ "version": "1.2.0" }' > version.json
git add version.json
git commit -m "chore: atualiza versão para 1.2.0"

# 3. Ajustes finais e correções de bugs menores
# (NÃO adicionar novas features!)
git add README.md
git commit -m "docs: atualiza changelog para 1.2.0"

git add src/config/app.properties
git commit -m "fix: corrige configuração de timeout"

# 4. Subir branch de release
git push -u origin release/1.2.0
```

#### Processo de Release

```powershell
# 5. Criar PR: release/1.2.0 → main
# Título: "Release 1.2.0"
# Descrição: Lista de features e fixes incluídos

# 6. Após aprovação e merge em main, criar tag
git checkout main
git pull origin main
git tag -a v1.2.0 -m "Release 1.2.0 - Autenticação e carrinho de compras"
git push origin v1.2.0

# 7. Fazer merge de volta para develop
git checkout develop
git pull origin develop
git merge main
git push origin develop

# 8. Limpar branch de release
git branch -d release/1.2.0
git push origin --delete release/1.2.0
```

#### Documentar Release no Bitbucket

1. Vá para **Releases** no Bitbucket
2. Crie release da tag `v1.2.0`
3. Adicione notas de release:
   ```markdown
   ## Novidades 🎉
   - Sistema de autenticação de usuários
   - Carrinho de compras persistente
   - Dashboard administrativo
   
   ## Melhorias 🔧
   - Performance 30% melhor no carregamento
   - UI/UX aprimorada
   
   ## Correções 🐛
   - Corrigido vazamento de memória no cache
   - Corrigido erro de timeout em uploads grandes
   ```

---

### 🚨 Fluxo de Hotfix (Correção Crítica em Produção)

#### Cenário: Bug crítico em produção (sistema de pagamento parado)

```powershell
# 1. Criar hotfix a partir da main (produção)
git checkout main
git pull origin main
git checkout -b hotfix/IVT-500-payment-gateway-fix

# 2. Identificar e corrigir o problema
# ... análise e debug ...
git add src/payment/gateway.js
git commit -m "fix: corrige timeout no gateway de pagamento"

# 3. Adicionar testes para evitar regressão
git add tests/payment.test.js
git commit -m "test: adiciona teste para timeout do gateway"

# 4. Subir hotfix urgentemente
git push -u origin hotfix/IVT-500-payment-gateway-fix
```

#### Processo de Hotfix

```powershell
# 5. Criar PR urgente: hotfix/... → main
# Marcar como URGENTE/CRÍTICO
# Revisão rápida mas cuidadosa

# 6. Após merge em main, criar tag de patch
git checkout main
git pull origin main
git tag -a v1.2.1 -m "Hotfix 1.2.1 - Corrige timeout de pagamento"
git push origin v1.2.1

# 7. IMPORTANTE: Merge de volta para develop
git checkout develop
git pull origin develop
git merge main
git push origin develop

# 8. Se houver release em andamento, fazer merge também
git checkout release/1.3.0  # se existir
git merge main
git push

# 9. Limpar branch de hotfix
git branch -d hotfix/IVT-500-payment-gateway-fix
git push origin --delete hotfix/IVT-500-payment-gateway-fix
```

---

### 🎯 Cenários Práticos Completos

#### Cenário 1: Desenvolvimento Paralelo de Features

```powershell
# Dev A trabalhando em login
git checkout -b feature/login develop
# ... desenvolvimento ...
git push -u origin feature/login

# Dev B trabalhando em carrinho (paralelamente)
git checkout -b feature/carrinho develop
# ... desenvolvimento ...
git push -u origin feature/carrinho

# Ambos criam PRs para develop
# Após review, primeiro feature/login é mergeado
# feature/carrinho precisa atualizar:
git checkout feature/carrinho
git fetch origin
git rebase origin/develop  # ou merge
# Resolver conflitos se houver
git push --force-with-lease origin feature/carrinho
```

#### Cenário 2: Múltiplos Hotfixes em Sequência

```powershell
# Hotfix 1
git checkout -b hotfix/bug-a main
# ... correção ...
git push -u origin hotfix/bug-a
# [PR → main → merge → tag v1.2.1 → merge develop]

# Hotfix 2 (começa da main atualizada)
git checkout main
git pull origin main
git checkout -b hotfix/bug-b
# ... correção ...
git push -u origin hotfix/bug-b
# [PR → main → merge → tag v1.2.2 → merge develop]
```

#### Cenário 3: Cancelar Feature em Desenvolvimento

```powershell
# Decidiu não continuar com a feature
git checkout develop
git branch -D feature/funcionalidade-cancelada

# Se já foi enviada ao remoto
git push origin --delete feature/funcionalidade-cancelada
```

---

### ⚙️ Configurações Recomendadas no Bitbucket

#### Branch Permissions (Proteção de Branches)

**Para `main`:**
- ✅ Prevent deletion
- ✅ Prevent rewriting history
- ✅ Require pull request with 2+ approvals
- ✅ Require passing builds
- ✅ Require tasks to be resolved
- ❌ Allow direct pushes

**Para `develop`:**
- ✅ Prevent deletion
- ✅ Prevent rewriting history
- ✅ Require pull request with 1+ approval
- ✅ Require passing builds
- ❌ Allow direct pushes

**Para `feature/*`, `release/*`, `hotfix/*`:**
- ✅ Allow creation by all developers
- ✅ Auto-delete after merge (opcional)

#### Branch Workflow Settings

```yaml
# .bitbucket-pipelines.yml (exemplo)
pipelines:
  branches:
    main:
      - step:
          name: Deploy to Production
          deployment: production
          script:
            - npm run build
            - npm run deploy
    develop:
      - step:
          name: Deploy to Staging
          deployment: staging
          script:
            - npm run build
            - npm run deploy:staging
  pull-requests:
    '**':
      - step:
          name: Run Tests
          script:
            - npm install
            - npm test
            - npm run lint
```

---

### 📊 Comparação: Git Flow vs GitHub Flow vs Trunk-Based

| Aspecto | Git Flow | GitHub Flow | Trunk-Based |
|---------|----------|-------------|-------------|
| **Complexidade** | Alta | Média | Baixa |
| **Branches** | Múltiplas permanentes | 1 principal + features | 1 principal |
| **Releases** | Dedicadas | Tags na main | Tags na main |
| **Ideal para** | Releases planejadas | Deploy contínuo | Deploy muito frequente |
| **Tamanho do time** | Médio/Grande | Pequeno/Médio | Pequeno (maduro) |
| **Ciclo de release** | Semanas/Meses | Dias/Semanas | Horas/Dias |

**Quando usar Git Flow no InovaTech:**
- ✅ Releases programadas (ex: mensais, trimestrais)
- ✅ Múltiplas versões em produção (ex: v1.x e v2.x)
- ✅ Processo de QA extensivo antes de produção
- ✅ Necessidade de hotfixes enquanto develop avança

---

### 🔍 Troubleshooting Comum

#### Problema: Feature desatualizada com develop

```powershell
# Opção 1: Merge (mais seguro, mantém histórico)
git checkout feature/minha-feature
git fetch origin
git merge origin/develop
# Resolver conflitos
git add .
git commit -m "merge: atualiza com develop"
git push

# Opção 2: Rebase (histórico linear, mais limpo)
git checkout feature/minha-feature
git fetch origin
git rebase origin/develop
# Resolver conflitos em cada commit
git add .
git rebase --continue
git push --force-with-lease
```

#### Problema: Commit na branch errada

```powershell
# Commitou em develop ao invés de feature
git checkout develop
git reset --soft HEAD~1  # desfaz commit mas mantém alterações

# Criar branch correta e commitar
git checkout -b feature/minha-feature
git commit -m "feat: minha funcionalidade"
git push -u origin feature/minha-feature
```

#### Problema: Precisa de hotfix mas develop está muito à frente

```powershell
# Criar hotfix da main (NÃO da develop)
git checkout main
git pull origin main
git checkout -b hotfix/correcao

# Após merge do hotfix, atualizar develop
git checkout develop
git merge main  # traz o hotfix para develop
git push origin develop
```

---

### 📚 Recursos Adicionais

- [Git Flow Original (Vincent Driessen)](https://nvie.com/posts/a-successful-git-branching-model/)
- [Atlassian Git Flow Tutorial](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)

### 🎓 Exercício Prático Completo de Git Flow

Ver arquivo detalhado: `Infra/GIT/exercicios/exercicio_4_git_flow_completo.md`

**Resumo do exercício:**
1. Configurar repositório com main e develop
2. Criar 2 features paralelas
3. Mergear features via PR
4. Criar release branch
5. Simular e corrigir hotfix
6. Finalizar release com tag

---

## 🏋️ Exercícios Práticos

> 📁 Versões detalhadas em arquivo: `Infra/GIT/exercicios/`

### Exercício 1: Primeiro Commit

```powershell
# 1. Clone o repositório
git clone https://bitbucket.org/seu-usuario/exemplo-repo.git
cd exemplo-repo

# 2. Crie um arquivo
echo "Meu Nome" > hello.txt

# 3. Adicione e faça commit
git add hello.txt
git commit -m "Meu primeiro commit"
git push
```

### Exercício 2: Branch e Pull Request

```powershell
# 1. Crie uma branch
git checkout -b feature/minha-branch

# 2. Modifique um arquivo ou crie um novo
echo "Nova funcionalidade" > feature.txt

# 3. Adicione, faça commit e suba a branch
git add .
git commit -m "Minha alteração na branch"
git push --set-upstream origin feature/minha-branch

# 4. Abra um Pull Request no Bitbucket
```

### Exercício 3: Simulando Conflito

```powershell
# 1. Em dois clones diferentes, edite a mesma linha de um arquivo
# 2. Cada pessoa faz commit e push
# 3. O segundo push irá falhar

# Resolva assim:
git pull origin main
# Edite manualmente os conflitos
git add README.md
git commit -m "Resolve conflito de merge"
git push
```

### Exercício 4: Rebase vs Merge (opcional)

```powershell
# Usando Merge
git checkout feature/x
git fetch origin
git merge origin/main

# Usando Rebase
git checkout feature/y
git fetch origin
git rebase origin/main
```

### Exercício 5: Stash e Recuperação

```powershell
# Salvar trabalho em progresso
git stash

# Trocar de branch e voltar
git checkout main
git checkout -

# Recuperar alterações
git stash pop
```

### Exercício 6: Reset vs Revert

```powershell
# Reverter um commit público
git revert <hash>

# Reset local seguro (soft)
git reset --soft <hash>
```

### Exercício 7: Mini Git Flow

```powershell
# Criar develop e uma feature
git checkout -b develop main
git push -u origin develop

git checkout -b feature/demo develop
# Fazer alterações e commit

# PR: feature -> develop (via Bitbucket)

# Criar release e tag
git checkout -b release/0.1.0 develop
# PR: release -> main

# Criar tag
git checkout main
git tag -a v0.1.0 -m "Release 0.1.0"
git push origin v0.1.0
```

---

## ⚡ Exemplos de Conflitos

> 📁 Exemplos completos em: `Infra/GIT/exemplos-conflito/`

### Exemplo 1: Conflito em Código

Dois desenvolvedores editam a mesma linha de `app.js`:

```js
// Versão do Dev A
console.log('Olá do Dev A');

// Versão do Dev B
console.log('Olá do Dev B');
```

Ao fazer merge, o Git mostrará:

```diff
<<<<<<< HEAD
console.log('Olá do Dev A');
=======
console.log('Olá do Dev B');
>>>>>>> feature/dev-b
```

**Resolução:** Escolha ou combine as linhas, remova os marcadores e faça commit.

### Exemplo 2: Conflito em README.md

```diff
<<<<<<< HEAD
# Projeto InovaTech
=======
# Projeto InovaTech - Bitbucket
>>>>>>> feature/bitbucket
```

**Resolução:** Edite para manter o padrão desejado e faça commit.

### Exemplo 3: Remoção vs Edição

- **Usuário A:** Remove o arquivo `config.txt`
- **Usuário B:** Edita o mesmo arquivo

Ao fazer merge, o Git pedirá para decidir entre manter a edição ou remover o arquivo.

> 💡 **Dica:** Avalie se a edição é importante antes de remover.

---

## 🧾 Cheat Sheet Rápido

```powershell
# Status e Histórico
git status
git log --oneline --graph --decorate --all

# Branches
git branch                          # listar branches
git checkout -b feature/x          # criar e mudar
git switch feature/x               # mudar de branch

# Stage e Commit
git add .
git add <arquivo>
git commit -m "feat: mensagem clara"

# Sincronização
git pull --ff-only
git push -u origin minha-branch
git fetch origin

# Merge e Rebase
git merge origin/main
git rebase origin/main

# Resolução de Conflitos
git diff
# Edite os arquivos
git add <arquivo>
git rebase --continue              # se estiver rebaseando
git merge --continue               # se estiver fazendo merge

# Tags
git tag -a v1.0.0 -m "Primeira release"
git push origin v1.0.0
git tag -l                         # listar tags

# Desfazer Alterações
git stash                          # guardar alterações
git stash pop                      # recuperar alterações
git reset --soft HEAD~1            # desfazer último commit (mantém alterações)
git revert <hash>                  # reverter commit específico
```

---

## 💬 Discussão: Nosso Padrão no Dia a Dia

### Boas Práticas da Equipe

- ✅ Sempre criar branches para novas features/bugs
- ✅ Commits pequenos e descritivos
- ✅ Pull Requests obrigatórios para revisão
- ✅ Resolver conflitos localmente antes de subir
- ✅ Usar tags para releases
- ✅ Revisar código de colegas com atenção
- ✅ Manter histórico limpo e organizado

### Padrão de Mensagens de Commit

```
<tipo>: <descrição curta>

[corpo opcional com mais detalhes]

[rodapé opcional com refs e breaking changes]
```

**Tipos comuns:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

---

## 🏆 Certificação de Conclusão

**Parabéns! 🎉** Você está pronto para trabalhar com Git e Bitbucket no dia a dia do InovaTech.

### Próximos Passos

1. Pratique os exercícios propostos
2. Crie seu primeiro Pull Request
3. Resolva seu primeiro conflito
4. Compartilhe conhecimento com a equipe

---

*Documento mantido por: InovaTech Dev Team*  
*Última atualização: 2024*
