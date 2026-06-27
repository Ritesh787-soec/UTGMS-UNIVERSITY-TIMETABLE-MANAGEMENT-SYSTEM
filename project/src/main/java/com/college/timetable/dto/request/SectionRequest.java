// src/main/java/com/college/timetable/dto/request/SectionRequest.java
package com.college.timetable.dto.request;


public class SectionRequest {
    private String name;
    private Integer studentStrength;
    private Long semesterId;

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getStudentStrength() {
        return this.studentStrength;
    }

    public void setStudentStrength(Integer studentStrength) {
        this.studentStrength = studentStrength;
    }

    public Long getSemesterId() {
        return this.semesterId;
    }

    public void setSemesterId(Long semesterId) {
        this.semesterId = semesterId;
    }

    public SectionRequest() {
    }

    public SectionRequest(String name, Integer studentStrength, Long semesterId) {
        this.name = name;
        this.studentStrength = studentStrength;
        this.semesterId = semesterId;
    }
}