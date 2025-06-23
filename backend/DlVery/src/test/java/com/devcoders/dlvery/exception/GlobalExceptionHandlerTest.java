package com.devcoders.dlvery.exception;

import com.devcoders.dlvery.dto.ErrorDetails;
import com.devcoders.dlvery.dto.ValidationErrorDetails;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.WebRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class GlobalExceptionHandlerTest {

    @Mock
    private WebRequest webRequest;

    @Mock
    private MethodArgumentNotValidException methodArgumentNotValidException;

    @Mock
    private BindingResult bindingResult;

    @InjectMocks
    private GlobalExceptionHandler globalExceptionHandler;

    @BeforeEach
    void setUp() {
        when(webRequest.getDescription(false)).thenReturn("uri=/api/test");
    }

    @Test
    @DisplayName("Test handling ResourceNotFoundException")
    void testHandleResourceNotFoundException() {
        // Given
        ResourceNotFoundException exception = new ResourceNotFoundException("User", "id", "1");

        // When
        ResponseEntity<ErrorDetails> response = globalExceptionHandler.handleResourceNotFoundException(exception, webRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).contains("User not found with id : '1'");
        assertThat(response.getBody().getPath()).isEqualTo("uri=/api/test");
    }

    @Test
    @DisplayName("Test handling BadCredentialsException")
    void testHandleBadCredentialsException() {
        // Given
        BadCredentialsException exception = new BadCredentialsException("Invalid username or password");

        // When
        ResponseEntity<ErrorDetails> response = globalExceptionHandler.handleBadCredentialsException(exception, webRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isEqualTo("Invalid username or password");
        assertThat(response.getBody().getPath()).isEqualTo("uri=/api/test");
    }

    @Test
    @DisplayName("Test handling AccessDeniedException")
    void testHandleAccessDeniedException() {
        // Given
        AccessDeniedException exception = new AccessDeniedException("Access denied");

        // When
        ResponseEntity<ErrorDetails> response = globalExceptionHandler.handleAccessDeniedException(exception, webRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isEqualTo("Access denied");
        assertThat(response.getBody().getPath()).isEqualTo("uri=/api/test");
    }

    @Test
    @DisplayName("Test handling generic Exception")
    void testHandleGlobalException() {
        // Given
        Exception exception = new Exception("Something went wrong");

        // When
        ResponseEntity<ErrorDetails> response = globalExceptionHandler.handleGlobalException(exception, webRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isEqualTo("Something went wrong");
        assertThat(response.getBody().getPath()).isEqualTo("uri=/api/test");
    }

    @Test
    @DisplayName("Test handling MethodArgumentNotValidException")
    void testHandleMethodArgumentNotValidException() {
        // Given
        List<FieldError> fieldErrors = new ArrayList<>();
        fieldErrors.add(new FieldError("user", "username", "Username cannot be empty"));
        fieldErrors.add(new FieldError("user", "email", "Email must be valid"));

        when(methodArgumentNotValidException.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getAllErrors()).thenReturn(new ArrayList<>(fieldErrors));

        // When
        ResponseEntity<Object> response = globalExceptionHandler.handleMethodArgumentNotValid(
                methodArgumentNotValidException, null, HttpStatus.BAD_REQUEST, webRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).isInstanceOf(ValidationErrorDetails.class);
        
        ValidationErrorDetails errorDetails = (ValidationErrorDetails) response.getBody();
        assertThat(errorDetails.getMessage()).isEqualTo("Validation failed");
        assertThat(errorDetails.getPath()).isEqualTo("uri=/api/test");

        Map<String, String> errors = errorDetails.getErrors();
        assertThat(errors).hasSize(2);
        assertThat(errors).containsEntry("username", "Username cannot be empty");
        assertThat(errors).containsEntry("email", "Email must be valid");
    }
}