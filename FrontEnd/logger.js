// Sistema de Logging Estruturado para Frontend

class Logger {
    constructor(context = 'App') {
        this.context = context
        this.environment = import.meta.env.MODE || 'development'
        this.buffer = []
        this.batchSize = 10
        this.flushInterval = 5000 // 5 segundos
        this.backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
        
        // Iniciar flush periódico
        this._startPeriodicFlush()
    }

    _formatLog(level, message, data = {}) {
        const timestamp = new Date().toISOString()
        const log = {
            timestamp,
            level,
            context: this.context,
            environment: this.environment,
            message,
            userAgent: navigator.userAgent,
            url: window.location.href,
            metadata: data
        }
        return log
    }

    _sendLog(log) {
        // Log no console (sempre)
        const color = {
            DEBUG: '#808080',
            INFO: '#0066cc',
            WARN: '#ff9900',
            ERROR: '#cc0000'
        }[log.level]

        console.log(
            `%c[${log.level}]%c ${log.timestamp} - ${log.context} - ${log.message}`,
            `color: ${color}; font-weight: bold`,
            'color: inherit',
            log
        )

        // Adicionar ao buffer para enviar ao backend
        this._addToBuffer(log)
    }

    _addToBuffer(log) {
        this.buffer.push(log)
        
        // Se o buffer atingiu o tamanho máximo, envia imediatamente
        if (this.buffer.length >= this.batchSize) {
            this._flush()
        }
    }

    _startPeriodicFlush() {
        setInterval(() => {
            if (this.buffer.length > 0) {
                this._flush()
            }
        }, this.flushInterval)
    }

    async _flush() {
        if (this.buffer.length === 0) return

        const logsToSend = [...this.buffer]
        this.buffer = []

        try {
            // Enviar em batch para o backend
            await fetch(`${this.backendUrl}/api/logs/frontend/batch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logsToSend)
            })
        } catch (error) {
            // Falha silenciosa - não queremos quebrar a aplicação por erro de logging
            console.warn('Falha ao enviar logs para backend:', error.message)
        }
    }

    // Flush manual (útil antes de fechar a página)
    flush() {
        this._flush()
    }

    debug(message, data = {}) {
        const log = this._formatLog('DEBUG', message, data)
        this._sendLog(log)
    }

    info(message, data = {}) {
        const log = this._formatLog('INFO', message, data)
        this._sendLog(log)
    }

    warn(message, data = {}) {
        const log = this._formatLog('WARN', message, data)
        this._sendLog(log)
    }

    error(message, error = null, data = {}) {
        const errorData = error ? {
            errorMessage: error.message,
            errorStack: error.stack,
            errorName: error.name
        } : {}
        
        const log = this._formatLog('ERROR', message, { ...data, ...errorData })
        this._sendLog(log)
    }

    // Métricas de performance
    performance(metric, duration, data = {}) {
        const log = this._formatLog('INFO', `Performance: ${metric}`, {
            metric,
            duration,
            ...data
        })
        this._sendLog(log)
    }

    // Log de ação do usuário
    userAction(action, data = {}) {
        const log = this._formatLog('INFO', `User Action: ${action}`, {
            action,
            ...data
        })
        this._sendLog(log)
    }
}

// Exportar instância global
export const logger = new Logger('Frontend')

// Criar loggers específicos por contexto
export const createLogger = (context) => new Logger(context)

// Flush logs antes de sair da página
window.addEventListener('beforeunload', () => {
    logger.flush()
})

