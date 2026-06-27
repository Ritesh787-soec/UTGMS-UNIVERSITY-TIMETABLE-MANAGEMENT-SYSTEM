// src/main/java/com/college/timetable/model/TimetableEntry.java
package com.college.timetable.model;

import jakarta.persistence.*;

@Entity

public class TimetableEntry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "section_id")
    private Section section;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Resource room;

    @ManyToOne
    @JoinColumn(name = "semester_id")
    private Semester semester;

    private String session;
    private String dayOfWeek;
    private Integer slotNumber;
    private boolean locked = false;

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Section getSection() {
        return this.section;
    }

    public void setSection(Section section) {
        this.section = section;
    }

    public Subject getSubject() {
        return this.subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public Faculty getFaculty() {
        return this.faculty;
    }

    public void setFaculty(Faculty faculty) {
        this.faculty = faculty;
    }

    public Resource getRoom() {
        return this.room;
    }

    public void setRoom(Resource room) {
        this.room = room;
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

    public String getDayOfWeek() {
        return this.dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public Integer getSlotNumber() {
        return this.slotNumber;
    }

    public void setSlotNumber(Integer slotNumber) {
        this.slotNumber = slotNumber;
    }

    public boolean isLocked() {
        return this.locked;
    }

    public void setLocked(boolean locked) {
        this.locked = locked;
    }

    public TimetableEntry() {
    }

    public TimetableEntry(Long id, Section section, Subject subject, Faculty faculty, Resource room, Semester semester, String session, String dayOfWeek, Integer slotNumber, boolean locked) {
        this.id = id;
        this.section = section;
        this.subject = subject;
        this.faculty = faculty;
        this.room = room;
        this.semester = semester;
        this.session = session;
        this.dayOfWeek = dayOfWeek;
        this.slotNumber = slotNumber;
        this.locked = locked;
    }
}