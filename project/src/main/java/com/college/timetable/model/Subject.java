// src/main/java/com/college/timetable/model/Subject.java
package com.college.timetable.model;

import jakarta.persistence.*;

@Entity

public class Subject {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String subjectName;
    private String subjectCode;
    private String type; // THEORY / LAB / ELECTIVE / PROJECT
    private Integer theoryHrsPerWeek;
    private Integer labHrsPerWeek;

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSubjectName() {
        return this.subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getSubjectCode() {
        return this.subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getTheoryHrsPerWeek() {
        return this.theoryHrsPerWeek;
    }

    public void setTheoryHrsPerWeek(Integer theoryHrsPerWeek) {
        this.theoryHrsPerWeek = theoryHrsPerWeek;
    }

    public Integer getLabHrsPerWeek() {
        return this.labHrsPerWeek;
    }

    public void setLabHrsPerWeek(Integer labHrsPerWeek) {
        this.labHrsPerWeek = labHrsPerWeek;
    }

    public Subject() {
    }

    public Subject(Long id, String subjectName, String subjectCode, String type, Integer theoryHrsPerWeek, Integer labHrsPerWeek) {
        this.id = id;
        this.subjectName = subjectName;
        this.subjectCode = subjectCode;
        this.type = type;
        this.theoryHrsPerWeek = theoryHrsPerWeek;
        this.labHrsPerWeek = labHrsPerWeek;
    }
}