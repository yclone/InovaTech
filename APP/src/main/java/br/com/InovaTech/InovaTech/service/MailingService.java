package br.com.InovaTech.InovaTech.service;

import br.com.InovaTech.InovaTech.model.dto.MailingRequestDTO;
import br.com.InovaTech.InovaTech.model.dto.ResponseEmailDTO;

public interface MailingService {
    
    ResponseEmailDTO sendEmail(MailingRequestDTO mailingRequest);
}