package br.com.InovaTech.InovaTech.test.helpers;



import java.util.UUID;

import br.com.InovaTech.InovaTech.model.dto.ClienteDTO;

public class ClienteDtoMockFactory {

    public static ClienteDTO novoClientePauloJorge() {

        return definirPauloJorge().build();
    }

    public static ClienteDTO clienteCadastradoPauloJorgeId9() {

        return definirPauloJorge().id(9).build();
    }

    public static ClienteDTO novoClienteMrDevops() {

        return definirMrDevops().build();
    }

    public static ClienteDTO clienteCadastradoMrDevopsId10() {

        return definirMrDevops().id(10).build();
    }

    private static ClienteDTO.ClienteDTOBuilder definirPauloJorge() {
        return ClienteDTO.builder()
                .primeiroNome("Paulo")
                .ultimoNome("Jorge")
                .usuario("paulo.jorge@email.com.br")
                .cidade("São Paulo")
                .estado("SP");
    }

    private static ClienteDTO.ClienteDTOBuilder definirMrDevops() {
        return ClienteDTO.builder()
                .primeiroNome("Mr")
                .ultimoNome("Devops")
                .usuario("mr.devops@email.com.br")
                .cidade("Rio de Janeiro")
                .estado("RJ");
    }
}
