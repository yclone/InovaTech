package br.com.InovaTech.InovaTech.repository.impl;

import br.com.InovaTech.InovaTech.helpers.LoadProperties;
import br.com.InovaTech.InovaTech.model.dto.ResponseEmailDTO;
import br.com.InovaTech.InovaTech.repository.MailingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class MailingRepositoryImpl implements MailingRepository {

    @Autowired
    LoadProperties props;

    public MailingRepositoryImpl() {
    }

    @Override
    public ResponseEmailDTO sendEmail(String email) {
        // Mock implementation - simula envio de email com sucesso
        System.out.println("✅ Simulando envio de email para: " + email);
        
        return ResponseEmailDTO.builder()
                .response("Email enviado com sucesso para: " + email)
                .build();
    }
}
