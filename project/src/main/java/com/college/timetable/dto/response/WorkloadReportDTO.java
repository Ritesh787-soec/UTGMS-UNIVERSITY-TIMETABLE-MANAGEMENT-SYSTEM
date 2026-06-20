// src/main/java/com/college/timetable/dto/response/WorkloadReportDTO.java
package com.college.timetable.dto.response;

import lombok.Data;

@Data
public class WorkloadReportDTO {
    private String facultyName;
    private String designation;
    private int assignedHours;
    private int maxHours;
    private double utilizationPercent;
}