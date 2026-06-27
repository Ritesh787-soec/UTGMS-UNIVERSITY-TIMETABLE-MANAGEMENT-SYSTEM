// src/main/java/com/college/timetable/dto/request/ProgramRequest.java
package com.college.timetable.dto.request;


public class ProgramRequest {
    private String name;
    private Long departmentId;

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getDepartmentId() {
        return this.departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public ProgramRequest() {
    }

    public ProgramRequest(String name, Long departmentId) {
        this.name = name;
        this.departmentId = departmentId;
    }
}