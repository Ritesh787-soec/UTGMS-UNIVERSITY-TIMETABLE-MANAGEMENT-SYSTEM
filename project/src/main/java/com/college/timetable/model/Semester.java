// src/main/java/com/college/timetable/model/Semester.java
package com.college.timetable.model;

import jakarta.persistence.*;

@Entity

public class Semester {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer semesterNumber;

    @ManyToOne
    @JoinColumn(name = "program_id")
    private Program program;

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSemesterNumber() {
        return this.semesterNumber;
    }

    public void setSemesterNumber(Integer semesterNumber) {
        this.semesterNumber = semesterNumber;
    }

    public Program getProgram() {
        return this.program;
    }

    public void setProgram(Program program) {
        this.program = program;
    }

    public Semester() {
    }

    public Semester(Long id, Integer semesterNumber, Program program) {
        this.id = id;
        this.semesterNumber = semesterNumber;
        this.program = program;
    }
}