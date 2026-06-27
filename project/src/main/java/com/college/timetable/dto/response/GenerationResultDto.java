// src/main/java/com/college/timetable/dto/GenerationResultDto.java
package com.college.timetable.dto.response;



import java.util.List;

public class GenerationResultDto {
    private String status;
    private int totalPlaced;
    private int conflictsFound;
    private List<ConflictDto> conflicts;

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getTotalPlaced() {
        return this.totalPlaced;
    }

    public void setTotalPlaced(int totalPlaced) {
        this.totalPlaced = totalPlaced;
    }

    public int getConflictsFound() {
        return this.conflictsFound;
    }

    public void setConflictsFound(int conflictsFound) {
        this.conflictsFound = conflictsFound;
    }

    public List<ConflictDto> getConflicts() {
        return this.conflicts;
    }

    public void setConflicts(List<ConflictDto> conflicts) {
        this.conflicts = conflicts;
    }

    public GenerationResultDto() {
    }

    public GenerationResultDto(String status, int totalPlaced, int conflictsFound, List<ConflictDto> conflicts) {
        this.status = status;
        this.totalPlaced = totalPlaced;
        this.conflictsFound = conflictsFound;
        this.conflicts = conflicts;
    }
}