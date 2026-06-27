// src/main/java/com/college/timetable/dto/response/LoginResponse.java
package com.college.timetable.dto.response;



public class LoginResponse {
    private String token;
    private String role;
    private String name;

    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return this.role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LoginResponse() {
    }

    public LoginResponse(String token, String role, String name) {
        this.token = token;
        this.role = role;
        this.name = name;
    }
}