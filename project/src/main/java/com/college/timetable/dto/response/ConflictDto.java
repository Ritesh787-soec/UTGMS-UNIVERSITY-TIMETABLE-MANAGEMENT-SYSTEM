package com.college.timetable.dto.response;




public class ConflictDto {
    private String subjectName;
    private String sectionName;
    private String conflictMessage;

    public String getSubjectName() {
        return this.subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getSectionName() {
        return this.sectionName;
    }

    public void setSectionName(String sectionName) {
        this.sectionName = sectionName;
    }

    public String getConflictMessage() {
        return this.conflictMessage;
    }

    public void setConflictMessage(String conflictMessage) {
        this.conflictMessage = conflictMessage;
    }

    public ConflictDto() {
    }

    public ConflictDto(String subjectName, String sectionName, String conflictMessage) {
        this.subjectName = subjectName;
        this.sectionName = sectionName;
        this.conflictMessage = conflictMessage;
    }
}