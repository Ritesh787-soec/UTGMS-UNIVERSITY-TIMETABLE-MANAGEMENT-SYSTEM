// src/main/java/com/college/timetable/dto/request/DepartmentRequest.java
package com.college.timetable.dto.request;


public class DepartmentRequest {
    private String name;

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DepartmentRequest() {
    }

    public DepartmentRequest(String name) {
        this.name = name;
    }
}