// src/main/java/com/college/timetable/dto/request/LoginRequest.java
package com.college.timetable.dto.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}