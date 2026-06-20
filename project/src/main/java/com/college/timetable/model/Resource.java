// src/main/java/com/college/timetable/model/Resource.java
package com.college.timetable.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Resource {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String roomNumber;
    private String type; // CLASSROOM / LAB / LT
    private Integer capacity;
    private boolean active = true;
}