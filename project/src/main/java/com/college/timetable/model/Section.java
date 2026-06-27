// src/main/java/com/college/timetable/model/Section.java
package com.college.timetable.model;

import jakarta.persistence.*;

@Entity

public class Section {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Integer studentStrength;

    @ManyToOne
    @JoinColumn(name = "semester_id")
    private Semester semester;

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getStudentStrength() {
        return this.studentStrength;
    }

    public void setStudentStrength(Integer studentStrength) {
        this.studentStrength = studentStrength;
    }

    public Semester getSemester() {
        return this.semester;
    }

    public void setSemester(Semester semester) {
        this.semester = semester;
    }

    public Section() {
    }

    public Section(Long id, String name, Integer studentStrength, Semester semester) {
        this.id = id;
        this.name = name;
        this.studentStrength = studentStrength;
        this.semester = semester;
    }
}