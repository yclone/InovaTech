package br.com.InovaTech.InovaTech.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api")
@Tag(name = "Utilitários", description = "Endpoints utilitários para teste e validação")
public class HelloController {

    @GetMapping("/hello")
    @Operation(summary = "Teste da API", description = "Endpoint simples para verificar se a API está funcionando")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "API funcionando corretamente")
    })
    public String hello() {
        return "Hello InovaTech! Aplicação funcionando com Jakarta Validation.";
    }
    
    @GetMapping("/validation-test")
    @Operation(summary = "Teste de validação", description = "Verifica se as validações Jakarta estão funcionando")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Validações funcionando corretamente")
    })
    public String validationTest() {
        return "Jakarta Validation está funcionando corretamente no Spring Boot 3.5.6";
    }
}