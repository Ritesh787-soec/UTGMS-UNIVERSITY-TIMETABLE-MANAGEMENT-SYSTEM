// src/main/java/com/college/timetable/dto/request/SubjectRequest.java
package com.college.timetable.dto.request;

import lombok.Data;

@Data
public class SubjectRequest {
    private String subjectName;
    private String subjectCode;
    private String type;
    private Integer theoryHrsPerWeek;
    private Integer labHrsPerWeek;
}