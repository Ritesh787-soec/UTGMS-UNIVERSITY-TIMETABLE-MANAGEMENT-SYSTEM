// src/main/java/com/college/timetable/model/TimetableVersion.java
package com.college.timetable.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity

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

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSectionId() {
        return this.sectionId;
    }

    public void setSectionId(Long sectionId) {
        this.sectionId = sectionId;
    }

    public String getSession() {
        return this.session;
    }

    public void setSession(String session) {
        this.session = session;
    }

    public int getVersionNumber() {
        return this.versionNumber;
    }

    public void setVersionNumber(int versionNumber) {
        this.versionNumber = versionNumber;
    }

    public String getSnapshotJson() {
        return this.snapshotJson;
    }

    public void setSnapshotJson(String snapshotJson) {
        this.snapshotJson = snapshotJson;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public TimetableVersion() {
    }

    public TimetableVersion(Long id, Long sectionId, String session, int versionNumber, String snapshotJson, LocalDateTime createdAt) {
        this.id = id;
        this.sectionId = sectionId;
        this.session = session;
        this.versionNumber = versionNumber;
        this.snapshotJson = snapshotJson;
        this.createdAt = createdAt;
    }
}