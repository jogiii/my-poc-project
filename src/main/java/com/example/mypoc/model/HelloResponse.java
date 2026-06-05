package com.example.mypoc.model;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HelloResponse {

    private String message;
    private LocalDateTime timestamp;
    private String status;
}

