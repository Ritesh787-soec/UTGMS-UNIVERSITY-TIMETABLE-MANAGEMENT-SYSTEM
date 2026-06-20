// src/main/java/com/college/timetable/dto/request/SemesterRequest.java
package com.college.timetable.dto.request;

import lombok.Data;

@Data
public class SemesterRequest {
    private Integer semesterNumber;
    private Long programId;
}