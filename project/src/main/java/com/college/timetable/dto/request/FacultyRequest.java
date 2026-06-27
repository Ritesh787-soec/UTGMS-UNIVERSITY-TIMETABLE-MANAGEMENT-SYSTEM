// src/main/java/com/college/timetable/dto/request/FacultyRequest.java
package com.college.timetable.dto.request;


public class FacultyRequest {
    private String name;
    private String email;
    private String designation;
    private String workingDays;
    private Integer maxHoursPerWeek; // can be left null -> auto-filled by designation

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

    public String getDesignation() {
        return this.designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getWorkingDays() {
        return this.workingDays;
    }

    public void setWorkingDays(String workingDays) {
        this.workingDays = workingDays;
    }

    public Integer getMaxHoursPerWeek() {
        return this.maxHoursPerWeek;
    }

    public void setMaxHoursPerWeek(Integer maxHoursPerWeek) {
        this.maxHoursPerWeek = maxHoursPerWeek;
    }

    public FacultyRequest() {
    }

    public FacultyRequest(String name, String email, String designation, String workingDays, Integer maxHoursPerWeek) {
        this.name = name;
        this.email = email;
        this.designation = designation;
        this.workingDays = workingDays;
        this.maxHoursPerWeek = maxHoursPerWeek;
    }
}