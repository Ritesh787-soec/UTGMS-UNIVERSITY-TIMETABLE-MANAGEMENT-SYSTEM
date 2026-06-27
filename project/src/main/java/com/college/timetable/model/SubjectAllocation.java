// src/main/java/com/college/timetable/model/SubjectAllocation.java
package com.college.timetable.model;

import jakarta.persistence.*;

@Entity

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

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Faculty getFaculty() {
        return this.faculty;
    }

    public void setFaculty(Faculty faculty) {
        this.faculty = faculty;
    }

    public Subject getSubject() {
        return this.subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public Section getSection() {
        return this.section;
    }

    public void setSection(Section section) {
        this.section = section;
    }

    public Semester getSemester() {
        return this.semester;
    }

    public void setSemester(Semester semester) {
        this.semester = semester;
    }

    public String getSession() {
        return this.session;
    }

    public void setSession(String session) {
        this.session = session;
    }

    public SubjectAllocation() {
    }

    public SubjectAllocation(Long id, Faculty faculty, Subject subject, Section section, Semester semester, String session) {
        this.id = id;
        this.faculty = faculty;
        this.subject = subject;
        this.section = section;
        this.semester = semester;
        this.session = session;
    }
}