// src/main/java/com/college/timetable/dto/request/CreateUserRequest.java
package com.college.timetable.dto.request;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String name;
    private String email;
    private String password;
    private String role; // "ADMIN" / "COORDINATOR" / "FACULTY"
}