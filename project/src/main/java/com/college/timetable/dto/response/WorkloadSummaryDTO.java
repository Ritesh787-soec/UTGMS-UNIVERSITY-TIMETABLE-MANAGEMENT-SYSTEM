// src/main/java/com/college/timetable/dto/response/WorkloadSummaryDTO.java
package com.college.timetable.dto.response;


public class WorkloadSummaryDTO {
    private Long facultyId;
    private String facultyName;
    private int assignedHours;
    private int maxHours;
    private int remainingHours;

    public Long getFacultyId() {
        return this.facultyId;
    }

    public void setFacultyId(Long facultyId) {
        this.facultyId = facultyId;
    }

    public String getFacultyName() {
        return this.facultyName;
    }

    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }

    public int getAssignedHours() {
        return this.assignedHours;
    }

    public void setAssignedHours(int assignedHours) {
        this.assignedHours = assignedHours;
    }

    public int getMaxHours() {
        return this.maxHours;
    }

    public void setMaxHours(int maxHours) {
        this.maxHours = maxHours;
    }

    public int getRemainingHours() {
        return this.remainingHours;
    }

    public void setRemainingHours(int remainingHours) {
        this.remainingHours = remainingHours;
    }

    public WorkloadSummaryDTO() {
    }

    public WorkloadSummaryDTO(Long facultyId, String facultyName, int assignedHours, int maxHours, int remainingHours) {
        this.facultyId = facultyId;
        this.facultyName = facultyName;
        this.assignedHours = assignedHours;
        this.maxHours = maxHours;
        this.remainingHours = remainingHours;
    }
}