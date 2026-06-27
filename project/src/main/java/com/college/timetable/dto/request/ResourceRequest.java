// src/main/java/com/college/timetable/dto/request/ResourceRequest.java
package com.college.timetable.dto.request;


public class ResourceRequest {
    private String roomNumber;
    private String type;
    private Integer capacity;

    public String getRoomNumber() {
        return this.roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getCapacity() {
        return this.capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public ResourceRequest() {
    }

    public ResourceRequest(String roomNumber, String type, Integer capacity) {
        this.roomNumber = roomNumber;
        this.type = type;
        this.capacity = capacity;
    }
}