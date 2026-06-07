package com.example.mypoc.controller;

import com.example.mypoc.model.HelloResponse;
import com.example.mypoc.service.HelloService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HelloControllerTest {

    @Mock
    private HelloService helloService;

    @InjectMocks
    private HelloController helloController;

    @Test
    void getHello_shouldReturn200WithMessage() {
        HelloResponse mockResponse = HelloResponse.builder()
                .message("Hello from Spring Boot!")
                .timestamp(LocalDateTime.now())
                .status("SUCCESS")
                .build();

        when(helloService.getHelloMessage()).thenReturn(mockResponse);

        ResponseEntity<HelloResponse> response = helloController.hello();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isEqualTo("Hello from Spring Boot!");
        assertThat(response.getBody().getStatus()).isEqualTo("SUCCESS");
    }

    @Test
    void getHelloWithName_shouldReturn200WithPersonalizedMessage() {
        HelloResponse mockResponse = HelloResponse.builder()
                .message("Hello, John!")
                .timestamp(LocalDateTime.now())
                .status("SUCCESS")
                .build();

        when(helloService.getHelloMessageForName("John")).thenReturn(mockResponse);

        ResponseEntity<HelloResponse> response = helloController.helloName("John");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).contains("John");
    }

    @Test
    void getHealth_shouldReturnUp() {
        ResponseEntity<String> response = helloController.health();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("UP");
    }
}
