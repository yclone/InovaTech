package br.com.InovaTech.InovaTech.test.helpers;

import br.com.InovaTech.InovaTech.model.entity.Cliente;


public class ClienteMockFactory {

    public static Cliente novoClientePauloJorge() {
        return definirPauloJorge().build();
    }

    public static Cliente clienteCadastradoPauloJorgeId9() {
        return definirPauloJorge().id(9).build();
    }

    public static Cliente novoClienteMrDevops() {
        return definirMrDevops().build();
    }

    public static Cliente clienteCadastradoMrDevopsId10() {
        return definirMrDevops().id(10).build();
    }

    private static Cliente.ClienteBuilder definirPauloJorge() {
        return Cliente.builder()
                .primeiroNome("Paulo")
                .ultimoNome("Jorge")
                .usuario("paulo.jorge@email.com.br")
                .cidade("São Paulo")
                .estado("SP");
    }

    private static Cliente.ClienteBuilder definirMrDevops() {
        return Cliente.builder()
                .primeiroNome("Mr")
                .ultimoNome("Devops")
                .usuario("mr.devops@email.com.br")
                .cidade("Rio de Janeiro")
                .estado("RJ");
    }
}
