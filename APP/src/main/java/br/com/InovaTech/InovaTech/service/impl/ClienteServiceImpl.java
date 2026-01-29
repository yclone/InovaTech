package br.com.InovaTech.InovaTech.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;

import br.com.InovaTech.InovaTech.exceptions.BusinessException;
import br.com.InovaTech.InovaTech.exceptions.InternalErrorException;
import br.com.InovaTech.InovaTech.helpers.LoadProperties;
import br.com.InovaTech.InovaTech.model.entity.Cliente;
import br.com.InovaTech.InovaTech.model.dto.ClienteDTO;
import br.com.InovaTech.InovaTech.model.dto.LoginRequestDTO;
import br.com.InovaTech.InovaTech.model.dto.LoginResponseDTO;
import br.com.InovaTech.InovaTech.repository.ClienteRepository;
import br.com.InovaTech.InovaTech.repository.MailingRepository;
import br.com.InovaTech.InovaTech.service.ClienteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteServiceImpl implements ClienteService {

	private ClienteRepository repository;
	private MailingRepository mailingRepository;
	private PasswordEncoder passwordEncoder;
	private ModelMapper modelMapper;
	
	@Autowired
	LoadProperties props;

	public ClienteServiceImpl(ClienteRepository repository, MailingRepository mailingRepository, 
	                         PasswordEncoder passwordEncoder, ModelMapper modelMapper) {
			this.repository = repository;
			this.mailingRepository = mailingRepository;
			this.passwordEncoder = passwordEncoder;
			this.modelMapper = modelMapper;
	}



	@Override
	public Cliente save(Cliente cliente) {
		Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

		if(validator.validate(cliente).isEmpty() == false) {
			throw new InternalErrorException("Cliente possui campos obrigatórios não preenchidos");
		}
		try {
			if (repository.existsByUsuario(cliente.getUsuario())){
				throw new BusinessException("Cliente já cadastrado!");
			}
			// Criptografa a senha antes de salvar
			cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));
			Cliente clienteSalvo = repository.save(cliente);
			try {
				mailingRepository.sendEmail(clienteSalvo.getUsuario());
			} catch (JsonProcessingException e) {
				throw new BusinessException("erro ao enviar email!");
			}
			return clienteSalvo;
		} catch (DataAccessException e) {
			System.out.println(e);
			throw new InternalErrorException("Erro ao acessar o banco de dados", e);
		}
	}

	@Override
	public List<Cliente> getList() {
		try {
			return repository.findAll();
		} catch (DataAccessException e) {
			throw new InternalErrorException("Erro ao acessar o banco de dados", e);
		}
	}

	@Override
	public Optional<Cliente> getById(long id){
		try {
			return this.repository.findById(id);
		} catch (DataAccessException e) {
			throw new InternalErrorException("Erro ao acessar o banco de dados", e);
		}
	}

	@Override
	public LoginResponseDTO login(LoginRequestDTO loginRequest) {
		try {
			Optional<Cliente> clienteOpt = repository.findByUsuario(loginRequest.getUsuario());
			
			if (clienteOpt.isPresent()) {
				Cliente cliente = clienteOpt.get();
				
				// Verifica se a senha está correta
				if (passwordEncoder.matches(loginRequest.getSenha(), cliente.getSenha())) {
					// Login bem-sucedido
					ClienteDTO clienteDTO = modelMapper.map(cliente, ClienteDTO.class);
					// Remove a senha do DTO de resposta por segurança
					clienteDTO.setSenha(null);
					
					return LoginResponseDTO.builder()
						.sucesso(true)
						.mensagem("Login realizado com sucesso")
						.cliente(clienteDTO)
						.build();
				}
			}
			
			// Login falhado
			return LoginResponseDTO.builder()
				.sucesso(false)
				.mensagem("Usuário ou senha incorretos")
				.cliente(null)
				.build();
				
		} catch (DataAccessException e) {
			throw new InternalErrorException("Erro ao acessar o banco de dados", e);
		}
	}}