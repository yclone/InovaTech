# 🔧 Resolvendo Problemas de CORS

## O que é CORS?

CORS (Cross-Origin Resource Sharing) é uma política de segurança dos navegadores que bloqueia requisições entre diferentes origens (protocolo, domínio ou porta diferentes).

**Problema**: Frontend (`http://localhost:5173`) → Backend (`http://localhost:5000`)

## ✅ Solução Implementada (Proxy do Vite)

### 1. Configuração do Proxy

O arquivo `vite.config.js` foi configurado com um proxy que redireciona todas as requisições de `/api/*` para `http://localhost:5000/*`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 2. Como Funciona

- **Frontend faz requisição**: `http://localhost:5173/api/clientes`
- **Proxy redireciona**: `http://localhost:5000/clientes`
- **Não há CORS**: Tudo roda na mesma origem do ponto de vista do navegador

### 3. Configuração Automática

O código detecta automaticamente o ambiente:

```javascript
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://localhost:5000';
```

- **Desenvolvimento**: Usa `/api` (proxy)
- **Produção**: Usa `http://localhost:5000` (direto)

## 🛠 Soluções Alternativas

### Opção 1: Configurar CORS no Backend Java

Se preferir configurar no backend, adicione essas anotações:

```java
@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class ClienteController {
    // seus métodos...
}
```

Ou configure globalmente:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### Opção 2: Usar Extensão do Navegador

Para testes rápidos, você pode usar extensões como:
- **CORS Unblock** (Chrome)
- **CORS Everywhere** (Firefox)

⚠️ **Atenção**: Não recomendado para produção!

### Opção 3: Configuração Avançada do Vite

```javascript
// vite.config.js - Configuração mais detalhada
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

## 🧪 Como Testar

### 1. Verifique se o Backend está Rodando
```bash
curl http://localhost:5000/api/hello
```

### 2. Teste o Proxy
```bash
curl http://localhost:5173/api/hello
```

### 3. Monitor de Rede
1. Abra DevTools (F12)
2. Vá para a aba **Network**
3. Faça uma requisição
4. Verifique se aparece `/api/clientes` (não `localhost:5000`)

## 🐛 Troubleshooting

### Erro: "ERR_FAILED"
- ✅ Backend não está rodando
- ✅ Porta incorreta
- ✅ Firewall bloqueando

### Erro: "CORS policy"
- ✅ Proxy não configurado corretamente
- ✅ URL da API incorreta
- ✅ Cache do navegador

### Erro: "Failed to fetch"
- ✅ Conectividade de rede
- ✅ Backend travado
- ✅ Configuração de proxy

### Soluções Rápidas

1. **Reinicie o servidor frontend**:
   ```bash
   # Para o servidor (Ctrl+C)
   npm run dev
   ```

2. **Limpe o cache do navegador**:
   - Ctrl+Shift+R (hard refresh)
   - DevTools → Network → Disable cache

3. **Verifique logs**:
   - Console do navegador (F12)
   - Terminal do frontend
   - Logs do backend

## 📝 Status Atual

✅ **Proxy configurado** no `vite.config.js`
✅ **URL da API atualizada** para `/api`
✅ **Detecção automática** de ambiente
✅ **Tratamento de erros melhorado**
✅ **Logs detalhados** para debug

## 🚀 Próximos Passos

1. **Teste o cadastro** novamente
2. **Monitore o console** para logs
3. **Verifique a aba Network** no DevTools
4. **Configure CORS no backend** se preferir (opcional)

A solução atual deve resolver o problema de CORS! 🎉