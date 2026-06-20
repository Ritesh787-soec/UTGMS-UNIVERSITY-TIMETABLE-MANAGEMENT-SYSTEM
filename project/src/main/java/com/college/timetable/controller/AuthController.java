// src/main/java/com/college/timetable/controller/AuthController.java
package com.college.timetable.controller;

import com.college.timetable.dto.request.LoginRequest;
import com.college.timetable.dto.response.LoginResponse;
import com.college.timetable.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}