// src/main/java/com/college/timetable/model/Subject.java
package com.college.timetable.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Subject {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String subjectName;
    private String subjectCode;
    private String type; // THEORY / LAB / ELECTIVE / PROJECT
    private Integer theoryHrsPerWeek;
    private Integer labHrsPerWeek;
}