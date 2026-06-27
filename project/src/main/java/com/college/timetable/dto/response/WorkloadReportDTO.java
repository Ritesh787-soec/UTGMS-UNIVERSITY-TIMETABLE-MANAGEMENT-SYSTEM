// src/main/java/com/college/timetable/dto/response/WorkloadReportDTO.java
package com.college.timetable.dto.response;


public class WorkloadReportDTO {
    private String facultyName;
    private String designation;
    private int assignedHours;
    private int maxHours;
    private double utilizationPercent;

    public String getFacultyName() {
        return this.facultyName;
    }

    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }

    public String getDesignation() {
        return this.designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
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

    public double getUtilizationPercent() {
        return this.utilizationPercent;
    }

    public void setUtilizationPercent(double utilizationPercent) {
        this.utilizationPercent = utilizationPercent;
    }

    public WorkloadReportDTO() {
    }

    public WorkloadReportDTO(String facultyName, String designation, int assignedHours, int maxHours, double utilizationPercent) {
        this.facultyName = facultyName;
        this.designation = designation;
        this.assignedHours = assignedHours;
        this.maxHours = maxHours;
        this.utilizationPercent = utilizationPercent;
    }
}