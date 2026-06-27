package com.college.timetable.dto.request;


public class MoveEntryRequest {
    private String newDay;
    private int newSlot;

    public String getNewDay() {
        return this.newDay;
    }

    public void setNewDay(String newDay) {
        this.newDay = newDay;
    }

    public int getNewSlot() {
        return this.newSlot;
    }

    public void setNewSlot(int newSlot) {
        this.newSlot = newSlot;
    }

    public MoveEntryRequest() {
    }

    public MoveEntryRequest(String newDay, int newSlot) {
        this.newDay = newDay;
        this.newSlot = newSlot;
    }
}