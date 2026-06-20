// src/main/java/com/college/timetable/dto/response/GenerationResultDto.java
package com.college.timetable.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class GenerationResultDto {
    private String status;
    private int totalPlaced;
    private int conflictsFound;
    private List<ConflictDto> conflicts;
}