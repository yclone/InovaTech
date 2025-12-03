# 🎓 Ejercicio 4: Git Flow Completo

## Objetivo
Practicar el flujo completo de Git Flow, incluyendo features, releases y hotfixes.

## Prerrequisitos
- Git instalado y configurado
- Acceso al repositorio de InovaTech en Bitbucket
- Conocimiento de los ejercicios 1, 2 y 3

---

## 📋 Parte 1: Setup Inicial (5 min)

### Paso 1: Crear repositorio de prueba

```powershell
# Crear y entrar en el directorio
mkdir git-flow-prueba
cd git-flow-prueba

# Inicializar repositorio
git init
git branch -M main

# Crear archivo inicial
echo "# Proyecto Git Flow Prueba" > README.md
git add README.md
git commit -m "chore: commit inicial"

# Crear rama develop
git checkout -b develop
echo "Versión en desarrollo" >> README.md
git add README.md
git commit -m "chore: inicializa rama develop"
```

### Paso 2: Conectar con remoto (Bitbucket)

```powershell
# Crea el repositorio en Bitbucket primero, luego:
git remote add origin https://bitbucket.org/tu-usuario/git-flow-prueba.git
git push -u origin main
git push -u origin develop
```

---

## 🎨 Parte 2: Desarrollo de Features (15 min)

### Feature 1: Sistema de Login

```powershell
# 1. Crear feature desde develop
git checkout develop
git pull origin develop
git checkout -b feature/sistema-login

# 2. Desarrollar funcionalidad
mkdir -p src/auth
echo "function login(user, pass) { /* TODO */ }" > src/auth/login.js
git add src/auth/login.js
git commit -m "feat: agrega función de login"

# 3. Agregar tests
mkdir -p tests
echo "// Tests de login" > tests/login.test.js
git add tests/login.test.js
git commit -m "test: agrega tests de login"

# 4. Documentar
echo -e "\n## Features\n- Sistema de login" >> README.md
git add README.md
git commit -m "docs: documenta sistema de login"

# 5. Subir feature
git push -u origin feature/sistema-login
```

**📝 Acción en Bitbucket:**
