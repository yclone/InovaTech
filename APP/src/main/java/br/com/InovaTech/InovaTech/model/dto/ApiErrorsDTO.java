package br.com.InovaTech.InovaTech.model.dto;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.validation.BindingResult;

public class ApiErrorsDTO {
	private List<String> errors;

	public ApiErrorsDTO(BindingResult result) {
		this.errors = new ArrayList<>();
		result.getAllErrors().forEach(error -> 
				this.errors.add(error.getDefaultMessage()));
	}

	public ApiErrorsDTO(RuntimeException ex) {
		this.errors = Arrays.asList(ex.getMessage());
	}

	public List<String> getErrors() {
		return errors;
	}
}
