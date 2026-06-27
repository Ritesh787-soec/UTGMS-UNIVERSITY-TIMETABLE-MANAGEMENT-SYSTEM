// src/main/java/com/college/timetable/dto/request/CreateUserRequest.java
package com.college.timetable.dto.request;


public class CreateUserRequest {
    private String name;
    private String email;
    private String password;
    private String role; // "ADMIN" / "COORDINATOR" / "FACULTY"

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return this.role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public CreateUserRequest() {
    }

    public CreateUserRequest(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}