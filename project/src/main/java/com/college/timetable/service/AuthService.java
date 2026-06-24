package com.college.timetable.service;

import org.springframework.stereotype.Service;
import com.college.timetable.dto.request.LoginRequest;

@Service
public class AuthService {
    public String login(LoginRequest request) {
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token_for_testing";
    } // Return your LoginResponse DTO structure here

    public Object register(Object registerRequest) {
        return registerRequest;
    }
}