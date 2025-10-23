package br.com.InovaTech.InovaTech.repository;

import com.fasterxml.jackson.core.JsonProcessingException;

import br.com.InovaTech.InovaTech.model.dto.ResponseEmailDTO;

public interface MailingRepository {

    ResponseEmailDTO sendEmail(String email) throws JsonProcessingException;

}
