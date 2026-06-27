// src/main/java/com/college/timetable/dto/request/SemesterRequest.java
package com.college.timetable.dto.request;


public class SemesterRequest {
    private Integer semesterNumber;
    private Long programId;

    public Integer getSemesterNumber() {
        return this.semesterNumber;
    }

    public void setSemesterNumber(Integer semesterNumber) {
        this.semesterNumber = semesterNumber;
    }

    public Long getProgramId() {
        return this.programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public SemesterRequest() {
    }

    public SemesterRequest(Integer semesterNumber, Long programId) {
        this.semesterNumber = semesterNumber;
        this.programId = programId;
    }
}