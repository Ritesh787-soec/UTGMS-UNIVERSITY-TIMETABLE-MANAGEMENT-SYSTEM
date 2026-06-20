// src/main/java/com/college/timetable/model/Faculty.java
package com.college.timetable.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Faculty {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @Column(unique = true)
    private String email; // MUST match the linked User's login email exactly

    private String designation; // ASST_PROF, ASSOC_PROF, PROF, TEACHING_ASSOCIATE
    private Integer maxHoursPerWeek;
    private String workingDays; // "MON,TUE,WED,THU,FRI"
}