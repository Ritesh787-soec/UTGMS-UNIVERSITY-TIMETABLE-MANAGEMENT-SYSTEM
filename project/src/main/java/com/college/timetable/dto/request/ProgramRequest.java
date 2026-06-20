// src/main/java/com/college/timetable/dto/request/ProgramRequest.java
package com.college.timetable.dto.request;

import lombok.Data;

@Data
public class ProgramRequest {
    private String name;
    private Long departmentId;
}