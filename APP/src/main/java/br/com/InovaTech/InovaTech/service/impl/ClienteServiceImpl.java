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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository repository;
    private final MailingRepository mailingRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    private static final Logger log = LoggerFactory.getLogger(ClienteServiceImpl.class);

    @Autowired
    LoadProperties props;

    // 1. Adicionado Log no Construtor
    public ClienteServiceImpl(ClienteRepository repository, MailingRepository mailingRepository, 
                              PasswordEncoder passwordEncoder, ModelMapper modelMapper) {
        this.repository = repository;
        this.mailingRepository = mailingRepository;
        this.passwordEncoder = passwordEncoder;
        this.modelMapper = modelMapper;
        log.info("Inicializando ClienteServiceImpl..."); 
    }

    @Override
    public Cliente save(Cliente cliente) {
        // Log de rastreabilidade (DEBUG) - Entrada do método
        log.debug("Entrando no método save. Dados recebidos: usuario={}, nome={} {}", 
                cliente.getUsuario(), cliente.getPrimeiroNome(), cliente.getUltimoNome());

        log.info("Iniciando processo de criação de cliente: usuario={}", cliente.getUsuario());

        Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

        if (!validator.validate(cliente).isEmpty()) {
            log.warn("Validação falhou para criar cliente. Dados inválidos: usuario={}", cliente.getUsuario());
            throw new InternalErrorException("Cliente possui campos obrigatórios não preenchidos");
        }

        try {
            if (repository.existsByUsuario(cliente.getUsuario())){
                log.warn("Tentativa de cadastro duplicado: usuario={}", cliente.getUsuario());
                throw new BusinessException("Cliente já cadastrado!");
            }

            // Criptografia (Nunca logar a senha crua ou o hash, a menos que seja estritamente necessário para debug de baixo nível)
            log.debug("Criptografando senha para o usuário: {}", cliente.getUsuario());
            cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));
            
            Cliente clienteSalvo = repository.save(cliente);
            
            log.info("Cliente persistido com sucesso: id={}, usuario={}", clienteSalvo.getId(), clienteSalvo.getUsuario());

            try {
                mailingRepository.sendEmail(clienteSalvo.getUsuario());
                log.info("Email de boas-vindas enviado com sucesso para: {}", clienteSalvo.getUsuario());
            } catch (JsonProcessingException e) {
                // Log completo da stacktrace em caso de erro
                log.error("Falha ao serializar email para cliente: usuario={}, erro={}", 
                        clienteSalvo.getUsuario(), e.getMessage(), e);
                throw new BusinessException("erro ao enviar email!");
            }

            // Log de rastreabilidade (DEBUG) - Saída do método
            log.debug("Saindo do método save com sucesso. ID gerado: {}", clienteSalvo.getId());
            return clienteSalvo;

        } catch (DataAccessException e) {
            log.error("Erro crítico de banco de dados no método save: usuario={}, erro={}", 
                    cliente.getUsuario(), e.getMessage(), e);
            throw new InternalErrorException("Erro ao acessar o banco de dados", e);
        }
    }

    @Override
    public List<Cliente> getList() {
        log.debug("Entrando no método getList");

        try {
            List<Cliente> clientes = repository.findAll();
            log.info("Listagem de clientes realizada. Total encontrado: {}", clientes.size());
            
            log.debug("Saindo do método getList");
            return clientes;
        } catch (DataAccessException e) {
            log.error("Erro ao listar clientes: erro={}", e.getMessage(), e);
            throw new InternalErrorException("Erro ao acessar o banco de dados", e);
        }
    }

    @Override
    public Optional<Cliente> getById(long id){
        log.debug("Entrando no método getById. ID buscado: {}", id);

        try {
            Optional<Cliente> cliente = this.repository.findById(id);
            
            if (cliente.isPresent()) {
                log.info("Cliente encontrado: id={}, usuario={}", id, cliente.get().getUsuario());
            } else {
                log.warn("Cliente não encontrado na busca por ID: {}", id);
            }
            
            log.debug("Saindo do método getById. Encontrado: {}", cliente.isPresent());
            return cliente;
        } catch (DataAccessException e) {
            log.error("Erro ao buscar cliente por ID: id={}, erro={}", id, e.getMessage(), e);
            throw new InternalErrorException("Erro ao acessar o banco de dados", e);
        }
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        log.debug("Entrando no método login. Usuário informado: {}", loginRequest.getUsuario());
        log.info("Processando tentativa de login para: usuario={}", loginRequest.getUsuario());

        try {
            Optional<Cliente> clienteOpt = repository.findByUsuario(loginRequest.getUsuario());
            
            if (clienteOpt.isPresent()) {
                Cliente cliente = clienteOpt.get();
                
                // Verifica senha (NUNCA logar as senhas comparadas)
                if (passwordEncoder.matches(loginRequest.getSenha(), cliente.getSenha())) {
                    log.info("Autenticação bem-sucedida: usuario={}, id={}", cliente.getUsuario(), cliente.getId());
                    
                    ClienteDTO clienteDTO = modelMapper.map(cliente, ClienteDTO.class);
                    clienteDTO.setSenha(null);
                    
                    LoginResponseDTO response = LoginResponseDTO.builder()
                        .sucesso(true)
                        .mensagem("Login realizado com sucesso")
                        .cliente(clienteDTO)
                        .build();

                    log.debug("Saindo do método login com sucesso");
                    return response;
                } else {
                    log.warn("Falha de autenticação (Senha incorreta): usuario={}", loginRequest.getUsuario());
                }
            } else {
                log.warn("Falha de autenticação (Usuário não encontrado): usuario={}", loginRequest.getUsuario());
            }
            
            log.info("Login negado para usuario={}", loginRequest.getUsuario());
            
            return LoginResponseDTO.builder()
                .sucesso(false)
                .mensagem("Usuário ou senha incorretos")
                .cliente(null)
                .build();
                
        } catch (DataAccessException e) {
            log.error("Erro de banco de dados durante login: usuario={}, erro={}", 
                    loginRequest.getUsuario(), e.getMessage(), e);
            throw new InternalErrorException("Erro ao acessar o banco de dados", e);
        }
    }
}