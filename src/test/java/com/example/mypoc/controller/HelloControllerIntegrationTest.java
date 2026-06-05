package com.example.mypoc.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class HelloControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String baseUrl() {
        return "http://localhost:" + port;
    }

    @Test
    void getHello_shouldReturn200() {
        ResponseEntity<Map> response = restTemplate.getForEntity(
                baseUrl() + "/api/v1/hello", Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsKey("message");
        assertThat(response.getBody()).containsKey("timestamp");
        assertThat(response.getBody()).containsKey("status");
        assertThat(response.getBody().get("status")).isEqualTo("SUCCESS");
    }

    @Test
    void getHelloWithName_shouldReturnPersonalizedMessage() {
        ResponseEntity<Map> response = restTemplate.getForEntity(
                baseUrl() + "/api/v1/hello/Alice", Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().get("message").toString())
                .contains("Alice");
    }

    @Test
    void getHealth_shouldReturnUp() {
        ResponseEntity<String> response = restTemplate.getForEntity(
                baseUrl() + "/api/v1/health", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("UP");
    }

    @Test
    void actuatorHealth_shouldReturnUp() {
        ResponseEntity<Map> response = restTemplate.getForEntity(
                baseUrl() + "/actuator/health", Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().get("status")).isEqualTo("UP");
    }
}

