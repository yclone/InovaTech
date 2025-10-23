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
@Schema(description = "Dados do cliente para criação e consulta")
public class ClienteDTO {

	@Schema(description = "ID único do cliente", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
	private long id;

	@JsonProperty("PrimeiroNome")
	@NotBlank(message = "O nome é obrigatório")
	@Schema(description = "Primeiro nome do cliente", example = "João", required = true)
	private String primeiroNome;

	@JsonProperty("UltimoNome")
	@NotBlank(message = "O sobrenome é obrigatório")
	@Schema(description = "Último nome do cliente", example = "Silva", required = true)
	private String ultimoNome;

	@JsonProperty("Usuario")
	@NotBlank(message = "O e-mail é obrigatório")
	@Email(message = "Formato de e-mail incorreto")
	@Schema(description = "E-mail do cliente (usado como usuário)", example = "joao.silva@email.com", required = true)
	private String usuario;

	@JsonProperty("Cidade")
	@NotBlank(message = "A cidade é obrigatória")
	@Schema(description = "Cidade onde o cliente reside", example = "São Paulo", required = true)
	private String cidade;

	@JsonProperty("Estado")
	@NotBlank(message = "O Estado é obrigatório")
	@Schema(description = "Estado onde o cliente reside", example = "SP", required = true)
	private String estado;

}
