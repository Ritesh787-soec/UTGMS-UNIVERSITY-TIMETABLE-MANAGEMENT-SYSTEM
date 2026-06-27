// src/main/java/com/college/timetable/dto/request/SubjectRequest.java
package com.college.timetable.dto.request;


public class SubjectRequest {
    private String subjectName;
    private String subjectCode;
    private String type;
    private Integer theoryHrsPerWeek;
    private Integer labHrsPerWeek;

    public String getSubjectName() {
        return this.subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getSubjectCode() {
        return this.subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getTheoryHrsPerWeek() {
        return this.theoryHrsPerWeek;
    }

    public void setTheoryHrsPerWeek(Integer theoryHrsPerWeek) {
        this.theoryHrsPerWeek = theoryHrsPerWeek;
    }

    public Integer getLabHrsPerWeek() {
        return this.labHrsPerWeek;
    }

    public void setLabHrsPerWeek(Integer labHrsPerWeek) {
        this.labHrsPerWeek = labHrsPerWeek;
    }

    public SubjectRequest() {
    }

    public SubjectRequest(String subjectName, String subjectCode, String type, Integer theoryHrsPerWeek, Integer labHrsPerWeek) {
        this.subjectName = subjectName;
        this.subjectCode = subjectCode;
        this.type = type;
        this.theoryHrsPerWeek = theoryHrsPerWeek;
        this.labHrsPerWeek = labHrsPerWeek;
    }
}