// src/main/java/com/college/timetable/model/SubjectAllocation.java
package com.college.timetable.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SubjectAllocation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "section_id")
    private Section section;

    @ManyToOne
    @JoinColumn(name = "semester_id")
    private Semester semester;

    private String session; // e.g. "2026-ODD"
}