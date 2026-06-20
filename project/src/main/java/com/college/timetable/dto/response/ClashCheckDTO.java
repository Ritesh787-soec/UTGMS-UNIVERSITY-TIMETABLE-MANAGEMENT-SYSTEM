// src/main/java/com/college/timetable/dto/response/ClashCheckDTO.java
package com.college.timetable.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ClashCheckDTO {
    private boolean valid;
    private String reason;
}