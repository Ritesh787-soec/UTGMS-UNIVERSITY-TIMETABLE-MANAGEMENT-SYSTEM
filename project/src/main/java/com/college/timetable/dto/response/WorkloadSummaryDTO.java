// src/main/java/com/college/timetable/dto/response/WorkloadSummaryDTO.java
package com.college.timetable.dto.response;

import lombok.Data;

@Data
public class WorkloadSummaryDTO {
    private Long facultyId;
    private String facultyName;
    private int assignedHours;
    private int maxHours;
    private int remainingHours;
}