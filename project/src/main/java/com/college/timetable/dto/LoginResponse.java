// src/main/java/com/college/timetable/dto/LoginResponse.java
package com.college.timetable.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String role;
    private String name;
}