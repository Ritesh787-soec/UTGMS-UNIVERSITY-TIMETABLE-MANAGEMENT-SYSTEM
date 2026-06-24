package com.college.timetable.model;

import jakarta.persistence.*;
import java.time.LocalTime;
import lombok.Data;

@Data
@Entity
@Table(name = "faculties")
public class Faculty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "faculty_id")
    private Long id;

    @Column(name = "employee_code", unique = true, nullable = false)
    private String employeeCode;

    @Column(name = "faculty_name", nullable = false)
    private String name;
    private String email;
    private String designation;
    private Integer maxHoursPerWeek;

    @Column(name = "workload_hours")
    private Integer workloadHours;

    @Column(name = "working_days")
    private Integer working_days;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    private String status = "Active";

    // Standard Boilerplate: Generate Getters, Setters, and Constructors here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Integer getWorkloadHours() {
        return workloadHours;
    }

    public void setWorkloadHours(Integer workloadHours) {
        this.workloadHours = workloadHours;
    }

    public Integer getWorking_days() {
        return working_days;
    }

    public void setWorking_days(Integer working_days) {
        this.working_days = working_days;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}