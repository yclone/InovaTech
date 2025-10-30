package br.com.InovaTech.InovaTech.service.impl;

import br.com.InovaTech.InovaTech.exceptions.InternalErrorException;
import br.com.InovaTech.InovaTech.model.dto.MailingRequestDTO;
import br.com.InovaTech.InovaTech.model.dto.ResponseEmailDTO;
import br.com.InovaTech.InovaTech.repository.ClienteRepository;
import br.com.InovaTech.InovaTech.repository.MailingRepository;
import br.com.InovaTech.InovaTech.service.MailingService;

import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;

@Service
public class MailingServiceImpl implements MailingService {

    private ClienteRepository clienteRepository;
    private MailingRepository mailingRepository;

    public MailingServiceImpl(ClienteRepository clienteRepository, MailingRepository mailingRepository) {
        this.clienteRepository = clienteRepository;
        this.mailingRepository = mailingRepository;
    }

    @Override
    public ResponseEmailDTO sendEmail(MailingRequestDTO mailingRequest) {
        try {
            // Verifica se o email existe na base de dados
            boolean emailExists = clienteRepository.existsByUsuario(mailingRequest.getEmail());
            
            if (emailExists) {
                // Email existe na base, tenta enviar
                try {
                    mailingRepository.sendEmail(mailingRequest.getEmail());
                    return ResponseEmailDTO.builder()
                        .sucesso(true)
                        .mensagem("Email enviado com sucesso!")
                        .build();
                } catch (JsonProcessingException e) {
                    return ResponseEmailDTO.builder()
                        .sucesso(false)
                        .mensagem("Falha ao enviar o Email")
                        .build();
                }
            } else {
                // Email não existe na base de dados
                return ResponseEmailDTO.builder()
                    .sucesso(false)
                    .mensagem("Falha ao enviar o Email")
                    .build();
            }
            
        } catch (DataAccessException e) {
            throw new InternalErrorException("Erro ao acessar o banco de dados", e);
        }
    }
}