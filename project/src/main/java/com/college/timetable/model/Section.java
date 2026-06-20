// src/main/java/com/college/timetable/model/Section.java
package com.college.timetable.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Section {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Integer studentStrength;

    @ManyToOne
    @JoinColumn(name = "semester_id")
    private Semester semester;
}