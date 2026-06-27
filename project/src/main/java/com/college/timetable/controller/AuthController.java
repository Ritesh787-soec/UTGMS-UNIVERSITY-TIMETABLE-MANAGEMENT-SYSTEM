// src/main/java/com/college/timetable/controller/AuthController.java
package com.college.timetable.controller;

import com.college.timetable.dto.request.LoginRequest;
import com.college.timetable.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController

@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        // Wrapped with ResponseEntity<Object> to align with the service placeholder
        // return type seamlessly
        return ResponseEntity.ok(authService.login(request));
    }

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
}