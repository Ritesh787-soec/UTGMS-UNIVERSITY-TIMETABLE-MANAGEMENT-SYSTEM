// src/main/java/com/college/timetable/dto/WorkloadDto.java
package com.college.timetable.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WorkloadDto {
    private String facultyName;
    private String designation;
    private long assignedHours;
    private int maxHours;
    private double utilizationPercent;
}