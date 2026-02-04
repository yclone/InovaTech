import './style.css'
import { logger, createLogger } from './logger.js'

// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// Loggers específicos por contexto
const apiLogger = createLogger('API')
const uiLogger = createLogger('UI')

// Inicialização
logger.info('Frontend inicializado', {
    apiUrl: API_BASE_URL,
    environment: import.meta.env.MODE,
    timestamp: Date.now()
})

// Capturar erros globais
window.addEventListener('error', (event) => {
    logger.error('Erro global capturado', event.error, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    })
})

// Capturar promises rejeitadas
window.addEventListener('unhandledrejection', (event) => {
    logger.error('Promise rejeitada não tratada', event.reason, {
        promise: event.promise
    })
})

// Função para carregar clientes
async function carregarClientes() {
    const startTime = performance.now()
    
    try {
        apiLogger.debug('Iniciando requisição para listar clientes')
        uiLogger.info('Usuário solicitou carregamento de clientes')
        
        const response = await fetch(`${API_BASE_URL}/api/clientes`)
        
        if (!response.ok) {
            apiLogger.warn('Resposta HTTP não OK', {
                status: response.status,
                statusText: response.statusText
            })
            throw new Error(`Erro HTTP: ${response.status}`)
        }
        
        const clientes = await response.json()
        const duration = performance.now() - startTime
        
        apiLogger.info('Clientes carregados com sucesso', {
            quantidade: clientes.length,
            duration: `${duration.toFixed(2)}ms`
        })
        
        logger.performance('carregarClientes', duration, {
            quantidade: clientes.length
        })
        
        const lista = document.getElementById('listaClientes')
        lista.innerHTML = clientes.length > 0
            ? clientes.map(cliente => `
                <div class="cliente-card">
                    <strong>${cliente.primeiroNome} ${cliente.ultimoNome}</strong><br>
                    📧 ${cliente.usuario}<br>
                    🏙️ ${cliente.cidade} - ${cliente.estado}
                </div>
            `).join('')
            : '<p>Nenhum cliente cadastrado</p>'
        
        uiLogger.debug('Lista de clientes renderizada', {
            clientesVisiveis: clientes.length
        })
            
    } catch (error) {
        apiLogger.error('Erro ao carregar clientes', error, {
            url: `${API_BASE_URL}/api/clientes`
        })
        
        document.getElementById('listaClientes').innerHTML = 
            `<p class="error">Erro ao carregar clientes: ${error.message}</p>`
    }
}

// Função para cadastrar cliente
async function cadastrarCliente(event) {
    event.preventDefault()
    const startTime = performance.now()
    
    const cliente = {
        primeiroNome: document.getElementById('primeiroNome').value,
        ultimoNome: document.getElementById('ultimoNome').value,
        usuario: document.getElementById('usuario').value,
        senha: document.getElementById('senha').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value
    }
    
    try {
        apiLogger.debug('Iniciando cadastro de cliente', {
            usuario: cliente.usuario,
            cidade: cliente.cidade
        })
        
        uiLogger.userAction('cadastrar_cliente', {
            usuario: cliente.usuario
        })
        
        const response = await fetch(`${API_BASE_URL}/api/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        })
        
        if (!response.ok) {
            const error = await response.json()
            apiLogger.warn('Erro na resposta ao cadastrar cliente', {
                status: response.status,
                erro: error.message
            })
            throw new Error(error.message || 'Erro ao cadastrar cliente')
        }
        
        const clienteSalvo = await response.json()
        const duration = performance.now() - startTime
        
        apiLogger.info('Cliente cadastrado com sucesso', {
            id: clienteSalvo.id,
            usuario: clienteSalvo.usuario,
            duration: `${duration.toFixed(2)}ms`
        })
        
        logger.performance('cadastrarCliente', duration)
        
        uiLogger.info('Formulário resetado e lista atualizada')
        alert('Cliente cadastrado com sucesso!')
        document.getElementById('formCliente').reset()
        carregarClientes()
        
    } catch (error) {
        apiLogger.error('Erro ao cadastrar cliente', error, {
            usuario: cliente.usuario,
            url: `${API_BASE_URL}/api/clientes`
        })
        
        alert(`Erro: ${error.message}`)
    }
}

// Event listeners
document.getElementById('btnCarregarClientes').addEventListener('click', () => {
    uiLogger.userAction('botao_carregar_clientes_clicado')
    carregarClientes()
})

document.getElementById('formCliente').addEventListener('submit', cadastrarCliente)

// Log de interações do usuário
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', () => {
        uiLogger.debug(`Input focado: ${input.id}`)
    })
})

// Carregar clientes ao iniciar
logger.info('Carregando dados iniciais')
carregarClientes()

// Log de página pronta
window.addEventListener('load', () => {
    const loadTime = performance.now()
    logger.performance('pageLoad', loadTime, {
        readyState: document.readyState
    })
    uiLogger.info('Página completamente carregada', {
        loadTime: `${loadTime.toFixed(2)}ms`
    })
})
