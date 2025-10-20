package br.com.InovaTech.InovaTech.helpers;

import io.cucumber.messages.internal.com.google.common.io.Resources;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class PrintGoldenTiket {

    public static void printGoldenTicket() {

        String text;
        try {
            text = Resources.toString(Resources.getResource("golden_ticket.txt"), StandardCharsets.UTF_8);
        } catch (Exception e) {
            System.out.println("Erro ao carregar o txt");
            return;
        }

        System.out.println(text);
        byte[] decodedBytes = Base64.getDecoder().decode("MjAyMk1C");
        String decodedString = new String(decodedBytes);

        String racf = System.getProperty("user.name");
        StringBuilder sb = new StringBuilder();
        char[] letters = racf.toCharArray();
        for (char ch : letters) {
            sb.append(String.format("%03d", (int)ch));
        }

        String ticket = decodedString + sb;
        System.out.println("#                                          "+ String.format("%-60s", ticket) + "                #");
        System.out.println("########################################################################################################################");
        System.out.println(System.lineSeparator() + "Agora so falta confirmar sua inscricao. Copie o ID do seu ticket acima e informe no forms:");
    }
}
