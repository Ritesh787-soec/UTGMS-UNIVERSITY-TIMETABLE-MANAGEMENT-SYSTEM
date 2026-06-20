// src/main/java/com/college/timetable/model/Semester.java
package com.college.timetable.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Semester {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer semesterNumber;

    @ManyToOne
    @JoinColumn(name = "program_id")
    private Program program;
}