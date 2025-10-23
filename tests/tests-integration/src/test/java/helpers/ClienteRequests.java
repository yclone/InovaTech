package helpers;

import dto.ClienteDTO;
import java.util.UUID;


public class ClienteRequests {

    public static ClienteDTO clienteGenatare() {
        String uuid = UUID.randomUUID().toString();
        String usuarioAleatorio = uuid.replace("-", "").substring(0, 8).concat("@email.com");

        return ClienteDTO.builder()
                .primeiroNome("Paulo")
                .ultimoNome("Jorge")
                .usuario(usuarioAleatorio)
                .cidade("Sao Paulo")
                .estado("SP")
                .build();
    }
}
