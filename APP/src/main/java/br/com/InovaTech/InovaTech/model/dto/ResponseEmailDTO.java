package br.com.InovaTech.InovaTech.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Resposta do envio de email")
public class ResponseEmailDTO {

    @JsonProperty("Sucesso")
    @Schema(description = "Indica se o email foi enviado com sucesso", example = "true")
    private boolean sucesso;

    @JsonProperty("Mensagem")
    @Schema(description = "Mensagem de retorno", example = "Email enviado com sucesso!")
    private String mensagem;
}
