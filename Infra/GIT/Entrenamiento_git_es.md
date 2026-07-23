# 🚀 ENTRENAMIENTO GIT & BITBUCKET - GUÍA PRÁCTICA

## 📚 Índice
1. [Agenda (60 min)](#agenda-60-minutos)
2. [Setup: Configurando tu Git](#setup-configurando-tu-git)
3. [Fundamentos Esenciales](#fundamentos-esenciales)
4. [Flujo 1: Clonar y el Primer Commit](#flujo-1-clonar-y-el-primer-commit)
5. [Flujo 2: Trabajo en Equipo (Branches y Pull Requests)](#flujo-2-trabajo-en-equipo-branches-y-pull-requests)
6. [Flujo 3: Mantenerse Actualizado (pull) y Conflictos](#flujo-3-mantenerse-actualizado-pull-y-conflictos)
7. [Git Flow: Features, Releases y Hotfixes](#git-flow-features-releases-y-hotfixes)
8. [Ejercicios Prácticos](#ejercicios-practicos)
9. [Ejemplos de Conflictos](#ejemplos-de-conflictos)
10. [Cheat Sheet Rápido](#cheat-sheet-rapido)
11. [Discusión: Nuestro Estándar Diario](#discusion-nuestro-estandar-diario)

---

## ⏱️ Agenda (60 minutos)

- **05 min** — Objetivo del entrenamiento + visión general de Git/Bitbucket
- **10 min** — Setup, configuración, .gitignore y buenas prácticas de commit
- **10 min** — Flujo básico: clone, add, commit, push (demo guiada)
- **10 min** — Branches, PRs en Bitbucket, políticas y revisiones
- **10 min** — Actualización con pull, merge vs rebase, resolución de conflictos
- **10 min** — Git Flow (features, release, hotfix) + tagging y releases
- **05 min** — Q&A y próximos pasos

> 💡 **Notas para el instructor:** Mantén el terminal en foco, usa ejemplos pequeños y provoca un conflicto simple para resolver en vivo.

---

## 🛠️ Setup: Configurando tu Git

### Instalación

1. Descarga: [Download Git](https://git-scm.com/downloads)
2. Configura tu Git:

```powershell
# Configurar nombre y email
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Verificar configuración
git config --list
```

### Conectando a Bitbucket

- Crea una cuenta en [Bitbucket](https://bitbucket.org/)
- Genera un token de acceso o configura SSH (opcional)

---

## 🧠 Fundamentos Esenciales

### Conceptos Básicos

#### 📁 Working Directory, Staging Area y Repository

```
Working Directory  →  Staging Area  →  Local Repository  →  Remote Repository
    (modificado)        (git add)         (git commit)         (git push)
```

- **Working Directory:** Tus archivos actuales en disco
  - `git status` muestra archivos modificados
  - `git diff` muestra los cambios exactos

- **Staging Area (Index):** Área de preparación para commit
  - `git add <archivo>` agrega archivo específico
  - `git add .` agrega todos los archivos modificados
  - `git reset <archivo>` quita del staging (mantiene cambios)
  - `git restore --staged <archivo>` (alternativa moderna a reset)

- **Local Repository:** Historial de commits local
  - `git commit -m "mensaje"` guarda snapshot
  - `git log` visualiza historial
  - Funciona offline

- **Remote Repository:** Repositorio compartido (Bitbucket, GitHub)
  - `git push` envía commits locales
  - `git pull` descarga e integra commits remotos
  - Requiere conexión a internet

---

#### 🎯 HEAD y Branches

- **HEAD:** Puntero al commit actual donde trabajas
  ```powershell
  git log --oneline  # HEAD -> rama-actual
  HEAD~1             # Commit anterior a HEAD
  HEAD~2             # 2 commits atrás
  HEAD^              # Primer padre de HEAD (en merges)
  ```

- **Branch:** Puntero móvil a un commit
  ```powershell
  git branch                    # Lista ramas locales
  git branch -a                 # Lista todas (incluyendo remotas)
  git branch nombre-rama        # Crea nueva rama
  git branch -d nombre-rama     # Borra rama (seguro)
  git branch -D nombre-rama     # Fuerza borrado
  ```

---

#### 🌐 Remotos (Remotes)

- **origin:** Nombre por defecto del repositorio remoto principal
  ```powershell
  git remote -v                 # Lista remotos configurados
  git remote add origin <url>   # Agrega remoto
  git remote remove origin      # Quita remoto
  git remote rename origin nuevo # Renombra remoto
  ```

- **upstream:** Convención para el repositorio original (en forks)
  ```powershell
  git remote add upstream <url-repo-original>
  git fetch upstream
  git merge upstream/main
  ```

- **Tracking branches:** Conexión entre rama local y remota
  ```powershell
  git push -u origin mi-rama    # -u define tracking
  git branch -vv                # Muestra tracking configurado
  ```

---

#### 🔄 Fetch vs Pull vs Push

**`git fetch`** - Descarga datos sin integrar
```powershell
git fetch origin              # Descarga todas las ramas
git fetch origin main         # Descarga solo main
git fetch --all               # Descarga de todos los remotos
```
- ✅ Seguro: no modifica tu código
- ✅ Permite revisar antes de integrar
- ✅ Actualiza referencias remotas (origin/main, origin/develop)

**`git pull`** - Descarga e integra automáticamente (fetch + merge)
```powershell
git pull origin main          # fetch + merge
git pull --rebase origin main # fetch + rebase
git pull --ff-only            # Solo acepta fast-forward
```
- ⚠️ Puede crear merge commits
- ⚠️ Puede causar conflictos
- 💡 Usa `--rebase` para historial lineal

**`git push`** - Envía commits locales al remoto
```powershell
git push origin nombre-rama           # Push normal
git push -u origin nombre-rama        # Define tracking
git push --force                      # Fuerza push (¡PELIGRO!)
git push --force-with-lease           # Fuerza más seguro
git push --tags                       # Envía tags
```

---

#### 🔀 Merge vs Rebase vs Cherry-pick

**`git merge`** - Une historiales creando commit de merge
```powershell
git checkout main
git merge rama-feature

# Resultado:
#     A---B---C rama-feature
#    /         \
# ---D---E---F---G main (commit G es el merge)
```
- ✅ Preserva historial completo
- ✅ No reescribe commits
- ✅ Seguro para ramas públicas
- ❌ Puede dejar historial confuso con muchos merges

**Tipos de merge:**
```powershell
git merge --ff feature           # Fast-forward (por defecto cuando posible)
git merge --no-ff feature        # Siempre crea commit de merge
git merge --squash feature       # Une todos los commits en 1
```

**`git rebase`** - Reaplica commits en nueva base (historial lineal)
```powershell
git checkout rama-feature
git rebase main

# Antes:                    Después:
#     A---B---C feature          A'--B'--C' feature
#    /                          /
# ---D---E---F main          ---D---E---F main
```
- ✅ Historial lineal y limpio
- ✅ Facilita lectura del log
- ❌ Reescribe historial (cambia hashes de los commits)
- ⚠️ NUNCA usar en ramas públicas/compartidas

**Interactive rebase:** Editar historial
```powershell
git rebase -i HEAD~3    # Edita últimos 3 commits

# Opciones:
# pick   - mantener commit
# reword - cambiar mensaje
# edit   - pausar para editar
# squash - unir con anterior
# fixup  - unir sin mensaje
# drop   - eliminar commit
```

**`git cherry-pick`** - Copia commit específico a la rama actual
```powershell
git cherry-pick <commit-hash>      # Aplica 1 commit
git cherry-pick abc123 def456      # Aplica múltiples
git cherry-pick abc123..def456     # Aplica rango
```
- 💡 Útil para aplicar hotfix en varias ramas
- ⚠️ Crea nuevos commits (hashes diferentes)

---

#### ↩️ Reset vs Revert vs Restore

**`git reset`** - Mueve HEAD y rama (modifica historial)
```powershell
git reset --soft HEAD~1     # Deshace commit, mantiene staging
git reset --mixed HEAD~1    # Deshace commit y staging (por defecto)
git reset --hard HEAD~1     # Deshace todo (¡CUIDADO: pierde cambios!)

# Casos de uso:
git reset --soft HEAD~1     # Rehacer último commit
git reset HEAD archivo.txt  # Quita del staging
git reset --hard origin/main # Descarta todo y queda igual al remoto
```

**Modos de reset:**
- `--soft`: Mueve HEAD, mantiene staging y working directory
- `--mixed`: Mueve HEAD, limpia staging, mantiene working directory
- `--hard`: Mueve HEAD, limpia staging Y working directory

**`git revert`** - Crea nuevo commit que deshace otro (preserva historial)
```powershell
git revert <commit-hash>       # Deshace 1 commit
git revert HEAD~3..HEAD        # Deshace rango de commits
git revert -m 1 <merge-hash>   # Deshace merge commit
```
- ✅ Seguro para ramas públicas
- ✅ Preserva historial
- ✅ Auditables (queda registrado)

**`git restore`** - Restaura archivos (comando moderno)
```powershell
git restore archivo.txt              # Descarta cambios locales
git restore --staged archivo.txt     # Quita del staging
git restore --source=HEAD~1 archivo  # Restaura de commit específico
```

**Cuándo usar cada uno:**
- `reset`: Deshacer commits locales (no enviados aún)
- `revert`: Deshacer commits públicos (ya enviados)
- `restore`: Descarta cambios en archivos

---

#### 💾 Stash - Guardar Trabajo Temporalmente

```powershell
git stash                      # Guarda cambios
git stash save "mensaje"      # Guarda con descripción
git stash -u                   # Incluye archivos untracked
git stash list                 # Lista stashes
git stash show                 # Muestra contenido
git stash pop                  # Recupera y elimina
git stash apply                # Recupera pero mantiene
git stash drop                 # Elimina stash
git stash clear                # Elimina todos
git stash branch nueva-rama    # Crea rama desde stash
```

**Caso de uso:**
```powershell
# Trabajando en feature, necesitas cambiar a hotfix urgente
git stash save "WIP: implementando login"
git checkout main
git checkout -b hotfix/bug-critico
# ... corrige bug ...
git checkout feature/login
git stash pop  # Vuelve al trabajo
```

---

...continúa en el documento...
