package br.com.InovaTech.InovaTech.service;

import java.util.List;
import java.util.Optional;

import br.com.InovaTech.InovaTech.model.entity.Cliente;
import br.com.InovaTech.InovaTech.model.dto.LoginRequestDTO;
import br.com.InovaTech.InovaTech.model.dto.LoginResponseDTO;

public interface ClienteService {

	Cliente save(Cliente any);

	List <Cliente> getList();

	Optional <Cliente> getById(long id);

	LoginResponseDTO login(LoginRequestDTO loginRequest);
}
