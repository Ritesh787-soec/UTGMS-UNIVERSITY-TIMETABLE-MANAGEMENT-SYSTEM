// src/main/java/com/college/timetable/dto/AllocationRequest.java
// NOTE: stays in the ROOT dto package (not dto.request) -- this is
// exactly where AllocationService.java already imports it from.
package com.college.timetable.dto;

import lombok.Data;

@Data
public class AllocationRequest {
    private Long facultyId;
    private Long subjectId;
    private Long sectionId;
    private String session;
}