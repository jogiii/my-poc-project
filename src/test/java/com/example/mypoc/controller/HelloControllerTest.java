package com.example.mypoc.controller;

import com.example.mypoc.model.HelloResponse;
import com.example.mypoc.service.HelloService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(HelloController.class)
class HelloControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HelloService helloService;

    @Test
    @WithMockUser
    void getHello_shouldReturn200WithMessage() throws Exception {
        HelloResponse mockResponse = HelloResponse.builder()
                .message("Hello from Spring Boot 3.5 with Java 21!")
                .timestamp(LocalDateTime.now())
                .status("SUCCESS")
                .build();

        when(helloService.getHelloMessage()).thenReturn(mockResponse);

        mockMvc.perform(get("/api/v1/hello")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Hello from Spring Boot 3.5 with Java 21!"))
                .andExpect(jsonPath("$.status").value("SUCCESS"));
    }

    @Test
    @WithMockUser
    void getHelloWithName_shouldReturn200WithPersonalizedMessage() throws Exception {
        HelloResponse mockResponse = HelloResponse.builder()
                .message("Hello, John! Welcome to Spring Boot 3.5 with Java 21!")
                .timestamp(LocalDateTime.now())
                .status("SUCCESS")
                .build();

        when(helloService.getHelloMessageForName("John")).thenReturn(mockResponse);

        mockMvc.perform(get("/api/v1/hello/John")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Hello, John! Welcome to Spring Boot 3.5 with Java 21!"))
                .andExpect(jsonPath("$.status").value("SUCCESS"));
    }

    @Test
    @WithMockUser
    void getHealth_shouldReturn200() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("UP"));
    }
}

