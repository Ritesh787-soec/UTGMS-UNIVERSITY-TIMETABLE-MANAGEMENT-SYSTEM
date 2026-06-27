// src/main/java/com/college/timetable/dto/response/RoomReportDTO.java
package com.college.timetable.dto.response;


public class RoomReportDTO {
    private String roomNumber;
    private String type;
    private Integer capacity;
    private int occupiedSlots;
    private int totalSlots;
    private double utilizationPercent;

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

    public int getOccupiedSlots() {
        return this.occupiedSlots;
    }

    public void setOccupiedSlots(int occupiedSlots) {
        this.occupiedSlots = occupiedSlots;
    }

    public int getTotalSlots() {
        return this.totalSlots;
    }

    public void setTotalSlots(int totalSlots) {
        this.totalSlots = totalSlots;
    }

    public double getUtilizationPercent() {
        return this.utilizationPercent;
    }

    public void setUtilizationPercent(double utilizationPercent) {
        this.utilizationPercent = utilizationPercent;
    }

    public RoomReportDTO() {
    }

    public RoomReportDTO(String roomNumber, String type, Integer capacity, int occupiedSlots, int totalSlots, double utilizationPercent) {
        this.roomNumber = roomNumber;
        this.type = type;
        this.capacity = capacity;
        this.occupiedSlots = occupiedSlots;
        this.totalSlots = totalSlots;
        this.utilizationPercent = utilizationPercent;
    }
}