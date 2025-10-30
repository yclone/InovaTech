package br.com.InovaTech.InovaTech.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

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
@Schema(description = "Dados para envio de email")
public class MailingRequestDTO {

    @JsonProperty("Email")
    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "Formato de e-mail incorreto")
    @Schema(description = "E-mail do destinatário", example = "joao.silva@email.com", required = true)
    private String email;
}