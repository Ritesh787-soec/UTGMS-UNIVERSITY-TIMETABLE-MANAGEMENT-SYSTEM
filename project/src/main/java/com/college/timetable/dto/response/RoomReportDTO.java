// src/main/java/com/college/timetable/dto/response/RoomReportDTO.java
package com.college.timetable.dto.response;

import lombok.Data;

@Data
public class RoomReportDTO {
    private String roomNumber;
    private String type;
    private Integer capacity;
    private int occupiedSlots;
    private int totalSlots;
    private double utilizationPercent;
}