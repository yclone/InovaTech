package br.com.InovaTech.InovaTech.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.com.InovaTech.InovaTech.model.entity.Cliente;
import br.com.InovaTech.InovaTech.model.dto.LoginRequestDTO;
import br.com.InovaTech.InovaTech.model.dto.LoginResponseDTO;

public interface ClienteService {

	Cliente save(Cliente any);

	List <Cliente> getList();

	Page <Cliente> getList(Pageable pageable, String cidade, String estado);

	Optional <Cliente> getById(long id);

	Cliente update(long id, Cliente cliente);

	Cliente partialUpdate(long id, Cliente cliente);

	void delete(long id);

	LoginResponseDTO login(LoginRequestDTO loginRequest);
}
