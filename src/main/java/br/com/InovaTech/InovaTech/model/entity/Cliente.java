package br.com.InovaTech.InovaTech.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;


@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
public class Cliente {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	@NotBlank(message = "O nome é obrigatório")
	private String primeiroNome;

	@NotBlank(message = "O sobrenome é obrigatório")
	private String ultimoNome;

	@NotBlank(message = "O e-mail é obrigatório")
	@Email(message = "Formato de e-mail incorreto")
	private String usuario;

	@NotBlank(message = "A cidade é obrigatória")
	private String cidade;

	@NotBlank(message = "O Estado é obrigatório")
	private String estado;

}