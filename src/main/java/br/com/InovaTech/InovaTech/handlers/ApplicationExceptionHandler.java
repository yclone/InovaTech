package br.com.InovaTech.InovaTech.handlers;

import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import br.com.InovaTech.InovaTech.exceptions.BusinessException;
import br.com.InovaTech.InovaTech.exceptions.InternalErrorException;
import br.com.InovaTech.InovaTech.model.dto.ApiErrorsDTO;

@RestControllerAdvice
public class ApplicationExceptionHandler {

    @InitBinder("businessException")
    protected void initBusinessExceptionBinder(WebDataBinder binder) {
        binder.setAllowedFields("detailMessage");
    }

    @InitBinder("internalErrorException")
    protected void initInternalErrorExceptionBinder(WebDataBinder binder) {
        binder.setAllowedFields("detailMessage");
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiErrorsDTO methodArgumentNotValidExceptionHandler(MethodArgumentNotValidException ex) {
        BindingResult result = ex.getBindingResult();
        return new ApiErrorsDTO(result);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BusinessException.class)
    public ApiErrorsDTO businessExceptionHandler(BusinessException businessException) {
        return new ApiErrorsDTO(businessException);
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(InternalErrorException.class)
    public ApiErrorsDTO internalErrorExceptionHandler(InternalErrorException internalErrorException) {
        return new ApiErrorsDTO(internalErrorException);
    }
}
