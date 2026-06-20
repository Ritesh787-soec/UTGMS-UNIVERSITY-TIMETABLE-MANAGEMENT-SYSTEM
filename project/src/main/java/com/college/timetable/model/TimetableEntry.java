// src/main/java/com/college/timetable/model/TimetableEntry.java
package com.college.timetable.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
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
}