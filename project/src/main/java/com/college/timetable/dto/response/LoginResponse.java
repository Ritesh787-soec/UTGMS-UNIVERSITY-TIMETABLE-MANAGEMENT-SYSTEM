// src/main/java/com/college/timetable/dto/response/LoginResponse.java
package com.college.timetable.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String role;
    private String name;
}