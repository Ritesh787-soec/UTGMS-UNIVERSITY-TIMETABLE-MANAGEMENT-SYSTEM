// src/main/java/com/college/timetable/model/TimetableVersion.java
package com.college.timetable.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class TimetableVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long sectionId;
    private String session;
    private int versionNumber;

    @Column(columnDefinition = "TEXT")
    private String snapshotJson;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}