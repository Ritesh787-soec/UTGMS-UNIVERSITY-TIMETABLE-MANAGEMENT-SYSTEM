// src/main/java/com/college/timetable/dto/request/ResourceRequest.java
package com.college.timetable.dto.request;

import lombok.Data;

@Data
public class ResourceRequest {
    private String roomNumber;
    private String type;
    private Integer capacity;
}