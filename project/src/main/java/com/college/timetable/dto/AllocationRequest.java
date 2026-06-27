// src/main/java/com/college/timetable/dto/AllocationRequest.java
// NOTE: stays in the ROOT dto package (not dto.request) -- this is
// exactly where AllocationService.java already imports it from.
package com.college.timetable.dto;


public class AllocationRequest {
    private Long facultyId;
    private Long subjectId;
    private Long sectionId;
    private String session;

    public Long getFacultyId() {
        return this.facultyId;
    }

    public void setFacultyId(Long facultyId) {
        this.facultyId = facultyId;
    }

    public Long getSubjectId() {
        return this.subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
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

    public AllocationRequest() {
    }

    public AllocationRequest(Long facultyId, Long subjectId, Long sectionId, String session) {
        this.facultyId = facultyId;
        this.subjectId = subjectId;
        this.sectionId = sectionId;
        this.session = session;
    }
}