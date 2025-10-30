package br.com.InovaTech.InovaTech.test.unitTest;

import com.fasterxml.jackson.core.JsonProcessingException;

import br.com.InovaTech.InovaTech.model.entity.Cliente;
import br.com.InovaTech.InovaTech.repository.MailingRepository;
import br.com.InovaTech.InovaTech.repository.ClienteRepository;
import br.com.InovaTech.InovaTech.service.impl.ClienteServiceImpl;
import br.com.InovaTech.InovaTech.exceptions.BusinessException;
import br.com.InovaTech.InovaTech.exceptions.InternalErrorException;
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


}
