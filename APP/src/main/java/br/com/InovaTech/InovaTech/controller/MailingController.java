package br.com.InovaTech.InovaTech.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import br.com.InovaTech.InovaTech.model.dto.MailingRequestDTO;
import br.com.InovaTech.InovaTech.model.dto.ResponseEmailDTO;
import br.com.InovaTech.InovaTech.service.MailingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Mailing", description = "API para envio de emails")
public class MailingController {

    private MailingService mailingService;

    public MailingController(MailingService mailingService) {
        this.mailingService = mailingService;
    }

    @PostMapping("/mailing")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Enviar email", 
               description = "Envia um email para o endereço fornecido, verificando se o email existe na base de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Processamento do email concluído",
                content = @Content(schema = @Schema(implementation = ResponseEmailDTO.class))),
        @ApiResponse(responseCode = "400", description = "Email inválido fornecido"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    public ResponseEmailDTO sendEmail(@RequestBody @Valid MailingRequestDTO mailingRequest) {
        return mailingService.sendEmail(mailingRequest);
    }
}