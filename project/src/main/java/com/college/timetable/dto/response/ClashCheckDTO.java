// src/main/java/com/college/timetable/dto/response/ClashCheckDTO.java
package com.college.timetable.dto.response;



public class ClashCheckDTO {
    private boolean valid;
    private String reason;

    public boolean isValid() {
        return this.valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getReason() {
        return this.reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public ClashCheckDTO() {
    }

    public ClashCheckDTO(boolean valid, String reason) {
        this.valid = valid;
        this.reason = reason;
    }
}