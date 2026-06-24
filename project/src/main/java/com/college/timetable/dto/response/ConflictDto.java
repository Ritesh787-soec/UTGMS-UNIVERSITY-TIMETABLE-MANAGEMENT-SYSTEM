package com.college.timetable.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConflictDto {
    private String subjectName;
    private String sectionName;
    private String conflictMessage;
}