package com.example.mypoc.service;

import com.example.mypoc.model.HelloResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class HelloService {

    public HelloResponse getHelloMessage() {
        return HelloResponse.builder()
                .message("Hello from Spring Boot 4.0 with Java 21!")
                .timestamp(LocalDateTime.now())
                .status("SUCCESS")
                .build();
    }

    public HelloResponse getHelloMessageForName(String name) {
        return HelloResponse.builder()
                .message("Hello, " + name + "! Welcome to Spring Boot 4.0 with Java 21!")
                .timestamp(LocalDateTime.now())
                .status("SUCCESS")
                .build();
    }
}


