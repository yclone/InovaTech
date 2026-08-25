package br.com.InovaTech.InovaTech.test.unitTest;

import com.fasterxml.jackson.core.JsonProcessingException;

import br.com.InovaTech.InovaTech.model.entity.Cliente;
import br.com.InovaTech.InovaTech.repository.MailingRepository;
import br.com.InovaTech.InovaTech.repository.ClienteRepository;
import br.com.InovaTech.InovaTech.service.impl.ClienteServiceImpl;
import br.com.InovaTech.InovaTech.exceptions.BusinessException;
import br.com.InovaTech.InovaTech.exceptions.InternalErrorException;
import br.com.InovaTech.InovaTech.exceptions.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import br.com.InovaTech.InovaTech.test.helpers.ClienteMockFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.modelmapper.ModelMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.BDDMockito;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.catchThrowable;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.doThrow;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    ClienteServiceImpl service;

    @Mock
    ClienteRepository repository;

    @Mock
    MailingRepository mailingRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    ModelMapper modelMapper;

    @BeforeEach
    public void setUp() {
        this.service = new ClienteServiceImpl(repository, mailingRepository, passwordEncoder, modelMapper);
    }

    @Test
    @DisplayName("Deve atualizar todos os campos do cliente e re-criptografar a senha")
    void deveAtualizarClienteComSucesso() {
        Cliente clienteExistente = ClienteMockFactory.clienteCadastradoPauloJorgeId9();
        clienteExistente.setSenha("hashAntigo");

        Cliente novosDados = ClienteMockFactory.novoClienteMrDevops();
        novosDados.setSenha("novaSenha");

        when(repository.findById(9L)).thenReturn(Optional.of(clienteExistente));
        when(passwordEncoder.encode("novaSenha")).thenReturn("novoHash");
        when(repository.save(clienteExistente)).thenReturn(clienteExistente);

        Cliente atualizado = service.update(9L, novosDados);

        assertEquals("Mr", atualizado.getPrimeiroNome());
        assertEquals("Devops", atualizado.getUltimoNome());
        assertEquals("mr.devops@email.com.br", atualizado.getUsuario());
        assertEquals("Rio de Janeiro", atualizado.getCidade());
        assertEquals("RJ", atualizado.getEstado());
        assertEquals("novoHash", atualizado.getSenha());
        verify(repository, times(1)).save(clienteExistente);
    }

    @Test
    @DisplayName("Não deve alterar a senha na atualização quando ela não for informada")
    void deveManterSenhaQuandoNaoInformadaNoUpdate() {
        Cliente clienteExistente = ClienteMockFactory.clienteCadastradoPauloJorgeId9();
        clienteExistente.setSenha("hashAntigo");

        Cliente novosDados = ClienteMockFactory.novoClienteMrDevops();

        when(repository.findById(9L)).thenReturn(Optional.of(clienteExistente));
        when(repository.save(clienteExistente)).thenReturn(clienteExistente);

        Cliente atualizado = service.update(9L, novosDados);

        assertEquals("hashAntigo", atualizado.getSenha());
        verify(passwordEncoder, never()).encode(Mockito.anyString());
    }

    @Test
    @DisplayName("Deve lançar NotFoundException ao atualizar cliente inexistente")
    void deveFalharAoAtualizarClienteInexistente() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        Throwable erro = catchThrowable(() -> service.update(99L, ClienteMockFactory.novoClienteMrDevops()));

        assertThat(erro).isInstanceOf(NotFoundException.class).hasMessage("Cliente não encontrado!");
        verify(repository, never()).save(Mockito.any(Cliente.class));
    }

    @Test
    @DisplayName("Deve atualizar apenas os campos informados na atualização parcial")
    void deveAtualizarParcialmenteApenasCamposInformados() {
        Cliente clienteExistente = ClienteMockFactory.clienteCadastradoPauloJorgeId9();
        clienteExistente.setSenha("hashAntigo");

        Cliente parcial = Cliente.builder().cidade("Campinas").build();

        when(repository.findById(9L)).thenReturn(Optional.of(clienteExistente));
        when(repository.save(clienteExistente)).thenReturn(clienteExistente);

        Cliente atualizado = service.partialUpdate(9L, parcial);

        assertEquals("Campinas", atualizado.getCidade());
        assertEquals("Paulo", atualizado.getPrimeiroNome());
        assertEquals("SP", atualizado.getEstado());
        assertEquals("hashAntigo", atualizado.getSenha());
        verify(passwordEncoder, never()).encode(Mockito.anyString());
    }

    @Test
    @DisplayName("Deve re-criptografar a senha na atualização parcial quando enviada")
    void deveRecriptografarSenhaNoPartialUpdate() {
        Cliente clienteExistente = ClienteMockFactory.clienteCadastradoPauloJorgeId9();
        clienteExistente.setSenha("hashAntigo");

        Cliente parcial = Cliente.builder().senha("outraSenha").build();

        when(repository.findById(9L)).thenReturn(Optional.of(clienteExistente));
        when(passwordEncoder.encode("outraSenha")).thenReturn("hashNovo");
        when(repository.save(clienteExistente)).thenReturn(clienteExistente);

        Cliente atualizado = service.partialUpdate(9L, parcial);

        assertEquals("hashNovo", atualizado.getSenha());
    }

    @Test
    @DisplayName("Deve lançar NotFoundException na atualização parcial de cliente inexistente")
    void deveFalharAoAtualizarParcialmenteClienteInexistente() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        Throwable erro = catchThrowable(() -> service.partialUpdate(99L, ClienteMockFactory.novoClienteMrDevops()));

        assertThat(erro).isInstanceOf(NotFoundException.class);
    }

    @Test
    @DisplayName("Deve excluir cliente existente")
    void deveExcluirCliente() {
        Cliente clienteExistente = ClienteMockFactory.clienteCadastradoPauloJorgeId9();
        when(repository.findById(9L)).thenReturn(Optional.of(clienteExistente));

        service.delete(9L);

        verify(repository, times(1)).delete(clienteExistente);
    }

    @Test
    @DisplayName("Deve lançar NotFoundException ao excluir cliente inexistente")
    void deveFalharAoExcluirClienteInexistente() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        Throwable erro = catchThrowable(() -> service.delete(99L));

        assertThat(erro).isInstanceOf(NotFoundException.class);
        verify(repository, never()).delete(Mockito.any(Cliente.class));
    }

    @Test
    @DisplayName("Deve listar clientes paginados sem filtros usando findAll")
    void deveListarPaginadoSemFiltros() {
        Pageable pageable = PageRequest.of(0, 10);
        List<Cliente> clientes = Arrays.asList(ClienteMockFactory.clienteCadastradoPauloJorgeId9(),
                ClienteMockFactory.clienteCadastradoMrDevopsId10());
        when(repository.findAll(pageable)).thenReturn(new PageImpl<>(clientes, pageable, clientes.size()));

        Page<Cliente> pagina = service.getList(pageable, null, null);

        assertEquals(2, pagina.getTotalElements());
        assertEquals(0, pagina.getNumber());
        verify(repository, never()).findByCidadeContainingIgnoreCaseAndEstadoContainingIgnoreCase(
                Mockito.anyString(), Mockito.anyString(), Mockito.any(Pageable.class));
    }

    @Test
    @DisplayName("Deve listar clientes paginados aplicando filtros de cidade e estado")
    void deveListarPaginadoComFiltros() {
        Pageable pageable = PageRequest.of(0, 5);
        List<Cliente> clientes = List.of(ClienteMockFactory.clienteCadastradoMrDevopsId10());
        when(repository.findByCidadeContainingIgnoreCaseAndEstadoContainingIgnoreCase("Rio", "", pageable))
                .thenReturn(new PageImpl<>(clientes, pageable, clientes.size()));

        Page<Cliente> pagina = service.getList(pageable, "Rio", null);

        assertEquals(1, pagina.getTotalElements());
        assertEquals("Rio de Janeiro", pagina.getContent().get(0).getCidade());
        verify(repository, never()).findAll(Mockito.any(Pageable.class));
    }
}
