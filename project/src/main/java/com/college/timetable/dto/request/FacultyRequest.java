// src/main/java/com/college/timetable/dto/request/FacultyRequest.java
package com.college.timetable.dto.request;

import lombok.Data;

@Data
public class FacultyRequest {
    private String name;
    private String email;
    private String designation;
    private String workingDays;
    private Integer maxHoursPerWeek; // can be left null -> auto-filled by designation
}