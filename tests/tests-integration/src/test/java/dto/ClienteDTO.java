package dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClienteDTO {

	private long id;

	private String primeiroNome;

	private String ultimoNome;

	private String usuario;

	private String cidade;

	private String estado;

}
