package br.com.InovaTech.InovaTech.controller;

import br.com.InovaTech.InovaTech.model.dto.FrontendLogDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*")
public class LogController {

    private static final Logger frontendLogger = LoggerFactory.getLogger("FRONTEND");
    private final ObjectMapper objectMapper;

    public LogController(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostMapping("/frontend")
    public ResponseEntity<Void> receiveFrontendLog(@RequestBody FrontendLogDTO log) {
        try {
            // Converte o log para JSON string para gravar no arquivo
            String logJson = objectMapper.writeValueAsString(log);
            
            // Registra no logger específico do frontend baseado no nível
            switch (log.getLevel().toUpperCase()) {
                case "ERROR":
                    frontendLogger.error("FRONTEND_LOG: {}", logJson);
                    break;
                case "WARN":
                    frontendLogger.warn("FRONTEND_LOG: {}", logJson);
                    break;
                case "INFO":
                    frontendLogger.info("FRONTEND_LOG: {}", logJson);
                    break;
                case "DEBUG":
                    frontendLogger.debug("FRONTEND_LOG: {}", logJson);
                    break;
                default:
                    frontendLogger.info("FRONTEND_LOG: {}", logJson);
            }
            
            return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            // Não queremos que erros no logging quebrem o frontend
            frontendLogger.error("Erro ao processar log do frontend: {}", e.getMessage());
            return ResponseEntity.ok().build(); // Retorna 200 mesmo com erro
        }
    }

    @PostMapping("/frontend/batch")
    public ResponseEntity<Void> receiveFrontendLogBatch(@RequestBody List<FrontendLogDTO> logs) {
        try {
            for (FrontendLogDTO log : logs) {
                String logJson = objectMapper.writeValueAsString(log);
                
                switch (log.getLevel().toUpperCase()) {
                    case "ERROR":
                        frontendLogger.error("FRONTEND_LOG: {}", logJson);
                        break;
                    case "WARN":
                        frontendLogger.warn("FRONTEND_LOG: {}", logJson);
                        break;
                    case "INFO":
                        frontendLogger.info("FRONTEND_LOG: {}", logJson);
                        break;
                    case "DEBUG":
                        frontendLogger.debug("FRONTEND_LOG: {}", logJson);
                        break;
                    default:
                        frontendLogger.info("FRONTEND_LOG: {}", logJson);
                }
            }
            
            return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            frontendLogger.error("Erro ao processar batch de logs do frontend: {}", e.getMessage());
            return ResponseEntity.ok().build();
        }
    }
}
