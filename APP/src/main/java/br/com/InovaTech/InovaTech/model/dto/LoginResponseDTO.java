package br.com.InovaTech.InovaTech.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "Resposta do login")
public class LoginResponseDTO {

    @JsonProperty("Sucesso")
    @Schema(description = "Indica se o login foi bem-sucedido", example = "true")
    private boolean sucesso;

    @JsonProperty("Mensagem")
    @Schema(description = "Mensagem de retorno", example = "Login realizado com sucesso")
    private String mensagem;

    @JsonProperty("Cliente")
    @Schema(description = "Dados do cliente logado (apenas se sucesso for true)")
    private ClienteDTO cliente;
}