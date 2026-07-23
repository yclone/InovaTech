# 🚀 Guia de Deploy - InovaTech Frontend

Este guia explica como fazer deploy da aplicação frontend em diferentes ambientes.

## 📋 Pré-requisitos de Deploy

- Build de produção gerado (`npm run build`)
- Servidor web configurado (Nginx, Apache, etc.)
- HTTPS configurado (recomendado)
- Backend acessível pelo frontend

## 🏗️ Build de Produção

```bash
# 1. Instale as dependências
npm install

# 2. Gere o build otimizado
npm run build

# 3. Teste localmente
npm run preview

# 4. Arquivos gerados em ./dist/
ls dist/
# index.html
# assets/
#   ├── index-[hash].js
#   └── index-[hash].css
```

## 🌐 Deploy em Diferentes Plataformas

### 1. Vercel (Recomendado - Fácil)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy direto
vercel

# Ou conectar via GitHub
# 1. Conecte repositório no dashboard Vercel
# 2. Configure build command: npm run build
# 3. Configure output directory: dist
# 4. Deploy automático a cada push
```

### 2. Netlify

```bash
# Via CLI
npm i -g netlify-cli
netlify deploy --prod --dir=dist

# Ou via interface web
# 1. Conecte repositório no Netlify
# 2. Build command: npm run build
# 3. Publish directory: dist
# 4. Deploy automático
```

### 3. GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: FrontEnd/package-lock.json

      - name: Install and build
        working-directory: ./FrontEnd
        run: |
          npm ci
          npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./FrontEnd/dist
```

### 4. Firebase Hosting

```bash
# Instalar Firebase CLI
npm i -g firebase-tools

# Inicializar projeto
firebase init hosting

# Configurar firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}

# Deploy
npm run build
firebase deploy
```

### 5. AWS S3 + CloudFront

```bash
# Instalar AWS CLI
aws configure

# Sync para S3
aws s3 sync dist/ s3://seu-bucket-name --delete

# Invalidar CloudFront (opcional)
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 6. Servidor VPS (Ubuntu/CentOS)

```bash
# 1. Instalar Nginx
sudo apt update
sudo apt install nginx

# 2. Configurar Nginx
sudo nano /etc/nginx/sites-available/inovatech-frontend

# Configuração Nginx:
server {
    listen 80;
    server_name seu-dominio.com;
    root /var/www/inovatech-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache de assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}

# 3. Ativar site
sudo ln -s /etc/nginx/sites-available/inovatech-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 4. Upload dos arquivos
scp -r dist/* usuario@servidor:/var/www/inovatech-frontend/
```

## ⚙️ Configurações de Ambiente

### Variáveis de Ambiente por Ambiente

```bash
# Desenvolvimento (.env.local)
VITE_API_BASE_URL=http://localhost:5000
VITE_ENV=development

# Staging (.env.staging)
VITE_API_BASE_URL=https://api-staging.inovatech.com
VITE_ENV=staging

# Produção (.env.production)
VITE_API_BASE_URL=https://api.inovatech.com
VITE_ENV=production
```

### Build para Diferentes Ambientes

```bash
# Development
npm run build

# Staging
npm run build -- --mode staging

# Production
npm run build -- --mode production
```

## 🔧 Configurações do Servidor Web

### Nginx (Configuração Completa)

```nginx
server {
    listen 80;
    server_name inovatech.com www.inovatech.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name inovatech.com www.inovatech.com;

    # SSL Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/inovatech-frontend;
    index index.html;

    # SPA Configuration
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy (se necessário)
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache de Assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';";

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate max-age=0 auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

### Apache (.htaccess)

```apache
RewriteEngine On
RewriteBase /

# Handle SPA routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache de Assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive on
    ExpiresDefault "access plus 1 year"
</FilesMatch>

# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Security Headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-XSS-Protection "1; mode=block"
Header always set X-Content-Type-Options "nosniff"
```

## 📊 Monitoramento e Analytics

### Google Analytics (GA4)

```javascript
// main.js - Adicionar no topo
if (import.meta.env.PROD) {
  // Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
}
```

### Sentry (Error Tracking)

```javascript
// Instalar Sentry
npm install @sentry/browser

// main.js
import * as Sentry from '@sentry/browser';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN',
    environment: import.meta.env.VITE_ENV || 'production'
  });
}
```

## 🔍 Verificação Pós-Deploy

### Checklist de Produção

- [ ] ✅ Site carrega sem erros
- [ ] ✅ Todas as rotas funcionam (`/`, `/login`, `/register`, `/dashboard`)
- [ ] ✅ API está conectada e funcionando
- [ ] ✅ Formulários enviam dados corretamente
- [ ] ✅ Responsividade funciona em mobile
- [ ] ✅ Performance é aceitável (Lighthouse Score > 90)
- [ ] ✅ HTTPS está configurado
- [ ] ✅ Headers de segurança estão ativos
- [ ] ✅ Compression (gzip) está ativa
- [ ] ✅ Cache de assets funciona
- [ ] ✅ Analytics está funcionando
- [ ] ✅ Error tracking está ativo

### Ferramentas de Teste

```bash
# Lighthouse CLI
npm i -g lighthouse
lighthouse https://seu-site.com --output html --output-path ./lighthouse-report.html

# WebPageTest
# https://www.webpagetest.org/

# GTmetrix
# https://gtmetrix.com/
```

## 🐛 Troubleshooting

### Problemas Comuns

**1. Página em branco após deploy**

- Verifique se o servidor está servindo `index.html` para todas as rotas
- Configure SPA routing no servidor web

**2. Assets não carregam**

- Verifique caminhos relativos vs absolutos
- Configure `base` no `vite.config.js` se necessário

**3. API não conecta**

- Verifique CORS no backend
- Confirme URL da API nas variáveis de ambiente
- Configure proxy se necessário

**4. Performance ruim**

- Ative compression (gzip)
- Configure cache de assets
- Otimize imagens
- Use CDN se necessário

## 🔄 Deploy Automatizado (CI/CD)

### GitHub Actions (Completo)

```yaml
name: 🚀 Deploy Production

on:
  push:
    branches: [main]
    paths: ['FrontEnd/**']

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: FrontEnd/package-lock.json

      - name: Install dependencies
        working-directory: ./FrontEnd
        run: npm ci

      - name: Run tests
        working-directory: ./FrontEnd
        run: npm run build

      - name: Deploy to production
        working-directory: ./FrontEnd
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
        run: |
          # Deploy via rsync, SCP, ou API
          echo "Deploying to production..."
```

---

**🎉 Agora seu frontend está pronto para produção!**
