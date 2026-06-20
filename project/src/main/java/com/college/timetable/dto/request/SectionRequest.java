// src/main/java/com/college/timetable/dto/request/SectionRequest.java
package com.college.timetable.dto.request;

import lombok.Data;

@Data
public class SectionRequest {
    private String name;
    private Integer studentStrength;
    private Long semesterId;
}