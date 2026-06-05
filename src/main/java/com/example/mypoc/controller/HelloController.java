package com.example.mypoc.controller;

import com.example.mypoc.model.HelloResponse;
import com.example.mypoc.service.HelloService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class HelloController {

    private final HelloService helloService;

    @GetMapping("/hello")
    public ResponseEntity<HelloResponse> hello() {
        return ResponseEntity.ok(helloService.getHelloMessage());
    }

    @GetMapping("/hello/{name}")
    public ResponseEntity<HelloResponse> helloName(@PathVariable String name) {
        return ResponseEntity.ok(helloService.getHelloMessageForName(name));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("UP");
    }
}

